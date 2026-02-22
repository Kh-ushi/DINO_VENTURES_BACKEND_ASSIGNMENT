import { useWalletStore } from "@/store/useWalletStore";
import { TransactionBadge } from "@/components/TransactionBadge";
import { formatCurrency, formatDate } from "@/utils/constants";
import { TrendingUp, TrendingDown, Receipt } from "lucide-react";

export default function Transactions() {
  const { ledgerEntries } = useWalletStore();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Transactions
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Full history of your wallet activity
        </p>
      </div>

      <div className="glass-card rounded-xl fade-in">
        {ledgerEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Receipt className="mb-3 h-12 w-12 opacity-30" />
            <p className="text-sm font-medium">No transactions yet</p>
            <p className="mt-1 text-xs">
              Your transaction history will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {ledgerEntries.map((txn) => {
              const isTopUp = txn.type === "TOPUP" || txn.type === "BONUS";
              const isSpend = txn.type === "SPEND";

              return (
                <div
                  key={txn.id}
                  className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${isTopUp
                          ? "bg-primary/10 text-primary"
                          : "bg-warning/10 text-warning"
                        }`}
                    >
                      {isTopUp ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {txn.type === "TOPUP" && "Top Up"}
                        {txn.type === "SPEND" && "Payment"}
                        {txn.type === "BONUS" && "Bonus Credit"}
                      </p>

                      <div className="mt-0.5 flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                          {formatDate(txn.createdAt)}
                        </p>
                        <span className="text-muted-foreground/30">·</span>
                        <p className="text-xs text-muted-foreground font-mono">
                          {txn.id.slice(0, 12)}…
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <TransactionBadge
                      variant={
                        txn.status === "SUCCESS" ? "success" : "failed"
                      }
                    >
                      {txn.status === "SUCCESS" ? "Success" : "Failed"}
                    </TransactionBadge>

                    <span
                      className={`min-w-[80px] text-right text-sm font-semibold ${isTopUp
                          ? "text-primary"
                          : "text-foreground"
                        }`}
                    >
                      {isTopUp ? "+" : ""}
                      {formatCurrency(Number(txn.amount))}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}