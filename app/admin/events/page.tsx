'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, CheckCircle, XCircle, Star, LayoutDashboard, ClipboardList, Calendar, MapPin, LogOut, ChevronDown, ChevronUp, Clock, Users, DollarSign, Mail, Tag } from 'lucide-react';
import Logo from '@/components/Logo';

type EventStatus = 'approved' | 'pending' | 'rejected';

type AdminEvent = {
  id: number;
  title: string;
  category: string;
  host: string;
  hostEmail: string;
  date: string;
  time: string;
  duration: string;
  capacity: number;
  price: string;
  submittedDate: string;
  status: EventStatus;
  featured: boolean;
  isOnline: boolean;
  location: string;
  description: string;
  tags: string[];
};

const initialEvents: AdminEvent[] = [
  { id: 1, title: 'YYC Founders Mixer', category: 'Networking', host: 'Founders Edge', hostEmail: 'hello@foundrsedge.com', date: 'Jun 18, 2026', time: '6:00 PM', duration: '3 hrs', capacity: 80, price: 'Free', submittedDate: 'May 20, 2026', status: 'approved', featured: true, isOnline: false, location: 'The Commons, 908 17 Ave SW, Calgary', description: 'Join us for an evening of high-quality networking with Calgary\'s top founders and entrepreneurs. Drinks, conversation, and connections that matter. Expect curated introductions, a short founder spotlight, and an open networking session.', tags: ['Networking', 'Calgary', 'Founders'] },
  { id: 2, title: 'Scale-Up Workshop: Hiring Your First 10', category: 'Workshop', host: 'Sarah Kim', hostEmail: 'sarah@kimventures.ca', date: 'Jun 25, 2026', time: '9:00 AM', duration: '4 hrs', capacity: 30, price: '$149', submittedDate: 'May 21, 2026', status: 'approved', featured: true, isOnline: false, location: 'Platform Calgary, 422 11 Ave SW', description: 'A hands-on workshop covering everything you need to know about making your first 10 hires. Topics include writing job descriptions that attract A-players, structuring interviews, onboarding best practices, and building culture from day one.', tags: ['Hiring', 'Workshop', 'Scale-Up'] },
  { id: 3, title: 'Funding 101: Grants & Tax Credits for AB Businesses', category: 'Webinar', host: 'Amanda Chen', hostEmail: 'amanda@abizgrants.ca', date: 'Jul 9, 2026', time: '12:00 PM', duration: '90 mins', capacity: 200, price: 'Free', submittedDate: 'May 22, 2026', status: 'approved', featured: false, isOnline: true, location: 'Online', description: 'Learn about the most valuable grants, SR&ED tax credits, and government programs available to Alberta businesses. Practical breakdown of eligibility, application timelines, and how to maximize your funding stack.', tags: ['Funding', 'Grants', 'SR&ED', 'Alberta'] },
  { id: 4, title: 'Supper Club — June Edition', category: 'Supper Club', host: 'Founders Edge', hostEmail: 'hello@foundrsedge.com', date: 'Jun 27, 2026', time: '7:00 PM', duration: '3 hrs', capacity: 16, price: 'Members Only', submittedDate: 'May 19, 2026', status: 'approved', featured: true, isOnline: false, location: 'River Café, 25 Prince\'s Island Park', description: 'Our intimate monthly dinner for Founders Edge members. 16 seats, curated conversation, fine dining. This month\'s theme: navigating partnerships and co-founder relationships. Come ready to share openly and connect deeply.', tags: ['Supper Club', 'Members Only', 'Networking'] },
  { id: 5, title: 'B2B Sales Masterclass', category: 'Workshop', host: 'Mike Okafor', hostEmail: 'mike@salesedge.io', date: 'Jul 16, 2026', time: '10:00 AM', duration: '2 hrs', capacity: 50, price: '$79', submittedDate: 'May 23, 2026', status: 'approved', featured: false, isOnline: true, location: 'Online', description: 'A no-fluff masterclass on closing B2B deals faster. Covers outbound prospecting, discovery calls, handling objections, and building a repeatable pipeline. Bring your biggest sales challenge — we\'ll workshop it live.', tags: ['Sales', 'B2B', 'Revenue'] },
  { id: 6, title: 'AI Tools for Calgary Entrepreneurs', category: 'Workshop', host: 'Priya Mehta', hostEmail: 'priya@aiforward.ca', date: 'Jul 22, 2026', time: '2:00 PM', duration: '2 hrs', capacity: 40, price: 'Free', submittedDate: 'May 24, 2026', status: 'pending', featured: false, isOnline: true, location: 'Online', description: 'A practical walkthrough of the AI tools that are actually saving founders time in 2026. Covers ChatGPT, Notion AI, Cursor, and more. Live demos included. No technical background required — just curiosity and a laptop.', tags: ['AI', 'Tools', 'Productivity', 'Tech'] },
  { id: 7, title: 'PropTech Networking Night', category: 'Networking', host: 'Calgary Realty Labs', hostEmail: 'events@calgaryrealitylabs.com', date: 'Jul 30, 2026', time: '5:30 PM', duration: '2.5 hrs', capacity: 60, price: '$25', submittedDate: 'May 25, 2026', status: 'pending', featured: false, isOnline: false, location: 'Bow Tower, 500 Centre St S, Calgary', description: 'Calgary\'s real estate and technology communities collide at this quarterly networking event. Meet developers, investors, proptech founders, and real estate professionals shaping the future of property in YYC. Open bar for the first hour.', tags: ['PropTech', 'Real Estate', 'Networking', 'Calgary'] },
];

