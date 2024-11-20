import { NextResponse } from "next/server";
import { executeTransaction } from "@/lib/db";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const accountNumber = headersList.get("account");

    if (!accountNumber) {
      return NextResponse.json(
        { error: "Account number is required" },
        { status: 400 }
      );
    }

    const { amount, tenure } = await req.json();

    if (!amount || !tenure) {
      return NextResponse.json(
        { error: "Amount and tenure are required" },
        { status: 400 }
      );
    }

    await executeTransaction(async (connection) => {
      // check if this account has any pending loans
      const [rows] = await connection.execute(
        "SELECT * FROM loans WHERE account_number = ? AND status = 'applied'",
        [accountNumber]
      );

      if (!Array.isArray(rows) || rows.length === 0) {
        return NextResponse.json(
          { error: "You already have a pending loan application" },
          { status: 400 }
        );
      }
      await connection.execute(
        "INSERT INTO loans (account_number, amount, tenure, status) VALUES (?, ?, ?, ?)",
        [accountNumber, amount, tenure, "applied"]
      );
    });

    return NextResponse.json({
      message: "Loan application submitted successfully",
    });
  } catch (error) {
    console.error("Failed to apply for loan:", error);
    return NextResponse.json(
      { error: "Failed to apply for loan" },
      { status: 500 }
    );
  }
}
