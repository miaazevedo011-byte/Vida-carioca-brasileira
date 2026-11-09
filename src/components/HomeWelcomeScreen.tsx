import React, { useState, useMemo, useRef } from 'react';
import { SavedLifeSlot, GameState } from '../types/game';

interface HomeWelcomeScreenProps {
  savedSlots: SavedLifeSlot[];
  onSelectSlot: (slot: SavedLifeSlot) => void;
  onDeleteSlot: (slotId: string) => void;
  onStartNewGame: () => void;
}

type SortFilter = 'default' | 'age-desc' | 'age-asc' | 'wealth-desc' | 'level-desc';

// Web Audio API synthesizer matching the Lego toy blip feedback
let audioCtx: AudioContext | null = null;
function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

function playLegoSound(type: 'play' | 'create' | 'delete' = 'play') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'play') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'create') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.12);
      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'delete') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.09);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch {
    // Graceful fallback
  }
}

// Generate base GameState for starter showcase slots
function createDemoGameState(
  name: string,
  age: number,
  year: number,
  gender: 'M' | 'F',
  jobTitle: string,
  salary: number,
  cash: number,
  cdi: number,
  careerType: 'desempregado' | 'infantil' | 'jovem_aprendiz' | 'estagio' | 'clt' | 'pj' | 'concursado' | 'empresario' | 'bicos' = 'clt',
  isRetired: boolean = false
): GameState {
  return {
    character: {
      id: `char_${name.toLowerCase().replace(/\s+/g, '_')}`,
      name,
      gender,
      age,
      year,
      alive: true,
      retired: isRetired,
      legoAvatar: gender === 'M' ? '👨‍🦱 Cabelo Castanho' : '👩‍🦱 Cabelo Longo Ondulado',
      sexualOrientation: 'Heterossexual',
      personality: 'Ambicioso',
      countryOfBirth: 'Brasil',
      birthState: 'SP',
      birthCity: 'São Paulo',
      currentCity: 'São Paulo',
      originTrait: 'Origem Urbana',
      originDescription: 'Nascido em centro urbano.',
      birthZone: 'urbano',
      familyClass: 'Média-Baixa',
      lifeStyle: 'Tranquilo',
      artStyle: 'Geométrico',
      isInfertile: false
    },
    stats: {
      saude: 95,
      felicidade: 90,
      energia: 90,
      intelecto: Math.min(100, 40 + age * 2),
      grana: cash
    },
    serasa: {
      score: 750,
      status: 'bom',
      dividas: []
    },
    career: {
      type: age <= 10 ? 'infantil' : careerType,
      title: jobTitle,
      category: 'Geral',
      salaryMonthly: salary,
      companyOrOrg: isRetired ? 'INSS Previdência Social' : age < 16 ? 'Família' : 'Empresa Nacional',
      yearsInJob: Math.max(0, age - 20),
      educationLevel: age > 22 ? 'Graduação' : age > 17 ? 'Ensino Médio Completo' : 'Ensino Fundamental',
      hasCarteiraAssinada: age >= 18 && !isRetired,
      fgtsAccumulated: Math.max(0, (age - 20) * salary * 0.9),
      pensionMonthly: isRetired ? salary : 0,
      totalYearsWorked: Math.max(0, age - 20)
    },
    educationSystem: {
      currentStage: age > 22 ? 'superior' : age > 17 ? 'medio' : 'fundamental',
      fundamentalYearsDone: Math.min(9, Math.max(0, age - 6)),
      medioYearsDone: Math.min(3, Math.max(0, age - 14)),
      superiorYearsDone: Math.min(4, Math.max(0, age - 18)),
      graduatedCourses: age > 22 ? ['Administração'] : []
    },
    resolvedConflicts: [],
    finances: {
      checkingBalance: cash,
      cdiBalance: cdi,
      stocksBalance: 0,
      creditCard: {
        hasCard: age >= 18,
        tier: 'Gold',
        limit: age >= 18 ? 3500 : 0,
        used: 0
      },
      creditCardLimit: age >= 18 ? 3500 : 0,
      creditCardUsed: 0,
      loans: [],
      hasPrivateHealthPlan: true,
      caixinhaTransactions: []
    },
    housing: {
      id: 'house_demo',
      name: age < 18 ? 'Casa dos Pais' : 'Apartamento 2 Quartos',
      type: age < 18 ? 'pais' : 'aluguel',
      monthlyCost: age < 18 ? 0 : 1200,
      propertyValue: 0,
      icon: '🏠'
    },
    relationship: {
      status: 'solteiro',
      affection: 80,
      yearsTogether: 0
    },
    family: {
      parents: [],
      siblings: [],
      children: []
    },
    influencer: {
      followers: 450,
      postsCount: 12,
      totalEarningsFromPublis: 0,
      fameLevel: 5
    },
    fertility: {
      hasVasectomy: false,
      isUsingContraceptive: false,
      hasEggDonated: false
    },
    will: {
      beneficiary: 'Filhos',
      percentageToCharity: 0,
      advancedWill: {
        isRegisteredInCartorio: age > 60,
        cartorioName: '14º Tabelionato de Notas de SP',
        lastUpdatedYear: year,
        petCareFundAmount: 0,
        shares: [],
        charityPercent: 0,
        legacyMessage: 'Deixo meu carinho e realizações para todos que fizeram parte desta história.'
      }
    },
    timeAdvanceMode: 'anual',
    timeSubPeriod: 1,
    currentNews: {
      id: 'news_init',
      year,
      headline: 'Economia brasileira apresenta estabilidade no início do ciclo.',
      source: 'G1 Economia',
      category: 'economia',
      impactSummary: 'Mercado de trabalho aquecido.',
      effectType: 'positivo'
    },
    driverLicense: {
      hasCategoryA: false,
      hasCategoryB: age >= 18
    },
    agro: {
      hasLand: false,
      isArrendado: false,
      hectares: 0,
      cultivo: null,
      investimentoPerHa: 2800,
      custoTotalSafra: 0,
      cash: 0,
      debt: 0,
      nextHarvestYear: year,
      cattleCount: 0,
      vaccinatedAftosa: true,
      arrobaMarketPrice: 285
    },
    timeRewindsLeft: 3,
    soundEnabled: true,
    logs: [
      {
        id: `init_${Date.now()}`,
        year,
        age,
        title: 'Trajetória Iniciada',
        description: `Vida iniciada como ${jobTitle} em ${year}.`,
        type: 'milestone'
      }
    ],
    achievements: [],
    selectedTab: 'historia',
    currentDilemma: null
  };
}

