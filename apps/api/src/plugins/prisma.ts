import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export async function connectPrisma() {
  try {
    await prisma.$connect();
    console.log('[Prisma] Database connection initialized successfully.');
  } catch (error) {
    console.error('[Prisma] Failed to connect to database:', error);
  }
}
