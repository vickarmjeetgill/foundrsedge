'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex' }}>
      {/* Left panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', maxWidth: 520 }}>
        <Link href="/" style={{ textDecoration: 'none', marginBottom: 60 }}>
          <Logo />
        </Link>

        <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: '42px', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.0, marginBottom: 8 }}>
          Welcome back.
        </h1>
        <p style={{ fontFamily: 'Noto Serif, serif', color: '#888', fontSize: '16px', marginBottom: 40 }}>
          Sign in to access your Founders Edge dashboard.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@yourcompany.com"
              style={{ width: '100%', padding: '14px 18px', background: '#111', border: '1px solid #2a2a2a', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: '#fff', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => (e.target.style.borderColor = '#e7b605')}
              onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }}>
                Password
              </label>
              <a href="#" style={{ fontSize: '12px', color: '#e7b605', textDecoration: 'none', fontWeight: 600 }}>Forgot password?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '14px 48px 14px 18px', background: '#111', border: '1px solid #2a2a2a', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: '#fff', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={e => (e.target.style.borderColor = '#e7b605')}
                onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
              />
              <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Link href="/dashboard" className="btn-primary" style={{ marginTop: 8, justifyContent: 'center', fontSize: '15px', padding: '16px' }}>
            Sign In <ArrowRight size={18} />
          </Link>
        </div>

        <p style={{ marginTop: 32, color: '#555', fontSize: '14px', textAlign: 'center', fontFamily: 'Noto Serif, serif' }}>
          Not a member yet?{' '}
          <Link href="/apply" style={{ color: '#e7b605', fontWeight: 700, textDecoration: 'none' }}>Apply for membership →</Link>
        </p>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, background: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', position: 'relative', overflow: 'hidden', borderLeft: '1px solid #1a1a1a' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(155,112,17,0.12) 0%, transparent 60%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 400 }}>
          <div style={{ marginBottom: 40 }}>
            {['Events & Experiences', 'Smart Member Matching', 'Business Directory', 'Curated Resources', 'Awards & Recognition', 'Monthly Supper Club'].map((item, i) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid #1a1a1a' }}>
                <div style={{ width: 6, height: 6, background: '#e7b605', borderRadius: '50%', flexShrink: 0 }} />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '15px', color: '#ccc' }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: '24px', background: '#111', border: '1px solid #1a1a1a', borderLeft: '3px solid #e7b605' }}>
            <div style={{ fontFamily: 'Noto Serif, serif', color: '#ccc', fontSize: '15px', lineHeight: 1.7, marginBottom: 20 }}>
              "The most focused and high-value entrepreneur community in Calgary. Worth every dollar."
            </div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '14px' }}>Marcus T.</div>
            <div style={{ color: '#666', fontSize: '13px' }}>CEO, NorthTech Solutions</div>
          </div>
        </div>
      </div>
    </div>
  );
}
