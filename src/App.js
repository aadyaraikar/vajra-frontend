import React, { useState } from 'react';
import Header from './components/Header';
import KPIBar from './components/KPIBar';
import TransactionFeed from './components/TransactionFeed';
import DetailPanel from './components/DetailPanel';
import MuleNetwork from './components/MuleNetwork';
import { AreaChart, ShapChart, MerchantChart } from './components/Charts';
import { fakeTransactions } from './fakeData';
import './App.css';

export default function App() {
  const [selected, setSelected] = useState(fakeTransactions[0]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header no longer needs the live eps prop */}
      <Header epsAvg={146} />
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: '450px', flexShrink: 0 }}>
          <TransactionFeed selected={selected} onSelect={setSelected} />
        </div>

        <div style={{ flex: 1, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <KPIBar />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20 }}>
            <div style={{ gridColumn: 'span 12' }}><AreaChart /></div>
            
            <div style={{ gridColumn: 'span 7' }}>
               <div style={{ background: '#13132a', padding: 25, borderRadius: 12, border: '1px solid rgba(102,102,255,0.15)', height: '100%' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#8888aa', marginBottom: 20, letterSpacing: 1 }}>FEATURE IMPORTANCE (SHAP)</div>
                  <ShapChart txnId={selected?.id} />
               </div>
            </div>
            
            <div style={{ gridColumn: 'span 5' }}><MuleNetwork /></div>
            
            <div style={{ gridColumn: 'span 7' }}><DetailPanel txn={selected} /></div>
            
            <div style={{ gridColumn: 'span 5' }}>
              <div style={{ background: '#13132a', padding: 25, borderRadius: 12, border: '1px solid rgba(102,102,255,0.15)', height: '100%' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#8888aa', marginBottom: 20, letterSpacing: 1 }}>FRAUD BY MERCHANT</div>
                <MerchantChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}