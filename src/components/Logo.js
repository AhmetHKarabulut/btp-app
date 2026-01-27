import React from 'react';

/**
 * Public yolu kullanan logo (public/btp-logo.png)
 */
export default function Logo({ size = 56, showText = true }) {
  const imgStyle = {
    width: size,
    height: size,
    objectFit: 'contain',
    display: 'block',
    borderRadius: 8,
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div className="logo-wrap" style={{ width: size, height: size }}>
        <img src="/btp-logo.png" alt="BTP Logo" style={imgStyle} onError={(e)=>{ e.currentTarget.style.display='none'; }} />
      </div>
      {showText && (
        <div className="party-title" style={{ lineHeight: 1 }}>
          <div className="name" style={{ fontWeight: 800, color: 'var(--btp-red)', fontSize: 16 }}>BTP</div>
          <div className="tag" style={{ color: 'var(--muted-text)', fontSize: 12 }}>Bağımsız Türkiye Partisi</div>
        </div>
      )}
    </div>
  );
}