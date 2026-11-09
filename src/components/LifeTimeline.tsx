import React, { useState } from 'react';
import { LogEntry } from '../types/game';
import { History, Award, DollarSign, Briefcase, Heart, Sparkles, Calendar, Filter } from 'lucide-react';

interface LifeTimelineProps {
  logs: LogEntry[];
}

export const LifeTimeline: React.FC<LifeTimelineProps> = ({ logs }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'milestone' | 'career' | 'love' | 'financial'>('all');

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'career':
        return <Briefcase className="w-3.5 h-3.5 text-[#0B66C3]" />;
      case 'financial':
        return <DollarSign className="w-3.5 h-3.5 text-[#087F48]" />;
      case 'health':
        return <Heart className="w-3.5 h-3.5 text-[#D9532F]" />;
      case 'love':
        return <Heart className="w-3.5 h-3.5 text-[#e02424]" fill="#e02424" fillOpacity={0.2} />;
      case 'serasa':
        return <Award className="w-3.5 h-3.5 text-[#F4B300]" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-[#087F48]" />;
    }
  };

  const getLifePhase = (age: number) => {
    if (age <= 11) return '🧸 Infância';
    if (age <= 17) return '🎒 Adolescência';
    if (age <= 35) return '💼 Vida Adulta & Início de Carreira';
    if (age <= 59) return '🏠 Vida Adulta Plena';
    return '🪑 Terceira Idade';
  };

  const filteredLogs = logs.filter((log) => {
    if (activeFilter === 'all') return true;
    return log.type === activeFilter;
  });

  return (
    <div className="bg-[#ffffff] rounded-2xl p-4 sm:p-5 border border-[#e4e1d7] shadow-[0px_4px_12px_rgba(20,30,24,0.03)] mb-4 text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#f0eee8]">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#006437]" />
          <div>
            <h3 className="font-heading font-extrabold text-sm text-[#141E18]">
              Diário da Vida Real
            </h3>
            <p className="text-[10px] text-[#566359]">Linha do tempo dos acontecimentos marcantes da sua história</p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-[#006437] bg-[#e6f5ed] px-2.5 py-0.5 rounded-full font-heading border border-[#087F48]/20">
          {filteredLogs.length} registros
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-2">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'milestone', label: '✨ Marcantes' },
          { id: 'career', label: '💼 Carreira' },
          { id: 'love', label: '💖 Amor' },
          { id: 'financial', label: '💰 Finanças' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id as any)}
            className={`py-1 px-3 rounded-full text-[11px] font-heading font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === f.id
                ? 'bg-[#087F48] text-white shadow-xs'
                : 'bg-[#f5f3ed] text-[#566359] hover:bg-[#e8e5db]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {filteredLogs.length === 0 ? (
          <div className="p-6 text-center bg-[#fbf9f3] rounded-2xl border border-[#ece9df]">
            <span className="text-2xl block mb-1">📖</span>
            <p className="text-xs text-[#566359] font-bold">Nenhum evento registrado nesta categoria ainda.</p>
          </div>
        ) : (
          filteredLogs.map((log, index) => {
            const showPhaseHeader =
              index === 0 || getLifePhase(log.age) !== getLifePhase(filteredLogs[index - 1].age);

            return (
              <React.Fragment key={log.id}>
                {showPhaseHeader && (
                  <div className="sticky top-0 z-10 py-1 px-3 bg-[#e6f5ed] border border-[#a1d1b5] text-[#006437] rounded-xl text-[11px] font-heading font-black uppercase tracking-wider flex items-center gap-1.5 my-2 shadow-xs">
                    <Calendar className="w-3 h-3 text-[#087F48]" />
                    <span>{getLifePhase(log.age)}</span>
                  </div>
                )}

                <div className="relative pl-6 pb-1 border-l-2 border-[#a1d1b5] hover:border-[#087F48] transition-colors ml-2">
                  {/* Timeline Node Icon */}
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-[#087F48] flex items-center justify-center text-[8px] shadow-xs">
                    •
                  </div>

                  {/* Card Content */}
                  <div className="p-3 rounded-xl bg-[#fbf9f3] border border-[#ece9df] hover:border-[#a1d1b5] transition-all space-y-1 shadow-xs">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-black font-heading text-[#006437] bg-white px-2 py-0.5 rounded-md border border-[#ece9df]">
                          Aos {log.age} anos
                        </span>
                        <span className="font-heading font-bold text-xs text-[#141E18] flex items-center gap-1">
                          {getLogIcon(log.type)}
                          {log.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold text-[#566359] font-heading bg-white px-1.5 py-0.5 rounded border border-[#ece9df]">
                        {log.year}
                      </span>
                    </div>

                    <p className="text-xs text-[#3e4940] leading-relaxed pt-0.5">
                      {log.description}
                    </p>

                    {/* Stat Deltas */}
                    {log.statDeltas && Object.keys(log.statDeltas).length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {log.statDeltas.grana !== undefined && log.statDeltas.grana !== 0 && (
                          <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded font-heading ${log.statDeltas.grana > 0 ? 'text-[#087F48] bg-[#e6f5ed]' : 'text-[#D9532F] bg-[#fff0f0]'}`}>
                            {log.statDeltas.grana > 0 ? '+' : ''}R$ {log.statDeltas.grana.toLocaleString('pt-BR')}
                          </span>
                        )}
                        {log.statDeltas.felicidade !== undefined && log.statDeltas.felicidade !== 0 && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-heading ${log.statDeltas.felicidade > 0 ? 'text-[#b07d00] bg-[#fff9e6]' : 'text-[#D9532F] bg-[#fff0f0]'}`}>
                            {log.statDeltas.felicidade > 0 ? '+' : ''}{log.statDeltas.felicidade}% Felicidade
                          </span>
                        )}
                        {log.statDeltas.saude !== undefined && log.statDeltas.saude !== 0 && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-heading ${log.statDeltas.saude > 0 ? 'text-[#087F48] bg-[#e6f5ed]' : 'text-[#D9532F] bg-[#fff0f0]'}`}>
                            {log.statDeltas.saude > 0 ? '+' : ''}{log.statDeltas.saude}% Saúde
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
};
