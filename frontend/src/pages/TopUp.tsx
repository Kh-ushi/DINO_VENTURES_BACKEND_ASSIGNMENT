import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AmountSchema, type AmountFormData } from "@/types/wallet";
import { useTopUp } from "@/hooks/useWallet";
import { useWalletStore } from "@/store/useWalletStore";
import { ArrowUpCircle, Loader2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function TopUp() {
  const { mutate, isPending } = useTopUp();

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
    reset,
    formState: { errors },
  } = useForm<AmountFormData>({
    resolver: zodResolver(AmountSchema),
  });

  const onSubmit = (data: AmountFormData) => {
    const amountNumber = Number(data.amount);

    mutate(amountNumber, {
      onSuccess: () => {
        toast.success("Funds added successfully");
        reset();
      },
      onError: (error: any) => {
        toast.error(error?.message || "Top up failed");
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Top Up
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add funds to your selected wallet
        </p>
      </div>

      {/* Wallet Summary Card */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Wallet Owner
              </p>
              <p className="font-semibold text-foreground">
                {selectedUserEmail || "No user selected (Go to dashboard and select one)"}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              Current Balance
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

      {/* Top Up Form */}
      <div className="glass-card mx-auto max-w-md rounded-xl p-6 fade-in">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ArrowUpCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Add {assetType}
            </h2>
            <p className="text-xs text-muted-foreground">
              Minimum amount required
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
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
          </div>

          <Button
            type="submit"
            disabled={isPending || !selectedWalletId}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Top Up ${assetType}`
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}