import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../plugins/prisma.js';
import { TriggerRunSchema } from '@sjify/shared';

export async function runsRoutes(server: FastifyInstance) {
  // List all runs
  server.get(
    '/',
    {
      schema: {
        description: 'Get list of Actor runs with status filtering and pagination',
        tags: ['Runs'],
        querystring: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            actorId: { type: 'string' },
            limit: { type: 'integer', default: 20 },
            offset: { type: 'integer', default: 0 },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const query = request.query as { status?: string; actorId?: string; limit?: number; offset?: number };
      const limit = Number(query.limit) || 20;
      const offset = Number(query.offset) || 0;

      const whereClause: Record<string, unknown> = {};
      if (query.status) whereClause.status = query.status;
      if (query.actorId) whereClause.actorId = query.actorId;

      const [totalCount, runs] = await Promise.all([
        prisma.actorRun.count({ where: whereClause }),
        prisma.actorRun.findMany({
          where: whereClause,
          take: limit,
          skip: offset,
          orderBy: { startedAt: 'desc' },
          include: {
            actor: { select: { id: true, name: true, slug: true, username: true } },
            task: { select: { id: true, name: true } },
          },
        }),
      ]);

      return reply.send({
        total: totalCount,
        count: runs.length,
        offset,
        limit,
        items: runs.map((run) => ({
          id: run.id,
          actorId: run.actorId,
          actorName: run.actor.name,
          actorSlug: `${run.actor.username}/${run.actor.slug}`,
          taskId: run.taskId,
          taskName: run.task?.name || null,
          status: run.status,
          origin: run.origin,
          allocatedMemoryMbytes: run.allocatedMemoryMbytes,
          startedAt: run.startedAt,
          finishedAt: run.finishedAt,
          durationSeconds: run.durationSeconds,
          chargedUsageUsd: run.chargedUsageUsd,
          resultsCount: run.resultsCount,
          statusMessage: run.statusMessage,
          defaultDatasetId: run.defaultDatasetId,
          defaultKeyValueStoreId: run.defaultKeyValueStoreId,
          defaultRequestQueueId: run.defaultRequestQueueId,
        })),
      });
    }
  );

  // Get specific run detail
  server.get(
    '/:id',
    {
      schema: {
        description: 'Get detailed information for a specific Actor run',
        tags: ['Runs'],
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string' } },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };

      const run = await prisma.actorRun.findUnique({
        where: { id },
        include: {
          actor: true,
          task: true,
          metrics: {
            take: 20,
            orderBy: { timestamp: 'desc' },
          },
        },
      });

      if (!run) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: `Run '${id}' not found`,
        });
      }

      return reply.send({
        id: run.id,
        actorId: run.actorId,
        actorName: run.actor.name,
        actorSlug: `${run.actor.username}/${run.actor.slug}`,
        taskId: run.taskId,
        taskName: run.task?.name || null,
        status: run.status,
        origin: run.origin,
        allocatedMemoryMbytes: run.allocatedMemoryMbytes,
        allocatedCpuQuota: run.allocatedCpuQuota,
        startedAt: run.startedAt,
        finishedAt: run.finishedAt,
        durationSeconds: run.durationSeconds,
        chargedUsageUsd: run.chargedUsageUsd,
        resultsCount: run.resultsCount,
        statusMessage: run.statusMessage,
        containerId: run.containerId,
        containerExitCode: run.containerExitCode,
        defaultDatasetId: run.defaultDatasetId,
        defaultKeyValueStoreId: run.defaultKeyValueStoreId,
        defaultRequestQueueId: run.defaultRequestQueueId,
        metrics: run.metrics,
      });
    }
  );

  // Trigger a new run for an Actor
  server.post(
    '/actors/:actorId/runs',
    {
      schema: {
        description: 'Trigger a new execution of an Actor with input options',
        tags: ['Runs'],
        params: {
          type: 'object',
          required: ['actorId'],
          properties: { actorId: { type: 'string' } },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { actorId } = request.params as { actorId: string };
      const parsed = TriggerRunSchema.safeParse(request.body || {});
      if (!parsed.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: parsed.error.issues[0]?.message || 'Invalid run parameters',
        });
      }

      const actor = await prisma.actor.findFirst({
        where: { OR: [{ id: actorId }, { slug: actorId }] },
        include: { versions: { where: { versionTag: 'latest' } } },
      });

      if (!actor) {
        return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Actor not found' });
      }

      const version = actor.versions[0];
      if (!version) {
        return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: 'No builds found for Actor' });
      }

      // Check organization spending limits
      const org = await prisma.organization.findUnique({ where: { id: actor.orgId } });
      if (org?.isHardLimitReached) {
        return reply.status(402).send({
          statusCode: 402,
          error: 'Payment Required',
          message: 'Monthly platform spending limit reached. Please upgrade your plan or increase your limit.',
        });
      }

      // Create storage instances for this run
      const dataset = await prisma.dataset.create({
        data: {
          orgId: actor.orgId,
          userId: actor.userId,
          name: `Run-${Date.now()}`,
          isNamed: false,
          retentionDays: 7,
        },
      });

      const kvs = await prisma.keyValueStore.create({
        data: {
          orgId: actor.orgId,
          userId: actor.userId,
          name: `Run-${Date.now()}`,
          isNamed: false,
          retentionDays: 7,
        },
      });

      // Save input record in KeyValueStore
      await prisma.keyValueRecord.create({
        data: {
          storeId: kvs.id,
          key: 'INPUT',
          contentType: 'application/json',
          valueText: JSON.stringify(parsed.data.input || {}),
        },
      });

      const memoryMbytes = parsed.data.memoryMbytes || actor.defaultMemoryMbytes;

      const run = await prisma.actorRun.create({
        data: {
          actorId: actor.id,
          versionId: version.id,
          orgId: actor.orgId,
          userId: actor.userId,
          status: 'RUNNING',
          origin: parsed.data.origin || 'WEB',
          allocatedMemoryMbytes: memoryMbytes,
          startedAt: new Date(),
          statusMessage: 'Container initialized, scraping target website...',
          defaultDatasetId: dataset.id,
          defaultKeyValueStoreId: kvs.id,
          resultsCount: 0,
        },
      });

      // Increment actor stats
      await prisma.actor.update({
        where: { id: actor.id },
        data: { statsRunsTotal: { increment: 1 } },
      });

      return reply.status(201).send({
        success: true,
        runId: run.id,
        status: run.status,
        defaultDatasetId: dataset.id,
        defaultKeyValueStoreId: kvs.id,
      });
    }
  );

  // Abort an active run
  server.post(
    '/:id/abort',
    {
      schema: {
        description: 'Abort an active Actor run',
        tags: ['Runs'],
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string' } },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };

      const run = await prisma.actorRun.findUnique({ where: { id } });
      if (!run) {
        return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Run not found' });
      }

      const updated = await prisma.actorRun.update({
        where: { id },
        data: {
          status: 'ABORTED',
          finishedAt: new Date(),
          statusMessage: 'Run aborted by user request.',
        },
      });

      return reply.send({
        success: true,
        runId: updated.id,
        status: updated.status,
      });
    }
  );
}
