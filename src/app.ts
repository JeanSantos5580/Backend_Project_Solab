import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { errorHandler, notFoundHandler } from "./middlewares/error";
import { prismaClient } from "./prisma/client";
import { apiRouter } from "./routes";

function getAllowedOrigins(): string | string[] {
  const configured = process.env.CORS_ORIGIN?.split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

  if (configured && configured.length > 0) {
    return configured;
  }

  // Backwards-compatible default while the deployment origin is not configured.
  return "*";
}

export const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: getAllowedOrigins(),
    methods: ["GET", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
  })
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/health/ready", async (_req, res) => {
  try {
    await prismaClient.$queryRaw`SELECT 1`;
    res.json({ status: "ready" });
  } catch (error) {
    console.error("[api] readiness check failed:", error);
    res.status(503).json({ status: "unavailable" });
  }
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false
});

app.use(limiter);
app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
