import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import { connectPrisma, prisma } from '../src/plugins/prisma.js';
import { authRoutes } from '../src/modules/auth/auth.routes.js';
import { actorsRoutes } from '../src/modules/actors/actors.routes.js';
import { runsRoutes } from '../src/modules/runs/runs.routes.js';
import { usersRoutes } from '../src/modules/users/users.routes.js';

describe('SJify API Integration Tests', () => {
  let server: FastifyInstance;

  before(async () => {
    server = Fastify({ logger: false });
    await connectPrisma();
    await server.register(cors);
    await server.register(cookie, { secret: 'test_cookie_secret_key_32bytes_long' });
    await server.register(jwt, { secret: 'test_jwt_secret_key_32bytes_long' });

    server.get('/health', async () => ({ status: 'ok', service: 'sjify-api' }));
    server.all('/mcp', async () => ({
      mcpServers: { sjify: { type: 'http', url: 'http://localhost:4000/mcp' } },
    }));

    await server.register(authRoutes, { prefix: '/v1/auth' });
    await server.register(actorsRoutes, { prefix: '/v1/acts' });
    await server.register(runsRoutes, { prefix: '/v1/actor-runs' });
    await server.register(usersRoutes, { prefix: '/v1/users' });
    await server.ready();
  });

  after(async () => {
    await server.close();
    await prisma.$disconnect();
  });

  test('GET /health returns 200 OK', async () => {
    const res = await server.inject({ method: 'GET', url: '/health' });
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.payload);
    assert.equal(body.status, 'ok');
    assert.equal(body.service, 'sjify-api');
  });

  test('GET /mcp returns streamable MCP server configuration', async () => {
    const res = await server.inject({ method: 'GET', url: '/mcp' });
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.payload);
    assert.ok(body.mcpServers?.sjify);
    assert.equal(body.mcpServers.sjify.type, 'http');
  });

  test('GET /v1/acts/store returns marketplace catalog and categories', async () => {
    const res = await server.inject({ method: 'GET', url: '/v1/acts/store' });
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.payload);
    assert.ok(Array.isArray(body.items));
    assert.ok(Array.isArray(body.categories));
  });

  test('GET /v1/users/me/usage returns monthly quotas and spending limits', async () => {
    const res = await server.inject({ method: 'GET', url: '/v1/users/me/usage' });
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.payload);
    assert.ok(body.planTier);
    assert.ok(body.monthlySpendingLimitUsd > 0);
  });
});
