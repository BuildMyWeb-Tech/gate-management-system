// Typed helper to call Oracle stored procedures cleanly
import oracledb from "oracledb";
import { getConnection } from "../config/db.js";

interface CallProcedureOptions {
  procedure: string;
  params: Record<string, oracledb.BindParameter | unknown>;
}

export const callProcedure = async (
  options: CallProcedureOptions
): Promise<Record<string, unknown>> => {
  const { procedure, params } = options;
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `BEGIN ${procedure}; END;`,
      params as oracledb.BindParameters
    );
    return result.outBinds as Record<string, unknown>;
  } finally {
    await connection.close();
  }
};

export const callFunction = async (
  options: CallProcedureOptions
): Promise<Record<string, unknown>> => {
  return callProcedure(options);
};

// Helper: bind a REF CURSOR out parameter
export const cursorParam = (): oracledb.BindParameter => ({
  type: oracledb.CURSOR,
  dir: oracledb.BIND_OUT,
});

// Helper: bind a string out parameter
export const strOutParam = (maxSize = 4000): oracledb.BindParameter => ({
  type: oracledb.STRING,
  dir: oracledb.BIND_OUT,
  maxSize,
});

// Helper: bind a number out parameter
export const numOutParam = (): oracledb.BindParameter => ({
  type: oracledb.NUMBER,
  dir: oracledb.BIND_OUT,
});

// Read all rows from a REF CURSOR and close it
export const readCursor = async <T>(
  cursor: oracledb.ResultSet<T>
): Promise<T[]> => {
  const rows: T[] = [];
  let row: T | undefined;
  while ((row = await cursor.getRow()) !== undefined) {
    rows.push(row);
  }
  await cursor.close();
  return rows;
};