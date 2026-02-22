import express from "express";
import { errorHandler } from "./middleware/error.middleware";
import cors from "cors";


import { spendHandler, topUpHandler, bonusHandler, getBalanceHandler,getUsersWithWallets } from "./modules/wallet/wallet.controller";

const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "https://dino-ventures-backend-assignment-j4zpffkx4.vercel.app"
    ],
    credentials: true
  })
);



app.use(express.json());

app.get("/wallets", getUsersWithWallets);

app.post("/wallets/:walletId/spend", spendHandler);
app.post("/wallets/:walletId/topup", topUpHandler);
app.post("/wallets/:walletId/bonus", bonusHandler);
app.get("/wallets/:walletId/balance", getBalanceHandler);


app.use(errorHandler);
export default app;