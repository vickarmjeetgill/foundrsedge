'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users, LayoutDashboard, ClipboardList, Tag, Trophy, Flag,
  LogOut, Search, UserCheck, UserX, Repeat, ShieldCheck, X,
} from 'lucide-react';
import Logo from '@/components/Logo';

type Role = 'MEMBER' | 'ADMIN';
type Status = 'active' | 'suspended';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  joined: string;        // ISO date
  business?: string;
};

const ROLES: Role[] = ['MEMBER', 'ADMIN'];

const roleStyles: Record<Role, { bg: string; color: string }> = {
  MEMBER: { bg: '#f0efe9',              color: '#5a5650' },
  ADMIN:  { bg: 'rgba(231,182,5,0.14)', color: '#9b7011' },
};

type TabFilter = 'All' | 'Members' | 'Admins' | 'Suspended';
const tabs: TabFilter[] = ['All', 'Members', 'Admins', 'Suspended'];

const navLinkBase: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8,
  padding: '14px 20px', fontFamily: 'DM Sans, sans-serif',
  fontWeight: 700, fontSize: '13px', letterSpacing: '0.05em',
  textTransform: 'uppercase', textDecoration: 'none',
  color: '#888', borderBottom: '2px solid transparent', transition: 'all 0.2s',
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers]   = useState<AdminUser[]>([]);
  const [tab, setTab]       = useState<TabFilter>('All');
  const [search, setSearch] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [toast, setToast]   = useState<string | null>(null);
  const [impersonateTarget, setImpersonateTarget] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('fe_admin') !== 'true') {
        router.push('/');
      } else {
        setAuthChecked(true);
      }
    }
  }, [router]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function changeRole(id: string, role: Role) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    const u = users.find(x => x.id === id);
    showToast(`${u?.name ?? 'User'} is now ${role}`);
  }

  function toggleStatus(id: string) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
    const u = users.find(x => x.id === id);
    const next = u?.status === 'active' ? 'suspended' : 'reactivated';
    showToast(`${u?.name ?? 'User'} ${next === 'suspended' ? 'suspended' : 'reactivated'}`);
  }

  function confirmImpersonate() {
    if (!impersonateTarget) return;
    showToast(`Now impersonating ${impersonateTarget.name} (UI only)`);
    setImpersonateTarget(null);
  }

  const stats = {
    total:     users.length,
    members:   users.filter(u => u.role === 'MEMBER').length,
    admins:    users.filter(u => u.role === 'ADMIN').length,
    suspended: users.filter(u => u.status === 'suspended').length,
  };

  const filtered = users.filter(u => {
    const matchTab =
      tab === 'All' ||
      (tab === 'Members' && u.role === 'MEMBER') ||
      (tab === 'Admins' && u.role === 'ADMIN') ||
      (tab === 'Suspended' && u.status === 'suspended');
    const q = search.trim().toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.business ?? '').toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  if (!authChecked) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#e7b605', fontFamily: 'DM Sans, sans-serif', fontWeight: 700 }}>Checking access...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f7', fontFamily: 'DM Sans, sans-serif' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#000', color: '#fff', padding: '14px 24px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', zIndex: 500, boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
          {toast}
        </div>
      )}

      {/* Impersonate confirm modal */}
      {impersonateTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400, padding: 20 }}>
          <div style={{ background: '#fff', padding: '36px', maxWidth: 460, width: '100%', position: 'relative' }}>
            <button onClick={() => setImpersonateTarget(null)} aria-label="Close" style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#9a9585' }}>
              <X size={18} />
            </button>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#9b7011', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Impersonate User</div>
            <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '20px', marginBottom: 8, color: '#2a2820' }}>View as {impersonateTarget.name}?</h3>
            <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '14px', lineHeight: 1.6, marginBottom: 24 }}>
              You'll see the platform exactly as <strong>{impersonateTarget.name}</strong> ({impersonateTarget.email}) sees it. Use this to debug member issues, then exit impersonation to return to your admin account.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={confirmImpersonate} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#e7b605', border: 'none', color: '#000', fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '13px', cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                <Repeat size={14} /> Start Impersonating
              </button>
              <button onClick={() => setImpersonateTarget(null)} style={{ padding: '12px 20px', border: '1px solid #e2e0d8', background: 'transparent', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', cursor: 'pointer', color: '#5a5650' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div style={{ background: '#000', borderBottom: '1px solid #1a1a1a', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/" style={{ textDecoration: 'none' }}><Logo size="sm" /></Link>
          <div style={{ width: 1, height: 24, background: '#2a2a2a' }} />
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin Panel</span>
        </div>
        <button onClick={() => { localStorage.removeItem('fe_admin'); window.location.href = '/'; }} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: '1px solid #2a2a2a', color: '#888', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 16px', cursor: 'pointer' }}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>

      {/* Secondary Nav */}
      <div style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', display: 'flex', gap: 0, flexWrap: 'wrap' }}>
          <Link href="/admin/dashboard" style={navLinkBase}
            onMouseEnter={e => { e.currentTarget.style.color = '#ccc'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}>
            <LayoutDashboard size={14} /> Content Manager
          </Link>
          <Link href="/admin/events" style={navLinkBase}
            onMouseEnter={e => { e.currentTarget.style.color = '#ccc'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}>
            <ClipboardList size={14} /> Review Events
          </Link>
          <Link href="/admin/offers" style={navLinkBase}
            onMouseEnter={e => { e.currentTarget.style.color = '#ccc'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}>
            <Tag size={14} /> Review Offers
          </Link>
          <Link href="/admin/awards" style={navLinkBase}
            onMouseEnter={e => { e.currentTarget.style.color = '#ccc'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}>
            <Trophy size={14} /> Review Awards
          </Link>
          <Link href="/admin/flagged" style={navLinkBase}
            onMouseEnter={e => { e.currentTarget.style.color = '#ccc'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}>
            <Flag size={14} /> Flagged Content
          </Link>
          <Link href="/admin/users" style={{ ...navLinkBase, color: '#e7b605', borderBottom: '2px solid #e7b605' }}>
            <Users size={14} /> Users
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px' }}>

        {/* Stats */}
        <div className="grid-4" style={{ gap: 2, marginBottom: 32 }}>
          {[
            { label: 'Total Users', value: stats.total,     color: '#2a2820' },
            { label: 'Members',     value: stats.members,   color: '#5a5650' },
            { label: 'Admins',      value: stats.admins,    color: '#9b7011' },
            { label: 'Suspended',   value: stats.suspended, color: '#c0392b' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #e2e0d8', padding: '24px 28px' }}>
              <div style={{ fontSize: '32px', fontWeight: 900, color: s.color, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#9a9585', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: '#fff', border: '1px solid #e2e0d8' }}>
          {/* Tabs + search */}
          <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #e2e0d8', padding: '0 24px', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex' }}>
              {tabs.map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ padding: '14px 18px', background: 'none', border: 'none', borderBottom: tab === t ? '2px solid #e7b605' : '2px solid transparent', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', color: tab === t ? '#2a2820' : '#9a9585', cursor: 'pointer', marginBottom: -1, transition: 'all 0.15s' }}>
                  {t}
                  <span style={{ marginLeft: 6, fontSize: '11px', opacity: 0.7 }}>
                    ({t === 'All' ? stats.total : t === 'Members' ? stats.members : t === 'Admins' ? stats.admins : stats.suspended})
                  </span>
                </button>
              ))}
            </div>
            <div style={{ position: 'relative', marginLeft: 'auto', minWidth: 220, flex: '0 1 280px' }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9a9585' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search name, email, business…"
                style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px 9px 34px', border: '1px solid #e2e0d8', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', outline: 'none' }}
              />
            </div>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 40px' }}>
              <Users size={36} style={{ color: '#e2e0d8', marginBottom: 16 }} />
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '16px', color: '#9a9585', marginBottom: 8 }}>No users found</div>
              <div style={{ fontFamily: 'Noto Serif, serif', color: '#b8b4ae', fontSize: '14px' }}>Try a different tab or search term.</div>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px 120px 110px 260px', gap: 0, padding: '12px 24px', background: '#f9f9f7', borderBottom: '1px solid #e2e0d8' }}>
                {['User', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                  <div key={h} style={{ fontSize: '11px', fontWeight: 700, color: '#9a9585', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
                ))}
              </div>

              {filtered.map(u => {
                const rs = roleStyles[u.role];
                const suspended = u.status === 'suspended';
                return (
                  <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '1fr 150px 120px 110px 260px', gap: 0, padding: '14px 24px', borderBottom: '1px solid #f0efe9', alignItems: 'center', opacity: suspended ? 0.7 : 1 }}>
                    {/* User */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingRight: 16, minWidth: 0 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#000', color: '#e7b605', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '15px', flexShrink: 0 }}>
                        {u.name.charAt(0)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#2a2820', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
                        <div style={{ fontSize: '12px', color: '#9a9585', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                      </div>
                    </div>

                    {/* Role — inline editable */}
                    <div>
                      <select
                        value={u.role}
                        onChange={e => changeRole(u.id, e.target.value as Role)}
                        style={{ padding: '6px 8px', border: '1px solid #e2e0d8', background: rs.bg, color: rs.color, fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', cursor: 'pointer', outline: 'none', borderRadius: 2 }}
                      >
                        {ROLES.map(r => <option key={r} value={r} style={{ background: '#fff', color: '#2a2820' }}>{r}</option>)}
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: suspended ? 'rgba(192,57,43,0.1)' : 'rgba(39,174,96,0.1)', color: suspended ? '#c0392b' : '#27ae60', fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: suspended ? '#c0392b' : '#27ae60' }} />
                        {suspended ? 'Suspended' : 'Active'}
                      </span>
                    </div>

                    {/* Joined */}
                    <div style={{ fontSize: '13px', color: '#9a9585' }}>
                      {new Date(u.joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button onClick={() => setImpersonateTarget(u)} title="Impersonate user" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 12px', border: '1px solid #e2e0d8', background: 'transparent', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '11px', cursor: 'pointer', color: '#5a5650', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#e7b605'; e.currentTarget.style.color = '#9b7011'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e0d8'; e.currentTarget.style.color = '#5a5650'; }}>
                        <Repeat size={13} /> Impersonate
                      </button>
                      {suspended ? (
                        <button onClick={() => toggleStatus(u.id)} title="Reactivate account" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 12px', border: '1px solid #e2e0d8', background: 'transparent', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '11px', cursor: 'pointer', color: '#27ae60', transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#27ae60'; e.currentTarget.style.background = 'rgba(39,174,96,0.06)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e0d8'; e.currentTarget.style.background = 'transparent'; }}>
                          <UserCheck size={13} /> Activate
                        </button>
                      ) : (
                        <button onClick={() => toggleStatus(u.id)} title="Suspend account" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 12px', border: '1px solid #e2e0d8', background: 'transparent', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '11px', cursor: 'pointer', color: '#c0392b', transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#c0392b'; e.currentTarget.style.background = 'rgba(192,57,43,0.06)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e0d8'; e.currentTarget.style.background = 'transparent'; }}>
                          <UserX size={13} /> Suspend
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Legend */}
        <div style={{ marginTop: 24, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            { icon: <ShieldCheck size={14} style={{ color: '#9b7011' }} />, label: 'Role — change a user’s access level' },
            { icon: <Repeat size={14} />, label: 'Impersonate — view the platform as that user' },
            { icon: <UserX size={14} style={{ color: '#c0392b' }} />, label: 'Suspend — block account access' },
            { icon: <UserCheck size={14} style={{ color: '#27ae60' }} />, label: 'Activate — restore a suspended account' },
          ].map(({ icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', color: '#9a9585', fontFamily: 'DM Sans, sans-serif' }}>
              {icon} {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