// 4 iconic starter showcase slots from the provided HTML design
const DEMO_STARTER_SLOTS: SavedLifeSlot[] = [
  {
    id: 'demo_lucas',
    slotName: 'Slot 1: Lucas Silva',
    characterName: 'Lucas Silva',
    avatarIcon: '👶',
    age: 1,
    year: 2027,
    jobTitle: 'Bebê',
    netWorth: 1558,
    savedAt: 'Recente',
    state: createDemoGameState('Lucas Silva', 1, 2027, 'M', 'Bebê', 0, 1558, 0, 'infantil')
  },
  {
    id: 'demo_beatriz',
    slotName: 'Slot 2: Beatriz Helena',
    characterName: 'Beatriz Helena',
    avatarIcon: '👩‍🔧',
    age: 18,
    year: 2044,
    jobTitle: 'Técnico de Manutenção',
    netWorth: 657,
    savedAt: 'Recente',
    state: createDemoGameState('Beatriz Helena', 18, 2044, 'F', 'Técnico de Manutenção', 2150, 657, 0, 'clt')
  },
  {
    id: 'demo_gabriel',
    slotName: 'Slot 3: Gabriel Costa',
    characterName: 'Gabriel Costa',
    avatarIcon: '👨‍💻',
    age: 24,
    year: 2050,
    jobTitle: 'Desenvolvedor Indie',
    netWorth: 8920,
    savedAt: 'Recente',
    state: createDemoGameState('Gabriel Costa', 24, 2050, 'M', 'Desenvolvedor Indie', 6500, 3920, 5000, 'pj')
  },
  {
    id: 'demo_geraldo',
    slotName: 'Slot 4: Geraldo Antunes',
    characterName: 'Geraldo Antunes',
    avatarIcon: '👴',
    age: 68,
    year: 2094,
    jobTitle: 'Aposentado',
    netWorth: 42500,
    savedAt: 'Recente',
    state: createDemoGameState('Geraldo Antunes', 68, 2094, 'M', 'Aposentado', 4850, 12500, 30000, 'clt', true)
  }
];

