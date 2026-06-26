// Adapted from OTT middleware/auth.ts
// Replaced: Mongoose User.findById → Oracle repository call
// Added: companyCode, gateId, permissions on req.user
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "../types/index.js";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    // Attach decoded payload to req.user
    // Full user validation against Oracle happens in auth service during login
    req.user = {
      id: decoded.id,
      username: "",
      name: "",
      role: decoded.role,
      companyCode: decoded.companyCode,
      gateId: decoded.gateId,
      permissions: [],
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied" });
    }
    next();
  };
};