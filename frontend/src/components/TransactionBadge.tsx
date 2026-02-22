import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "failed" | "topup" | "spend";

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-success/10 text-success",
  failed: "bg-destructive/10 text-destructive",
  topup: "bg-primary/10 text-primary",
  spend: "bg-warning/10 text-warning",
};

interface TransactionBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

export function TransactionBadge({ variant, children }: TransactionBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant]
      )}
    >
      {children}
    </span>
  );
}
