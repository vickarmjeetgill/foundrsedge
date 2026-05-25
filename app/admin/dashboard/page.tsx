'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Building2, BookOpen, Trophy, Video, Users, Star, LogOut, Plus, CheckCircle, X, Pencil, Trash2, ChevronDown, ChevronUp, LayoutDashboard, ClipboardList } from 'lucide-react';
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

// ─── TYPES ────────────────────────────────────────────────────────────────────
type EventItem = { id: number; title: string; date: string; time: string; location: string; category: string; price: string; host: string; desc: string; featured: boolean };
type DirectoryItem = { id: number; name: string; industry: string; location: string; desc: string; website: string; tags: string; featured: boolean; boosted: boolean };
type ResourceItem = { id: number; title: string; category: string; url: string; tags: string; desc: string; featured: boolean };
type AwardItem = { id: number; name: string; category: string; desc: string; nominationsOpen: boolean; awardDate: string; sponsor: string };
type WebinarItem = { id: number; title: string; speaker: string; speakerRole: string; date: string; time: string; duration: string; category: string; desc: string };
type SupperClubItem = { id: number; title: string; date: string; time: string; location: string; capacity: string; desc: string; inviteOnly: boolean };

// ─── SHARED UI ────────────────────────────────────────────────────────────────
function SuccessBanner({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div style={{ background: '#f0faf2', border: '1px solid #b2dfbd', padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <CheckCircle size={16} style={{ color: '#27ae60', flexShrink: 0 }} />
        <span style={{ color: '#1e7e34', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px' }}>{message}</span>
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#27ae60', cursor: 'pointer', padding: 0 }}><X size={16} /></button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', color: '#9a9585', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', background: '#fafafa', border: '1px solid #e0e0e0',
  color: '#111', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none',
  boxSizing: 'border-box',
};
const textareaStyle: React.CSSProperties = { ...inputStyle, minHeight: 90, resize: 'vertical' };
const checkboxRowStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: '#444', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' };

function ActionBtns({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button onClick={onEdit} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'transparent', border: '1px solid #e2e0d8', color: '#555', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#e7b605'; e.currentTarget.style.color = '#e7b605'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e0d8'; e.currentTarget.style.color = '#555'; }}>
        <Pencil size={12} /> Edit
      </button>
      <button onClick={onDelete} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'transparent', border: '1px solid #e2e0d8', color: '#9a9585', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#c0392b'; e.currentTarget.style.color = '#c0392b'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e0d8'; e.currentTarget.style.color = '#9a9585'; }}>
        <Trash2 size={12} /> Delete
      </button>
    </div>
  );
}

function SubmitRow({ editing, onCancel, addLabel }: { editing: boolean; onCancel: () => void; addLabel: string }) {
  return (
    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, alignItems: 'center' }}>
      <button type="submit" style={{ padding: '14px 32px', background: '#e7b605', border: 'none', fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', color: '#000', display: 'flex', alignItems: 'center', gap: 8 }}>
        {editing ? <><Pencil size={15} /> Save Changes</> : <><Plus size={15} /> {addLabel}</>}
      </button>
      {editing && (
        <button type="button" onClick={onCancel} style={{ padding: '14px 24px', background: 'transparent', border: '1px solid #2a2a2a', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', color: '#888' }}>
          Cancel
        </button>
      )}
    </div>
  );
}

// ─── EVENTS ───────────────────────────────────────────────────────────────────
const blankEvent = { title: '', date: '', time: '', location: '', category: 'Networking', price: '', host: '', desc: '', featured: false };

function EventsSection({ onSuccess }: { onSuccess: (msg: string) => void }) {
  const [items, setItems] = useState<EventItem[]>([]);
  const [form, setForm] = useState(blankEvent);
  const [editId, setEditId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(1);
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId !== null) {
      setItems(items.map(i => i.id === editId ? { ...form, id: editId } : i));
      onSuccess('Event updated successfully.');
      setEditId(null);
    } else {
      setItems([...items, { ...form, id: nextId }]);
      setNextId(n => n + 1);
      onSuccess('Event added successfully.');
    }
    setForm(blankEvent);
  }

  function handleEdit(item: EventItem) {
    setForm({ title: item.title, date: item.date, time: item.time, location: item.location, category: item.category, price: item.price, host: item.host, desc: item.desc, featured: item.featured });
    setEditId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleDelete(id: number) {
    if (confirm('Delete this event?')) { setItems(items.filter(i => i.id !== id)); onSuccess('Event deleted.'); }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="grid-form" style={{ gap: 20 }}>
        <Field label="Event Title"><input required style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Founders Networking Night" /></Field>
        <Field label="Category"><select style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)}>{['Networking', 'Workshop', 'Webinar', 'Supper Club', 'Other'].map(c => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Date"><input required style={inputStyle} type="date" value={form.date} onChange={e => set('date', e.target.value)} /></Field>
        <Field label="Time"><input required style={inputStyle} type="time" value={form.time} onChange={e => set('time', e.target.value)} /></Field>
        <Field label="Location"><input required style={inputStyle} value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. The Commons, Calgary" /></Field>
        <Field label="Price"><input style={inputStyle} value={form.price} onChange={e => set('price', e.target.value)} placeholder="e.g. Free / $50 / Members Only" /></Field>
        <Field label="Host / Organizer"><input style={inputStyle} value={form.host} onChange={e => set('host', e.target.value)} placeholder="e.g. Founders Edge" /></Field>
        <Field label="Featured"><label style={checkboxRowStyle}><input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#e7b605' }} /> Mark as featured event</label></Field>
        <div style={{ gridColumn: '1 / -1' }}><Field label="Description"><textarea style={textareaStyle} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Describe the event..." /></Field></div>
        <SubmitRow editing={editId !== null} onCancel={() => { setEditId(null); setForm(blankEvent); }} addLabel="Add Event" />
      </form>
      <ItemTable items={items} columns={['Title', 'Date', 'Category', 'Featured']} getRow={i => [i.title, i.date || '—', i.category, i.featured ? 'Yes' : 'No']} onEdit={handleEdit} onDelete={handleDelete} />
    </>
  );
}

// ─── DIRECTORY ────────────────────────────────────────────────────────────────
const blankDir = { name: '', industry: 'Technology', location: 'Calgary', desc: '', website: '', tags: '', featured: false, boosted: false };

function DirectorySection({ onSuccess }: { onSuccess: (msg: string) => void }) {
  const [items, setItems] = useState<DirectoryItem[]>([]);
  const [form, setForm] = useState(blankDir);
  const [editId, setEditId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(1);
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId !== null) {
      setItems(items.map(i => i.id === editId ? { ...form, id: editId } : i));
      onSuccess('Business listing updated.');
      setEditId(null);
    } else {
      setItems([...items, { ...form, id: nextId }]);
      setNextId(n => n + 1);
      onSuccess('Business listing added.');
    }
    setForm(blankDir);
  }

  function handleEdit(item: DirectoryItem) {
    setForm({ name: item.name, industry: item.industry, location: item.location, desc: item.desc, website: item.website, tags: item.tags, featured: item.featured, boosted: item.boosted });
    setEditId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleDelete(id: number) {
    if (confirm('Delete this listing?')) { setItems(items.filter(i => i.id !== id)); onSuccess('Listing deleted.'); }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="grid-form" style={{ gap: 20 }}>
        <Field label="Business Name"><input required style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. NorthTech Solutions" /></Field>
        <Field label="Industry"><select style={inputStyle} value={form.industry} onChange={e => set('industry', e.target.value)}>{['Technology', 'Marketing', 'Finance', 'Legal', 'HR & People', 'Design', 'Health & Wellness', 'Construction', 'Other'].map(i => <option key={i}>{i}</option>)}</select></Field>
        <Field label="Location"><input style={inputStyle} value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Calgary, AB" /></Field>
        <Field label="Website"><input style={inputStyle} type="url" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://..." /></Field>
        <Field label="Tags (comma-separated)"><input style={inputStyle} value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="e.g. SaaS, B2B, AI" /></Field>
        <Field label="Listing Options">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={checkboxRowStyle}><input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#e7b605' }} /> Featured listing</label>
            <label style={checkboxRowStyle}><input type="checkbox" checked={form.boosted} onChange={e => set('boosted', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#e7b605' }} /> Boosted (top placement)</label>
          </div>
        </Field>
        <div style={{ gridColumn: '1 / -1' }}><Field label="Description"><textarea style={textareaStyle} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Describe the business..." /></Field></div>
        <SubmitRow editing={editId !== null} onCancel={() => { setEditId(null); setForm(blankDir); }} addLabel="Add Business" />
      </form>
      <ItemTable items={items} columns={['Business', 'Industry', 'Location', 'Featured']} getRow={i => [i.name, i.industry, i.location, i.featured ? 'Yes' : 'No']} onEdit={handleEdit} onDelete={handleDelete} />
    </>
  );
}

// ─── RESOURCES ────────────────────────────────────────────────────────────────
const blankRes = { title: '', category: 'Funding', url: '', tags: '', desc: '', featured: false };

function ResourcesSection({ onSuccess }: { onSuccess: (msg: string) => void }) {
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [form, setForm] = useState(blankRes);
  const [editId, setEditId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(1);
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId !== null) {
      setItems(items.map(i => i.id === editId ? { ...form, id: editId } : i));
      onSuccess('Resource updated.');
      setEditId(null);
    } else {
      setItems([...items, { ...form, id: nextId }]);
      setNextId(n => n + 1);
      onSuccess('Resource added.');
    }
    setForm(blankRes);
  }

  function handleEdit(item: ResourceItem) {
    setForm({ title: item.title, category: item.category, url: item.url, tags: item.tags, desc: item.desc, featured: item.featured });
    setEditId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleDelete(id: number) {
    if (confirm('Delete this resource?')) { setItems(items.filter(i => i.id !== id)); onSuccess('Resource deleted.'); }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="grid-form" style={{ gap: 20 }}>
        <Field label="Resource Title"><input required style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Alberta Innovates Grant" /></Field>
        <Field label="Category"><select style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)}>{['Funding', 'Business Services', 'Tax & Grants', 'Innovation & IP', 'Banking & Finance', 'Ecosystem', 'Export & Trade'].map(c => <option key={c}>{c}</option>)}</select></Field>
        <Field label="URL"><input required style={inputStyle} type="url" value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://..." /></Field>
        <Field label="Tags (comma-separated)"><input style={inputStyle} value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="e.g. Grant, Startup, Federal" /></Field>
        <Field label="Editor's Pick"><label style={checkboxRowStyle}><input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#e7b605' }} /> Mark as Editor's Pick</label></Field>
        <div style={{ gridColumn: '1 / -1' }}><Field label="Description"><textarea style={textareaStyle} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Describe this resource..." /></Field></div>
        <SubmitRow editing={editId !== null} onCancel={() => { setEditId(null); setForm(blankRes); }} addLabel="Add Resource" />
      </form>
      <ItemTable items={items} columns={['Title', 'Category', "Editor's Pick"]} getRow={i => [i.title, i.category, i.featured ? 'Yes' : 'No']} onEdit={handleEdit} onDelete={handleDelete} />
    </>
  );
}

// ─── AWARDS ───────────────────────────────────────────────────────────────────
const blankAward = { name: '', category: '', desc: '', nominationsOpen: false, awardDate: '', sponsor: '' };

function AwardsSection({ onSuccess }: { onSuccess: (msg: string) => void }) {
  const [items, setItems] = useState<AwardItem[]>([]);
  const [form, setForm] = useState(blankAward);
  const [editId, setEditId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(1);
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId !== null) {
      setItems(items.map(i => i.id === editId ? { ...form, id: editId } : i));
      onSuccess('Award updated.');
      setEditId(null);
    } else {
      setItems([...items, { ...form, id: nextId }]);
      setNextId(n => n + 1);
      onSuccess('Award added.');
    }
    setForm(blankAward);
  }

  function handleEdit(item: AwardItem) {
    setForm({ name: item.name, category: item.category, desc: item.desc, nominationsOpen: item.nominationsOpen, awardDate: item.awardDate, sponsor: item.sponsor });
    setEditId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleDelete(id: number) {
    if (confirm('Delete this award?')) { setItems(items.filter(i => i.id !== id)); onSuccess('Award deleted.'); }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="grid-form" style={{ gap: 20 }}>
        <Field label="Award Name"><input required style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Entrepreneur of the Year" /></Field>
        <Field label="Category"><input required style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Innovation, Leadership" /></Field>
        <Field label="Award Date"><input style={inputStyle} type="date" value={form.awardDate} onChange={e => set('awardDate', e.target.value)} /></Field>
        <Field label="Sponsor / Partner"><input style={inputStyle} value={form.sponsor} onChange={e => set('sponsor', e.target.value)} placeholder="e.g. ATB Financial" /></Field>
        <Field label="Nominations Status"><label style={checkboxRowStyle}><input type="checkbox" checked={form.nominationsOpen} onChange={e => set('nominationsOpen', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#e7b605' }} /> Nominations currently open</label></Field>
        <div style={{ gridColumn: '1 / -1' }}><Field label="Description"><textarea style={textareaStyle} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Describe this award..." /></Field></div>
        <SubmitRow editing={editId !== null} onCancel={() => { setEditId(null); setForm(blankAward); }} addLabel="Add Award" />
      </form>
      <ItemTable items={items} columns={['Award', 'Category', 'Nominations', 'Sponsor']} getRow={i => [i.name, i.category, i.nominationsOpen ? 'Open' : 'Closed', i.sponsor || '—']} onEdit={handleEdit} onDelete={handleDelete} />
    </>
  );
}

// ─── WEBINARS ─────────────────────────────────────────────────────────────────
const blankWebinar = { title: '', speaker: '', speakerRole: '', date: '', time: '', duration: '', category: 'Sales', desc: '' };

function WebinarsSection({ onSuccess }: { onSuccess: (msg: string) => void }) {
  const [items, setItems] = useState<WebinarItem[]>([]);
  const [form, setForm] = useState(blankWebinar);
  const [editId, setEditId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(1);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId !== null) {
      setItems(items.map(i => i.id === editId ? { ...form, id: editId } : i));
      onSuccess('Webinar updated.');
      setEditId(null);
    } else {
      setItems([...items, { ...form, id: nextId }]);
      setNextId(n => n + 1);
      onSuccess('Webinar added.');
    }
    setForm(blankWebinar);
  }

  function handleEdit(item: WebinarItem) {
    setForm({ title: item.title, speaker: item.speaker, speakerRole: item.speakerRole, date: item.date, time: item.time, duration: item.duration, category: item.category, desc: item.desc });
    setEditId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleDelete(id: number) {
    if (confirm('Delete this webinar?')) { setItems(items.filter(i => i.id !== id)); onSuccess('Webinar deleted.'); }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="grid-form" style={{ gap: 20 }}>
        <Field label="Webinar Title"><input required style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Scaling Your Sales Team" /></Field>
        <Field label="Category"><select style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)}>{['Sales', 'Finance', 'Funding', 'HR & People', 'Marketing', 'Operations', 'Legal', 'Technology'].map(c => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Speaker Name"><input required style={inputStyle} value={form.speaker} onChange={e => set('speaker', e.target.value)} placeholder="e.g. Jane Smith" /></Field>
        <Field label="Speaker Title / Role"><input style={inputStyle} value={form.speakerRole} onChange={e => set('speakerRole', e.target.value)} placeholder="e.g. CEO, NorthTech" /></Field>
        <Field label="Date"><input required style={inputStyle} type="date" value={form.date} onChange={e => set('date', e.target.value)} /></Field>
        <Field label="Time"><input required style={inputStyle} type="time" value={form.time} onChange={e => set('time', e.target.value)} /></Field>
        <Field label="Duration"><input style={inputStyle} value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="e.g. 60 min" /></Field>
        <div style={{ gridColumn: '1 / -1' }}><Field label="Description"><textarea style={textareaStyle} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="What will attendees learn?" /></Field></div>
        <SubmitRow editing={editId !== null} onCancel={() => { setEditId(null); setForm(blankWebinar); }} addLabel="Add Webinar" />
      </form>
      <ItemTable items={items} columns={['Title', 'Speaker', 'Date', 'Category']} getRow={i => [i.title, i.speaker, i.date || '—', i.category]} onEdit={handleEdit} onDelete={handleDelete} />
    </>
  );
}

// ─── SUPPER CLUB ──────────────────────────────────────────────────────────────
const blankSC = { title: '', date: '', time: '', location: '', capacity: '', desc: '', inviteOnly: true };

function SupperClubSection({ onSuccess }: { onSuccess: (msg: string) => void }) {
  const [items, setItems] = useState<SupperClubItem[]>([]);
  const [form, setForm] = useState(blankSC);
  const [editId, setEditId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(1);
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId !== null) {
      setItems(items.map(i => i.id === editId ? { ...form, id: editId } : i));
      onSuccess('Supper Club event updated.');
      setEditId(null);
    } else {
      setItems([...items, { ...form, id: nextId }]);
      setNextId(n => n + 1);
      onSuccess('Supper Club event added.');
    }
    setForm(blankSC);
  }

  function handleEdit(item: SupperClubItem) {
    setForm({ title: item.title, date: item.date, time: item.time, location: item.location, capacity: item.capacity, desc: item.desc, inviteOnly: item.inviteOnly });
    setEditId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleDelete(id: number) {
    if (confirm('Delete this supper club event?')) { setItems(items.filter(i => i.id !== id)); onSuccess('Event deleted.'); }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="grid-form" style={{ gap: 20 }}>
        <Field label="Event Title"><input required style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Q1 Founders Dinner" /></Field>
        <Field label="Location"><input required style={inputStyle} value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Charcut Roast House, Calgary" /></Field>
        <Field label="Date"><input required style={inputStyle} type="date" value={form.date} onChange={e => set('date', e.target.value)} /></Field>
        <Field label="Time"><input required style={inputStyle} type="time" value={form.time} onChange={e => set('time', e.target.value)} /></Field>
        <Field label="Capacity (seats)"><input style={inputStyle} type="number" value={form.capacity} onChange={e => set('capacity', e.target.value)} placeholder="e.g. 12" /></Field>
        <Field label="Access"><label style={checkboxRowStyle}><input type="checkbox" checked={form.inviteOnly} onChange={e => set('inviteOnly', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#e7b605' }} /> Invite only</label></Field>
        <div style={{ gridColumn: '1 / -1' }}><Field label="Description"><textarea style={textareaStyle} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Describe this supper club event..." /></Field></div>
        <SubmitRow editing={editId !== null} onCancel={() => { setEditId(null); setForm(blankSC); }} addLabel="Add Supper Club Event" />
      </form>
      <ItemTable items={items} columns={['Event', 'Date', 'Location', 'Capacity']} getRow={i => [i.title, i.date || '—', i.location, i.capacity || '—']} onEdit={handleEdit} onDelete={handleDelete} />
    </>
  );
}

// ─── ITEM TABLE ───────────────────────────────────────────────────────────────
function ItemTable<T extends { id: number }>({ items, columns, getRow, onEdit, onDelete }: {
  items: T[]; columns: string[]; getRow: (item: T) => string[]; onEdit: (item: T) => void; onDelete: (id: number) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  if (items.length === 0) return null;
  return (
    <div style={{ marginTop: 40, borderTop: '1px solid #e2e0d8', paddingTop: 32 }}>
      <button type="button" onClick={() => setCollapsed(!collapsed)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#444', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer', marginBottom: 16, padding: 0 }}>
        {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        {items.length} existing {items.length === 1 ? 'entry' : 'entries'}
      </button>
      {!collapsed && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e0d8', background: '#fafaf8' }}>
                {columns.map(col => (
                  <th key={col} style={{ padding: '10px 14px', textAlign: 'left', color: '#9a9585', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '11px', whiteSpace: 'nowrap' }}>{col}</th>
                ))}
                <th style={{ padding: '10px 14px', textAlign: 'right', color: '#9a9585', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '11px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const row = getRow(item);
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e2e0d8', background: idx % 2 === 0 ? '#fff' : '#fafaf8' }}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{ padding: '12px 14px', color: ci === 0 ? '#111' : '#9a9585', fontWeight: ci === 0 ? 600 : 400, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cell}</td>
                    ))}
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <ActionBtns onEdit={() => onEdit(item)} onDelete={() => onDelete(item.id)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('events');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('fe_admin') !== 'true') {
      router.replace('/');
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('fe_admin');
    router.push('/');
  }

  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 5000);
  }

  const activeTabData = tabs.find(t => t.id === activeTab)!;

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f7', color: '#111' }}>
      {/* Top Bar */}
      <div style={{ background: '#000', borderBottom: '1px solid #1a1a1a', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/" style={{ textDecoration: 'none' }}><Logo size="sm" /></Link>
          <div style={{ width: 1, height: 24, background: '#2a2a2a' }} />
          <span className="admin-panel-label" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin Panel</span>
        </div>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: '1px solid #2a2a2a', color: '#888', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 16px', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#e7b605'; e.currentTarget.style.color = '#e7b605'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888'; }}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>

      {/* Secondary Nav */}
      <div style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', display: 'flex', gap: 0 }}>
          <Link href="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'none', color: '#e7b605', borderBottom: '2px solid #e7b605', transition: 'all 0.2s' }}>
            <LayoutDashboard size={14} /> Content Manager
          </Link>
          <Link href="/admin/events" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'none', color: '#888', borderBottom: '2px solid transparent', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ccc'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}>
            <ClipboardList size={14} /> Review Submissions
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 40px' }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: '32px', letterSpacing: '-0.02em', marginBottom: 6, color: '#111' }}>Content Manager</h1>
          <p style={{ color: '#9a9585', fontFamily: 'Noto Serif, serif', fontSize: '15px' }}>Add, edit, and remove content across the Founders Edge platform.</p>
        </div>

        {/* Tab Nav */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 32, flexWrap: 'wrap' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSuccessMsg(''); }} style={{ padding: '12px 20px', background: isActive ? '#000' : '#fff', border: `1px solid ${isActive ? '#000' : '#e2e0d8'}`, color: isActive ? '#e7b605' : '#9a9585', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}>
                <Icon size={15} />{tab.label}
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div style={{ background: '#fff', border: '1px solid #e2e0d8', padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, background: 'rgba(231,182,5,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <activeTabData.icon size={18} style={{ color: '#e7b605' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '18px', color: '#111' }}>{activeTabData.label}</div>
              <div style={{ color: '#9a9585', fontSize: '13px', marginTop: 2, fontFamily: 'Noto Serif, serif' }}>Add new entries or edit / delete existing ones below.</div>
            </div>
          </div>

          {successMsg && <SuccessBanner message={successMsg} onClose={() => setSuccessMsg('')} />}

          {activeTab === 'events' && <EventsSection onSuccess={showSuccess} />}
          {activeTab === 'directory' && <DirectorySection onSuccess={showSuccess} />}
          {activeTab === 'resources' && <ResourcesSection onSuccess={showSuccess} />}
          {activeTab === 'awards' && <AwardsSection onSuccess={showSuccess} />}
          {activeTab === 'webinars' && <WebinarsSection onSuccess={showSuccess} />}
          {activeTab === 'supperclub' && <SupperClubSection onSuccess={showSuccess} />}
        </div>
      </div>
    </div>
  );
}
