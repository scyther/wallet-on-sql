import { NextResponse } from "next/server";
import { executeTransaction } from "@/lib/db";
import { Connection } from "mysql2/promise";
import { transferFunds } from "../../transaction/route";

const approveLoan = async (connection: Connection, loanId: string) => {
  try {
    await connection.beginTransaction();
    const [rows] = await connection.query(
      "SELECT * FROM loans WHERE id = ? AND status = 'applied'",
      [loanId]
    );

    if (Array(rows).length === 0) {
      throw NextResponse.json({ error: "No Pending Loan" }, { status: 400 });
    }

    const loans: any = rows as any;
    const { amount, account_number } = loans[0];
    console.log("amount", amount, account_number);
    await transferFunds(connection, "BANK", account_number, amount);
    await connection.query(
      "UPDATE loans SET status = 'approved' WHERE id = ?",
      [loanId]
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  }
};

export async function POST(req: Request) {
  try {
    const { loanId } = await req.json();

    if (!loanId) {
      return NextResponse.json(
        { error: "loanId is required" },
        { status: 400 }
      );
    }

    await executeTransaction(async (connection) => {
      await approveLoan(connection, loanId);
    });

    return NextResponse.json({
      message: "Loan application Approved successfully",
    });
  } catch (error) {
    console.error("Failed to approve Loan:", error);

    return NextResponse.json(
      { error: "Failed to approve Loan" },
      { status: 500 }
    );
  }
}
