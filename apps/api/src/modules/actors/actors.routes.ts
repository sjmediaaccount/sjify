import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../plugins/prisma.js';
import { CreateActorSchema } from '@sjify/shared';
import { scrapeGoogleMapsPlaces } from './gmaps-scraper.js';

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
      const lookupSlug = id.includes('/') ? id.split('/')[1] : id;

      const actor = await prisma.actor.findFirst({
        where: {
          OR: [{ id }, { slug: id }, { slug: lookupSlug }],
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

  // Helper function to execute/trigger run
  async function triggerRunForActor(actorIdentifier: string, body: any, reply: FastifyReply) {
    const cleanId = actorIdentifier.includes('/') ? actorIdentifier.split('/')[1] : actorIdentifier;
    const actor = await prisma.actor.findFirst({
      where: {
        OR: [{ id: actorIdentifier }, { slug: actorIdentifier }, { slug: cleanId }],
      },
      include: { versions: { where: { versionTag: 'latest' } } },
    });

    if (!actor) {
      return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: `Actor '${actorIdentifier}' not found` });
    }

    const version = actor.versions[0] || (await prisma.actorVersion.findFirst({ where: { actorId: actor.id } }));
    if (!version) {
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: 'No builds found for Actor' });
    }

    // Create dataset & KVS
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

    // Extract input object whether wrapped in { input: {...} } or provided directly
    const runInput = body?.input && typeof body.input === 'object' ? body.input : (body || {});

    await prisma.keyValueRecord.create({
      data: {
        storeId: kvs.id,
        key: 'INPUT',
        contentType: 'application/json',
        valueText: JSON.stringify(runInput),
      },
    });

    // Execute real Google Maps scraper or appropriate runner
    const runStartTime = Date.now();
    let generatedItems: any[] = [];
    if (actor.slug === 'google-maps-extractor') {
      try {
        generatedItems = await scrapeGoogleMapsPlaces(runInput);
      } catch (err: any) {
        request.log?.error?.(err, 'Failed to scrape Google Maps');
        return reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: `Google Maps scraping error: ${err.message}`,
        });
      }
    }

    // Insert items into dataset
    for (let idx = 0; idx < generatedItems.length; idx++) {
      await prisma.datasetItem.create({
        data: {
          datasetId: dataset.id,
          itemIndex: idx,
          data: JSON.stringify(generatedItems[idx]),
        },
      });
    }

    if (generatedItems.length > 0) {
      await prisma.dataset.update({
        where: { id: dataset.id },
        data: {
          itemCount: generatedItems.length,
          totalSizeBytes: JSON.stringify(generatedItems).length,
        },
      });
    }

    const durationSeconds = Math.max(1, Math.round((Date.now() - runStartTime) / 1000));
    const filterDesc = runInput.website === 'withoutWebsite' || runInput.onlyWithoutWebsite === true
      ? ' (without website)'
      : '';
    const locDesc = runInput.locationQuery || 'specified location';

    const run = await prisma.actorRun.create({
      data: {
        actorId: actor.id,
        versionId: version.id,
        orgId: actor.orgId,
        userId: actor.userId,
        status: 'SUCCEEDED',
        origin: body?.origin || 'WEB',
        allocatedMemoryMbytes: actor.defaultMemoryMbytes,
        startedAt: new Date(runStartTime),
        finishedAt: new Date(),
        durationSeconds,
        statusMessage: `Scraped ${generatedItems.length} real Google Maps places for ${locDesc}${filterDesc}.`,
        defaultDatasetId: dataset.id,
        defaultKeyValueStoreId: kvs.id,
        resultsCount: generatedItems.length,
      },
    });

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
      resultsCount: generatedItems.length,
    });
  }

  // Trigger Actor Run by ID or slug (e.g. POST /v1/acts/:id/runs)
  server.post(
    '/:id/runs',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      return triggerRunForActor(id, request.body, reply);
    }
  );

  // Trigger Actor Run by username and slug (e.g. POST /v1/acts/:username/:slug/runs)
  server.post(
    '/:username/:slug/runs',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { slug } = request.params as { username: string; slug: string };
      return triggerRunForActor(slug, request.body, reply);
    }
  );

  // Get Actor detail by username/slug (e.g. GET /v1/acts/:username/:slug)
  server.get(
    '/:username/:slug',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { username, slug } = request.params as { username: string; slug: string };
      const actor = await prisma.actor.findFirst({
        where: {
          OR: [
            { slug },
            { AND: [{ username }, { slug }] },
          ],
        },
        include: {
          versions: { orderBy: { createdAt: 'desc' } },
          reviews: { take: 10, orderBy: { createdAt: 'desc' }, include: { user: { select: { id: true, name: true, avatarUrl: true } } } },
        },
      });

      if (!actor) {
        return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: `Actor '${username}/${slug}' not found` });
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
