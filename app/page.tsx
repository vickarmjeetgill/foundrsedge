'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Users, Calendar, BookOpen, Trophy, Star, Zap, Building2, TrendingUp, Handshake, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const features = [
  { icon: Calendar, title: 'Curated Events', desc: 'Feature description coming soon.', href: '/events', label: 'Browse Events' },
  { icon: Building2, title: 'Business Directory', desc: 'Feature description coming soon.', href: '/directory', label: 'View Directory' },
  { icon: BookOpen, title: 'Resources Hub', desc: 'Feature description coming soon.', href: '/resources', label: 'Explore Resources' },
  { icon: Trophy, title: 'Awards & Recognition', desc: 'Feature description coming soon.', href: '/awards', label: 'View Awards' },
  { icon: Users, title: 'Smart Matching', desc: 'Curated member-to-member introductions based on your industry, ideal client, and referral partner needs.', href: '/smart-matching', label: 'Learn More' },
  { icon: Star, title: 'Supper Club', desc: 'Feature description coming soon.', href: '/supper-club', label: 'View Events' },
];

const stats = [
  { value: 'TBD', label: 'Member Businesses' },
  { value: 'TBD', label: 'Events Annually' },
  { value: 'TBD', label: 'Industries Served' },
  { value: 'TBD', label: 'Member Retention' },
];

const testimonials = [
  { quote: 'Member testimonial coming soon.', name: 'Member Name', role: 'Title, Company' },
  { quote: 'Member testimonial coming soon.', name: 'Member Name', role: 'Title, Company' },
  { quote: 'Member testimonial coming soon.', name: 'Member Name', role: 'Title, Company' },
];

export default function Home() {

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 72 }}>
        {/* Geometric background */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', right: -100, top: '10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(231,182,5,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', left: -200, bottom: '10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(155,112,17,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
          {/* Grid lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }} preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#e7b605" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          {/* Large F icon watermark */}
          <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', opacity: 0.04, fontSize: 400, fontWeight: 900, fontFamily: 'DM Sans, sans-serif', color: '#e7b605', lineHeight: 1, userSelect: 'none' }}>F</div>
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 80, paddingBottom: 100 }}>
          <div style={{ maxWidth: 760 }}>
            <div className="section-label" style={{ color: '#e7b605' }}>
              Calgary&apos;s Entrepreneur Platform
            </div>

            <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(42px, 7vw, 88px)', lineHeight: 1.0, color: '#fff', marginBottom: 32, letterSpacing: '-0.02em' }}>
              YOUR EDGE<br />
              <span style={{ color: '#e7b605' }}>STARTS</span><br />
              HERE.
            </h1>

            <p style={{ fontFamily: 'Noto Serif, serif', fontSize: 'clamp(16px, 2vw, 20px)', color: '#aaa', lineHeight: 1.8, maxWidth: 560, marginBottom: 48 }}>
              A curated membership platform connecting Calgary entrepreneurs to the people, opportunities, and resources they need — at every stage of growth.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link href="/apply" className="btn-primary" style={{ fontSize: '15px' }}>
                Apply for Membership <ArrowRight size={18} />
              </Link>
              <Link href="/directory" className="btn-outline">
                Explore the Platform
              </Link>
            </div>

          </div>
        </div>

        {/* Bottom gradient bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #000, #9b7011, #e7b605)' }} />
      </section>

      {/* Stats */}
      <section style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
        <div className="container" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{
                padding: '40px 32px', textAlign: 'center',
                borderRight: i < 3 ? '1px solid #1a1a1a' : 'none',
              }}>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: '42px', color: '#e7b605', lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: '#666', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 8, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '100px 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>What We Offer</div>
            <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(32px, 4vw, 52px)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Everything you need.<br /><span style={{ color: '#e7b605' }}>Nothing you don&apos;t.</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            {features.map((f) => (
              <Link key={f.title} href={f.href} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: 44, height: 44, background: 'rgba(231,182,5,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <f.icon size={22} style={{ color: '#e7b605' }} />
                  </div>
                  <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '20px', marginBottom: 12 }}>{f.title}</h3>
                  <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '15px', lineHeight: 1.7, flex: 1 }}>{f.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20, color: '#e7b605', fontWeight: 700, fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {f.label} <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '100px 0', background: '#f9f9f7' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div>
              <div className="section-label">How It Works</div>
              <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(32px, 3vw, 48px)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 32 }}>
                Membership that<br /><span style={{ color: '#e7b605' }}>earns its keep.</span>
              </h2>
              <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '16px', lineHeight: 1.8, marginBottom: 40 }}>
                Section description coming soon.
              </p>
              <Link href="/apply" className="btn-primary">
                Start Your Application <ArrowRight size={18} />
              </Link>
            </div>

            <div>
              {[
                { num: '01', title: 'Step One', desc: 'Step description coming soon.' },
                { num: '02', title: 'Step Two', desc: 'Step description coming soon.' },
                { num: '03', title: 'Step Three', desc: 'Step description coming soon.' },
                { num: '04', title: 'Step Four', desc: 'Step description coming soon.' },
              ].map((step, i) => (
                <div key={step.num} style={{ display: 'flex', gap: 24, marginBottom: 32, paddingBottom: 32, borderBottom: i < 3 ? '1px solid #e2e0d8' : 'none' }}>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: '32px', color: '#e7b605', lineHeight: 1, flexShrink: 0, width: 56 }}>{step.num}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '17px', marginBottom: 6 }}>{step.title}</div>
                    <div style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '14px', lineHeight: 1.7 }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '100px 0', background: '#000', color: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label" style={{ justifyContent: 'center', color: '#e7b605' }}>Member Stories</div>
            <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(32px, 4vw, 52px)', color: '#fff', letterSpacing: '-0.02em' }}>
              Built for builders.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', padding: '40px 32px', position: 'relative', transition: 'border-color 0.2s' }}>
                <div style={{ fontSize: '48px', color: '#e7b605', fontFamily: 'Georgia, serif', lineHeight: 1, marginBottom: 16, opacity: 0.5 }}>"</div>
                <p style={{ fontFamily: 'Noto Serif, serif', fontSize: '16px', color: '#ccc', lineHeight: 1.8, marginBottom: 28 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>{t.name}</div>
                    <div style={{ color: '#666', fontSize: '13px', marginTop: 4 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 0', background: '#e7b605' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(36px, 5vw, 64px)', color: '#000', letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 20 }}>
            Ready to gain<br />your edge?
          </h2>
          <p style={{ fontFamily: 'Noto Serif, serif', fontSize: '18px', color: '#5a3a08', marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
            Pricing and details coming soon.
          </p>
          <Link href="/apply" className="btn-dark" style={{ fontSize: '16px', padding: '16px 40px' }}>
            Apply for Membership <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
