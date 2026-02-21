import { Request, Response } from "express";
import { spendFromWallet, topUpWallet,bonusWallet } from "./wallet.service";

interface SpendParams {
    walletId: string;
}

interface SpendBody {
    amount: string;
}

export async function spendHandler(req: Request<SpendParams, {}, SpendBody>, res: Response) {
    try {
        const { walletId } = req.params;
        const { amount } = req.body;
        const idempotencyKey = req.header("Idempotency-Key");

        if (!idempotencyKey) {
            return res.status(400).json({
                error: "Idempotency-Key header required",
            });
        }

        const result = await spendFromWallet(
            walletId,
            BigInt(amount),
            idempotencyKey
        );

        res.json({
            success: result.success,
            transactionId: result.transactionId,
            newBalance: result.newBalance.toString()
        });
    }
    catch (err: unknown) {

        if (err instanceof Error) {
            if (err.message === "Insufficient balance") {
                return res.status(409).json({ error: err.message });
            }
            return res.status(400).json({ error: err.message || "Something went wrong" });
        }

        res.status(500).json({ error: "Internal server error" });
    }
}

interface TopUpParams {
    walletId: string;
}

interface TopUpBody {
    amount: string;
}

export async function topUpHandler(req: Request<TopUpParams, {}, TopUpBody>, res: Response) {
    try {
        const { walletId } = req.params;
        const { amount } = req.body;
        const idempotencyKey = req.header("Idempotency-Key");

        if (!idempotencyKey) {
            return res.status(400).json({
                error: "Idempotency-Key header required",
            });
        }

        const result = await topUpWallet(
            walletId,
            BigInt(amount),
            idempotencyKey
        );

        res.json({
            sucess: result.success,
            transactionId: result.transactionId,
            newBalance: result.newBalance.toString()
        })


    }
    catch (err: unknown) {
        if (err instanceof Error) {
            if (err.message === "Insufficient balance") {
                return res.status(409).json({ error: err.message });
            }
            return res.status(400).json({ error: err.message || "Something went wrong" });
        }

        res.status(500).json({ error: "Internal server error" });
    }
}

interface BonusParams {
    walletId: string;
}

interface BonusBody {
    amount: string;
}


export async function bonusHandler(req: Request<BonusParams, {}, BonusBody>, res: Response) {
    try {
        const { walletId } = req.params;
        const { amount } = req.body;
        const idempotencyKey = req.header("Idempotency-Key");

        if (!idempotencyKey) {
            return res.status(400).json({
                error: "Idempotency-Key header required",
            });
        }

        const result = await bonusWallet(
            walletId,
            BigInt(amount),
            idempotencyKey
        );

        res.json({
            success: result.success,
            transactionId: result.transactionId,
            newBalance: result.newBalance.toString()
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}