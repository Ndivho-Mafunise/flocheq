import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import router           from "./routes/user.route.js";
import dashboardRouter  from "./routes/dashboard.route.js";
import customersRouter  from "./routes/customers.route.js";
import transactionsRouter from "./routes/transactions.route.js";
import insightsRouter   from "./routes/insights.route.js";
import reportsRouter    from "./routes/reports.route.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());

// auth
app.use("/api/v1/auth",         router);

// dashboard overview
app.use("/api/v1/dashboard",    dashboardRouter);

// business logic
app.use("/api/v1/customers",    customersRouter);
app.use("/api/v1/transactions", transactionsRouter);
app.use("/api/v1/insights",     insightsRouter);
app.use("/api/v1/reports",      reportsRouter);

export default app;
