import React from 'react';
import Image from 'next/image';

export default function Logo({ size = 'md' }: { dark?: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const heights = { sm: 28, md: 36, lg: 48 };
  const textSize = size === 'sm' ? '13px' : size === 'md' ? '16px' : '22px';
  const h = heights[size];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: h * 0.3 }}>
      <Image src="/logo.png" alt="Founders Edge" height={h} width={h} style={{ objectFit: 'contain' }} />
      <div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: textSize, letterSpacing: '0.08em', color: '#fff', lineHeight: 1.1, textTransform: 'uppercase' }}>
          FOUNDRS
        </div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: textSize, letterSpacing: '0.08em', color: '#e7b605', lineHeight: 1.1, textTransform: 'uppercase' }}>
          EDGE
        </div>
      </div>
    </div>
  );
}
