import { NextResponse } from "next/server";
import { executeTransaction } from "@/lib/db";

export async function GET() {
  try {
    const result = await executeTransaction(async (connection) => {
      const [rows] = await connection.execute("SELECT * FROM loans ");
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
