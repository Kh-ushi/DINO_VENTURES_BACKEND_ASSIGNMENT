import { Request, Response } from "express";
import { spendFromWallet, topUpWallet, bonusWallet, getWalletBalance,listUsersWithWallets } from "./wallet.service";
import { amountSchema } from "../../utils/validation";
import { AppError } from "../../utils/AppError";
import {serializeBigInt} from "../../utils/bigIntSerializer";


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
            throw new AppError("Idempotency-Key header required", 400);
        }

        const parsedResult = amountSchema.safeParse({ amount });
        if (!parsedResult.success) {
            throw new AppError(parsedResult.error.issues[0].message, 400);
        }

        const parsedAmount = BigInt(parsedResult.data.amount);

        const result = await spendFromWallet(
            walletId,
            parsedAmount,
            idempotencyKey
        );

        res.json({
            
            success: result.success,
            transactionId: result.transactionId,
            newBalance: result.newBalance
        });
    }
    catch (err: unknown) {
        if (err instanceof Error) {
            if (err.message === "Insufficient balance") {
                throw new AppError(err.message, 409);
            }
            throw new AppError(err.message || "Something went wrong", 400);
        }

        throw new AppError("Internal server error", 500);
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
            throw new AppError("Idempotency-Key header required", 400);
        }

        const parsedResult = amountSchema.safeParse({ amount });
        if (!parsedResult.success) {
            throw new AppError(parsedResult.error.issues[0].message, 400);
        }

        const parsedAmount = BigInt(parsedResult.data.amount);

        const result = await topUpWallet(
            walletId,
            parsedAmount,
            idempotencyKey
        );

        res.json({
            success: result.success,
            transactionId: result.transactionId,
            newBalance: result.newBalance
        })


    }
    catch (err: unknown) {
        console.log("TOPUP ERROR",err);
        if (err instanceof Error) {
            if (err.message === "Insufficient balance") {
                throw new AppError(err.message, 409);
            }
            throw new AppError(err.message || "Something went wrong", 400);
        }

        throw new AppError("Internal server error", 500);
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
            throw new AppError("Idempotency-Key header required", 400);
        }

        const parsedResult = amountSchema.safeParse({ amount });
        if (!parsedResult.success) {
            throw new AppError(parsedResult.error.issues[0].message, 400);
        }

        const parsedAmount = BigInt(parsedResult.data.amount);

        const result = await bonusWallet(
            walletId,
            parsedAmount,
            idempotencyKey
        );

        res.json({
            success: result.success,
            transactionId: result.transactionId,
            newBalance: result.newBalance
        });
    } catch (err: any) {
        throw new AppError(err.message || "Something went wrong", 400);
    }
}

interface BalanceParams {
    walletId: string;
}

export async function getBalanceHandler(req: Request<BalanceParams, {}, {}>, res: Response) {
    try {
        const { walletId } = req.params;

        const result = await getWalletBalance(walletId);
        res.json({
            success: true,
            balance: result.toString()
        });
    } catch (err: any) {
        throw new AppError(err.message, 404);
    }
}


export async function getUsersWithWallets(req: Request, res: Response) {
  try {
    const users = await listUsersWithWallets();

     const safeUsers = serializeBigInt(users);

    res.json({
      success: true,
      users:safeUsers,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}