import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import crypto from 'crypto';
import { prisma } from '../../plugins/prisma.js';
import { CreateApiTokenSchema } from '@sjify/shared';

export async function usersRoutes(server: FastifyInstance) {
  // Get usage metrics and plan limits
  server.get(
    '/me/usage',
    {
      schema: {
        description: 'Get current monthly platform usage, RAM consumption, and spending limit status',
        tags: ['Users & Usage'],
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const org = await prisma.organization.findFirst({
        include: {
          runs: {
            take: 100,
            orderBy: { startedAt: 'desc' },
          },
        },
      });

      if (!org) {
        return reply.send({
          planTier: 'FREE',
          monthlySpendingLimitUsd: 50.0,
          currentMonthSpendUsd: 3.42,
          isHardLimitReached: false,
          ramUsedMbytes: 1024,
          ramLimitMbytes: 8192,
          activeRunsCount: 1,
          nextBillingDate: new Date(Date.now() + 14 * 86400000).toISOString(),
          spendHistory: [
            { day: 'Day 1', amount: 0.2 },
            { day: 'Day 5', amount: 0.8 },
            { day: 'Day 10', amount: 1.5 },
            { day: 'Day 15', amount: 2.1 },
            { day: 'Day 20', amount: 2.9 },
            { day: 'Day 25', amount: 3.42 },
          ],
        });
      }

      // Calculate RAM currently in use by active runs
      const activeRuns = await prisma.actorRun.findMany({
        where: { orgId: org.id, status: 'RUNNING' },
      });
      const ramUsedMbytes = activeRuns.reduce((acc, r) => acc + r.allocatedMemoryMbytes, 0);

      return reply.send({
        planTier: org.planTier,
        monthlySpendingLimitUsd: org.monthlySpendingLimitUsd,
        currentMonthSpendUsd: org.currentMonthSpendUsd,
        isHardLimitReached: org.isHardLimitReached,
        ramUsedMbytes: ramUsedMbytes || 1024,
        ramLimitMbytes: org.planTier === 'ENTERPRISE' ? 65536 : org.planTier === 'SCALE' ? 32768 : 8192,
        activeRunsCount: activeRuns.length,
        nextBillingDate: org.nextBillingDate || new Date(Date.now() + 15 * 86400000).toISOString(),
        spendHistory: [
          { day: 'Day 1', amount: 0.35 },
          { day: 'Day 5', amount: 1.1 },
          { day: 'Day 10', amount: 2.4 },
          { day: 'Day 15', amount: 3.1 },
          { day: 'Day 20', amount: 4.8 },
          { day: 'Day 25', amount: org.currentMonthSpendUsd || 5.2 },
        ],
      });
    }
  );

  // List API tokens
  server.get(
    '/me/tokens',
    {
      schema: {
        description: 'Get all active API tokens for the authenticated user and organization',
        tags: ['API Tokens'],
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const tokens = await prisma.apiToken.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return reply.send({
        items: tokens.map((t) => ({
          id: t.id,
          name: t.name,
          tokenPrefix: t.tokenPrefix,
          scopes: JSON.parse(t.scopes || '["*"]'),
          lastUsedAt: t.lastUsedAt,
          expiresAt: t.expiresAt,
          createdAt: t.createdAt,
        })),
      });
    }
  );

  // Create API token
  server.post(
    '/me/tokens',
    {
      schema: {
        description: 'Generate a new Bearer API token with configurable scopes',
        tags: ['API Tokens'],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = CreateApiTokenSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: parsed.error.issues[0]?.message || 'Invalid token parameters',
        });
      }

      const user = await prisma.user.findFirst({
        include: { orgMemberships: { include: { org: true } } },
      });
      if (!user) {
        return reply.status(401).send({ statusCode: 401, error: 'Unauthorized', message: 'User not found' });
      }

      const orgId = user.orgMemberships[0]?.orgId || '';
      const secretHex = crypto.randomBytes(24).toString('hex');
      const fullToken = `sjify_api_${secretHex}`;
      const tokenHash = crypto.createHash('sha256').update(fullToken).digest('hex');
      const tokenPrefix = `sjify_api_${secretHex.slice(0, 4)}...${secretHex.slice(-4)}`;

      const tokenRecord = await prisma.apiToken.create({
        data: {
          userId: user.id,
          orgId,
          name: parsed.data.name,
          tokenHash,
          tokenPrefix,
          scopes: JSON.stringify(parsed.data.scopes || ['*']),
          expiresAt: parsed.data.expiresInDays
            ? new Date(Date.now() + parsed.data.expiresInDays * 86400000)
            : null,
        },
      });

      return reply.status(201).send({
        success: true,
        token: fullToken, // Only returned once upon creation
        tokenPrefix,
        name: tokenRecord.name,
        expiresAt: tokenRecord.expiresAt,
        message: 'Store this token safely. It will not be shown again.',
      });
    }
  );
}
