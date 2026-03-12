import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['query', 'error', 'warn'],
    datasourceUrl: process.env.DATABASE_URL,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export async function withDbRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn()
    } catch (error: unknown) {
      const isPoolExhausted =
        error instanceof Error &&
        (error.message.includes('MaxClientsInSessionMode') ||
         error.message.includes('Connection pool timeout') ||
         error.message.includes('Can\'t reach database server'))
      if (isPoolExhausted && i < retries) {
        await new Promise((r) => setTimeout(r, 100 * (i + 1)))
        continue
      }
      throw error
    }
  }
  throw new Error('Unreachable')
}