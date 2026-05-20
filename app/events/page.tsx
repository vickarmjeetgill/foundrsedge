'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Filter, Search, Users, ExternalLink, ChevronRight } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

const events = [
  { id: 1, title: 'Event Name TBD', date: 'Date TBD', time: 'Time TBD', location: 'Location TBD', category: 'Networking', price: 'TBD', host: 'Host TBD', attendees: 0, featured: true, desc: 'Event description coming soon.' },
  { id: 2, title: 'Event Name TBD', date: 'Date TBD', time: 'Time TBD', location: 'Location TBD', category: 'Workshop', price: 'TBD', host: 'Host TBD', attendees: 0, featured: true, desc: 'Event description coming soon.' },
  { id: 3, title: 'Event Name TBD', date: 'Date TBD', time: 'Time TBD', location: 'Location TBD', category: 'Supper Club', price: 'Members', host: 'Founders Edge', attendees: 0, featured: false, desc: 'Event description coming soon.' },
];

const categories = ['All', 'Networking', 'Workshop', 'Webinar', 'Supper Club'];
const priceFilters = ['Any Price', 'Free', 'Paid'];

const categoryColors: Record<string, string> = {
  'Networking': '#e7b605', 'Workshop': '#9b7011', 'Webinar': '#5a3a08', 'Supper Club': '#000',
};

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState('Any Price');

  const filtered = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.desc.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || e.category === category;
    const matchPrice = priceFilter === 'Any Price' || (priceFilter === 'Free' ? e.price === 'Free' : e.price !== 'Free');
    return matchSearch && matchCat && matchPrice;
  });

  return (
    <PageLayout>
      {/* Hero */}
      <div className="page-hero">
        <div className="container">
          <div className="section-label">Upcoming Events</div>
          <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(40px, 6vw, 72px)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.0, marginBottom: 16 }}>
            EVENTS &<br /><span style={{ color: '#e7b605' }}>EXPERIENCES</span>
          </h1>
          <p style={{ fontFamily: 'Noto Serif, serif', color: '#999', fontSize: '18px', maxWidth: 520, lineHeight: 1.7 }}>
            From intimate supper clubs to hands-on workshops — every event is curated for Calgary's entrepreneurial community.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e0d8', position: 'sticky', top: 72, zIndex: 50 }}>
        <div className="container" style={{ paddingTop: 20, paddingBottom: 20 }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: 200 }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9a9585' }} />
              <input className="input-field" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40, margin: 0 }} />
            </div>
            <select className="select-field" value={category} onChange={e => setCategory(e.target.value)} style={{ width: 'auto', minWidth: 140 }}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <select className="select-field" value={priceFilter} onChange={e => setPriceFilter(e.target.value)} style={{ width: 'auto', minWidth: 120 }}>
              {priceFilters.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div style={{ padding: '60px 0', background: '#aba7a5' }}>
        <div className="container">
          <div style={{ marginBottom: 24, color: '#9a9585', fontSize: '14px', fontWeight: 600 }}>
            {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filtered.map(event => (
              <div key={event.id} style={{
                background: '#fff', border: '1px solid #e2e0d8', padding: '32px',
                display: 'grid', gridTemplateColumns: '1fr auto',
                gap: 24, alignItems: 'start', transition: 'all 0.2s',
                borderLeft: event.featured ? '4px solid #e7b605' : '4px solid transparent',
              }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                <div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                    <span className="tag" style={{ background: categoryColors[event.category] ? `${categoryColors[event.category]}20` : '#f0efe9', color: categoryColors[event.category] || '#5a5650' }}>{event.category}</span>
                    {event.featured && <span className="tag gold">Featured</span>}
                  </div>
                  <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '20px', marginBottom: 8 }}>{event.title}</h3>
                  <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '14px', lineHeight: 1.7, marginBottom: 16 }}>{event.desc}</p>
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9a9585', fontSize: '13px' }}>
                      <Calendar size={14} style={{ color: '#e7b605' }} /> {event.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9a9585', fontSize: '13px' }}>
                      <Clock size={14} style={{ color: '#e7b605' }} /> {event.time}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9a9585', fontSize: '13px' }}>
                      <MapPin size={14} style={{ color: '#e7b605' }} /> {event.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9a9585', fontSize: '13px' }}>
                      <Users size={14} style={{ color: '#e7b605' }} /> {event.attendees} registered
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: '22px', color: event.price === 'Free' ? '#2d7a3a' : '#000', marginBottom: 8 }}>
                    {event.price}
                  </div>
                  <div style={{ color: '#9a9585', fontSize: '12px', marginBottom: 16 }}>Host: {event.host}</div>
                  <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '12px' }}>
                    RSVP <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Event CTA */}
          <div style={{ marginTop: 48, background: '#000', padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '22px', color: '#fff', marginBottom: 8 }}>Hosting an event?</h3>
              <p style={{ color: '#888', fontFamily: 'Noto Serif, serif', fontSize: '15px' }}>Submit your event for review. Members get priority placement and promotion.</p>
            </div>
            <Link href="/events/submit" className="btn-primary">Submit Event <ExternalLink size={16} /></Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
