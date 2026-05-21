import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
export const generateJwtToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET, { expiresIn: "7d" });
  //  SET COOKIE HERE
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
  });

  return token;
};
