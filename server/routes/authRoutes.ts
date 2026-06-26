import { Router } from "express";

const router = Router();

router.get("/ping", (_req, res) => {
  res.json({ success: true, message: "Auth route OK" });
});

export default router;