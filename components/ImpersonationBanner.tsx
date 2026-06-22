'use client';

import { useState } from 'react';
import { ShieldAlert, ArrowLeftRight } from 'lucide-react';
import { exitImpersonate } from '@/app/actions/impersonate';

interface ImpersonationBannerProps {
  userName: string;
  userEmail: string;
}

export default function ImpersonationBanner({ userName, userEmail }: ImpersonationBannerProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleExit = async () => {
    setIsExiting(true);
    try {
      await exitImpersonate();
    } catch (err) {
      console.error('Failed to exit impersonation:', err);
      setIsExiting(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(90deg, #b8860b 0%, #e7b605 50%, #b8860b 100%)',
      color: '#000',
      padding: '8px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '13px',
      fontFamily: 'var(--font-sans), sans-serif',
      fontWeight: 600,
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 99999,
      height: '40px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <ShieldAlert size={16} style={{ color: '#000' }} />
        <span>
          Viewing platform as <strong>{userName}</strong> ({userEmail}). Admin actions are disabled.
        </span>
      </div>
      <button 
        onClick={handleExit} 
        disabled={isExiting}
        style={{
          background: '#000',
          color: '#fff',
          border: 'none',
          padding: '4px 14px',
          borderRadius: '4px',
          fontFamily: 'var(--font-sans), sans-serif',
          fontWeight: 700,
          cursor: isExiting ? 'not-allowed' : 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '11px',
          transition: 'all 0.2s',
          opacity: isExiting ? 0.7 : 1,
        }}
      >
        <ArrowLeftRight size={13} />
        {isExiting ? 'Returning to Admin...' : 'Exit Impersonation'}
      </button>
    </div>
  );
}
