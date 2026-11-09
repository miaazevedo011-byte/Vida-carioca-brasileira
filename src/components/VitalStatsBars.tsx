import React, { useEffect, useRef, useState } from 'react';
import { Stats } from '../types/game';
import { Heart, Sun, Lightbulb, Zap, Brain } from 'lucide-react';

interface VitalStatsProps {
  stats: Stats;
}

export const VitalStatsBars: React.FC<VitalStatsProps> = ({ stats }) => {
  const saudeVal = Math.min(100, Math.max(0, stats.saude));
  const felicidadeVal = Math.min(100, Math.max(0, stats.felicidade));
  const intelectoVal = Math.min(100, Math.max(0, stats.intelecto));
  const energiaVal = Math.min(100, Math.max(0, stats.energia));
  const saudeMentalVal = Math.min(100, Math.max(0, stats.saudeMental ?? 85));

  const prevStats = useRef(stats);
  const [pulseSaude, setPulseSaude] = useState(false);
  const [pulseFelicidade, setPulseFelicidade] = useState(false);
  const [pulseIntelecto, setPulseIntelecto] = useState(false);
  const [pulseEnergia, setPulseEnergia] = useState(false);
  const [pulseMental, setPulseMental] = useState(false);

  useEffect(() => {
    if (prevStats.current.saude !== stats.saude) {
      setPulseSaude(true);
      const t = setTimeout(() => setPulseSaude(false), 700);
      return () => clearTimeout(t);
    }
  }, [stats.saude]);

  useEffect(() => {
    if (prevStats.current.felicidade !== stats.felicidade) {
      setPulseFelicidade(true);
      const t = setTimeout(() => setPulseFelicidade(false), 700);
      return () => clearTimeout(t);
    }
  }, [stats.felicidade]);

  useEffect(() => {
    if (prevStats.current.intelecto !== stats.intelecto) {
      setPulseIntelecto(true);
      const t = setTimeout(() => setPulseIntelecto(false), 700);
      return () => clearTimeout(t);
    }
  }, [stats.intelecto]);

  useEffect(() => {
    if (prevStats.current.energia !== stats.energia) {
      setPulseEnergia(true);
      const t = setTimeout(() => setPulseEnergia(false), 700);
      return () => clearTimeout(t);
    }
  }, [stats.energia]);

  useEffect(() => {
    if (prevStats.current.saudeMental !== stats.saudeMental) {
      setPulseMental(true);
      const t = setTimeout(() => setPulseMental(false), 700);
      return () => clearTimeout(t);
    }
  }, [stats.saudeMental]);

  useEffect(() => {
    prevStats.current = stats;
  }, [stats]);

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full mb-3 text-left">
      {/* 1. Saúde Física */}
      <div className={`bg-white p-2.5 sm:p-3 rounded-xl border border-[#dde4db] shadow-[0_3px_0_0_#dde4db,0_4px_12px_rgba(30,40,24,0.04)] flex flex-col gap-1.5 transition-all ${pulseSaude ? 'animate-stat-pulse ring-2 ring-[#0d8253]' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-lg bg-[#93f7be] flex items-center justify-center text-[#006740] shadow-2xs ${pulseSaude ? 'scale-125 transition-transform' : ''}`}>
              <Heart className="w-3.5 h-3.5 text-[#006740] fill-current" />
            </div>
            <span className="font-heading font-extrabold text-xs text-[#161d18]">Saúde</span>
          </div>
          <span className={`font-heading font-black text-xs text-[#006740] ${pulseSaude ? 'text-[#ff9f1c] scale-110 font-bold transition-all' : ''}`}>{Math.round(saudeVal)}%</span>
        </div>
        {/* Barra Volumétrica */}
        <div className="w-full h-3 bg-[#e3eae1] rounded-full overflow-hidden p-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)]">
          <div
            className="h-full bg-[#0d8253] rounded-full relative shadow-[0_1px_0_0_rgba(255,255,255,0.4)] transition-all duration-500 ease-out"
            style={{ width: `${saudeVal}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>
      </div>

      {/* 2. Saúde Mental */}
      <div
        className={`bg-white p-2.5 sm:p-3 rounded-xl border transition-all flex flex-col gap-1.5 relative ${
          saudeMentalVal < 30
            ? 'border-rose-400 bg-rose-50/30 ring-2 ring-rose-400/40 animate-pulse shadow-[0_3px_0_0_#f43f5e,0_4px_14px_rgba(244,63,94,0.15)]'
            : pulseMental
            ? 'border-[#dde4db] ring-2 ring-[#8b5cf6] animate-stat-pulse shadow-[0_3px_0_0_#dde4db,0_4px_12px_rgba(30,40,24,0.04)]'
            : 'border-[#dde4db] shadow-[0_3px_0_0_#dde4db,0_4px_12px_rgba(30,40,24,0.04)]'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shadow-2xs ${
              saudeMentalVal < 30
                ? 'bg-rose-100 text-rose-700 animate-bounce'
                : 'bg-[#ede9fe] text-[#6d28d9]'
            } ${pulseMental ? 'scale-125 transition-transform' : ''}`}>
              <Brain className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-heading font-extrabold text-xs text-[#161d18]">Saúde Mental</span>
          </div>
          <span className={`font-heading font-black text-xs ${
            saudeMentalVal < 30 ? 'text-rose-600 font-black' : 'text-[#6d28d9]'
          } ${pulseMental ? 'scale-110 font-bold transition-all' : ''}`}>
            {Math.round(saudeMentalVal)}%
          </span>
        </div>
        {/* Barra Volumétrica */}
        <div className="w-full h-3 bg-[#e3eae1] rounded-full overflow-hidden p-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)]">
          <div
            className={`h-full rounded-full relative shadow-[0_1px_0_0_rgba(255,255,255,0.4)] transition-all duration-500 ease-out ${
              saudeMentalVal < 30
                ? 'bg-gradient-to-r from-rose-600 to-rose-400'
                : 'bg-gradient-to-r from-[#7c3aed] to-[#a855f7]'
            }`}
            style={{ width: `${saudeMentalVal}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>

        {/* Alerta Contextual quando Saúde Mental < 30% */}
        {saudeMentalVal < 30 && (
          <div className="mt-1 p-1.5 rounded-lg bg-rose-100/90 border border-rose-300 text-[10px] text-rose-900 flex items-center gap-1.5 leading-tight animate-fade-in font-medium">
            <span className="shrink-0 text-xs">⚠️</span>
            <span>
              <strong>Esgotamento emocional!</strong> Faça <em>Meditação</em> ou <em>Terapia</em> na aba <strong>Atividades</strong> para se recuperar.
            </span>
          </div>
        )}
      </div>

      {/* 3. Felicidade */}
      <div className={`bg-white p-2.5 sm:p-3 rounded-xl border border-[#dde4db] shadow-[0_3px_0_0_#dde4db,0_4px_12px_rgba(30,40,24,0.04)] flex flex-col gap-1.5 transition-all ${pulseFelicidade ? 'animate-stat-pulse ring-2 ring-[#fdbb2d]' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-lg bg-[#ffdea8] flex items-center justify-center text-[#7c5800] shadow-2xs ${pulseFelicidade ? 'scale-125 transition-transform' : ''}`}>
              <Sun className="w-3.5 h-3.5 text-[#7c5800] fill-current" />
            </div>
            <span className="font-heading font-extrabold text-xs text-[#161d18]">Felicidade</span>
          </div>
          <span className={`font-heading font-black text-xs text-[#7c5800] ${pulseFelicidade ? 'text-[#ff9f1c] scale-110 font-bold transition-all' : ''}`}>{Math.round(felicidadeVal)}%</span>
        </div>
        {/* Barra Volumétrica */}
        <div className="w-full h-3 bg-[#e3eae1] rounded-full overflow-hidden p-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)]">
          <div
            className="h-full bg-[#fdbb2d] rounded-full relative shadow-[0_1px_0_0_rgba(255,255,255,0.4)] transition-all duration-500 ease-out"
            style={{ width: `${felicidadeVal}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>
      </div>

      {/* 4. Intelecto */}
      <div className={`bg-white p-2.5 sm:p-3 rounded-xl border border-[#dde4db] shadow-[0_3px_0_0_#dde4db,0_4px_12px_rgba(30,40,24,0.04)] flex flex-col gap-1.5 transition-all ${pulseIntelecto ? 'animate-stat-pulse ring-2 ring-[#0077b6]' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-[#cde5ff] flex items-center justify-center text-[#005e91] shadow-2xs">
              <Lightbulb className="w-3.5 h-3.5 text-[#005e91] fill-current" />
            </div>
            <span className="font-heading font-extrabold text-xs text-[#161d18]">Intelecto</span>
          </div>
          <span className="font-heading font-black text-xs text-[#005e91]">{Math.round(intelectoVal)}%</span>
        </div>
        {/* Barra Volumétrica */}
        <div className="w-full h-3 bg-[#e3eae1] rounded-full overflow-hidden p-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)]">
          <div
            className="h-full bg-[#0077b6] rounded-full relative shadow-[0_1px_0_0_rgba(255,255,255,0.4)] transition-all duration-500 ease-out"
            style={{ width: `${intelectoVal}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>
      </div>

      {/* 5. Energia */}
      <div className={`bg-[#ffffff] p-2.5 sm:p-3 rounded-xl border border-[#dde4db] shadow-[0_3px_0_0_#dde4db,0_4px_12px_rgba(30,40,24,0.04)] flex flex-col gap-1.5 transition-all sm:col-span-2 md:col-span-1 ${pulseEnergia ? 'animate-stat-pulse ring-2 ring-[#D9532F]' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-[#fdeee9] flex items-center justify-center text-[#D9532F] shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-[#D9532F] fill-current" />
            </div>
            <span className="font-heading font-extrabold text-xs text-[#161d18]">Energia</span>
          </div>
          <span className="font-heading font-black text-xs text-[#D9532F]">{Math.round(energiaVal)}%</span>
        </div>
        {/* Barra Volumétrica */}
        <div className="w-full h-3 bg-[#e3eae1] rounded-full overflow-hidden p-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)]">
          <div
            className="h-full bg-[#D9532F] rounded-full relative shadow-[0_1px_0_0_rgba(255,255,255,0.4)] transition-all duration-500 ease-out"
            style={{ width: `${energiaVal}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};
