export function isExpired(dateStr?: string | null) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

export function normalizeStatus(status?: string | null) {
  return (status || 'pending').toLowerCase();
}

export function canEditSubmission(status?: string | null) {
  const normalized = normalizeStatus(status);
  return normalized !== 'approved';
}

export function buildOfferDiscount(type: string, discountValue?: string | null, feDiscount?: string | null) {
  if (type === 'percentage') return `${discountValue}% off`;
  if (type === 'fixed') return `$${discountValue} off`;
  if (type === 'bogo') return 'Buy 1 Get 1 Free';
  return discountValue || feDiscount || 'Special Offer';
}