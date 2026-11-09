import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Character, FamilyState, Relationship } from '../types/game';

interface FamilyTreeD3Props {
  character: Character;
  relationship: Relationship;
  family: FamilyState;
}

export const FamilyTreeD3: React.FC<FamilyTreeD3Props> = ({ character, relationship, family }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', 'translate(50, 40)');

    // Nodes data
    const nodes: any[] = [
      // Parents
      ...(family.parents || []).map((p, i) => ({
        id: `parent_${i}`,
        name: p.name,
        role: p.role,
        age: p.age,
        group: 'parents',
        x: 150 + i * 200,
        y: 50
      })),
      // Character & Partner
      {
        id: 'character',
        name: character.name,
        role: 'Você',
        age: character.age,
        group: 'self',
        x: 200,
        y: 180
      },
      ...(relationship.partnerName && relationship.status !== 'solteiro' ? [{
        id: 'partner',
        name: relationship.partnerName,
        role: relationship.status === 'casado' ? 'Cônjuge' : 'Namorado(a)',
        age: relationship.partnerAge || 26,
        group: 'partner',
        x: 350,
        y: 180
      }] : []),
      // Siblings
      ...(family.siblings || []).map((s, i) => ({
        id: `sibling_${s.id}`,
        name: s.name,
        role: 'Irmão(ã)',
        age: s.age,
        group: 'siblings',
        x: 50 + i * 100,
        y: 180
      })),
      // Children
      ...(family.children || []).map((c, i) => ({
        id: `child_${c.id}`,
        name: c.name,
        role: 'Filho(a)',
        age: c.age,
        group: 'children',
        x: 150 + i * 120,
        y: 310
      }))
    ];

    // Links data
    const links: any[] = [];
    nodes.forEach(n => {
      if (n.group === 'self' || n.group === 'siblings') {
        nodes.forEach(p => {
          if (p.group === 'parents') {
            links.push({ source: p.id, target: n.id });
          }
        });
      }
      if (n.group === 'partner') {
        links.push({ source: 'character', target: 'partner' });
      }
      if (n.group === 'children') {
        links.push({ source: 'character', target: n.id });
        if (nodes.some(n => n.id === 'partner')) {
          links.push({ source: 'partner', target: n.id });
        }
      }
    });

    // Draw links
    g.selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('x1', d => nodes.find(n => n.id === d.source)?.x || 0)
      .attr('y1', d => nodes.find(n => n.id === d.source)?.y || 0)
      .attr('x2', d => nodes.find(n => n.id === d.target)?.x || 0)
      .attr('y2', d => nodes.find(n => n.id === d.target)?.y || 0)
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4');

    // Draw nodes
    const nodeGroup = g.selectAll('g.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    nodeGroup.append('circle')
      .attr('r', 28)
      .attr('fill', d => d.group === 'self' ? '#0CA768' : d.group === 'partner' ? '#f43f5e' : '#fffdf7')
      .attr('stroke', d => d.age >= 18 ? '#0CA768' : '#f59e0b')
      .attr('stroke-width', 3)
      .attr('filter', 'drop-shadow(0px 3px 3px rgba(0,0,0,0.15))');

    nodeGroup.append('text')
      .attr('dy', -35)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .attr('fill', '#1e293b')
      .text(d => d.name);

    nodeGroup.append('text')
      .attr('dy', 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', d => d.group === 'self' || d.group === 'partner' ? '#ffffff' : '#475569')
      .attr('font-weight', 'bold')
      .text(d => `${d.age}a`);

    nodeGroup.append('text')
      .attr('dy', 42)
      .attr('text-anchor', 'middle')
      .attr('font-size', '9px')
      .attr('fill', d => d.age >= 18 ? '#059669' : '#d97706')
      .attr('font-weight', 'bold')
      .text(d => d.age >= 18 ? '✓ Maior' : 'Minor');

  }, [character, relationship, family]);

  return (
    <div className="w-full bg-[#fffdf7] rounded-2xl p-4 border border-[#e4e1d7] shadow-sm text-center">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-heading font-black text-sm text-slate-900">🌳 Árvore Genealógica Interativa (D3)</h4>
        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
          Maioridade Destacada
        </span>
      </div>
      <p className="text-[11px] text-slate-600 mb-3">
        Conexões familiares geradas automaticamente com base em pais, cônjuge, irmãos e filhos.
      </p>
      <div className="overflow-x-auto w-full flex justify-center">
        <svg ref={svgRef} width="550" height="380" className="max-w-full bg-slate-50/50 rounded-xl border border-slate-200" />
      </div>
    </div>
  );
};
