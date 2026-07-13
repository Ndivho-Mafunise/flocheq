import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import router from "./routes/user.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import customersRouter from "./routes/customers.route.js";
import transactionsRouter from "./routes/transactions.route.js";
import insightsRouter from "./routes/insights.route.js";
import reportsRouter from "./routes/reports.route.js";
import subscriptionsRouter from "./routes/subscriptions.route.js";
import passport from "./config/passport.js";
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});
// auth
app.use("/api/v1/auth", router);

// dashboard overview
app.use("/api/v1/dashboard", dashboardRouter);

// business logic
app.use("/api/v1/customers", customersRouter);
app.use("/api/v1/transactions", transactionsRouter);
app.use("/api/v1/insights", insightsRouter);
app.use("/api/v1/reports", reportsRouter);
app.use("/api/v1/subscriptions", subscriptionsRouter);

export default app;
