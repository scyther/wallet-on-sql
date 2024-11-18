import { NextResponse } from "next/server";
import { executeTransaction, initTables } from "@/lib/db";
import { generateAccountNumber } from "@/lib/utils/account";
import { headers } from "next/headers";

export async function POST() {
  try {
    const headersList = await headers();
    const oldAccountNumber = headersList.get("account");
    if (oldAccountNumber) {
      return NextResponse.json(
        { error: "Account already exists" },
        { status: 400 }
      );
    }

    const accountNumber = generateAccountNumber();
    await initTables();
    await executeTransaction(async (connection) => {
      await connection.execute(
        "INSERT INTO accounts ( account_number, balance) VALUES ( ?, ?)",
        [accountNumber, 500]
      );
    });

    return NextResponse.json({ accountNumber });
  } catch (error) {
    console.error("Failed to create account:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
