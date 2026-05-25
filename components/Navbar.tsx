'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import Logo from './Logo';

const navLinks = [
  { label: 'Membership', href: '/membership' },
  { label: 'Events', href: '/events' },
  { label: 'Directory', href: '/directory' },
  { label: 'Resources', href: '/resources' },
  { label: 'Awards', href: '/awards' },
  { label: 'Webinars', href: '/webinars' },
  { label: 'Supper Club', href: '/supper-club' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled || !isHome ? 'rgba(0,0,0,0.97)' : 'transparent',
      borderBottom: scrolled ? '1px solid #1a1a1a' : '1px solid transparent',
      transition: 'all 0.3s ease',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} style={{
              padding: '8px 14px', color: pathname === link.href ? 'var(--gold)' : '#ccc',
              fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '13px',
              letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'none',
              transition: 'color 0.2s',
              borderBottom: pathname === link.href ? '2px solid var(--gold)' : '2px solid transparent',
            }}>
              {link.label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="hidden-mobile">
          <Link href="/login" style={{
            color: '#ccc', fontFamily: 'var(--font-sans)', fontWeight: 600,
            fontSize: '13px', textDecoration: 'none', letterSpacing: '0.05em',
            textTransform: 'uppercase', padding: '8px 0', transition: 'color 0.2s',
          }}>
            Login
          </Link>
          <Link href="/apply" className="btn-primary" style={{ padding: '10px 24px', fontSize: '12px' }}>
            Apply Now
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setOpen(!open)} style={{
          background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
          display: 'none',
        }} className="show-mobile">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div style={{
          background: '#000', borderTop: '1px solid #1a1a1a',
          padding: '24px 20px',
        }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} style={{
              display: 'block', padding: '14px 0', color: pathname === link.href ? 'var(--gold)' : '#ccc',
              fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '15px',
              letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'none',
              borderBottom: '1px solid #1a1a1a',
            }}>
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link href="/login" style={{ color: '#ccc', textAlign: 'center', padding: '12px', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '14px', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Login</Link>
            <Link href="/apply" className="btn-primary" style={{ textAlign: 'center', justifyContent: 'center' }}>Apply Now</Link>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 900px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
