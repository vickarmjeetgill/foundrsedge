'use client';
import { use } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Users, Share2, ArrowLeft, Wifi, Star, ChevronRight } from 'lucide-react';
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
  { id: 1, title: 'YYC Founders Mixer', desc: 'An intimate networking evening for Calgary entrepreneurs. Connect with founders across industries, share what you\'re working on, and build real relationships.\n\nThis is your chance to meet the people building Calgary\'s next wave of companies. Whether you\'re pre-revenue or post-Series A, all founders are welcome. The format is unstructured — come with an open mind and leave with real connections.\n\nLight refreshments provided. Dress is smart-casual.', category: 'Networking', date: 'Jun 18, 2026', time: '6:00 PM', duration: '2.5 hrs', location: 'The Commons, 908 17 Ave SW, Calgary', isOnline: false, price: 'Free', host: 'Founders Edge', hostBio: 'Calgary\'s curated entrepreneur membership platform.', capacity: 60, attendees: 42, featured: true, status: 'approved', tags: ['Networking', 'In-Person', 'All Industries'] },
  { id: 2, title: 'Scale-Up Workshop: Hiring Your First 10', desc: 'A hands-on workshop covering the playbook for hiring in the 0–10 employee stage. From job descriptions to culture fit — walk away with a framework you can use immediately.\n\nMost founders make critical hiring mistakes in the early stages. This workshop fixes that. Sarah Kim will walk through her proven process used across 40+ Calgary startups — from crafting role clarity docs to structuring your interview pipeline.\n\nYou\'ll leave with a ready-to-use hiring template and a clear framework for your next hire.', category: 'Workshop', date: 'Jun 25, 2026', time: '9:00 AM', duration: '3 hrs', location: 'Platform Calgary, 422 11 Ave SW', isOnline: false, price: '$49', host: 'Sarah Kim', hostBio: 'Founder of Pinnacle People Co. Has helped 40+ Calgary companies build their first teams.', capacity: 30, attendees: 28, featured: true, status: 'approved', tags: ['HR', 'Hiring', 'Workshop'] },
  { id: 3, title: 'Funding 101: Grants & Tax Credits for AB Businesses', desc: 'Live webinar walking through the top grants, SR&ED credits, and provincial programs available to Alberta businesses right now. Q&A included.\n\nLeave money on the table and your competitors won\'t. Amanda Chen breaks down every major funding program available to Alberta businesses — from IRAP to SR&ED to provincial grants — and shows you exactly how to qualify and apply.\n\nLive Q&A in the last 20 minutes. Recording available to registered attendees.', category: 'Webinar', date: 'Jul 9, 2026', time: '12:00 PM', duration: '1 hr', location: 'Online', isOnline: true, price: 'Free', host: 'Amanda Chen', hostBio: 'CPA and founder of Foothills Financial Advisory. Specializes in government funding programs.', capacity: 200, attendees: 87, featured: false, status: 'approved', tags: ['Finance', 'Grants', 'Online'] },
  { id: 4, title: 'Supper Club — June Edition', desc: 'An intimate dinner for 12 carefully selected Calgary entrepreneurs. Curated theme, facilitated conversation, exceptional food. Invite-based with member priority.\n\nEach Supper Club is built around a single question — a provocative topic that shapes the whole evening. Past themes have included "What would you do differently?" and "The biggest mistake you\'re still making."\n\nSeating is strictly limited to 12. Members receive priority access. Non-members may be invited at the discretion of the organizers.', category: 'Supper Club', date: 'Jun 27, 2026', time: '7:00 PM', duration: '3 hrs', location: 'River Café, 25 Prince\'s Island Park', isOnline: false, price: 'Members', host: 'Founders Edge', hostBio: 'Calgary\'s curated entrepreneur membership platform.', capacity: 12, attendees: 10, featured: true, status: 'approved', tags: ['Supper Club', 'Exclusive', 'Members Only'] },
  { id: 5, title: 'B2B Sales Masterclass', desc: 'Learn the frameworks used by top B2B sales teams in Calgary. Cold outreach, discovery calls, proposal structure, and closing — all covered with real examples.\n\nMike Okafor has closed $12M in B2B deals over the past 3 years, and he\'s sharing the exact playbook. From your first cold email to getting a signature on a contract — this masterclass covers the full funnel with real Calgary case studies.\n\nBrought your laptop. We\'ll workshop your actual outreach copy live.', category: 'Workshop', date: 'Jul 16, 2026', time: '2:00 PM', duration: '2 hrs', location: 'Online', isOnline: true, price: '$29', host: 'Mike Okafor', hostBio: 'VP Sales at Velocity Tech. Closed $12M in B2B deals in the last 3 years.', capacity: 100, attendees: 34, featured: false, status: 'approved', tags: ['Sales', 'B2B', 'Online'] },
];

