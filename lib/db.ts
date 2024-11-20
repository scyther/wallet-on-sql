import mysql from "mysql2/promise";
import { createOrSyncAccountTable } from "./models/account";
import { createOrSyncTxnTable } from "./models/transaction";
import { createOrSyncLoansTable } from "./models/loan";

export async function createConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}

const createAdminAccount = () => `
  INSERT INTO accounts (account_number, balance) VALUES ('BANK', 1000000)
ON DUPLICATE KEY UPDATE balance = balance
`;

export async function initTables() {
  const connection = await createConnection();
  await connection.query(createOrSyncAccountTable());
  await connection.query(createOrSyncTxnTable());
  await connection.query(createAdminAccount());
  await connection.query(createOrSyncLoansTable());
  await connection.end();
}

export async function executeTransaction<T>(
  callback: (connection: mysql.Connection) => Promise<T>
): Promise<T> {
  const connection = await createConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}
