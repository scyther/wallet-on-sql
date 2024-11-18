import { executeTransaction } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const headersList = await headers();
    const accountNumber = headersList.get("account");
    const result = await executeTransaction(async (connection) => {
      const [rows] = await connection.execute(
        "SELECT account_number, balance FROM accounts WHERE account_number = ?",
        [accountNumber]
      );
      return rows;
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch balance:", error);
    return NextResponse.json(
      { error: "Failed to fetch balance" },
      { status: 500 }
    );
  }
}
