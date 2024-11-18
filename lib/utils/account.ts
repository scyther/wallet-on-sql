export function generateAccountNumber(): string {
  const prefix = "2024";
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${prefix}${random}`;
}

export function validateAmount(amount: number): boolean {
  return amount > 0 && Number.isFinite(amount);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}