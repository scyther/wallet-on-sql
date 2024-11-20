import { NextResponse } from "next/server";
import { executeTransaction } from "@/lib/db";
import { headers } from "next/headers";

export async function GET() {
  try {
    const headersList = headers();
    const accountNumber = headersList.get("account");
    const result = await executeTransaction(async (connection) => {
      const [rows] = await connection.execute(
        "SELECT * FROM transactions WHERE from_account = ? OR to_account = ?",
        [accountNumber, accountNumber]
      );
      return rows;
    });

    console.log("transactions", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
