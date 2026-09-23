import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";

dotenv.config();

const useSsl = (process.env.DB_SSL ?? "").toLowerCase() === "true";

const config: PoolConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    }
    : {
        host: process.env.HOST,
        port: Number(process.env.DB_PORT ?? process.env.PORT ?? 5432),
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DB,
        ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    };

export const pool = new Pool(config);

export async function pruebaConexion() {
    try {
        await pool.query("SELECT NOW()");
        console.log("Conexión a PostgreSQL exitosa");
    } catch (err) {
        console.error("No se pudo conectar a PostgreSQL", err);
        throw err;
    }
}
