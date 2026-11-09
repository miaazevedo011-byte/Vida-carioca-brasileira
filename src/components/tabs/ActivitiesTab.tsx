import React, { useState } from 'react';
import { Stats, Pet, Relationship } from '../../types/game';
import { ACTIVITIES, Activity } from '../../data/activities';
import { Palmtree, Dumbbell, Users, HeartPulse, Sparkles, CheckCircle2, Compass, Sun, Flame, Bike, Theater, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound, playSuccessSound } from '../../utils/audio';
import { ActivityModal } from '../ActivityModal';

interface ActivitiesTabProps {
  stats: Stats;
  pet?: Pet;
  relationship: Relationship;
  onDoActivity: (activity: Activity, companion?: string, transport?: string, customCost?: number) => { success: boolean; message: string };
}

export const ActivitiesTab: React.FC<ActivitiesTabProps> = ({
  stats,
  pet,
  relationship,
  onDoActivity
}) => {
  const [filter, setFilter] = useState<'todos' | 'lazer' | 'saude' | 'social'>('todos');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const handleOpenActivityModal = (activity: Activity) => {
    playClickSound();
    setSelectedActivity(activity);
  };

  const handleConfirmActivity = (activity: Activity, companion: string, transport: string, finalCost: number) => {
    setSelectedActivity(null);
    const res = onDoActivity(activity, companion, transport, finalCost);
    setFeedback(res.message);
    if (res.success) {
      playSuccessSound();
      confetti({ particleCount: 45, spread: 70, origin: { y: 0.6 } });
    }
    setTimeout(() => setFeedback(null), 4500);
  };

  const filteredActivities = ACTIVITIES.filter((act) => {
    if (act.id === 'passear_caramelo' && !pet) return false;
    if (filter === 'todos') return true;
    return act.category === filter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'saude':
        return <Bike className="w-3.5 h-3.5 text-emerald-600" />;
      case 'lazer':
        return <Theater className="w-3.5 h-3.5 text-blue-600" />;
      case 'social':
        return <Users className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Compass className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'saude':
        return 'Saúde & Mente';
      case 'lazer':
        return 'Lazer & Cultura';
      case 'social':
        return 'Amigos & Família';
      default:
        return 'Geral';
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in pb-10 text-left font-sans bg-[#F8F5EE] text-[#1E293B] p-1 sm:p-2 rounded-3xl relative">
      {/* TOAST FEEDBACK FLUTUANTE DE AÇÃO TÁTIL */}
      {feedback && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1E293B] text-[#F8F5EE] shadow-[0_8px_20px_rgba(30,41,59,0.3)] border border-[#0CA768]">
          <Sparkles className="w-4 h-4 text-[#0CA768] shrink-0 animate-pulse" />
          <span className="text-xs font-bold">{feedback}</span>
        </div>
      )}

      {/* Header Banner da Aba Rolês & Lazer */}
      <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#E2E8F0] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-base sm:text-lg text-slate-900">Rolês &amp; Experiências</h2>
            <p className="text-xs text-slate-500 font-medium">Curta o melhor do Brasil e escolha quem vai com você</p>
          </div>
        </div>
        <div className="hidden sm:flex px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-xs items-center gap-1">
          <Sun className="w-3.5 h-3.5 text-emerald-600" />
          <span>Agenda Livre</span>
        </div>
      </div>

      {/* BANNER DE DESTAQUE: SAÚDE MENTAL & TERAPIA REGULAR */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 rounded-2xl p-4 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shrink-0 shadow-inner">
            🧠
          </div>
          <div>
            <h3 className="font-heading font-black text-sm sm:text-base tracking-tight flex items-center gap-1.5 flex-wrap">
              <span>Sessão de Terapia Regular &amp; Bem-Estar</span>
              {stats.saudeMental !== undefined && stats.saudeMental < 30 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse shadow-sm">
                  ⚠️ Saúde Mental Baixa ({stats.saudeMental}%)
                </span>
              )}
            </h3>
            <p className="text-xs text-teal-100 font-medium mt-0.5">
              Cuidado com ansiedade e traumas de cobranças sociais. Sessões elevam a Saúde Mental (+35%)!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => {
              const terapiaAct = ACTIVITIES.find(a => a.id === 'terapia_online');
              if (terapiaAct) handleOpenActivityModal(terapiaAct);
            }}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-black text-xs shadow-md hover:bg-teal-50 active:translate-y-0.5 transition-all cursor-pointer font-heading flex items-center gap-1.5"
          >
            <span>Agendar Terapia (R$ 140)</span>
            <Sparkles className="w-3.5 h-3.5 text-teal-600 fill-current" />
          </button>
        </div>
      </div>

      {/* Category Filter Chips com Ícones Intuitivos */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { key: 'todos', label: 'Todos os Rolês', icon: Compass },
          { key: 'lazer', label: 'Lazer & Cultura', icon: Theater },
          { key: 'saude', label: 'Saúde & Mente', icon: Bike },
          { key: 'social', label: 'Amigos & Família', icon: Users }
        ].map((f) => {
          const IconComp = f.icon;
          const isActive = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => { playClickSound(); setFilter(f.key as any); }}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0CA768] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-[#E2E8F0] hover:bg-slate-50'
              }`}
            >
              <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 gap-3">
        {filteredActivities.map((act) => {
          return (
            <div
              key={act.id}
              onClick={() => handleOpenActivityModal(act)}
              className="bg-white rounded-3xl p-4 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3 relative overflow-hidden cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shrink-0 border border-slate-200 group-hover:scale-105 transition-transform">
                    {act.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {getCategoryIcon(act.category)}
                        {getCategoryLabel(act.category)}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate group-hover:text-emerald-700 transition-colors">{act.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{act.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-slate-900 block">
                    {act.cost > 0 ? `R$ ${act.cost.toLocaleString('pt-BR')}` : 'Grátis'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Base</span>
                </div>
              </div>

              {/* Effects & Action Button */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <div className="flex flex-wrap gap-1.5 items-center">
                  {act.effects.felicidade && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                      +{act.effects.felicidade}% Felicidade
                    </span>
                  )}
                  {act.effects.saude && (
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border ${
                      act.effects.saude > 0 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-rose-600 bg-rose-50 border-rose-200'
                    }`}>
                      {act.effects.saude > 0 ? '+' : ''}{act.effects.saude}% Saúde
                    </span>
                  )}
                  {act.effects.energia && (
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border ${
                      act.effects.energia > 0 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-rose-600 bg-rose-50 border-rose-200'
                    }`}>
                      {act.effects.energia > 0 ? '+' : ''}{act.effects.energia}% Energia
                    </span>
                  )}
                  {act.effects.intelecto && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl">
                      +{act.effects.intelecto}% Intelecto
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenActivityModal(act);
                  }}
                  className="py-1.5 px-3.5 rounded-xl font-bold text-xs text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  style={{ backgroundColor: '#0CA768', boxShadow: '0 3px 0 0 #076940', border: '1px solid #0CA768' }}
                >
                  <Flame className="w-3.5 h-3.5 text-white fill-current" />
                  <span>Escolher Acompanhantes</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Detalhado de Rolê com Acompanhantes */}
      {selectedActivity && (
        <ActivityModal
          activity={selectedActivity}
          stats={stats}
          relationship={relationship}
          onClose={() => setSelectedActivity(null)}
          onConfirm={handleConfirmActivity}
        />
      )}
    </div>
  );
};
