import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AmountSchema, type AmountFormData } from "@/types/wallet";
import { useSpend } from "@/hooks/useWallet";
import { useWalletStore } from "@/store/useWalletStore";
import { ArrowDownCircle, Loader2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Spend() {
  const { mutate, isPending } = useSpend();

  const {
    assetType,
    currentBalance,
    selectedWalletId,
    selectedUserId,
    selectedUserEmail
  } = useWalletStore();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AmountFormData>({
    resolver: zodResolver(AmountSchema),
  });

  const enteredAmount = Number(watch("amount") || 0);

  const onSubmit = (data: AmountFormData) => {
    const amountNumber = Number(data.amount);

    mutate(amountNumber, {
      onSuccess: () => {
        toast.success("Payment successful");
        reset();
      },
      onError: (error: any) => {
        if (error?.includes("Insufficient")) {
          toast.error("Insufficient balance");
        } else {
          toast.error("Payment failed");
        }
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Spend
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Make a payment from your wallet
        </p>
      </div>

      {/* Wallet Summary */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Wallet Owner
              </p>
              <p className="font-semibold text-foreground">
                {selectedUserEmail|| "No user selected(Go to dashboard and select one )"}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              Available Balance
            </p>
            <p className="text-lg font-bold text-foreground">
              {currentBalance} {assetType}
            </p>
          </div>
        </div>

        {selectedWalletId && (
          <p className="mt-4 text-xs text-muted-foreground">
            Wallet ID: {selectedWalletId}
          </p>
        )}
      </div>

      {/* Spend Form */}
      <div className="glass-card mx-auto max-w-md rounded-xl p-6 fade-in">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
            <ArrowDownCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Spend {assetType}
            </h2>
            <p className="text-xs text-muted-foreground">
              Deduct from your balance
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">
              Amount ({assetType})
            </Label>
            <Input
              id="amount"
              placeholder="0.00"
              type="text"
              inputMode="decimal"
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">
                {errors.amount.message}
              </p>
            )}

            {enteredAmount > currentBalance && (
              <p className="text-xs text-warning">
                Amount exceeds available balance
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={
              isPending ||
              !selectedWalletId ||
              enteredAmount <= 0 ||
              enteredAmount > currentBalance
            }
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Spend ${assetType}`
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
