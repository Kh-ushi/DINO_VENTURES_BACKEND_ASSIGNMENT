import { prisma } from "./setup";

import { spendFromWallet, topUpWallet } from "../src/modules/wallet/wallet.service";


describe("Wallet Integration", () => {
    it("should deduct balance correctly", async () => {

        const asset = await prisma.assetType.create({
            data: { name: "Gold Coins" },
        });

        const wallet = await prisma.wallet.create({
            data: {
                assetTypeId: asset.id,
                currentBalance: BigInt(100),
            },
        });

        const result = await spendFromWallet(
            wallet.id,
            BigInt(30),
            "test-key-1"
        );

        expect(result.success).toBe(true);
        expect(result.newBalance).toBe("70");

        const updatedWallet = await prisma.wallet.findUnique({
            where: { id: wallet.id },
        });

        expect(updatedWallet?.currentBalance.toString()).toBe("70");

    });

    it("should throw error when balance is insufficient", async () => {
        const asset = await prisma.assetType.create({
            data: { name: "Gold Coins" },
        });

        const wallet = await prisma.wallet.create({
            data: {
                assetTypeId: asset.id,
                currentBalance: BigInt(20),
            },
        });

        await expect(
            spendFromWallet(wallet.id, BigInt(50), "test-key-2")
        ).rejects.toThrow();

        const unchangedWallet = await prisma.wallet.findUnique({
            where: { id: wallet.id },
        });

        expect(unchangedWallet?.currentBalance.toString()).toBe("20");
    });


    it("should not deduct twice with same idempotency key", async () => {
        const asset = await prisma.assetType.create({
            data: { name: "Gold Coins" },
        });

        const wallet = await prisma.wallet.create({
            data: {
                assetTypeId: asset.id,
                currentBalance: BigInt(100),
            },
        });

        const first = await spendFromWallet(
            wallet.id,
            BigInt(30),
            "same-key"
        );

        const second = await spendFromWallet(
            wallet.id,
            BigInt(30),
            "same-key"
        );

        expect(first.transactionId).toBe(second.transactionId);

        const updatedWallet = await prisma.wallet.findUnique({
            where: { id: wallet.id },
        });

        expect(updatedWallet?.currentBalance.toString()).toBe("70");

        const ledgerEntries = await prisma.ledgerEntry.findMany({
            where: { walletId: wallet.id },
        });

        expect(ledgerEntries.length).toBe(1);
    });

    it("should create double entry for topup", async () => {
        const asset = await prisma.assetType.create({
            data: { name: "Gold Coins" },
        });

        const treasury = await prisma.wallet.create({
            data: {
                assetTypeId: asset.id,
                currentBalance: BigInt(1000),
            },
        });

        const userWallet = await prisma.wallet.create({
            data: {
                assetTypeId: asset.id,
                currentBalance: BigInt(100),
            },
        });

        await topUpWallet(userWallet.id, BigInt(50), "topup-key");

        const ledgerEntries = await prisma.ledgerEntry.findMany();

        expect(ledgerEntries.length).toBe(2);

        const userLedger = ledgerEntries.find(
            (l) => l.walletId === userWallet.id
        );
        const treasuryLedger = ledgerEntries.find(
            (l) => l.walletId === treasury.id
        );

        expect(userLedger?.amount.toString()).toBe("50");
        expect(treasuryLedger?.amount.toString()).toBe("-50");
    });

    it("ledger movements should correctly reflect balance change", async () => {
        const asset = await prisma.assetType.create({
            data: { name: "Gold Coins" },
        });

        const wallet = await prisma.wallet.create({
            data: {
                assetTypeId: asset.id,
                currentBalance: BigInt(100),
            },
        });

        await spendFromWallet(wallet.id, BigInt(30), "ledger-check");

        const ledgerSum = await prisma.ledgerEntry.aggregate({
            where: { walletId: wallet.id },
            _sum: { amount: true },
        });

        const updatedWallet = await prisma.wallet.findUnique({
            where: { id: wallet.id },
        });

        const expectedBalance =
            BigInt(100) + (ledgerSum._sum.amount || BigInt(0));

        expect(updatedWallet?.currentBalance.toString()).toBe(
            expectedBalance.toString()
        );
    });

    it("should handle concurrent spends safely", async () => {
        const asset = await prisma.assetType.create({
            data: { name: "Gold Coins" },
        });

        const wallet = await prisma.wallet.create({
            data: {
                assetTypeId: asset.id,
                currentBalance: BigInt(100),
            },
        });

        const requests = Array.from({ length: 5 }).map((_, i) =>
            spendFromWallet(
                wallet.id,
                BigInt(30),
                `concurrency-key-${i}`
            ).catch((err) => err)
        );

        const results = await Promise.all(requests);

        const successCount = results.filter(
            (r: any) => r?.success === true
        ).length;

        const updatedWallet = await prisma.wallet.findUnique({
            where: { id: wallet.id },
        });

        expect(successCount).toBe(3);

        expect(updatedWallet?.currentBalance.toString()).toBe("10");

        expect(BigInt(updatedWallet!.currentBalance)).toBeGreaterThanOrEqual(
            BigInt(0)
        );


    });
})