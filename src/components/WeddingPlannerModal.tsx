import React, { useState, useMemo } from 'react';
import { GameState } from '../types/game';
import {
  X, Heart, Sparkles, Users, Calendar, MapPin, DollarSign, CheckCircle2,
  AlertCircle, CreditCard, Wallet, Church, Sun, Trees, Building2, Utensils,
  Check, UserPlus, Gift, Flame
} from 'lucide-react';
import { playClickSound, playSuccessSound, playErrorSound } from '../utils/audio';
import confetti from 'canvas-confetti';

export interface WeddingPlanData {
  budgetTarget: number;
  season: 'verao' | 'outono' | 'primavera' | 'inverno';
  location: 'praia' | 'campo' | 'salao_urbano';
  guestNames: string[];
  totalCost: number;
  happinessBonus: number;
  affectionBonus: number;
  mentalHealthBonus: number;
  paymentMethod?: 'vista' | 'cartao';
}

interface WeddingPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  onConfirmWedding: (data: WeddingPlanData) => { success: boolean; message: string };
  onOpenPaymentChoice?: (title: string, cost: number, onConfirm: (method: 'vista' | 'cartao') => void) => void;
}

export const WEDDING_SEASONS = [
  {
    id: 'verao' as const,
    name: '☀️ Verão',
    period: 'Dezembro a Março',
    desc: 'Dias ensolarados, noites estreladas tropicais e festa ao ar livre.',
    costMultiplier: 1.10,
    happinessBonus: 25,
    icon: '☀️',
    badge: 'Quente & Tropical'
  },
  {
    id: 'outono' as const,
    name: '🍂 Outono',
    period: 'Abril a Junho',
    desc: 'Clima ameno, folhagens douradas e aconchego intimista.',
    costMultiplier: 0.95,
    happinessBonus: 20,
    icon: '🍂',
    badge: 'Aconchegante'
  },
  {
    id: 'primavera' as const,
    name: '🌸 Primavera',
    period: 'Setembro a Novembro',
    desc: 'Flores em abundância, clima perfeito e alta temporada dos casórios.',
    costMultiplier: 1.25,
    happinessBonus: 35,
    icon: '🌸',
    badge: 'Temporada das Flores'
  },
  {
    id: 'inverno' as const,
    name: '❄️ Inverno',
    period: 'Julho a Agosto',
    desc: 'Elegância clássica com vinhos finos, lareiras e trajes refinados.',
    costMultiplier: 0.90,
    happinessBonus: 18,
    icon: '❄️',
    badge: 'Elegante & Sofisticado'
  }
];

export const WEDDING_LOCATIONS = [
  {
    id: 'praia' as const,
    name: '🏖️ Praia & Beira-Mar',
    desc: 'Cerimônia pé na areia, altar de madeira ao pôr do sol e coquetéis tropicais.',
    baseCost: 8500,
    perGuestCost: 190,
    happinessBonus: 30,
    icon: '🏖️'
  },
  {
    id: 'campo' as const,
    name: '🌳 Campo & Sítio Rústico',
    desc: 'Sítio colonial cercado de natureza, luzes de fada na grama e fogueira.',
    baseCost: 6500,
    perGuestCost: 150,
    happinessBonus: 25,
    icon: '🌳'
  },
  {
    id: 'salao_urbano' as const,
    name: '🏛️ Salão Urbano & Mansão',
    desc: 'Espaço requintado no centro da cidade, iluminação cênica e orquestra.',
    baseCost: 11000,
    perGuestCost: 230,
    happinessBonus: 35,
    icon: '🏛️'
  }
];

