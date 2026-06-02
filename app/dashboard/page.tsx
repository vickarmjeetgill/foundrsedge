'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Settings, Calendar, Building2, Users, BookOpen, Trophy, Star,
  ChevronRight, TrendingUp, MessageSquare, Zap, LogOut, User,
  Plus, Pencil, Trash2, Tag, ExternalLink, CheckCircle,
  UserCircle, Globe, MapPin, Rss,
} from 'lucide-react';
import FeedSection from './FeedSection';
import NotificationBell from './NotificationBell';
import type { Nomination } from '@/app/awards/nominate/page';
import Logo from '@/components/Logo';
import { supabase } from '@/lib/supabase';
import { logout } from '@/app/actions/auth';
import { getProfile } from '@/app/actions/profile';

type Section = 'dashboard' | 'feed' | 'events' | 'offers' | 'awards' | 'business' | 'owners';

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

// Nav items: `section` = stay on dashboard and switch view; `href` = navigate away
const navItems: { icon: React.ElementType; label: string; section?: Section; href?: string }[] = [
  { icon: TrendingUp, label: 'Dashboard',  section: 'dashboard' },
  { icon: Rss,        label: 'Feed',       section: 'feed' },
  { icon: Calendar,   label: 'Events',     section: 'events' },
  { icon: Tag,        label: 'Offers',     section: 'offers' },
  { icon: Trophy,     label: 'Awards',     section: 'awards' },
  { icon: Building2,  label: 'Business',   section: 'business' },
  { icon: UserCircle, label: 'Owners',     section: 'owners' },
  { icon: Users,      label: 'My Matches', href: '/dashboard/matches' },
  { icon: BookOpen,   label: 'Resources',  href: '/resources' },
  { icon: Star,       label: 'Supper Club', href: '/supper-club' },
];

type Submission = {
  id: string;
  title: string;
  category: string;
  submittedAt: string;
  updatedAt?: string;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
};

type MyOffer = {
  id: string;
  title: string;
  discount: string;
  category: string;
  type: string;
  expiryDate?: string;
  submittedAt: string;
  updatedAt?: string;
  status: 'pending' | 'approved' | 'rejected';
};
const statusStyles: Record<'pending' | 'approved' | 'rejected' | 'archived', { bg: string; color: string; label: string }> = {
  pending:  { bg: 'rgba(230,126,34,0.1)', color: '#e67e22', label: 'Pending Review' },
  approved: { bg: 'rgba(39,174,96,0.1)',  color: '#27ae60', label: 'Approved' },
  rejected: { bg: 'rgba(192,57,43,0.1)',  color: '#c0392b', label: 'Rejected' },
  archived: { bg: 'rgba(90,86,80,0.1)',    color: '#5a5650', label: 'Archived' },
};

const sectionTitles: Record<Section, string> = {
  dashboard: 'Dashboard',
  feed:      'Community Feed',
  events:    'My Events',
  offers:    'My Offers',
  awards:    'My Awards',
  business:  'Business Profiles',
  owners:    'Owner Network',
};

// ── Shared label style ───────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: 'DM Sans, sans-serif', fontWeight: 700,
  fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase',
  marginBottom: 8, color: '#2a2820',
};

// ── Profile types ────────────────────────────────────────────────
type BusinessProfile = {
  id: string; name: string; industry: string; location: string;
  description: string; website?: string; lookingFor?: string;
  tags: string[]; createdAt: string;
};

type OwnerProfile = {
  id: string; name: string; title: string; business: string;
  bio: string; lookingFor?: string; tags: string[]; createdAt: string;
};

type OwnerPost = {
  id: string; ownerName: string; business: string;
  type: 'seeking' | 'offering'; headline: string; details: string;
  tags: string[]; postedAt: string; isOwn?: boolean;
};

const bizIndustries = [
  'Technology', 'Professional Services', 'Manufacturing', 'Marketing Agency',
  'E-commerce', 'Finance', 'Legal', 'Health & Wellness', 'Construction', 'B2B SaaS', 'Other',
];

