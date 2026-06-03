import User from "../models/user.model.js";
import { generateJwtToken } from "../utils/generateJwtToken.js";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { sendVerificationEmail } from "../Resend/email.js";

export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const verificationToken = generateVerificationToken();

    // create user
    const user = await User.create({
      name,
      email,
      password,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24hrs
    });
    await user.save();

    // generate jwt
    try {
      generateJwtToken(res, user._id);
    } catch (error) {
      console.log("Error while signing token", error);
      res.status(500).json({
        error: error.message,
      });
    }

    try {
      const results = await sendVerificationEmail(
        user.email,
        verificationToken,
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: " Failed to send verification email ",
      });
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully, verification email sent",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is not verified",
      });
    }
    try {
      generateJwtToken(res, user._id);
    } catch (error) {
      console.log("Error while signing token", error);
      res.status(500).json({
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User logged in",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "server internal error",
      error: error.message,
    });
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully ",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "server internal error",
      error: error.message,
    });
  }
};
