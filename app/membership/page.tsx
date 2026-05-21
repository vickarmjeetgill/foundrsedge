'use client';
import Link from 'next/link';
import { ArrowRight, Check, Calendar, Building2, BookOpen, Trophy, Video, Users, Star, Zap, TrendingUp, Shield, Bell, BarChart } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

const benefits = [
  {
    icon: Calendar,
    title: 'Curated Events',
    href: '/events',
    desc: 'Benefit description coming soon.',
    items: ['Benefit coming soon.', 'Benefit coming soon.', 'Benefit coming soon.'],
  },
  {
    icon: Building2,
    title: 'Business Directory',
    href: '/directory',
    desc: 'Benefit description coming soon.',
    items: ['Benefit coming soon.', 'Benefit coming soon.', 'Benefit coming soon.'],
  },
  {
    icon: BookOpen,
    title: 'Resources Hub',
    href: '/resources',
    desc: 'Benefit description coming soon.',
    items: ['Benefit coming soon.', 'Benefit coming soon.', 'Benefit coming soon.'],
  },
  {
    icon: Trophy,
    title: 'Awards & Grants',
    href: '/awards',
    desc: 'Benefit description coming soon.',
    items: ['Benefit coming soon.', 'Benefit coming soon.', 'Benefit coming soon.'],
  },
  {
    icon: Video,
    title: 'Expert Webinars',
    href: '/webinars',
    desc: 'Benefit description coming soon.',
    items: ['Benefit coming soon.', 'Benefit coming soon.', 'Benefit coming soon.'],
  },
  {
    icon: Users,
    title: 'Smart Matching',
    href: '/smart-matching',
    desc: 'Benefit description coming soon.',
    items: ['Benefit coming soon.', 'Benefit coming soon.', 'Benefit coming soon.'],
  },
  {
    icon: Star,
    title: 'Supper Club Access',
    href: '/supper-club',
    desc: 'Benefit description coming soon.',
    items: ['Benefit coming soon.', 'Benefit coming soon.', 'Benefit coming soon.'],
  },
  {
    icon: BarChart,
    title: 'Member Dashboard',
    href: '/dashboard',
    desc: 'Benefit description coming soon.',
    items: ['Benefit coming soon.', 'Benefit coming soon.', 'Benefit coming soon.'],
  },
];

const whatsIncluded = [
  { icon: Check, text: 'Included item coming soon.' },
  { icon: Check, text: 'Included item coming soon.' },
  { icon: Check, text: 'Included item coming soon.' },
  { icon: Check, text: 'Included item coming soon.' },
  { icon: Check, text: 'Included item coming soon.' },
  { icon: Check, text: 'Included item coming soon.' },
  { icon: Check, text: 'Included item coming soon.' },
  { icon: Check, text: 'Included item coming soon.' },
];


const faqs = [
  { q: 'FAQ question coming soon?', a: 'FAQ answer coming soon.' },
  { q: 'FAQ question coming soon?', a: 'FAQ answer coming soon.' },
  { q: 'FAQ question coming soon?', a: 'FAQ answer coming soon.' },
  { q: 'FAQ question coming soon?', a: 'FAQ answer coming soon.' },
  { q: 'FAQ question coming soon?', a: 'FAQ answer coming soon.' },
];