type Tab = 'All' | 'Pending' | 'Approved' | 'Rejected';

const tabs: Tab[] = ['All', 'Pending', 'Approved', 'Rejected'];

const statusColors: Record<EventStatus, { bg: string; color: string; label: string }> = {
  pending: { bg: 'rgba(230,126,34,0.1)', color: '#e67e22', label: 'Pending' },
  approved: { bg: 'rgba(39,174,96,0.1)', color: '#27ae60', label: 'Approved' },
  rejected: { bg: 'rgba(192,57,43,0.1)', color: '#c0392b', label: 'Rejected' },
};

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<AdminEvent[]>(initialEvents);
  const [tab, setTab] = useState<Tab>('All');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('fe_admin') !== 'true') {
        router.push('/admin');
      } else {
        setAuthChecked(true);
      }
    }
  }, [router]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function approve(id: number) {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'approved' } : e));
    showToast('Event approved ✓');
  }

  function reject(id: number) {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'rejected', featured: false } : e));
    showToast('Event rejected.');
  }

  function toggleFeatured(id: number) {
    setEvents(prev => {
      const ev = prev.find(e => e.id === id);
      const nowFeatured = ev ? !ev.featured : false;
      showToast(nowFeatured ? 'Event featured ✓' : 'Event unfeatured.');
      return prev.map(e => e.id === id ? { ...e, featured: !e.featured } : e);
    });
  }

  const filtered = events.filter(e => {
    const matchTab = tab === 'All' || e.status === tab.toLowerCase();
    const matchSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.host.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const stats = {
    total: events.length,
    pending: events.filter(e => e.status === 'pending').length,
    approved: events.filter(e => e.status === 'approved').length,
    rejected: events.filter(e => e.status === 'rejected').length,
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
      {/* Top Bar */}
      <div style={{ background: '#000', borderBottom: '1px solid #1a1a1a', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/" style={{ textDecoration: 'none' }}><Logo size="sm" /></Link>
          <div style={{ width: 1, height: 24, background: '#2a2a2a' }} />
          <span className="admin-panel-label" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin Panel</span>
        </div>
        <button onClick={() => { localStorage.removeItem('fe_admin'); window.location.href = '/admin'; }} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: '1px solid #2a2a2a', color: '#888', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 16px', cursor: 'pointer' }}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>

      {/* Secondary Nav */}
      <div style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', display: 'flex', gap: 0 }}>
          <Link href="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'none', color: '#888', borderBottom: '2px solid transparent', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ccc'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}>
            <LayoutDashboard size={14} /> Content Manager
          </Link>
          <Link href="/admin/events" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'none', color: '#e7b605', borderBottom: '2px solid #e7b605', transition: 'all 0.2s' }}>
            <ClipboardList size={14} /> Review Submissions
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 40px' }}>
        {/* Stats */}
        <div className="grid-4" style={{ gap: 2, marginBottom: 32 }}>
          {[
            { label: 'Total Submitted', value: stats.total, color: '#2a2820' },
            { label: 'Pending Review', value: stats.pending, color: '#e67e22' },
            { label: 'Approved', value: stats.approved, color: '#27ae60' },
            { label: 'Rejected', value: stats.rejected, color: '#c0392b' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#fff', border: '1px solid #e2e0d8', padding: '24px 28px' }}>
              <div style={{ fontSize: '32px', fontWeight: 900, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#9a9585', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter row */}
        <div style={{ background: '#fff', border: '1px solid #e2e0d8', padding: '20px 24px', marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4 }}>
            {tabs.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: '8px 18px', border: 'none', cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px',
                  letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'all 0.15s',
                  background: tab === t ? '#000' : 'transparent',
                  color: tab === t ? '#e7b605' : '#9a9585',
                  borderRadius: 2,
                }}
              >
                {t}
                {t !== 'All' && (
                  <span style={{ marginLeft: 6, background: tab === t ? 'rgba(231,182,5,0.2)' : '#f0efe9', color: tab === t ? '#e7b605' : '#9a9585', padding: '1px 6px', borderRadius: 10, fontSize: '11px' }}>
                    {t === 'Pending' ? stats.pending : t === 'Approved' ? stats.approved : stats.rejected}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', minWidth: 220 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9a9585' }} />
            <input
              className="input-field"
              placeholder="Search events..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 36, margin: 0, fontSize: '14px', padding: '10px 14px 10px 36px' }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid #e2e0d8' }}>
          {filtered.length === 0 && (
            <div style={{ padding: '60px', textAlign: 'center', color: '#9a9585', fontFamily: 'DM Sans, sans-serif' }}>
              No events match your filters.
            </div>
          )}

          {filtered.map((event, i) => {
            const s = statusColors[event.status];
            const isExpanded = expandedId === event.id;
            return (
              <div key={event.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #e2e0d8' : 'none', borderLeft: event.featured ? '3px solid #e7b605' : '3px solid transparent' }}>
                {/* Row header — clickable */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : event.id)}
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 20,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    background: isExpanded ? '#fafaf8' : '#fff',
                  }}
                  onMouseEnter={el => (el.currentTarget.style.background = '#fafaf8')}
                  onMouseLeave={el => (el.currentTarget.style.background = isExpanded ? '#fafaf8' : '#fff')}
                >
                  {/* Expand chevron */}
                  <div style={{ flexShrink: 0, marginTop: 2, color: '#9a9585' }}>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>

                  {/* Main info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span style={{ fontWeight: 800, fontSize: '15px', color: '#2a2820' }}>{event.title}</span>
                      {event.featured && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: 'rgba(231,182,5,0.12)', color: '#9b7011', padding: '2px 8px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', borderRadius: 2 }}>
                          <Star size={9} fill="#9b7011" /> Featured
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ fontSize: '13px', color: '#9a9585' }}>
                        <strong style={{ color: '#5a5650' }}>{event.category}</strong> · by {event.host}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px', color: '#9a9585' }}>
                        <Calendar size={11} style={{ color: '#e7b605' }} /> {event.date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px', color: '#9a9585' }}>
                        <MapPin size={11} style={{ color: '#e7b605' }} /> {event.location}
                      </span>
                      <span style={{ fontSize: '12px', color: '#9a9585' }}>Submitted: {event.submittedDate}</span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    <span style={{ background: s.bg, color: s.color, padding: '4px 12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 2 }}>
                      {s.label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {event.status === 'pending' && (
                      <>
                        <ActionBtn onClick={() => approve(event.id)} color="#27ae60" hoverColor="#1e8449" label="Approve" icon={<CheckCircle size={13} />} />
                        <ActionBtn onClick={() => reject(event.id)} color="#c0392b" hoverColor="#a93226" label="Reject" icon={<XCircle size={13} />} />
                        <FeatureBtn featured={event.featured} onClick={() => toggleFeatured(event.id)} />
                      </>
                    )}
                    {event.status === 'approved' && (
                      <>
                        <ActionBtn onClick={() => reject(event.id)} color="#c0392b" hoverColor="#a93226" label="Reject" icon={<XCircle size={13} />} />
                        <FeatureBtn featured={event.featured} onClick={() => toggleFeatured(event.id)} />
                      </>
                    )}
                    {event.status === 'rejected' && (
                      <ActionBtn onClick={() => approve(event.id)} color="#27ae60" hoverColor="#1e8449" label="Approve" icon={<CheckCircle size={13} />} />
                    )}
                  </div>
                </div>

                {/* Expanded detail panel */}
                {isExpanded && (
                  <div style={{ background: '#fafaf8', borderTop: '1px solid #e2e0d8', padding: '28px 32px 28px 52px' }}>
                    {/* Description */}
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#9a9585', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Description</div>
                      <p style={{ fontSize: '14px', color: '#3a3830', lineHeight: 1.7, margin: 0 }}>{event.description}</p>
                    </div>

                    {/* Details grid */}
                    <div className="admin-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px 32px', marginBottom: 24 }}>
                      <DetailField icon={<Clock size={13} />} label="Time" value={`${event.date} at ${event.time}`} />
                      <DetailField icon={<Clock size={13} />} label="Duration" value={event.duration} />
                      <DetailField icon={<Users size={13} />} label="Capacity" value={`${event.capacity} attendees`} />
                      <DetailField icon={<DollarSign size={13} />} label="Price / Tickets" value={event.price} />
                      <DetailField icon={<MapPin size={13} />} label="Location" value={event.isOnline ? 'Online Event' : event.location} />
                      <DetailField icon={<Mail size={13} />} label="Contact Email" value={event.hostEmail} />
                    </div>

                    {/* Tags */}
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#9a9585', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Tag size={11} /> Tags
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {event.tags.map(tag => (
                          <span key={tag} style={{ background: '#f0efe9', color: '#5a5650', padding: '4px 10px', fontSize: '12px', fontWeight: 600, borderRadius: 2 }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 12, fontSize: '12px', color: '#9a9585', textAlign: 'right' }}>
          Showing {filtered.length} of {events.length} events
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 32, right: 32, zIndex: 999,
          background: '#e7b605', color: '#000',
          padding: '14px 24px', fontFamily: 'DM Sans, sans-serif',
          fontWeight: 800, fontSize: '14px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          animation: 'fadeIn 0.2s ease',
        }}>
          {toast}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 640px) {
          .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}

function DetailField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 700, color: '#9a9585', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ color: '#e7b605' }}>{icon}</span> {label}
      </div>
      <div style={{ fontSize: '14px', color: '#3a3830', fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function ActionBtn({
  onClick, color, hoverColor, label, icon,
}: {
  onClick: () => void;
  color: string;
  hoverColor: string;
  label: string;
  icon: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '7px 14px', border: 'none', cursor: 'pointer',
        background: hovered ? hoverColor : color,
        color: '#fff', fontFamily: 'DM Sans, sans-serif',
        fontWeight: 700, fontSize: '12px', letterSpacing: '0.04em',
        transition: 'background 0.15s', borderRadius: 2,
      }}
    >
      {icon} {label}
    </button>
  );
}

function FeatureBtn({ featured, onClick }: { featured: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '7px 14px', border: `1px solid ${featured ? '#e7b605' : '#e2e0d8'}`,
        cursor: 'pointer',
        background: featured ? (hovered ? '#f0d000' : '#e7b605') : (hovered ? '#f0efe9' : '#fff'),
        color: featured ? '#000' : '#9a9585',
        fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px',
        letterSpacing: '0.04em', transition: 'all 0.15s', borderRadius: 2,
      }}
    >
      <Star size={12} fill={featured ? '#000' : 'none'} stroke={featured ? '#000' : '#9a9585'} />
      {featured ? 'Unfeature' : 'Feature'}
    </button>
  );
}