// Helper to determine life phase badge
function getPhaseBadgeInfo(age: number) {
  if (age <= 5) {
    return {
      label: `Nv. ${age} • Infância`,
      style: { backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', color: '#92400E' },
      starColor: '#F59E0B',
      vibe: '🍼 Satisfeito',
      vibeStyle: { backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E' }
    };
  }
  if (age <= 18) {
    return {
      label: `Nv. ${age} • Jovem Adulta`,
      style: { backgroundColor: '#E0F2FE', border: '1px solid #7DD3FC', color: '#0369A1' },
      starColor: '#0284C7',
      vibe: '📚 Focada nos Estudos',
      vibeStyle: { backgroundColor: '#F3E8FF', border: '1px solid #D8B4FE', color: '#6B21A8' }
    };
  }
  if (age < 60) {
    return {
      label: `Nv. ${age} • Carreira Ativa`,
      style: { backgroundColor: '#DCFCE7', border: '1px solid #86EFAC', color: '#166534' },
      starColor: '#15803D',
      vibe: '💼 Modo Dev Focado',
      vibeStyle: { backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', color: '#334155' }
    };
  }
  return {
    label: `Nv. ${age} • Aposentado`,
    style: { backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', color: '#92400E' },
    starColor: '#F59E0B',
    vibe: '🏆 Ver Legado',
    vibeStyle: { backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', color: '#78350F' }
  };
}

// Lego Head SVG Minifigure Component
const LegoAvatarSVG: React.FC<{ slot: SavedLifeSlot; index: number }> = ({ slot, index }) => {
  const age = slot.age;
  const isBaby = age <= 5 || slot.characterName.toLowerCase().includes('lucas') || index === 0;
  const isYouth = (age > 5 && age <= 18) || slot.characterName.toLowerCase().includes('beatriz') || index === 1;
  const isDev = (age > 18 && age < 60) || slot.characterName.toLowerCase().includes('gabriel') || index === 2;
  const isSenior = age >= 60 || slot.characterName.toLowerCase().includes('geraldo') || index === 3;

  if (isBaby) {
    return (
      <svg className="w-full h-full drop-shadow-sm" fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect fill="#FEF3C7" height="64" rx="14" width="64" />
        <rect fill="#FBBF24" height="5" rx="2" stroke="#D97706" strokeWidth="1.5" width="12" x="26" y="8" />
        <path d="M20 18C20 13 25 10 32 10C39 10 44 13 44 18C44 20 40 18 36 18C33 18 31 16 28 17C24 17 22 19 20 18Z" fill="#92400E" />
        <rect fill="#FDE047" height="28" rx="6" stroke="#CA8A04" strokeWidth="1.8" width="28" x="18" y="16" />
        <ellipse cx="26" cy="28" fill="#1E293B" rx="2.2" ry="3" />
        <ellipse cx="38" cy="28" fill="#1E293B" rx="2.2" ry="3" />
        <circle cx="27" cy="27" fill="#FFFFFF" r="0.9" />
        <circle cx="39" cy="27" fill="#FFFFFF" r="0.9" />
        <ellipse cx="23" cy="33" fill="#FB7185" fillOpacity="0.6" rx="2.8" ry="1.8" />
        <ellipse cx="41" cy="33" fill="#FB7185" fillOpacity="0.6" rx="2.8" ry="1.8" />
        <circle cx="32" cy="36" fill="#38BDF8" r="4" stroke="#0284C7" strokeWidth="1.5" />
        <circle cx="32" cy="36" fill="#BAE6FD" r="1.8" />
        <path d="M32 40C34.5 40 36 41.5 35 43C34 44.2 30 44.2 29 43C28 41.5 29.5 40 32 40Z" fill="#0284C7" />
        <rect fill="#FBBF24" height="5" rx="1" stroke="#D97706" strokeWidth="1.2" width="10" x="27" y="44" />
        <path d="M20 49C22 47 42 47 44 49L46 56H18L20 49Z" fill="#60A5FA" />
      </svg>
    );
  }

  if (isYouth) {
    return (
      <svg className="w-full h-full drop-shadow-sm" fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect fill="#E0F2FE" height="64" rx="14" width="64" />
        <rect fill="#FBBF24" height="5" rx="2" stroke="#D97706" strokeWidth="1.5" width="12" x="26" y="7" />
        <path d="M16 19C16 11 23 8 32 8C41 8 48 11 48 19C48 24 45 28 45 32C45 35 48 37 49 41C48 45 44 46 41 44C41 40 42 36 41 33C39 33 37 32 36 30C35 24 33 22 28 22C24 22 20 25 19 32C19 37 17 38 16 35C15 31 16 23 16 19Z" fill="#451A03" stroke="#290E02" strokeWidth="1.2" />
        <rect fill="#FED7AA" height="27" rx="6" stroke="#EA580C" strokeWidth="1.6" width="28" x="18" y="16" />
        <path d="M18 23H46V29C46 30.5 44.5 32 43 32H21C19.5 32 18 30.5 18 29V23Z" fill="#38BDF8" fillOpacity="0.75" stroke="#0284C7" strokeWidth="1.5" />
        <rect fill="#FFFFFF" fillOpacity="0.6" height="4" rx="1" width="10" x="20" y="24" />
        <rect fill="#FFFFFF" fillOpacity="0.6" height="4" rx="1" width="10" x="34" y="24" />
        <circle cx="26" cy="27.5" fill="#0F172A" r="2" />
        <circle cx="38" cy="27.5" fill="#0F172A" r="2" />
        <path d="M24 24.5L27 24" stroke="#0F172A" strokeLinecap="round" strokeWidth="1.2" />
        <path d="M40 24.5L37 24" stroke="#0F172A" strokeLinecap="round" strokeWidth="1.2" />
        <path d="M28 36C30 38.5 34 38.5 36 36" stroke="#7C2D12" strokeLinecap="round" strokeWidth="1.6" />
        <path d="M29 37C31 38 33 38 35 37" stroke="#FB7185" strokeLinecap="round" strokeWidth="1.2" />
        <rect fill="#FED7AA" height="5" rx="1" stroke="#EA580C" strokeWidth="1" width="10" x="27" y="43" />
        <path d="M19 48C23 45 41 45 45 48L47 57H17L19 48Z" fill="#0284C7" />
        <path d="M28 47L32 52L36 47" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="1.6" />
      </svg>
    );
  }

  if (isDev) {
    return (
      <svg className="w-full h-full drop-shadow-sm" fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect fill="#EDE9FE" height="64" rx="14" width="64" />
        <rect fill="#FDE047" height="5" rx="2" stroke="#CA8A04" strokeWidth="1.5" width="12" x="26" y="7" />
        <path d="M14 26C14 15 22 11 32 11C42 11 50 15 50 26" stroke="#4F46E5" strokeLinecap="round" strokeWidth="3.5" />
        <rect fill="#312E81" height="12" rx="3" stroke="#6366F1" strokeWidth="1.2" width="6" x="11" y="24" />
        <rect fill="#312E81" height="12" rx="3" stroke="#6366F1" strokeWidth="1.2" width="6" x="47" y="24" />
        <path d="M17 19C17 12 24 12 32 12C40 12 47 12 47 19C47 21 44 20 41 18C37 17 34 19 32 17C29 19 25 18 22 19C19 20 17 21 17 19Z" fill="#1E293B" />
        <rect fill="#FDE047" height="27" rx="6" stroke="#CA8A04" strokeWidth="1.8" width="30" x="17" y="16" />
        <rect fill="#F8FAFC" fillOpacity="0.75" height="7" rx="2" stroke="#1E1B4B" strokeWidth="1.8" width="9" x="21" y="24" />
        <rect fill="#F8FAFC" fillOpacity="0.75" height="7" rx="2" stroke="#1E1B4B" strokeWidth="1.8" width="9" x="34" y="24" />
        <line stroke="#1E1B4B" strokeWidth="2" x1="30" x2="34" y1="27" y2="27" />
        <circle cx="25.5" cy="27.5" fill="#0F172A" r="1.8" />
        <circle cx="38.5" cy="27.5" fill="#0F172A" r="1.8" />
        <path d="M29 36C31 37.5 33 37.5 35 36" stroke="#78350F" strokeLinecap="round" strokeWidth="1.6" />
        <circle cx="25" cy="37" fill="#78350F" fillOpacity="0.7" r="0.7" />
        <circle cx="27" cy="39" fill="#78350F" fillOpacity="0.7" r="0.7" />
        <circle cx="37" cy="39" fill="#78350F" fillOpacity="0.7" r="0.7" />
        <circle cx="39" cy="37" fill="#78350F" fillOpacity="0.7" r="0.7" />
        <path d="M14 34L22 39" stroke="#6366F1" strokeLinecap="round" strokeWidth="1.8" />
        <circle cx="23" cy="39.5" fill="#F43F5E" r="1.5" />
        <rect fill="#FDE047" height="5" rx="1" stroke="#CA8A04" strokeWidth="1" width="10" x="27" y="43" />
        <path d="M18 48C22 45 42 45 46 48L48 57H16L18 48Z" fill="#7C3AED" />
      </svg>
    );
  }

  // Senior / Geraldo
  return (
    <svg className="w-full h-full drop-shadow-sm" fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#F1F5F9" height="64" rx="14" width="64" />
      <ellipse cx="32" cy="15" fill="#334155" rx="17" ry="6" stroke="#0F172A" strokeWidth="1.5" />
      <rect fill="#475569" height="4" rx="2" stroke="#0F172A" strokeWidth="1" width="10" x="27" y="8" />
      <path d="M18 16C18 16 26 19 38 17C43 16 46 14 46 14" stroke="#1E293B" strokeLinecap="round" strokeWidth="2" />
      <rect fill="#FED7AA" height="26" rx="6" stroke="#D97706" strokeWidth="1.8" width="28" x="18" y="17" />
      <path d="M17 21C16 25 16 32 17 35C19 35 19 30 19 25Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
      <path d="M47 21C48 25 48 32 47 35C45 35 45 30 45 25Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
      <circle cx="26" cy="27" fill="#FFFFFF" fillOpacity="0.8" r="4.2" stroke="#1E40AF" strokeWidth="1.8" />
      <circle cx="38" cy="27" fill="#FFFFFF" fillOpacity="0.8" r="4.2" stroke="#1E40AF" strokeWidth="1.8" />
      <line stroke="#1E40AF" strokeWidth="2" x1="30.2" x2="33.8" y1="27" y2="27" />
      <circle cx="26" cy="27" fill="#0F172A" r="1.6" />
      <circle cx="38" cy="27" fill="#0F172A" r="1.6" />
      <path d="M24 21C26 20.5 28 20.5 29 21" stroke="#D97706" strokeLinecap="round" strokeWidth="1" />
      <path d="M35 21C36 20.5 38 20.5 40 21" stroke="#D97706" strokeLinecap="round" strokeWidth="1" />
      <path d="M23 34C26 33.5 29 34 32 36C35 34 38 33.5 41 34C42 36 40 38.5 36 38C34 37.8 33 36.8 32 36.8C31 36.8 30 37.8 28 38C24 38.5 22 36 23 34Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
      <path d="M29 39.5C31 40.5 33 40.5 35 39.5" stroke="#78350F" strokeLinecap="round" strokeWidth="1.2" />
      <rect fill="#FED7AA" height="5" rx="1" stroke="#D97706" strokeWidth="1" width="10" x="27" y="43" />
      <path d="M19 48C23 45 41 45 45 48L47 57H17L19 48Z" fill="#1D4ED8" />
      <path d="M32 46V53" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="1.4" />
    </svg>
  );
};

export const HomeWelcomeScreen: React.FC<HomeWelcomeScreenProps> = ({
  savedSlots,
  onSelectSlot,
  onDeleteSlot,
  onStartNewGame
}) => {
  const [activeSort, setActiveSort] = useState<SortFilter>('default');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Active slots to render: use savedSlots if player has saves, or display the 4 starter showcase saves
  const effectiveSlots = useMemo(() => {
    if (savedSlots && savedSlots.length > 0) {
      return savedSlots;
    }
    return DEMO_STARTER_SLOTS;
  }, [savedSlots]);

  // Sorting
  const sortedSlots = useMemo(() => {
    const list = [...effectiveSlots];
    if (activeSort === 'age-desc') {
      return list.sort((a, b) => b.age - a.age);
    }
    if (activeSort === 'age-asc') {
      return list.sort((a, b) => a.age - b.age);
    }
    if (activeSort === 'wealth-desc') {
      return list.sort((a, b) => b.netWorth - a.netWorth);
    }
    if (activeSort === 'level-desc') {
      return list.sort((a, b) => b.age - a.age);
    }
    return list;
  }, [effectiveSlots, activeSort]);

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const handleMascotClick = () => {
    playLegoSound('play');
    if (navigator.vibrate) navigator.vibrate(20);
    showToast('Vida Real Brasil 🌴');
  };

  const handlePlayClick = (slot: SavedLifeSlot) => {
    playLegoSound('play');
    if (navigator.vibrate) navigator.vibrate([15, 30, 20]);
    showToast(`Iniciando jornada: ${slot.characterName}...`);
    setTimeout(() => {
      onSelectSlot(slot);
    }, 200);
  };

  const handleDeleteClick = (slot: SavedLifeSlot) => {
    playLegoSound('delete');
    if (navigator.vibrate) navigator.vibrate(15);
    showToast(`Excluir slot de ${slot.characterName}?`);
    onDeleteSlot(slot.id);
  };

  const handleCreateNewClick = () => {
    playLegoSound('create');
    if (navigator.vibrate) navigator.vibrate(35);
    showToast('Abrindo criador de personagem...');
    setTimeout(() => {
      onStartNewGame();
    }, 150);
  };

  return (
    <div className="warm-bg min-h-screen font-sans text-slate-800 antialiased flex flex-col justify-start items-center p-3 sm:p-6 select-none relative">
      {/* Toast de feedback visual / Carregando Save */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-full shadow-2xl border border-emerald-400/40 flex items-center gap-3 toast-anim">
          {/* Equalizador lúdico de onda sonora */}
          <div className="flex items-center gap-0.5 h-4 w-4 justify-center">
            <span className="w-1 bg-emerald-400 rounded-full wave-bar-1"></span>
            <span className="w-1 bg-amber-400 rounded-full wave-bar-2"></span>
            <span className="w-1 bg-sky-400 rounded-full wave-bar-3"></span>
          </div>
          <span className="text-xs font-bold font-sans tracking-wide text-emerald-100">
            {toastMessage}
          </span>
          <span className="text-xs">✨</span>
        </div>
      )}

      {/* Main Card Wrapper */}
      <main className="w-full max-w-[430px] my-auto pt-2 pb-6">
        {/* Card Principal com borda tátil estilo toy/Ghibli */}
        <div className="relative bg-white rounded-[2.25rem] shadow-clay-card border border-emerald-900/10 overflow-hidden">
          {/* Linha Gradiente de Topo Estilo Brasil Modernista */}
          <div
            className="h-2 w-full"
            style={{
              background: 'linear-gradient(90deg, #1d4ed8 0%, #3b82f6 40%, #f59e0b 80%, #10b981 100%)'
            }}
          />

          <div className="px-5 pt-6 pb-6 flex flex-col items-center">
            {/* Header Section */}
            <header className="flex flex-col items-center text-center w-full">
              {/* Ícone Colecionável / Bússola Tropical */}
              <div
                onClick={handleMascotClick}
                className="relative mb-3.5 group cursor-pointer tactile-btn"
                title="Vida Real Brasil"
              >
                <div
                  className="w-20 h-20 rounded-[1.75rem] border-2 shadow-toy-icon flex items-center justify-center transform transition-transform group-hover:scale-105 duration-200"
                  style={{
                    background: 'linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%)',
                    borderColor: '#93c5fd'
                  }}
                >
                  <svg className="w-12 h-12 drop-shadow-md" fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" fill="#1e40af" r="26" stroke="#fbbf24" strokeWidth="2.5" />
                    <circle cx="32" cy="32" fill="#1e3a8a" r="22" />
                    <circle cx="32" cy="32" fill="#0f172a" r="20" stroke="#60a5fa" strokeDasharray="2 2" strokeWidth="1" />
                    <path d="M32 14L34 29L32 32L30 29Z" fill="#f59e0b" />
                    <path d="M32 50L34 35L32 32L30 35Z" fill="#94a3b8" />
                    <path d="M14 32L29 30L32 32L29 34Z" fill="#94a3b8" />
                    <path d="M50 32L35 30L32 32L35 34Z" fill="#94a3b8" />
                    <polygon fill="#ef4444" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.4))" points="32,15 36,32 32,30 28,32" />
                    <polygon fill="#38bdf8" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.4))" points="32,49 36,32 32,30 28,32" />
                    <circle cx="32" cy="32" fill="#fbbf24" r="3.5" stroke="#78350f" strokeWidth="1" />
                    <circle cx="32" cy="32" fill="#ffffff" r="1.2" />
                    <text fill="#fef08a" fontFamily="sans-serif" fontSize="6" fontWeight="800" textAnchor="middle" x="32" y="21">N</text>
                    <text fill="#93c5fd" fontFamily="sans-serif" fontSize="5" fontWeight="700" textAnchor="middle" x="32" y="47">S</text>
                    <text fill="#93c5fd" fontFamily="sans-serif" fontSize="5" fontWeight="700" textAnchor="middle" x="45" y="34">L</text>
                    <text fill="#93c5fd" fontFamily="sans-serif" fontSize="5" fontWeight="700" textAnchor="middle" x="19" y="34">O</text>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow-sm border border-amber-200">
                  <span className="text-[10px] text-amber-950 font-extrabold">🧭</span>
                </div>
              </div>

              {/* Tag Pill Estilizada */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 shadow-sm mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-[10.5px] font-bold tracking-wider text-blue-800 uppercase font-sans">
                  SIMULADOR BRASILEIRO • MULTI-SAVES
                </span>
              </div>

              {/* Título Expressivo Vida Real Brasil */}
              <h1 className="text-[29px] leading-tight font-extrabold tracking-tight text-slate-900 font-display">
                Vida Real Brasil
              </h1>

              {/* Subtítulo Acolhedor */}
              <p className="text-[13px] leading-snug text-slate-500 font-medium mt-1.5 max-w-[340px] px-1">
                Crie e viva múltiplas trajetórias: estude, trabalhe, cuide da família, viaje pelo mundo e construa seu legado!
              </p>
            </header>

            {/* Saves List Section */}
            <section aria-label="Lista de Saves Salvos" className="w-full mt-5">
              {/* Cabeçalho da Seção */}
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
                <h2 className="text-[11.5px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <span>PERSONAGENS &amp; VIDAS SALVAS</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-md font-extrabold">
                    {effectiveSlots.length}
                  </span>
                </h2>
                <span className="text-[11px] text-slate-400 font-medium">Slots em nuvem</span>
              </div>

              {/* Container dos Filtros de Ordenação */}
              <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1" id="sort-filters-bar">
                <span className="text-[11px] font-bold text-slate-400 mr-0.5 flex-shrink-0">Filtrar:</span>
                
                <button
                  type="button"
                  onClick={() => {
                    playLegoSound('play');
                    setActiveSort('default');
                  }}
                  className={`tactile-btn px-2.5 py-1 rounded-full text-[11px] transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                    activeSort === 'default'
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 font-semibold border border-slate-200/80'
                  }`}
                >
                  <span>Todos ({effectiveSlots.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playLegoSound('play');
                    setActiveSort('age-desc');
                  }}
                  className={`tactile-btn px-2.5 py-1 rounded-full text-[11px] transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                    activeSort === 'age-desc'
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 font-semibold border border-slate-200/80'
                  }`}
                >
                  <span>Mais Velhos 👴</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playLegoSound('play');
                    setActiveSort('age-asc');
                  }}
                  className={`tactile-btn px-2.5 py-1 rounded-full text-[11px] transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                    activeSort === 'age-asc'
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 font-semibold border border-slate-200/80'
                  }`}
                >
                  <span>Mais Novos 👶</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playLegoSound('play');
                    setActiveSort('wealth-desc');
                  }}
                  className={`tactile-btn px-2.5 py-1 rounded-full text-[11px] transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                    activeSort === 'wealth-desc'
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 font-semibold border border-slate-200/80'
                  }`}
                >
                  <span>Maior Patrimônio 💰</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playLegoSound('play');
                    setActiveSort('level-desc');
                  }}
                  className={`tactile-btn px-2.5 py-1 rounded-full text-[11px] transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                    activeSort === 'level-desc'
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 font-semibold border border-slate-200/80'
                  }`}
                >
                  <span>Nível ★</span>
                </button>
              </div>

              {/* Cards de Saves */}
              <div className="space-y-3">
                {sortedSlots.map((slot, index) => {
                  const badgeInfo = getPhaseBadgeInfo(slot.age);
                  const isRetiree = slot.age >= 60;

                  return (
                    <article
                      key={slot.id}
                      className="group relative bg-[#fdfdfd] hover:bg-blue-50/30 border border-slate-200/80 hover:border-blue-300 rounded-2xl p-3 flex items-center justify-between transition-all duration-200 shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        {/* Avatar LEGO Cabeça Cilíndrica com Stud */}
                        <div className="relative flex-shrink-0 w-12 h-12 rounded-2xl bg-amber-50 border-2 border-blue-400/60 p-0.5 shadow-sm overflow-hidden flex items-center justify-center">
                          <LegoAvatarSVG slot={slot} index={index} />
                        </div>

                        {/* Dados do Personagem */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                            <h3 className="text-sm font-bold text-slate-800 truncate leading-snug">
                              {slot.characterName}
                            </h3>
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight shadow-sm"
                              style={badgeInfo.style}
                            >
                              <span style={{ color: badgeInfo.starColor }}>★</span> {badgeInfo.label}
                            </span>
                          </div>

                          <p
                            className="text-[11.5px] text-slate-500 truncate font-medium max-w-[155px]"
                            title={`${slot.age} anos (${slot.year}) • ${slot.jobTitle}`}
                          >
                            {slot.age} {slot.age === 1 ? 'ano' : 'anos'} ({slot.year}) •{' '}
                            <span className="text-slate-600 font-semibold">{slot.jobTitle}</span>
                          </p>

                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <p className="text-[11px] font-bold text-blue-700 flex items-center gap-1">
                              Patrimônio:{' '}
                              <span className="bg-blue-50 px-1.5 py-0.5 rounded-md text-blue-800 border border-blue-200/60 font-bold">
                                R$ {slot.netWorth.toLocaleString('pt-BR')}
                              </span>
                            </p>

                            {isRetiree ? (
                              <button
                                type="button"
                                onClick={() => handlePlayClick(slot)}
                                className="tactile-btn inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors cursor-pointer"
                              >
                                <span>🏆 Ver Legado</span>
                              </button>
                            ) : (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm"
                                style={badgeInfo.vibeStyle}
                              >
                                {badgeInfo.vibe}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Botões de Ação do Save */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Botão Jogar Laranja Relevo 3D */}
                        <button
                          type="button"
                          aria-label={`Jogar com ${slot.characterName}`}
                          onClick={() => handlePlayClick(slot)}
                          className="tactile-btn play-btn flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white font-extrabold text-xs active:translate-y-1 transition-all duration-150 cursor-pointer"
                          style={{
                            background: 'linear-gradient(180deg, #ff7a00 0%, #ff5500 100%)',
                            boxShadow: '0 4px 0 #b83200, 0 6px 14px rgba(255, 85, 0, 0.4)',
                            borderTop: '1px solid rgba(255, 255, 255, 0.4)',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)'
                          }}
                        >
                          <span className="text-[11px] text-white drop-shadow-sm">▶</span>
                          <span className="tracking-wide">Jogar</span>
                        </button>

                        {/* Botão de Excluir */}
                        <button
                          type="button"
                          aria-label={`Excluir save de ${slot.characterName}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(slot);
                          }}
                          className="delete-btn w-8 h-8 rounded-full flex items-center justify-center text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Excluir slot"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Primary Action Button: Create Character */}
            <div className="w-full mt-5">
              <button
                type="button"
                id="create-char-btn"
                onClick={handleCreateNewClick}
                className="tactile-btn w-full py-3.5 px-4 rounded-2xl text-white font-display font-bold text-[14.5px] tracking-wide flex items-center justify-center gap-2.5 cursor-pointer active:translate-y-1 transition-all duration-150"
                style={{
                  background: 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 70%, #1e40af 100%)',
                  boxShadow: '0 6px 0 #172554, 0 10px 20px rgba(37, 99, 235, 0.4)',
                  borderTop: '1.5px solid rgba(255, 255, 255, 0.45)',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                }}
              >
                <svg className="w-5 h-5 drop-shadow-sm text-blue-100" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Criar Novo Personagem &amp; Iniciar Trajetória</span>
              </button>
            </div>

            {/* Footer */}
            <footer className="mt-6 pt-2 text-center">
              <p className="text-[11px] font-semibold text-slate-400 tracking-wide">
                Tropic Modernism Game UI • Vida Real Brasil © 2026
              </p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
};
