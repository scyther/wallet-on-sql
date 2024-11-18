import { NextResponse } from 'next/server';
import { executeTransaction } from '@/lib/db';
import { generateAccountNumber } from '@/lib/utils/account';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accountNumber = generateAccountNumber();

    await executeTransaction(async (connection) => {
      await connection.execute(
        'INSERT INTO accounts (user_id, account_number, balance) VALUES (?, ?, ?)',
        [session.user.id, accountNumber, 0]
      );
    });

    return NextResponse.json({ accountNumber });
  } catch (error) {
    console.error('Failed to create account:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}