import express from "express";
import cookieParser from "cookie-parser";
import router from "./routes/user.route.js";


const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", router);

// base url http://localhost:4000/api/v1/auth
// example url http://localhost:4000/api/v1/auth/register
export default app;
