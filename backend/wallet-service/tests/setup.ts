import { PrismaClient } from "@prisma/client";

 export const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.ledgerEntry.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.assetType.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});