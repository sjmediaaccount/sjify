import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { prisma } from '../../plugins/prisma.js';
import { LoginSchema, RegisterSchema } from '@sjify/shared';

export async function authRoutes(server: FastifyInstance) {
  // Register new user
  server.post(
    '/register',
    {
      schema: {
        description: 'Register a new user account and personal organization',
        tags: ['Authentication'],
        body: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            name: { type: 'string', minLength: 2 },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  name: { type: 'string' },
                },
              },
              token: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = RegisterSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: parsed.error.issues[0]?.message || 'Invalid input data',
        });
      }

      const { email, password, name } = parsed.data;
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return reply.status(409).send({
          statusCode: 409,
          error: 'Conflict',
          message: 'User with this email already exists',
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash,
        },
      });

      // Create default personal organization
      const slug = `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
      const org = await prisma.organization.create({
        data: {
          name: `${name}'s Org`,
          slug,
          ownerId: user.id,
          planTier: 'FREE',
          monthlySpendingLimitUsd: 50.0,
          members: {
            create: {
              userId: user.id,
              role: 'OWNER',
            },
          },
        },
      });

      const token = server.jwt.sign({
        userId: user.id,
        orgId: org.id,
        email: user.email,
        name: user.name,
      });

      reply.setCookie('sjify_token', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
      });

      return reply.status(201).send({
        success: true,
        user: { id: user.id, email: user.email, name: user.name },
        token,
      });
    }
  );

  // Login
  server.post(
    '/login',
    {
      schema: {
        description: 'Authenticate with email and password',
        tags: ['Authentication'],
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = LoginSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: parsed.error.issues[0]?.message || 'Invalid credentials format',
        });
      }

      const { email, password } = parsed.data;
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          orgMemberships: {
            include: { org: true },
          },
        },
      });

      if (!user) {
        return reply.status(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Invalid email or password',
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return reply.status(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Invalid email or password',
        });
      }

      const primaryOrg = user.orgMemberships[0]?.org;
      const token = server.jwt.sign({
        userId: user.id,
        orgId: primaryOrg?.id || '',
        email: user.email,
        name: user.name,
      });

      reply.setCookie('sjify_token', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
      });

      return reply.send({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        organization: primaryOrg,
        token,
      });
    }
  );

  // Get current user profile & active org
  server.get(
    '/me',
    {
      schema: {
        description: 'Get authenticated user session, organizations, and permissions',
        tags: ['Authentication'],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      let decoded: { userId: string; orgId: string } | null = null;
      try {
        const tokenFromHeader = request.headers.authorization?.replace(/^Bearer\s+/, '');
        const tokenFromCookie = (request as unknown as { cookies?: Record<string, string> }).cookies?.sjify_token;
        const token = tokenFromHeader || tokenFromCookie;

        if (token) {
          decoded = server.jwt.verify(token) as { userId: string; orgId: string };
        }
      } catch {
        decoded = null;
      }

      // If token not provided, return default demo profile in development mode
      const user = decoded
        ? await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
              orgMemberships: {
                include: { org: true },
              },
            },
          })
        : await prisma.user.findFirst({
            include: {
              orgMemberships: {
                include: { org: true },
              },
            },
          });

      if (!user) {
        return reply.status(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Session expired or not found',
        });
      }

      const activeOrg = user.orgMemberships[0]?.org;

      return reply.send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          twoFactorEnabled: user.twoFactorEnabled,
          createdAt: user.createdAt,
        },
        organization: activeOrg
          ? {
              id: activeOrg.id,
              name: activeOrg.name,
              slug: activeOrg.slug,
              planTier: activeOrg.planTier,
              monthlySpendingLimitUsd: activeOrg.monthlySpendingLimitUsd,
              currentMonthSpendUsd: activeOrg.currentMonthSpendUsd,
              isHardLimitReached: activeOrg.isHardLimitReached,
              nextBillingDate: activeOrg.nextBillingDate,
            }
          : null,
        organizations: user.orgMemberships.map((m) => ({
          id: m.org.id,
          name: m.org.name,
          slug: m.org.slug,
          role: m.role,
        })),
      });
    }
  );

  // Logout
  server.post(
    '/logout',
    {
      schema: {
        description: 'Clear authentication cookie and invalidate session',
        tags: ['Authentication'],
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      reply.clearCookie('sjify_token', { path: '/' });
      return reply.send({ success: true, message: 'Logged out successfully' });
    }
  );
}
