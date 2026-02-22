import { useWallets } from "@/hooks/useWallet";
import { formatCurrency, formatDate } from "@/utils/constants";
import { StatCard } from "@/components/StatCard";
import { Wallet, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useWalletStore } from "@/store/useWalletStore";

export default function Dashboard() {
  const { data: walletData, isLoading, isError } = useWallets();

  const {
    selectedUserId,
    selectedWalletId,
    currentBalance,
    ledgerEntries,
    assetType,
    setUser,
    setWallet,
    setLedgerEntries,
  } = useWalletStore();

  /* -------------------------------
     Derive Selected User
  --------------------------------*/
  const selectedUser = walletData?.users?.find(
    (u) => u.id === selectedUserId
  );

  /* -------------------------------
     Auto Select First Wallet
  --------------------------------*/
  useEffect(() => {
    if (
      selectedUser &&
      selectedUser.wallets.length > 0 &&
      !selectedWalletId
    ) {
      const firstWallet = selectedUser.wallets[0];

      setWallet(
        firstWallet.id,
        Number(firstWallet.currentBalance || 0),
        firstWallet?.assetType?.name || "Gold Coins"
      );

      setLedgerEntries(firstWallet.ledgerEntries || []);
    }
  }, [selectedUser, selectedWalletId]);

  /* -------------------------------
     Stats From Ledger Entries
  --------------------------------*/
  const totalTopUps = ledgerEntries
    .filter((t) => t.type === "TOPUP")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalSpent = ledgerEntries
    .filter((t) => t.type === "SPEND")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalBonus = ledgerEntries
    .filter((t) => t.type === "BONUS")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const recentTxns = ledgerEntries.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* -------------------------------
           Page Header
      --------------------------------*/}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your wallet activity
        </p>
      </div>

      {/* -------------------------------
           User Select
      --------------------------------*/}
      <div className="flex flex-wrap gap-4">
        <select
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          value={selectedUserId || ""}
          onChange={(e) => setUser(e.target.value)}
        >
          <option value="">Select User</option>
          {walletData?.users?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>
      </div>

      {/* -------------------------------
           Balance Card
      --------------------------------*/}
      <div className="balance-gradient rounded-2xl p-6 text-primary-foreground shadow-lg">
        <p className="text-sm font-medium opacity-80">
          Current Balance
        </p>

        {isLoading ? (
          <Skeleton className="mt-2 h-10 w-48 bg-primary-foreground/20" />
        ) : isError ? (
          <p className="mt-2 text-3xl font-bold">
            {formatCurrency(0)}
          </p>
        ) : (
          <p className="mt-2 text-4xl font-bold tracking-tight">
            {formatCurrency(currentBalance,assetType)}
          </p>
        )}

        <p className="mt-2 text-xs opacity-60">
          Wallet ID: {selectedWalletId || "Select wallet"}
        </p>
      </div>

      {/* -------------------------------
           Stats
      --------------------------------*/}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard
          title="Total Top Ups"
          value={formatCurrency(totalTopUps,assetType)}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          title="Total Spent"
          value={formatCurrency(totalSpent,assetType)}
          icon={<TrendingDown className="h-5 w-5" />}
        />
        <StatCard
          title="Total Bonus"
          value={formatCurrency(totalBonus,assetType)}
          icon={<Activity className="h-5 w-5" />}
        />
        <StatCard
          title="Transactions"
          value={ledgerEntries.length.toString()}
          icon={<Wallet className="h-5 w-5" />}
        />
      </div>

      {/* -------------------------------
           Recent Transactions
      --------------------------------*/}
      <div className="glass-card rounded-xl fade-in">
        <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">
            Recent Transactions
          </h2>
        </div>

        {recentTxns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Wallet className="mb-3 h-10 w-10 opacity-30" />
            <p className="text-sm">No transactions yet</p>
            <p className="mt-1 text-xs">
              Top up your wallet to get started
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {recentTxns.map((txn) => {
              const isTopup = txn.type === "TOPUP";
              const isBonus = txn.type === "BONUS";
              const isSpend = txn.type === "SPEND";

              const iconBg = isTopup
                ? "bg-primary/10 text-primary"
                : isBonus
                ? "bg-green-500/10 text-green-500"
                : "bg-warning/10 text-warning";

              return (
                <div
                  key={txn.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${iconBg}`}
                    >
                      {isTopup ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : isBonus ? (
                        <Activity className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {isTopup
                          ? "Top Up"
                          : isBonus
                          ? "Bonus"
                          : "Payment"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(txn.createdAt)}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-sm font-semibold ${
                      isTopup || isBonus
                        ? "text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {(isTopup || isBonus) ? "+" : "-"}
                    {formatCurrency(txn.amount,assetType)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}