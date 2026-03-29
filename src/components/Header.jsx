import React, { useState, useEffect } from 'react';

export default function Header({ epsAvg = 146 }) {
  const [time, setTime] = useState(new Date());

  // Live clock effect
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const C = { 
    primary: '#6666ff', 
    red: '#ff4466', 
    muted: '#8888aa', 
    border: 'rgba(102,102,255,0.15)',
    secondary: '#b9f0d7'
  };

  // Formatting helpers
  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateStr = time.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
  
  return (
    <div style={{ background: '#111122', borderBottom: `2px solid ${C.border}`, padding: '15px 25px', display: 'flex', alignItems: 'center', gap: 20 }}>
      {/* Logo & Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg,#6666ff,#7c4dff)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: '#fff' }}>V</div>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>Vajra</div>
          <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 }}>Fraud Shield</div>
        </div>
      </div>

      <div style={{ fontSize: 22, fontWeight: 700, flex: 1, marginLeft: 20 }}>Analytics Dashboard</div>

      {/* Live Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,68,102,0.15)', border: '1px solid #ff4466', color: '#ff4466', padding: '8px 18px', borderRadius: 30, fontWeight: 800, fontSize: 13 }}>
        <div style={{ width: 8, height: 8, background: '#ff4466', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
        LIVE
      </div>

      {/* NEW: Live Time Display (Replacing EPS Current) */}
      <div style={{ textAlign: 'center', minWidth: 120 }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: C.primary }}>{timeStr}</div>
        <div style={{ fontSize: 10, color: C.muted, fontWeight: 800, textTransform: 'uppercase' }}>Current Time</div>
      </div>

      {/* NEW: Live Date Display (Replacing EPS Max) */}
      <div style={{ textAlign: 'center', minWidth: 120 }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: C.red }}>{dateStr}</div>
        <div style={{ fontSize: 10, color: C.muted, fontWeight: 800, textTransform: 'uppercase' }}>System Date</div>
      </div>

      {/* Keeping EPS Average */}
      <div style={{ textAlign: 'center', minWidth: 110 }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: C.secondary }}>{epsAvg}</div>
        <div style={{ fontSize: 10, color: C.muted, fontWeight: 800, textTransform: 'uppercase' }}>EPS Avg</div>
      </div>
      
      <input 
        style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 15px', color: '#fff', fontSize: 13, width: 220, outline: 'none' }}
        placeholder="Search transactions..." 
      />
    </div>
  );
}