import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { withRetry } from "../../utils/withRetry";

const prisma = new PrismaClient();

export async function spendFromWallet(
    walletId: string,
    amount: bigint,
    idempotencyKey: string) {

    return withRetry(async () =>
        prisma.$transaction(async (tx) => {

            const existing = await tx.transaction.findUnique({
                where: { idempotencyKey },
                include: {
                    ledgerEntries: true,
                },
            });

            if (existing) {
                const ledger = existing.ledgerEntries[0];
                const wallet = await tx.wallet.findUnique({
                    where: { id: walletId }
                });

                if (!wallet) {
                    throw new Error("Wallet not found");
                }

                return {
                    success: true,
                    newBalance: wallet.currentBalance,
                    transactionId: existing.id,
                    message: "Idempotent replay",
                };
            }

            const lockedWallet = await tx.$queryRaw<any[]>`
     SELECT *FROM "Wallet"
     WHERE id=${walletId}
     FOR UPDATE
     `
            if (!lockedWallet.length) {
                throw new Error("Wallet not found");
            }

            const wallet = lockedWallet[0];
            if (wallet.currentBalance < amount) {
                throw new Error("Insufficient balance");
            }

            const transaction = await tx.transaction.create({
                data: {
                    type: "SPEND",
                    status: "SUCCESS",
                    idempotencyKey
                }
            });

            await tx.ledgerEntry.create({
                data: {
                    transactionId: transaction.id,
                    walletId: walletId,
                    amount: -amount,
                },
            });

            const updatedWallet = await tx.wallet.update({
                where: { id: walletId },
                data: {
                    currentBalance: wallet.currentBalance - amount,
                },
            });

            return {
                success: true,
                newBalance: updatedWallet.currentBalance,
                transactionId: transaction.id,
            };

        })
    );
};

export async function topUpWallet(
    walletId: string,
    amount: bigint,
    idempotencyKey: string
) {
    return withRetry(async () =>
        prisma.$transaction(async (tx) => {

            const existing = await tx.transaction.findUnique({
                where: { idempotencyKey },
            });

            if (existing) {
                const wallet = await tx.wallet.findUnique({
                    where: { id: walletId }
                });
                if (!wallet) {
                    throw new Error("Wallet not found");
                }
                return {
                    success: true,
                    transactionId: existing.id,
                    newBalance: wallet.currentBalance,
                    message: "Idempotent replay",
                };
            }

            const treasury = await tx.wallet.findFirst({
                where: { userId: null },
            });

            if (!treasury) {
                throw new Error("Treasury wallet not found");
            }

            const userWallet = await tx.wallet.findUnique({
                where: { id: walletId },
            });

            if (!userWallet) {
                throw new Error("User wallet not found");
            }

            // Lock wallets in sorted order (deadlock prevention)//
            const walletIds = [treasury.id, walletId].sort();

            await tx.$queryRaw`
            SELECT * FROM "Wallet"
            WHERE id IN (${walletIds[0]}, ${walletIds[1]})
            FOR UPDATE
            `
            //--------------------------------------------------//

            const transaction = await tx.transaction.create({
                data: {
                    type: "TOPUP",
                    status: "SUCCESS",
                    idempotencyKey,
                },
            });

            await tx.ledgerEntry.createMany({
                data: [
                    {
                        transactionId: transaction.id,
                        walletId: treasury.id,
                        amount: -amount,
                    },
                    {
                        transactionId: transaction.id,
                        walletId,
                        amount: amount,
                    }
                ]
            });

            await tx.wallet.update({
                where: { id: treasury.id },
                data: {
                    currentBalance: treasury.currentBalance - amount,
                },
            });

            const updatedUser = await tx.wallet.update({
                where: { id: walletId },
                data: {
                    currentBalance: userWallet.currentBalance + amount,
                },
            });


            return {
                success: true,
                transactionId: transaction.id,
                newBalance: updatedUser.currentBalance
            };

        })
    );
}

export async function bonusWallet(
    walletId: string,
    amount: bigint,
    idempotencyKey: string
) {
    return withRetry(async () =>
        prisma.$transaction(async (tx) => {
            const existing = await tx.transaction.findUnique({
                where: { idempotencyKey },
            });

            if (existing) {
                const wallet = await tx.wallet.findUnique({
                    where: { id: walletId }
                });
                if (!wallet) {
                    throw new Error("Wallet not found");
                }
                return {
                    success: true,
                    transactionId: existing.id,
                    newBalance: wallet.currentBalance,
                    message: "Idempotent replay",
                };
            }

            const treasury = await tx.wallet.findFirst({
                where: { userId: null },
            });

            if (!treasury) throw new Error("Treasury not found");


            const userWallet = await tx.wallet.findUnique({
                where: { id: walletId },
            });

            if (!userWallet) throw new Error("User wallet not found");

            const walletIds = [treasury.id, walletId].sort();

            await tx.$queryRaw`
        SELECT * FROM "Wallet"
        WHERE id IN (${walletIds[0]}, ${walletIds[1]})
        FOR UPDATE
      `;

            const transaction = await tx.transaction.create({
                data: {
                    type: "BONUS",
                    status: "SUCCESS",
                    idempotencyKey,
                },
            });


            await tx.ledgerEntry.createMany({
                data: [
                    {
                        transactionId: transaction.id,
                        walletId: treasury.id,
                        amount: -amount,
                    },
                    {
                        transactionId: transaction.id,
                        walletId,
                        amount: amount,
                    },
                ],
            });

            await tx.wallet.update({
                where: { id: treasury.id },
                data: {
                    currentBalance: treasury.currentBalance - amount,
                },
            });

            const updatedUser = await tx.wallet.update({
                where: { id: walletId },
                data: {
                    currentBalance: userWallet.currentBalance + amount,
                },
            });

            return {
                success: true,
                transactionId: transaction.id,
                newBalance: updatedUser.currentBalance
            };

        })
    );

}