import { z } from "zod";

export const amountSchema =z.object({
  amount: z
    .string()
    .refine((val) => {
      try {
        const parsed = BigInt(val);
        return parsed > 0n;
      } catch {
        return false;
      }
    }, {
      message: "Amount must be a positive integer",
    }),
});