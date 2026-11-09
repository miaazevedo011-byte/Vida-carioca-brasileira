import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Character, FamilyState, Relationship } from '../types/game';
import { Maximize2, Minimize2 } from 'lucide-react';

interface FamilyTreeD3Props {
  character: Character;
  relationship: Relationship;
  family: FamilyState;
}

export const FamilyTreeD3: React.FC<FamilyTreeD3Props> = ({ character, relationship, family }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const fullSvgRef = useRef<SVGSVGElement | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const renderTree = (svgElement: SVGSVGElement | null, width: number, height: number) => {
    if (!svgElement) return;

    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', 'translate(80, 60)');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Nodes data
    const nodes: any[] = [
      // Parents
      ...(family.parents || []).map((p, i) => ({
        id: `parent_${i}`,
        name: p.name,
        role: p.role,
        age: p.age,
        group: 'parents',
        x: 200 + i * 250,
        y: 60
      })),
      // Character & Partner
      {
        id: 'character',
        name: character.name,
        role: 'Você',
        age: character.age,
        group: 'self',
        x: 250,
        y: 200
      },
      ...(relationship.partnerName && relationship.status !== 'solteiro' ? [{
        id: 'partner',
        name: relationship.partnerName,
        role: relationship.status === 'casado' ? 'Cônjuge' : 'Namorado(a)',
        age: relationship.partnerAge || 26,
        group: 'partner',
        x: 450,
        y: 200
      }] : []),
      // Siblings
      ...(family.siblings || []).map((s, i) => ({
        id: `sibling_${s.id}`,
        name: s.name,
        role: 'Irmão(ã)',
        age: s.age,
        group: 'siblings',
        x: 80 + i * 120,
        y: 200
      })),
      // Children
      ...(family.children || []).map((c, i) => ({
        id: `child_${c.id}`,
        name: c.name,
        role: c.isExtramarital ? 'Filho(a) Extraconjugal' : 'Filho(a)',
        age: c.age,
        group: 'children',
        x: 200 + i * 160,
        y: 350
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
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '5');

    // Draw nodes
    const nodeGroup = g.selectAll('g.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    nodeGroup.append('circle')
      .attr('r', 32)
      .attr('fill', d => d.group === 'self' ? '#0CA768' : d.group === 'partner' ? '#f43f5e' : '#fffdf7')
      .attr('stroke', d => d.age >= 18 ? '#0CA768' : '#f59e0b')
      .attr('stroke-width', 3.5)
      .attr('filter', 'drop-shadow(0px 4px 6px rgba(0,0,0,0.15))');

    nodeGroup.append('text')
      .attr('dy', -40)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#1e293b')
      .text(d => d.name);

    nodeGroup.append('text')
      .attr('dy', 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', d => d.group === 'self' || d.group === 'partner' ? '#ffffff' : '#475569')
      .attr('font-weight', 'bold')
      .text(d => `${d.age}a`);

    nodeGroup.append('text')
      .attr('dy', 46)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', d => d.age >= 18 ? '#059669' : '#d97706')
      .attr('font-weight', 'bold')
      .text(d => d.age >= 18 ? '✓ Maior' : 'Minor');
  };

  useEffect(() => {
    renderTree(svgRef.current, 580, 380);
  }, [character, relationship, family]);

  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => {
        renderTree(fullSvgRef.current, window.innerWidth - 100, window.innerHeight - 200);
      }, 50);
    }
  }, [isExpanded, character, relationship, family]);

  return (
    <>
      <div className="w-full bg-[#fffdf7] rounded-2xl p-4 border border-[#e4e1d7] shadow-sm text-center">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-heading font-black text-sm text-slate-900">🌳 Árvore Genealógica Interativa (D3)</h4>
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-1 text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-xl font-bold hover:bg-emerald-700 transition cursor-pointer shadow-xs"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Expandir Tela Cheia 🔍</span>
          </button>
        </div>
        <p className="text-[11px] text-slate-600 mb-3">
          Conexões familiares completas com destaque de maioridade e rolagem.
        </p>
        <div className="overflow-x-auto w-full flex justify-center">
          <svg ref={svgRef} width="580" height="380" className="max-w-full bg-slate-50/50 rounded-xl border border-slate-200" />
        </div>
      </div>

      {/* FULLSCREEN EXPANDED MODAL */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col p-4 animate-fade-in">
          <div className="flex items-center justify-between bg-white/10 p-3 rounded-2xl text-white mb-3">
            <div>
              <h3 className="font-heading font-black text-base">🌳 Árvore Genealógica Completa (Modo Expandido)</h3>
              <p className="text-xs text-slate-300">Arraste para mover, use o zoom do mouse para ampliar</p>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Fechar ✕</span>
            </button>
          </div>

          <div className="flex-1 bg-white rounded-3xl overflow-hidden shadow-2xl relative flex items-center justify-center p-2">
            <svg ref={fullSvgRef} width="1000" height="700" className="w-full h-full bg-slate-50 rounded-2xl border border-slate-200" />
          </div>
        </div>
      )}
    </>
  );
};
