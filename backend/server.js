import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/ds.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); // parse JSON req.body

app.use("/api/v1/auth", authRoutes);
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
