import React from 'react';

export default function KPIBar() {
  const C = { primary: '#6666ff', red: '#ff4466', secondary: '#b9f0d7', amber: '#ffaa33', card: '#13132a', border: 'rgba(102,102,255,0.15)' };
  const kpis = [
    { label: 'TXNS TODAY', val: '12,847', trend: '↑ 14.2%', col: C.primary },
    { label: 'FRAUD BLOCKED', val: '142', trend: '↑ 8/hr', col: C.red },
    { label: 'AMOUNT PROTECTED', val: '₹18.4L', trend: '↓ Saved', col: C.secondary },
    { label: 'FALSE POSITIVE', val: '2.1%', trend: '↓ 0.3%', col: C.amber },
    { label: 'AVG RISK', val: '94.2', trend: '↑ Alerts', col: '#aa66ff' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 15 }}>
      {kpis.map(k => (
        <div key={k.label} style={{ background: C.card, padding: '20px', borderRadius: 12, border: `1px solid ${C.border}`, position: 'relative' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#8888aa', letterSpacing: 1 }}>{k.label}</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: k.col, marginTop: 8 }}>{k.val}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: k.col, marginTop: 4, opacity: 0.8 }}>{k.trend}</div>
        </div>
      ))}
    </div>
  );
}