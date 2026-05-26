'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, CheckCircle, XCircle, Star, LayoutDashboard, ClipboardList, LogOut, ChevronDown, ChevronUp, Calendar, MapPin, Tag, Percent, Gift, Zap, Building2, Trophy } from 'lucide-react';
import Logo from '@/components/Logo';
import type { Offer } from '@/app/offers/page';

type Tab = 'All' | 'Pending' | 'Approved' | 'Rejected';
const tabs: Tab[] = ['All', 'Pending', 'Approved', 'Rejected'];

const statusColors: Record<Offer['status'], { bg: string; color: string; label: string }> = {
  pending:  { bg: 'rgba(230,126,34,0.1)', color: '#e67e22', label: 'Pending' },
  approved: { bg: 'rgba(39,174,96,0.1)',  color: '#27ae60', label: 'Approved' },
  rejected: { bg: 'rgba(192,57,43,0.1)',  color: '#c0392b', label: 'Rejected' },
};

const typeIcons: Record<Offer['type'], React.ReactNode> = {
  percentage: <Percent size={13} />,
  bogo:       <Gift size={13} />,
  fixed:      <Tag size={13} />,
  custom:     <Zap size={13} />,
};

function persistApprovedOffers(offers: Offer[]) {
  const approved = offers.filter(o => o.status === 'approved');
  localStorage.setItem('fe_approved_offers', JSON.stringify(approved));
}

