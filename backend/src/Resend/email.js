import { resend } from "./config.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Verify Your Email Address",
      html: ` <strong>${verificationToken}</strong>`,
    });

    if (error) {
      console.log("error sending verification email", error);
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.log("error sending verification email", error);
    throw new Error("Error sending verification email");
  }
};
export const sendWelcomeEmail = async (email, name) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to saas app",
      html: ` <strong>welcome ${name}</strong>`,
    });

    if (error) {
      console.log("error sending welcome email", error);
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.log("error sending welcome email", error);
    throw new Error("Error sending welcome email");
  }
};

export const sendResetPasswordEmail = async (email, resetToken) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Reset your account password",
      html: ` <a href= ${resetToken}> reset your password </a>`,
    });

    if (error) {
      console.log("error sending reset password email", error);
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.log("error sending welcome email", error);
    throw new Error("Error sending welcome email");
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "reset email successful",
      html: ` <strong> Login </strong>`,
    });

    if (error) {
      console.log("error sending reset successful email", error);
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.log("error sending reset successful email", error);
    throw new Error("Error sending reset successful email");
  }
};
