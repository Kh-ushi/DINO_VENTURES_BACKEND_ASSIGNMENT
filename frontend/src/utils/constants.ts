/** Hardcoded wallet ID — replace with dynamic value when auth is added */
export const WALLET_ID = "wallet-demo-001";

/** Currency formatting */
export function formatCurrency(
  amount: number | string,
  assetType?: string
) {
  const value = typeof amount === "string"
    ? parseFloat(amount)
    : amount;

  if (assetType?.toLowerCase() === "gold coins") {
    return `${value.toLocaleString()} 🪙`;
  }

  // default = money
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

/** Format date for display */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