const categoryColors: Record<string, string> = {
  Networking: '#e7b605',
  Workshop: '#9b7011',
  Webinar: '#5a3a08',
  'Supper Club': '#000',
  Other: '#5a5650',
};

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const event = events.find(e => e.id === Number(id));

  if (!event) {
    return (
      <PageLayout>
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '80px 40px' }}>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '28px', color: '#2a2820' }}>Event not found</div>
          <p style={{ color: '#9a9585', fontFamily: 'Noto Serif, serif' }}>This event may have been removed or the link is incorrect.</p>
          <Link href="/events" className="btn-primary" style={{ marginTop: 8 }}>
            <ArrowLeft size={16} /> Back to Events
          </Link>
        </div>
      </PageLayout>
    );
  }

  const spotsLeft = event.capacity - event.attendees;
  const fillPct = Math.round((event.attendees / event.capacity) * 100);
  const otherEvents = events.filter(e => e.id !== event.id && e.status === 'approved').slice(0, 2);
  const hostInitial = event.host.charAt(0).toUpperCase();

  const descParagraphs = event.desc.split('\n\n').filter(Boolean);

  return (
    <PageLayout>
      {/* Hero */}
      <div className="page-hero">
        <div className="container">
          <Link
            href="/events"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#9a9585', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, textDecoration: 'none', marginBottom: 24, letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            <ArrowLeft size={14} /> All Events
          </Link>

          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <span
              className="tag"
              style={{
                background: categoryColors[event.category] ? `${categoryColors[event.category]}30` : '#333',
                color: categoryColors[event.category] || '#fff',
              }}
            >
              {event.category}
            </span>
            {event.featured && (
              <span className="tag" style={{ background: 'rgba(231,182,5,0.15)', color: '#e7b605' }}>
                <Star size={10} fill="#e7b605" style={{ marginRight: 3 }} />Featured
              </span>
            )}
            {event.isOnline && (
              <span className="tag" style={{ background: 'rgba(26,111,196,0.2)', color: '#60aaff' }}>
                <Wifi size={10} style={{ marginRight: 3 }} />Online
              </span>
            )}
          </div>

          <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 60px)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 28, maxWidth: 760 }}>
            {event.title}
          </h1>

          {/* Meta row */}
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ccc', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>
              <Calendar size={16} style={{ color: '#e7b605' }} />
              {event.date} at {event.time}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ccc', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>
              <Clock size={16} style={{ color: '#e7b605' }} />
              {event.duration}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ccc', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>
              <MapPin size={16} style={{ color: '#e7b605' }} />
              {event.location}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ background: '#f9f9f7', padding: '80px 0' }}>
        <div className="container">
          <div className="grid-halves" style={{ alignItems: 'start' }}>
            {/* Left: Description + Host + Tags */}
            <div>
              {/* Description */}
              <div style={{ marginBottom: 48 }}>
                <div className="section-label" style={{ marginBottom: 20 }}>About This Event</div>
                {descParagraphs.map((para, i) => (
                  <p key={i} style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '16px', lineHeight: 1.8, marginBottom: 20 }}>
                    {para}
                  </p>
                ))}
              </div>

              {/* Host card */}
              <div style={{ background: '#fff', border: '1px solid #e2e0d8', padding: '28px', marginBottom: 32 }}>
                <div className="section-label" style={{ marginBottom: 20 }}>Your Host</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{
                    width: 52, height: 52, background: '#000', color: '#e7b605',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: '22px', flexShrink: 0,
                  }}>
                    {hostInitial}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '16px', color: '#2a2820', marginBottom: 6 }}>
                      {event.host}
                    </div>
                    <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '14px', lineHeight: 1.7 }}>
                      {event.hostBio}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="section-label" style={{ marginBottom: 16 }}>Tags</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {event.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Booking widget */}
            <div style={{ position: 'sticky', top: 100 }}>
              <div style={{ background: '#fff', border: '1px solid #e2e0d8', borderTop: '4px solid #000' }}>
                <div style={{ padding: '32px', borderBottom: '1px solid #e2e0d8' }}>
                  <div style={{
                    fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: '36px',
                    color: event.price === 'Free' ? '#2d7a3a' : event.price === 'Members' ? '#9b7011' : '#000',
                    marginBottom: 4,
                  }}>
                    {event.price}
                  </div>
                  <div style={{ color: '#9a9585', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>
                    {event.price === 'Free' ? 'No cost to attend' : event.price === 'Members' ? 'Members only — login to access' : 'Per attendee'}
                  </div>
                </div>

                <div style={{ padding: '28px 32px', borderBottom: '1px solid #e2e0d8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, color: '#5a5650' }}>
                      <Users size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                      {event.attendees} registered
                    </span>
                    <span style={{
                      fontSize: '12px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700,
                      color: spotsLeft <= 5 ? '#c0392b' : '#9a9585',
                    }}>
                      {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Fully booked'}
                    </span>
                  </div>
                  <div style={{ height: 6, background: '#e2e0d8', borderRadius: 3 }}>
                    <div style={{
                      height: '100%', width: `${fillPct}%`,
                      background: fillPct >= 90 ? '#c0392b' : '#e7b605',
                      borderRadius: 3, transition: 'width 0.4s',
                    }} />
                  </div>
                  <div style={{ textAlign: 'right', marginTop: 6, fontSize: '11px', color: '#9a9585', fontFamily: 'DM Sans, sans-serif' }}>
                    {fillPct}% full · Capacity {event.capacity}
                  </div>
                </div>

                <div style={{ padding: '28px 32px', borderBottom: '1px solid #e2e0d8' }}>
                  <button
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '14px' }}
                    disabled={spotsLeft === 0}
                  >
                    {spotsLeft === 0 ? 'Event Full' : event.price === 'Members' ? 'Login to Register' : 'RSVP / Register'}
                  </button>
                  {event.price !== 'Free' && event.price !== 'Members' && (
                    <p style={{ textAlign: 'center', marginTop: 12, fontSize: '12px', color: '#9a9585', fontFamily: 'DM Sans, sans-serif' }}>
                      Secure payment via Stripe
                    </p>
                  )}
                </div>

                <div style={{ padding: '20px 32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#9a9585', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', cursor: 'pointer' }}
                    onClick={() => { if (typeof window !== 'undefined') navigator.clipboard?.writeText(window.location.href); }}
                  >
                    <Share2 size={14} />
                    Share this event
                  </div>
                </div>
              </div>

              {/* Quick details */}
              <div style={{ marginTop: 16, background: '#fff', border: '1px solid #e2e0d8', padding: '24px 28px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <Calendar size={16} style={{ color: '#e7b605', marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', color: '#2a2820' }}>{event.date}</div>
                      <div style={{ fontSize: '12px', color: '#9a9585', fontFamily: 'DM Sans, sans-serif' }}>{event.time} · {event.duration}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <MapPin size={16} style={{ color: '#e7b605', marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', color: '#2a2820' }}>
                        {event.isOnline ? 'Online Event' : event.location}
                      </div>
                      {event.isOnline && (
                        <div style={{ fontSize: '12px', color: '#9a9585', fontFamily: 'DM Sans, sans-serif' }}>Link sent upon registration</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* More Events */}
          {otherEvents.length > 0 && (
            <div style={{ marginTop: 80 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div className="section-label">More Events</div>
                <Link href="/events" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', color: '#9b7011', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  View All <ChevronRight size={14} />
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {otherEvents.map(e => (
                  <div
                    key={e.id}
                    className="card-row"
                    style={{ background: '#fff', border: '1px solid #e2e0d8', padding: '28px', transition: 'all 0.2s' }}
                    onMouseEnter={el => (el.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)')}
                    onMouseLeave={el => (el.currentTarget.style.boxShadow = 'none')}
                  >
                    <div>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                        <span className="tag" style={{ background: categoryColors[e.category] ? `${categoryColors[e.category]}20` : '#f0efe9', color: categoryColors[e.category] || '#5a5650' }}>{e.category}</span>
                        {e.featured && <span className="tag gold">Featured</span>}
                      </div>
                      <h4 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '17px', marginBottom: 8, color: '#2a2820' }}>{e.title}</h4>
                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#9a9585', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
                          <Calendar size={13} style={{ color: '#e7b605' }} /> {e.date}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#9a9585', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
                          <MapPin size={13} style={{ color: '#e7b605' }} /> {e.location}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: '18px', color: e.price === 'Free' ? '#2d7a3a' : '#000' }}>{e.price}</div>
                      <Link href={`/events/${e.id}`} className="btn-primary" style={{ padding: '8px 16px', fontSize: '11px' }}>
                        View <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