export default function AdminOffersPage() {
  const router = useRouter();
  const [offers, setOffers]           = useState<Offer[]>([]);
  const [tab, setTab]                 = useState<Tab>('All');
  const [search, setSearch]           = useState('');
  const [toast, setToast]             = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [expandedId, setExpandedId]   = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('fe_admin') !== 'true') {
        router.push('/');
      } else {
        setAuthChecked(true);
      }
    }
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;

    const seedOffers: Offer[] = [
      { id: 'seed_offer_1', businessName: 'Apex Marketing Group', title: '20% Off Brand Strategy Package', type: 'percentage', discount: '20% off', description: 'Founders Edge members get 20% off our full brand strategy engagement — includes brand audit, positioning workshop, and identity refresh.', category: 'Marketing & Design', location: 'Calgary, AB', expiryDate: '2026-12-31', status: 'approved', featured: true, submittedAt: '2026-01-10T09:00:00Z' },
      { id: 'seed_offer_2', businessName: 'TechStack Solutions', title: 'Free Cloud Migration Assessment', type: 'custom', discount: 'Free assessment', description: 'Get a complimentary 2-hour cloud infrastructure assessment (valued at $500) for all Founders Edge members looking to migrate or optimize.', category: 'Technology', location: 'Remote', expiryDate: '2026-09-30', status: 'approved', featured: false, submittedAt: '2026-01-15T10:30:00Z' },
      { id: 'seed_offer_3', businessName: 'Prairie Legal Group', title: '$250 Off Business Formation Package', type: 'fixed', discount: '$250 off', description: 'Exclusive discount on our complete business formation package — incorporation, shareholder agreement, and registered address for one year.', category: 'Finance & Legal', location: 'Calgary, AB', expiryDate: '2026-08-15', status: 'approved', featured: true, submittedAt: '2026-02-01T08:00:00Z' },
      { id: 'seed_offer_4', businessName: 'Velocity HR', title: 'Buy 1 HR Audit Get 1 Free', type: 'bogo', discount: 'BOGO', description: 'Purchase an HR compliance audit and receive a second one free — perfect for businesses with multiple entities or partners.', category: 'Professional Services', location: 'Calgary, AB', expiryDate: '2026-07-31', status: 'pending', featured: false, submittedAt: '2026-04-20T14:00:00Z' },
      { id: 'seed_offer_5', businessName: 'FounderFit Wellness', title: '15% Off Annual Membership', type: 'percentage', discount: '15% off', description: 'Founders Edge members save 15% on annual gym and wellness memberships — includes group classes, nutrition coaching, and monthly check-ins.', category: 'Health & Wellness', location: 'Calgary, AB', expiryDate: '2026-10-01', status: 'pending', featured: false, submittedAt: '2026-05-01T11:00:00Z' },
    ];

    const myRaw  = localStorage.getItem('fe_my_offers');
    const allRaw = localStorage.getItem('fe_all_submitted_offers');
    const mine: Offer[] = myRaw  ? JSON.parse(myRaw)  : [];
    const all:  Offer[] = allRaw ? JSON.parse(allRaw) : [];

    // Seeds first (preserving any admin edits stored in localStorage), then non-seed stored, then new member submissions
    const seedIds = new Set(seedOffers.map(o => o.id));
    const allIds  = new Set(all.map(o => o.id));
    const adminEditedSeeds = seedOffers.map(s => all.find(a => a.id === s.id) ?? s);
    const nonSeedStored    = all.filter(o => !seedIds.has(o.id));
    const newFromMember    = mine.filter(o => !allIds.has(o.id) && !seedIds.has(o.id));
    const finalMerged      = [...adminEditedSeeds, ...nonSeedStored, ...newFromMember];

    setOffers(finalMerged);
    localStorage.setItem('fe_all_submitted_offers', JSON.stringify(finalMerged));
    persistApprovedOffers(finalMerged);
  }, [authChecked]);  // eslint-disable-line react-hooks/exhaustive-deps

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function updateOffer(id: string, changes: Partial<Offer>) {
    setOffers(prev => {
      const updated = prev.map(o => o.id === id ? { ...o, ...changes } : o);
      localStorage.setItem('fe_all_submitted_offers', JSON.stringify(updated));
      persistApprovedOffers(updated);
      return updated;
    });
  }

  function approve(id: string) {
    updateOffer(id, { status: 'approved' });
    showToast('Offer approved ✓');
  }

  function reject(id: string) {
    updateOffer(id, { status: 'rejected' });
    showToast('Offer rejected.');
  }

  function toggleFeatured(id: string, current: boolean) {
    updateOffer(id, { featured: !current });
    showToast(current ? 'Offer unfeatured.' : 'Offer featured ✓');
  }

  const filtered = offers
    .filter(o => tab === 'All' || o.status === tab.toLowerCase())
    .filter(o => {
      const q = search.toLowerCase();
      return !search ||
        o.title.toLowerCase().includes(q) ||
        o.businessName.toLowerCase().includes(q) ||
        o.category.toLowerCase().includes(q) ||
        o.discount.toLowerCase().includes(q);
    });

  const stats = {
    total:    offers.length,
    pending:  offers.filter(o => o.status === 'pending').length,
    approved: offers.filter(o => o.status === 'approved').length,
    rejected: offers.filter(o => o.status === 'rejected').length,
  };

  if (!authChecked) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#e7b605', fontFamily: 'DM Sans, sans-serif', fontWeight: 700 }}>Checking access...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f7', fontFamily: 'DM Sans, sans-serif' }}>

      {/* ── Top Bar ── */}
      <div style={{ background: '#000', borderBottom: '1px solid #1a1a1a', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/" style={{ textDecoration: 'none' }}><Logo size="sm" /></Link>
          <div style={{ width: 1, height: 24, background: '#2a2a2a' }} />
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin Panel</span>
        </div>
        <button
          onClick={() => { localStorage.removeItem('fe_admin'); window.location.href = '/'; }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: '1px solid #2a2a2a', color: '#888', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 16px', cursor: 'pointer' }}
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>

      {/* ── Secondary Nav ── */}
      <div style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', display: 'flex', gap: 0 }}>
          <Link
            href="/admin/dashboard"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'none', color: '#888', borderBottom: '2px solid transparent', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ccc'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}
          >
            <LayoutDashboard size={14} /> Content Manager
          </Link>
          <Link
            href="/admin/events"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'none', color: '#888', borderBottom: '2px solid transparent', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ccc'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}
          >
            <ClipboardList size={14} /> Review Events
          </Link>
          <Link
            href="/admin/offers"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'none', color: '#e7b605', borderBottom: '2px solid #e7b605', transition: 'all 0.2s' }}
          >
            <Tag size={14} /> Review Offers
          </Link>
          <Link href="/admin/awards" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'none', color: '#888', borderBottom: '2px solid transparent', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ccc'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}>
            <Trophy size={14} /> Review Awards
          </Link>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 40px' }}>

        {/* Stats */}
        <div className="grid-4" style={{ gap: 2, marginBottom: 32 }}>
          {[
            { label: 'Total Submitted', value: stats.total,    color: '#2a2820' },
            { label: 'Pending Review',  value: stats.pending,  color: '#e67e22' },
            { label: 'Approved',        value: stats.approved, color: '#27ae60' },
            { label: 'Rejected',        value: stats.rejected, color: '#c0392b' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#fff', border: '1px solid #e2e0d8', padding: '24px 28px' }}>
              <div style={{ fontSize: '32px', fontWeight: 900, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#9a9585', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter row */}
        <div style={{ background: '#fff', border: '1px solid #e2e0d8', padding: '20px 24px', marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {tabs.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: '8px 18px', border: 'none', cursor: 'pointer',
                  background: tab === t ? '#000' : 'transparent',
                  color: tab === t ? '#e7b605' : '#9a9585',
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px',
                  letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'all 0.2s',
                }}
              >
                {t}
                {t !== 'All' && (
                  <span style={{ marginLeft: 6, fontSize: '11px', opacity: 0.7 }}>
                    ({stats[t.toLowerCase() as keyof typeof stats]})
                  </span>
                )}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9a9585' }} />
            <input
              className="input-field"
              placeholder="Search offers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 36, margin: 0, width: 260 }}
            />
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 40px', background: '#fff', border: '1px solid #e2e0d8' }}>
            <div style={{ fontSize: '36px', marginBottom: 16 }}>🎁</div>
            <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: 8 }}>No offers found</div>
            <div style={{ color: '#9a9585' }}>
              {tab === 'Pending' ? 'No offers awaiting review.' : 'No offers match your current filter.'}
            </div>
          </div>
        )}

        {/* Offer rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filtered.map(offer => {
            const sc = statusColors[offer.status];
            const isExpanded = expandedId === offer.id;
            const isExpired = offer.expiryDate && new Date(offer.expiryDate) < new Date();

            return (
              <div key={offer.id} style={{ background: '#fff', border: '1px solid #e2e0d8' }}>
                {/* Summary row */}
                <div
                  style={{ padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'center', cursor: 'pointer', flexWrap: 'wrap' }}
                  onClick={() => setExpandedId(isExpanded ? null : offer.id)}
                >
                  <div style={{ width: 36, height: 36, background: '#f0efe9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9b7011', flexShrink: 0 }}>
                    {typeIcons[offer.type]}
                  </div>

                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontWeight: 800, fontSize: '15px', color: '#2a2820', marginBottom: 2 }}>{offer.title}</div>
                    <div style={{ display: 'flex', gap: 12, fontSize: '12px', color: '#9a9585', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Building2 size={11} />{offer.businessName}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Tag size={11} />{offer.category}</span>
                      {offer.location && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} />{offer.location}</span>}
                    </div>
                  </div>

                  <div style={{ fontWeight: 900, fontSize: '20px', color: '#e7b605', flexShrink: 0 }}>{offer.discount}</div>

                  {offer.expiryDate && (
                    <div style={{ fontSize: '12px', color: isExpired ? '#c0392b' : '#9a9585', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                      <Calendar size={11} />
                      {isExpired ? 'Expired' : new Date(offer.expiryDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  )}

                  <span style={{ padding: '4px 10px', background: sc.bg, color: sc.color, fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0 }}>
                    {sc.label}
                  </span>

                  {offer.featured && <Star size={14} fill="#e7b605" stroke="#9b7011" style={{ flexShrink: 0 }} />}

                  <div style={{ color: '#9a9585', flexShrink: 0 }}>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid #e2e0d8', padding: '24px', background: '#fafaf8' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 20 }}>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9a9585', marginBottom: 8 }}>Description</div>
                        <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{offer.description}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9a9585', marginBottom: 4 }}>Business</div>
                          <div style={{ fontWeight: 700, fontSize: '14px', color: '#2a2820' }}>{offer.businessName}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9a9585', marginBottom: 4 }}>Submitted</div>
                          <div style={{ fontSize: '13px', color: '#5a5650' }}>{new Date(offer.submittedAt).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9a9585', marginBottom: 4 }}>Expiry</div>
                          <div style={{ fontSize: '13px', color: isExpired ? '#c0392b' : '#5a5650' }}>
                            {offer.expiryDate ? new Date(offer.expiryDate).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' }) : 'No expiry'}
                            {isExpired ? ' (Expired)' : ''}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', borderTop: '1px solid #e2e0d8', paddingTop: 20 }}>
                      {offer.status !== 'approved' && (
                        <button
                          onClick={() => approve(offer.id)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: '#27ae60', color: '#fff', border: 'none', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', cursor: 'pointer', letterSpacing: '0.04em' }}
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                      )}
                      {offer.status !== 'rejected' && (
                        <button
                          onClick={() => reject(offer.id)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: '#c0392b', color: '#fff', border: 'none', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', cursor: 'pointer', letterSpacing: '0.04em' }}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      )}
                      {offer.status === 'approved' && (
                        <button
                          onClick={() => toggleFeatured(offer.id, offer.featured)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: offer.featured ? 'rgba(231,182,5,0.15)' : 'transparent', color: offer.featured ? '#9b7011' : '#5a5650', border: '1px solid', borderColor: offer.featured ? '#e7b605' : '#e2e0d8', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', cursor: 'pointer', letterSpacing: '0.04em' }}
                        >
                          <Star size={13} fill={offer.featured ? '#e7b605' : 'none'} />
                          {offer.featured ? 'Unfeature' : 'Feature Offer'}
                        </button>
                      )}
                      {offer.status === 'approved' && (
                        <Link
                          href={`/offers/${offer.id}`}
                          target="_blank"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', border: '1px solid #e2e0d8', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', color: '#5a5650', textDecoration: 'none', letterSpacing: '0.04em' }}
                        >
                          View Live
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 32, right: 32, background: '#000', color: '#fff', padding: '14px 24px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '14px', zIndex: 9999, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          {toast}
        </div>
      )}
    </div>
  );
}