export const WeddingPlannerModal: React.FC<WeddingPlannerModalProps> = ({
  isOpen,
  onClose,
  gameState,
  onConfirmWedding
}) => {
  const [activeTab, setActiveTab] = useState<'estilo' | 'convidados'>('estilo');
  const [selectedSeason, setSelectedSeason] = useState<'verao' | 'outono' | 'primavera' | 'inverno'>('primavera');
  const [selectedLocation, setSelectedLocation] = useState<'praia' | 'campo' | 'salao_urbano'>('praia');
  const [budgetTarget, setBudgetTarget] = useState<number>(25000);

  // Lista de Convidados Selecionados
  const partnerName = gameState.relationship.partnerName || 'Patrícia';
  const parents = gameState.family?.parents || [];
  const siblings = gameState.family?.siblings || [];
  const children = gameState.family?.children || [];
  const friends = gameState.family?.friends || [];
  const companyName = gameState.career.companyOrOrg || 'Empresa';

  // Colegas de trabalho gerados
  const workColleagues = useMemo(() => {
    if (!companyName || gameState.career.type === 'desempregado') return [];
    return [
      { id: 'work_1', name: `Chefe / Gerente (${companyName})`, role: 'Colega de Trabalho' },
      { id: 'work_2', name: `Colega de Equipe (${companyName})`, role: 'Colega de Trabalho' },
      { id: 'work_3', name: `Parceiro de Projetos (${companyName})`, role: 'Colega de Trabalho' }
    ];
  }, [companyName, gameState.career.type]);

  // Lista completa de convidados possíveis
  const allAvailableGuests = useMemo(() => {
    const list: { id: string; name: string; category: 'Familiar' | 'Amigo' | 'Trabalho'; avatar: string }[] = [];

    parents.forEach((p, idx) => {
      list.push({ id: `par_${idx}`, name: p.name, category: 'Familiar', avatar: '👵' });
    });
    siblings.forEach((s, idx) => {
      list.push({ id: `sib_${s.id || idx}`, name: s.name, category: 'Familiar', avatar: '🧒' });
    });
    children.forEach((c, idx) => {
      list.push({ id: `child_${c.id || idx}`, name: c.name, category: 'Familiar', avatar: '👶' });
    });
    friends.forEach((f, idx) => {
      list.push({ id: `fri_${f.id || idx}`, name: f.name, category: 'Amigo', avatar: f.type === 'amante' ? '🤫' : '🤝' });
    });
    workColleagues.forEach((w) => {
      list.push({ id: w.id, name: w.name, category: 'Trabalho', avatar: '💼' });
    });

    return list;
  }, [parents, siblings, children, friends, workColleagues]);

  // Convidados selecionados (por padrão, seleciona todos os familiares e amigos)
  const [selectedGuests, setSelectedGuests] = useState<string[]>(() => {
    return allAvailableGuests.map((g) => g.name);
  });

  if (!isOpen) return null;

  const currentSeasonData = WEDDING_SEASONS.find((s) => s.id === selectedSeason) || WEDDING_SEASONS[2];
  const currentLocationData = WEDDING_LOCATIONS.find((l) => l.id === selectedLocation) || WEDDING_LOCATIONS[0];

  const guestCount = selectedGuests.length;
  const perGuestCostCalculated = Math.round(currentLocationData.perGuestCost * currentSeasonData.costMultiplier);
  const totalCalculatedCost = Math.round(
    currentLocationData.baseCost * currentSeasonData.costMultiplier + guestCount * perGuestCostCalculated + (budgetTarget * 0.25)
  );

  const totalHappinessGain = Math.round(
    currentSeasonData.happinessBonus + currentLocationData.happinessBonus + Math.min(30, guestCount * 3)
  );

  const totalAffectionGain = Math.min(100, 40 + Math.round(guestCount * 2));

  // Validações de Requisitos de Casamento
  const age = gameState.character.age;
  const yearsTogether = gameState.relationship.yearsTogether || 0;
  const hasMinAge = age >= 18;
  const hasMinYears = yearsTogether >= 3;
  const cashBalance = gameState.stats.grana;
  const creditLimit = gameState.finances?.creditCardLimit || gameState.finances?.creditCard?.limit || 0;
  const creditUsed = gameState.finances?.creditCardUsed || gameState.finances?.creditCard?.used || 0;
  const availableCredit = Math.max(0, creditLimit - creditUsed);
  const canAfford = cashBalance >= totalCalculatedCost || availableCredit >= totalCalculatedCost;

  const toggleGuest = (name: string) => {
    playClickSound();
    setSelectedGuests((prev) =>
      prev.includes(name) ? prev.filter((g) => g !== name) : [...prev, name]
    );
  };

  const selectAllGuests = () => {
    playClickSound();
    setSelectedGuests(allAvailableGuests.map((g) => g.name));
  };

  const clearAllGuests = () => {
    playClickSound();
    setSelectedGuests([]);
  };

  const handleConfirmWeddingClick = () => {
    playClickSound();

    if (!hasMinAge) {
      playErrorSound();
      return;
    }

    if (!hasMinYears) {
      playErrorSound();
      return;
    }

    if (!canAfford) {
      playErrorSound();
      return;
    }

    const weddingData: WeddingPlanData = {
      budgetTarget,
      season: selectedSeason,
      location: selectedLocation,
      guestNames: selectedGuests,
      totalCost: totalCalculatedCost,
      happinessBonus: totalHappinessGain,
      affectionBonus: totalAffectionGain,
      mentalHealthBonus: 25
    };

    const res = onConfirmWedding(weddingData);
    if (res.success) {
      playSuccessSound();
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      onClose();
    } else {
      playErrorSound();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wedding-modal-title"
      className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs animate-fade-in text-left font-sans"
    >
      <div className="bg-[#fffdf7] dark:bg-slate-900 border-2 border-amber-500/80 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden text-slate-900 dark:text-slate-100">
        
        {/* CABEÇALHO DO MODAL DE CASAMENTO */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 text-white relative shrink-0">
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-all"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-md shrink-0">
              💍
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="wedding-modal-title" className="font-heading font-black text-lg sm:text-xl text-white tracking-tight">
                  Planejamento do Casamento dos Sonhos
                </h2>
              </div>
              <p className="text-xs text-amber-100 font-medium mt-0.5">
                Organize a cerimônia de casamento com {partnerName}! Escolha local, temporada e convidados.
              </p>
            </div>
          </div>

          {/* Abas de Navegação Interna */}
          <div className="flex items-center gap-2 mt-4 pt-1 border-t border-white/20">
            <button
              type="button"
              onClick={() => { playClickSound(); setActiveTab('estilo'); }}
              className={`flex-1 py-2 px-3 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'estilo'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Church className="w-4 h-4 text-amber-600" />
              <span>1. Estilo & Local</span>
            </button>

            <button
              type="button"
              onClick={() => { playClickSound(); setActiveTab('convidados'); }}
              className={`flex-1 py-2 px-3 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'convidados'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>2. Convidados ({guestCount})</span>
            </button>
          </div>
        </div>

        {/* CORPO DO MODAL */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">

          {/* ABA 1: ESTILO, LOCAL & TEMPORADA */}
          {activeTab === 'estilo' && (
            <div className="space-y-5">
              
              {/* Seletor de Orçamento Base */}
              <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-extrabold text-xs text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Orçamento Base Desejado
                  </span>
                  <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                    R$ {budgetTarget.toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {[
                    { label: 'Econômico', val: 8000 },
                    { label: 'Intimista', val: 25000 },
                    { label: 'Elegante', val: 55000 },
                    { label: 'Ostentação', val: 120000 }
                  ].map((b) => (
                    <button
                      key={b.val}
                      type="button"
                      onClick={() => { playClickSound(); setBudgetTarget(b.val); }}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        budgetTarget === b.val
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                      }`}
                    >
                      <span className="block text-[10px] opacity-80">{b.label}</span>
                      <span>R$ {(b.val / 1000).toFixed(0)}k</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Seletor da Temporada */}
              <div className="space-y-2">
                <h3 className="font-heading font-black text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  Temporada da Cerimônia
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {WEDDING_SEASONS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => { playClickSound(); setSelectedSeason(s.id); }}
                      className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                        selectedSeason === s.id
                          ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 shadow-md'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-300'
                      }`}
                    >
                      {selectedSeason === s.id && (
                        <CheckCircle2 className="w-4 h-4 text-amber-500 absolute top-2.5 right-2.5" />
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{s.icon}</span>
                        <div>
                          <h4 className="font-heading font-extrabold text-xs text-slate-900 dark:text-white">{s.name}</h4>
                          <span className="text-[10px] text-slate-500 block">{s.period}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-2 leading-tight">{s.desc}</p>
                      <div className="mt-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        +{s.happinessBonus} Felicidade • {s.costMultiplier > 1 ? `+${Math.round((s.costMultiplier - 1)*100)}% custo` : `${Math.round((s.costMultiplier - 1)*100)}% custo`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Seletor do Local da Festa */}
              <div className="space-y-2">
                <h3 className="font-heading font-black text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Local da Festa
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {WEDDING_LOCATIONS.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => { playClickSound(); setSelectedLocation(loc.id); }}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                        selectedLocation === loc.id
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-md'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-300'
                      }`}
                    >
                      {selectedLocation === loc.id && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute top-2.5 right-2.5" />
                      )}
                      <div>
                        <div className="text-2xl mb-1">{loc.icon}</div>
                        <h4 className="font-heading font-extrabold text-xs text-slate-900 dark:text-white">{loc.name}</h4>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 leading-tight">{loc.desc}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px]">
                        <span className="font-bold text-slate-700 dark:text-slate-300 block">Base: R$ {loc.baseCost.toLocaleString('pt-BR')}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold block">Buffet: R$ {loc.perGuestCost}/pessoa</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ABA 2: LISTA DE CONVIDADOS */}
          {activeTab === 'convidados' && (
            <div className="space-y-4">
              
              <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <h4 className="font-heading font-black text-xs text-slate-900 dark:text-white">
                    Lista de Convidados
                  </h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400">
                    Selecione familiares, amigos e colegas de trabalho para a celebração.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={selectAllGuests}
                    className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-[10px] font-bold shadow-xs hover:bg-emerald-700 cursor-pointer"
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    onClick={clearAllGuests}
                    className="px-2.5 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold hover:bg-slate-300 cursor-pointer"
                  >
                    Limpar
                  </button>
                </div>
              </div>

              {/* Grid de Convidados */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {allAvailableGuests.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    Nenhum contato encontrado para convidar.
                  </div>
                ) : (
                  allAvailableGuests.map((g) => {
                    const isSelected = selectedGuests.includes(g.name);
                    return (
                      <div
                        key={g.id}
                        onClick={() => toggleGuest(g.name)}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl shrink-0">{g.avatar}</span>
                          <div>
                            <span className="font-bold text-xs text-slate-900 dark:text-white block">{g.name}</span>
                            <span className="text-[10px] text-slate-500 font-bold">{g.category}</span>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                          isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}

          {/* CONTADOR E RESUMO DE ORÇAMENTO E CUSTO BASEADO NA QUANTIDADE DE PESSOAS */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-2xl space-y-3 shadow-md border border-emerald-700/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-emerald-400" />
                <span className="font-heading font-bold text-xs text-slate-200">
                  Resumo &amp; Custo Calculado
                </span>
              </div>
              <span className="text-xs font-black text-emerald-400 bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                {guestCount} Convidados
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1 border-t border-white/10">
              <div>
                <span className="text-slate-400 block text-[10px]">Temporada:</span>
                <span className="font-bold text-white">{currentSeasonData.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Local:</span>
                <span className="font-bold text-white">{currentLocationData.name.split('&')[0]}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Buffet / Pessoa:</span>
                <span className="font-bold text-emerald-300">R$ {perGuestCostCalculated}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Bônus Casal:</span>
                <span className="font-bold text-amber-300">+{totalHappinessGain} Feliz</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Custo Total Estimado</span>
                <span className="font-black text-xl text-emerald-400">
                  R$ {totalCalculatedCost.toLocaleString('pt-BR')}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-bold">Seu Saldo Disponível:</span>
                <span className={`font-bold text-xs ${cashBalance >= totalCalculatedCost ? 'text-emerald-400' : 'text-rose-400'}`}>
                  R$ {cashBalance.toLocaleString('pt-BR')} (Cartão: R$ {availableCredit.toLocaleString('pt-BR')})
                </span>
              </div>
            </div>
          </div>

          {/* Avisos de Requisitos */}
          {!hasMinAge && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Casamento permitido apenas para maiores de 18 anos! (Idade atual: {age} anos).</span>
            </div>
          )}

          {!hasMinYears && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Para casar, é necessário ter pelo menos 3 anos de relacionamento sério! (Vocês estão juntos há {yearsTogether} ano(s)).</span>
            </div>
          )}

          {!canAfford && hasMinAge && hasMinYears && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Saldo em conta ou limite de cartão insuficiente para cobrir R$ {totalCalculatedCost.toLocaleString('pt-BR')}.</span>
            </div>
          )}

        </div>

        {/* RODAPÉ E BOTÃO DE CONFIRMAÇÃO */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => { playClickSound(); onClose(); }}
            className="px-4 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirmWeddingClick}
            disabled={!hasMinAge || !hasMinYears || !canAfford}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-heading font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Church className="w-4 h-4" />
            <span>💍 Subir ao Altar &amp; Celebrar Casamento!</span>
          </button>
        </div>

      </div>
    </div>
  );
};
