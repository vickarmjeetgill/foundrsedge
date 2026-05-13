'use client';
import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, ExternalLink, Search, ChevronRight, Star } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

const resources = [
  { id: 1, title: 'Resource Name TBD', category: 'Business Services', stage: ['Start', 'Grow'], desc: 'Resource description coming soon.', url: '#', tags: ['Tag TBD'], featured: true },
  { id: 2, title: 'Resource Name TBD', category: 'Funding', stage: ['Start'], desc: 'Resource description coming soon.', url: '#', tags: ['Tag TBD'], featured: true },
  { id: 3, title: 'Resource Name TBD', category: 'Ecosystem', stage: ['Start', 'Grow', 'Scale'], desc: 'Resource description coming soon.', url: '#', tags: ['Tag TBD'], featured: false },
];

const categories = ['All Categories', 'Funding', 'Business Services', 'Tax & Grants', 'Innovation & IP', 'Banking & Finance', 'Ecosystem', 'Export & Trade'];
const stages = ['All Stages', 'Start', 'Grow', 'Scale'];

const categoryIcons: Record<string, string> = {
  'Funding': '💰', 'Business Services': '🤝', 'Tax & Grants': '📋',
  'Innovation & IP': '💡', 'Banking & Finance': '🏦', 'Ecosystem': '🌐', 'Export & Trade': '✈️',
};

export default function ResourcesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [stage, setStage] = useState('All Stages');

  const filtered = resources.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.desc.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All Categories' || r.category === category;
    const matchStage = stage === 'All Stages' || r.stage.includes(stage);
    return matchSearch && matchCat && matchStage;
  });

  return (
    <PageLayout>
      <div className="page-hero">
        <div className="container">
          <div className="section-label">Curated Resources</div>
          <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(40px, 6vw, 72px)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.0, marginBottom: 16 }}>
            RESOURCES<br /><span style={{ color: '#e7b605' }}>HUB</span>
          </h1>
          <p style={{ fontFamily: 'Noto Serif, serif', color: '#999', fontSize: '18px', maxWidth: 520, lineHeight: 1.7 }}>
            Vetted tools, programs, and organizations to help you build, grow, and scale your business in Calgary and beyond.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e0d8', position: 'sticky', top: 72, zIndex: 50 }}>
        <div className="container" style={{ paddingTop: 20, paddingBottom: 20 }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9a9585' }} />
              <input className="input-field" placeholder="Search resources..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40, margin: 0 }} />
            </div>
            <select className="select-field" value={category} onChange={e => setCategory(e.target.value)} style={{ width: 'auto', minWidth: 180 }}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <select className="select-field" value={stage} onChange={e => setStage(e.target.value)} style={{ width: 'auto', minWidth: 130 }}>
              {stages.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ padding: '60px 0', background: '#f9f9f7' }}>
        <div className="container">
          {/* Stage Guide */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginBottom: 48 }}>
            {[
              { stage: 'Start', desc: 'Ideation to first revenue', color: '#2d7a3a', resources: 'TBD resources' },
              { stage: 'Grow', desc: 'Scaling revenue & team', color: '#9b7011', resources: 'TBD resources' },
              { stage: 'Scale', desc: 'Market expansion', color: '#1a1a6a', resources: 'TBD resources' },
            ].map(s => (
              <button key={s.stage} onClick={() => setStage(s.stage)} style={{
                padding: '24px', background: stage === s.stage ? s.color : '#fff',
                border: `1px solid ${stage === s.stage ? s.color : '#e2e0d8'}`,
                textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
              }}>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '20px', color: stage === s.stage ? '#fff' : '#000', marginBottom: 4 }}>{s.stage}</div>
                <div style={{ fontSize: '13px', color: stage === s.stage ? 'rgba(255,255,255,0.7)' : '#9a9585' }}>{s.desc}</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: stage === s.stage ? 'rgba(255,255,255,0.6)' : '#e7b605', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.resources}</div>
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 20, color: '#9a9585', fontSize: '14px', fontWeight: 600 }}>
            {filtered.length} resource{filtered.length !== 1 ? 's' : ''} found
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            {filtered.map(r => (
              <div key={r.id} className="card" style={{ borderLeft: r.featured ? '4px solid #e7b605' : '4px solid transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span className="tag">{categoryIcons[r.category] || '📌'} {r.category}</span>
                    {r.featured && <span className="tag gold">Editor&apos;s Pick</span>}
                  </div>
                </div>
                <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '18px', marginBottom: 8 }}>{r.title}</h3>
                <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '14px', lineHeight: 1.7, marginBottom: 16 }}>{r.desc}</p>
                <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                  {r.stage.map(s => (
                    <span key={s} className="tag" style={{ background: '#f0efe9' }}>{s}</span>
                  ))}
                  {r.tags.map(t => (
                    <span key={t} style={{ padding: '3px 10px', fontSize: '11px', color: '#9a9585', fontWeight: 600, border: '1px solid #e2e0d8', borderRadius: 2 }}>{t}</span>
                  ))}
                </div>
                <a href={r.url} className="btn-primary" style={{ padding: '10px 20px', fontSize: '12px', width: 'fit-content' }}>
                  Visit Resource <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
