import User from "../models/user.model.js";
import {
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendResetSuccessEmail,
} from "../Resend/email.js";
import crypto from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/refreshToken.model.js";
import {
  hashToken,
  clearAuthCookies,
  issueAuthTokens,
  revokeRefreshFamily,
} from "../utils/authTokens.js";

export const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;
    const verifiedUser = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: new Date() },
    });
    if (!verifiedUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }
    verifiedUser.isVerified = true;
    verifiedUser.verificationToken = null;
    verifiedUser.verificationTokenExpiresAt = null;
    await verifiedUser.save();

    try {
      await sendWelcomeEmail(verifiedUser.email, verifiedUser.name);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: " Failed to send welcome email ",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Welcome email was sent successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user with this email is not found",
      });
    }
    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpiresAt = Date.now() + 60 * 60 * 1000; //1hr

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiresAt = resetPasswordExpiresAt;

    await user.save();

    await sendResetPasswordEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`,
    );

    return res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "invalid or expired token",
      });
    }
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpiresAt = null;
    await user.save();
    await sendResetSuccessEmail(user.email);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "server internal error",
      error: error.message,
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const incomingToken = req.cookies.refreshToken;
    if (!incomingToken) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let payload;
    try {
      payload = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      clearAuthCookies(res);
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { userId, family, jti } = payload;
    const storedToken = await RefreshToken.findOne({ jti });

    if (!storedToken || storedToken.tokenHash !== hashToken(incomingToken)) {
      await revokeRefreshFamily(family);
      clearAuthCookies(res);
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (storedToken.revoked) {
      // this exact token was already rotated away once — someone is replaying
      // an old refresh token, which only happens if it was stolen. Kill the
      // whole session family so the thief (and the real user) are logged out.
      await revokeRefreshFamily(family);
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        message: "Session revoked, please log in again",
      });
    }

    if (storedToken.expiresAt < new Date()) {
      clearAuthCookies(res);
      return res.status(401).json({ success: false, message: "Session expired" });
    }

    // rotation: this token is now spent, issue a fresh pair in the same family
    storedToken.revoked = true;
    await storedToken.save();

    // re-read role from the DB (not the old token) so a role change takes
    // effect on the next refresh instead of lingering until logout
    const user = await User.findById(userId);
    if (!user) {
      clearAuthCookies(res);
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await issueAuthTokens(res, userId, user.role, family);

    return res.status(200).json({ success: true, message: "Token refreshed" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "server internal error",
      error: error.message,
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    return res.status(200).json({
      success: true,
      message: "user Authorized",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.log("Error checking auth", error);
    res.status(500).json({
      error: error.message,
    });
  }
};
