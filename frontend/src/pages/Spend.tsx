import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AmountSchema, type AmountFormData } from "@/types/wallet";
import { useSpend } from "@/hooks/useWallet";
import { ArrowDownCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Spend() {
  const { mutate, isPending } = useSpend();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AmountFormData>({
    resolver: zodResolver(AmountSchema),
  });

  const onSubmit = (data: AmountFormData) => {
    mutate(
      { amount: data.amount, description: data.description },
      { onSuccess: () => reset() }
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Spend</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Make a payment from your wallet
        </p>
      </div>

      <div className="glass-card mx-auto max-w-md rounded-xl p-6 fade-in">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
            <ArrowDownCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Send Payment</h2>
            <p className="text-xs text-muted-foreground">Deduct from your balance</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              placeholder="0.00"
              type="text"
              inputMode="decimal"
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="e.g. Cloud hosting bill"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Send Payment"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
