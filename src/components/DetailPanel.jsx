import React from 'react';

export default function DetailPanel({ txn }) {
  if (!txn) return null;
  const col = txn.risk === 'HIGH' ? '#ff4466' : '#ffaa33';

  return (
    <div style={{ background: '#13132a', padding: '25px', borderRadius: 12, border: '1px solid rgba(102,102,255,0.15)', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#8888aa', letterSpacing: 1 }}>TRANSACTION DETAIL</div>
        <div style={{ background: `${col}22`, color: col, padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 900 }}>{txn.risk}</div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
        <div>
          <div style={{ fontSize: 14, color: '#8888aa' }}>Amount</div>
          <div style={{ fontSize: 32, fontWeight: 900 }}>₹{txn.amount.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 14, color: '#8888aa' }}>Risk Score</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: col }}>{txn.score}<span style={{ fontSize: 16, color: '#444' }}>/100</span></div>
        </div>
      </div>

      <div style={{ height: 8, background: '#111122', borderRadius: 10, marginBottom: 25, overflow: 'hidden' }}>
        <div style={{ width: `${txn.score}%`, height: '100%', background: col, boxShadow: `0 0 10px ${col}` }} />
      </div>

      <div style={{ background: 'rgba(255,170,51,0.1)', padding: '15px', borderRadius: 8, border: '1px solid rgba(255,170,51,0.2)', color: '#ffaa33', fontSize: 13, lineHeight: 1.5 }}>
        ⚑ <strong>Observation:</strong> {txn.reason}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 25 }}>
        <button style={{ flex: 1, background: 'rgba(255,68,102,0.15)', border: '1px solid #ff4466', color: '#ff4466', padding: '12px', borderRadius: 8, fontWeight: 800, cursor: 'pointer', fontSize: 15 }}>BLOCK TRANSACTION</button>
        <button style={{ flex: 1, background: 'rgba(185,240,215,0.15)', border: '1px solid #b9f0d7', color: '#b9f0d7', padding: '12px', borderRadius: 8, fontWeight: 800, cursor: 'pointer', fontSize: 15 }}>APPROVE</button>
      </div>
    </div>
  );
}