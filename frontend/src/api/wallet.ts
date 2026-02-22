import { api} from "./client";
import type { WalletResponse, WalletData } from "@/types/wallet";
import { v4 as uuidv4 } from "uuid";

export async function getWallets(){
  const { data } = await api.get("/wallets");
  return data;
}

export const topUpWallet = async (
  walletId: string,
  amount: string
) => {
  const res = await api.post(
    `/wallets/${walletId}/topup`,
    { amount },
    {
      headers: {
        "Idempotency-Key": uuidv4(),
      },
    }
  );
  return res.data;
};

export const spendWallet = async (
  walletId: string,
  amount: string
) => {
  const res = await api.post(
    `/wallets/${walletId}/spend`,
    { amount },
    {
      headers: {
        "Idempotency-Key": uuidv4(),
      },
    }
  );
  return res.data;
};
