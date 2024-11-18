"use client";

import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/account";
import { CreditCard } from "lucide-react";

interface AccountCardProps {
  accountNumber: string;
  balance: number;
}

export function AccountCard({ accountNumber, balance }: AccountCardProps) {
  return (
    <Card className="p-6 bg-gray-800 border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-blue-400" />
          <h2 className="text-lg font-semibold">Account Details</h2>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-400">Account Number</p>
        <p className="text-xl font-mono">{accountNumber}</p>
        <p className="text-sm text-gray-400 mt-4">Available Balance</p>
        <p className="text-3xl font-bold text-green-400">
          {formatCurrency(balance)}
        </p>
      </div>
    </Card>
  );
}