import { NextResponse } from "next/server";
import { executeTransaction } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await executeTransaction(async (connection) => {
      const [rows] = await connection.execute(
        "SELECT account_number, balance FROM accounts WHERE user_id = ?",
        [session.user.id]
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