import express from "express";
import cookieParser from "cookie-parser";
import router from "./routes/user.route.js";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
      credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", router);

// base url http://localhost:4000/api/v1/auth
// example url http://localhost:4000/api/v1/auth/register
export default app;
