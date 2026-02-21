import express from "express";

import { spendHandler, topUpHandler,bonusHandler} from "./modules/wallet/wallet.controller";

const app = express();
app.use(express.json());

app.post("/wallets/:walletId/spend", spendHandler);
app.post("/wallets/:walletId/topup", topUpHandler);
app.post("/wallets/:walletId/bonus", bonusHandler);

export default app;