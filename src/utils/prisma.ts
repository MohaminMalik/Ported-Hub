import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getPrismaClient() {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
  const pool = new Pool(connectionString ? { connectionString } : undefined);
  const adapter = new PrismaPg(pool);
  
  const client = new PrismaClient({
    adapter,
    log: ['query'],
  });
  
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;
  
  return client;
}

// Use a Proxy to lazily instantiate PrismaClient only when it's first used
export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    const client = getPrismaClient();
    return (client as any)[prop];
  }
});
