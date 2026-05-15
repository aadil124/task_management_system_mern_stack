import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

// single cors call — handles both local and production
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,  // your Vercel URL in production
].filter(Boolean); // removes undefined if FRONTEND_URL is not set

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (Postman, mobile apps, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin} is not allowed`));
    }
  },
  credentials: true,
}));

// routes
app.use("/auth", authRoutes);
app.use("/api", taskRoutes);

export default app;