export default function MembershipPage() {
  return (
    <PageLayout>

      {/* Hero */}
      <div style={{ background: '#000', minHeight: '70vh', display: 'flex', alignItems: 'center', paddingTop: 72, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', right: -100, top: '10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(231,182,5,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03 }} preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#e7b605" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 80, paddingBottom: 100 }}>
          <div className="section-label" style={{ color: '#e7b605' }}>Membership</div>
          <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(42px, 7vw, 84px)', lineHeight: 1.0, color: '#fff', letterSpacing: '-0.02em', marginBottom: 24, maxWidth: 800 }}>
            EVERYTHING YOU NEED<br />
            TO <span style={{ color: '#e7b605' }}>GROW FASTER.</span>
          </h1>
          <p style={{ fontFamily: 'Noto Serif, serif', fontSize: 'clamp(16px, 2vw, 19px)', color: '#888', lineHeight: 1.8, maxWidth: 560, marginBottom: 48 }}>
            Page description coming soon.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/apply" className="btn-primary" style={{ fontSize: '15px' }}>
              Apply for Membership <ArrowRight size={18} />
            </Link>
            <div style={{ color: '#aba7a5', fontSize: '14px', fontFamily: 'Noto Serif, serif', fontStyle: 'italic' }}>
              Pricing TBD &nbsp;·&nbsp; Application reviewed within 5–7 business days
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #000, #9b7011, #e7b605)' }} />
      </div>

      {/* What's Included */}
      <div style={{ background: '#f9f9f7', padding: '100px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div>
              <div className="section-label">What's Included</div>
              <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(32px, 4vw, 52px)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 16 }}>
                One membership.<br /><span style={{ color: '#e7b605' }}>Full access.</span>
              </h2>
              <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '16px', lineHeight: 1.8, marginBottom: 40 }}>
                Section description coming soon.
              </p>
              <Link href="/apply" className="btn-primary">
                Apply Now <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {whatsIncluded.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: '#fff', border: '1px solid #e2e0d8' }}>
                  <div style={{ width: 28, height: 28, background: '#e7b605', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={14} style={{ color: '#000' }} />
                  </div>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '15px', color: '#2a2820' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div style={{ background: '#fff', padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Member Benefits</div>
            <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(32px, 4vw, 52px)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Everything included.<br /><span style={{ color: '#e7b605' }}>Nothing held back.</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            {benefits.map((b) => (
              <Link key={b.title} href={b.href} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ height: '100%', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                    <div style={{ width: 48, height: 48, background: 'rgba(231,182,5,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <b.icon size={22} style={{ color: '#e7b605' }} />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '20px', marginBottom: 6 }}>{b.title}</h3>
                      <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '14px', lineHeight: 1.7 }}>{b.desc}</p>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid #f0efe9', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {b.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 5, height: 5, background: '#e7b605', flexShrink: 0 }} />
                        <span style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '13px' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div style={{ background: '#f9f9f7', padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Pricing</div>
            <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(32px, 4vw, 52px)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Simple, transparent<br /><span style={{ color: '#e7b605' }}>pricing.</span>
            </h2>
          </div>

          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <div style={{ background: '#000', padding: '48px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #9b7011, #e7b605)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '22px', color: '#fff', marginBottom: 6 }}>Annual Membership</div>
                  <div style={{ color: '#666', fontSize: '14px', fontFamily: 'Noto Serif, serif' }}>Billed once per year. Cancel anytime.</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: '48px', color: '#e7b605', lineHeight: 1 }}>TBD</div>
                  <div style={{ color: '#aba7a5', fontSize: '13px', marginTop: 4 }}>+ applicable taxes</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 28, marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {whatsIncluded.slice(0, 6).map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Check size={14} style={{ color: '#e7b605', flexShrink: 0 }} />
                    <span style={{ color: '#ccc', fontSize: '14px', fontFamily: 'Noto Serif, serif' }}>{item.text}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: '#111', border: '1px solid #1a1a1a', padding: '16px 20px', marginBottom: 28, fontSize: '13px', color: '#888', fontFamily: 'Noto Serif, serif' }}>
                <Zap size={13} style={{ color: '#e7b605', display: 'inline', marginRight: 8 }} />
                Payment is collected only after your application is approved.
              </div>

              <Link href="/apply" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '16px 32px' }}>
                Apply for Membership <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background: '#fff', padding: '100px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80 }}>
            <div>
              <div className="section-label">FAQ</div>
              <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(28px, 3vw, 42px)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 16 }}>
                Common<br /><span style={{ color: '#e7b605' }}>questions.</span>
              </h2>
              <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '15px', lineHeight: 1.7 }}>
                Still have questions? <a href="mailto:hello@foundrsedge.com" style={{ color: '#e7b605', fontWeight: 700, textDecoration: 'none' }}>Email us directly.</a>
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ background: '#f9f9f7', border: '1px solid #e2e0d8', padding: '28px 32px', borderLeft: '4px solid #e7b605' }}>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '16px', marginBottom: 10 }}>{faq.q}</div>
                  <div style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '14px', lineHeight: 1.7 }}>{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#e7b605', padding: '100px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
            {[Shield, TrendingUp, Users].map((Icon, i) => (
              <div key={i} style={{ width: 48, height: 48, background: 'rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={22} style={{ color: '#000' }} />
              </div>
            ))}
          </div>
          <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(36px, 5vw, 64px)', color: '#000', letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 16 }}>
            Ready to join?
          </h2>
          <p style={{ fontFamily: 'Noto Serif, serif', fontSize: '18px', color: '#5a3a08', maxWidth: 480, margin: '0 auto 40px' }}>
            CTA description coming soon.
          </p>
          <Link href="/apply" className="btn-dark" style={{ fontSize: '16px', padding: '16px 48px' }}>
            Apply for Membership <ArrowRight size={20} />
          </Link>
        </div>
      </div>

    </PageLayout>
  );
}
