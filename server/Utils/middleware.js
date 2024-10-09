import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { loggerMain } from "./logger.js";

dotenv.config();

// Secret key for signing JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT token
export function JWTverificator(req, res, next) {
  const JWTtoken = req.cookies?.auth_token;
  loggerMain.info(`🔑 JWT token received in cookie: ${JWTtoken}`);

  if (!JWTtoken) {
    loggerMain.warn(`No token provided. Responding with 403 Forbidden.`);
    return res
      .status(403)
      .json({ status: "error", message: "No token provided." });
  }

  jwt.verify(JWTtoken, JWT_SECRET, (err, decoded) => {
    if (err) {
      loggerMain.warn(
        `Invalid verification token. Responding with 401 Unauthorized.`
      );
      return res
        .status(401)
        .json({ status: "error", message: "Invalid verification token." });
    }

    // Proceed if token is valid
    loggerMain.info(`✅ Authorization passed.`);
    next();
  });
}

// Middleware to verify API Key - currently not used
export function APIkeyVerificator(req, res, next) {
  loggerMain.info("📩 Received a new POST request.");

  const apiKey = process.env.API_KEY;
  const userApiKey = req.headers["x-api-key"];

  if (userApiKey !== apiKey) {
    loggerMain.warn(
      `🔒 Unauthorized request. Responding with: [403 Forbidden]\n`
    );
    res
      .status(403)
      .json({ status: "error", message: "Forbidden: Invalid API Key" });
  } else {
    next();
  }
}
