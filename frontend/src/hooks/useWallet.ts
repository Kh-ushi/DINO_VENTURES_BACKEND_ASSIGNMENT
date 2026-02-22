import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWallets, topUpWallet, spendWallet } from "@/api/wallet";
import { WALLET_ID } from "@/utils/constants";
import { useToast } from "@/hooks/use-toast";
import type { Transaction } from "@/types/wallet";
import { useTransactions } from "./useTransactions";
import { useWalletStore } from "@/store/useWalletStore";

export const useWallets = () => {
  return useQuery({
    queryKey: ["wallets"],
    queryFn: getWallets
  });
};

export const useTopUp = () => {
  const queryClient = useQueryClient();

  const {
    selectedWalletId,
    currentBalance,
    ledgerEntries,
    setWallet,
    setLedgerEntries,
    assetType,
  } = useWalletStore();

  return useMutation({
    mutationFn: async (amount: number) => {
      if (!selectedWalletId)
        throw new Error("No wallet selected");

      return topUpWallet(selectedWalletId, amount.toString());
    },

    onSuccess: (data, amount) => {
      if (!selectedWalletId || !assetType) return;

      setWallet(
        selectedWalletId,
        Number(data.newBalance),
        assetType
      );

      setLedgerEntries([
        {
          id: data.transactionId,
          amount: amount.toString(),
          transaction: {
            type: "TOPUP",
            status: "SUCCESS",
          },
          createdAt: new Date().toISOString(),
        } as any,
        ...ledgerEntries.map((entry) => ({
          id: entry.id,
          amount: entry.amount,
          createdAt: entry.createdAt,
          transaction: {
            type: entry.type,
            status: entry.status,
          },
        })),
      ]);

      // 3️⃣ Invalidate wallet query (safe refresh)
      queryClient.invalidateQueries({
        queryKey: ["wallet", selectedWalletId],
      });

      queryClient.invalidateQueries({
        queryKey: ["transactions", selectedWalletId],
      });
    },
  });
};

export const useSpend = () => {
  const queryClient = useQueryClient();

  const {
    selectedWalletId,
    currentBalance,
    assetType,
    ledgerEntries,
    setWallet,
    setLedgerEntries,
  } = useWalletStore();

  return useMutation({
    mutationFn: async (amount: number) => {
      if (!selectedWalletId)
        throw new Error("No wallet selected");

      return spendWallet(selectedWalletId, amount.toString());
    },

    onSuccess: (data, amount) => {
      if (!selectedWalletId || !assetType) return;

      setWallet(
        selectedWalletId,
        Number(data.newBalance),
        assetType
      );

      setLedgerEntries([
        {
          id: data.transactionId,
          amount: `-${amount}`,
          transaction: {
            type: "SPEND",
            status: "SUCCESS",
          },
          createdAt: new Date().toISOString(),
        } as any,
        ...ledgerEntries.map((entry) => ({
          id: entry.id,
          amount: entry.amount,
          createdAt: entry.createdAt,
          transaction: {
            type: entry.type,
            status: entry.status,
          },
        })),
      ]);

      queryClient.invalidateQueries({
        queryKey: ["wallet", selectedWalletId],
      });

      queryClient.invalidateQueries({
        queryKey: ["transactions", selectedWalletId],
      });
    },
  });
};
