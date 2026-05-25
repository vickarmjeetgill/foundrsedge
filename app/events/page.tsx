'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Search, Users, ExternalLink, ChevronRight, Wifi, Star } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

type Event = {
  id: number;
  title: string;
  desc: string;
  category: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  isOnline: boolean;
  price: string;
  host: string;
  hostBio: string;
  capacity: number;
  attendees: number;
  featured: boolean;
  status: 'approved' | 'pending' | 'rejected';
  tags: string[];
};

const events: Event[] = [
  { id: 1, title: 'YYC Founders Mixer', desc: 'An intimate networking evening for Calgary entrepreneurs. Connect with founders across industries, share what you\'re working on, and build real relationships.', category: 'Networking', date: 'Jun 18, 2026', time: '6:00 PM', duration: '2.5 hrs', location: 'The Commons, 908 17 Ave SW, Calgary', isOnline: false, price: 'Free', host: 'Founders Edge', hostBio: 'Calgary\'s curated entrepreneur membership platform.', capacity: 60, attendees: 42, featured: true, status: 'approved', tags: ['Networking', 'In-Person', 'All Industries'] },
  { id: 2, title: 'Scale-Up Workshop: Hiring Your First 10', desc: 'A hands-on workshop covering the playbook for hiring in the 0–10 employee stage. From job descriptions to culture fit — walk away with a framework you can use immediately.', category: 'Workshop', date: 'Jun 25, 2026', time: '9:00 AM', duration: '3 hrs', location: 'Platform Calgary, 422 11 Ave SW', isOnline: false, price: '$49', host: 'Sarah Kim', hostBio: 'Founder of Pinnacle People Co. Has helped 40+ Calgary companies build their first teams.', capacity: 30, attendees: 28, featured: true, status: 'approved', tags: ['HR', 'Hiring', 'Workshop'] },
  { id: 3, title: 'Funding 101: Grants & Tax Credits for AB Businesses', desc: 'Live webinar walking through the top grants, SR&ED credits, and provincial programs available to Alberta businesses right now. Q&A included.', category: 'Webinar', date: 'Jul 9, 2026', time: '12:00 PM', duration: '1 hr', location: 'Online', isOnline: true, price: 'Free', host: 'Amanda Chen', hostBio: 'CPA and founder of Foothills Financial Advisory. Specializes in government funding programs.', capacity: 200, attendees: 87, featured: false, status: 'approved', tags: ['Finance', 'Grants', 'Online'] },
  { id: 4, title: 'Supper Club — June Edition', desc: 'An intimate dinner for 12 carefully selected Calgary entrepreneurs. Curated theme, facilitated conversation, exceptional food. Invite-based with member priority.', category: 'Supper Club', date: 'Jun 27, 2026', time: '7:00 PM', duration: '3 hrs', location: 'River Café, 25 Prince\'s Island Park', isOnline: false, price: 'Members', host: 'Founders Edge', hostBio: 'Calgary\'s curated entrepreneur membership platform.', capacity: 12, attendees: 10, featured: true, status: 'approved', tags: ['Supper Club', 'Exclusive', 'Members Only'] },
  { id: 5, title: 'B2B Sales Masterclass', desc: 'Learn the frameworks used by top B2B sales teams in Calgary. Cold outreach, discovery calls, proposal structure, and closing — all covered with real examples.', category: 'Workshop', date: 'Jul 16, 2026', time: '2:00 PM', duration: '2 hrs', location: 'Online', isOnline: true, price: '$29', host: 'Mike Okafor', hostBio: 'VP Sales at Velocity Tech. Closed $12M in B2B deals in the last 3 years.', capacity: 100, attendees: 34, featured: false, status: 'approved', tags: ['Sales', 'B2B', 'Online'] },
];

const categoryColors: Record<string, string> = {
  Networking: '#e7b605',
  Workshop: '#9b7011',
  Webinar: '#5a3a08',
  'Supper Club': '#000',
  Other: '#5a5650',
};

const categories = ['All', 'Networking', 'Workshop', 'Webinar', 'Supper Club', 'Other'];

function getWeekRange() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
}

function getMonthRange() {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
  };
}

