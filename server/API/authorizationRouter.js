import express from "express";
import { fetchPassword } from "../Database/mysql.js";
import { loggerMain } from "../Utils/logger.js";
import { JWTverificator } from "../Utils/middleware.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const authRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXP = process.env.TOKEN_EXP;

authRouter.post("/login", async (req, res) => {
  loggerMain.info("↘️ Received a new login attempt.");

  const userPassword = req.body?.password;

  // Short-circuit if there is no user provided password
  if (!userPassword) {
    loggerMain.warn(
      `❌ No password provided. Responding with 401 Unauthorized.`
    );
    res.status(401).json({ status: "error", errorCode: "NO_PASSWORD_ERR" });
    return;
  }

  const password = await fetchPassword();
  // Short-circuit if the server failed to fetch the password
  if (!password) {
    res.status(500).json({ status: "error", errorCode: "INTERNAL_SERVER_ERR" });
    return;
  }

  const areMatching = await bcrypt.compare(userPassword, password);
  if (areMatching) {
    loggerMain.info(`✅ Password correct.`);

    // Generate a JWT token valid for 1 hour
    // Default headers: { "alg": "HS256", "typ": "JWT" } Claims on payload: { "iat": xxx, "exp": xxx }
    const JWTtoken = jwt.sign({}, JWT_SECRET, { expiresIn: `${TOKEN_EXP}ms` });

    // Send the JWT token as a HttpOnly, Secure, SameSite cookie
    res.cookie("auth_token", JWTtoken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: parseInt(TOKEN_EXP),
    });
    res.status(200).json({ status: "success" });
  } else {
    loggerMain.warn(`❌ Invalid password. Responding with 401 Unauthorized.`);
    res
      .status(401)
      .json({ status: "error", errorCode: "INVALID_PASSWORD_ERR" });
  }
});

authRouter.post("/logout", async (req, res) => {
  loggerMain.info("↖️ Received a new logout request.");

  // Clear the JWT token cookie (sets the Expiration Date of the cookie to a date in the past)
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.status(200).json({ status: "success" });
  loggerMain.info(`Auth cookie cleared.`);
});

authRouter.get("/test", JWTverificator, async (req, res) => {
  loggerMain.info("📩 [/test] Received a new GET request.");
  res.status(200).json({ status: "success" });
});
