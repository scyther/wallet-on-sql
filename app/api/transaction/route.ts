import { NextResponse } from 'next/server';
import { executeTransaction } from '@/lib/db';
import { validateAmount } from '@/lib/utils/account';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const transactionSchema = z.object({
  fromAccount: z.string(),
  toAccount: z.string(),
  amount: z.number().positive(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { fromAccount, toAccount, amount } = transactionSchema.parse(body);

    if (!validateAmount(amount)) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    await executeTransaction(async (connection) => {
      // Lock the rows for update to prevent concurrent modifications
      const [fromRows] = await connection.execute(
        'SELECT balance FROM accounts WHERE account_number = ? AND user_id = ? FOR UPDATE',
        [fromAccount, session.user.id]
      );
      
      if (!Array.isArray(fromRows) || fromRows.length === 0) {
        throw new Error('Source account not found');
      }

      const [toRows] = await connection.execute(
        'SELECT balance FROM accounts WHERE account_number = ? FOR UPDATE',
        [toAccount]
      );
      
      if (!Array.isArray(toRows) || toRows.length === 0) {
        throw new Error('Destination account not found');
      }

      const fromBalance = (fromRows[0] as any).balance;
      if (fromBalance < amount) {
        throw new Error('Insufficient funds');
      }

      // Perform the transfer
      await connection.execute(
        'UPDATE accounts SET balance = balance - ? WHERE account_number = ?',
        [amount, fromAccount]
      );
      
      await connection.execute(
        'UPDATE accounts SET balance = balance + ? WHERE account_number = ?',
        [amount, toAccount]
      );

      // Record the transaction
      await connection.execute(
        'INSERT INTO transactions (from_account, to_account, amount, status) VALUES (?, ?, ?, ?)',
        [fromAccount, toAccount, amount, 'completed']
      );
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Transaction failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Transaction failed' },
      { status: 500 }
    );
  }
}