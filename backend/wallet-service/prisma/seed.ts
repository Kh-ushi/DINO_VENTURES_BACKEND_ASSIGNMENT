import "dotenv/config";
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();


async function main() {
    const gold = await prisma.assetType.create({
        data: {
            name: "Gold Coins"
        }
    });

    const treasury = await prisma.wallet.create({
        data: {
            assetTypeId: gold.id,
            currentBalance: BigInt(1000000)
        }
    });

    const user1 = await prisma.user.create({
        data: { email: "user1@example.com" }
    });

    const user2 = await prisma.user.create({
        data: { email: "user2@example.com" }
    });

    await prisma.wallet.create({
        data: {
            userId: user1.id,
            assetTypeId: gold.id,
            currentBalance: BigInt(100)
        }
    });

    await prisma.wallet.create({
        data: {
            userId: user2.id,
            assetTypeId: gold.id,
            currentBalance: BigInt(50)
        }
    });

}


main()
.then(()=>prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });