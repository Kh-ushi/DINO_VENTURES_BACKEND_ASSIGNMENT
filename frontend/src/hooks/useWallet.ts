import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWallets, topUpWallet, spendWallet as spendFromWallet } from "@/api/wallet";
import { WALLET_ID } from "@/utils/constants";
import { useToast } from "@/hooks/use-toast";
import type { Transaction } from "@/types/wallet";
import { useTransactions } from "./useTransactions";

export const useWallets = () => {
  return useQuery({
    queryKey: ["wallets"],
    queryFn: getWallets
  });
};

export function useTopUp() {
  // const queryClient = useQueryClient();
  // const { toast } = useToast();
  // const { addTransaction } = useTransactions();

  // return useMutation({
  //   mutationFn: ({ amount, description }: { amount: string; description?: string }) =>
  //     topUpWallet(WALLET_ID, amount, description),
  //   onSuccess: (data, variables) => {
  //     queryClient.invalidateQueries({ queryKey: WALLET_KEY });
  //     addTransaction({
  //       id: data.transactionId || crypto.randomUUID(),
  //       type: "topup",
  //       amount: variables.amount,
  //       description: variables.description,
  //       status: data.success ? "success" : "failed",
  //       timestamp: new Date().toISOString(),
  //       balanceAfter: data.newBalance,
  //     });
  //     toast({
  //       title: "Top up successful",
  //       description: `Added $${variables.amount} to your wallet.`,
  //     });
  //   },
  //   onError: (error: Error) => {
  //     toast({
  //       title: "Top up failed",
  //       description: error.message,
  //       variant: "destructive",
  //     });
  //   },
  // });
}

export function useSpend() {
  // const queryClient = useQueryClient();
  // const { toast } = useToast();
  // const { addTransaction } = useTransactions();

  // return useMutation({
  //   mutationFn: ({ amount, description }: { amount: string; description?: string }) =>
  //     spendFromWallet(WALLET_ID, amount, description),
  //   onSuccess: (data, variables) => {
  //     queryClient.invalidateQueries({ queryKey: WALLET_KEY });
  //     addTransaction({
  //       id: data.transactionId || crypto.randomUUID(),
  //       type: "spend",
  //       amount: variables.amount,
  //       description: variables.description,
  //       status: data.success ? "success" : "failed",
  //       timestamp: new Date().toISOString(),
  //       balanceAfter: data.newBalance,
  //     });
  //     toast({
  //       title: "Payment successful",
  //       description: `Spent $${variables.amount} from your wallet.`,
  //     });
  //   },
  //   onError: (error: Error) => {
  //     toast({
  //       title: "Payment failed",
  //       description: error.message,
  //       variant: "destructive",
  //     });
  //   },
  // });
}
