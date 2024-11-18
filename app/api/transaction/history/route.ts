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
      const [accounts] = await connection.execute(
        "SELECT account_number FROM accounts WHERE user_id = ?",
        [session.user.id]
      );

      if (!Array.isArray(accounts) || accounts.length === 0) {
        return [];
      }

      const accountNumbers = (accounts as any[]).map(acc => acc.account_number);
      const placeholders = accountNumbers.map(() => "?").join(",");

      const [rows] = await connection.execute(
        `SELECT id, from_account, to_account, amount, status, created_at as createdAt 
         FROM transactions 
         WHERE from_account IN (${placeholders}) 
         OR to_account IN (${placeholders})
         ORDER BY created_at DESC 
         LIMIT 10`,
        [...accountNumbers, ...accountNumbers]
      );

      return rows;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}