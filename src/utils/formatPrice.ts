export function formatPrice(usdPrice: number | string): string {
  const usd = typeof usdPrice === 'string' ? parseFloat(usdPrice) : usdPrice;
  const inr = Math.round(usd * 83.5); // Approximate exchange rate
  return `₹${inr.toLocaleString('en-IN')}`;
}
