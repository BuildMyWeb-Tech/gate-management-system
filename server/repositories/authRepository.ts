import oracledb from "oracledb";
import { callProcedure, cursorParam, strOutParam, numOutParam, readCursor } from "../utils/oracle.js";

export interface LoginResult {
  userId: number;
  username: string;
  name: string;
  role: string;
  companyCode: string;
  gateId: number;
  gateName: string;
  permissions: string[];
  status: string;
  message: string;
}

export interface GateRow {
  GATE_ID: number;
  GATE_NAME: string;
}

export const authRepository = {
  async login(
    companyCode: string,
    username: string,
    password: string,
    gateId: number
  ): Promise<LoginResult> {
    const out = await callProcedure({
      procedure: "PKG_AUTH.LOGIN",
      params: {
        p_company_code: companyCode,
        p_username: username,
        p_password: password,
        p_gate_id: gateId,
        p_user_id:    numOutParam(),
        p_name:       strOutParam(200),
        p_role:       strOutParam(50),
        p_gate_name:  strOutParam(200),
        p_permissions: cursorParam(),
        p_status:     strOutParam(10),
        p_message:    strOutParam(500),
      },
    });

    const status = out.p_status as string;
    const message = out.p_message as string;

    if (status !== "SUCCESS") {
      throw new Error(message || "Login failed");
    }

    // Read permissions from REF CURSOR
    const permCursor = out.p_permissions as oracledb.ResultSet<{ PERMISSION_CODE: string }>;
    const permRows = await readCursor(permCursor);
    const permissions = permRows.map((r) => r.PERMISSION_CODE);

    return {
      userId: out.p_user_id as number,
      username,
      name: out.p_name as string,
      role: out.p_role as string,
      companyCode,
      gateId,
      gateName: out.p_gate_name as string,
      permissions,
      status,
      message,
    };
  },

  async getGatesByCompany(
    companyCode: string
  ): Promise<{ id: number; name: string }[]> {
    const out = await callProcedure({
      procedure: "PKG_AUTH.GET_GATES",
      params: {
        p_company_code: companyCode,
        p_cursor:       cursorParam(),
        p_status:       strOutParam(10),
        p_message:      strOutParam(500),
      },
    });

    const cursor = out.p_cursor as oracledb.ResultSet<GateRow>;
    const rows = await readCursor(cursor);
    return rows.map((r) => ({ id: r.GATE_ID, name: r.GATE_NAME }));
  },
};