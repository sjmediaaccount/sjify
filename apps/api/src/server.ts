import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import websocket from '@fastify/websocket';
import dotenv from 'dotenv';
import { connectPrisma, prisma } from './plugins/prisma.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { actorsRoutes } from './modules/actors/actors.routes.js';
import { runsRoutes } from './modules/runs/runs.routes.js';
import { usersRoutes } from './modules/users/users.routes.js';
import { tasksRoutes } from './modules/tasks/tasks.routes.js';
import { storageRoutes } from './modules/storage/storage.routes.js';

dotenv.config();

const server = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'warn',
  },
});

async function main() {
  // Database connection
  await connectPrisma();

  // CORS plugin
  await server.register(cors, {
    origin: true,
    credentials: true,
  });

  // Cookie plugin
  await server.register(cookie, {
    secret: process.env.COOKIE_SECRET || 'sjify_cookie_secret_default_key_32bytes!',
  });

  // JWT plugin
  await server.register(jwt, {
    secret: process.env.JWT_SECRET || 'sjify_jwt_secret_default_key_32bytes_long!',
  });

  // WebSocket plugin for live run logs
  await server.register(websocket);

  // OpenAPI Swagger Documentation
  await server.register(swagger, {
    openapi: {
      info: {
        title: 'SJify API',
        description: 'High-performance REST API & Execution Gateway for containerized Actors, Runs, Tasks, and Storage',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 4000}`,
          description: 'Development Server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT or ApiToken',
          },
        },
      },
    },
  });

  await server.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });

  // Health check endpoint
  server.get('/health', async () => {
    return {
      status: 'ok',
      service: 'sjify-api',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    };
  });

  // Live log streaming WebSocket endpoint
  server.get('/v1/logs/:runId/stream', { websocket: true }, (connection, req) => {
    const { runId } = req.params as { runId: string };
    connection.socket.send(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: `Connected to live stream for run: ${runId}`,
      })
    );

    // Simulate initial logs
    const mockLogs = [
      'Container starting with 1024MB RAM allocation...',
      'Injecting runtime environment variables...',
      'Crawlee CheerioCrawler initialized with 1 concurrency',
      'Target URL: https://news.ycombinator.com',
      'Page crawled successfully. Extracted 30 dataset items.',
      'Saved output to default dataset.',
      'Actor execution completed with status SUCCEEDED (exit code 0).',
    ];

    mockLogs.forEach((log, index) => {
      setTimeout(() => {
        if (connection.socket.readyState === connection.socket.OPEN) {
          connection.socket.send(
            JSON.stringify({
              timestamp: new Date().toISOString(),
              level: index === 0 ? 'INFO' : index === 4 ? 'SUCCESS' : 'INFO',
              message: log,
            })
          );
        }
      }, (index + 1) * 800);
    });
  });

  // Register domain route modules
  await server.register(authRoutes, { prefix: '/v1/auth' });
  await server.register(actorsRoutes, { prefix: '/v1/acts' });
  await server.register(runsRoutes, { prefix: '/v1/actor-runs' });
  await server.register(usersRoutes, { prefix: '/v1/users' });
  await server.register(tasksRoutes, { prefix: '/v1/actor-tasks' });
  await server.register(storageRoutes, { prefix: '/v1' });

  // Streamable HTTP MCP Server endpoint stub
  server.all('/mcp', async (request, reply) => {
    return reply.send({
      mcpServers: {
        sjify: {
          type: 'http',
          url: `http://localhost:${process.env.PORT || 4000}/mcp`,
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {
              'search-actors': { description: 'Search public store actors on SJify' },
              'call-actor': { description: 'Run an actor with custom input parameters' },
              'get-actor-run': { description: 'Inspect run status, duration, and output' },
              'get-dataset-items': { description: 'Retrieve scraped dataset items' },
              'abort-run': { description: 'Abort an active running container' },
            },
          },
        },
      },
    });
  });

  const port = Number(process.env.PORT) || 4000;
  const host = '0.0.0.0';

  try {
    await server.listen({ port, host });
    console.log(`[SJify API] Server running at http://localhost:${port}`);
    console.log(`[SJify API] Swagger OpenAPI documentation available at http://localhost:${port}/docs`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();
