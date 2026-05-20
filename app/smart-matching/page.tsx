'use client';
import Link from 'next/link';
import { Users, ArrowRight, Target, Handshake, Building2, MapPin, Zap, ChevronRight } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

const criteria = [
  {
    icon: Building2,
    title: 'Industry',
    desc: 'Get matched with members who operate in your industry or in adjacent sectors that complement your business.',
  },
  {
    icon: Target,
    title: 'Ideal Client',
    desc: 'We match you based on the type of clients you are looking for — so every introduction has a reason behind it.',
  },
  {
    icon: Handshake,
    title: 'Referral Partner Type',
    desc: 'Tell us what kind of referral partners you need and we will find members who are looking for exactly what you offer.',
  },
  {
    icon: MapPin,
    title: 'Geographic Focus',
    desc: 'Whether you operate locally in Calgary or across Canada, your matches reflect where you actually do business.',
  },
];

const howItWorks = [
  { num: '01', title: 'You Apply & Share Your Goals', desc: 'When you join Founders Edge, you tell us about your business, your ideal client, and the type of referral partners you are looking for.' },
  { num: '02', title: 'Our Team Reviews Your Profile', desc: 'Our admin team reviews your matching criteria and identifies members in the network who are the right fit for an introduction.' },
  { num: '03', title: 'We Make the Introduction', desc: 'We facilitate a warm introduction between you and your match — no cold outreach, no guesswork.' },
  { num: '04', title: 'You Build the Relationship', desc: 'From there, it is up to you. Whether it becomes a referral, a collaboration, or a long-term partnership is in your hands.' },
];

export default function SmartMatchingPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <div className="page-hero">
        <div className="container">
          <div className="section-label">Member Feature</div>
          <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(40px, 6vw, 72px)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.0, marginBottom: 16 }}>
            SMART<br /><span style={{ color: '#e7b605' }}>MATCHING</span>
          </h1>
          <p style={{ fontFamily: 'Noto Serif, serif', color: '#999', fontSize: '18px', maxWidth: 560, lineHeight: 1.7, marginBottom: 40 }}>
            Stop networking blindly. Founders Edge connects you with the right members — based on who you are, what you do, and who you are looking for.
          </p>
          <Link href="/apply" className="btn-primary" style={{ fontSize: '15px' }}>
            Apply for Membership <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* What Is It */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div>
              <div className="section-label">What Is Smart Matching</div>
              <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(28px, 3vw, 44px)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 24 }}>
                Introductions that<br /><span style={{ color: '#e7b605' }}>actually make sense.</span>
              </h2>
              <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '16px', lineHeight: 1.8, marginBottom: 20 }}>
                Smart Matching is a curated member-to-member introduction service built into your Founders Edge membership. Instead of hoping you run into the right person at a networking event, we do the work of finding them for you.
              </p>
              <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '16px', lineHeight: 1.8 }}>
                Our team manually reviews member profiles and facilitates warm introductions based on your industry, your ideal client, and the type of referral partners your business needs most.
              </p>
            </div>

            <div style={{ background: '#aba7a5', border: '1px solid #e2e0d8', padding: '48px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div style={{ width: 48, height: 48, background: 'rgba(231,182,5,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={24} style={{ color: '#e7b605' }} />
                </div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '20px' }}>Phase 1: Manual + Assisted</div>
              </div>
              <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '15px', lineHeight: 1.8, marginBottom: 28 }}>
                In our first phase, every match is reviewed and facilitated by our admin team. We personally assess fit before making any introduction — quality over quantity, always.
              </p>
              <div style={{ borderTop: '1px solid #e2e0d8', paddingTop: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9b7011', fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  <Zap size={14} style={{ color: '#e7b605' }} />
                  Coming Soon: AI-Assisted Recommendations
                </div>
                <p style={{ fontFamily: 'Noto Serif, serif', color: '#9a9585', fontSize: '13px', lineHeight: 1.7, marginTop: 8 }}>
                  Future phases will layer in AI-assisted matching to surface recommendations automatically as the network grows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Matching Criteria */}
      <section style={{ padding: '80px 0', background: '#aba7a5' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Matching Criteria</div>
            <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(28px, 3.5vw, 48px)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              How we find<br /><span style={{ color: '#e7b605' }}>your match.</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            {criteria.map((c) => (
              <div key={c.title} className="card" style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                <div style={{ width: 48, height: 48, background: 'rgba(231,182,5,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <c.icon size={22} style={{ color: '#e7b605' }} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '18px', marginBottom: 10 }}>{c.title}</h3>
                  <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '15px', lineHeight: 1.7 }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 0', background: '#000' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-label" style={{ justifyContent: 'center', color: '#e7b605' }}>The Process</div>
            <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(28px, 3.5vw, 48px)', letterSpacing: '-0.02em', lineHeight: 1.1, color: '#fff' }}>
              From application<br /><span style={{ color: '#e7b605' }}>to introduction.</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            {howItWorks.map((step, i) => (
              <div key={step.num} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', padding: '40px 36px' }}>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: '40px', color: '#e7b605', lineHeight: 1, marginBottom: 16, opacity: 0.7 }}>{step.num}</div>
                <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '18px', color: '#fff', marginBottom: 12 }}>{step.title}</h3>
                <p style={{ fontFamily: 'Noto Serif, serif', color: '#888', fontSize: '15px', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', background: '#e7b605' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(32px, 4vw, 56px)', color: '#000', letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 16 }}>
            Ready to meet<br />your next partner?
          </h2>
          <p style={{ fontFamily: 'Noto Serif, serif', fontSize: '17px', color: '#5a3a08', marginBottom: 36, maxWidth: 460, margin: '0 auto 36px' }}>
            Smart Matching is included with every Founders Edge membership. Apply today and tell us who you are looking for.
          </p>
          <Link href="/apply" className="btn-dark" style={{ fontSize: '15px', padding: '16px 36px' }}>
            Apply for Membership <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
