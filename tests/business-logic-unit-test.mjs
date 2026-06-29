import assert from 'node:assert/strict';

function isExpired(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

function normalizeStatus(status) {
  return (status || 'pending').toLowerCase();
}

function canEditSubmission(status) {
  const normalized = normalizeStatus(status);
  return normalized !== 'approved';
}

function buildOfferDiscount(type, discountValue, feDiscount) {
  if (type === 'percentage') return `${discountValue}% off`;
  if (type === 'fixed') return `$${discountValue} off`;
  if (type === 'bogo') return 'Buy 1 Get 1 Free';
  return discountValue || feDiscount || 'Special Offer';
}

assert.equal(normalizeStatus('APPROVED'), 'approved');
assert.equal(normalizeStatus('pending'), 'pending');
assert.equal(normalizeStatus(null), 'pending');

assert.equal(canEditSubmission('pending'), true);
assert.equal(canEditSubmission('rejected'), true);
assert.equal(canEditSubmission('approved'), false);
assert.equal(canEditSubmission('APPROVED'), false);

assert.equal(buildOfferDiscount('percentage', '25'), '25% off');
assert.equal(buildOfferDiscount('fixed', '50'), '$50 off');
assert.equal(buildOfferDiscount('bogo'), 'Buy 1 Get 1 Free');
assert.equal(buildOfferDiscount('custom', 'Free consult'), 'Free consult');
assert.equal(buildOfferDiscount('custom', null, 'Member deal'), 'Member deal');
assert.equal(buildOfferDiscount('custom'), 'Special Offer');

assert.equal(isExpired(null), false);
assert.equal(isExpired('2099-01-01'), false);
assert.equal(isExpired('2000-01-01'), true);

console.log('✅ PASS: Business logic unit tests completed successfully.');