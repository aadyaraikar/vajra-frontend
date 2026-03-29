import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { lightNetworkData } from '../fakeData';

export default function MuleNetwork() {
  const ref = useRef();

  useEffect(() => {
    const el = ref.current;
    const width = el.clientWidth;
    const height = 250;
    d3.select(el).selectAll("*").remove();

    const svg = d3.select(el).append("svg").attr("width", width).attr("height", height);
    
    const simulation = d3.forceSimulation(lightNetworkData.nodes)
      .force("link", d3.forceLink(lightNetworkData.links).id(d => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-250))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g").selectAll("line").data(lightNetworkData.links).enter()
      .append("line").attr("stroke", "#333344").attr("stroke-width", 2).attr("opacity", 0.6);

    const node = svg.append("g").selectAll("g").data(lightNetworkData.nodes).enter().append("g");

    node.append("circle")
      .attr("r", d => d.r + 2)
      .attr("fill", d => d.id === "Attacker" ? "#ff4466" : d.id.includes("Mule") ? "#b9f0d7" : "#6666ff")
      .attr("stroke", "#0c0c16").attr("stroke-width", 2);

    node.append("text").text(d => d.id).attr("fill", "#8888aa").attr("font-size", 10).attr("dy", d => d.r + 12).attr("text-anchor", "middle");

    simulation.on("tick", () => {
      link.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });
  }, []);

  return (
    <div style={{ background: '#13132a', borderRadius: 12, padding: 20, border: '1px solid rgba(102,102,255,0.15)', height: '100%' }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#8888aa', marginBottom: 15, letterSpacing: 1 }}>MULE NETWORK ANALYSIS</div>
      <div ref={ref} style={{ height: 250 }} />
    </div>
  );
}