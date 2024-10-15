import jwt from "jsonwebtoken";
import { loggerMain } from "./logger.js";

// Secret key for signing JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT token
export function JWTverificator(req, res, next) {
  const JWTtoken = req.cookies?.auth_token;
  
  if (!JWTtoken) {
    loggerMain.warn(`No token provided. Responding with 403 Forbidden.`);
    return res.status(403).json({ status: "error", errorCode: "NO_TOKEN_ERR" });
  }

  jwt.verify(JWTtoken, JWT_SECRET, (err, decoded) => {
    if (err) {
      loggerMain.warn(
        `Invalid verification token. Responding with 401 Unauthorized.`
      );
      return res
        .status(401)
        .json({ status: "error", errorCode: "INVALID_VERIFICATION_TOKEN_ERR" });
    }

    // Proceed if token is valid
    loggerMain.info(`✅ Authorization passed.`);
    next();
  });
}

// Middleware to verify API Key - currently not used
// export function APIkeyVerificator(req, res, next) {
//   loggerMain.info("📩 Received a new POST request.");

//   const apiKey = process.env.API_KEY;
//   const userApiKey = req.headers["x-api-key"];

//   if (userApiKey !== apiKey) {
//     loggerMain.warn(
//       `🔒 Unauthorized request. Responding with: [403 Forbidden]\n`
//     );
//     res
//       .status(403)
//       .json({ status: "error", errorCode: "Forbidden: Invalid API Key" });
//   } else {
//     next();
//   }
// }
