import React, { useState } from 'react';
import { GameState } from '../types/game';
import { Trophy, Calendar, DollarSign, Award, RefreshCw, HeartCrack, Users, Sparkles, Heart, ShieldCheck, Gem, UserCheck, Scroll } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export interface RelativeCandidate {
  name: string;
  relation: string;
  age?: number;
  inheritanceShare: number;
  icon: string;
}

interface GameOverModalProps {
  gameState: GameState;
  onContinueAsRelative: (candidate: RelativeCandidate) => void;
  onReincarnateWithFlashback: () => void;
  onRestartNewChar: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  gameState,
  onContinueAsRelative,
  onReincarnateWithFlashback,
  onRestartNewChar
}) => {
  const { character, stats, serasa, career, achievements, housing, vehicle, family, relationship, will, company } = gameState;
  const netWorth = stats.grana + gameState.finances.cdiBalance + housing.propertyValue + (vehicle?.value || 0) + (company?.valuation || 0);
  const unlockedAchievementsCount = achievements.filter((a) => a.unlocked).length;

  // Build List of Relative Candidates for Succession
  const candidates: RelativeCandidate[] = [];

  // 1. Children
  if (family?.children && family.children.length > 0) {
    const count = family.children.length;
    const sharePerChild = Math.floor((netWorth * 0.85) / count);
    family.children.forEach(child => {
      candidates.push({
        name: child.name,
        relation: 'Filho(a)',
        age: child.age,
        inheritanceShare: sharePerChild,
        icon: '👧'
      });
    });
  }

  // 2. Spouse / Partner
  if (relationship.partnerName && (relationship.status === 'casado' || relationship.status === 'namorando')) {
    const spouseShare = family?.children && family.children.length > 0 ? Math.floor(netWorth * 0.5) : Math.floor(netWorth * 0.9);
    candidates.push({
      name: relationship.partnerName,
      relation: relationship.status === 'casado' ? 'Viúvo(a)' : 'Parceiro(a)',
      age: relationship.partnerAge || 30,
      inheritanceShare: spouseShare,
      icon: '💍'
    });
  }

  // 3. Siblings
  if (family?.siblings && family.siblings.length > 0) {
    const sibShare = Math.floor(netWorth * 0.4);
    family.siblings.forEach(s => {
      candidates.push({
        name: s.name,
        relation: 'Irmão(ã)',
        age: s.age,
        inheritanceShare: sibShare,
        icon: '🧑'
      });
    });
  }

  const [selectedCandidate, setSelectedCandidate] = useState<RelativeCandidate | null>(candidates[0] || null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in font-sans text-slate-900 text-left">
      <div className="bg-[#fffdf7] rounded-3xl border-2 border-amber-400 shadow-2xl max-w-lg w-full p-5 sm:p-6 text-left max-h-[92vh] overflow-y-auto space-y-4 relative">
        
        {/* MEMORIAL HEADER */}
        <div className="text-center space-y-2 border-b border-amber-200 pb-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 border-2 border-amber-300 text-amber-900 flex items-center justify-center mx-auto text-3xl shadow-inner">
            {character.retired ? '🌴' : '🕊️'}
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-900 bg-amber-100 px-3 py-1 rounded-full font-heading inline-block mb-1 border border-amber-300">
              {character.retired ? 'APOSENTADORIA & SAGRADO LEGADO' : 'MEMORIAL DA TRAJETÓRIA DE VIDA'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
              {character.name}
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              {character.birthCity}, {character.birthState} ({character.year - character.age}) — {character.year} ({character.age} anos)
            </p>
          </div>
        </div>

        {/* LEGADO & QUEM FOI O FALECIDO */}
        <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-300 space-y-2 text-xs">
          <h4 className="font-heading font-black text-amber-900 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
            <Scroll className="w-4 h-4 text-amber-700" />
            <span>Biografia &amp; Resumo do Falecido</span>
          </h4>
          <p className="text-slate-700 leading-snug font-medium">
            <strong>{character.name}</strong> encerrou sua jornada de vida aos <strong>{character.age} anos</strong> exercendo como <strong>{career.title}</strong>.
            {relationship.partnerName && (
              <span> Foi parceiro(a)/cônjuge de <strong>{relationship.partnerName}</strong>.</span>
            )}
            {family?.children && family.children.length > 0 && (
              <span> Deixou {family.children.length} filho(s) para perpetuar a história da família.</span>
            )}
          </p>
        </div>

        {/* ESTATÍSTICAS DO PATRIMÔNIO E CONQUISTAS */}
        <div className="grid grid-cols-2 gap-2 text-left">
          <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-500 font-bold block uppercase font-heading">Patrimônio Deixado</span>
            <span className="text-base font-extrabold text-emerald-700 font-heading">
              R$ {netWorth.toLocaleString('pt-BR')}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-500 font-bold block uppercase font-heading">Serasa Score Final</span>
            <span className="text-base font-extrabold text-blue-700 font-heading">
              {serasa.score} pts
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-500 font-bold block uppercase font-heading">Testamento Lavrado</span>
            <span className="text-xs font-extrabold text-slate-800 font-heading truncate block">
              Favoreceu: {will?.beneficiary || 'Família'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-500 font-bold block uppercase font-heading">Conquistas da Vida</span>
            <span className="text-base font-extrabold text-amber-700 font-heading">
              {unlockedAchievementsCount} / {achievements.length}
            </span>
          </div>
        </div>

        {/* SELEÇÃO DE HERDEIRO / PARENTE PARA CONTINUAR */}
        {candidates.length > 0 && (
          <div className="p-3.5 bg-emerald-50/80 border border-emerald-300 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-heading font-black uppercase text-emerald-900 tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Escolha um Parente para Assumir o Legado</span>
              </span>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {candidates.map((cand, idx) => {
                const isSelected = selectedCandidate?.name === cand.name;
                return (
                  <div
                    key={idx}
                    onClick={() => { playClickSound(); setSelectedCandidate(cand); }}
                    className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-white border-emerald-500 shadow-sm ring-2 ring-emerald-400/30 font-bold'
                        : 'bg-white/80 border-slate-200 hover:border-emerald-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl">{cand.icon}</span>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-slate-900 truncate">
                          {cand.name} ({cand.age}a)
                        </span>
                        <span className="block text-[10px] text-slate-500 font-semibold">
                          Relação: {cand.relation}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-700 shrink-0 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                      Herança: R$ {cand.inheritanceShare.toLocaleString('pt-BR')}
                    </span>
                  </div>
                );
              })}
            </div>

            {selectedCandidate && (
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onContinueAsRelative(selectedCandidate);
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 text-white font-heading font-black text-xs hover:bg-emerald-700 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
              >
                <UserCheck className="w-4 h-4 text-emerald-200" />
                <span>Prosseguir Jogando como {selectedCandidate.name} ({selectedCandidate.relation})</span>
              </button>
            )}
          </div>
        )}

        {/* OUTRAS OPÇÕES DE SUCESSÃO */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1 text-center">
            Ou escolha outra modalidade de reinício:
          </span>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onReincarnateWithFlashback();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 text-white font-heading font-black text-xs hover:bg-blue-700 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>Reencarnar em Outra Família (com Flashbacks &amp; +15 Intelecto) 🔮</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onRestartNewChar();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-heading font-bold text-xs transition-colors cursor-pointer border border-slate-300 text-center"
          >
            Criar Novo Personagem do Zero ✨
          </button>
        </div>
      </div>
    </div>
  );
};
