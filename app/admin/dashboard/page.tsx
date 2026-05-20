'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Building2, BookOpen, Trophy, Video, Users, Star, LogOut, Plus, CheckCircle, X } from 'lucide-react';
import Logo from '@/components/Logo';

type Tab = 'events' | 'directory' | 'resources' | 'awards' | 'webinars' | 'supperclub';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'directory', label: 'Directory', icon: Building2 },
  { id: 'resources', label: 'Resources', icon: BookOpen },
  { id: 'awards', label: 'Awards', icon: Trophy },
  { id: 'webinars', label: 'Webinars', icon: Video },
  { id: 'supperclub', label: 'Supper Club', icon: Star },
];

function SuccessBanner({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div style={{ background: '#0d2b0d', border: '1px solid #1a5c1a', padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <CheckCircle size={18} style={{ color: '#2d7a3a', flexShrink: 0 }} />
        <span style={{ color: '#4caf50', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px' }}>{message}</span>
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4caf50', cursor: 'pointer', padding: 0 }}><X size={16} /></button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', background: '#111', border: '1px solid #2a2a2a',
  color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.2s',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle, minHeight: 100, resize: 'vertical',
};

const checkboxRowStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
  color: '#ccc', fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
};

// ─── FORMS ────────────────────────────────────────────────────────────────────

function EventsForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ title: '', date: '', time: '', location: '', category: 'Networking', price: '', host: '', desc: '', featured: false });
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSuccess(); setForm({ title: '', date: '', time: '', location: '', category: 'Networking', price: '', host: '', desc: '', featured: false }); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <Field label="Event Title"><input required style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Founders Networking Night" /></Field>
      <Field label="Category">
        <select style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)}>
          {['Networking', 'Workshop', 'Webinar', 'Supper Club', 'Other'].map(c => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Date"><input required style={inputStyle} type="date" value={form.date} onChange={e => set('date', e.target.value)} /></Field>
      <Field label="Time"><input required style={inputStyle} type="time" value={form.time} onChange={e => set('time', e.target.value)} /></Field>
      <Field label="Location"><input required style={inputStyle} value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. The Commons, Calgary" /></Field>
      <Field label="Price"><input style={inputStyle} value={form.price} onChange={e => set('price', e.target.value)} placeholder="e.g. Free / $50 / Members Only" /></Field>
      <Field label="Host / Organizer"><input style={inputStyle} value={form.host} onChange={e => set('host', e.target.value)} placeholder="e.g. Founders Edge" /></Field>
      <Field label="Featured">
        <label style={checkboxRowStyle}>
          <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#e7b605' }} />
          Mark as featured event
        </label>
      </Field>
      <div style={{ gridColumn: '1 / -1' }}>
        <Field label="Description"><textarea style={textareaStyle} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Describe the event..." /></Field>
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <button type="submit" style={{ padding: '14px 32px', background: '#e7b605', border: 'none', fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', color: '#000', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} /> Add Event
        </button>
      </div>
    </form>
  );
}

function DirectoryForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ name: '', industry: 'Technology', location: 'Calgary', desc: '', website: '', tags: '', featured: false, boosted: false });
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSuccess(); setForm({ name: '', industry: 'Technology', location: 'Calgary', desc: '', website: '', tags: '', featured: false, boosted: false }); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <Field label="Business Name"><input required style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. NorthTech Solutions" /></Field>
      <Field label="Industry">
        <select style={inputStyle} value={form.industry} onChange={e => set('industry', e.target.value)}>
          {['Technology', 'Marketing', 'Finance', 'Legal', 'HR & People', 'Design', 'Health & Wellness', 'Construction', 'Other'].map(i => <option key={i}>{i}</option>)}
        </select>
      </Field>
      <Field label="Location"><input style={inputStyle} value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Calgary, AB" /></Field>
      <Field label="Website"><input style={inputStyle} type="url" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://..." /></Field>
      <Field label="Tags (comma-separated)"><input style={inputStyle} value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="e.g. SaaS, B2B, AI" /></Field>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'flex-end' }}>
        <Field label="Listing Options">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={checkboxRowStyle}><input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#e7b605' }} /> Featured listing</label>
            <label style={checkboxRowStyle}><input type="checkbox" checked={form.boosted} onChange={e => set('boosted', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#e7b605' }} /> Boosted (top placement)</label>
          </div>
        </Field>
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <Field label="Description"><textarea style={textareaStyle} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Describe the business..." /></Field>
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <button type="submit" style={{ padding: '14px 32px', background: '#e7b605', border: 'none', fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', color: '#000', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} /> Add Business
        </button>
      </div>
    </form>
  );
}

function ResourcesForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ title: '', category: 'Funding', url: '', tags: '', desc: '', featured: false });
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSuccess(); setForm({ title: '', category: 'Funding', url: '', tags: '', desc: '', featured: false }); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <Field label="Resource Title"><input required style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Alberta Innovates Grant" /></Field>
      <Field label="Category">
        <select style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)}>
          {['Funding', 'Business Services', 'Tax & Grants', 'Innovation & IP', 'Banking & Finance', 'Ecosystem', 'Export & Trade'].map(c => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="URL"><input required style={inputStyle} type="url" value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://..." /></Field>
      <Field label="Tags (comma-separated)"><input style={inputStyle} value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="e.g. Grant, Startup, Federal" /></Field>
      <Field label="Editor's Pick">
        <label style={checkboxRowStyle}>
          <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#e7b605' }} />
          Mark as Editor's Pick
        </label>
      </Field>
      <div style={{ gridColumn: '1 / -1' }}>
        <Field label="Description"><textarea style={textareaStyle} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Describe this resource..." /></Field>
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <button type="submit" style={{ padding: '14px 32px', background: '#e7b605', border: 'none', fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', color: '#000', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} /> Add Resource
        </button>
      </div>
    </form>
  );
}

function AwardsForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ name: '', category: '', desc: '', nominationsOpen: false, awardDate: '', sponsor: '' });
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSuccess(); setForm({ name: '', category: '', desc: '', nominationsOpen: false, awardDate: '', sponsor: '' }); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <Field label="Award Name"><input required style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Entrepreneur of the Year" /></Field>
      <Field label="Category"><input required style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Innovation, Leadership" /></Field>
      <Field label="Award Date"><input style={inputStyle} type="date" value={form.awardDate} onChange={e => set('awardDate', e.target.value)} /></Field>
      <Field label="Sponsor / Partner"><input style={inputStyle} value={form.sponsor} onChange={e => set('sponsor', e.target.value)} placeholder="e.g. ATB Financial" /></Field>
      <Field label="Nominations Status">
        <label style={checkboxRowStyle}>
          <input type="checkbox" checked={form.nominationsOpen} onChange={e => set('nominationsOpen', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#e7b605' }} />
          Nominations currently open
        </label>
      </Field>
      <div style={{ gridColumn: '1 / -1' }}>
        <Field label="Description"><textarea style={textareaStyle} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Describe this award..." /></Field>
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <button type="submit" style={{ padding: '14px 32px', background: '#e7b605', border: 'none', fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', color: '#000', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} /> Add Award
        </button>
      </div>
    </form>
  );
}

function WebinarsForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ title: '', speaker: '', speakerRole: '', date: '', time: '', duration: '', category: 'Sales', desc: '' });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSuccess(); setForm({ title: '', speaker: '', speakerRole: '', date: '', time: '', duration: '', category: 'Sales', desc: '' }); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <Field label="Webinar Title"><input required style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Scaling Your Sales Team" /></Field>
      <Field label="Category">
        <select style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)}>
          {['Sales', 'Finance', 'Funding', 'HR & People', 'Marketing', 'Operations', 'Legal', 'Technology'].map(c => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Speaker Name"><input required style={inputStyle} value={form.speaker} onChange={e => set('speaker', e.target.value)} placeholder="e.g. Jane Smith" /></Field>
      <Field label="Speaker Title / Role"><input style={inputStyle} value={form.speakerRole} onChange={e => set('speakerRole', e.target.value)} placeholder="e.g. CEO, NorthTech" /></Field>
      <Field label="Date"><input required style={inputStyle} type="date" value={form.date} onChange={e => set('date', e.target.value)} /></Field>
      <Field label="Time"><input required style={inputStyle} type="time" value={form.time} onChange={e => set('time', e.target.value)} /></Field>
      <Field label="Duration"><input style={inputStyle} value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="e.g. 60 min" /></Field>
      <div style={{ gridColumn: '1 / -1' }}>
        <Field label="Description"><textarea style={textareaStyle} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="What will attendees learn?" /></Field>
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <button type="submit" style={{ padding: '14px 32px', background: '#e7b605', border: 'none', fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', color: '#000', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} /> Add Webinar
        </button>
      </div>
    </form>
  );
}

function SupperClubForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ title: '', date: '', time: '', location: '', capacity: '', desc: '', inviteOnly: true });
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSuccess(); setForm({ title: '', date: '', time: '', location: '', capacity: '', desc: '', inviteOnly: true }); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <Field label="Event Title"><input required style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Q1 Founders Dinner" /></Field>
      <Field label="Location"><input required style={inputStyle} value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Charcut Roast House, Calgary" /></Field>
      <Field label="Date"><input required style={inputStyle} type="date" value={form.date} onChange={e => set('date', e.target.value)} /></Field>
      <Field label="Time"><input required style={inputStyle} type="time" value={form.time} onChange={e => set('time', e.target.value)} /></Field>
      <Field label="Capacity (seats)"><input style={inputStyle} type="number" value={form.capacity} onChange={e => set('capacity', e.target.value)} placeholder="e.g. 12" /></Field>
      <Field label="Access">
        <label style={checkboxRowStyle}>
          <input type="checkbox" checked={form.inviteOnly} onChange={e => set('inviteOnly', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#e7b605' }} />
          Invite only
        </label>
      </Field>
      <div style={{ gridColumn: '1 / -1' }}>
        <Field label="Description"><textarea style={textareaStyle} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Describe this supper club event..." /></Field>
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <button type="submit" style={{ padding: '14px 32px', background: '#e7b605', border: 'none', fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', color: '#000', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} /> Add Supper Club Event
        </button>
      </div>
    </form>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('events');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('fe_admin') !== 'true') {
      router.replace('/admin');
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('fe_admin');
    router.push('/admin');
  }

  function handleSuccess() {
    const labels: Record<Tab, string> = {
      events: 'Event added successfully.',
      directory: 'Business listing added successfully.',
      resources: 'Resource added successfully.',
      awards: 'Award added successfully.',
      webinars: 'Webinar added successfully.',
      supperclub: 'Supper Club event added successfully.',
    };
    setSuccessMsg(labels[activeTab]);
    setTimeout(() => setSuccessMsg(''), 5000);
  }

  const activeTabData = tabs.find(t => t.id === activeTab)!;

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#fff' }}>
      {/* Top Bar */}
      <div style={{ background: '#000', borderBottom: '1px solid #1a1a1a', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Link href="/" style={{ textDecoration: 'none' }}><Logo size="sm" /></Link>
            <div style={{ width: 1, height: 24, background: '#2a2a2a' }} />
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin Panel</span>
          </div>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: '1px solid #2a2a2a',
            color: '#888', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '12px',
            letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 16px', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#e7b605'; e.currentTarget.style.color = '#e7b605'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888'; }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px' }}>
        {/* Page Header */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: '32px', letterSpacing: '-0.02em', marginBottom: 6 }}>Content Manager</h1>
          <p style={{ color: '#666', fontFamily: 'Noto Serif, serif', fontSize: '15px' }}>Add and manage content across the Founders Edge platform.</p>
        </div>

        {/* Tab Nav */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 32, flexWrap: 'wrap' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSuccessMsg(''); }} style={{
                padding: '12px 20px', background: isActive ? '#e7b605' : '#111',
                border: `1px solid ${isActive ? '#e7b605' : '#1a1a1a'}`,
                color: isActive ? '#000' : '#888', fontFamily: 'DM Sans, sans-serif',
                fontWeight: 700, fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
              }}>
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Panel */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, background: 'rgba(231,182,5,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <activeTabData.icon size={18} style={{ color: '#e7b605' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '18px' }}>Add {activeTabData.label === 'Supper Club' ? 'Supper Club Event' : activeTabData.label === 'Directory' ? 'Directory Listing' : activeTabData.label.replace(/s$/, '')}</div>
              <div style={{ color: '#555', fontSize: '13px', marginTop: 2, fontFamily: 'Noto Serif, serif' }}>Fill in the details below and click Add to save.</div>
            </div>
          </div>

          {successMsg && <SuccessBanner message={successMsg} onClose={() => setSuccessMsg('')} />}

          {activeTab === 'events' && <EventsForm onSuccess={handleSuccess} />}
          {activeTab === 'directory' && <DirectoryForm onSuccess={handleSuccess} />}
          {activeTab === 'resources' && <ResourcesForm onSuccess={handleSuccess} />}
          {activeTab === 'awards' && <AwardsForm onSuccess={handleSuccess} />}
          {activeTab === 'webinars' && <WebinarsForm onSuccess={handleSuccess} />}
          {activeTab === 'supperclub' && <SupperClubForm onSuccess={handleSuccess} />}
        </div>
      </div>
    </div>
  );
}
