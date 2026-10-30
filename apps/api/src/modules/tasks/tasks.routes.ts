import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../plugins/prisma.js';
import { CreateTaskSchema } from '@sjify/shared';

export async function tasksRoutes(server: FastifyInstance) {
  // List tasks
  server.get(
    '/',
    {
      schema: {
        description: 'Get list of saved Actor tasks',
        tags: ['Tasks'],
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const tasks = await prisma.actorTask.findMany({
        orderBy: { updatedAt: 'desc' },
        include: {
          actor: { select: { id: true, name: true, slug: true, username: true } },
        },
      });

      return reply.send({
        items: tasks.map((t) => ({
          id: t.id,
          actorId: t.actorId,
          actorName: t.actor.name,
          name: t.name,
          description: t.description,
          inputJson: JSON.parse(t.inputJson || '{}'),
          memoryMbytes: t.memoryMbytes,
          timeoutSecs: t.timeoutSecs,
          buildTag: t.buildTag,
          lastRunId: t.lastRunId,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        })),
      });
    }
  );

  // Create task
  server.post(
    '/',
    {
      schema: {
        description: 'Create a reusable saved task for an Actor',
        tags: ['Tasks'],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body as { actorId: string } & Record<string, unknown>;
      const parsed = CreateTaskSchema.safeParse(body);
      if (!parsed.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: parsed.error.issues[0]?.message || 'Invalid task input',
        });
      }

      const actor = await prisma.actor.findUnique({ where: { id: body.actorId } });
      if (!actor) {
        return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Actor not found' });
      }

      const task = await prisma.actorTask.create({
        data: {
          orgId: actor.orgId,
          userId: actor.userId,
          actorId: actor.id,
          name: parsed.data.name,
          description: parsed.data.description,
          inputJson: JSON.stringify(parsed.data.inputJson || {}),
          memoryMbytes: parsed.data.memoryMbytes,
          timeoutSecs: parsed.data.timeoutSecs,
          buildTag: parsed.data.buildTag,
        },
      });

      return reply.status(201).send({
        success: true,
        task,
      });
    }
  );
}
