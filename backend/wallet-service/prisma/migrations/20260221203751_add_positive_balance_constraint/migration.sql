ALTER TABLE "Wallet"
ADD CONSTRAINT positive_balance
CHECK ("currentBalance" >= 0);