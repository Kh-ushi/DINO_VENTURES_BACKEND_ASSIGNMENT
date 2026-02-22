import { z } from "zod";

// API response schema
export const WalletResponseSchema = z.object({
  success: z.boolean(),
  transactionId: z.string().optional(),
  newBalance: z.string(),
});

export type WalletResponse = z.infer<typeof WalletResponseSchema>;

// Wallet data from GET
export const WalletDataSchema = z.object({
  walletId: z.string(),
  balance: z.string(),
  currency: z.string().default("USD"),
});

export type WalletData = z.infer<typeof WalletDataSchema>;

// Transaction form schemas
export const AmountSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    })
    .refine((val) => Number(val) <= 1_000_000, {
      message: "Amount cannot exceed 1,000,000",
    }),
  description: z.string().max(200, "Description too long").optional(),
});

export type AmountFormData = z.infer<typeof AmountSchema>;

// Transaction record
export interface Transaction {
  id: string;
  type: "topup" | "spend";
  amount: string;
  description?: string;
  status: "success" | "failed";
  timestamp: string;
  balanceAfter: string;
}
