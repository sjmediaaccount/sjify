import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../plugins/prisma.js';

export async function storageRoutes(server: FastifyInstance) {
  // List Datasets
  server.get(
    '/datasets',
    {
      schema: {
        description: 'Get list of datasets',
        tags: ['Storage'],
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const datasets = await prisma.dataset.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 50,
      });

      return reply.send({ items: datasets });
    }
  );

  // Get Dataset items
  server.get(
    '/datasets/:id/items',
    {
      schema: {
        description: 'Get paginated items from a dataset',
        tags: ['Storage'],
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string' } },
        },
        querystring: {
          type: 'object',
          properties: {
            limit: { type: 'integer', default: 50 },
            offset: { type: 'integer', default: 0 },
            format: { type: 'string', default: 'json' }, // json, csv, etc.
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const query = request.query as { limit?: number; offset?: number; format?: string };
      const limit = Number(query.limit) || 50;
      const offset = Number(query.offset) || 0;

      const dataset = await prisma.dataset.findUnique({
        where: { id },
        include: {
          items: {
            take: limit,
            skip: offset,
            orderBy: { itemIndex: 'asc' },
          },
        },
      });

      if (!dataset) {
        return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Dataset not found' });
      }

      const parsedItems = dataset.items.map((i) => {
        try {
          return JSON.parse(i.data);
        } catch {
          return i.data;
        }
      });

      // If CSV format requested
      if (query.format === 'csv' && parsedItems.length > 0) {
        const headers = Array.from(new Set(parsedItems.flatMap((item) => (typeof item === 'object' && item ? Object.keys(item) : []))));
        const csvRows = [headers.join(',')];
        for (const item of parsedItems) {
          const row = headers.map((h) => {
            const val = item[h] !== undefined ? String(item[h]).replace(/"/g, '""') : '';
            return `"${val}"`;
          });
          csvRows.push(row.join(','));
        }
        reply.header('Content-Type', 'text/csv');
        reply.header('Content-Disposition', `attachment; filename="${id}.csv"`);
        return reply.send(csvRows.join('\n'));
      }

      return reply.send({
        datasetId: dataset.id,
        name: dataset.name,
        totalItems: dataset.itemCount,
        offset,
        limit,
        items: parsedItems,
      });
    }
  );

  // List Key-Value Stores
  server.get(
    '/key-value-stores',
    {
      schema: {
        description: 'Get list of Key-Value Stores',
        tags: ['Storage'],
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const stores = await prisma.keyValueStore.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 50,
      });

      return reply.send({ items: stores });
    }
  );

  // List Request Queues
  server.get(
    '/request-queues',
    {
      schema: {
        description: 'Get list of Request Queues',
        tags: ['Storage'],
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const queues = await prisma.requestQueue.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 50,
      });

      return reply.send({ items: queues });
    }
  );
}
