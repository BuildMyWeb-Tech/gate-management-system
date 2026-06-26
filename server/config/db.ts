import oracledb from "oracledb";

let pool: oracledb.Pool | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    // Thick mode needed for full PL/SQL support (REF CURSORs, packages)
    // Requires Oracle Instant Client installed on the machine
    // Comment this out if using thin mode (limited PL/SQL support)
    // oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_DIR });

    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    oracledb.fetchTypeHandler = (metaData) => {
      // Auto-convert DATE/TIMESTAMP to JS Date
      if (
        metaData.dbType === oracledb.DB_TYPE_DATE ||
        metaData.dbType === oracledb.DB_TYPE_TIMESTAMP
      ) {
        return { type: oracledb.DATE };
      }
    };

    pool = await oracledb.createPool({
      user: process.env.ORACLE_USER!,
      password: process.env.ORACLE_PASSWORD!,
      connectionString: process.env.ORACLE_CONNECTION_STRING!,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1,
      poolTimeout: 60,
    });

    console.log("✅ Oracle connection pool created");
  } catch (error) {
    console.error("❌ Oracle connection failed:", error);
    process.exit(1);
  }
};

export const getConnection = async (): Promise<oracledb.Connection> => {
  if (!pool) throw new Error("Oracle pool not initialized");
  return pool.getConnection();
};

export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.close(10);
    pool = null;
  }
};