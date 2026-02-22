import { create } from "zustand";

/* ===============================
   Backend Ledger Entry Shape
================================ */

interface BackendLedgerEntry {
  id: string;
  amount: string; // BigInt from backend comes as string
  createdAt: string;
  transaction: {
    type: "TOPUP" | "SPEND" | "BONUS";
    status:string
  };
}

/* ===============================
   Frontend Ledger Entry
================================ */

interface LedgerEntry {
  id: string;
  amount: string;
  type: "TOPUP" | "SPEND" | "BONUS";
  status:string;
  createdAt: string;
}

/* ===============================
   Store State
================================ */

interface WalletState {
  selectedUserId: string | null;
  selectedUserEmail: string | null;
  selectedWalletId: string | null;

  assetType: string | null;
  currentBalance: number;
  ledgerEntries: LedgerEntry[];

  setUser: (userId: string,email:string) => void;

  setWallet: (
    walletId: string,
    balance: number,
    assetType: string
  ) => void;

  setLedgerEntries: (entries: BackendLedgerEntry[]) => void;

  clearSelection: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  selectedUserId: null,
  selectedWalletId: null,
  selectedUserEmail: null,

  assetType: null,
  currentBalance: 0,
  ledgerEntries: [],

  setUser: (userId,email) =>
    set({
      selectedUserId: userId,
      selectedWalletId: null,
      selectedUserEmail: email,
      assetType: null,
      currentBalance: 0,
      ledgerEntries: [],
    }),

  setWallet: (walletId, balance, assetType) =>
    set({
      selectedWalletId: walletId,
      currentBalance: balance,
      assetType,
    }),

  setLedgerEntries: (entries) =>
    set({
      ledgerEntries: entries.map((entry) => ({
        id: entry.id,
        amount: entry.amount,
        type: entry.transaction.type,
        status:entry.transaction.status,
        createdAt: entry.createdAt,
      })),
    }),

  clearSelection: () =>
    set({
      selectedUserId: null,
      selectedWalletId: null,
      assetType: null,
      selectedUserEmail: null,
      currentBalance: 0,
      ledgerEntries: [],
    }),
}));