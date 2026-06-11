import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
export const generateJwtToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET, { expiresIn: "1d" });
  //  SET COOKIE HERE
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
  });

  return token;
};
