'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Settings, Calendar, Building2, Users, BookOpen, Trophy, Star, ChevronRight, TrendingUp, MessageSquare, Zap, LogOut, User, Plus, Pencil, Trash2 } from 'lucide-react';
import Logo from '@/components/Logo';
import { supabase } from '@/lib/supabase';
import { logout } from '@/app/actions/auth';
import { getProfile } from '@/app/actions/profile';

const defaultMember = {
  name: 'Loading User',
  business: 'Loading Business',
  industry: 'Member',
  joined: 'May 2026',
  profileCompletion: 85,
};

const recommendations = {
  events: [
    { title: 'YYC Founders Mixer', date: 'Jun 12', type: 'Networking', match: 95 },
    { title: 'Scale-Up Workshop', date: 'Jun 18', type: 'Workshop', match: 88 },
  ],
  matches: [
    { name: 'Sarah K.', business: 'Pinnacle Marketing', reason: 'Your ideal referral partner type', mutual: 3 },
    { name: 'Amanda C.', business: 'Foothills Financial', reason: 'Serves your ideal client base', mutual: 2 },
  ],
  resources: [
    { title: 'Alberta Investor Tax Credit', category: 'Funding', relevance: 'High match for Grow stage' },
    { title: 'BDC Growth Capital', category: 'Financing', relevance: 'Matches your revenue range' },
  ],
};

const navItems = [
  { icon: TrendingUp, label: 'Dashboard', href: '/dashboard', active: true },
  { icon: Calendar, label: 'Events', href: '/events' },
  { icon: Building2, label: 'Directory', href: '/directory' },
  { icon: Users, label: 'My Matches', href: '/dashboard/matches' },
  { icon: BookOpen, label: 'Resources', href: '/resources' },
  { icon: Trophy, label: 'Awards', href: '/awards' },
  { icon: Star, label: 'Supper Club', href: '/supper-club' },
];

type Submission = {
  id: string;
  title: string;
  category: string;
  submittedAt: string;
  updatedAt?: string;
  status: 'pending' | 'approved' | 'rejected';
};

const statusStyles: Record<Submission['status'], { bg: string; color: string; label: string }> = {
  pending:  { bg: 'rgba(230,126,34,0.1)', color: '#e67e22', label: 'Pending Review' },
  approved: { bg: 'rgba(39,174,96,0.1)',  color: '#27ae60', label: 'Approved' },
  rejected: { bg: 'rgba(192,57,43,0.1)',  color: '#c0392b', label: 'Rejected' },
};

