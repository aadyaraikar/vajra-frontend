import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { fakeFraudTrend, fakeShapReasons, fakeMerchantFraud } from '../fakeData';

const C = { primary: '#6666ff', secondary: '#b9f0d7', red: '#ff4466', muted: '#8888aa', border: 'rgba(102,102,255,0.15)' };

export function AreaChart() {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    const W = el.clientWidth, H = 160;
    const M = { top: 10, right: 25, bottom: 25, left: 45 };
    const w = W - M.left - M.right, h = H - M.top - M.bottom;
    d3.select(el).selectAll('*').remove();
    const svg = d3.select(el).append('svg').attr('width', W).attr('height', H);
    const g = svg.append('g').attr('transform', `translate(${M.left},${M.top})`);
    const x = d3.scalePoint().domain(fakeFraudTrend.map(d => d.time)).range([0, w]);
    const y = d3.scaleLinear().domain([0, 4]).range([h, 0]);
    const area = d3.area().x(d => x(d.time)).y0(h).y1(d => y(d.rate)).curve(d3.curveBasis);
    g.append('path').datum(fakeFraudTrend).attr('fill', 'rgba(102,102,255,0.2)').attr('d', area);
    g.append('path').datum(fakeFraudTrend).attr('fill', 'none').attr('stroke', C.primary).attr('stroke-width', 3).attr('d', d3.line().x(d => x(d.time)).y(d => y(d.rate)).curve(d3.curveBasis));
    g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).tickSize(0)).call(a => a.select('.domain').remove()).call(a => a.selectAll('text').attr('fill', C.muted).attr('font-size', 10));
    g.append('g').call(d3.axisLeft(y).ticks(3).tickFormat(d => d + '%')).call(a => a.select('.domain').remove()).call(a => a.selectAll('text').attr('fill', C.muted).attr('font-size', 10));
  }, []);
  return (
    <div style={{ background: '#13132a', padding: 20, borderRadius: 12, border: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#8888aa', marginBottom: 15 }}>FRAUD TREND — EVENTS PER SECOND</div>
      <div ref={ref} />
    </div>
  );
}

export function ShapChart({ txnId }) {
  const ref = useRef();
  useEffect(() => {
    const data = fakeShapReasons[txnId] || fakeShapReasons['TXN001'];
    const el = ref.current, W = el.clientWidth, H = 200, M = { left: 140, right: 60, top: 0, bottom: 0 };
    d3.select(el).selectAll('*').remove();
    const svg = d3.select(el).append('svg').attr('width', W).attr('height', H);
    const x = d3.scaleLinear().domain([0, 40]).range([0, W - M.left - M.right]);
    data.forEach((d, i) => {
      const g = svg.append('g').attr('transform', `translate(${M.left},${i * 35})`);
      const col = d.direction === 'fraud' ? C.red : C.secondary;
      g.append('text').text(d.feature).attr('x', -10).attr('y', 15).attr('text-anchor', 'end').attr('fill', '#8888aa').attr('font-size', 12);
      g.append('rect').attr('width', x(d.value)).attr('height', 20).attr('fill', col).attr('rx', 4).attr('opacity', 0.8);
      g.append('text').text(`+${d.value}`).attr('x', x(d.value) + 10).attr('y', 15).attr('fill', col).attr('font-size', 12).attr('font-weight', 800);
    });
  }, [txnId]);
  return <div ref={ref} />;
}

export function MerchantChart() {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current, W = el.clientWidth, H = 200;
    d3.select(el).selectAll('*').remove();
    const svg = d3.select(el).append('svg').attr('width', W).attr('height', H);
    const x = d3.scaleLinear().domain([0, 20]).range([0, W - 100]);
    fakeMerchantFraud.forEach((d, i) => {
      const g = svg.append('g').attr('transform', `translate(80,${i * 32})`);
      g.append('text').text(d.merchant).attr('x', -10).attr('y', 15).attr('text-anchor', 'end').attr('fill', '#8888aa').attr('font-size', 12);
      g.append('rect').attr('width', x(d.count)).attr('height', 18).attr('fill', C.primary).attr('rx', 4).attr('opacity', 0.6);
    });
  }, []);
  return <div ref={ref} />;
}