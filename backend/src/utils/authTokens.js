import jwt from "jsonwebtoken";
import crypto from "crypto";
import RefreshToken from "../models/refreshToken.model.js";

const isProd = process.env.NODE_ENV === "production";

// keep these in sync with ACCESS_TOKEN_EXPIRES_IN / REFRESH_TOKEN_EXPIRES_IN in .env
const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// sets both cookies + saves the refresh token record. Called on login,
// signup, google login, and every /refresh (with the existing family
// passed back in so the rotation chain stays linked)
export const issueAuthTokens = async (
  res,
  userId,
  role,
  family = crypto.randomUUID(),
) => {
  const accessToken = jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  });

  const jti = crypto.randomUUID();
  const refreshToken = jwt.sign(
    { userId, role, family, jti },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN },
  );

  const { exp } = jwt.decode(refreshToken);

  await RefreshToken.create({
    user: userId,
    tokenHash: hashToken(refreshToken),
    family,
    jti,
    expiresAt: new Date(exp * 1000),
  });

  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  // scoped to /api/v1/auth so it only ever goes to auth routes, not every request
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/api/v1/auth",
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
};

export const clearAuthCookies = (res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/api/v1/auth",
  });
};

// kills every token ever rotated from the same login — used on logout,
// and when a used refresh token gets replayed (a sign it was stolen)
export const revokeRefreshFamily = async (family) => {
  await RefreshToken.updateMany({ family }, { revoked: true });
};
