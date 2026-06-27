import jwt from "jsonwebtoken";
import { authRepository } from "../repositories/authRepository.js";
import type { JwtPayload } from "../types/index.js";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "8h") as jwt.SignOptions["expiresIn"];

const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const authService = {
  async login(
    companyCode: string,
    username: string,
    password: string,
    gateId: number
  ) {
    // All validation happens inside Oracle PKG_AUTH.LOGIN
    const result = await authRepository.login(
      companyCode,
      username,
      password,
      gateId
    );

    const token = signToken({
      id: result.userId,
      companyCode: result.companyCode,
      gateId: result.gateId,
      role: result.role,
    });

    return {
      token,
      user: {
        id: result.userId,
        username: result.username,
        name: result.name,
        role: result.role,
        companyCode: result.companyCode,
        gateId: result.gateId,
        gateName: result.gateName,
        permissions: result.permissions,
      },
    };
  },

  async getGates(companyCode: string) {
    return authRepository.getGatesByCompany(companyCode);
  },
};