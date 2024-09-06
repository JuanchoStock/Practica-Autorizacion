import mysql2 from "mysql2/promise";
import { valoresBD } from "../config/env.js";

export async function newConnection() {
  const connection = await mysql2.createConnection({
    host: valoresBD.DB_HOST,
    user: valoresBD.DB_USER,
    password: valoresBD.DB_PASSWORD,
    database: valoresBD.DB_NAME,
  });
  return connection;
}