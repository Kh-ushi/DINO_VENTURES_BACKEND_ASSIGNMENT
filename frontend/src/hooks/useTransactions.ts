import { useState, useCallback } from "react";
import type { Transaction } from "@/types/wallet";

// In-memory transaction store (would come from API in production)
let transactionStore: Transaction[] = [];

/** Demo seed transactions */
const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: "txn-seed-001",
    type: "topup",
    amount: "500.00",
    description: "Initial deposit",
    status: "success",
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    balanceAfter: "500.00",
  },
  {
    id: "txn-seed-002",
    type: "spend",
    amount: "45.99",
    description: "Cloud hosting",
    status: "success",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    balanceAfter: "454.01",
  },
  {
    id: "txn-seed-003",
    type: "topup",
    amount: "200.00",
    description: "Monthly top-up",
    status: "success",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    balanceAfter: "654.01",
  },
  {
    id: "txn-seed-004",
    type: "spend",
    amount: "12.50",
    description: "API subscription",
    status: "success",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    balanceAfter: "641.51",
  },
  {
    id: "txn-seed-005",
    type: "spend",
    amount: "1500.00",
    description: "Over-limit attempt",
    status: "failed",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    balanceAfter: "641.51",
  },
];

if (transactionStore.length === 0) {
  transactionStore = [...SEED_TRANSACTIONS];
}

export function useTransactions() {
  const [, setTick] = useState(0);

  const addTransaction = useCallback((txn: Transaction) => {
    transactionStore = [txn, ...transactionStore];
    setTick((t) => t + 1);
  }, []);

  return {
    transactions: transactionStore,
    addTransaction,
  };
}
