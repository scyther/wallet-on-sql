"use client";

import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/account";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";

interface Transaction {
  id: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  userAccount: string;
}

export function TransactionHistory({ transactions, userAccount }: TransactionHistoryProps) {
  return (
    <Card className="p-6 bg-gray-800 border-gray-700">
      <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
      <div className="space-y-4">
        {transactions.map((transaction) => {
          const isSender = transaction.fromAccount === userAccount;
          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-700"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  isSender ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"
                }`}>
                  {isSender ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {isSender ? "Sent to" : "Received from"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {isSender ? transaction.toAccount : transaction.fromAccount}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${
                  isSender ? "text-red-400" : "text-green-400"
                }`}>
                  {isSender ? "-" : "+"}{formatCurrency(transaction.amount)}
                </p>
                <p className="text-xs text-gray-400">
                  {format(new Date(transaction.createdAt), "MMM d, yyyy HH:mm")}
                </p>
              </div>
            </div>
          );
        })}
        {transactions.length === 0 && (
          <p className="text-center text-gray-400 py-4">No transactions yet</p>
        )}
      </div>
    </Card>
  );
}