import { PrismaClient } from '@prisma/client';

export const prisma: PrismaClient = new PrismaClient();
export function connectDb(): void {
  prisma?.$connect();
}

export async function disconnectDB(): Promise<void> {
  await prisma?.$disconnect();
}
