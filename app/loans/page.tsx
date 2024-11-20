"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { formatCurrency } from "@/lib/utils/account";

interface Loan {
  id: string;
  account_number: string;
  amount: number;
  status: string;
  created_at: string;
}

export default function Loans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLoans = async () => {
    try {
      const response = await fetch("/api/loan", {
        headers: {
          "Content-Type": "application/json",
          account: localStorage.getItem("account") || "",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch loans");

      const data = await response.json();
      console.log("data", data);
      setLoans(data);
    } catch (error) {
      toast.error("Failed to fetch loans");
    }
  };

  const handleApproveLoan = async (loanId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/loan/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          account: localStorage.getItem("account") || "",
        },
        body: JSON.stringify({ loanId }),
      });
      if (!response.ok) throw new Error("Failed to approve loan");
      toast.success("Loan approved successfully");
      fetchLoans();
    } catch (error) {
      toast.error("Failed to approve loan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Loan Applications</h1>
        {loans.length > 0 ? (
          <div className="space-y-4">
            {loans.map((loan) => (
              <div key={loan.id} className="p-4 bg-gray-700 rounded-lg">
                <p>Account Number: {loan.account_number}</p>
                <p>Amount: {formatCurrency(loan.amount)}</p>
                <p>Status: {loan.status}</p>
                <p>
                  Applied On: {new Date(loan.created_at).toLocaleDateString()}
                </p>
                {loan.status === "applied" && (
                  <Button
                    onClick={() => handleApproveLoan(loan.id)}
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 mt-2"
                  >
                    Approve Loan
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No loan applications found</p>
        )}
      </div>
    </main>
  );
}
