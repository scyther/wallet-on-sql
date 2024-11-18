"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AccountCard } from "@/components/AccountCard";
import { TransferForm } from "@/components/TransferForm";
import { TransactionHistory } from "@/components/TransactionHistory";

interface Account {
  account_number: string;
  balance: number;
}

interface Transaction {
  id: string;
  from_account: string;
  to_account: string;
  amount: number;
  status: string;
  created_at: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();

  const fetchAccountData = async () => {
    try {
      const response = await fetch("/api/account/balance", {
        headers: {
          "Content-Type": "application/json",
          "account": localStorage.getItem("account") || "",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch account");
      const data = await response.json();
      console.log(data);
      setAccount(data[0] || null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch account details",
        variant: "destructive",
      });
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transaction/history", {
        headers: {
          "Content-Type": "application/json",
          "account": localStorage.getItem("account") || "",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    }
  };

  const handleCreateAccount = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/account/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "account": localStorage.getItem("account") || "",
        },
      });

      if (!response.ok) throw new Error("Failed to create account");
      const data = await response.json();
      localStorage.setItem("account", data.accountNumber);
      await fetchAccountData();
      toast({
        title: "Account Created!",
        description: "Your new account has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTransferComplete = () => {
    fetchAccountData();
    fetchTransactions();
  };

  useEffect(() => {
    fetchAccountData();
    fetchTransactions();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <Wallet className="h-10 w-10" />
            Secure Wallet
          </h1>
          {!account && (
            <Button
              onClick={handleCreateAccount}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Account
            </Button>
          )}
        </div>

        {account ? (
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-8">
              <AccountCard
                accountNumber={account.account_number}
                balance={account.balance}
              />
              <TransferForm
                onTransferComplete={handleTransferComplete}
                fromAccount={account.account_number}
              />
            </div>
            <TransactionHistory
              transactions={transactions}
              userAccount={account.account_number}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">
              Create an account to start making transactions
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