function parseEventDate(dateStr: string): Date {
  return new Date(dateStr + ' 2026');
}

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [dateFilter, setDateFilter] = useState('All Dates');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const filtered = events
    .filter(e => e.status === 'approved')
    .filter(e => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        e.title.toLowerCase().includes(q) ||
        e.desc.toLowerCase().includes(q) ||
        e.host.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q);
      const matchCat = category === 'All' || e.category === category;
      const matchLocation =
        locationFilter === 'All Locations' ||
        (locationFilter === 'Online' && e.isOnline) ||
        (locationFilter === 'In-Person' && !e.isOnline);
      const matchFeatured = !featuredOnly || e.featured;

      let matchDate = true;
      if (dateFilter === 'This Week') {
        const { start, end } = getWeekRange();
        const d = parseEventDate(e.date);
        matchDate = d >= start && d <= end;
      } else if (dateFilter === 'This Month') {
        const { start, end } = getMonthRange();
        const d = parseEventDate(e.date);
        matchDate = d >= start && d <= end;
      }

      return matchSearch && matchCat && matchLocation && matchFeatured && matchDate;
    })
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return parseEventDate(a.date).getTime() - parseEventDate(b.date).getTime();
    });

  return (
    <PageLayout>
      {/* Hero */}
      <div className="page-hero">
        <div className="container">
          <div className="section-label">Upcoming Events</div>
          <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(40px, 6vw, 72px)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.0, marginBottom: 16 }}>
            EVENTS &amp;<br /><span style={{ color: '#e7b605' }}>EXPERIENCES</span>
          </h1>
          <p style={{ fontFamily: 'Noto Serif, serif', color: '#999', fontSize: '18px', maxWidth: 520, lineHeight: 1.7 }}>
            From intimate supper clubs to hands-on workshops — every event is curated for Calgary's entrepreneurial community.
          </p>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e0d8', position: 'sticky', top: 72, zIndex: 50 }}>
        <div className="container" style={{ paddingTop: 20, paddingBottom: 20 }}>
          <div className="filter-bar-inner" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: '1', minWidth: 200 }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9a9585' }} />
              <input
                className="input-field"
                placeholder="Search events..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 40, margin: 0 }}
              />
            </div>

            {/* Category */}
            <select className="select-field" value={category} onChange={e => setCategory(e.target.value)} style={{ width: 'auto', minWidth: 140, margin: 0 }}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>

            {/* Date */}
            <select className="select-field" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ width: 'auto', minWidth: 140, margin: 0 }}>
              {['All Dates', 'This Week', 'This Month'].map(d => <option key={d}>{d}</option>)}
            </select>

            {/* Location */}
            <select className="select-field" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} style={{ width: 'auto', minWidth: 140, margin: 0 }}>
              {['All Locations', 'In-Person', 'Online'].map(l => <option key={l}>{l}</option>)}
            </select>

            {/* Featured toggle */}
            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '12px 18px', border: '1px solid',
                borderColor: featuredOnly ? '#e7b605' : '#e2e0d8',
                background: featuredOnly ? 'rgba(231,182,5,0.08)' : 'transparent',
                color: featuredOnly ? '#9b7011' : '#9a9585',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px',
                letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Star size={13} fill={featuredOnly ? '#e7b605' : 'none'} stroke={featuredOnly ? '#9b7011' : '#9a9585'} />
              Featured
            </button>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div style={{ padding: '60px 0', background: '#f9f9f7' }}>
        <div className="container">
          <div style={{ marginBottom: 24, color: '#9a9585', fontSize: '14px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>
            {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 40px', background: '#fff', border: '1px solid #e2e0d8' }}>
                <div style={{ fontSize: '40px', marginBottom: 16 }}>🔍</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: 8 }}>No events found</div>
                <div style={{ color: '#9a9585', fontFamily: 'Noto Serif, serif' }}>Try adjusting your filters or search terms.</div>
              </div>
            )}

            {filtered.map(event => {
              const spotsLeft = event.capacity - event.attendees;
              const fillPct = Math.round((event.attendees / event.capacity) * 100);
              return (
                <div
                  key={event.id}
                  className="card-row"
                  style={{
                    background: '#fff',
                    border: '1px solid #e2e0d8',
                    padding: '32px',
                    transition: 'all 0.2s',
                    borderLeft: event.featured ? '4px solid #e7b605' : '4px solid transparent',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                >
                  {/* Left: Content */}
                  <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span
                        className="tag"
                        style={{
                          background: categoryColors[event.category] ? `${categoryColors[event.category]}20` : '#f0efe9',
                          color: categoryColors[event.category] || '#5a5650',
                        }}
                      >
                        {event.category}
                      </span>
                      {event.featured && <span className="tag gold"><Star size={10} style={{ marginRight: 3 }} fill="#9b7011" />Featured</span>}
                      {event.isOnline && (
                        <span className="tag" style={{ background: '#e8f4ff', color: '#1a6fc4' }}>
                          <Wifi size={10} style={{ marginRight: 3 }} />Online
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '20px', marginBottom: 8, color: '#2a2820' }}>
                      {event.title}
                    </h3>
                    <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '14px', lineHeight: 1.7, marginBottom: 16, maxWidth: 580 }}>
                      {event.desc.length > 140 ? event.desc.slice(0, 140) + '…' : event.desc}
                    </p>

                    <div style={{ color: '#9a9585', fontSize: '13px', marginBottom: 16, fontFamily: 'DM Sans, sans-serif' }}>
                      Hosted by <strong style={{ color: '#5a5650' }}>{event.host}</strong>
                    </div>

                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9a9585', fontSize: '13px' }}>
                        <Calendar size={14} style={{ color: '#e7b605' }} /> {event.date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9a9585', fontSize: '13px' }}>
                        <Clock size={14} style={{ color: '#e7b605' }} /> {event.time} · {event.duration}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9a9585', fontSize: '13px' }}>
                        <MapPin size={14} style={{ color: '#e7b605' }} /> {event.location}
                      </span>
                    </div>

                    {/* Capacity bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, maxWidth: 160, height: 4, background: '#e2e0d8', borderRadius: 2 }}>
                        <div style={{ height: '100%', width: `${fillPct}%`, background: fillPct >= 90 ? '#c0392b' : '#e7b605', borderRadius: 2, transition: 'width 0.4s' }} />
                      </div>
                      <span style={{ fontSize: '12px', color: '#9a9585', fontFamily: 'DM Sans, sans-serif' }}>
                        <Users size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                        {event.attendees}/{event.capacity} · {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}
                      </span>
                    </div>
                  </div>

                  {/* Right: CTA */}
                  <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                    <div style={{
                      fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: '24px',
                      color: event.price === 'Free' ? '#2d7a3a' : event.price === 'Members' ? '#9b7011' : '#000',
                    }}>
                      {event.price}
                    </div>
                    <Link href={`/events/${event.id}`} className="btn-primary" style={{ padding: '10px 20px', fontSize: '12px' }}>
                      View Event <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
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
