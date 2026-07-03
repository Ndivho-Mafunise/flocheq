import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("Google account has no email"), null);
        }

        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.findOne({ email });

          if (user) {
            // an existing local account with this email — link Google to it
            user.googleId = profile.id;
            user.isVerified = true;
            await user.save();
          } else {
            if (process.env.REGISTRATIONS_ENABLED !== "true") {
              return done(null, false, { message: "registrations_disabled" });
            }
            user = await User.create({
              name: profile.displayName,
              email,
              googleId: profile.id,
              provider: "google",
              avatar: profile.photos?.[0]?.value,
              isVerified: true,
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

export default passport;
