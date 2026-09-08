export function formatPrice(price: number | string): string {
  const cleanPrice = typeof price === 'string' ? price.replace(/,/g, '') : price;
  const inr = typeof cleanPrice === 'string' ? parseFloat(cleanPrice) : cleanPrice;
  return `₹${Math.round(inr).toLocaleString('en-IN')}`;
}
