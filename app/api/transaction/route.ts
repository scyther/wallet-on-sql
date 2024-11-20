import { NextResponse } from "next/server";
import { executeTransaction } from "@/lib/db";
import { validateAmount } from "@/lib/utils/account";
import { z } from "zod";
import { Connection } from "mysql2/promise";

const transactionSchema = z.object({
  fromAccount: z.string(),
  toAccount: z.string(),
  amount: z.number().positive(),
});

export const transferFunds = async (
  connection: Connection,
  fromAccount: string,
  toAccount: string,
  amount: number
) => {
  try {
    await connection.beginTransaction();

    // Lock the rows for update to prevent concurrent modifications
    const [fromRows] = await connection.query(
      "SELECT balance FROM accounts WHERE account_number = ?  FOR UPDATE",
      [fromAccount]
    );

    if (!Array.isArray(fromRows) || fromRows.length === 0) {
      throw new Error("Source account not found");
    }

    const [toRows] = await connection.query(
      "SELECT balance FROM accounts WHERE account_number = ? FOR UPDATE",
      [toAccount]
    );

    if (!Array.isArray(toRows) || toRows.length === 0) {
      throw new Error("Destination account not found");
    }

    const fromBalance = (fromRows[0] as any).balance;
    console.log("fromBalance", fromBalance);
    console.log("amount", amount);
    console.log(fromBalance < amount);
    if (parseFloat(fromBalance) < amount) {
      throw new Error("Insufficient funds");
    }

    // Perform the transfer
    await connection.query(
      "UPDATE accounts SET balance = balance - ? WHERE account_number = ?",
      [amount, fromAccount]
    );

    await connection.query(
      "UPDATE accounts SET balance = balance + ? WHERE account_number = ?",
      [amount, toAccount]
    );

    // Record the transaction
    await connection.query(
      "INSERT INTO transactions (from_account, to_account, amount, status) VALUES (?, ?, ?, ?)",
      [fromAccount, toAccount, amount, "completed"]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  }
};
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fromAccount, toAccount, amount } = transactionSchema.parse(body);

    if (fromAccount === toAccount) {
      return NextResponse.json(
        { error: "Source and destination accounts cannot be the same" },
        { status: 400 }
      );
    }
    if (!validateAmount(amount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    await executeTransaction(async (connection) => {
      await transferFunds(connection, fromAccount, toAccount, amount);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Transaction failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Transaction failed" },
      { status: 500 }
    );
  }
}