export default function DashboardPage() {
  const [member, setMember] = useState(defaultMember);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const loadMemberData = async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select(`
        business_name,
        business_type,
        created_at,
        members (
          first_name,
          last_name,
          industry
        )
      `)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Dashboard data error:', error.message);
        return;
      }
      if (!data) return;

      const memberData = Array.isArray(data.members)
        ? data.members[0]
        : data.members;

      setMember({
        name: `${memberData?.first_name ?? ''} ${memberData?.last_name ?? ''}`.trim() || 'Member',
        business: data.business_name ?? 'Business',
        industry: memberData?.industry ?? 'N/A',
        joined: data.created_at
          ? new Date(data.created_at).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          })
          : 'N/A',
        profileCompletion: 85,
      });
    };

    const loadProfile = async () => {
      const res = await getProfile();
      if (res.success && res.user) {
        setUserProfile(res.user);

        setMember(prev => ({
          ...prev,
          name: (res.user as any).name || prev.name,
          business: 'Founders Edge Member',
          industry: 'Member',
        }));
      }
    };

    const loadSubmissions = () => {
      const raw = localStorage.getItem('fe_my_submissions');
      if (raw) {
        try { setMySubmissions(JSON.parse(raw)); } catch {}
      }
    };

    // loadMemberData();
    loadProfile();
    loadSubmissions();
  }, []);

  function deleteSubmission(id: string) {
    const updated = mySubmissions.filter(s => s.id !== id);
    setMySubmissions(updated);
    localStorage.setItem('fe_my_submissions', JSON.stringify(updated));
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9f9f7' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, background: '#000', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #1a1a1a' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Logo size="sm" />
          </Link>
        </div>

        {/* Member Profile */}
        <div style={{ padding: '24px', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            {userProfile?.avatarUrl ? (
              <img
                src={userProfile.avatarUrl}
                alt={member.name}
                style={{ width: 44, height: 44, objectFit: 'cover', flexShrink: 0 }}
              />
            ) : (
              <div style={{ width: 44, height: 44, background: '#e7b605', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: '18px', color: '#000', flexShrink: 0 }}>
                {member.name.charAt(0)}
              </div>
            )}
            <div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '14px', color: '#fff' }}>{member.name}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>{member.business}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ padding: '3px 10px', background: '#1a1a1a', color: '#888', fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em' }}>{member.industry}</span>
          </div>
          {/* Profile completion */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '11px', color: '#666' }}>Profile completion</span>
              <span style={{ fontSize: '11px', color: '#e7b605', fontWeight: 700 }}>{member.profileCompletion}%</span>
            </div>
            <div style={{ height: 3, background: '#1a1a1a', borderRadius: 2 }}>
              <div style={{ height: '100%', width: `${member.profileCompletion}%`, background: 'linear-gradient(90deg, #9b7011, #e7b605)', borderRadius: 2, transition: 'width 1s ease' }} />
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
          {navItems.map(item => (
            <Link key={item.label} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 24px', textDecoration: 'none',
              background: item.active ? 'rgba(231,182,5,0.1)' : 'transparent',
              borderLeft: item.active ? '3px solid #e7b605' : '3px solid transparent',
              color: item.active ? '#e7b605' : '#888',
              fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px',
              letterSpacing: '0.03em', transition: 'all 0.2s',
            }}>
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '16px 0', borderTop: '1px solid #1a1a1a' }}>
          <Link href="/dashboard/settings" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', textDecoration: 'none', color: '#666', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px' }}>
            <Settings size={16} /> Settings
          </Link>
          <button
            onClick={async () => {
              await logout();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 24px',
              textDecoration: 'none',
              color: '#666',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left'
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 260, flex: 1, padding: '0' }}>
        {/* Top bar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e2e0d8', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
          <div>
            <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '22px' }}>Good morning, {member.name.split(' ')[0]} 👋</h1>
            <div style={{ fontSize: '13px', color: '#9a9585' }}>Member since {member.joined}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ width: 40, height: 40, background: '#f9f9f7', border: '1px solid #e2e0d8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <Bell size={18} style={{ color: '#5a5650' }} />
              <div style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, background: '#e7b605', borderRadius: '50%' }} />
            </button>
            {userProfile?.avatarUrl ? (
              <img
                src={userProfile.avatarUrl}
                alt={member.name}
                style={{ width: 40, height: 40, objectFit: 'cover', border: '1px solid #e2e0d8', cursor: 'pointer' }}
              />
            ) : (
              <div style={{ width: 40, height: 40, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e7b605', fontWeight: 800, fontSize: '16px', cursor: 'pointer' }}>
                {member.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: '40px' }}>
          {/* Stats row */}
          <div className="grid-4" style={{ gap: 2, marginBottom: 32 }}>
            {[
              { label: 'Profile Views', value: '142', change: '+18% this month', icon: User },
              { label: 'Connections Made', value: '8', change: '3 new this month', icon: Users },
              { label: 'Events Attended', value: '5', change: '2 upcoming', icon: Calendar },
              { label: 'Resources Saved', value: '12', change: 'Updated weekly', icon: BookOpen },
            ].map(stat => (
              <div key={stat.label} style={{ background: '#fff', border: '1px solid #e2e0d8', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <span style={{ fontSize: '12px', color: '#9a9585', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
                  <stat.icon size={16} style={{ color: '#e7b605' }} />
                </div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: '32px', lineHeight: 1, marginBottom: 6 }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: '#9a9585' }}>{stat.change}</div>
              </div>
            ))}
          </div>

          <div className="grid-2" style={{ marginBottom: 2 }}>
            {/* Recommended Events */}
            <div style={{ background: '#fff', border: '1px solid #e2e0d8', padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '18px' }}>Recommended Events</h2>
                <Link href="/events" style={{ color: '#e7b605', fontSize: '13px', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View all <ChevronRight size={14} /></Link>
              </div>
              {recommendations.events.map((e, i) => (
                <div key={i} style={{ padding: '16px 0', borderBottom: i < recommendations.events.length - 1 ? '1px solid #f0efe9' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: 4 }}>{e.title}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: '12px', color: '#9a9585' }}><Calendar size={11} style={{ display: 'inline', marginRight: 4 }} />{e.date}</span>
                      <span className="tag" style={{ padding: '2px 8px', fontSize: '10px' }}>{e.type}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#9a9585', marginBottom: 4 }}>Match</div>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: '18px', color: '#e7b605' }}>{e.match}%</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Smart Matches */}
            <div style={{ background: '#fff', border: '1px solid #e2e0d8', padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '18px' }}>Your Matches</h2>
                  <span style={{ padding: '2px 8px', background: '#e7b605', color: '#000', fontSize: '10px', fontWeight: 800 }}>NEW</span>
                </div>
              </div>
              {recommendations.matches.map((m, i) => (
                <div key={i} style={{ padding: '16px 0', borderBottom: i < recommendations.matches.length - 1 ? '1px solid #f0efe9' : 'none', display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 40, height: 40, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e7b605', fontWeight: 800, fontSize: '16px', flexShrink: 0 }}>
                    {m.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>{m.name}</div>
                    <div style={{ fontSize: '12px', color: '#9a9585', marginBottom: 2 }}>{m.business}</div>
                    <div style={{ fontSize: '11px', color: '#9b7011' }}>{m.reason}</div>
                  </div>
                  <button className="btn-primary" style={{ padding: '8px 14px', fontSize: '11px', flexShrink: 0 }}>
                    <MessageSquare size={12} /> Connect
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid-2" style={{ marginTop: 2 }}>
            {/* Resources */}
            <div style={{ background: '#fff', border: '1px solid #e2e0d8', padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '18px' }}>Curated for You</h2>
                <Link href="/resources" style={{ color: '#e7b605', fontSize: '13px', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View all <ChevronRight size={14} /></Link>
              </div>
              {recommendations.resources.map((r, i) => (
                <div key={i} style={{ padding: '16px 0', borderBottom: i < recommendations.resources.length - 1 ? '1px solid #f0efe9' : 'none' }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                    <span className="tag">{r.category}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: 4 }}>{r.title}</div>
                  <div style={{ fontSize: '12px', color: '#9b7011' }}>{r.relevance}</div>
                </div>
              ))}
            </div>

            {/* Upcoming */}
            <div style={{ background: '#000', padding: '28px', color: '#fff' }}>
              <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '18px', color: '#fff', marginBottom: 20 }}>Q3 Supper Club</h2>
              <div style={{ background: '#111', border: '1px solid #1a1a1a', borderLeft: '3px solid #e7b605', padding: '20px', marginBottom: 16 }}>
                <div style={{ fontSize: '11px', color: '#e7b605', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Invite · Jul 15, 2025</div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Exits & New Beginnings</div>
                <div style={{ fontSize: '13px', color: '#888' }}>Anju Restaurant · 7:00 PM</div>
                <div style={{ fontSize: '13px', color: '#e7b605', marginTop: 8, fontWeight: 700 }}>2 spots remaining</div>
              </div>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Reserve My Spot <Zap size={16} />
              </button>
            </div>
          </div>

          {/* My Event Submissions */}
          <div style={{ marginTop: 2, background: '#fff', border: '1px solid #e2e0d8', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '18px' }}>My Event Submissions</h2>
              <Link href="/events/submit" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#e7b605', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
                <Plus size={14} /> Submit New Event
              </Link>
            </div>

            {mySubmissions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', borderTop: '1px solid #f0efe9' }}>
                <Calendar size={32} style={{ color: '#e2e0d8', marginBottom: 12 }} />
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '15px', color: '#9a9585', marginBottom: 8 }}>No submissions yet</div>
                <div style={{ fontSize: '13px', color: '#b8b4ae', fontFamily: 'Noto Serif, serif', marginBottom: 20 }}>
                  Have an event for the Founders Edge community? Submit it for review.
                </div>
                <Link href="/events/submit" className="btn-primary" style={{ justifyContent: 'center', display: 'inline-flex' }}>
                  Submit an Event
                </Link>
              </div>
            ) : (
              <div>
                {mySubmissions.map((sub, i) => {
                  const s = statusStyles[sub.status];
                  const canEdit = sub.status !== 'approved';
                  return (
                    <div key={sub.id} style={{ padding: '16px 0', borderTop: '1px solid #f0efe9', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: '#2a2820', marginBottom: 4 }}>{sub.title}</div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          <span className="tag" style={{ fontSize: '10px', padding: '2px 8px' }}>{sub.category}</span>
                          <span style={{ fontSize: '12px', color: '#9a9585' }}>
                            Submitted {new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          {sub.updatedAt && (
                            <span style={{ fontSize: '12px', color: '#9a9585' }}>
                              · Updated {new Date(sub.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                        <span style={{ background: s.bg, color: s.color, padding: '4px 12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 2 }}>
                          {s.label}
                        </span>
                        {canEdit && (
                          <Link
                            href={`/events/submit?edit=${sub.id}`}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'transparent', border: '1px solid #e2e0d8', color: '#555', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', textDecoration: 'none', letterSpacing: '0.04em', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#e7b605'; e.currentTarget.style.color = '#e7b605'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e0d8'; e.currentTarget.style.color = '#555'; }}
                          >
                            <Pencil size={12} /> Edit
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('Delete this submission? This cannot be undone.')) {
                              deleteSubmission(sub.id);
                            }
                          }}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'transparent', border: '1px solid #e2e0d8', color: '#9a9585', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.04em', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#c0392b'; e.currentTarget.style.color = '#c0392b'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e0d8'; e.currentTarget.style.color = '#9a9585'; }}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
