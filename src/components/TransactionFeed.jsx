import React from 'react';
import { fakeTransactions } from '../fakeData';

export default function TransactionFeed({ selected, onSelect }) {
  const C = { card: '#13132a', red: '#ff4466', amber: '#ffaa33', green: '#b9f0d7', border: 'rgba(102,102,255,0.15)' };
  const getCol = (r) => r === 'HIGH' ? C.red : r === 'MEDIUM' ? C.amber : C.green;

  return (
    <div style={{ background: '#111122', borderRight: `1px solid ${C.border}`, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '25px', borderBottom: `1px solid ${C.border}`, fontSize: 14, fontWeight: 800, color: '#8888aa', letterSpacing: 1.5 }}>LIVE TRANSACTION FEED</div>
      <div className="feed-scroll" style={{ flex: 1, overflowY: 'auto' }}>
        {fakeTransactions.map(t => (
          <div key={t.id} onClick={() => onSelect(t)} style={{ padding: '25px', borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer', background: selected?.id === t.id ? 'rgba(102,102,255,0.08)' : 'transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.2s' }}>
            <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: getCol(t.risk), boxShadow: `0 0 12px ${getCol(t.risk)}` }} />
              <div>
                <div style={{ fontSize: 19, fontWeight: 800, color: '#fff' }}>{t.merchant}</div>
                <div style={{ fontSize: 14, color: '#8888aa' }}>{t.id.toLowerCase()}@upi</div>
                <div style={{ fontSize: 12, color: '#555577', marginTop: 4 }}>02:32 pm • Mumbai, MH</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 20, fontWeight: 900 }}>₹{t.amount.toLocaleString('en-IN')}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: getCol(t.risk), border: `1px solid ${getCol(t.risk)}`, padding: '3px 10px', borderRadius: 6, marginTop: 6, display: 'inline-block' }}>{t.risk}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}