'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star, TrendingUp, ExternalLink, Zap, Filter } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

const businesses = [
  { id: 1, name: 'Business Name TBD', industry: 'Technology', location: 'Calgary', desc: 'Business description coming soon.', rating: 0, reviews: 0, featured: true, boosted: true, tags: ['Tag TBD'] },
  { id: 2, name: 'Business Name TBD', industry: 'Marketing', location: 'Calgary', desc: 'Business description coming soon.', rating: 0, reviews: 0, featured: true, boosted: false, tags: ['Tag TBD'] },
  { id: 3, name: 'Business Name TBD', industry: 'Finance', location: 'Calgary', desc: 'Business description coming soon.', rating: 0, reviews: 0, featured: false, boosted: false, tags: ['Tag TBD'] },
];

const industries = ['All Industries', 'Technology', 'Marketing', 'Finance', 'Legal', 'HR & People', 'Design', 'Health & Wellness', 'Construction'];

export default function DirectoryPage() {
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All Industries');
  const [showFeatured, setShowFeatured] = useState(false);

  const filtered = businesses.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.desc.toLowerCase().includes(search.toLowerCase()) || b.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchInd = industry === 'All Industries' || b.industry === industry;
    const matchFeat = !showFeatured || b.featured;
    return matchSearch && matchInd && matchFeat;
  });

  // Sort: boosted first, then featured, then rest
  const sorted = [...filtered].sort((a, b) => (b.boosted ? 1 : 0) - (a.boosted ? 1 : 0) || (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return (
    <PageLayout>
      <div className="page-hero">
        <div className="container">
          <div className="section-label">Member Directory</div>
          <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(40px, 6vw, 72px)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.0, marginBottom: 16 }}>
            BUSINESS<br /><span style={{ color: '#e7b605' }}>DIRECTORY</span>
          </h1>
          <p style={{ fontFamily: 'Noto Serif, serif', color: '#999', fontSize: '18px', maxWidth: 520, lineHeight: 1.7 }}>
            Discover and connect with vetted Calgary businesses. Every listing is a screened Founders Edge member.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e0d8', position: 'sticky', top: 72, zIndex: 50 }}>
        <div className="container" style={{ paddingTop: 20, paddingBottom: 20 }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9a9585' }} />
              <input className="input-field" placeholder="Search businesses, services, tags..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40, margin: 0 }} />
            </div>
            <select className="select-field" value={industry} onChange={e => setIndustry(e.target.value)} style={{ width: 'auto', minWidth: 160 }}>
              {industries.map(i => <option key={i}>{i}</option>)}
            </select>
            <button onClick={() => setShowFeatured(!showFeatured)} style={{
              padding: '14px 20px', background: showFeatured ? '#e7b605' : 'transparent',
              border: `1px solid ${showFeatured ? '#e7b605' : '#e2e0d8'}`,
              color: showFeatured ? '#000' : '#5a5650', fontFamily: 'DM Sans, sans-serif',
              fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.2s', letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              <Star size={14} /> Featured Only
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '60px 0', background: '#aba7a5' }}>
        <div className="container">
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ color: '#9a9585', fontSize: '14px', fontWeight: 600 }}>{sorted.length} businesses found</span>
            <Link href="/directory/list" className="btn-outline" style={{ padding: '10px 20px', fontSize: '12px' }}>
              List Your Business
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            {sorted.map(biz => (
              <div key={biz.id} className="card" style={{
                borderLeft: biz.boosted ? '4px solid #e7b605' : biz.featured ? '4px solid #9b7011' : '4px solid transparent',
                position: 'relative',
              }}>
                {biz.boosted && (
                  <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center', gap: 4, background: '#e7b605', color: '#000', padding: '3px 10px', fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    <Zap size={10} /> Boosted
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span className="tag">{biz.industry}</span>
                  {biz.featured && !biz.boosted && <span className="tag gold">Featured</span>}
                </div>
                <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '20px', marginBottom: 8 }}>{biz.name}</h3>
                <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '14px', lineHeight: 1.7, marginBottom: 16 }}>{biz.desc}</p>
                <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9a9585', fontSize: '13px' }}>
                    <MapPin size={13} style={{ color: '#e7b605' }} /> {biz.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9a9585', fontSize: '13px' }}>
                    <Star size={13} style={{ color: '#e7b605', fill: '#e7b605' }} /> {biz.rating} ({biz.reviews} reviews)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {biz.tags.map(tag => (
                    <span key={tag} style={{ padding: '3px 10px', background: '#f0efe9', fontSize: '11px', color: '#5a5650', fontWeight: 600, borderRadius: 2 }}>{tag}</span>
                  ))}
                </div>
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #e2e0d8', display: 'flex', gap: 12 }}>
                  <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '12px', flex: 1 }}>View Profile</button>
                  <button className="btn-outline" style={{ padding: '8px 18px', fontSize: '12px' }}>Connect</button>
                </div>
              </div>
            ))}
          </div>

          {/* Upgrade CTA */}
          <div style={{ marginTop: 48, background: '#000', padding: '48px', textAlign: 'center' }}>
            <TrendingUp size={32} style={{ color: '#e7b605', marginBottom: 16 }} />
            <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: '28px', color: '#fff', marginBottom: 12 }}>Boost Your Listing</h3>
            <p style={{ fontFamily: 'Noto Serif, serif', color: '#888', marginBottom: 28, maxWidth: 480, margin: '0 auto 28px' }}>
              Stand out from the crowd. Featured listings get 5x more profile views and top placement in search results.
            </p>
            <Link href="/directory/upgrade" className="btn-primary">Upgrade Your Listing</Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
