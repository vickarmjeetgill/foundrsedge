'use client';
import { useState } from 'react';
import { Video, Calendar, Clock, Users, Lock, Play } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

const webinars = [
  { id: 1, title: 'Webinar Title TBD', speaker: 'Speaker Name TBD', speakerRole: 'Title TBD', date: 'Date TBD', time: 'Time TBD', duration: 'TBD', attendees: 0, category: 'Sales', stage: ['Grow', 'Scale'], upcoming: true, replay: false, desc: 'Webinar description coming soon.' },
  { id: 2, title: 'Webinar Title TBD', speaker: 'Speaker Name TBD', speakerRole: 'Title TBD', date: 'Date TBD', time: 'Time TBD', duration: 'TBD', attendees: 0, category: 'Finance', stage: ['Start', 'Grow'], upcoming: true, replay: false, desc: 'Webinar description coming soon.' },
  { id: 3, title: 'Webinar Title TBD', speaker: 'Speaker Name TBD', speakerRole: 'Title TBD', date: 'Date TBD', time: 'Time TBD', duration: 'TBD', attendees: 0, category: 'Funding', stage: ['Start', 'Grow'], upcoming: false, replay: true, desc: 'Webinar description coming soon.' },
];

const categories = ['All', 'Sales', 'Finance', 'Funding', 'HR & People', 'Marketing'];

export default function WebinarsPage() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'replay'>('all');
  const [category, setCategory] = useState('All');

  const filtered = webinars.filter(w => {
    const matchFilter = filter === 'all' || (filter === 'upcoming' && w.upcoming) || (filter === 'replay' && w.replay);
    const matchCat = category === 'All' || w.category === category;
    return matchFilter && matchCat;
  });

  return (
    <PageLayout>
      <div className="page-hero">
        <div className="container">
          <div className="section-label">Member Webinars</div>
          <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(40px, 6vw, 72px)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.0, marginBottom: 16 }}>
            EXPERT<br /><span style={{ color: '#e7b605' }}>WEBINARS</span>
          </h1>
          <p style={{ fontFamily: 'Noto Serif, serif', color: '#999', fontSize: '18px', maxWidth: 520, lineHeight: 1.7 }}>
            Monthly webinars from vetted experts. Only the best speakers are invited. No fluff, just actionable insights.
          </p>
        </div>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #e2e0d8', position: 'sticky', top: 72, zIndex: 50 }}>
        <div className="container" style={{ paddingTop: 20, paddingBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {(['all', 'upcoming', 'replay'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '10px 20px', background: filter === f ? '#000' : 'transparent',
                border: `1px solid ${filter === f ? '#000' : '#e2e0d8'}`,
                color: filter === f ? '#fff' : '#5a5650', fontFamily: 'DM Sans, sans-serif',
                fontWeight: 700, fontSize: '13px', cursor: 'pointer', letterSpacing: '0.05em',
                textTransform: 'capitalize', transition: 'all 0.2s',
              }}>
                {f === 'all' ? 'All Webinars' : f === 'upcoming' ? '📅 Upcoming' : '🎬 Replay Library'}
              </button>
            ))}
            <div style={{ marginLeft: 'auto' }}>
              <select className="select-field" value={category} onChange={e => setCategory(e.target.value)} style={{ width: 'auto', minWidth: 150 }}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '60px 0', background: '#f9f9f7' }}>
        <div className="container">
          {/* Members-only notice */}
          <div style={{ background: '#000', padding: '20px 32px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
            <Lock size={18} style={{ color: '#e7b605', flexShrink: 0 }} />
            <span style={{ color: '#ccc', fontSize: '14px', fontFamily: 'Noto Serif, serif' }}>
              Webinar access is included with your Founders Edge membership. <a href="/apply" style={{ color: '#e7b605', fontWeight: 700 }}>Apply to become a member →</a>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            {filtered.map(w => (
              <div key={w.id} className="card" style={{ borderTop: w.upcoming ? '4px solid #e7b605' : '4px solid #333' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                  <span className="tag">{w.category}</span>
                  {w.upcoming && <span className="tag" style={{ background: 'rgba(231,182,5,0.12)', color: '#9b7011' }}>📅 Upcoming</span>}
                  {w.replay && <span className="tag" style={{ background: '#f0f0f0', color: '#333' }}>🎬 Replay</span>}
                </div>
                <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '20px', marginBottom: 8 }}>{w.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, background: '#e7b605', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', color: '#000', flexShrink: 0 }}>
                    {w.speaker.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>{w.speaker}</div>
                    <div style={{ fontSize: '12px', color: '#9a9585' }}>{w.speakerRole}</div>
                  </div>
                </div>
                <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '14px', lineHeight: 1.7, marginBottom: 16 }}>{w.desc}</p>
                <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9a9585', fontSize: '13px' }}>
                    <Calendar size={13} style={{ color: '#e7b605' }} /> {w.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9a9585', fontSize: '13px' }}>
                    <Clock size={13} style={{ color: '#e7b605' }} /> {w.time} · {w.duration}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9a9585', fontSize: '13px' }}>
                    <Users size={13} style={{ color: '#e7b605' }} /> {w.attendees} registered
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
                  {w.stage.map(s => <span key={s} className="tag" style={{ background: '#f0efe9' }}>{s}</span>)}
                </div>
                <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '12px' }}>
                  {w.replay ? <><Play size={14} /> Watch Replay</> : 'Register Free'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
