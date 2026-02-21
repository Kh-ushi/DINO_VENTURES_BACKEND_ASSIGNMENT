import express from "express";
import { errorHandler } from "./middleware/error.middleware";

import { spendHandler, topUpHandler, bonusHandler, getBalanceHandler } from "./modules/wallet/wallet.controller";

const app = express();
app.use(express.json());

app.post("/wallets/:walletId/spend", spendHandler);
app.post("/wallets/:walletId/topup", topUpHandler);
app.post("/wallets/:walletId/bonus", bonusHandler);
app.get("/wallets/:walletId/balance", getBalanceHandler);


app.use(errorHandler);
export default app;