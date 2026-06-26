import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import { apiRateLimiter } from "./middleware/rateLimiter.js";

// Routes — stubs for now, filled in per phase
import authRoutes from "./routes/authRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: "*", // Tighten in production to your Expo/web domain
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// Serve uploaded photos as static files
app.use(
  "/uploads",
  express.static(path.join(__dirname, process.env.UPLOAD_DIR || "uploads"))
);

// Global rate limiter
app.use("/api", apiRateLimiter);

// Debug — remove in production
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ── Health ────────────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "GMS API",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────

app.use("/api/auth", authRoutes);
// Additional routes plugged in per phase:
// app.use("/api/visitors", visitorRoutes);
// app.use("/api/vehicles", vehicleRoutes);
// app.use("/api/security", securityRoutes);
// app.use("/api/gates", gateRoutes);
// app.use("/api/locations", locationRoutes);
// app.use("/api/designations", designationRoutes);
// app.use("/api/patrol", patrolRoutes);
// app.use("/api/users", userRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
// 4-arg signature required for Express to treat this as an error handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    if (err.type === "entity.too.large") {
      return res
        .status(413)
        .json({ success: false, message: "Request payload too large" });
    }
    if (err instanceof SyntaxError) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid JSON in request body" });
    }
    if (err.message?.includes("Only JPEG")) {
      return res.status(400).json({ success: false, message: err.message });
    }
    console.error("Unhandled error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
);

// ── Start ─────────────────────────────────────────────────────────────────────

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 GMS Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();