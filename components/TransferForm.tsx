"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

interface TransferFormProps {
  onTransferComplete: () => void;
  fromAccount: string;
}

export function TransferForm({
  onTransferComplete,
  fromAccount,
}: TransferFormProps) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [toAccount, setToAccount] = useState("");

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          account: localStorage.getItem("account") || "",
        },
        body: JSON.stringify({
          fromAccount,
          toAccount,
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Transfer failed");
      }
      toast.success("Transfer successful");
      setAmount("");
      setToAccount("");
      onTransferComplete();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-gray-800 border-gray-700 text-white">
      <h2 className="text-lg font-semibold mb-4">Send Money</h2>
      <form onSubmit={handleTransfer} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="toAccount">Recipient Account Number</Label>
          <Input
            id="toAccount"
            placeholder="Enter account number"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            className="bg-gray-700 border-gray-600"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-gray-700 border-gray-600"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Send className="mr-2 h-4 w-4" />
          Send Money
        </Button>
      </form>
    </Card>
  );
}
