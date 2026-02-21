import express from "express";

import { spendHandler } from "./modules/wallet/wallet.controller";

const app = express();
app.use(express.json());

app.post("/wallets/:walletId/spend", spendHandler);

export default app;