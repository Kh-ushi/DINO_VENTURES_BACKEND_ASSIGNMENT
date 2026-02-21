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

