'use client';
import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, ExternalLink, Search, ChevronRight, Star } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

const resources = [
  { id: 1, title: 'Resource Name TBD', category: 'Business Services', desc: 'Resource description coming soon.', url: '#', tags: ['Tag TBD'], featured: true },
  { id: 2, title: 'Resource Name TBD', category: 'Funding', desc: 'Resource description coming soon.', url: '#', tags: ['Tag TBD'], featured: true },
  { id: 3, title: 'Resource Name TBD', category: 'Ecosystem', desc: 'Resource description coming soon.', url: '#', tags: ['Tag TBD'], featured: false },
];

const categories = ['All Categories', 'Funding', 'Business Services', 'Tax & Grants', 'Innovation & IP', 'Banking & Finance', 'Ecosystem', 'Export & Trade'];

const categoryIcons: Record<string, string> = {
  'Funding': '💰', 'Business Services': '🤝', 'Tax & Grants': '📋',
  'Innovation & IP': '💡', 'Banking & Finance': '🏦', 'Ecosystem': '🌐', 'Export & Trade': '✈️',
};

export default function ResourcesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');

  const filtered = resources.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.desc.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All Categories' || r.category === category;
    return matchSearch && matchCat;
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
          </div>
        </div>
      </div>

      <div style={{ padding: '60px 0', background: '#f9f9f7' }}>
        <div className="container">
          <div style={{ marginBottom: 20, color: '#9a9585', fontSize: '14px', fontWeight: 600 }}>
            {filtered.length} resource{filtered.length !== 1 ? 's' : ''} found
          </div>

          <div className="grid-2">
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
