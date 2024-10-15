import "dotenv/config";
import express from "express";
import cors from "cors";
import { loggerMain } from "./Utils/logger.js";
import { clientRouter } from "./client.js";
import { authRouter } from "./API/authorizationRouter.js";
import { mainRouter } from "./API/mainRouter.js";
import cookieParser from "cookie-parser";

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cookieParser());
//  Access-Control-Allow-Credentials: true & Access-Control-Allow-Origin: XXX headers need to be configured in order for a browser to send cookies to the server in cross-origin context
app.use(
  cors({
    origin:
      NODE_ENV === "production"
        ? "https://budmat.ardium.pl"
        : "http://localhost:4200",
    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use(mainRouter);
app.use(clientRouter);

app.listen(PORT, () => {
  loggerMain.info(`Server is running on port ${PORT}`);
});