// ── Business Section ─────────────────────────────────────────────
function BusinessSection({ memberBusiness }: { memberBusiness: string }) {
  const [myProfile, setMyProfile] = useState<BusinessProfile | null>(null);
  const [allProfiles, setAllProfiles] = useState<BusinessProfile[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: '', industry: 'Technology', location: 'Calgary, AB',
    description: '', website: '', lookingFor: '', tags: '',
  });

  useEffect(() => {
    const myRaw = localStorage.getItem('fe_my_biz_profile');
    if (myRaw) {
      try {
        const p: BusinessProfile = JSON.parse(myRaw);
        setMyProfile(p);
        setForm({ name: p.name, industry: p.industry, location: p.location, description: p.description, website: p.website || '', lookingFor: p.lookingFor || '', tags: p.tags.join(', ') });
      } catch { }
    } else {
      setEditMode(true);
      setForm(f => ({ ...f, name: memberBusiness !== 'Founders Edge Member' ? memberBusiness : '' }));
    }
    const allRaw = localStorage.getItem('fe_biz_profiles');
    if (allRaw) { try { setAllProfiles(JSON.parse(allRaw)); } catch { } }
  }, [memberBusiness]);

  function saveProfile() {
    if (!form.name.trim() || !form.description.trim()) return;
    const profile: BusinessProfile = {
      id: myProfile?.id || `biz_${Date.now()}`,
      name: form.name, industry: form.industry, location: form.location,
      description: form.description, website: form.website,
      lookingFor: form.lookingFor,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: myProfile?.createdAt || new Date().toISOString(),
    };
    localStorage.setItem('fe_my_biz_profile', JSON.stringify(profile));
    const existing: BusinessProfile[] = JSON.parse(localStorage.getItem('fe_biz_profiles') || '[]');
    const idx = existing.findIndex(p => p.id === profile.id);
    const updated = idx >= 0 ? existing.map(p => p.id === profile.id ? profile : p) : [...existing, profile];
    localStorage.setItem('fe_biz_profiles', JSON.stringify(updated));
    setMyProfile(profile); setAllProfiles(updated); setEditMode(false);
  }

  const otherProfiles = myProfile ? allProfiles.filter(p => p.id !== myProfile.id) : allProfiles;

  return (
    <div style={{ padding: '40px' }}>
      {/* My Business Profile */}
      <div style={{ background: '#fff', border: '1px solid #e2e0d8', padding: '28px', marginBottom: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '22px', marginBottom: 4 }}>My Business Profile</h2>
            <div style={{ fontSize: '13px', color: '#9a9585' }}>Visible to all Founders Edge members</div>
          </div>
          {myProfile && !editMode && (
            <button onClick={() => setEditMode(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', border: '1px solid #e2e0d8', background: 'transparent', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', cursor: 'pointer', color: '#5a5650', transition: 'all 0.2s' }}>
              <Pencil size={13} /> Edit Profile
            </button>
          )}
        </div>

        {editMode ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Business Name *</label>
                <input className="input-field" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your business name" style={{ margin: 0 }} />
              </div>
              <div>
                <label style={labelStyle}>Industry</label>
                <select className="select-field" value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}>
                  {bizIndustries.map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <input className="input-field" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Calgary, AB" style={{ margin: 0 }} />
              </div>
              <div>
                <label style={labelStyle}>Website</label>
                <input className="input-field" type="url" value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} placeholder="https://yourbusiness.com" style={{ margin: 0 }} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Business Description *</label>
              <textarea className="input-field" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="What does your business do? Who do you serve?" rows={3} style={{ resize: 'vertical', fontFamily: 'Noto Serif, serif' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Currently Looking For</label>
              <input className="input-field" value={form.lookingFor} onChange={e => setForm(p => ({ ...p, lookingFor: e.target.value }))} placeholder="e.g. Looking to hire a sales lead, seeking a strategic partner in tech..." style={{ margin: 0 }} />
              <div style={{ fontSize: '12px', color: '#9a9585', marginTop: 6, fontFamily: 'Noto Serif, serif' }}>Optional — let other members know what your business needs right now.</div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Tags (comma-separated)</label>
              <input className="input-field" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="e.g. SaaS, B2B, Growth, Calgary, Tech" style={{ margin: 0 }} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={saveProfile} className="btn-primary" style={{ padding: '12px 28px', fontSize: '13px' }}>Save Business Profile</button>
              {myProfile && (
                <button onClick={() => setEditMode(false)} style={{ padding: '12px 24px', border: '1px solid #e2e0d8', background: 'transparent', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', cursor: 'pointer', color: '#5a5650' }}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : myProfile ? (
          <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '22px', marginBottom: 10 }}>{myProfile.name}</h3>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
                <span className="tag">{myProfile.industry}</span>
                {myProfile.location && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '13px', color: '#9a9585' }}>
                    <MapPin size={12} style={{ color: '#e7b605' }} />{myProfile.location}
                  </span>
                )}
              </div>
              <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '14px', lineHeight: 1.7, marginBottom: 16 }}>{myProfile.description}</p>
              {myProfile.website && (
                <a href={myProfile.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#9b7011', fontSize: '13px', fontWeight: 700, textDecoration: 'none', marginBottom: 16 }}>
                  <Globe size={14} /> {myProfile.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              {myProfile.lookingFor && (
                <div style={{ padding: '12px 16px', background: 'rgba(231,182,5,0.06)', borderLeft: '3px solid #e7b605' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#9b7011', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Currently Looking For</div>
                  <div style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '14px' }}>{myProfile.lookingFor}</div>
                </div>
              )}
            </div>
            {myProfile.tags.length > 0 && (
              <div style={{ flexShrink: 0 }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#9a9585', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Services & Tags</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', maxWidth: 220 }}>
                  {myProfile.tags.map(t => (
                    <span key={t} style={{ padding: '3px 10px', background: '#f0efe9', fontSize: '11px', color: '#5a5650', fontWeight: 600, borderRadius: 2 }}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Business Directory */}
      <div style={{ background: '#fff', border: '1px solid #e2e0d8', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '22px', marginBottom: 4 }}>Member Businesses</h2>
            <div style={{ fontSize: '13px', color: '#9a9585' }}>{otherProfiles.length} other business{otherProfiles.length !== 1 ? 'es' : ''} in the network</div>
          </div>
        </div>
        {otherProfiles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', borderTop: '1px solid #f0efe9' }}>
            <Building2 size={40} style={{ color: '#e2e0d8', marginBottom: 16 }} />
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '16px', color: '#9a9585', marginBottom: 8 }}>No other businesses yet</div>
            <div style={{ fontSize: '14px', color: '#b8b4ae', fontFamily: 'Noto Serif, serif' }}>Other member business profiles will appear here once created.</div>
          </div>
        ) : (
          <div className="grid-2">
            {otherProfiles.map(p => (
              <div key={p.id} className="card" style={{ borderLeft: '4px solid transparent' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span className="tag">{p.industry}</span>
                  {p.location && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '12px', color: '#9a9585' }}>
                      <MapPin size={11} style={{ color: '#e7b605' }} />{p.location}
                    </span>
                  )}
                </div>
                <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '18px', marginBottom: 8 }}>{p.name}</h3>
                <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '14px', lineHeight: 1.7, marginBottom: 12 }}>{p.description}</p>
                {p.lookingFor && (
                  <div style={{ marginBottom: 12, padding: '10px 14px', background: 'rgba(231,182,5,0.06)', borderLeft: '3px solid #e7b605' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#9b7011', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>Looking For</div>
                    <div style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '13px' }}>{p.lookingFor}</div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                  {p.tags.map(t => <span key={t} style={{ padding: '3px 8px', background: '#f0efe9', fontSize: '11px', color: '#5a5650', fontWeight: 600, borderRadius: 2 }}>{t}</span>)}
                </div>
                <div style={{ display: 'flex', gap: 10, paddingTop: 16, borderTop: '1px solid #f0efe9' }}>
                  {p.website && (
                    <a href={p.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', border: '1px solid #e2e0d8', color: '#5a5650', fontSize: '12px', fontWeight: 700, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>
                      <Globe size={12} /> Website
                    </a>
                  )}
                  <button className="btn-primary" style={{ padding: '7px 14px', fontSize: '12px' }}>
                    <MessageSquare size={12} /> Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Owners Section ───────────────────────────────────────────────
function OwnersSection({ memberName, memberBusiness }: { memberName: string; memberBusiness: string }) {
  const [myProfile, setMyProfile] = useState<OwnerProfile | null>(null);
  const [posts, setPosts] = useState<OwnerPost[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [form, setForm] = useState({ name: '', title: '', business: '', bio: '', lookingFor: '', tags: '' });
  const [postForm, setPostForm] = useState({ type: 'seeking' as 'seeking' | 'offering', headline: '', details: '', tags: '' });

  useEffect(() => {
    const myRaw = localStorage.getItem('fe_my_owner_profile');
    if (myRaw) {
      try {
        const p: OwnerProfile = JSON.parse(myRaw);
        setMyProfile(p);
        setForm({ name: p.name, title: p.title, business: p.business, bio: p.bio, lookingFor: p.lookingFor || '', tags: p.tags.join(', ') });
      } catch { }
    } else {
      setEditMode(true);
      setForm(f => ({
        ...f,
        name: memberName !== 'Loading User' ? memberName : '',
        business: memberBusiness !== 'Founders Edge Member' ? memberBusiness : '',
      }));
    }
    const postsRaw = localStorage.getItem('fe_owner_posts');
    if (postsRaw) { try { setPosts(JSON.parse(postsRaw)); } catch { } }
  }, [memberName, memberBusiness]);

  function saveProfile() {
    if (!form.name.trim() || !form.bio.trim()) return;
    const profile: OwnerProfile = {
      id: myProfile?.id || `owner_${Date.now()}`,
      name: form.name, title: form.title, business: form.business, bio: form.bio,
      lookingFor: form.lookingFor,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: myProfile?.createdAt || new Date().toISOString(),
    };
    localStorage.setItem('fe_my_owner_profile', JSON.stringify(profile));
    setMyProfile(profile); setEditMode(false);
  }

  function submitPost() {
    if (!postForm.headline.trim() || !postForm.details.trim()) return;
    const post: OwnerPost = {
      id: `post_${Date.now()}`,
      ownerName: myProfile?.name || memberName,
      business: myProfile?.business || memberBusiness,
      type: postForm.type, headline: postForm.headline, details: postForm.details,
      tags: postForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      postedAt: new Date().toISOString(), isOwn: true,
    };
    const updated = [post, ...posts];
    localStorage.setItem('fe_owner_posts', JSON.stringify(updated));
    setPosts(updated);
    setPostForm({ type: 'seeking', headline: '', details: '', tags: '' });
    setShowPostForm(false);
  }

  function deletePost(id: string) {
    const updated = posts.filter(p => p.id !== id);
    localStorage.setItem('fe_owner_posts', JSON.stringify(updated));
    setPosts(updated);
  }

  return (
    <div style={{ padding: '40px' }}>
      {/* My Owner Profile */}
      <div style={{ background: '#fff', border: '1px solid #e2e0d8', padding: '28px', marginBottom: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '22px', marginBottom: 4 }}>My Owner Profile</h2>
            <div style={{ fontSize: '13px', color: '#9a9585' }}>Your personal founder presence in the network</div>
          </div>
          {myProfile && !editMode && (
            <button onClick={() => setEditMode(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', border: '1px solid #e2e0d8', background: 'transparent', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', cursor: 'pointer', color: '#5a5650', transition: 'all 0.2s' }}>
              <Pencil size={13} /> Edit Profile
            </button>
          )}
        </div>

        {editMode ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input className="input-field" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" style={{ margin: 0 }} />
              </div>
              <div>
                <label style={labelStyle}>Title / Role</label>
                <input className="input-field" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Founder & CEO, Co-Founder" style={{ margin: 0 }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Business</label>
                <input className="input-field" value={form.business} onChange={e => setForm(p => ({ ...p, business: e.target.value }))} placeholder="Your business name" style={{ margin: 0 }} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Bio *</label>
              <textarea className="input-field" value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Tell the network about yourself — your background, what you're building, what drives you..." rows={4} style={{ resize: 'vertical', fontFamily: 'Noto Serif, serif' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Looking to Grow — What Do You Need?</label>
              <input className="input-field" value={form.lookingFor} onChange={e => setForm(p => ({ ...p, lookingFor: e.target.value }))} placeholder="e.g. Looking to scale my sales team, need a fractional CFO, seeking a co-founder in tech..." style={{ margin: 0 }} />
              <div style={{ fontSize: '12px', color: '#9a9585', marginTop: 6, fontFamily: 'Noto Serif, serif' }}>This shows prominently on your profile — let others know how they can help you.</div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Tags (comma-separated)</label>
              <input className="input-field" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="e.g. Bootstrapped, SaaS, Series A, Calgary" style={{ margin: 0 }} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={saveProfile} className="btn-primary" style={{ padding: '12px 28px', fontSize: '13px' }}>Save Owner Profile</button>
              {myProfile && (
                <button onClick={() => setEditMode(false)} style={{ padding: '12px 24px', border: '1px solid #e2e0d8', background: 'transparent', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', cursor: 'pointer', color: '#5a5650' }}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : myProfile ? (
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ width: 56, height: 56, background: '#e7b605', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: '22px', color: '#000', flexShrink: 0 }}>
              {myProfile.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '20px', marginBottom: 4 }}>{myProfile.name}</h3>
              <div style={{ fontSize: '14px', color: '#9b7011', fontWeight: 600, marginBottom: 12 }}>
                {myProfile.title}{myProfile.title && myProfile.business ? ' · ' : ''}{myProfile.business}
              </div>
              <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '14px', lineHeight: 1.7, marginBottom: myProfile.lookingFor ? 16 : 0 }}>{myProfile.bio}</p>
              {myProfile.lookingFor && (
                <div style={{ padding: '12px 16px', background: 'rgba(231,182,5,0.06)', borderLeft: '3px solid #e7b605' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#9b7011', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Looking to Grow</div>
                  <div style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '14px' }}>{myProfile.lookingFor}</div>
                </div>
              )}
              {myProfile.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 16 }}>
                  {myProfile.tags.map(t => <span key={t} style={{ padding: '3px 10px', background: '#f0efe9', fontSize: '11px', color: '#5a5650', fontWeight: 600, borderRadius: 2 }}>{t}</span>)}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Owner Board */}
      <div style={{ background: '#fff', border: '1px solid #e2e0d8', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '22px', marginBottom: 4 }}>Member Board</h2>
            <div style={{ fontSize: '13px', color: '#9a9585' }}>What founders are seeking and offering</div>
          </div>
          {myProfile && (
            <button onClick={() => setShowPostForm(!showPostForm)} className={showPostForm ? 'btn-outline' : 'btn-primary'} style={{ fontSize: '12px', padding: '10px 18px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {showPostForm ? 'Cancel' : <><Plus size={14} /> Post a Need</>}
            </button>
          )}
        </div>

        {/* Post Form */}
        {showPostForm && (
          <div style={{ background: '#f9f9f7', border: '1px solid #e2e0d8', padding: '24px', marginBottom: 24 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>New Post</div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              {(['seeking', 'offering'] as const).map(t => (
                <button key={t} type="button" onClick={() => setPostForm(p => ({ ...p, type: t }))} style={{ padding: '10px 20px', border: '2px solid', borderColor: postForm.type === t ? '#e7b605' : '#e2e0d8', background: postForm.type === t ? 'rgba(231,182,5,0.06)' : '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '13px', cursor: 'pointer', color: postForm.type === t ? '#9b7011' : '#9a9585', textTransform: 'capitalize' }}>
                  {t === 'seeking' ? '🔍 Seeking' : '🤝 Offering'}
                </button>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Headline *</label>
              <input className="input-field" value={postForm.headline} onChange={e => setPostForm(p => ({ ...p, headline: e.target.value }))} placeholder={postForm.type === 'seeking' ? 'e.g. Looking to hire a VP of Sales' : 'e.g. Offering free financial planning session'} style={{ margin: 0 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Details *</label>
              <textarea className="input-field" value={postForm.details} onChange={e => setPostForm(p => ({ ...p, details: e.target.value }))} placeholder={postForm.type === 'seeking' ? 'Describe what you need, ideal experience, budget range...' : 'Describe what you are offering, who it is for, any conditions...'} rows={3} style={{ resize: 'vertical', fontFamily: 'Noto Serif, serif' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Tags (comma-separated)</label>
              <input className="input-field" value={postForm.tags} onChange={e => setPostForm(p => ({ ...p, tags: e.target.value }))} placeholder="e.g. HR, Sales, Tech, Finance" style={{ margin: 0 }} />
            </div>
            <button onClick={submitPost} className="btn-primary" style={{ padding: '12px 28px', fontSize: '13px' }}>Post to Board</button>
          </div>
        )}

        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', borderTop: '1px solid #f0efe9' }}>
            <Users size={40} style={{ color: '#e2e0d8', marginBottom: 16 }} />
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '16px', color: '#9a9585', marginBottom: 8 }}>No posts yet</div>
            <div style={{ fontSize: '14px', color: '#b8b4ae', fontFamily: 'Noto Serif, serif', maxWidth: 380, margin: '0 auto' }}>
              Be the first to post what you're looking for. Other members will see your post and reach out.
            </div>
          </div>
        ) : (
          <div>
            {posts.map(post => (
              <div key={post.id} style={{ padding: '20px', background: '#f9f9f7', border: '1px solid #e2e0d8', borderLeft: `4px solid ${post.type === 'seeking' ? '#e7b605' : '#27ae60'}`, marginBottom: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 12px', background: post.type === 'seeking' ? 'rgba(231,182,5,0.12)' : 'rgba(39,174,96,0.1)', color: post.type === 'seeking' ? '#9b7011' : '#27ae60', fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {post.type === 'seeking' ? '🔍 Seeking' : '🤝 Offering'}
                  </span>
                  {post.isOwn && (
                    <button onClick={() => { if (confirm('Remove this post?')) deletePost(post.id); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: 'transparent', border: '1px solid #e2e0d8', color: '#9a9585', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#c0392b'; e.currentTarget.style.color = '#c0392b'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e0d8'; e.currentTarget.style.color = '#9a9585'; }}
                    >
                      <Trash2 size={11} /> Remove
                    </button>
                  )}
                </div>
                <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '17px', marginBottom: 8, color: '#2a2820' }}>{post.headline}</h3>
                <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '14px', lineHeight: 1.7, marginBottom: 12 }}>{post.details}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {post.tags.map(t => <span key={t} style={{ padding: '3px 8px', background: '#f0efe9', fontSize: '11px', color: '#5a5650', fontWeight: 600, borderRadius: 2 }}>{t}</span>)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9a9585' }}>
                    <span style={{ fontWeight: 700, color: '#2a2820' }}>{post.ownerName}</span>
                    {post.business && <> · {post.business}</>}
                    {' · '}{new Date(post.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                {!post.isOwn && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #e2e0d8' }}>
                    <button className="btn-primary" style={{ padding: '7px 16px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <MessageSquare size={12} /> Reach Out
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [member, setMember] = useState(defaultMember);
  const [userProfile, setUserProfile] = useState<any>(null);
  const isAdmin = userProfile?.role === 'ADMIN';
  const visibleNavItems = isAdmin
    ? [
      ...navItems,
      { icon: Settings, label: 'Admin Panel', href: '/admin/dashboard' },
    ]
    : navItems;
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([]);
  const [myOffers, setMyOffers] = useState<MyOffer[]>([]);
  const [myNominations, setMyNominations] = useState<Nomination[]>([]);

  useEffect(() => {
    const loadProfile = async () => {
      const res = await getProfile();

      if (!res.success || !res.user) {
        return;
      }

      const loggedInUser = res.user as any;

      setUserProfile(loggedInUser);

      const userEmail = loggedInUser.email || '';
      const userName = loggedInUser.name || 'Member';

       const { data, error } = await supabase
        .from('members')
        .select(`
          id,
          first_name,
          last_name,
          email,
          stage,
          industry,
          created_at,
          businesses (
            business_name,
            business_type
          )
        `)
        .eq('email', userEmail)
        .maybeSingle();

      if (error) {
        console.error('Member/business lookup error:', error.message);
      }

      if (data) {
        const businessData = Array.isArray(data.businesses)
          ? data.businesses[0]
          : data.businesses;

        setMember({
          name: `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim() || userName,
          business: businessData?.business_name ?? 'Founders Edge Member',
          industry: data.industry ?? businessData?.business_type ?? 'Member',
          joined: data.created_at
            ? new Date(data.created_at).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })
            : 'May 2026',
          profileCompletion: 85,
        });

        await loadSubmissions(data.id);
        return;
      }

      setMember(prev => ({
        ...prev,
        name: userName,
        business: 'Founders Edge Member',
        industry: 'Member',
      }));

      await loadSubmissions();
    };

    const loadSubmissions = async (memberId?: string) => {
      if (!memberId) {
        const raw = localStorage.getItem('fe_my_submissions');
        if (raw) {
          try {
            setMySubmissions(JSON.parse(raw));
          } catch {}
        }
        return;
      }

      try {
        const res = await fetch('/api/events?mySubmissions=true');

        if (res.ok) {
          const allEvents = await res.json();
          const mine = allEvents.filter((e: any) => e.member_id === memberId);

          const mapped: Submission[] = mine.map((e: any) => ({
            id: e.id,
            title: e.title,
            category: e.category,
            submittedAt: e.created_At || e.created_at || new Date().toISOString(),
            status: e.status?.toLowerCase() || 'pending',
          }));

          setMySubmissions(mapped);
        }
      } catch (err) {
        console.error('Failed to load submissions from API:', err);
      }
    };

    const loadOffers = () => {
      const raw = localStorage.getItem('fe_my_offers');
      if (raw) {
        try {
          setMyOffers(JSON.parse(raw));
        } catch {}
      }
    };

    const loadNominations = () => {
      const raw = localStorage.getItem('fe_my_nominations');
      if (raw) {
        try {
          setMyNominations(JSON.parse(raw));
        } catch {}
      }
    };

    loadProfile();
    loadOffers();
    loadNominations();
  }, []);

  async function deleteSubmission(id: string) {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const updated = mySubmissions.filter(s => s.id !== id);
        setMySubmissions(updated);
        const raw = localStorage.getItem('fe_my_submissions');
        if (raw) {
          try {
            const list = JSON.parse(raw).filter((s: any) => s.id !== id);
            localStorage.setItem('fe_my_submissions', JSON.stringify(list));
          } catch {}
        }
      } else {
        const data = await res.json();
        alert(`Error deleting event: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Failed to delete event:", err);
      alert("Failed to delete event due to network error.");
    }
  }

  function deleteOffer(id: string) {
    const updated = myOffers.filter(o => o.id !== id);
    setMyOffers(updated);
    localStorage.setItem('fe_my_offers', JSON.stringify(updated));
    const adminRaw = localStorage.getItem('fe_all_submitted_offers');
    if (adminRaw) {
      try {
        const adminOffers = JSON.parse(adminRaw).filter((o: MyOffer) => o.id !== id);
        localStorage.setItem('fe_all_submitted_offers', JSON.stringify(adminOffers));
        localStorage.setItem('fe_approved_offers', JSON.stringify(adminOffers.filter((o: MyOffer) => o.status === 'approved')));
      } catch { }
    }
  }

  function deleteNomination(id: string) {
    const updated = myNominations.filter(n => n.id !== id);
    setMyNominations(updated);
    localStorage.setItem('fe_my_nominations', JSON.stringify(updated));
    const adminRaw = localStorage.getItem('fe_all_nominations');
    if (adminRaw) {
      try {
        const adminNoms = JSON.parse(adminRaw).filter((n: Nomination) => n.id !== id);
        localStorage.setItem('fe_all_nominations', JSON.stringify(adminNoms));
      } catch { }
    }
  }

  // ── Sidebar nav item renderer ──────────────────────────────────
  function NavItem({ item }: { item: typeof navItems[0] }) {
    const isActive = item.section === activeSection;
    const sharedStyle: React.CSSProperties = {
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 24px',
      background: isActive ? 'rgba(231,182,5,0.1)' : 'transparent',
      borderLeft: isActive ? '3px solid #e7b605' : '3px solid transparent',
      color: isActive ? '#e7b605' : '#888',
      fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px',
      letterSpacing: '0.03em', transition: 'all 0.2s', width: '100%',
      textDecoration: 'none',
    };

    if (item.section) {
      return (
        <button
          onClick={() => setActiveSection(item.section!)}
          style={{ ...sharedStyle, background: isActive ? 'rgba(231,182,5,0.1)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <item.icon size={16} />
          {item.label}
        </button>
      );
    }

    return (
      <Link href={item.href!} style={sharedStyle}>
        <item.icon size={16} />
        {item.label}
        <ExternalLink size={11} style={{ marginLeft: 'auto', opacity: 0.4 }} />
      </Link>
    );
  }

  // ── Section: Events ────────────────────────────────────────────
  function EventsSection() {
    return (
      <div style={{ padding: '40px' }}>
        <div style={{ background: '#fff', border: '1px solid #e2e0d8', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '22px', marginBottom: 4 }}>My Event Submissions</h2>
              <div style={{ fontSize: '13px', color: '#9a9585' }}>{mySubmissions.length} submission{mySubmissions.length !== 1 ? 's' : ''}</div>
            </div>
            <Link href="/events/submit" className="btn-primary" style={{ fontSize: '12px', padding: '10px 18px' }}>
              <Plus size={14} /> Submit New Event
            </Link>
          </div>

          {mySubmissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', borderTop: '1px solid #f0efe9' }}>
              <Calendar size={40} style={{ color: '#e2e0d8', marginBottom: 16 }} />
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '16px', color: '#9a9585', marginBottom: 8 }}>No event submissions yet</div>
              <div style={{ fontSize: '14px', color: '#b8b4ae', fontFamily: 'Noto Serif, serif', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
                Have an event for the Founders Edge community? Submit it for review and it'll appear here once approved.
              </div>
              <Link href="/events/submit" className="btn-primary" style={{ justifyContent: 'center', display: 'inline-flex' }}>
                Submit an Event
              </Link>
            </div>
          ) : (
            <div>
              {mySubmissions.map(sub => {
                const s = statusStyles[sub.status];
                const canEdit = sub.status !== 'approved';
                return (
                  <div key={sub.id} style={{ padding: '20px 0', borderTop: '1px solid #f0efe9', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '16px', color: '#2a2820', marginBottom: 6 }}>{sub.title}</div>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <span style={{ background: s.bg, color: s.color, padding: '4px 12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {s.label}
                      </span>
                      {canEdit && (
                        <Link
                          href={`/events/submit?edit=${sub.id}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', border: '1px solid #e2e0d8', color: '#555', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', textDecoration: 'none', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#e7b605'; e.currentTarget.style.color = '#9b7011'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e0d8'; e.currentTarget.style.color = '#555'; }}
                        >
                          <Pencil size={12} /> Edit
                        </Link>
                      )}
                      <button
                        onClick={() => { if (confirm('Delete this submission?')) deleteSubmission(sub.id); }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: 'transparent', border: '1px solid #e2e0d8', color: '#9a9585', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
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

        {/* Browse events link */}
        <div style={{ marginTop: 2, background: '#000', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div style={{ color: '#888', fontFamily: 'Noto Serif, serif', fontSize: '14px' }}>Browse all upcoming Founders Edge events</div>
          <Link href="/events" className="btn-primary" style={{ fontSize: '12px', padding: '10px 18px' }}>
            View All Events <ExternalLink size={13} />
          </Link>
        </div>
      </div>
    );
  }

  // ── Section: Offers ────────────────────────────────────────────
  function OffersSection() {
    const activeCount = myOffers.filter(o => o.status !== 'rejected').length;
    return (
      <div style={{ padding: '40px' }}>
        <div style={{ background: '#fff', border: '1px solid #e2e0d8', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '22px', marginBottom: 4 }}>My Offer Submissions</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: '13px', color: '#9a9585' }}>{activeCount}/3 active offers</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} style={{ width: 20, height: 5, background: i < activeCount ? '#e7b605' : '#e2e0d8', borderRadius: 2 }} />
                  ))}
                </div>
              </div>
            </div>
            {activeCount < 3 && (
              <Link href="/offers/submit" className="btn-primary" style={{ fontSize: '12px', padding: '10px 18px' }}>
                <Plus size={14} /> Add Offer
              </Link>
            )}
          </div>

          {myOffers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', borderTop: '1px solid #f0efe9' }}>
              <Tag size={40} style={{ color: '#e2e0d8', marginBottom: 16 }} />
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '16px', color: '#9a9585', marginBottom: 8 }}>No offers yet</div>
              <div style={{ fontSize: '14px', color: '#b8b4ae', fontFamily: 'Noto Serif, serif', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
                Share exclusive deals with the Founders Edge community. Members can list up to 3 active offers.
              </div>
              <Link href="/offers/submit" className="btn-primary" style={{ justifyContent: 'center', display: 'inline-flex' }}>
                Share an Offer
              </Link>
            </div>
          ) : (
            <div>
              {myOffers.map(offer => {
                const s = statusStyles[offer.status];
                const canEdit = offer.status !== 'approved';
                const isExpired = offer.expiryDate && new Date(offer.expiryDate) < new Date();
                return (
                  <div key={offer.id} style={{ padding: '20px 0', borderTop: '1px solid #f0efe9', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontWeight: 900, fontSize: '20px', color: '#e7b605', fontFamily: 'DM Sans, sans-serif' }}>{offer.discount}</span>
                        {isExpired && <span style={{ fontSize: '10px', fontWeight: 700, color: '#c0392b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Expired</span>}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '15px', color: '#2a2820', marginBottom: 4 }}>{offer.title}</div>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <span className="tag" style={{ fontSize: '10px', padding: '2px 8px' }}>{offer.category}</span>
                        <span style={{ fontSize: '12px', color: '#9a9585' }}>
                          Submitted {new Date(offer.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {offer.expiryDate && (
                          <span style={{ fontSize: '12px', color: isExpired ? '#c0392b' : '#9a9585' }}>
                            · Expires {new Date(offer.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <span style={{ background: s.bg, color: s.color, padding: '4px 12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {s.label}
                      </span>
                      {canEdit && (
                        <Link
                          href={`/offers/submit?edit=${offer.id}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', border: '1px solid #e2e0d8', color: '#555', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', textDecoration: 'none', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#e7b605'; e.currentTarget.style.color = '#9b7011'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e0d8'; e.currentTarget.style.color = '#555'; }}
                        >
                          <Pencil size={12} /> Edit
                        </Link>
                      )}
                      <button
                        onClick={() => { if (confirm('Delete this offer?')) deleteOffer(offer.id); }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: 'transparent', border: '1px solid #e2e0d8', color: '#9a9585', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
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

        {/* Browse offers link */}
        <div style={{ marginTop: 2, background: '#000', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div style={{ color: '#888', fontFamily: 'Noto Serif, serif', fontSize: '14px' }}>Browse all member offers in the directory</div>
          <Link href="/offers" className="btn-primary" style={{ fontSize: '12px', padding: '10px 18px' }}>
            View All Offers <ExternalLink size={13} />
          </Link>
        </div>
      </div>
    );
  }

  // ── Section: Awards ───────────────────────────────────────────
  function AwardsSection() {
    const nomStatusStyles: Record<Nomination['status'], { bg: string; color: string; label: string }> = {
      pending: { bg: 'rgba(230,126,34,0.1)', color: '#e67e22', label: 'Pending Review' },
      approved: { bg: 'rgba(39,174,96,0.1)', color: '#27ae60', label: 'Approved' },
      rejected: { bg: 'rgba(192,57,43,0.1)', color: '#c0392b', label: 'Rejected' },
      winner: { bg: 'rgba(231,182,5,0.12)', color: '#9b7011', label: '🏆 Winner!' },
    };
    return (
      <div style={{ padding: '40px' }}>
        <div style={{ background: '#fff', border: '1px solid #e2e0d8', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '22px', marginBottom: 4 }}>My Award Nominations</h2>
              <div style={{ fontSize: '13px', color: '#9a9585' }}>{myNominations.length} nomination{myNominations.length !== 1 ? 's' : ''} submitted</div>
            </div>
            <Link href="/awards" className="btn-primary" style={{ fontSize: '12px', padding: '10px 18px' }}>
              <Trophy size={14} /> Browse Awards
            </Link>
          </div>

          {myNominations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', borderTop: '1px solid #f0efe9' }}>
              <Trophy size={40} style={{ color: '#e2e0d8', marginBottom: 16 }} />
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '16px', color: '#9a9585', marginBottom: 8 }}>No nominations yet</div>
              <div style={{ fontSize: '14px', color: '#b8b4ae', fontFamily: 'Noto Serif, serif', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
                Browse available awards and submit a nomination to get your business recognized.
              </div>
              <Link href="/awards" className="btn-primary" style={{ justifyContent: 'center', display: 'inline-flex' }}>
                View Awards
              </Link>
            </div>
          ) : (
            <div>
              {myNominations.map(nom => {
                const s = nomStatusStyles[nom.status];
                const isWinner = nom.status === 'winner';
                return (
                  <div key={nom.id} style={{ padding: '20px 0', borderTop: '1px solid #f0efe9', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ width: 40, height: 40, background: isWinner ? '#e7b605' : '#f0efe9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Trophy size={18} style={{ color: isWinner ? '#000' : '#9b7011' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '16px', color: '#2a2820', marginBottom: 4 }}>{nom.awardName}</div>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', color: '#9b7011', fontWeight: 600 }}>{nom.awardOrg}</span>
                        <span className="tag" style={{ fontSize: '10px', padding: '2px 8px' }}>{nom.category}</span>
                        <span style={{ fontSize: '12px', color: '#9a9585' }}>
                          Submitted {new Date(nom.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <span style={{ background: s.bg, color: s.color, padding: '4px 12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {s.label}
                      </span>
                      {nom.status === 'pending' && (
                        <Link
                          href={`/awards/nominate?awardId=${nom.awardId}&edit=${nom.id}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', border: '1px solid #e2e0d8', color: '#555', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', textDecoration: 'none', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#e7b605'; e.currentTarget.style.color = '#9b7011'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e0d8'; e.currentTarget.style.color = '#555'; }}
                        >
                          <Pencil size={12} /> Edit
                        </Link>
                      )}
                      {nom.status !== 'winner' && (
                        <button
                          onClick={() => { if (confirm('Withdraw this nomination?')) deleteNomination(nom.id); }}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: 'transparent', border: '1px solid #e2e0d8', color: '#9a9585', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#c0392b'; e.currentTarget.style.color = '#c0392b'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e0d8'; e.currentTarget.style.color = '#9a9585'; }}
                        >
                          <Trash2 size={12} /> Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ marginTop: 2, background: '#000', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div style={{ color: '#888', fontFamily: 'Noto Serif, serif', fontSize: '14px' }}>Discover all available awards and recognition opportunities</div>
          <Link href="/awards" className="btn-primary" style={{ fontSize: '12px', padding: '10px 18px' }}>
            Browse All Awards <ExternalLink size={13} />
          </Link>
        </div>
      </div>
    );
  }

  // ── Section: Main Dashboard ────────────────────────────────────
  function DashboardSection() {
    return (
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
              <button
                onClick={() => setActiveSection('events')}
                style={{ background: 'none', border: 'none', color: '#e7b605', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                My Submissions <ChevronRight size={14} />
              </button>
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

          {/* Supper Club */}
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

        {/* Quick-access chips */}
        <div style={{ marginTop: 2, background: '#fff', border: '1px solid #e2e0d8', padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#9a9585', letterSpacing: '0.06em', textTransform: 'uppercase', marginRight: 4 }}>Quick Access</span>
          <button onClick={() => setActiveSection('events')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: '1px solid #e2e0d8', background: 'transparent', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', color: '#5a5650', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#e7b605'; e.currentTarget.style.color = '#9b7011'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e0d8'; e.currentTarget.style.color = '#5a5650'; }}
          >
            <Calendar size={13} /> My Events ({mySubmissions.length})
          </button>
          <button onClick={() => setActiveSection('offers')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: '1px solid #e2e0d8', background: 'transparent', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', color: '#5a5650', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#e7b605'; e.currentTarget.style.color = '#9b7011'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e0d8'; e.currentTarget.style.color = '#5a5650'; }}
          >
            <Tag size={13} /> My Offers ({myOffers.length})
          </button>
          <button onClick={() => setActiveSection('awards')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: '1px solid #e2e0d8', background: 'transparent', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', color: '#5a5650', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#e7b605'; e.currentTarget.style.color = '#9b7011'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e0d8'; e.currentTarget.style.color = '#5a5650'; }}
          >
            <Trophy size={13} /> My Awards ({myNominations.length})
          </button>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9f9f7' }}>

      {/* Sidebar */}
      <aside style={{ width: 260, background: '#000', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #1a1a1a' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Logo size="sm" />
          </Link>
        </div>

        {/* Member card */}
        <div style={{ padding: '24px', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            {userProfile?.avatarUrl ? (
              <img src={userProfile.avatarUrl} alt={member.name} style={{ width: 44, height: 44, objectFit: 'cover', flexShrink: 0 }} />
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
          {visibleNavItems.map(item => <NavItem key={item.label} item={item} />)}
        </nav>

        <div style={{ padding: '16px 0', borderTop: '1px solid #1a1a1a' }}>
          <Link href="/dashboard/settings" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', textDecoration: 'none', color: '#666', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px' }}>
            <Settings size={16} /> Settings
          </Link>
          <button
            onClick={async () => { await logout(); }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', color: '#666', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 260, flex: 1 }}>
        {/* Top bar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e2e0d8', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
          <div>
            <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '22px' }}>
              {activeSection === 'dashboard' ? `Good morning, ${member.name.split(' ')[0]} 👋` : sectionTitles[activeSection]}
            </h1>
            <div style={{ fontSize: '13px', color: '#9a9585' }}>Member since {member.joined}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <NotificationBell />
            {userProfile?.avatarUrl ? (
              <img src={userProfile.avatarUrl} alt={member.name} style={{ width: 40, height: 40, objectFit: 'cover', border: '1px solid #e2e0d8', cursor: 'pointer' }} />
            ) : (
              <div style={{ width: 40, height: 40, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e7b605', fontWeight: 800, fontSize: '16px', cursor: 'pointer' }}>
                {member.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Section content */}
        {activeSection === 'dashboard' && <DashboardSection />}
        {activeSection === 'feed'      && <FeedSection memberName={member.name} memberBusiness={member.business} />}
        {activeSection === 'events'    && <EventsSection />}
        {activeSection === 'offers'    && <OffersSection />}
        {activeSection === 'awards'    && <AwardsSection />}
        {activeSection === 'business'  && <BusinessSection memberBusiness={member.business} />}
        {activeSection === 'owners'    && <OwnersSection memberName={member.name} memberBusiness={member.business} />}
      </main>
    </div>
  );
}
