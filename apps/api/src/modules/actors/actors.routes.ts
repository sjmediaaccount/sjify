import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../plugins/prisma.js';
import { CreateActorSchema } from '@sjify/shared';

export async function actorsRoutes(server: FastifyInstance) {
  // List Actors (User / Org)
  server.get(
    '/',
    {
      schema: {
        description: 'Get list of Actors with filtering, pagination, and search',
        tags: ['Actors'],
        querystring: {
          type: 'object',
          properties: {
            search: { type: 'string' },
            limit: { type: 'integer', default: 20 },
            offset: { type: 'integer', default: 0 },
            visibility: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const query = request.query as { search?: string; limit?: number; offset?: number; visibility?: string };
      const limit = Number(query.limit) || 20;
      const offset = Number(query.offset) || 0;

      const whereClause: Record<string, unknown> = {};
      if (query.search) {
        whereClause.OR = [
          { name: { contains: query.search } },
          { description: { contains: query.search } },
        ];
      }
      if (query.visibility) {
        whereClause.visibility = query.visibility;
      }

      const [totalCount, actors] = await Promise.all([
        prisma.actor.count({ where: whereClause }),
        prisma.actor.findMany({
          where: whereClause,
          take: limit,
          skip: offset,
          orderBy: { statsRunsTotal: 'desc' },
          include: {
            versions: {
              where: { versionTag: 'latest' },
              take: 1,
            },
          },
        }),
      ]);

      return reply.send({
        total: totalCount,
        count: actors.length,
        offset,
        limit,
        items: actors.map((actor) => ({
          id: actor.id,
          name: actor.name,
          slug: actor.slug,
          username: actor.username,
          description: actor.description,
          visibility: actor.visibility,
          pricingModel: actor.pricingModel,
          priceUsd: actor.priceUsd,
          ratingAvg: actor.ratingAvg,
          ratingCount: actor.ratingCount,
          statsRunsTotal: actor.statsRunsTotal,
          statsUsersTotal: actor.statsUsersTotal,
          defaultMemoryMbytes: actor.defaultMemoryMbytes,
          defaultTimeoutSecs: actor.defaultTimeoutSecs,
          createdAt: actor.createdAt,
          updatedAt: actor.updatedAt,
        })),
      });
    }
  );

  // Get Store catalog
  server.get(
    '/store',
    {
      schema: {
        description: 'Get public marketplace Store Actors with category and rating filters',
        tags: ['Store'],
        querystring: {
          type: 'object',
          properties: {
            category: { type: 'string' },
            search: { type: 'string' },
            sort: { type: 'string', default: 'popular' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const query = request.query as { category?: string; search?: string; sort?: string };
      const whereClause: Record<string, unknown> = { visibility: 'PUBLIC' };

      if (query.search) {
        whereClause.OR = [
          { name: { contains: query.search } },
          { description: { contains: query.search } },
        ];
      }

      const orderBy: Record<string, string> =
        query.sort === 'rating'
          ? { ratingAvg: 'desc' }
          : query.sort === 'newest'
          ? { createdAt: 'desc' }
          : { statsRunsTotal: 'desc' };

      const actors = await prisma.actor.findMany({
        where: whereClause,
        orderBy,
        take: 50,
      });

      return reply.send({
        items: actors,
        categories: [
          'AI & LLMs',
          'Lead Generation',
          'E-Commerce',
          'Social Media',
          'Real Estate',
          'Jobs & Recruiting',
          'SEO & Tools',
          'News & Media',
          'Developer Tools',
          'Other',
        ],
      });
    }
  );

  // Get Actor detail by ID or username/slug
  server.get(
    '/:id',
    {
      schema: {
        description: 'Get complete Actor details including README, versions, and INPUT_SCHEMA',
        tags: ['Actors'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };

      const actor = await prisma.actor.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
        include: {
          versions: {
            orderBy: { createdAt: 'desc' },
          },
          reviews: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { id: true, name: true, avatarUrl: true } } },
          },
        },
      });

      if (!actor) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: `Actor '${id}' not found`,
        });
      }

      const currentVersion = actor.versions.find((v) => v.versionTag === 'latest') || actor.versions[0];

      return reply.send({
        id: actor.id,
        name: actor.name,
        slug: actor.slug,
        username: actor.username,
        description: actor.description,
        readmeMarkdown: actor.readmeMarkdown,
        visibility: actor.visibility,
        pricingModel: actor.pricingModel,
        priceUsd: actor.priceUsd,
        ratingAvg: actor.ratingAvg,
        ratingCount: actor.ratingCount,
        statsRunsTotal: actor.statsRunsTotal,
        statsUsersTotal: actor.statsUsersTotal,
        defaultMemoryMbytes: actor.defaultMemoryMbytes,
        defaultTimeoutSecs: actor.defaultTimeoutSecs,
        restartPolicy: actor.restartPolicy,
        currentVersion: currentVersion
          ? {
              id: currentVersion.id,
              versionTag: currentVersion.versionTag,
              dockerfileContent: currentVersion.dockerfileContent,
              actorJson: JSON.parse(currentVersion.actorJson || '{}'),
              inputSchemaJson: JSON.parse(currentVersion.inputSchemaJson || '{}'),
            }
          : null,
        versions: actor.versions.map((v) => ({
          id: v.id,
          versionTag: v.versionTag,
          createdAt: v.createdAt,
        })),
        reviews: actor.reviews,
      });
    }
  );

  // Create new Actor
  server.post(
    '/',
    {
      schema: {
        description: 'Create a new Actor with default template files',
        tags: ['Actors'],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = CreateActorSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: parsed.error.issues[0]?.message || 'Invalid Actor configuration',
        });
      }

      const user = await prisma.user.findFirst({
        include: { orgMemberships: { include: { org: true } } },
      });
      if (!user) {
        return reply.status(401).send({ statusCode: 401, error: 'Unauthorized', message: 'User not found' });
      }

      const orgId = user.orgMemberships[0]?.orgId || '';
      const { name, slug, description, visibility, pricingModel, priceUsd, defaultMemoryMbytes, defaultTimeoutSecs } =
        parsed.data;

      const actor = await prisma.actor.create({
        data: {
          orgId,
          userId: user.id,
          name,
          slug,
          username: user.email.split('@')[0] || 'developer',
          description,
          readmeMarkdown: `# ${name}\n\n${description || 'A powerful automated web scraper built on SJify.'}\n\n### How to Run\nProvide the required input parameters and click Start.`,
          visibility,
          pricingModel,
          priceUsd,
          defaultMemoryMbytes,
          defaultTimeoutSecs,
          versions: {
            create: {
              versionTag: 'latest',
              dockerfileContent: `FROM node:20-alpine\nWORKDIR /usr/src/app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nCMD ["node", "src/main.js"]`,
              actorJson: JSON.stringify({
                actorSpecification: 1,
                name: slug,
                title: name,
                description,
                version: '1.0.0',
              }),
              inputSchemaJson: JSON.stringify({
                title: `${name} Input Schema`,
                type: 'object',
                schemaVersion: 1,
                properties: {
                  startUrls: {
                    title: 'Start URLs',
                    type: 'array',
                    description: 'List of target URLs to scrape',
                    editor: 'globs',
                    prefill: [{ url: 'https://news.ycombinator.com' }],
                  },
                  maxItems: {
                    title: 'Max Items to Scrape',
                    type: 'integer',
                    description: 'Maximum number of items to collect',
                    default: 50,
                  },
                },
                required: ['startUrls'],
              }),
            },
          },
        },
        include: { versions: true },
      });

      return reply.status(201).send({
        success: true,
        actor,
      });
    }
  );
}
