'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Trophy, Search, Calendar, Globe, DollarSign, Tag, Clock } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

const awards = [
  { id: 1, name: 'Award Name TBD', org: 'Organization TBD', region: 'Calgary', deadline: 'TBD', category: 'General Business', value: 'TBD', cycle: 'Annual', desc: 'Award description coming soon.', featured: true },
  { id: 2, name: 'Award Name TBD', org: 'Organization TBD', region: 'Alberta', deadline: 'TBD', category: 'Technology', value: 'TBD', cycle: 'Annual', desc: 'Award description coming soon.', featured: true },
  { id: 3, name: 'Award Name TBD', org: 'Organization TBD', region: 'National', deadline: 'TBD', category: 'Leadership', value: 'TBD', cycle: 'Annual', desc: 'Award description coming soon.', featured: false },
];

const regions = ['All Regions', 'Calgary', 'Alberta', 'Western Canada', 'National'];
const categories = ['All Categories', 'General Business', 'Technology', 'Women in Business', 'Leadership', 'SMB', 'Media & Content'];

function daysUntil(dateStr: string) {
  if (dateStr === 'Rolling') return null;
  const deadline = new Date(dateStr);
  const now = new Date();
  const diff = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function AwardsPage() {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All Regions');
  const [category, setCategory] = useState('All Categories');

  const filtered = awards.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase());
    const matchRegion = region === 'All Regions' || a.region === region;
    const matchCat = category === 'All Categories' || a.category === category;
    return matchSearch && matchRegion && matchCat;
  });

  const sorted = [...filtered].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return (
    <PageLayout>
      <div className="page-hero">
        <div className="container">
          <div className="section-label">Awards & Recognition</div>
          <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(40px, 6vw, 72px)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.0, marginBottom: 16 }}>
            AWARDS &<br /><span style={{ color: '#e7b605' }}>ACCOLADES</span>
          </h1>
          <p style={{ fontFamily: 'Noto Serif, serif', color: '#999', fontSize: '18px', maxWidth: 520, lineHeight: 1.7 }}>
            Every business award, grant, and recognition opportunity in one place. Never miss a deadline again.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e0d8', position: 'sticky', top: 72, zIndex: 50 }}>
        <div className="container" style={{ paddingTop: 20, paddingBottom: 20 }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9a9585' }} />
              <input className="input-field" placeholder="Search awards..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40, margin: 0 }} />
            </div>
            <select className="select-field" value={region} onChange={e => setRegion(e.target.value)} style={{ width: 'auto', minWidth: 150 }}>
              {regions.map(r => <option key={r}>{r}</option>)}
            </select>
            <select className="select-field" value={category} onChange={e => setCategory(e.target.value)} style={{ width: 'auto', minWidth: 180 }}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ padding: '60px 0', background: '#aba7a5' }}>
        <div className="container">
          <div style={{ marginBottom: 24, color: '#9a9585', fontSize: '14px', fontWeight: 600 }}>
            {sorted.length} award{sorted.length !== 1 ? 's' : ''} found
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {sorted.map(award => {
              const days = daysUntil(award.deadline);
              const isUrgent = days !== null && days <= 30;
              return (
                <div key={award.id} style={{
                  background: '#fff', border: '1px solid #e2e0d8', padding: '32px',
                  display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start',
                  borderLeft: award.featured ? '4px solid #e7b605' : '4px solid transparent',
                  transition: 'box-shadow 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                  <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                      <span className="tag"><Tag size={10} style={{ display: 'inline', marginRight: 4 }} />{award.category}</span>
                      <span className="tag"><Globe size={10} style={{ display: 'inline', marginRight: 4 }} />{award.region}</span>
                      {award.featured && <span className="tag gold">Editor&apos;s Pick</span>}
                      {isUrgent && <span className="tag" style={{ background: '#fee2e2', color: '#dc2626' }}>Deadline Soon</span>}
                    </div>
                    <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '20px', marginBottom: 4 }}>{award.name}</h3>
                    <div style={{ color: '#9b7011', fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 12 }}>{award.org}</div>
                    <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '14px', lineHeight: 1.7 }}>{award.desc}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginBottom: 4 }}>
                      <DollarSign size={14} style={{ color: '#e7b605' }} />
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '18px', color: award.value === 'Prestige' ? '#000' : '#2d7a3a' }}>{award.value}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', color: isUrgent ? '#dc2626' : '#9a9585', fontSize: '13px', marginBottom: 4 }}>
                      <Calendar size={13} /> Deadline: {award.deadline}
                    </div>
                    {days !== null && (
                      <div style={{ fontSize: '12px', color: isUrgent ? '#dc2626' : '#9a9585', marginBottom: 16 }}>
                        {days > 0 ? `${days} days remaining` : 'Deadline passed'}
                      </div>
                    )}
                    <div style={{ fontSize: '11px', color: '#9a9585', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{award.cycle}</div>
                    <button className="btn-primary" style={{ padding: '10px 18px', fontSize: '12px' }}>Apply Now</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
