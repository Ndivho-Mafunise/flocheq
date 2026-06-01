import dotenv from "dotenv"

dotenv.config({
    path:"./.env"
})

export function blockRegistration(req, res, next) {
  const registrationsEnabled =
    process.env.REGISTRATIONS_ENABLED === "true";

  if (!registrationsEnabled) {
    return res.status(403).json({
      success: false,
      message: "New registrations are currently disabled.",
    });
  }

  next();
}