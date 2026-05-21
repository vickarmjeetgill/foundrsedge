'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

const ADMINS = [
  { username: 'admin', password: 'foundrsedge2026' },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const match = ADMINS.find(a => a.username === username && a.password === password);
    if (match) {
      localStorage.setItem('fe_admin', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid username or password.');
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      {/* Logo */}
      <div style={{ marginBottom: 48 }}>
        <Link href="/" style={{ textDecoration: 'none' }}><Logo /></Link>
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: 420, background: '#0d0d0d', border: '1px solid #1a1a1a', padding: '48px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, background: 'rgba(231,182,5,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={18} style={{ color: '#e7b605' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '20px', color: '#fff' }}>Admin Access</div>
            <div style={{ color: '#aba7a5', fontSize: '13px', marginTop: 2 }}>Founders Edge — Internal</div>
          </div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              placeholder="Enter username"
              autoComplete="username"
              style={{
                width: '100%', padding: '14px 16px', background: '#111', border: `1px solid ${error ? '#c0392b' : '#2a2a2a'}`,
                color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => { if (!error) e.target.style.borderColor = '#e7b605'; }}
              onBlur={e => { if (!error) e.target.style.borderColor = '#2a2a2a'; }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter password"
                autoComplete="current-password"
                style={{
                  width: '100%', padding: '14px 48px 14px 16px', background: '#111', border: `1px solid ${error ? '#c0392b' : '#2a2a2a'}`,
                  color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => { if (!error) e.target.style.borderColor = '#e7b605'; }}
                onBlur={e => { if (!error) e.target.style.borderColor = '#2a2a2a'; }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: '#aba7a5', cursor: 'pointer', padding: 0,
              }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ color: '#e74c3c', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <button type="submit" style={{
            marginTop: 8, padding: '16px', background: '#e7b605', border: 'none',
            fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '14px',
            letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
            color: '#000', transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Sign In
          </button>
        </form>
      </div>

      <div style={{ marginTop: 24, color: '#333', fontSize: '12px', fontFamily: 'DM Sans, sans-serif' }}>
        Founders Edge Admin Portal — Authorized Access Only
      </div>
    </div>
  );
}
