"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils/account";

export function LoanApplicationForm() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("");
  const [emi, setEmi] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (amount && tenure) {
      const principal = parseFloat(amount);
      const rate = 11 / 100 / 12; // Monthly interest rate
      const months = parseInt(tenure);
      const emi =
        (principal * rate * Math.pow(1 + rate, months)) /
        (Math.pow(1 + rate, months) - 1);
      setEmi(emi);
    } else {
      setEmi(0);
    }
  }, [amount, tenure]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(amount) > 100000) {
      toast({
        title: "Error",
        description: "Maximum loan amount is 1 lakh",
        variant: "destructive",
      });
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/loan/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          tenure: parseInt(tenure),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Loan application failed");
      }

      toast({
        title: "Success!",
        description: "Loan application submitted successfully",
      });

      setAmount("");
      setTenure("");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Loan application failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-gray-800 border-gray-700 text-white">
      <h2 className="text-lg font-semibold mb-4">Apply for Loan</h2>
      <form onSubmit={handleApply} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amount">Loan Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="Enter loan amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-gray-700 border-gray-600"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tenure">Tenure (months)</Label>
          <Input
            id="tenure"
            type="number"
            placeholder="Enter tenure in months"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            className="bg-gray-700 border-gray-600"
            required
          />
        </div>

        {emi > 0 && (
          <div className="space-y-2">
            <Label>Estimated EMI</Label>
            <p className="bg-gray-700 border-gray-600 p-2 rounded">
              {formatCurrency(emi)} per month
            </p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Apply for Loan
        </Button>
      </form>
    </Card>
  );
}
