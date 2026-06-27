import { Request, Response } from "express";
import { authService } from "../services/authService.js";

export const login = async (req: Request, res: Response) => {
  try {
    const { companyCode, username, password, gateId } = req.body;

    if (
      typeof companyCode !== "string" ||
      typeof username !== "string" ||
      typeof password !== "string" ||
      typeof gateId !== "number"
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!companyCode.trim() || !username.trim() || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const result = await authService.login(
      companyCode.trim().toUpperCase(),
      username.trim(),
      password,
      gateId
    );

    res.json({ success: true, data: result });
  } catch (error: any) {
    // Oracle returned a business error (invalid credentials, blocked, etc.)
    const msg = error.message || "Login failed";
    const isBusinessError = [
      "Invalid credentials",
      "Account is blocked",
      "Company not found",
      "Gate not found",
    ].some((m) => msg.includes(m));

    res
      .status(isBusinessError ? 401 : 500)
      .json({ success: false, message: msg });
  }
};

export const getGates = async (req: Request, res: Response) => {
  try {
    const companyCode = (req.query.companyCode as string)?.trim().toUpperCase();
    if (!companyCode) {
      return res
        .status(400)
        .json({ success: false, message: "companyCode is required" });
    }
    const gates = await authService.getGates(companyCode);
    res.json({ success: true, data: gates });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    // req.user is populated from JWT by protect middleware
    res.json({ success: true, data: req.user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};