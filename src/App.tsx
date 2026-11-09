import React, { useState, useEffect } from 'react';
import { GameState, Choice, Debt, Vehicle, Housing, HomeItem, HomeRenovation, Pet, SavedLifeSlot, LifePhase, ChildMember, CompanyState, CompanyEmployee, FriendMember } from './types/game';
import { JobListing, ConcursoListing, CollegeMajor, getRequiredMajorForJob, checkPlayerHasRequiredMajor } from './data/careers';
import { Activity } from './data/activities';
import { AVAILABLE_HOME_ITEMS, AVAILABLE_RENOVATIONS, VEHICLE_CUSTOMIZATIONS, VehicleCustomization } from './data/home_items';
import { NeighborhoodConflict, ConflictOption } from './data/neighborhood_conflicts';
import { BRAZILIAN_DILEMMAS, INITIAL_ACHIEVEMENTS } from './data/dilemmas';
import { HomeWelcomeScreen, DEMO_STARTER_SLOTS } from './components/HomeWelcomeScreen';
import { HeaderNav } from './components/HeaderNav';
import { VitalStatsBars } from './components/VitalStatsBars';
import { DilemmaCard } from './components/DilemmaCard';
import { LifeTimeline } from './components/LifeTimeline';
import { AdvanceYearButton } from './components/AdvanceYearButton';
import { CareerTab } from './components/tabs/CareerTab';
import { BankTab } from './components/tabs/BankTab';
import { ActivitiesTab } from './components/tabs/ActivitiesTab';
import { AssetsTab } from './components/tabs/AssetsTab';
import { FamilyTab } from './components/tabs/FamilyTab';
import { MoreTab } from './components/tabs/MoreTab';
import { NewCharacterModal } from './components/NewCharacterModal';
import { generateRandomParents, getRandomName, getRandomJob, getRandomBio } from './utils/randomPeople';
import { GameOverModal } from './components/GameOverModal';
import { CharacterDocumentModal } from './components/CharacterDocumentModal';
import { CreatorModeModal } from './components/CreatorModeModal';
import { DesktopSidebar } from './components/DesktopSidebar';
import { AgroTab } from './components/tabs/AgroTab';
import { InternationalTab } from './components/tabs/InternationalTab';
import { BrazilNewsTicker } from './components/BrazilNewsTicker';
import { getRandomBrazilNews, BrazilNews } from './data/brazil_news';
import { AdvancedWillState } from './types/game';
import confetti from 'canvas-confetti';
import { playClickSound, playSuccessSound, playCoinSound, playErrorSound, setSoundEnabled, isSoundEnabled } from './utils/audio';
import { CalendarOfEvents } from './components/CalendarOfEvents';
import { EventBombaModal, EventBombaData } from './components/EventBombaModal';
import { HomeCharacterProfileCard } from './components/HomeCharacterProfileCard';
import { JobVacanciesModal } from './components/JobVacanciesModal';
import { InventoryModal } from './components/InventoryModal';
import { PurchasePaymentModal } from './components/PurchasePaymentModal';
import { WeddingPlannerModal, WeddingPlanData } from './components/WeddingPlannerModal';
import { VersionNotificationToast } from './components/VersionNotificationToast';
import { VersionWhatsNewModal } from './components/VersionWhatsNewModal';
import {
  fetchServerVersion,
  getStoredVersion,
  hasPendingWhatsNew,
  clearPendingWhatsNew,
  triggerUpdateAndForcedReload,
  VersionInfo,
  DISMISSED_VERSION_KEY
} from './utils/versionService';

const STORAGE_SAVES_KEY = 'vida_real_brasil_saves_v1';

const getLifePhase = (age: number) => {
  if (age <= 10) return '🧸 Infância (0–10a)';
  if (age <= 17) return '🎒 Adolescência (11–17a)';
  if (age <= 24) return '📚 Juventude (18–24a)';
  if (age <= 35) return '💼 Início Vida Adulta (25–35a)';
  if (age <= 50) return '🏠 Vida Adulta (36–50a)';
  if (age <= 60) return '⚖️ Meia-idade (51–60a)';
  if (age <= 75) return '🪑 Terceira Idade (61–75a)';
  return '🌅 Fase Final (76+a)';
};

const createInitialState = (params?: any): GameState => {
  const name = params?.name || getRandomName('M');
  const gender = params?.gender || 'Masculino';
  const sexualOrientation = params?.sexualOrientation || 'Heterossexual';
  const legoAvatar = params?.legoAvatar || '👨‍🦱 Cabelo Castanho';
  const personality = params?.personality || 'Ambicioso';
  const countryOfBirth = 'Brasil';
  const familyClass = params?.familyClass || 'Média-Baixa';
  const currentCity = params?.birthCity || 'São Paulo';
  const birthState = params?.birthState || 'SP';
  const birthZone = params?.birthZone || 'urbano';
  const originTrait = birthZone === 'campo' ? 'Origem Rural' : 'Origem Urbana';
  const originDescription = birthZone === 'campo' ? 'Nascido e criado no campo, com forte ligação com a terra e a pecuária.' : 'Nascido no ambiente urbano, familiarizado com a agitação da cidade.';

  const appearance = params?.appearance || 50;
  const intelligence = params?.intelligence || 50;
  const social = params?.social || 50;
  const birthStory = params?.birthStory || 'Churrasco de Domingo 🍖: Você nasceu ao som de pagode 90 e cheiro de picanha assada na casa da vovó.';

  let birthHappinessBonus = 0;
  if (birthStory.includes('Chá de Revelação Desastroso')) birthHappinessBonus = -10;
  else if (birthStory.includes('Churrasco de Domingo')) birthHappinessBonus = 15;
  else if (birthStory.includes('Parto no Táxi')) birthHappinessBonus = 5;
  else if (birthStory.includes('Recepção Calorosa')) birthHappinessBonus = 10;

  let initialCash = 50;
  let initialHousing: Housing = {
    id: 'casa_pais',
    name: 'Casa dos Pais',
    type: 'pais',
    monthlyCost: 0,
    propertyValue: 120000,
    icon: '🏠',
    itemsPurchased: [],
    renovationsCompleted: []
  };

  if (familyClass === 'Baixa (Periferia)') {
    initialCash = 20;
  } else if (familyClass === 'Média-Baixa') {
    initialCash = 50;
  } else if (familyClass === 'Média-Alta') {
    initialCash = Math.max(5500, initialCash);
  } else if (familyClass === 'Rica (Elite)') {
    initialCash = Math.max(25000, initialCash);
    initialHousing = {
      id: 'ape_proprio',
      name: 'Apê Próprio Quitado (Herança)',
      type: 'proprio',
      monthlyCost: 450,
      propertyValue: 280000,
      icon: '✨',
      itemsPurchased: [],
      renovationsCompleted: []
    };
  }

  const initialDilemma = BRAZILIAN_DILEMMAS.find((d) => d.id === 'nascimento_primeiros_meses') || BRAZILIAN_DILEMMAS[0];
  const slotId = `slot_${Date.now()}`;

  const avatarImageUrl = params?.avatarImageUrl;

  return {
    slotId,
    character: {
      id: `char_${Date.now()}`,
      name,
      gender,
      sexualOrientation,
      legoAvatar,
      avatarImageUrl,
      personality,
      countryOfBirth,
      familyClass,
      age: 0,
      year: 2026,
      birthCity: currentCity,
      birthState,
      currentCity,
      originTrait,
      originDescription,
      alive: true,
      retired: false,
      appearance,
      intelligence,
      social,
      birthStory
    },
    stats: {
      saude: 95,
      felicidade: Math.min(100, Math.max(10, 80 + birthHappinessBonus)),
      grana: familyClass === 'Rica (Elite)' ? 5000 : familyClass === 'Média-Alta' ? 800 : 50 + (params?.initialCashBonus || 0),
      energia: 95,
      intelecto: intelligence,
      saudeMental: 90
    },
    serasa: {
      score: familyClass === 'Rica (Elite)' ? 820 : familyClass === 'Baixa (Periferia)' ? 520 : 650,
      status: 'bom',
      dividas: []
    },
    career: {
      type: 'desempregado',
      title: 'Bebê Recém-Nascido',
      category: 'Geral',
      salaryMonthly: 0,
      companyOrOrg: 'Família',
      yearsInJob: 0,
      educationLevel: 'Nenhum',
      hasCarteiraAssinada: false,
      fgtsAccumulated: 0
    },
    educationSystem: {
      currentStage: 'fundamental',
      fundamentalYearsDone: 0,
      medioYearsDone: 0,
      superiorYearsDone: 0,
      graduatedCourses: []
    },
    resolvedConflicts: [],
    finances: {
      checkingBalance: familyClass === 'Rica (Elite)' ? 5000 : 50,
      cdiBalance: familyClass === 'Rica (Elite)' ? 10000 : 100,
      stocksBalance: 0,
      creditCard: {
        hasCard: false,
        tier: 'Básico',
        limit: 0,
        used: 0
      },
      creditCardLimit: 0,
      creditCardUsed: 0,
      loans: [],
      hasPrivateHealthPlan: familyClass === 'Rica (Elite)' || familyClass === 'Média-Alta',
      caixinhaTransactions: [
        {
          id: 'tx_init_1',
          date: '01/01/2026',
          type: 'deposito',
          amount: familyClass === 'Rica (Elite)' ? 10000 : 100,
          description: 'Poupança de Abertura / Mesversário dos Pais'
        }
      ]
    },
    housing: initialHousing,
    vehicle: undefined,
    pet: undefined,
    relationship: {
      status: 'solteiro',
      affection: 0,
      yearsTogether: 0
    },
    family: {
      parents: generateRandomParents(name.split(' ').pop()),
      siblings: [
        { id: 'sib_1', name: 'Lucas', gender: 'M', age: 14, affection: 75 }
      ],
      children: [],
      friends: []
    },
    influencer: {
      followers: 120,
      postsCount: 1,
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
        isRegisteredInCartorio: false,
        cartorioName: '14º Tabelionato de Notas de SP',
        lastUpdatedYear: 2026,
        petCareFundAmount: 0,
        shares: [],
        charityPercent: 0,
        legacyMessage: 'Deixo meu carinho e realizações para todos que fizeram parte desta história.'
      }
    },
    timeAdvanceMode: 'anual',
    timeSubPeriod: 1,
    currentNews: getRandomBrazilNews(2026),
    driverLicense: {
      hasCategoryA: false,
      hasCategoryB: false
    },
    agro: {
      hasLand: params?.birthZone === 'campo',
      isArrendado: false,
      hectares: params?.birthZone === 'campo' ? 50 : 0,
      cultivo: null,
      investimentoPerHa: 2800,
      custoTotalSafra: 0,
      cash: 0,
      debt: 0,
      nextHarvestYear: 2026,
      cattleCount: params?.birthZone === 'campo' ? 20 : 0,
      vaccinatedAftosa: true,
      arrobaMarketPrice: 285
    },
    timeRewindsLeft: 3,
    soundEnabled: true,
    logs: [
      {
        id: 'log_start',
        year: 2026,
        age: 0,
        title: 'Nascimento no Brasil 👶🇧🇷',
        description: `Nasceu em ${currentCity} (${birthState}). Origem familiar: ${familyClass}. ${birthStory} Começa uma linda jornada de vida!`,
        type: 'milestone'
      }
    ],
    currentDilemma: initialDilemma,
    achievements: INITIAL_ACHIEVEMENTS,
    selectedTab: 'historia'
  };
};

const createSlotFromState = (state: GameState): SavedLifeSlot => {
  const netWorth = state.stats.grana + state.finances.cdiBalance + state.housing.propertyValue + (state.vehicle?.value || 0) + (state.company?.valuation || 0);
  return {
    id: state.slotId || `slot_${Date.now()}`,
    slotName: `Vida de ${state.character.name}`,
    characterName: state.character.name,
    avatarIcon: state.character.legoAvatar ? state.character.legoAvatar.split(' ')[0] : '🧱',
    age: state.character.age,
    year: state.character.year,
    jobTitle: state.career.title,
    netWorth,
    savedAt: new Date().toLocaleDateString('pt-BR'),
    state
  };
};

export default function App() {
  const [savedSlots, setSavedSlots] = useState<SavedLifeSlot[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_SAVES_KEY);
      if (raw !== null) {
        return JSON.parse(raw);
      }
    } catch (e) {}
    try {
      localStorage.setItem(STORAGE_SAVES_KEY, JSON.stringify(DEMO_STARTER_SLOTS));
    } catch (e) {}
    return DEMO_STARTER_SLOTS;
  });

  const [viewMode, setViewMode] = useState<'welcome' | 'game'>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_SAVES_KEY);
      if (raw) {
        const slots: SavedLifeSlot[] = JSON.parse(raw);
        if (slots.length > 0) return 'welcome';
      }
    } catch (e) {}
    return 'welcome';
  });

  const [gameState, setGameState] = useState<GameState>(() => {
    if (savedSlots.length > 0) {
      return savedSlots[0].state;
    }
    return createInitialState();
  });

  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [isNewCharModalOpen, setIsNewCharModalOpen] = useState(false);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);
  const [isJobVacanciesModalOpen, setIsJobVacanciesModalOpen] = useState(false);
  const [isWeddingPlannerOpen, setIsWeddingPlannerOpen] = useState(false);
  const [eventBombaModal, setEventBombaModal] = useState<EventBombaData | null>(null);
  const [autoSaveToast, setAutoSaveToast] = useState<string | null>(null);
  const [purchaseModalState, setPurchaseModalState] = useState<{
    isOpen: boolean;
    title: string;
    cost: number;
    onConfirm: (method: 'vista' | 'cartao') => void;
  }>({
    isOpen: false,
    title: '',
    cost: 0,
    onConfirm: () => {}
  });

  // Version and Update Management
  const [showVersionToast, setShowVersionToast] = useState(false);
  const [serverVersionInfo, setServerVersionInfo] = useState<VersionInfo | null>(null);
  const [isWhatsNewModalOpen, setIsWhatsNewModalOpen] = useState(false);

  // 1. Ao iniciar a aplicação, se recém recarregou após clicar em atualizar, abre imediatamente as Novidades da Versão!
  useEffect(() => {
    if (hasPendingWhatsNew()) {
      clearPendingWhatsNew();
      setIsWhatsNewModalOpen(true);
      setTimeout(() => {
        playSuccessSound();
        confetti({ particleCount: 75, spread: 80, origin: { y: 0.5 } });
      }, 500);
    }
  }, []);

  // 2. Função de checagem contínua do endpoint /api/version
  const checkForVersionUpdate = React.useCallback(async () => {
    const info = await fetchServerVersion();
    if (info) {
      setServerVersionInfo(info);
      const currentVersion = getStoredVersion();
      const dismissed = typeof window !== 'undefined' ? localStorage.getItem(DISMISSED_VERSION_KEY) : null;
      // Se há versão diferente da atual salva e não foi dispensada
      if (info.version !== currentVersion && dismissed !== info.version) {
        setShowVersionToast(true);
      }
    }
  }, []);

  useEffect(() => {
    // Checagem imediata ao montar
    checkForVersionUpdate();

    // Verificação periódica em segundo plano (a cada 45 segundos)
    const interval = setInterval(() => {
      checkForVersionUpdate();
    }, 45000);

    // Verificação ao alternar de aba / retornar o foco para o diário
    const handleFocus = () => {
      checkForVersionUpdate();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForVersionUpdate();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkForVersionUpdate]);

  // Checagem ao navegar entre abas do jogo
  useEffect(() => {
    checkForVersionUpdate();
  }, [gameState.selectedTab, checkForVersionUpdate]);

  // Ação ao clicar em [Clique aqui para atualizar]: salva nova versão e força reload
  const handleForceUpdateAndReload = () => {
    const targetVer = serverVersionInfo?.version || '2.5.0';
    triggerUpdateAndForcedReload(targetVer);
  };

  const handleDismissVersionToast = () => {
    setShowVersionToast(false);
    if (serverVersionInfo) {
      try {
        localStorage.setItem(DISMISSED_VERSION_KEY, serverVersionInfo.version);
      } catch (e) {}
    }
  };

  const handleTestVersionNotice = () => {
    setShowVersionToast(true);
    playClickSound();
  };

  const handleOpenWhatsNew = () => {
    setIsWhatsNewModalOpen(true);
    playClickSound();
  };

  // Sync saved slots with localStorage
  const saveGameStateToSlots = (stateToSave: GameState) => {
    const updatedSlot = createSlotFromState(stateToSave);
    setSavedSlots((prev) => {
      const existingIdx = prev.findIndex((s) => s.id === updatedSlot.id);
      let nextSlots: SavedLifeSlot[];
      if (existingIdx >= 0) {
        nextSlots = [...prev];
        nextSlots[existingIdx] = updatedSlot;
      } else {
        nextSlots = [updatedSlot, ...prev];
      }
      try {
        localStorage.setItem(STORAGE_SAVES_KEY, JSON.stringify(nextSlots));
      } catch (e) {}
      return nextSlots;
    });
  };

  useEffect(() => {
    if (viewMode === 'game' && gameState) {
      saveGameStateToSlots(gameState);
    }
  }, [gameState, viewMode]);

  // Auto-Save interval every 5 minutes (300,000 ms)
  useEffect(() => {
    if (viewMode !== 'game') return;

    const intervalId = setInterval(() => {
      if (gameState) {
        saveGameStateToSlots(gameState);
        setAutoSaveToast('💾 Progresso salvo automaticamente!');
        setTimeout(() => setAutoSaveToast(null), 4000);
      }
    }, 300000); // 5 minutos em milissegundos

    return () => clearInterval(intervalId);
  }, [gameState, viewMode]);

  // Check death or retirement
  useEffect(() => {
    if (viewMode !== 'game') return;
    if (gameState.stats.saude <= 0 && gameState.character.alive) {
      playErrorSound();
      setGameState((prev) => ({
        ...prev,
        character: { ...prev.character, alive: false, deathCause: 'Esgotamento físico e problemas de saúde graves.' }
      }));
      setIsGameOverModalOpen(true);
    } else if (gameState.character.age >= 75 && !gameState.character.retired) {
      setGameState((prev) => ({
        ...prev,
        character: { ...prev.character, retired: true }
      }));
    }
  }, [gameState.stats.saude, gameState.character.age, gameState.character.alive, gameState.character.retired, viewMode]);

  const checkAchievements = (state: GameState): GameState => {
    const updatedAchievements = state.achievements.map((ach) => {
      if (ach.unlocked) return ach;
      let shouldUnlock = false;

      if (ach.id === 'primeiro_trampo' && state.career.hasCarteiraAssinada) shouldUnlock = true;
      if (ach.id === 'nome_limpo_ouro' && state.serasa.score >= 800) shouldUnlock = true;
      if (ach.id === 'caramelo_friend' && state.pet?.name === 'Caramelo') shouldUnlock = true;
      if (ach.id === 'celta_prata' && state.vehicle) shouldUnlock = true;
      if (ach.id === 'concursado_ouro' && state.career.type === 'concursado') shouldUnlock = true;
      if (ach.id === 'primeiro_ape' && state.housing.type === 'proprio') shouldUnlock = true;
      if (ach.id === 'cem_k' && state.stats.grana + state.finances.cdiBalance >= 100000) shouldUnlock = true;
      if (ach.id === 'vovo_saudavel' && state.character.age >= 70 && state.stats.saude >= 60) shouldUnlock = true;

      if (shouldUnlock) {
        confetti({ particleCount: 60, spread: 70 });
        playSuccessSound();
        return { ...ach, unlocked: true, unlockedAtAge: state.character.age };
      }
      return ach;
    });

    return { ...state, achievements: updatedAchievements };
  };

  const processPayment = (cost: number): { success: boolean; paidBy?: 'grana' | 'cartao' | 'vista'; message?: string } => {
    if (cost <= 0) return { success: true, paidBy: 'grana' };

    const currentCash = gameState.stats.grana;
    const creditLimit = gameState.finances?.creditCardLimit || 0;
    const creditUsed = gameState.finances?.creditCardUsed || 0;
    const availableCredit = creditLimit > 0 ? (creditLimit - creditUsed) : 0;

    if (currentCash >= cost) {
      return { success: true, paidBy: 'grana' };
    }

    if (availableCredit >= cost) {
      return { success: true, paidBy: 'cartao' };
    }

    playErrorSound();
    return {
      success: false,
      message: `🚨 Transação negada! Valor de R$ ${cost.toLocaleString('pt-BR')} indisponível. Saldo em conta e cartão insuficientes!`
    };
  };

  const deductCost = (prev: GameState, cost: number, paidBy?: 'grana' | 'cartao' | 'vista'): GameState => {
    if (cost <= 0) return prev;
    if (paidBy === 'cartao') {
      const newCreditUsed = (prev.finances.creditCardUsed || 0) + cost;
      const prevCardObj = prev.finances.creditCard || { hasCard: true, tier: 'Básico', limit: prev.finances.creditCardLimit || 5000, used: 0 };
      return {
        ...prev,
        finances: {
          ...prev.finances,
          creditCardUsed: newCreditUsed,
          creditCard: {
            ...prevCardObj,
            used: (prevCardObj.used || 0) + cost
          }
        }
      };
    }
    return {
      ...prev,
      stats: {
        ...prev.stats,
        grana: Math.max(0, prev.stats.grana - cost)
      }
    };
  };

  // Choice Handler
  const handleChooseDilemma = (choice: Choice) => {
    playClickSound();
    setGameState((prev) => {
      const { consequences } = choice;

      const newSaude = Math.min(100, Math.max(0, prev.stats.saude + (consequences.saude || 0)));
      const newFelicidade = Math.min(100, Math.max(0, prev.stats.felicidade + (consequences.felicidade || 0)));
      const newEnergia = Math.min(100, Math.max(0, prev.stats.energia + (consequences.energia || 0)));
      const newIntelecto = Math.min(100, Math.max(0, prev.stats.intelecto + (consequences.intelecto || 0)));
      const newGrana = Math.max(0, prev.stats.grana + (consequences.grana || 0));

      let newScore = Math.min(1000, Math.max(50, prev.serasa.score + (consequences.serasa || 0)));
      let newDividas = [...prev.serasa.dividas];

      if (consequences.addDebt) {
        newDividas.push(consequences.addDebt);
      }
      if (consequences.customAction === 'clear_all_debts') {
        newDividas = [];
        newScore = Math.min(1000, newScore + 180);
      }

      let updatedCareer = { ...prev.career };
      if (consequences.gainJob) {
        updatedCareer = { ...updatedCareer, ...consequences.gainJob };
      }

      const updatedHousing = consequences.gainHousing || prev.housing;
      const updatedVehicle = consequences.gainVehicle || prev.vehicle;
      const updatedPet = consequences.gainPet || prev.pet;
      const updatedRelationship = consequences.gainPartner
        ? { status: 'namorando' as const, partnerName: consequences.gainPartner, affection: 85, yearsTogether: 1 }
        : prev.relationship;

      const newLog = {
        id: `log_${Date.now()}`,
        year: prev.character.year,
        age: prev.character.age,
        title: prev.currentDilemma?.title || 'Decisão Tomada',
        description: choice.outcomeNarrative,
        type: 'milestone' as const,
        statDeltas: {
          grana: consequences.grana,
          felicidade: consequences.felicidade,
          saude: consequences.saude,
          serasa: consequences.serasa
        }
      };

      let updatedCharacter = { ...prev.character };
      if (consequences.retire) {
        updatedCharacter.retired = true;
        updatedCareer = {
          ...updatedCareer,
          type: 'clt', // Mantém histórico como beneficiário
          title: `Aposentado(a) (${consequences.retire.retirementType === 'inss' ? 'INSS' : consequences.retire.retirementType === 'privada' ? 'Prev. Privada' : 'INSS + Privada'})`,
          salaryMonthly: consequences.retire.pensionMonthly,
          pensionMonthly: consequences.retire.pensionMonthly,
          retirementType: consequences.retire.retirementType
        };
      }

      const intermediateState: GameState = {
        ...prev,
        character: updatedCharacter,
        stats: { saude: newSaude, felicidade: newFelicidade, energia: newEnergia, intelecto: newIntelecto, grana: newGrana },
        serasa: { score: newScore, status: newScore >= 500 && newDividas.length === 0 ? 'bom' : 'negativado', dividas: newDividas },
        career: updatedCareer,
        housing: updatedHousing,
        vehicle: updatedVehicle,
        pet: updatedPet,
        relationship: updatedRelationship,
        logs: [newLog, ...prev.logs],
        currentDilemma: null
      };

      return checkAchievements(intermediateState);
    });
  };

  // Advance Time Handler (Anual, Semestral, Mensal) + Company Annual Event Processing + Brazil News
  const handleAdvanceYear = () => {
    playClickSound();
    setGameState((prev) => {
      const mode = prev.timeAdvanceMode || 'anual';
      let isYearRoll = false;
      let nextAge = prev.character.age;
      let nextYear = prev.character.year;
      let nextSubPeriod = prev.timeSubPeriod || 1;
      let timeMultiplier = 1;

      if (mode === 'mensal') {
        timeMultiplier = 1 / 12;
        if (nextSubPeriod >= 12) {
          nextSubPeriod = 1;
          isYearRoll = true;
          nextAge += 1;
          nextYear += 1;
        } else {
          nextSubPeriod += 1;
          isYearRoll = false;
        }
      } else if (mode === 'semestral') {
        timeMultiplier = 0.5;
        if (nextSubPeriod >= 2) {
          nextSubPeriod = 1;
          isYearRoll = true;
          nextAge += 1;
          nextYear += 1;
        } else {
          nextSubPeriod += 1;
          isYearRoll = false;
        }
      } else {
        timeMultiplier = 1;
        isYearRoll = true;
        nextAge += 1;
        nextYear += 1;
        nextSubPeriod = 1;
      }

      let periodEarnings = 0;
      let currentEfficiency = prev.career.efficiency ?? 65;
      let salaryRaiseNote = '';
      let updatedSalary = prev.career.salaryMonthly;

      if (updatedSalary > 0) {
        if (isYearRoll && currentEfficiency >= 75) {
          const raisePercent = 0.12; // 12% performance raise
          const raiseAmount = Math.round(updatedSalary * raisePercent);
          updatedSalary += raiseAmount;
          salaryRaiseNote = ` Avaliação de Desempenho: Alta eficiência (${currentEfficiency}%) rendeu aumento salarial de R$ ${raiseAmount.toLocaleString('pt-BR')}!`;
        } else if (isYearRoll && currentEfficiency < 40) {
          salaryRaiseNote = ` Avaliação de Desempenho: Baixa eficiência (${currentEfficiency}%) resultou em advertência do gestor.`;
        }

        if (prev.career.hasCarteiraAssinada) {
          periodEarnings = Math.round(updatedSalary * (13.33 * timeMultiplier));
        } else {
          periodEarnings = Math.round(updatedSalary * (12 * timeMultiplier));
        }
      }

      // Company Profit/Loss Calculation & Event
      let companyPeriodProfit = 0;
      let updatedCompany = prev.company ? { ...prev.company } : undefined;
      let companyLogNote = '';

      if (updatedCompany) {
        const annualRevenue = updatedCompany.monthlyRevenue * 12;
        const totalStaffPayroll = updatedCompany.employees.reduce((acc, e) => acc + e.salaryMonthly, 0) * 12;
        const branchExpenses = updatedCompany.branchesCount * 8000 * 12;
        const annualExpenses = totalStaffPayroll + branchExpenses;

        let annualProfit = annualRevenue - annualExpenses;

        if (isYearRoll) {
          const businessRoll = Math.random();
          if (businessRoll < 0.25) {
            const bonusRev = Math.round(annualRevenue * 0.2);
            annualProfit += bonusRev;
            updatedCompany.valuation += Math.round(bonusRev * 1.5);
            companyLogNote = `Empresa ${updatedCompany.name} ganhou prêmio de inovação! +R$ ${bonusRev.toLocaleString('pt-BR')} no lucro anual!`;
          } else if (businessRoll < 0.45) {
            const penalty = Math.round(annualRevenue * 0.15);
            annualProfit -= penalty;
            companyLogNote = `Crise no setor afetou vendas da ${updatedCompany.name}. Prejuízo extra de R$ ${penalty.toLocaleString('pt-BR')}.`;
          } else {
            companyLogNote = `Empresa ${updatedCompany.name} registrou lucro de R$ ${annualProfit.toLocaleString('pt-BR')} este ano.`;
          }
        }

        companyPeriodProfit = Math.round(annualProfit * timeMultiplier);
      }

      const baseLivingCost = prev.character.lifeStyle === 'Humilde' ? 3000 : prev.character.lifeStyle === 'Luxo' ? 15000 : 6000;
      const cityCostExtra = prev.character.currentCity === 'São Paulo' || prev.character.currentCity === 'Rio de Janeiro' ? 1800 : 0;
      const periodHousingCost = (prev.character.age >= 18 && prev.housing.type !== 'pais')
        ? Math.round(prev.housing.monthlyCost * (12 * timeMultiplier))
        : 0;
      const periodFoodAndLiving = prev.character.age >= 18
        ? Math.round((baseLivingCost + cityCostExtra) * timeMultiplier)
        : 0;
      const vehicleMaintenance = prev.vehicle ? Math.round(prev.vehicle.yearlyMaintenance * timeMultiplier) : 0;
      const petExpense = prev.pet ? Math.round(prev.pet.monthlyCost * (12 * timeMultiplier)) : 0;

      const totalExpenses = periodHousingCost + periodFoodAndLiving + vehicleMaintenance + petExpense;

      const cdiYield = Math.round(prev.finances.cdiBalance * (0.105 * timeMultiplier));
      const newCdiBalance = prev.finances.cdiBalance + cdiYield;
      const currentCaixinhaTx = prev.finances.caixinhaTransactions || [];
      const updatedCaixinhaTx = cdiYield > 0
        ? [
            {
              id: `tx_cdi_${nextYear}_${Date.now()}`,
              date: `${mode === 'mensal' ? `Mês ${nextSubPeriod}` : mode === 'semestral' ? `${nextSubPeriod}º Semestre` : '31/12'}/${nextYear}`,
              type: 'rendimento' as const,
              amount: cdiYield,
              description: `Rendimento Caixinha CDI (~10.5% a.a.)`
            },
            ...currentCaixinhaTx
          ]
        : currentCaixinhaTx;

      const newFgts = prev.career.hasCarteiraAssinada
        ? prev.career.fgtsAccumulated + Math.round(prev.career.salaryMonthly * 0.08 * (12 * timeMultiplier))
        : prev.career.fgtsAccumulated;

      const netSavingsThisPeriod = periodEarnings + companyPeriodProfit - totalExpenses;

      // Execution of Agenda Semanal (Estudos, Terapia, Trabalho Extra)
      const scheduleItems = prev.weeklySchedule?.items || [
        { id: 'estudos', name: 'Estudos & Leitura Guiada', icon: '📚', enabled: false, dayOfWeek: 'Terça', shift: 'Noite', cost: 50, earnings: 0, effectsDescription: '+10 Intelecto, -8% Energia (R$ 50/período)' },
        { id: 'terapia', name: 'Sessão de Terapia com Psicólogo', icon: '🧠', enabled: false, dayOfWeek: 'Quinta', shift: 'Tarde', cost: 140, earnings: 0, effectsDescription: '+35% Saúde Mental, +12% Felicidade (R$ 140/período)' },
        { id: 'trabalho_extra', name: 'Trabalho Extra / Bico Freelance', icon: '💼', enabled: false, dayOfWeek: 'Sábado', shift: 'Manhã', cost: 0, earnings: 250, effectsDescription: '+R$ 250 Rendimentos, -10% Energia, -5% Saúde Mental' }
      ];

      const activeScheduleItems = scheduleItems.filter(item => item.enabled);
      let scheduleNetCash = 0;
      let scheduleIntelectoDelta = 0;
      let scheduleMentalHealthDelta = 0;
      let scheduleHappinessDelta = 0;
      let scheduleEnergyDelta = 0;
      let scheduleNotes: string[] = [];

      activeScheduleItems.forEach(item => {
        if (item.id === 'estudos') {
          scheduleNetCash -= item.cost;
          scheduleIntelectoDelta += 10;
          scheduleEnergyDelta -= 8;
          scheduleNotes.push(`📚 Estudos (${item.dayOfWeek} ${item.shift}): +10 Intelecto`);
        } else if (item.id === 'terapia') {
          scheduleNetCash -= item.cost;
          scheduleMentalHealthDelta += 35;
          scheduleHappinessDelta += 12;
          scheduleNotes.push(`🧠 Terapia (${item.dayOfWeek} ${item.shift}): +35% Saúde Mental`);
        } else if (item.id === 'trabalho_extra') {
          scheduleNetCash += item.earnings;
          scheduleEnergyDelta -= 10;
          scheduleMentalHealthDelta -= 5;
          scheduleNotes.push(`💼 Trabalho Extra (${item.dayOfWeek} ${item.shift}): +R$ ${item.earnings}`);
        }
      });

      const newCash = Math.max(0, prev.stats.grana + netSavingsThisPeriod + scheduleNetCash);

      const healthDegradation = isYearRoll ? (nextAge > 45 ? 3 : nextAge > 65 ? 5 : 1) : 0;
      const newSaude = Math.min(100, Math.max(0, prev.stats.saude - healthDegradation));
      const petHappiness = prev.pet ? (isYearRoll ? prev.pet.happinessBonus : 1) : 0;

      // News headline generation & impact: updates on EVERY advance click (anual, semestral, mensal)
      const nextNews = getRandomBrazilNews(nextYear);
      const newsHappinessDelta = Math.round((nextNews.happinessDelta || 0) * timeMultiplier);
      const newsSerasaDelta = Math.round((nextNews.serasaDelta || 0) * timeMultiplier);

      const periodNewsLabel = mode === 'mensal'
        ? `Mês ${nextSubPeriod} • ${nextYear}`
        : mode === 'semestral'
        ? `${nextSubPeriod}º Semestre • ${nextYear}`
        : `Ano ${nextYear}`;

      const newsLog = {
        id: `news_log_${nextYear}_${nextSubPeriod}_${Date.now()}`,
        year: nextYear,
        age: nextAge,
        title: `🇧🇷 Notícia (${periodNewsLabel}): ${nextNews.headline.slice(0, 35)}...`,
        description: `${nextNews.summary} (Fonte: ${nextNews.source})`,
        type: 'milestone' as const,
        statDeltas: {
          felicidade: newsHappinessDelta,
          serasa: newsSerasaDelta
        }
      };

      const finalFelicidade = Math.min(100, Math.max(0, prev.stats.felicidade + petHappiness + newsHappinessDelta + scheduleHappinessDelta - (isYearRoll ? 2 : 0)));
      const finalIntelecto = Math.min(100, Math.max(0, prev.stats.intelecto + scheduleIntelectoDelta));
      const finalSaudeMental = Math.min(100, Math.max(0, (prev.stats.saudeMental ?? 80) + scheduleMentalHealthDelta));
      const finalEnergia = Math.min(100, Math.max(0, prev.stats.energia + scheduleEnergyDelta));
      const newSerasaScore = Math.min(1000, Math.max(0, prev.serasa.score + newsSerasaDelta));

      let scheduleLogEntry: any = null;
      if (activeScheduleItems.length > 0) {
        scheduleLogEntry = {
          id: `schedule_log_${nextYear}_${nextSubPeriod}_${Date.now()}`,
          year: nextYear,
          age: nextAge,
          title: `📅 Agenda Semanal Executada (${activeScheduleItems.length} rotinas)`,
          description: `Compromissos da semana concluídos: ${scheduleNotes.join(' | ')}. Saldo da agenda: ${scheduleNetCash >= 0 ? `+R$ ${scheduleNetCash}` : `-R$ ${Math.abs(scheduleNetCash)}`}.`,
          type: 'milestone' as const,
          statDeltas: {
            intelecto: scheduleIntelectoDelta || undefined,
            saudeMental: scheduleMentalHealthDelta || undefined,
            felicidade: scheduleHappinessDelta || undefined,
            grana: scheduleNetCash || undefined
          }
        };
      }

      let updatedRel = { ...prev.relationship };
      if (isYearRoll && updatedRel.partnerName) {
        updatedRel.yearsTogether = (updatedRel.yearsTogether || 0) + 1;
      }

      let updatedPet = prev.pet ? { ...prev.pet, age: isYearRoll ? prev.pet.age + 1 : prev.pet.age } : undefined;
      let petDeathLogEntry: any = null;

      // Pet natural old-age mortality check
      if (updatedPet && isYearRoll && updatedPet.age > 12) {
        const deathRoll = Math.random();
        const deathChance = Math.min(0.8, (updatedPet.age - 12) * 0.15);
        if (deathRoll < deathChance) {
          petDeathLogEntry = {
            id: `pet_death_${Date.now()}`,
            year: nextYear,
            age: nextAge,
            title: `🌈 Falecimento de Estimação: ${updatedPet.name}`,
            description: `Seu fiel animal de estimação (${updatedPet.name}, ${updatedPet.breed}) faleceu pacificamente de velhice aos ${updatedPet.age} anos. Deixa saudades profundas e memórias carinhosas.`,
            type: 'health' as const,
            statDeltas: { felicidade: -20, saudeMental: -15 }
          };
          updatedPet = undefined;
        }
      }

      // Family members & friends age along with player time advance (+1 year on year roll)
      const updatedChildren = prev.family?.children
        ? prev.family.children.map((child) => ({
            ...child,
            age: isYearRoll ? child.age + 1 : child.age
          }))
        : [];

      const updatedParents = prev.family?.parents
        ? prev.family.parents.map((parent) => ({
            ...parent,
            age: isYearRoll ? parent.age + 1 : parent.age
          }))
        : [];

      const updatedSiblings = prev.family?.siblings
        ? prev.family.siblings.map((sibling) => ({
            ...sibling,
            age: isYearRoll ? sibling.age + 1 : sibling.age
          }))
        : [];

      const updatedFriends = prev.family?.friends
        ? prev.family.friends.map((friend) => ({
            ...friend,
            age: isYearRoll ? friend.age + 1 : friend.age
          }))
        : [];

      // Autonomous lifecycle events for relatives and friends on year roll
      const autonomousLogs: any[] = [];
      if (isYearRoll) {
        updatedChildren.forEach((child) => {
          if (child.age === 18) {
            autonomousLogs.push({
              id: `auto_child_18_${child.id}_${Date.now()}`,
              year: nextYear,
              age: nextAge,
              title: `🎓 Filho(a) ${child.name} fez 18 Anos!`,
              description: `${child.name} completou a maioridade, formou-se no ensino médio e iniciou sua jornada no ensino superior/mercado de trabalho de forma autônoma!`,
              type: 'milestone'
            });
          } else if (child.age === 25) {
            autonomousLogs.push({
              id: `auto_child_25_${child.id}_${Date.now()}`,
              year: nextYear,
              age: nextAge,
              title: `💼 Conquista Profissional de ${child.name}`,
              description: `${child.name} fez 25 anos, conquistou sua independência financeira e comprou seu próprio veículo!`,
              type: 'milestone'
            });
          } else if (child.age === 30) {
            autonomousLogs.push({
              id: `auto_child_30_${child.id}_${Date.now()}`,
              year: nextYear,
              age: nextAge,
              title: `💍 Casamento de ${child.name}`,
              description: `${child.name} completou 30 anos e se casou em uma linda cerimônia!`,
              type: 'milestone'
            });
          }
        });

        updatedSiblings.forEach((sib) => {
          if (sib.age === 18) {
            autonomousLogs.push({
              id: `auto_sib_18_${sib.id}_${Date.now()}`,
              year: nextYear,
              age: nextAge,
              title: `🎒 Irmão(ã) ${sib.name} fez 18 Anos!`,
              description: `Seu irmão(ã) ${sib.name} fez 18 anos, ingressou na faculdade de forma autônoma e começou a estagiar!`,
              type: 'milestone'
            });
          } else if (sib.age === 26) {
            autonomousLogs.push({
              id: `auto_sib_26_${sib.id}_${Date.now()}`,
              year: nextYear,
              age: nextAge,
              title: `🏡 Conquista do Irmão(ã) ${sib.name}`,
              description: `Seu irmão(ã) ${sib.name} comprou o próprio apartamento de forma independente!`,
              type: 'milestone'
            });
          }
        });
      }

      // Adjust title for younger ages if not employed
      let updatedCareerTitle = prev.career.title;
      if (prev.career.type === 'desempregado' && isYearRoll) {
        if (nextAge < 3) updatedCareerTitle = 'Bebê';
        else if (nextAge < 6) updatedCareerTitle = 'Criança (Educação Infantil)';
        else if (nextAge < 12) updatedCareerTitle = 'Estudante (Ensino Fundamental)';
        else if (nextAge < 18) updatedCareerTitle = 'Estudante (Ensino Médio)';
        else if (updatedCareerTitle.includes('Estudante') || updatedCareerTitle.includes('Bebê') || updatedCareerTitle.includes('Criança')) {
          updatedCareerTitle = 'Em Busca do Primeiro Emprego';
        }
      }

      const availableDilemmas = BRAZILIAN_DILEMMAS.filter((d) => {
        if (d.minAge > nextAge) return false;
        if (d.maxAge && d.maxAge < nextAge) return false;
        if (d.condition && !d.condition(prev)) return false;
        return true;
      });

      const nextDilemma = (isYearRoll || Math.random() < 0.4) && availableDilemmas.length > 0
        ? availableDilemmas[Math.floor(Math.random() * availableDilemmas.length)]
        : null;

      const netWorthAtPeriodEnd = newCash + newCdiBalance + prev.housing.propertyValue + (prev.vehicle?.value || 0) + (updatedCompany ? updatedCompany.valuation : 0);

      const periodLabel = mode === 'mensal'
        ? `Mês ${nextSubPeriod} • ${nextYear}`
        : mode === 'semestral'
        ? `${nextSubPeriod}º Semestre • ${nextYear}`
        : `Resumo do Ano • ${nextAge} anos`;

      const summaryLog = {
        id: `log_time_${nextYear}_${nextSubPeriod}_${Date.now()}`,
        year: nextYear,
        age: nextAge,
        title: periodLabel,
        description: `Patrimônio Líquido: R$ ${netWorthAtPeriodEnd.toLocaleString('pt-BR')}. Receitas: R$ ${periodEarnings.toLocaleString('pt-BR')}, Despesas: R$ ${totalExpenses.toLocaleString('pt-BR')}. ${companyLogNote}${salaryRaiseNote}`,
        type: 'financial' as const,
        statDeltas: { grana: netSavingsThisPeriod, netWorth: netWorthAtPeriodEnd }
      };

      const newLogs = [summaryLog, ...autonomousLogs, ...(petDeathLogEntry ? [petDeathLogEntry] : []), ...(scheduleLogEntry ? [scheduleLogEntry] : []), ...(newsLog ? [newsLog] : []), ...prev.logs];

      const intermediateState: GameState = {
        ...prev,
        character: {
          ...prev.character,
          age: nextAge,
          year: nextYear
        },
        timeSubPeriod: nextSubPeriod,
        currentNews: nextNews,
        stats: {
          ...prev.stats,
          saude: newSaude,
          felicidade: finalFelicidade,
          grana: newCash,
          intelecto: finalIntelecto,
          energia: finalEnergia,
          saudeMental: finalSaudeMental
        },
        serasa: { ...prev.serasa, score: newSerasaScore },
        finances: {
          ...prev.finances,
          cdiBalance: newCdiBalance,
          caixinhaTransactions: updatedCaixinhaTx
        },
        career: {
          ...prev.career,
          title: updatedCareerTitle,
          salaryMonthly: updatedSalary,
          yearsInJob: prev.career.salaryMonthly > 0 ? (isYearRoll ? prev.career.yearsInJob + 1 : prev.career.yearsInJob) : 0,
          totalYearsWorked: (prev.career.totalYearsWorked || 0) + (isYearRoll && prev.career.salaryMonthly > 0 && !prev.character.retired ? 1 : 0),
          fgtsAccumulated: newFgts,
          monthsWorkedInJob: prev.career.salaryMonthly > 0 ? (prev.career.monthsWorkedInJob || 0) + (mode === 'anual' ? 12 : mode === 'semestral' ? 6 : 1) : 0,
          monthsSinceVacation: prev.career.salaryMonthly > 0 ? (prev.career.monthsSinceVacation || 0) + (mode === 'anual' ? 12 : mode === 'semestral' ? 6 : 1) : 0,
          vacationAvailable: prev.career.salaryMonthly > 0 && (((prev.career.monthsSinceVacation || 0) + (mode === 'anual' ? 12 : mode === 'semestral' ? 6 : 1)) >= 12 || prev.career.yearsInJob >= 1)
        },
        resolvedConflicts: isYearRoll ? [] : prev.resolvedConflicts,
        company: updatedCompany,
        pet: updatedPet,
        relationship: updatedRel,
        family: {
          parents: updatedParents,
          siblings: updatedSiblings,
          children: updatedChildren,
          friends: updatedFriends
        },
        logs: newLogs,
        currentDilemma: nextDilemma
      };

      return checkAchievements(intermediateState);
    });
  };

  // Handlers for Time Advance Mode, Gender Transition, Orientation, Salon and Succession Will
  const handleChangeTimeMode = (mode: 'anual' | 'semestral' | 'mensal') => {
    playClickSound();
    setGameState((prev) => ({
      ...prev,
      timeAdvanceMode: mode,
      timeSubPeriod: 1,
      logs: [
        {
          id: `mode_${Date.now()}`,
          year: prev.character.year,
          age: prev.character.age,
          title: `⚙️ Ritmo de Tempo: ${mode.toUpperCase()}`,
          description: `O tempo de vida agora avançará no modo ${mode}.`,
          type: 'milestone'
        },
        ...prev.logs
      ]
    }));
  };

  const handleGenderTransition = (targetGender: 'M' | 'F' | 'NB', surgeryType: string, cost: number): { success: boolean; message: string } => {
    playClickSound();
    if (gameState.stats.grana < cost) {
      playErrorSound();
      return { success: false, message: `Saldo insuficiente! A cirurgia requer R$ ${cost.toLocaleString('pt-BR')} em conta.` };
    }

    playSuccessSound();
    confetti({ particleCount: 70, spread: 70 });
    setGameState((prev) => {
      const genderLabel = targetGender === 'F' ? 'Feminino (Mulher)' : targetGender === 'M' ? 'Masculino (Homem)' : 'Não-Binário';
      return {
        ...prev,
        stats: {
          ...prev.stats,
          grana: prev.stats.grana - cost,
          felicidade: Math.min(100, prev.stats.felicidade + 35)
        },
        character: {
          ...prev.character,
          gender: targetGender,
          transGenderHistory: true
        },
        logs: [
          {
            id: `gender_trans_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: `⚧️ Afirmação de Gênero: ${surgeryType}`,
            description: `Realizou procedimento de transição com sucesso. Identidade reconhecida como ${genderLabel}! (+35 Felicidade)`,
            type: 'milestone',
            statDeltas: { grana: -cost, felicidade: 35 }
          },
          ...prev.logs
        ]
      };
    });

    return { success: true, message: `✨ Cirurgia de afirmação realizada com sucesso! Parabéns pela sua transição!` };
  };

  const handleChangeOrientation = (orientation: string): { success: boolean; message: string } => {
    playClickSound();
    playSuccessSound();
    confetti({ particleCount: 40, spread: 50 });
    setGameState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        felicidade: Math.min(100, prev.stats.felicidade + 15)
      },
      character: {
        ...prev.character,
        sexualOrientation: orientation
      },
      logs: [
        {
          id: `ori_${Date.now()}`,
          year: prev.character.year,
          age: prev.character.age,
          title: `🌈 Orientação Sexual: ${orientation}`,
          description: `Assumiu sua verdade com orgulho: orientação declarada como ${orientation}. (+15 Felicidade)`,
          type: 'milestone',
          statDeltas: { felicidade: 15 }
        },
        ...prev.logs
      ]
    }));
    return { success: true, message: `🌈 Orientação sexual atualizada para ${orientation}! Felicidade +15.` };
  };

  const handleSalonAction = (action: { type: 'cabelo' | 'pintura' | 'visual' | 'unhas' | 'sobrancelha' | 'spa'; name: string; cost: number; happinessBonus: number }): { success: boolean; message: string } => {
    playClickSound();
    if (gameState.stats.grana < action.cost) {
      playErrorSound();
      return { success: false, message: `Saldo insuficiente! O serviço custa R$ ${action.cost.toLocaleString('pt-BR')}.` };
    }

    playSuccessSound();
    confetti({ particleCount: 30, spread: 45 });
    setGameState((prev) => {
      let charUpdates: Partial<typeof prev.character> = {};
      if (action.type === 'cabelo') charUpdates.hairStyle = action.name;
      if (action.type === 'pintura') charUpdates.hairColor = action.name;
      if (action.type === 'visual') charUpdates.styleLook = action.name;
      if (action.type === 'unhas') charUpdates.nailStyle = action.name;
      if (action.type === 'sobrancelha') charUpdates.eyebrows = action.name;

      const energyGain = action.type === 'spa' ? 25 : 5;

      return {
        ...prev,
        stats: {
          ...prev.stats,
          grana: prev.stats.grana - action.cost,
          felicidade: Math.min(100, prev.stats.felicidade + action.happinessBonus),
          energia: Math.min(100, prev.stats.energia + energyGain)
        },
        character: {
          ...prev.character,
          ...charUpdates
        },
        logs: [
          {
            id: `salon_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: `💇 Salão & Estética: ${action.name}`,
            description: `Cuidou do visual com ${action.name}. (+${action.happinessBonus} Felicidade)`,
            type: 'fun',
            statDeltas: { grana: -action.cost, felicidade: action.happinessBonus }
          },
          ...prev.logs
        ]
      };
    });

    return { success: true, message: `✨ Procedimento realizado com sucesso! (+${action.happinessBonus} Felicidade)` };
  };

  const handleUpdateAdvancedWill = (updatedWill: AdvancedWillState) => {
    playClickSound();
    setGameState((prev) => ({
      ...prev,
      will: {
        ...prev.will,
        beneficiary: updatedWill.beneficiary || prev.will?.beneficiary || 'Filhos',
        percentageToCharity: updatedWill.charityPercent || 0,
        advancedWill: updatedWill
      },
      logs: [
        {
          id: `adv_will_${Date.now()}`,
          year: prev.character.year,
          age: prev.character.age,
          title: `🏛️ Sucessão Familiar Atualizada`,
          description: `Disposições testamentárias registradas${updatedWill.isRegisteredInCartorio ? ' em Cartório de Notas' : ''}.`,
          type: 'milestone'
        },
        ...prev.logs
      ]
    }));
  };

  const handleReactToNews = (news: BrazilNews) => {
    playClickSound();
    const hapDelta = news.happinessDelta || 5;
    const serDelta = news.serasaDelta || 0;
    const isPositive = hapDelta >= 0;

    if (isPositive) playSuccessSound(); else playErrorSound();

    setGameState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        felicidade: Math.min(100, Math.max(0, prev.stats.felicidade + hapDelta)),
        intelecto: Math.min(100, (prev.stats.intelecto || 50) + 2)
      },
      serasa: {
        ...prev.serasa,
        score: Math.min(1000, Math.max(0, prev.serasa.score + serDelta))
      },
      logs: [
        {
          id: `react_news_${Date.now()}`,
          year: prev.character.year,
          age: prev.character.age,
          title: `📰 Notícia: ${news.headline.slice(0, 35)}...`,
          description: `Você acompanhou: "${news.headline}". Impacto: ${hapDelta >= 0 ? '+' : ''}${hapDelta} Felicidade${serDelta !== 0 ? `, ${serDelta >= 0 ? '+' : ''}${serDelta} Serasa` : ''}.`,
          type: hapDelta >= 0 ? 'milestone' : 'financial'
        },
        ...prev.logs
      ]
    }));
  };

  const handleUpdateCharacterSettings = (updates: {
    styleLook?: string;
    lifeStyle?: 'Humilde' | 'Tranquilo' | 'Luxo';
    artStyle?: 'Geométrico' | 'Ilustrado';
    avatarSkinTone?: string;
    avatarOutfit?: string;
    avatarAccessory?: string;
    autoAgingEnabled?: boolean;
  }) => {
    setGameState((prev) => ({
      ...prev,
      character: {
        ...prev.character,
        ...(updates.styleLook !== undefined && { styleLook: updates.styleLook }),
        ...(updates.lifeStyle !== undefined && { lifeStyle: updates.lifeStyle }),
        ...(updates.artStyle !== undefined && { artStyle: updates.artStyle }),
        ...(updates.avatarSkinTone !== undefined && { avatarSkinTone: updates.avatarSkinTone }),
        ...(updates.avatarOutfit !== undefined && { avatarOutfit: updates.avatarOutfit }),
        ...(updates.avatarAccessory !== undefined && { avatarAccessory: updates.avatarAccessory }),
        ...(updates.autoAgingEnabled !== undefined && { autoAgingEnabled: updates.autoAgingEnabled }),
      }
    }));
  };

  // Company Management Handlers
  const handleCreateCompany = (data: { name: string; sector: CompanyState['sector']; legalType: CompanyState['legalType'] }) => {
    playClickSound();
    const minCapital = data.legalType === 'MEI' ? 500 : data.legalType === 'LTDA' ? 5000 : 50000;
    if (gameState.stats.grana < minCapital) {
      playErrorSound();
      return { success: false, message: `Capital insuficiente! Exige R$ ${minCapital.toLocaleString('pt-BR')} em conta.` };
    }

    const initialValuation = minCapital * 5;
    const initialRev = Math.round(minCapital * 0.8);

    playSuccessSound();
    setGameState((prev) => ({
      ...prev,
      stats: { ...prev.stats, grana: prev.stats.grana - minCapital },
      company: {
        id: `comp_${Date.now()}`,
        name: data.name,
        sector: data.sector,
        legalType: data.legalType,
        valuation: initialValuation,
        monthlyRevenue: initialRev,
        monthlyExpenses: Math.round(initialRev * 0.4),
        employees: [],
        branchesCount: 1,
        isFranchised: false,
        isPubliclyTraded: false,
        sharesOwnedPercent: 100,
        reputation: 80
      },
      logs: [
        {
          id: `cnpj_${Date.now()}`,
          year: prev.character.year,
          age: prev.character.age,
          title: `Empresa Fundada: ${data.name}`,
          description: `Registrou CNPJ (${data.legalType}) no setor de ${data.sector} com investimento de R$ ${minCapital.toLocaleString('pt-BR')}.`,
          type: 'milestone'
        },
        ...prev.logs
      ]
    }));

    return { success: true, message: `🎉 CNPJ de ${data.name} registrado com sucesso!` };
  };

  const handleHireEmployee = (candidate: { name: string; role: string; salaryMonthly: number; skillLevel: number }) => {
    playClickSound();
    if (!gameState.company) return { success: false, message: 'Você não possui uma empresa ativa.' };

    const newEmp: CompanyEmployee = {
      id: `emp_${Date.now()}`,
      name: candidate.name,
      role: candidate.role,
      salaryMonthly: candidate.salaryMonthly,
      morale: 90,
      skillLevel: candidate.skillLevel,
      hiredAtYear: gameState.character.year
    };

    setGameState((prev) => {
      if (!prev.company) return prev;
      const updatedRev = prev.company.monthlyRevenue + Math.round(candidate.salaryMonthly * 1.8);
      const updatedValuation = prev.company.valuation + (candidate.salaryMonthly * 12);
      return {
        ...prev,
        company: {
          ...prev.company,
          monthlyRevenue: updatedRev,
          valuation: updatedValuation,
          employees: [...prev.company.employees, newEmp]
        },
        logs: [
          { id: `hire_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Funcionário Contratado: ${candidate.name}`, description: `Contratado para o cargo de ${candidate.role} com salário de R$ ${candidate.salaryMonthly.toLocaleString('pt-BR')}.`, type: 'career' },
          ...prev.logs
        ]
      };
    });

    return { success: true, message: `${candidate.name} foi contratado(a) com sucesso!` };
  };

  const handlePromoteEmployee = (empId: string) => {
    playClickSound();
    setGameState((prev) => {
      if (!prev.company) return prev;
      const updatedEmps = prev.company.employees.map((e) => {
        if (e.id === empId) {
          return {
            ...e,
            salaryMonthly: Math.round(e.salaryMonthly * 1.25),
            morale: 100,
            skillLevel: Math.min(100, e.skillLevel + 10)
          };
        }
        return e;
      });
      return {
        ...prev,
        company: {
          ...prev.company,
          employees: updatedEmps
        }
      };
    });
    return { success: true, message: 'Funcionário promovido com 25% de aumento e moral renovada!' };
  };

  const handleFireEmployee = (empId: string) => {
    playClickSound();
    setGameState((prev) => {
      if (!prev.company) return prev;
      const updatedEmps = prev.company.employees.filter((e) => e.id !== empId);
      return {
        ...prev,
        company: {
          ...prev.company,
          employees: updatedEmps
        }
      };
    });
    return { success: true, message: 'Funcionário desligado da empresa.' };
  };

  const handleExpandBranch = () => {
    playClickSound();
    const cost = 25000;
    if (gameState.stats.grana < cost) return { success: false, message: 'Saldo em conta insuficiente (R$ 25.000).' };

    playSuccessSound();
    setGameState((prev) => {
      if (!prev.company) return prev;
      return {
        ...prev,
        stats: { ...prev.stats, grana: prev.stats.grana - cost },
        company: {
          ...prev.company,
          branchesCount: prev.company.branchesCount + 1,
          monthlyRevenue: prev.company.monthlyRevenue + 12000,
          valuation: prev.company.valuation + 80000
        },
        logs: [
          { id: `branch_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: 'Nova Filial Aberta', description: `Inaugurou a ${prev.company.branchesCount + 1}ª filial da ${prev.company.name}!`, type: 'milestone' },
          ...prev.logs
        ]
      };
    });

    return { success: true, message: 'Nova filial inaugurada com sucesso!' };
  };

  const handleFranchiseCompany = () => {
    playClickSound();
    const cost = 50000;
    if (gameState.stats.grana < cost) return { success: false, message: 'Exige R$ 50.000 para a formatação da rede de franquias.' };

    playSuccessSound();
    setGameState((prev) => {
      if (!prev.company) return prev;
      return {
        ...prev,
        stats: { ...prev.stats, grana: prev.stats.grana - cost },
        company: {
          ...prev.company,
          isFranchised: true,
          valuation: prev.company.valuation * 2,
          monthlyRevenue: prev.company.monthlyRevenue + 25000
        },
        logs: [
          { id: `franq_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: 'Rede de Franquias Formatada', description: `Sua marca ${prev.company.name} agora é uma Franqueadora Nacional!`, type: 'milestone' },
          ...prev.logs
        ]
      };
    });

    return { success: true, message: 'Rede de franquias lançada! Royalties serão creditados mensalmente.' };
  };

  const handleLaunchIPO = () => {
    playClickSound();
    if (!gameState.company) return { success: false, message: 'Sem empresa para IPO.' };
    if (gameState.company.valuation < 150000) return { success: false, message: 'Valuation mínimo exigido para B3 é de R$ 150.000!' };

    const ipoCapitalInjection = 500000;
    playCoinSound();
    confetti({ particleCount: 90, spread: 80 });

    setGameState((prev) => {
      if (!prev.company) return prev;
      return {
        ...prev,
        stats: { ...prev.stats, grana: prev.stats.grana + ipoCapitalInjection },
        company: {
          ...prev.company,
          legalType: 'S/A',
          isPubliclyTraded: true,
          valuation: prev.company.valuation + 1000000,
          sharesOwnedPercent: 65
        },
        logs: [
          { id: `ipo_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: 'Abertura de Capital na B3 (IPO)', description: `Sucesso histórico no IPO! Ações listadas na bolsa e R$ 500.000 injetados no caixa!`, type: 'financial' },
          ...prev.logs
        ]
      };
    });

    return { success: true, message: '🎉 IPO CONCLUÍDO NA B3! R$ 500.000 de capital injetados na sua conta!' };
  };

  const handleSellCompany = () => {
    playClickSound();
    if (!gameState.company) return { success: false, message: 'Sem empresa para vender.' };

    const payout = gameState.company.valuation;
    playCoinSound();
    confetti({ particleCount: 80, spread: 70 });

    setGameState((prev) => {
      return {
        ...prev,
        stats: { ...prev.stats, grana: prev.stats.grana + payout },
        company: undefined,
        logs: [
          { id: `m_a_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Venda de Empresa (M&A Exit)`, description: `Vendeu 100% da empresa por R$ ${payout.toLocaleString('pt-BR')}.`, type: 'financial' },
          ...prev.logs
        ]
      };
    });

    return { success: true, message: `Empresa vendida por R$ ${payout.toLocaleString('pt-BR')}!`, payout };
  };

  // Creator Mode Handler
  const handleUpdateCreatorState = (updates: {
    avatarIcon?: string;
    stats?: Partial<GameState['stats']>;
    serasaScore?: number;
    customJobTitle?: string;
    customSalary?: number;
  }) => {
    setGameState((prev) => ({
      ...prev,
      character: {
        ...prev.character,
        legoAvatar: updates.avatarIcon || prev.character.legoAvatar
      },
      stats: {
        ...prev.stats,
        ...updates.stats
      },
      serasa: {
        ...prev.serasa,
        score: updates.serasaScore !== undefined ? updates.serasaScore : prev.serasa.score
      },
      career: {
        ...prev.career,
        title: updates.customJobTitle !== undefined ? updates.customJobTitle : prev.career.title,
        salaryMonthly: updates.customSalary !== undefined ? updates.customSalary : prev.career.salaryMonthly
      },
      creatorModeEnabled: true,
      logs: [
        { id: `creator_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: 'Modo Criador & God Ativado', description: 'Atributos e customizações ajustados via Sandbox.', type: 'milestone' },
        ...prev.logs
      ]
    }));
  };

  // Career Handlers
  const handleTakeVacation = (): { success: boolean; message: string } => {
    const isEligibleJob = ['clt', 'concursado', 'estagio', 'jovem_aprendiz'].includes(gameState.career.type) || gameState.career.hasCarteiraAssinada;
    const monthsVacation = gameState.career.monthsSinceVacation || 0;
    const isEligibleTime = monthsVacation >= 12 || (gameState.career.yearsInJob || 0) >= 1 || gameState.career.vacationAvailable;

    if (!isEligibleJob || gameState.career.salaryMonthly <= 0) {
      playErrorSound();
      return { success: false, message: 'Férias remuneradas são exclusivas para trabalhadores formais (CLT/Concursados)!' };
    }

    if (!isEligibleTime) {
      playErrorSound();
      return { success: false, message: `Ainda não completou 12 meses de trabalho acumulados desde as últimas férias (${monthsVacation}/12 meses).` };
    }

    const bonusVacation = Math.round((gameState.career.salaryMonthly || 0) / 3);
    playSuccessSound();
    confetti({ particleCount: 85, spread: 85 });

    setGameState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        grana: prev.stats.grana + bonusVacation,
        energia: 100,
        saudeMental: 100,
        felicidade: Math.min(100, prev.stats.felicidade + 25)
      },
      career: {
        ...prev.career,
        monthsSinceVacation: 0,
        vacationAvailable: false
      },
      logs: [
        {
          id: `vacation_${Date.now()}`,
          year: prev.character.year,
          age: prev.character.age,
          title: '🏖️ Férias Remuneradas Concluídas (30 Dias)',
          description: `Você usufruiu de 30 dias de descanso em ${prev.career.companyOrOrg}! Recebeu o bônus de 1/3 de férias (+R$ ${bonusVacation.toLocaleString('pt-BR')}) e recuperou 100% da Energia e Saúde Mental!`,
          type: 'milestone',
          statDeltas: {
            grana: bonusVacation,
            energia: 100 - prev.stats.energia,
            saudeMental: 100 - (prev.stats.saudeMental || 50),
            felicidade: 25
          }
        },
        ...prev.logs
      ]
    }));

    return {
      success: true,
      message: `🏖️ Férias concedidas! Você recebeu o bônus constitucional de R$ ${bonusVacation.toLocaleString('pt-BR')} (1/3 do salário) e restaurou 100% de Energia e Saúde Mental!`
    };
  };

  const handleApplyJob = (job: JobListing): { success: boolean; message: string } => {
    if (gameState.character.age < 18) return { success: false, message: 'Menores de 18 não podem ter emprego formal.' };

    // Validação Rígida de Faculdade
    const reqMajor = getRequiredMajorForJob(job);
    if (reqMajor) {
      const check = checkPlayerHasRequiredMajor(reqMajor, gameState.career, gameState.educationSystem);
      if (!check.hasDegree) {
        return {
          success: false,
          message: `🚨 Requisito Rígido de Faculdade! A vaga de "${job.title}" exige obrigatoriamente diploma em ${reqMajor}. Você só pode ser admitido se tiver feito essa faculdade!`
        };
      }
    } else if (job.minEducation.includes('Graduação') || job.minEducation.includes('Pós')) {
      const hasAnyDegree = (gameState.educationSystem?.graduatedCourses && gameState.educationSystem.graduatedCourses.length > 0) || gameState.career.collegeStatus === 'formado' || (gameState.career.educationLevel && gameState.career.educationLevel.toLowerCase().includes('graduado'));
      if (!hasAnyDegree) {
        return {
          success: false,
          message: `🚨 Requisito Rígido! A vaga de "${job.title}" exige diploma de Ensino Superior (Graduação). Conclua a faculdade antes de se candidatar!`
        };
      }
    }

    playClickSound();
    setGameState((prev) => {
      const isFirstClt = job.type === 'clt' && !prev.career.hasCarteiraAssinada;
      const prevCtps = prev.career.ctpsHistory || [];
      const updatedCtpsHistory = prev.career.salaryMonthly > 0
        ? [
            ...prevCtps,
            {
              id: `ctps_${Date.now()}`,
              title: prev.career.title,
              companyOrOrg: prev.career.companyOrOrg,
              type: prev.career.type.toUpperCase(),
              salaryMonthly: prev.career.salaryMonthly,
              startYear: prev.career.admissionYear || Math.max(2026, prev.character.year - prev.career.yearsInJob),
              endYear: prev.character.year,
              exitReason: 'Transição de Emprego'
            }
          ]
        : prevCtps;

      const updatedState: GameState = {
        ...prev,
        career: {
          ...prev.career,
          type: job.type,
          title: job.title,
          category: job.category,
          salaryMonthly: job.salaryMonthly,
          companyOrOrg: job.company,
          yearsInJob: 0,
          admissionYear: prev.character.year,
          hasCarteiraAssinada: job.type === 'clt',
          benefits: job.benefits,
          ctpsHistory: updatedCtpsHistory
        },
        logs: [
          {
            id: `job_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: `Contratado(a): ${job.title}`,
            description: `Aprovado(a) na ${job.company} com salário de R$ ${job.salaryMonthly.toLocaleString('pt-BR')}/mês!`,
            type: 'career'
          },
          ...prev.logs
        ]
      };

      if (isFirstClt) {
        confetti({ particleCount: 60, spread: 60 });
        playSuccessSound();
      }

      return checkAchievements(updatedState);
    });
    return { success: true, message: `Contratado(a) com sucesso!` };
  };

  const handleTakeConcurso = (concurso: ConcursoListing): { success: boolean; message: string } => {
    playClickSound();
    const fee = concurso.subscriptionFee;
    const meetsBaseIntellect = gameState.stats.intelecto >= concurso.minIntelectoRequired;
    const roll = Math.random();
    const passed = meetsBaseIntellect && roll < concurso.passProbabilityBonus;

    setGameState((prev) => {
      const newCash = Math.max(0, prev.stats.grana - fee);
      if (passed) {
        playSuccessSound();
        const prevCtps = prev.career.ctpsHistory || [];
        const updatedCtpsHistory = prev.career.salaryMonthly > 0
          ? [
              ...prevCtps,
              {
                id: `ctps_${Date.now()}`,
                title: prev.career.title,
                companyOrOrg: prev.career.companyOrOrg,
                type: prev.career.type.toUpperCase(),
                salaryMonthly: prev.career.salaryMonthly,
                startYear: prev.career.admissionYear || Math.max(2026, prev.character.year - prev.career.yearsInJob),
                endYear: prev.character.year,
                exitReason: 'Posse em Concurso Público'
              }
            ]
          : prevCtps;

        return checkAchievements({
          ...prev,
          stats: { ...prev.stats, grana: newCash, felicidade: Math.min(100, prev.stats.felicidade + 35) },
          career: {
            ...prev.career,
            type: 'concursado',
            title: concurso.title,
            category: 'Setor Público',
            companyOrOrg: concurso.organ,
            salaryMonthly: concurso.salaryMonthly,
            hasCarteiraAssinada: true,
            yearsInJob: 0,
            admissionYear: prev.character.year,
            benefits: concurso.benefits,
            ctpsHistory: updatedCtpsHistory
          },
          logs: [
            { id: `concurso_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Aprovado(a) no Concurso: ${concurso.organ}!`, description: `Tomou posse como ${concurso.title}.`, type: 'career' },
            ...prev.logs
          ]
        });
      } else {
        playErrorSound();
        return {
          ...prev,
          stats: { ...prev.stats, grana: newCash, intelecto: Math.min(100, prev.stats.intelecto + 3) },
          logs: [
            { id: `concurso_fail_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Concurso ${concurso.organ}`, description: `Faltaram alguns pontos na nota.`, type: 'career' },
            ...prev.logs
          ]
        };
      }
    });

    return {
      success: passed,
      message: passed ? `Aprovado no concurso do ${concurso.organ}!` : `Não passou desta vez.`
    };
  };

  const handleRequestPromotion = () => {
    playClickSound();
    if (gameState.career.type === 'desempregado' || gameState.career.salaryMonthly <= 0) {
      playErrorSound();
      return { success: false, message: 'Você precisa estar empregado em um cargo fixo para pedir aumento!' };
    }

    if (gameState.career.yearsInJob < 1) {
      playErrorSound();
      return { 
        success: false, 
        message: 'O chefe olhou sua ficha: "Você tem menos de 1 ano na empresa. Mostre mais serviço e constância antes de pleitear aumento!"' 
      };
    }

    // Avaliação flexível do patrão / diretoria:
    // Critérios: tempo de casa, desempenho (eficiência) e intelecto
    const years = gameState.career.yearsInJob;
    const performance = gameState.career.efficiency ?? 70;
    const intellect = gameState.stats.intelecto;

    // Cálculo de probabilidade flexível (base 25%)
    let chance = 0.25;
    if (performance >= 90) chance += 0.25;
    else if (performance >= 80) chance += 0.15;
    else if (performance < 60) chance -= 0.20;

    if (years >= 3) chance += 0.20;
    else if (years >= 2) chance += 0.10;

    if (intellect >= 80) chance += 0.15;
    else if (intellect >= 60) chance += 0.08;

    // Trava para manter a imprevisibilidade do patrão (máx 75%, mín 10%)
    chance = Math.max(0.10, Math.min(0.75, chance));

    const approved = Math.random() < chance;

    if (approved) {
      playSuccessSound();
      confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
      // Reajuste flexível entre 8% e 15%
      const percentRaise = Math.floor(Math.random() * 8) + 8;
      const raise = Math.round(gameState.career.salaryMonthly * (percentRaise / 100));
      const newSalary = gameState.career.salaryMonthly + raise;

      const approvalPhrases = [
        `O patrão chamou você para uma reunião e elogiou suas entregas: "Você tem sido uma peça fundamental. Aprovado reajuste de ${percentRaise}%!"`,
        `A diretoria avaliou sua ficha e aprovou o aumento salarial de ${percentRaise}% (+R$ ${raise.toLocaleString('pt-BR')})!`,
        `Após revisão das metas do trimestre, o gestor reconheceu seu esforço com uma promoção de ${percentRaise}% no salário!`
      ];
      const desc = approvalPhrases[Math.floor(Math.random() * approvalPhrases.length)];

      setGameState((prev) => ({
        ...prev,
        career: { 
          ...prev.career, 
          salaryMonthly: newSalary,
          efficiency: Math.min(100, (prev.career.efficiency ?? 75) + 5)
        },
        stats: { 
          ...prev.stats, 
          felicidade: Math.min(100, prev.stats.felicidade + 18)
        },
        logs: [
          { 
            id: `promo_${Date.now()}`, 
            year: prev.character.year, 
            age: prev.character.age, 
            title: `Aumento Salarial (${percentRaise}%)! 💼`, 
            description: `Seu salário subiu para R$ ${newSalary.toLocaleString('pt-BR')}/mês (+R$ ${raise.toLocaleString('pt-BR')}).`, 
            type: 'career' 
          },
          ...prev.logs
        ]
      }));

      return { 
        success: true, 
        message: desc, 
        salaryRaise: raise 
      };
    } else {
      playErrorSound();
      const rejectionReasons = [
        'O patrão avaliou o pedido, mas justificou: "O orçamento do departamento está congelado até o próximo ano fiscal."',
        'O chefe chamou para conversar: "Reconheço sua dedicação, mas precisamos bater 90% das metas da equipe antes de qualquer reajuste."',
        'O gestor estava em um dia tenso de reuniões e negou: "Agora não é o momento adequado. Continue trabalhando e conversamos no próximo semestre."',
        'A diretoria indeferiu a solicitação: "O cenário econômico da empresa exige contenção de gastos com folha de pagamento no momento."'
      ];
      const rejection = rejectionReasons[Math.floor(Math.random() * rejectionReasons.length)];

      setGameState((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          felicidade: Math.max(0, prev.stats.felicidade - 6)
        },
        logs: [
          {
            id: `promo_refused_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: 'Pedido de Aumento Negado',
            description: rejection,
            type: 'career'
          },
          ...prev.logs
        ]
      }));

      return { success: false, message: rejection };
    }
  };

  const handleTriggerWorkplaceDilemma = () => {
    playClickSound();
    if (gameState.career.type === 'desempregado' || gameState.career.salaryMonthly <= 0) {
      playErrorSound();
      return { success: false, message: 'Você precisa estar empregado para vivenciar um dilema ético no trabalho!' };
    }
    const workplaceDilemmas = BRAZILIAN_DILEMMAS.filter((d) => d.badge === 'DILEMA ÉTICO DE TRABALHO');
    const chosenDilemma = workplaceDilemmas[Math.floor(Math.random() * workplaceDilemmas.length)];
    setGameState((prev) => ({
      ...prev,
      currentDilemma: chosenDilemma,
      selectedTab: 'historia'
    }));
    return { success: true, message: `💼 Dilema ético do trabalho engajado! Redirecionando para as Decisões!` };
  };

  const handleEnrollCollege = (major: CollegeMajor): { success: boolean; message: string } => {
    if (gameState.character.age < 18) {
      return { success: false, message: 'Menores de 18 anos não podem ingressar no Ensino Superior! Aguarde completar 18 anos.' };
    }
    playClickSound();
    playSuccessSound();
    confetti({ particleCount: 60, spread: 60 });
    setGameState((prev) => ({
      ...prev,
      career: { ...prev.career, collegeMajor: major.name, collegeStatus: 'cursando', collegeSemester: 1 },
      educationSystem: {
        ...(prev.educationSystem || {
          currentStage: 'superior',
          fundamentalYearsDone: 6,
          medioYearsDone: 6,
          superiorYearsDone: 0,
          graduatedCourses: []
        }),
        currentStage: 'superior',
        selectedCollegeCourse: major.name,
        superiorYearsDone: 0
      },
      stats: { ...prev.stats, intelecto: Math.min(100, prev.stats.intelecto + 10) },
      logs: [
        { id: `college_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Matrícula: ${major.name} 🎓`, description: `Começou graduação em ${major.name}!`, type: 'milestone' },
        ...prev.logs
      ]
    }));
    return { success: true, message: `Matrícula confirmada no curso de ${major.name}! 🎓` };
  };

  const handleCollegeAction = (actionType: 'estudar' | 'matar_aula' | 'explicadora' | 'fazer_prova'): { success: boolean; message: string } => {
    playClickSound();
    if (actionType === 'estudar') {
      setGameState((prev) => ({ ...prev, stats: { ...prev.stats, intelecto: Math.min(100, prev.stats.intelecto + 12), energia: Math.max(0, prev.stats.energia - 10) } }));
      return { success: true, message: 'Estudou com foco! (+12 Intelecto)' };
    }

    if (actionType === 'matar_aula') {
      const payCheck = processPayment(40);
      if (!payCheck.success) return { success: false, message: payCheck.message || 'Sem saldo.' };

      setGameState((prev) => deductCost({ ...prev, stats: { ...prev.stats, felicidade: Math.min(100, prev.stats.felicidade + 20), intelecto: Math.max(0, prev.stats.intelecto - 5) } }, 40, payCheck.paidBy));
      return { success: true, message: 'Matou aula com amigos! (+20 Felicidade)' };
    }

    if (actionType === 'explicadora') {
      const payCheck = processPayment(80);
      if (!payCheck.success) return { success: false, message: payCheck.message || 'Sem saldo.' };

      setGameState((prev) => deductCost({ ...prev, stats: { ...prev.stats, intelecto: Math.min(100, prev.stats.intelecto + 25) } }, 80, payCheck.paidBy));
      return { success: true, message: 'Aulas particulares excelentes! (+25 Intelecto)' };
    }

    if (actionType === 'fazer_prova') {
      if (gameState.stats.intelecto < 35) {
        playErrorSound();
        return { success: false, message: 'Nota insuficiente (Intelecto baixo)! Estude mais.' };
      }

      const currentSem = gameState.career.collegeSemester || 1;
      const isFinalSem = currentSem >= 8;

      if (isFinalSem) playSuccessSound();

      setGameState((prev) => ({
        ...prev,
        career: {
          ...prev.career,
          collegeSemester: isFinalSem ? currentSem : currentSem + 1,
          collegeStatus: isFinalSem ? 'formado' : 'cursando',
          educationLevel: isFinalSem ? 'Graduação' : prev.career.educationLevel,
          salaryMonthly: isFinalSem ? prev.career.salaryMonthly + 2500 : prev.career.salaryMonthly
        },
        stats: { ...prev.stats, felicidade: Math.min(100, prev.stats.felicidade + (isFinalSem ? 50 : 20)) },
        logs: [
          { id: `sem_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: isFinalSem ? `GRADUAÇÃO CONCLUÍDA! 🎓` : `Aprovado no ${currentSem}º Semestre!`, description: isFinalSem ? `Diploma em ${prev.career.collegeMajor}!` : `Aprovado no semestre!`, type: 'milestone' },
          ...prev.logs
        ]
      }));

      return {
        success: true,
        message: isFinalSem ? `FORMATURA! Diploma em ${gameState.career.collegeMajor}! 🎓✨` : `Aprovado no ${currentSem}º semestre!`
      };
    }

    return { success: false, message: 'Ação realizada.' };
  };

  const handleRetire = (type: 'inss' | 'privada' | 'misto'): { success: boolean; message: string } => {
    playClickSound();
    if (gameState.character.age < 60) {
      playErrorSound();
      return { success: false, message: `Idade mínima requerida para aposentadoria é de 60 anos (Você tem ${gameState.character.age} anos).` };
    }

    playSuccessSound();
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });

    const totalContribution = gameState.career.totalYearsWorked || gameState.career.yearsInJob || 15;
    const basePension = Math.max(1412, Math.round((gameState.career.salaryMonthly || 3500) * 0.75 + (totalContribution * 60)));
    const finalPension = type === 'misto' ? Math.round(basePension * 1.45) : basePension;
    const pensionLabel = type === 'inss' ? 'Aposentadoria Oficial pelo INSS' : type === 'privada' ? 'Renda de Previdência Privada' : 'Aposentadoria Completa (INSS + Previdência Privada)';

    setGameState((prev) => {
      const prevCtps = prev.career.ctpsHistory || [];
      const updatedCtpsHistory = prev.career.salaryMonthly > 0
        ? [
            ...prevCtps,
            {
              id: `ctps_${Date.now()}`,
              title: prev.career.title,
              companyOrOrg: prev.career.companyOrOrg,
              type: prev.career.type.toUpperCase(),
              salaryMonthly: prev.career.salaryMonthly,
              startYear: prev.career.admissionYear || Math.max(2026, prev.character.year - prev.career.yearsInJob),
              endYear: prev.character.year,
              exitReason: 'Aposentadoria Concedida'
            }
          ]
        : prevCtps;

      return {
        ...prev,
        character: {
          ...prev.character,
          retired: true
        },
        stats: {
          ...prev.stats,
          felicidade: Math.min(100, prev.stats.felicidade + 35),
          energia: Math.min(100, prev.stats.energia + 25)
        },
        career: {
          ...prev.career,
          title: `Aposentado(a) (${type === 'inss' ? 'INSS' : type === 'privada' ? 'Prev. Privada' : 'INSS + Privada'})`,
          salaryMonthly: finalPension,
          pensionMonthly: finalPension,
          retirementType: type,
          ctpsHistory: updatedCtpsHistory
        },
        logs: [
          {
            id: `retire_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: `🎉 ${pensionLabel.toUpperCase()}!`,
            description: `Após ${totalContribution} anos de dedicação e cumprimento da faixa etária (${prev.character.age} anos), seu benefício mensal de R$ ${finalPension.toLocaleString('pt-BR')}/mês foi concedido com êxito!`,
            type: 'milestone',
            statDeltas: { felicidade: 35, energia: 25 }
          },
          ...prev.logs
        ]
      };
    });

    return {
      success: true,
      message: `🎉 Parabéns! Benefício de aposentadoria concedido: R$ ${finalPension.toLocaleString('pt-BR')}/mês!`
    };
  };

  const handleDoSideJob = (jobType: 'vender_suco' | 'bala_sinal' | 'limpar_carro' | 'passear_animais'): { success: boolean; message: string } => {
    playClickSound();
    const energyCost = (jobType === 'limpar_carro' || jobType === 'passear_animais') ? 15 : 10;
    if (gameState.stats.energia < energyCost) {
      playErrorSound();
      return { success: false, message: `⚡ Você está cansado(a) demais (${gameState.stats.energia}% de energia)! Descanse primeiro.` };
    }

    let minEarn = 25;
    let maxEarn = 50;
    let jobName = 'Vender Suco na Praça';
    if (jobType === 'bala_sinal') { minEarn = 20; maxEarn = 40; jobName = 'Vender Balas no Semáforo'; }
    else if (jobType === 'limpar_carro') { minEarn = 35; maxEarn = 70; jobName = 'Limpar Carros'; }
    else if (jobType === 'passear_animais') { minEarn = 40; maxEarn = 80; jobName = 'Passear com Cães'; }

    const earned = Math.floor(Math.random() * (maxEarn - minEarn + 1)) + minEarn;

    playSuccessSound();
    confetti({ particleCount: 35, spread: 50 });

    setGameState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        grana: prev.stats.grana + earned,
        energia: Math.max(0, prev.stats.energia - energyCost),
        felicidade: Math.min(100, prev.stats.felicidade + 6)
      },
      logs: [
        {
          id: `bico_${Date.now()}`,
          year: prev.character.year,
          age: prev.character.age,
          title: `Bico Realizado: ${jobName}`,
          description: `Você trabalhou duro e faturou R$ ${earned} com "${jobName}"! (+R$ ${earned}, -${energyCost}% Energia)`,
          type: 'financial'
        },
        ...prev.logs
      ]
    }));

    return { success: true, message: `🎉 Você faturou R$ ${earned} fazendo o bico de "${jobName}"!` };
  };

  const handleDoWorkAction = (type: string): { success: boolean; message: string } => {
    if (type === 'hora_extra') {
      playCoinSound();
      setGameState((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          grana: prev.stats.grana + 220,
          energia: Math.max(0, prev.stats.energia - 12)
        },
        career: {
          ...prev.career,
          efficiency: Math.min(100, (prev.career.efficiency || 82) + 4)
        },
        logs: [
          {
            id: `ot_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: 'Hora Extra Realizada ⏳',
            description: 'Trabalhou além do expediente. +R$ 220 no orçamento e +4% desempenho.',
            type: 'career'
          },
          ...prev.logs
        ]
      }));
      return { success: true, message: 'Hora extra realizada! +R$ 220 na conta e +4% de desempenho!' };
    }

    if (type === 'papo_chefe') {
      playClickSound();
      setGameState((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          felicidade: Math.min(100, prev.stats.felicidade + 8)
        },
        career: {
          ...prev.career,
          efficiency: Math.min(100, (prev.career.efficiency || 82) + 5)
        },
        logs: [
          {
            id: `talk_boss_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: 'Conversa com a Liderança 💬',
            description: 'Alinhamento produtivo com o chefe. Relação laboral fortalecida!',
            type: 'career'
          },
          ...prev.logs
        ]
      }));
      return { success: true, message: 'Boa conversa com o chefe! Relação laboral fortalecida (+Carisma)!' };
    }

    if (type === 'ideia') {
      const isApproved = Math.random() > 0.35;
      if (isApproved) {
        playSuccessSound();
        setGameState((prev) => ({
          ...prev,
          stats: { ...prev.stats, felicidade: Math.min(100, prev.stats.felicidade + 12) },
          career: { ...prev.career, efficiency: Math.min(100, (prev.career.efficiency || 82) + 10) },
          logs: [
            {
              id: `idea_${Date.now()}`,
              year: prev.character.year,
              age: prev.character.age,
              title: 'Inovação Elogiada! 💡',
              description: 'Sua ideia de melhoria foi acolhida com entusiasmo pela diretoria!',
              type: 'career'
            },
            ...prev.logs
          ]
        }));
        return { success: true, message: 'Sua ideia foi elogiada e adotada pela equipe! +10% de desempenho!' };
      } else {
        setGameState((prev) => ({
          ...prev,
          stats: { ...prev.stats, felicidade: Math.max(0, prev.stats.felicidade - 5) }
        }));
        return { success: false, message: 'A ideia não foi implementada neste trimestre. Tente aprimorá-la!' };
      }
    }

    if (type === 'bico_brigadeiro') {
      const ganho = 60 + Math.floor(Math.random() * 30);
      playCoinSound();
      setGameState((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          grana: prev.stats.grana + ganho,
          energia: Math.max(0, prev.stats.energia - 10)
        },
        logs: [
          {
            id: `bico_brig_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: 'Bico: Brigadeiro no Ponto 🍫',
            description: `Venda de doces artesanais nas paradas de ônibus. Rendeu +R$ ${ganho}!`,
            type: 'financial'
          },
          ...prev.logs
        ]
      }));
      return { success: true, message: `Vendeu brigadeiros artesanais! +R$ ${ganho} faturados no dia!` };
    }

    if (type === 'bico_pc') {
      playCoinSound();
      setGameState((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          grana: prev.stats.grana + 150,
          energia: Math.max(0, prev.stats.energia - 12),
          intelecto: Math.min(100, prev.stats.intelecto + 3)
        },
        logs: [
          {
            id: `bico_pc_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: 'Bico: Montagem de PC Gamer 🔧',
            description: 'Montou e configurou PC para cliente do bairro. Recebeu R$ 150.',
            type: 'financial'
          },
          ...prev.logs
        ]
      }));
      return { success: true, message: 'Montou PC gamer completo com cable management impecável! +R$ 150!' };
    }

    return { success: true, message: 'Ação realizada!' };
  };

  const handleCelebrate = (event: string) => {
    playSuccessSound();
    confetti({ particleCount: 50, spread: 60 });
    setGameState((prev) => ({
      ...prev,
      stats: { ...prev.stats, felicidade: Math.min(100, prev.stats.felicidade + 10) },
      logs: [
        {
          id: `celeb_${Date.now()}`,
          year: prev.character.year,
          age: prev.character.age,
          title: `Celebração: ${event} 🎉`,
          description: `Você comemorou ${event} com entusiasmo! (+10 Felicidade)`,
          type: 'milestone'
        },
        ...prev.logs
      ]
    }));
  };

  const handleResignOrLayoff = (mode: 'pedir_demissao' | 'demissao_sem_justa_causa'): { success: boolean; message: string; severancePay?: number } => {
    playClickSound();
    if (gameState.career.type === 'desempregado') return { success: false, message: 'Você já está desempregado(a).' };

    if (mode === 'pedir_demissao') {
      setGameState((prev) => {
        const prevCtps = prev.career.ctpsHistory || [];
        const updatedCtpsHistory = prev.career.salaryMonthly > 0
          ? [
              ...prevCtps,
              {
                id: `ctps_${Date.now()}`,
                title: prev.career.title,
                companyOrOrg: prev.career.companyOrOrg,
                type: prev.career.type.toUpperCase(),
                salaryMonthly: prev.career.salaryMonthly,
                startYear: prev.career.admissionYear || Math.max(2026, prev.character.year - prev.career.yearsInJob),
                endYear: prev.character.year,
                exitReason: 'Demissão Voluntária'
              }
            ]
          : prevCtps;

        return {
          ...prev,
          career: {
            ...prev.career,
            type: 'desempregado',
            title: 'Em Busca de Oportunidades',
            salaryMonthly: 0,
            companyOrOrg: 'Nenhuma',
            hasCarteiraAssinada: false,
            benefits: [],
            ctpsHistory: updatedCtpsHistory
          },
          logs: [
            { id: `resign_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: 'Pedido de Demissão', description: `Rescindiu contrato voluntariamente.`, type: 'career' },
            ...prev.logs
          ]
        };
      });
      return { success: true, message: 'Você pediu demissão voluntariamente.' };
    } else {
      const fgtsFine = Math.round(gameState.career.fgtsAccumulated * 0.40);
      const noticePay = gameState.career.salaryMonthly;
      const seguroDesemprego = gameState.career.salaryMonthly * 2.5;
      const totalSeverance = gameState.career.fgtsAccumulated + fgtsFine + noticePay + seguroDesemprego;

      playCoinSound();
      setGameState((prev) => {
        const prevCtps = prev.career.ctpsHistory || [];
        const updatedCtpsHistory = prev.career.salaryMonthly > 0
          ? [
              ...prevCtps,
              {
                id: `ctps_${Date.now()}`,
                title: prev.career.title,
                companyOrOrg: prev.career.companyOrOrg,
                type: prev.career.type.toUpperCase(),
                salaryMonthly: prev.career.salaryMonthly,
                startYear: prev.career.admissionYear || Math.max(2026, prev.character.year - prev.career.yearsInJob),
                endYear: prev.character.year,
                exitReason: 'Demissão Sem Justa Causa'
              }
            ]
          : prevCtps;

        return {
          ...prev,
          stats: { ...prev.stats, grana: prev.stats.grana + totalSeverance },
          career: {
            ...prev.career,
            type: 'desempregado',
            title: 'Em Busca de Oportunidades',
            salaryMonthly: 0,
            companyOrOrg: 'Nenhuma',
            hasCarteiraAssinada: false,
            fgtsAccumulated: 0,
            benefits: [],
            ctpsHistory: updatedCtpsHistory
          },
          logs: [
            { id: `layoff_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: 'Demissão Sem Justa Causa', description: `Recebeu acerto completo: R$ ${totalSeverance.toLocaleString('pt-BR')}.`, type: 'financial' },
            ...prev.logs
          ]
        };
      });

      return { success: true, message: `Demissão sem justa causa. Rescisão creditada: R$ ${totalSeverance.toLocaleString('pt-BR')}!`, severancePay: totalSeverance };
    }
  };

  // Bank Handlers
  const handleDepositCDI = (amount: number) => {
    playCoinSound();
    setGameState((prev) => {
      const currentTx = prev.finances.caixinhaTransactions || [];
      const newTx = {
        id: `tx_dep_${Date.now()}`,
        date: new Date().toLocaleDateString('pt-BR'),
        type: 'deposito' as const,
        amount,
        description: 'Depósito na Caixinha'
      };
      return {
        ...prev,
        stats: { ...prev.stats, grana: prev.stats.grana - amount },
        finances: {
          ...prev.finances,
          cdiBalance: prev.finances.cdiBalance + amount,
          caixinhaTransactions: [newTx, ...currentTx]
        }
      };
    });
  };

  const handleWithdrawCDI = (amount: number) => {
    playCoinSound();
    setGameState((prev) => {
      const currentTx = prev.finances.caixinhaTransactions || [];
      const newTx = {
        id: `tx_resg_${Date.now()}`,
        date: new Date().toLocaleDateString('pt-BR'),
        type: 'resgate' as const,
        amount,
        description: 'Resgate para Conta Corrente'
      };
      return {
        ...prev,
        stats: { ...prev.stats, grana: prev.stats.grana + amount },
        finances: {
          ...prev.finances,
          cdiBalance: prev.finances.cdiBalance - amount,
          caixinhaTransactions: [newTx, ...currentTx]
        }
      };
    });
  };

  // Agro Handlers
  const handleArrendarTerra = () => {
    playClickSound();
    const cost = 2000;
    if (gameState.stats.grana < cost) return { success: false, message: 'Saldo insuficiente para arrendar terras (R$ 2.000).' };
    
    playSuccessSound();
    setGameState((prev) => ({
      ...prev,
      stats: { ...prev.stats, grana: prev.stats.grana - cost },
      agro: { 
        ...(prev.agro || {}),
        hasLand: true, 
        isArrendado: true, 
        hectares: prev.agro?.hectares || 50,
        investimentoPerHa: prev.agro?.investimentoPerHa || 800,
        custoTotalSafra: prev.agro?.custoTotalSafra || 40000,
        cattleCount: prev.agro?.cattleCount || 0,
        cultivo: null, 
        cash: 0, 
        debt: 0, 
        nextHarvestYear: prev.character.year + 1 
      }
    }));
    return { success: true, message: 'Terra arrendada com sucesso!' };
  };

  const handlePlant = (cropId: string, level: 'economico' | 'padrao' | 'completo') => {
    playClickSound();
    const cost = level === 'economico' ? 500 : level === 'padrao' ? 1500 : 4000;
    if (gameState.stats.grana < cost) return { success: false, message: 'Saldo insuficiente para custeio.' };
    
    playSuccessSound();
    setGameState((prev) => ({
      ...prev,
      stats: { ...prev.stats, grana: prev.stats.grana - cost },
      agro: { ...prev.agro!, cultivo: level, cash: 0, debt: 0 }
    }));
    return { success: true, message: 'Plantio realizado!' };
  };

  // International Handlers
  const handleMoveAbroad = (city: string) => {
    playClickSound();
    const cityCosts: Record<string, number> = {
      'Lisboa': 8000,
      'Miami': 12000,
      'Tóquio': 15000,
      'Buenos Aires': 5000,
      'Londres': 12000,
      'Paris': 11000,
      'Barcelona': 10000,
      'Dubai': 14000
    };
    const cost = cityCosts[city] || 10000;
    if (gameState.stats.grana < cost) return { success: false, message: 'Saldo insuficiente para a viagem.' };
    
    playSuccessSound();
    setGameState((prev) => ({
      ...prev,
      stats: { ...prev.stats, grana: prev.stats.grana - cost },
      international: {
        isAbroad: true,
        currentCity: city,
        currency: 'USD',
        visaStatus: 'turista',
        daysInCountry: 0
      },
      character: { ...prev.character, currentCity: city }
    }));
    return { success: true, message: `Mudou-se para ${city}!` };
  };

  const handlePayDebt = (debt: Debt) => {
    playClickSound();
    setGameState((prev) => {
      const remainingDebts = prev.serasa.dividas.filter((d) => d.id !== debt.id);
      const isNowClean = remainingDebts.length === 0;
      const newScore = Math.min(1000, prev.serasa.score + 160);

      const updated = {
        ...prev,
        stats: { ...prev.stats, grana: Math.max(0, prev.stats.grana - debt.valorNegociado), felicidade: Math.min(100, prev.stats.felicidade + 25) },
        serasa: { score: newScore, status: isNowClean && newScore >= 500 ? ('bom' as const) : ('negativado' as const), dividas: remainingDebts },
        logs: [
          { id: `debt_paid_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Dívida Quitada: ${debt.credor}`, description: `Quitou pendência no Serasa Limpa Nome!`, type: 'serasa' as const },
          ...prev.logs
        ]
      };

      if (isNowClean) {
        confetti({ particleCount: 80, spread: 80 });
        playSuccessSound();
      }

      return checkAchievements(updated);
    });
  };

  const handlePayCreditCard = () => {
    playCoinSound();
    setGameState((prev) => ({
      ...prev,
      stats: { ...prev.stats, grana: Math.max(0, prev.stats.grana - prev.finances.creditCardUsed) },
      finances: { ...prev.finances, creditCardUsed: 0, creditCard: { ...prev.finances.creditCard, used: 0 } },
      serasa: { ...prev.serasa, score: Math.min(1000, prev.serasa.score + 25) }
    }));
  };

  const handleRequestCreditCard = (tier: 'Básico' | 'Gold' | 'Black', limit: number) => {
    playClickSound();
    if (gameState.character.age < 18) {
      playErrorSound();
      return { success: false, message: 'Menores de 18 anos não podem solicitar cartão de crédito.' };
    }
    if (gameState.career.type === 'desempregado' || gameState.career.salaryMonthly <= 0) {
      playErrorSound();
      return { success: false, message: 'Exige comprovação de renda fixa / emprego formal ou concursado para aprovação do cartão.' };
    }
    const requiredScore = tier === 'Black' ? 820 : tier === 'Gold' ? 650 : 450;
    if (gameState.serasa.score < requiredScore) {
      playErrorSound();
      return { success: false, message: `Serasa Score (${gameState.serasa.score}) insuficiente para o Cartão ${tier}.` };
    }

    playSuccessSound();
    setGameState((prev) => ({
      ...prev,
      finances: { ...prev.finances, creditCardLimit: limit, creditCard: { hasCard: true, tier, limit, used: prev.finances.creditCardUsed } },
      logs: [{ id: `card_approved_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Cartão ${tier} Aprovado!`, description: `Limite de R$ ${limit.toLocaleString('pt-BR')}.`, type: 'financial' }, ...prev.logs]
    }));

    return { success: true, message: `🎉 Cartão ${tier} aprovado com R$ ${limit.toLocaleString('pt-BR')} de limite!` };
  };

  const handleBuyMarketplaceItem = (item: {
    id: string;
    name: string;
    price: number;
    category?: 'eletronico' | 'casa' | 'transporte';
    vehicleType?: 'bicicleta' | 'moto' | 'carro';
    vehicleData?: Vehicle;
    effect?: { felicidade?: number; intelecto?: number; followers?: number };
  }): { success: boolean; message: string } => {
    playClickSound();
    if (gameState.character.age < 18) {
      playErrorSound();
      return { success: false, message: 'Marketplace Online é exclusivo para maiores de 18 anos!' };
    }

    if (item.vehicleType === 'moto') {
      if (!gameState.driverLicense?.hasCategoryA) {
        playErrorSound();
        return { success: false, message: 'Você precisa de CNH Categoria A para pilotar uma moto! Tire sua habilitação no módulo Habilitação (CNH) da aba Mais.' };
      }
    }

    if (item.vehicleType === 'carro') {
      if (!gameState.driverLicense?.hasCategoryB) {
        playErrorSound();
        return { success: false, message: 'Você precisa de CNH Categoria B para dirigir um carro! Tire sua habilitação no módulo Habilitação (CNH) da aba Mais.' };
      }
    }

    const payCheck = processPayment(item.price);
    if (!payCheck.success) return { success: false, message: payCheck.message || 'Saldo insuficiente.' };

    setGameState((prev) => {
      const updated = deductCost(prev, item.price, payCheck.paidBy);
      const currentItems = updated.housing.itemsPurchased || [];
      const updatedHousing = item.category === 'casa'
        ? { ...updated.housing, itemsPurchased: [...currentItems, item.id] }
        : updated.housing;

      const updatedVehicle = item.vehicleData ? item.vehicleData : updated.vehicle;

      const existingInventory = updated.inventory || [];
      const itemEffects = (item as any).effects || (item as any).effect || {};
      const itemCategory = (item as any).category === 'saude' ? 'saude' : (item as any).category === 'consumavel' ? 'consumavel' : 'colecionavel';
      
      const existingIdx = existingInventory.findIndex(i => i.id === item.id || i.name === item.name);
      let updatedInventory = [...existingInventory];
      if (existingIdx >= 0) {
        updatedInventory[existingIdx] = {
          ...updatedInventory[existingIdx],
          quantity: updatedInventory[existingIdx].quantity + 1
        };
      } else {
        updatedInventory.push({
          id: item.id || `inv_${Date.now()}`,
          name: item.name,
          icon: (item as any).icon || '📦',
          category: itemCategory as any,
          quantity: 1,
          description: (item as any).desc || 'Item adquirido no marketplace online',
          effects: itemEffects
        });
      }

      return {
        ...updated,
        housing: updatedHousing,
        vehicle: updatedVehicle,
        inventory: updatedInventory,
        stats: {
          ...updated.stats,
          felicidade: Math.min(100, updated.stats.felicidade + (item.effect?.felicidade || 10)),
          intelecto: Math.min(100, updated.stats.intelecto + (item.effect?.intelecto || 0))
        },
        influencer: item.effect?.followers ? {
          followers: (updated.influencer?.followers || 1000) + item.effect.followers,
          postsCount: updated.influencer?.postsCount || 1,
          totalEarningsFromPublis: updated.influencer?.totalEarningsFromPublis || 0,
          fameLevel: updated.influencer?.fameLevel || 10
        } : updated.influencer,
        logs: [
          { id: `market_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Compra Online: ${item.name}`, description: `Comprou ${item.name} no Marketplace por R$ ${item.price.toLocaleString('pt-BR')}.`, type: 'financial' },
          ...prev.logs
        ]
      };
    });
    return { success: true, message: `Compra de ${item.name} realizada com sucesso! Adicionado à mochila.` };
  };

  const handleUseInventoryItem = (itemId: string): { success: boolean; message: string } => {
    playClickSound();
    const currentInventory = gameState.inventory || [];
    const itemIndex = currentInventory.findIndex(i => i.id === itemId);
    if (itemIndex < 0 || currentInventory[itemIndex].quantity <= 0) {
      return { success: false, message: 'Item não encontrado na mochila!' };
    }

    const item = currentInventory[itemIndex];
    const effects = item.effects || {};

    const deltaEnergia = effects.energia || 0;
    const deltaFelicidade = effects.felicidade || 0;
    const deltaSaude = effects.saude || 0;
    const deltaSaudeMental = effects.saudeMental || 0;

    setGameState((prev) => {
      const inv = prev.inventory || [];
      const idx = inv.findIndex(i => i.id === itemId);
      if (idx < 0) return prev;

      let nextInv = [...inv];
      if (nextInv[idx].quantity > 1) {
        nextInv[idx] = { ...nextInv[idx], quantity: nextInv[idx].quantity - 1 };
      } else {
        nextInv = nextInv.filter(i => i.id !== itemId);
      }

      return {
        ...prev,
        inventory: nextInv,
        stats: {
          ...prev.stats,
          energia: Math.min(100, Math.max(0, prev.stats.energia + deltaEnergia)),
          felicidade: Math.min(100, Math.max(0, prev.stats.felicidade + deltaFelicidade)),
          saude: Math.min(100, Math.max(0, prev.stats.saude + deltaSaude)),
          saudeMental: Math.min(100, Math.max(0, (prev.stats.saudeMental ?? 80) + deltaSaudeMental))
        },
        logs: [
          {
            id: `use_item_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: `🎒 Usou Item: ${item.name}`,
            description: `Consumiu ${item.name} da mochila de inventário.`,
            type: 'health',
            statDeltas: {
              energia: deltaEnergia || undefined,
              felicidade: deltaFelicidade || undefined,
              saude: deltaSaude || undefined,
              saudeMental: deltaSaudeMental || undefined
            }
          },
          ...prev.logs
        ]
      };
    });

    return {
      success: true,
      message: `✨ Usou ${item.name}! (${deltaEnergia ? `+${deltaEnergia}% Energia ` : ''}${deltaFelicidade ? `+${deltaFelicidade}% Feliz ` : ''}${deltaSaudeMental ? `+${deltaSaudeMental}% Saúde Mental ` : ''}${deltaSaude ? `+${deltaSaude}% Saúde` : ''})`
    };
  };

  const handleEarnCNH = (category: 'A' | 'B' | 'AB'): { success: boolean; message: string } => {
    playClickSound();
    if (gameState.character.age < 18) {
      playErrorSound();
      return { success: false, message: 'Apenas maiores de 18 anos podem solicitar a CNH.' };
    }

    const cost = category === 'A' ? 1200 : category === 'B' ? 1800 : 2500;
    const payCheck = processPayment(cost);
    if (!payCheck.success) {
      return { success: false, message: payCheck.message || 'Saldo insuficiente para a taxa da autoescola.' };
    }

    playSuccessSound();
    confetti({ particleCount: 80, spread: 70 });

    setGameState((prev) => {
      const updated = deductCost(prev, cost, payCheck.paidBy);
      const hasA = category === 'A' || category === 'AB' || !!prev.driverLicense?.hasCategoryA;
      const hasB = category === 'B' || category === 'AB' || !!prev.driverLicense?.hasCategoryB;

      return {
        ...updated,
        driverLicense: {
          hasCategoryA: hasA,
          hasCategoryB: hasB,
          issuedAtAge: prev.character.age
        },
        stats: {
          ...updated.stats,
          felicidade: Math.min(100, updated.stats.felicidade + 25),
          intelecto: Math.min(100, updated.stats.intelecto + 10)
        },
        logs: [
          {
            id: `cnh_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: `CNH Categoria ${category} Conquistada! 🪪`,
            description: `Passou com louvor no exame do DETRAN e conquistou sua Habilitação Categoria ${category}!`,
            type: 'milestone'
          },
          ...prev.logs
        ]
      };
    });

    return { success: true, message: `🎉 Habilitação Categoria ${category} emitida com sucesso pelo DETRAN!` };
  };

  const handleTinderMatch = (target: string | FriendMember) => {
    playClickSound();
    const partnerName = typeof target === 'string' ? target : target.name;
    const friendObj: FriendMember = typeof target === 'object' ? target : {
      id: `friend_match_${Date.now()}`,
      name: partnerName,
      gender: Math.random() > 0.5 ? 'F' : 'M',
      age: Math.min(60, Math.max(18, gameState.character.age + Math.floor(Math.random() * 5) - 2)),
      type: 'conhecido',
      affection: 45,
      intimacy: 30,
      job: 'Profissional',
      bio: 'Perfil adicionado via redes / Tinder Tropical'
    };

    if (gameState.character.age < 18) {
      playErrorSound();
      return { success: false, message: 'Você precisa ter pelo menos 18 anos para interagir com contatos do Tinder.' };
    }

    playSuccessSound();
    confetti({ particleCount: 50, spread: 60 });
    setGameState((prev) => {
      const prevFam = prev.family || { parents: [], siblings: [], children: [], friends: [] };
      const friendsList = prevFam.friends || [];
      const existing = friendsList.find(f => f.name === partnerName || (friendObj.id && f.id === friendObj.id));

      if (existing) {
        return {
          ...prev,
          logs: [
            { id: `tinder_exist_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Contato Conhecido: ${partnerName}`, description: `${partnerName} já faz parte da sua lista de contatos!`, type: 'milestone' },
            ...prev.logs
          ]
        };
      }

      const newContact: FriendMember = {
        id: friendObj.id || `friend_match_${Date.now()}`,
        name: friendObj.name,
        gender: friendObj.gender || (Math.random() > 0.5 ? 'F' : 'M'),
        age: friendObj.age || Math.min(60, Math.max(18, prev.character.age)),
        type: 'conhecido',
        affection: friendObj.affection || 45,
        intimacy: friendObj.intimacy || 30,
        job: friendObj.job || 'Profissional',
        bio: friendObj.bio || 'Adicionado(a) à agenda de contatos',
        patrimonio: friendObj.patrimonio || 'Classe Média'
      };

      return {
        ...prev,
        stats: {
          ...prev.stats,
          felicidade: Math.min(100, prev.stats.felicidade + 12)
        },
        family: {
          ...prevFam,
          friends: [...friendsList, newContact]
        },
        logs: [
          { id: `tinder_add_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Novo Contato: ${partnerName} 👤`, description: `Deu match / seguiu no Insta! ${partnerName} foi adicionado(a) à sua lista de conhecidos.`, type: 'milestone' },
          ...prev.logs
        ]
      };
    });

    return { success: true, message: `✨ ${partnerName} foi adicionado(a) à sua lista de conhecidos! Chama pra sair/café na aba Família & Amigos!` };
  };

  const handleCancelCreditCard = () => {
    playClickSound();
    if (gameState.finances.creditCardUsed > 0) {
      playErrorSound();
      return { success: false, message: 'Quite a fatura pendente antes de cancelar o cartão.' };
    }

    setGameState((prev) => ({
      ...prev,
      finances: { ...prev.finances, creditCardLimit: 0, creditCard: { hasCard: false, tier: 'Nenhum', limit: 0, used: 0 } },
      logs: [{ id: `card_canceled_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: 'Cartão Cancelado', description: `Cartão cancelado.`, type: 'financial' }, ...prev.logs]
    }));

    return { success: true, message: 'Cartão de crédito cancelado.' };
  };

  const handlePlayMegaSena = (numbers: number[]) => {
    playClickSound();
    const drawnSet = new Set<number>();
    while (drawnSet.size < 6) {
      drawnSet.add(Math.floor(Math.random() * 60) + 1);
    }
    const drawnNumbers = Array.from(drawnSet).sort((a, b) => a - b);
    const matches = numbers.filter((n) => drawnSet.has(n));

    let prize = 0;
    if (matches.length === 6) prize = 35000000;
    else if (matches.length === 5) prize = 45000;
    else if (matches.length === 4) prize = 950;

    if (prize > 0) playCoinSound();

    setGameState((prev) => {
      const updated = {
        ...prev,
        stats: { ...prev.stats, grana: prev.stats.grana - 5 + prize, felicidade: prize > 0 ? Math.min(100, prev.stats.felicidade + 40) : prev.stats.felicidade },
        logs: prize > 0
          ? [{ id: `lottery_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Prêmio na Mega-Sena: R$ ${prize.toLocaleString('pt-BR')}!`, description: `Acertou ${matches.length} dezenas!`, type: 'financial' as const }, ...prev.logs]
          : prev.logs
      };

      return checkAchievements(updated);
    });

    return { matches, prize, drawnNumbers };
  };

  // Activities & Assets Handlers
  const handleDoActivity = (activity: Activity, companion?: string, transport?: string, customCost?: number): { success: boolean; message: string } => {
    playClickSound();
    const cost = customCost !== undefined ? customCost : activity.cost;
    if (gameState.stats.grana < cost) {
      playErrorSound();
      return { success: false, message: 'Saldo insuficiente.' };
    }

    setGameState((prev) => {
      const eff = activity.effects;
      let extraHappy = 0;
      let extraAffection = 0;
      let compName = 'sozinho(a)';
      if (companion === 'patricia') {
        extraHappy = 15;
        extraAffection = 35;
        compName = prev.relationship.partnerName || 'Patrícia';
      } else if (companion === 'amigos') {
        extraHappy = 20;
        compName = 'com o bonde de amigos';
      } else if (companion === 'pais') {
        extraHappy = 15;
        compName = 'com os pais';
      }

      return {
        ...prev,
        stats: {
          ...prev.stats,
          grana: prev.stats.grana - cost,
          felicidade: Math.min(100, Math.max(0, prev.stats.felicidade + (eff.felicidade || 15) + extraHappy)),
          saude: Math.min(100, Math.max(0, prev.stats.saude + (eff.saude || 0))),
          energia: Math.min(100, Math.max(0, prev.stats.energia + (eff.energia || -5))),
          intelecto: Math.min(100, Math.max(0, prev.stats.intelecto + (eff.intelecto || 0))),
          saudeMental: Math.min(100, Math.max(0, (prev.stats.saudeMental ?? 85) + (eff.saudeMental || (eff.felicidade ? Math.round(eff.felicidade / 2) : 5))))
        },
        relationship: {
          ...prev.relationship,
          affection: companion === 'patricia' ? Math.min(100, prev.relationship.affection + extraAffection) : prev.relationship.affection
        },
        logs: [{ id: `act_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `${activity.name} (${compName})`, description: `${activity.description} Rolê realizado com sucesso!`, type: 'fun' }, ...prev.logs]
      };
    });

    return { success: true, message: `Rolê inesquecível: ${activity.name}! 🌟` };
  };

  const handleBuyHomeItem = (item: HomeItem) => {
    playClickSound();
    const executeBuy = (method: 'vista' | 'cartao') => {
      setGameState((prev) => {
        const stateAfterPay = deductCost(prev, item.price, method);
        const currentItems = prev.housing.itemsPurchased || [];
        return {
          ...stateAfterPay,
          stats: { ...stateAfterPay.stats, felicidade: Math.min(100, stateAfterPay.stats.felicidade + item.happinessBonus) },
          housing: { ...stateAfterPay.housing, itemsPurchased: [...currentItems, item.id] },
          logs: [{ id: `item_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Item Comprado: ${item.name}`, description: `Adquiriu ${item.name} (${method === 'cartao' ? 'Cartão de Crédito' : 'À Vista'}).`, type: 'milestone' }, ...prev.logs]
        };
      });
    };

    if (item.price > 500) {
      setPurchaseModalState({
        isOpen: true,
        title: item.name,
        cost: item.price,
        onConfirm: executeBuy
      });
      return { success: true, message: `Escolha a forma de pagamento no modal.` };
    }

    const payCheck = processPayment(item.price);
    if (!payCheck.success) return { success: false, message: payCheck.message || 'Saldo insuficiente.' };
    executeBuy(payCheck.paidBy === 'cartao' ? 'cartao' : 'vista');
    return { success: true, message: `Você comprou ${item.name}!` };
  };

  const handlePerformRenovation = (renov: HomeRenovation) => {
    playClickSound();
    const executeRenov = (method: 'vista' | 'cartao') => {
      setGameState((prev) => {
        const stateAfterPay = deductCost(prev, renov.price, method);
        const currentRenovs = prev.housing.renovationsCompleted || [];
        return {
          ...stateAfterPay,
          stats: { ...stateAfterPay.stats, felicidade: Math.min(100, stateAfterPay.stats.felicidade + renov.happinessBonus) },
          housing: { ...stateAfterPay.housing, renovationsCompleted: [...currentRenovs, renov.id], propertyValue: prev.housing.propertyValue + Math.round(renov.price * 1.2) },
          logs: [{ id: `renov_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Reforma: ${renov.name}`, description: `Reforma finalizada (${method === 'cartao' ? 'Cartão de Crédito' : 'À Vista'}).`, type: 'milestone' }, ...prev.logs]
        };
      });
    };

    if (renov.price > 500) {
      setPurchaseModalState({
        isOpen: true,
        title: renov.name,
        cost: renov.price,
        onConfirm: executeRenov
      });
      return { success: true, message: `Escolha a forma de pagamento no modal.` };
    }

    if (gameState.stats.grana < renov.price) {
      playErrorSound();
      return { success: false, message: 'Saldo insuficiente para a reforma.' };
    }
    executeRenov('vista');
    return { success: true, message: `Reforma concluída: ${renov.name}!` };
  };

  const handleDoHomeAction = (actionType: string) => {
    playClickSound();
    if (actionType === 'arrumar_quarto') {
      setGameState((prev) => ({ ...prev, stats: { ...prev.stats, energia: Math.min(100, prev.stats.energia + 5), felicidade: Math.min(100, prev.stats.felicidade + 5) } }));
      return { success: true, message: 'Quarto arrumado e organizado! (+5 Energia, +5 Felicidade)' };
    }
    if (actionType === 'maratona_serie') {
      setGameState((prev) => ({ ...prev, stats: { ...prev.stats, felicidade: Math.min(100, prev.stats.felicidade + 12), energia: Math.min(100, prev.stats.energia + 5) } }));
      return { success: true, message: 'Maratona de série deliciosa no sofá com pipoca! (+12 Felicidade)' };
    }
    if (actionType === 'cozinhar_gourmet') {
      if (gameState.stats.grana < 60) return { success: false, message: 'Saldo insuficiente para ingredientes (R$ 60).' };
      setGameState((prev) => ({ ...prev, stats: { ...prev.stats, grana: prev.stats.grana - 60, felicidade: Math.min(100, prev.stats.felicidade + 18), intelecto: Math.min(100, prev.stats.intelecto + 8) } }));
      return { success: true, message: 'Cozinhou um jantar gourmet digno de chef! (+18 Felicidade, +8 Intelecto)' };
    }
    if (actionType === 'jardinagem') {
      if (gameState.stats.grana < 30) return { success: false, message: 'Saldo insuficiente para mudas/adubo (R$ 30).' };
      setGameState((prev) => ({ ...prev, stats: { ...prev.stats, grana: prev.stats.grana - 30, felicidade: Math.min(100, prev.stats.felicidade + 15), saude: Math.min(100, prev.stats.saude + 10) } }));
      return { success: true, message: 'Cuidou do jardim e das mudas de plantas! (+15 Felicidade, +10 Saúde)' };
    }
    if (actionType === 'jogar_videogame') {
      setGameState((prev) => ({ ...prev, stats: { ...prev.stats, felicidade: Math.min(100, prev.stats.felicidade + 20), energia: Math.max(0, prev.stats.energia - 5) } }));
      return { success: true, message: 'Partida épica de videogame online com amigos! (+20 Felicidade)' };
    }
    if (actionType === 'treino_casa') {
      setGameState((prev) => ({ ...prev, stats: { ...prev.stats, saude: Math.min(100, prev.stats.saude + 15), energia: Math.min(100, prev.stats.energia + 10) } }));
      return { success: true, message: 'Treino funcional e calistenia na sala! (+15 Saúde, +10 Energia)' };
    }
    if (actionType === 'ler_livro') {
      setGameState((prev) => ({ ...prev, stats: { ...prev.stats, intelecto: Math.min(100, prev.stats.intelecto + 15), felicidade: Math.min(100, prev.stats.felicidade + 10) } }));
      return { success: true, message: 'Leitura enriquecedora de livro no sofá! (+15 Intelecto, +10 Felicidade)' };
    }
    if (actionType === 'reparo_diy') {
      if (gameState.stats.grana < 80) return { success: false, message: 'Saldo insuficiente para ferramentas/peças (R$ 80).' };
      setGameState((prev) => ({ ...prev, stats: { ...prev.stats, grana: prev.stats.grana - 80, intelecto: Math.min(100, prev.stats.intelecto + 15), felicidade: Math.min(100, prev.stats.felicidade + 12) } }));
      return { success: true, message: 'Fez reparos e manutenção no lar com sucesso! (+15 Intelecto, +12 Felicidade)' };
    }
    if (actionType === 'almoco_familia') {
      if (gameState.stats.grana < 120) return { success: false, message: 'Saldo insuficiente (R$ 120).' };
      setGameState((prev) => ({ ...prev, stats: { ...prev.stats, grana: prev.stats.grana - 120, felicidade: Math.min(100, prev.stats.felicidade + 15) }, relationship: { ...prev.relationship, affection: Math.min(100, prev.relationship.affection + 10) } }));
      return { success: true, message: 'Almoço em família maravilhoso!' };
    }
    if (actionType === 'festa_casa') {
      if (gameState.stats.grana < 250) return { success: false, message: 'Saldo insuficiente (R$ 250).' };
      setGameState((prev) => ({ ...prev, stats: { ...prev.stats, grana: prev.stats.grana - 250, felicidade: Math.min(100, prev.stats.felicidade + 22), energia: Math.max(0, prev.stats.energia - 10) } }));
      return { success: true, message: 'Festa inesquecível em casa!' };
    }
    return { success: false, message: 'Ação realizada.' };
  };

  const handleMaintainVehicle = (action: VehicleCustomization) => {
    playClickSound();
    if (gameState.stats.grana < action.price) return { success: false, message: 'Saldo insuficiente.' };
    setGameState((prev) => ({
      ...prev,
      stats: { ...prev.stats, grana: prev.stats.grana - action.price, felicidade: Math.min(100, prev.stats.felicidade + action.happinessBonus) },
      logs: [{ id: `veh_care_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Manutenção: ${action.name}`, description: `Serviço realizado.`, type: 'milestone' }, ...prev.logs]
    }));
    return { success: true, message: `Manutenção realizada: ${action.name}!` };
  };

  const handleBuyVehicle = (veh: Vehicle) => {
    playClickSound();
    const executeVehBuy = (method: 'vista' | 'cartao') => {
      setGameState((prev) => {
        const stateAfterPay = deductCost(prev, veh.value, method);
        const updated = {
          ...stateAfterPay,
          vehicle: veh,
          stats: { ...stateAfterPay.stats, felicidade: Math.min(100, stateAfterPay.stats.felicidade + 25) },
          logs: [{ id: `veh_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Comprou: ${veh.name}`, description: `Adquiriu ${veh.name} (${method === 'cartao' ? 'Cartão de Crédito' : 'À Vista'}).`, type: 'milestone' as const }, ...prev.logs]
        };
        return checkAchievements(updated);
      });
    };

    if (veh.value > 500) {
      setPurchaseModalState({
        isOpen: true,
        title: veh.name,
        cost: veh.value,
        onConfirm: executeVehBuy
      });
    } else {
      executeVehBuy('vista');
    }
  };

  const handleChangeHousing = (hou: Housing) => {
    playClickSound();
    const costToPay = hou.propertyValue > 0 ? hou.propertyValue : (hou.type === 'aluguel' ? hou.monthlyCost * 2 : 0);
    const executeHouseChange = (method: 'vista' | 'cartao') => {
      setGameState((prev) => {
        const stateAfterPay = costToPay > 0 ? deductCost(prev, costToPay, method) : prev;
        return {
          ...stateAfterPay,
          housing: hou,
          logs: [{ id: `house_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Nova Moradia: ${hou.name}`, description: `Mudou de residência (${method === 'cartao' ? 'Cartão de Crédito' : 'À Vista'}).`, type: 'milestone' }, ...prev.logs]
        };
      });
    };

    if (costToPay > 500) {
      setPurchaseModalState({
        isOpen: true,
        title: `Moradia: ${hou.name}`,
        cost: costToPay,
        onConfirm: executeHouseChange
      });
    } else {
      executeHouseChange('vista');
    }
  };

  const handleResolveConflict = (conflict: NeighborhoodConflict, option: ConflictOption): { success: boolean; message: string } => {
    playClickSound();
    if (option.cost > 0) {
      const payCheck = processPayment(option.cost);
      if (!payCheck.success) return { success: false, message: payCheck.message || 'Saldo insuficiente!' };
      setGameState((prev) => deductCost(prev, option.cost, payCheck.paidBy));
    }

    setGameState((prev) => ({
      ...prev,
      stats: { ...prev.stats, felicidade: Math.min(100, Math.max(0, prev.stats.felicidade + option.happinessDelta)) },
      serasa: { ...prev.serasa, score: Math.min(1000, Math.max(0, prev.serasa.score + option.socialScoreDelta)) },
      logs: [{ id: `conf_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Conflito: ${conflict.title}`, description: option.outcomeNarrative, type: 'milestone' }, ...prev.logs]
    }));

    return { success: true, message: `Conflito resolvido! ${option.outcomeNarrative}` };
  };

  // Family & Relationship Handlers
  const handleUpdateAffection = (
    target: 'parent' | 'sibling' | 'partner' | 'pet' | 'child',
    memberName: string,
    delta: number
  ) => {
    setGameState((prev) => {
      if (target === 'partner') {
        return { ...prev, relationship: { ...prev.relationship, affection: Math.min(100, Math.max(0, prev.relationship.affection + delta)) } };
      }
      const prevFam = prev.family || { parents: [], siblings: [], children: [] };
      if (target === 'parent') {
        return {
          ...prev,
          family: {
            ...prevFam,
            parents: (prevFam.parents || []).map((p) => p.name === memberName ? { ...p, affection: Math.min(100, Math.max(0, p.affection + delta)) } : p)
          }
        };
      }
      if (target === 'sibling') {
        return {
          ...prev,
          family: {
            ...prevFam,
            siblings: (prevFam.siblings || []).map((s) => s.name === memberName ? { ...s, affection: Math.min(100, Math.max(0, s.affection + delta)) } : s)
          }
        };
      }
      if (target === 'child') {
        return {
          ...prev,
          family: {
            ...prevFam,
            children: (prevFam.children || []).map((c) => c.name === memberName ? { ...c, affection: Math.min(100, Math.max(0, c.affection + delta)) } : c)
          }
        };
      }
      return prev;
    });
  };

  const onRequestFamilyMoney = (memberName: string): { success: boolean; message: string; amount?: number } => {
    const familyClass = gameState.character.familyClass;
    let baseAmount = 150;
    if (familyClass === 'Média-Alta') baseAmount = 350;
    if (familyClass === 'Rica (Elite)') baseAmount = 1000;
    if (familyClass === 'Baixa (Periferia)') baseAmount = 80;

    const prevFam = gameState.family || { parents: [], siblings: [], children: [] };
    const allMembers = [...(prevFam.parents || []), ...(prevFam.siblings || [])];
    const target = allMembers.find((m) => m.name === memberName);
    const targetAffection = target ? target.affection : 70;

    if (targetAffection < 40) {
      playErrorSound();
      setGameState((prev) => {
        const pf = prev.family || { parents: [], siblings: [], children: [] };
        return {
          ...prev,
          family: {
            ...pf,
            parents: (pf.parents || []).map((p) => p.name === memberName ? { ...p, affection: Math.max(0, p.affection - 8) } : p),
            siblings: (pf.siblings || []).map((s) => s.name === memberName ? { ...s, affection: Math.max(0, s.affection - 8) } : s)
          },
          logs: [
            {
              id: `fam_money_refused_${Date.now()}`,
              year: prev.character.year,
              age: prev.character.age,
              title: `Pedido Recusado por ${memberName}`,
              description: `${memberName} se recusou a emprestar dinheiro: "Você não me dá atenção e só me procura para pedir grana!" (-8 Afeto)`,
              type: 'financial'
            },
            ...prev.logs
          ]
        };
      });
      return { success: false, message: `${memberName} recusou te emprestar dinheiro! "Só me procura para pedir grana?!" (-8 Afeto)` };
    }

    playCoinSound();
    setGameState((prev) => {
      const pf = prev.family || { parents: [], siblings: [], children: [] };
      return {
        ...prev,
        stats: { ...prev.stats, grana: prev.stats.grana + baseAmount, felicidade: Math.min(100, prev.stats.felicidade + 10) },
        family: {
          ...pf,
          parents: (pf.parents || []).map((p) => p.name === memberName ? { ...p, affection: Math.min(100, p.affection + 5) } : p),
          siblings: (pf.siblings || []).map((s) => s.name === memberName ? { ...s, affection: Math.min(100, s.affection + 5) } : s)
        },
        logs: [
          {
            id: `fam_money_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: `Ajuda da Família`,
            description: `${memberName} enviou R$ ${baseAmount} via PIX! (+5 Afeto)`,
            type: 'financial'
          },
          ...prev.logs
        ]
      };
    });

    return { success: true, message: `${memberName} te enviou R$ ${baseAmount}! "Tamo junto!" (+5 Afeto) 💰`, amount: baseAmount };
  };

  const handleAddRandomFriend = () => {
    playClickSound();
    const isFemale = Math.random() > 0.5;
    const name = getRandomName(isFemale ? 'F' : 'M');
    const newFriend: FriendMember = {
      id: `friend_${Date.now()}`,
      name,
      age: 18 + Math.floor(Math.random() * 15),
      gender: isFemale ? 'F' : 'M',
      type: 'conhecido',
      affection: 25 + Math.floor(Math.random() * 10),
      intimacy: 10 + Math.floor(Math.random() * 10),
      job: getRandomJob(),
      bio: 'Pessoa simpática que conheceu recentemente em rolês e redes sociais.',
      metAt: 'Apresentado por conhecidos / Redes Sociais',
      interactionHistory: [
        {
          id: `int_init_${Date.now()}`,
          action: 'Troca de Contatos',
          description: `Você e ${name} se conheceram e trocaram contatos.`,
          deltaAffection: 25,
          date: `Ano ${gameState.character.year}`,
          timestamp: Date.now()
        }
      ]
    };

    setGameState((prev) => {
      const prevFam = prev.family || { parents: [], siblings: [], children: [], friends: [] };
      return {
        ...prev,
        family: {
          ...prevFam,
          friends: [...(prevFam.friends || []), newFriend]
        },
        logs: [
          {
            id: `log_friend_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: `Novo Contato Adicionado! 🤝`,
            description: `Você conheceu ${name} e adicionou aos seus contatos.`,
            type: 'milestone'
          },
          ...prev.logs
        ]
      };
    });
    playSuccessSound();
    confetti({ particleCount: 30, spread: 50 });
    return { success: true, message: `Você fez amizade com ${name}! Contato adicionado.` };
  };

  const handleFriendAction = (friendId: string, actionType: string) => {
    playClickSound();
    let affectionDelta = 10;
    let intimacyDelta = 10;
    let msg = '';
    let cost = 0;
    let discoveredBetrayal = false;
    let newFriendType: 'amigo' | 'amante' | 'ficante' | 'ex' | 'conhecido' | 'melhor_amigo' | null = null;
    let targetHadAcceptedRecaida: boolean | null = null;
    let unplannedChildCreated: ChildMember | null = null;

    // Age Validation: Flirting and ficante starting from age 16+
    const isFlirtOrFicante = (actionType === 'flertar' || actionType === 'romance');
    if (isFlirtOrFicante && gameState.character.age < 16) {
      playErrorSound();
      return {
        success: false,
        message: `Flertar e ter ficante é permitido apenas a partir dos 16 anos! (Sua idade: ${gameState.character.age} anos).`
      };
    }

    // Age Validation: Amante / lover actions starting from age 18+ (married or not)
    const isLoverAction = (
      actionType === 'motel_secreto' ||
      actionType === 'viagem_secreta' ||
      actionType === 'mensagem_provocante' ||
      actionType === 'presente_caro'
    );
    if (isLoverAction && gameState.character.age < 18) {
      playErrorSound();
      return {
        success: false,
        message: `Ações com amante são permitidas apenas a partir dos 18 anos! (Sua idade: ${gameState.character.age} anos).`
      };
    }

    // Check cash upfront for paid actions
    if (actionType === 'barzinho' && gameState.stats.grana < 45) {
      return { success: false, message: 'Você precisa de pelo menos R$ 45 para pagar a rodada no barzinho!' };
    }
    if (actionType === 'motel_secreto' && gameState.stats.grana < 120) {
      return { success: false, message: 'Você precisa de R$ 120 para a suíte no motel secreto com banheira!' };
    }
    if (actionType === 'presente_caro' && gameState.stats.grana < 250) {
      return { success: false, message: 'Você precisa de R$ 250 para comprar joia / perfume importado!' };
    }
    if (actionType === 'viagem_secreta' && gameState.stats.grana < 600) {
      return { success: false, message: 'Você precisa de R$ 600 para a pousada sigilosa no litoral / serra!' };
    }

    setGameState((prev) => {
      const prevFam = prev.family || { parents: [], siblings: [], children: [], friends: [] };
      const friends = prevFam.friends || [];
      const targetFriend = friends.find((f) => f.id === friendId);
      if (!targetFriend) return prev;

      let newRel = { ...prev.relationship };

      // SPECIFIC ACTIONS
      switch (actionType) {
        // Conhecido / Amigo
        case 'cafe_conhecido':
        case 'sair_cafe':
          cost = 20;
          affectionDelta = 20;
          intimacyDelta = 15;
          msg = `Você convidou ${targetFriend.name} para um café aconchegante em Pinheiros e conversou sobre a vida. (+20 Afeto, +15 Intimidade, -R$ 20)`;
          if (targetFriend.type === 'conhecido' && targetFriend.affection + affectionDelta >= 35) {
            newFriendType = 'amigo';
            msg += ` ☕ O papo fluiu tanto que vocês se tornaram Amigos!`;
          }
          break;

        case 'bater_papo':
        case 'social':
          affectionDelta = 12;
          intimacyDelta = 8;
          msg = `Você trocou uma ideia descontraída e contou sobre sua rotina para ${targetFriend.name}. (+12 Afeto, +8 Intimidade)`;
          if (targetFriend.type === 'conhecido' && targetFriend.affection + affectionDelta >= 40) {
            newFriendType = 'amigo';
            msg += ` 🎉 O vínculo evoluiu: ${targetFriend.name} agora é seu Amigo(a)!`;
          }
          break;

        case 'pedir_instagram':
          affectionDelta = 15;
          intimacyDelta = 12;
          msg = `Você seguiu ${targetFriend.name} no Instagram e reagiu aos stories! (+15 Afeto, +12 Intimidade)`;
          if (targetFriend.type === 'conhecido' && targetFriend.affection + affectionDelta >= 35) {
            newFriendType = 'amigo';
            msg += ` 📱 Vocês agora se falam com frequência nas redes sociais!`;
          }
          break;

        case 'barzinho':
          cost = 45;
          affectionDelta = 22;
          intimacyDelta = 20;
          msg = `Vocês foram a um boteco tomar cerveja artesanal e comer porção de coxinha com ${targetFriend.name}! (+22 Afeto, +20 Intimidade, -R$ 45)`;
          if (targetFriend.type === 'conhecido') {
            newFriendType = 'amigo';
            msg += ` 🍻 Vocês viraram grandes parceiros de rolê!`;
          }
          break;

        case 'pedir_favor':
          if (targetFriend.affection < 40) {
            return {
              ...prev,
              logs: [
                {
                  id: `log_f_act_${Date.now()}`,
                  year: prev.character.year,
                  age: prev.character.age,
                  title: `Pedido Recusado`,
                  description: `${targetFriend.name} disse que mal te conhece para quebrar esse galho!`,
                  type: 'milestone'
                },
                ...prev.logs
              ]
            };
          }
          affectionDelta = 5;
          intimacyDelta = 15;
          msg = `${targetFriend.name} te quebrou um galho valioso com indicações e contatos! (+15 Intimidade)`;
          break;

        // Ficante / Flerte
        case 'flertar':
        case 'romance':
          affectionDelta = 20;
          intimacyDelta = 25;
          msg = `Você jogou charme, soltou olhares e flertou intensamente com ${targetFriend.name}. (+20 Afeto, +25 Intimidade)`;
          if (targetFriend.type === 'conhecido' || targetFriend.type === 'amigo') {
            if (prev.relationship.status === 'namorando' || prev.relationship.status === 'casado') {
              newFriendType = 'amante';
              msg += ` 🤫 O clima esquentou e ${targetFriend.name} passou a ser seu caso secreto (Amante)!`;
            } else {
              newFriendType = 'ficante';
              msg += ` 💋 Vocês deram um beijo cinematográfico e viraram ficantes!`;
            }
          }
          break;

        // Amante / Intimidade
        case 'motel_secreto':
          cost = 120;
          affectionDelta = 35;
          intimacyDelta = 45;
          msg = `Encontro sigiloso num motel discreto com direito a hidromassagem e espumante com ${targetFriend.name}! (+35 Afeto, +45 Intimidade, -R$ 120)`;
          newFriendType = 'amante';
          break;

        case 'mensagem_provocante':
          affectionDelta = 18;
          intimacyDelta = 30;
          msg = `Você mandou uma foto misteriosa e mensagens quentes no WhatsApp no modo 'visualização única' para ${targetFriend.name}! 🔥 (+18 Afeto, +30 Intimidade)`;
          break;

        case 'presente_caro':
          cost = 250;
          affectionDelta = 45;
          intimacyDelta = 25;
          msg = `Você presenteou ${targetFriend.name} com um perfume francês de grife! Olhos brilhando de paixão. (+45 Afeto, -R$ 250)`;
          break;

        case 'viagem_secreta':
          cost = 600;
          affectionDelta = 50;
          intimacyDelta = 50;
          msg = `Final de semana sigiloso numa pousada aconchegante nas montanhas com ${targetFriend.name}. Cumplicidade nas alturas! (+50 Afeto, +50 Intimidade, -R$ 600)`;
          newFriendType = 'amante';
          break;

        case 'terminar_caso':
          affectionDelta = -50;
          intimacyDelta = -30;
          msg = `Você conversou com ${targetFriend.name} e colocou fim ao caso extraconjugal. O clima ficou tenso e ressentido.`;
          newFriendType = 'ex';
          break;

        case 'sexual':
          affectionDelta = 30;
          intimacyDelta = 40;
          msg = `Você teve um momento íntimo ardente e inesquecível com ${targetFriend.name}. (+30 Afeto, +40 Intimidade)`;
          if (prev.relationship.status === 'namorando' || prev.relationship.status === 'casado') {
            newFriendType = 'amante';
          } else if (targetFriend.type !== 'ex') {
            newFriendType = 'ficante';
          }
          break;

        // Ex-parceiro(a) & Recaída
        case 'relembrar_passado':
          affectionDelta = 15;
          intimacyDelta = 20;
          msg = `Vocês relembraram momentos felizes do passado e riram de fotos antigas com ${targetFriend.name}. (+15 Afeto, +20 Intimidade)`;
          break;

        case 'conversar_passado_ex':
          affectionDelta = 20;
          intimacyDelta = 20;
          msg = `Vocês tiveram uma conversa madura e limparam ressentimentos antigos. Um abraço de paz com ${targetFriend.name}! (+20 Afeto, +15 Saúde Mental)`;
          break;

        case 'mensagem_noite_ex': {
          if (targetFriend.affection >= 30) {
            affectionDelta = 12;
            intimacyDelta = 20;
            msg = `${targetFriend.name} respondeu sua mensagem de madrugada: "Também sinto sua falta às vezes..." (+12 Afeto, +20 Intimidade)`;
          } else {
            affectionDelta = -8;
            intimacyDelta = -5;
            msg = `${targetFriend.name} visualizou sua mensagem de saudade tarde da noite e te deixou no vácuo... (-8 Afeto)`;
          }
          break;
        }

        case 'discutir_termino_ex':
          affectionDelta = -22;
          intimacyDelta = -15;
          msg = `Vocês lavaram roupa suja sobre os erros do término e a conversa acabou em bate-boca amargo com ${targetFriend.name}! (-22 Afeto, -15 Felicidade)`;
          break;

        case 'devolver_pertences_ex':
          affectionDelta = 12;
          intimacyDelta = 10;
          msg = `Vocês se encontraram rapidamente para devolver pertences e roupas que ficaram na casa um do outro. Relação civilizada! (+12 Afeto)`;
          break;

        case 'recaida': {
          // O ex pode aceitar ou negar a recaída conforme o nível de afeto e química
          const acceptProbability = targetFriend.affection >= 60 ? 0.85 : targetFriend.affection >= 30 ? 0.55 : 0.20;
          const exAcceptedRecaida = Math.random() < acceptProbability;

          if (!exAcceptedRecaida) {
            affectionDelta = -10;
            intimacyDelta = -5;
            msg = `❌ Recaída Recusada! ${targetFriend.name} disse friamente: "Você me machucou demais no passado e não vou cair nessa de novo. Passado é passado, me deixa em paz!" (-10 Afeto, -5 Felicidade)`;
            break;
          }

          // Recaída Aceita por ambos!
          cost = 60;
          affectionDelta = 35;
          intimacyDelta = 45;
          targetHadAcceptedRecaida = true;
          msg = `🔥 RECAÍDA ACEITA! ${targetFriend.name} não resistiu à saudade e aceitou o convite: "Só por hoje... não se acostume!" Vocês jantaram juntos e tiveram uma noite ardente e cheia de paixão! (+35 Afeto, +45 Intimidade, -R$ 60)`;

          // Recaída com ex pode gerar bebês não planejados (35% de chance)
          const gotUnplannedBaby = Math.random() < 0.35;
          if (gotUnplannedBaby) {
            const isBabyMale = Math.random() > 0.5;
            const babyNamesM = ['Enzo Gabriel', 'Arthur Miguel', 'Gael', 'Bernardo', 'Noah', 'Davi Lucca'];
            const babyNamesF = ['Valentina', 'Helena', 'Alice', 'Laura', 'Sophia', 'Manuela'];
            const babyName = isBabyMale
              ? babyNamesM[Math.floor(Math.random() * babyNamesM.length)]
              : babyNamesF[Math.floor(Math.random() * babyNamesF.length)];

            unplannedChildCreated = {
              id: `child_unplanned_${Date.now()}`,
              name: babyName,
              age: 0,
              gender: isBabyMale ? 'M' : 'F',
              isAdopted: false,
              isExtramarital: prev.relationship.status !== 'solteiro',
              isFromEx: true,
              isUnplanned: true,
              otherParentName: targetFriend.name,
              affection: 85
            };

            if (prev.character.gender === 'F') {
              msg += ` 👶🍼 SURPRESA / GRAVIDEZ NÃO PLANEJADA! Semanas após a recaída, o teste de gravidez deu POSITIVO! Você engravidou de um bebê não planejado de ${targetFriend.name}! Nasceu ${babyName}!`;
            } else {
              msg += ` 👶🍼 SURPRESA / FILHO NÃO PLANEJADO! Poucas semanas após a recaída, ${targetFriend.name} te ligou com o exame: ELA ENGRAVIDOU de você! Nasceu ${babyName}! Responsabilidade paterna ativada!`;
            }
          }
          break;
        }

        case 'reatar_relacionamento': {
          affectionDelta = 25;
          intimacyDelta = 20;
          targetHadAcceptedRecaida = false;
          msg = `💕 RECONCILIAÇÃO OFICIAL! O amor falou mais alto! Você e ${targetFriend.name} conversaram com o coração aberto e decidiram reatar o namoro! Recomeço abençoado! (+25 Afeto, +35 Felicidade)`;
          newRel = {
            status: 'namorando',
            partnerName: targetFriend.name,
            partnerAge: targetFriend.age,
            partnerJob: targetFriend.job || 'Profissional',
            partnerBio: `Reataram o relacionamento após uma recaída apaixonada!`,
            affection: Math.min(100, Math.max(75, targetFriend.affection + 25)),
            yearsTogether: 1
          };
          newFriendType = 'melhor_amigo';
          break;
        }

        // Amigos & Rolês adicionais
        case 'videogame_amigo':
          affectionDelta = 18;
          intimacyDelta = 18;
          msg = `Vocês passaram horas disputando partidas insanas de videogame online com ${targetFriend.name}! (+18 Afeto, +18 Intimidade)`;
          break;

        case 'pizza_amigo':
          cost = 40;
          affectionDelta = 22;
          intimacyDelta = 20;
          msg = `Noite da pizza e boas risadas na sala de estar com ${targetFriend.name}! (+22 Afeto, +20 Intimidade, -R$ 40)`;
          break;

        case 'pedir_conselho_amigo':
          affectionDelta = 18;
          intimacyDelta = 15;
          msg = `${targetFriend.name} te ouviu com carinho e te deu conselhos valiosos sobre seus dilemas de vida! (+18 Afeto, +15 Intimidade, +12 Intelecto)`;
          break;

        case 'emprestar_grana_amigo':
          cost = 100;
          affectionDelta = 30;
          intimacyDelta = 25;
          msg = `Você fez um PIX de R$ 100 para ajudar ${targetFriend.name} em um aperto financeiro! Gratidão profunda! (+30 Afeto, -R$ 100)`;
          break;

        case 'desentendimento_amigo':
          affectionDelta = -20;
          intimacyDelta = -15;
          msg = `Houve um bate-boca tenso por divergência de opiniões com ${targetFriend.name}! O clima esfriou (-20 Afeto).`;
          break;

        case 'cafe_conhecido':
          cost = 20;
          affectionDelta = 18;
          intimacyDelta = 15;
          msg = `Você e ${targetFriend.name} tomaram um café expresso e trocaram ideias interessantes! (+18 Afeto, -R$ 20)`;
          if (targetFriend.type === 'conhecido' && targetFriend.affection + affectionDelta >= 35) {
            newFriendType = 'amigo';
            msg += ` 🎉 ${targetFriend.name} agora é seu Amigo(a)!`;
          }
          break;

        default:
          affectionDelta = 10;
          intimacyDelta = 10;
          msg = `Você interagiu com ${targetFriend.name}. (+10 Afeto, +10 Intimidade)`;
          break;
      }

      let newDiscoveries = newRel.betrayalDiscoveriesCount || 0;
      const isCheatingAction = (actionType === 'flertar' || actionType === 'romance' || actionType === 'sexual' || actionType === 'motel_secreto' || actionType === 'mensagem_provocante' || actionType === 'viagem_secreta' || actionType === 'recaida');

      // Extramarital child logic for lover (amante)
      const isLoverIntimateAction = (targetFriend.type === 'amante' || newFriendType === 'amante') && (actionType === 'motel_secreto' || actionType === 'sexual' || actionType === 'viagem_secreta' || actionType === 'romance' || actionType === 'flertar');

      if (isLoverIntimateAction && !unplannedChildCreated && Math.random() < 0.35) {
        const isBabyMale = Math.random() > 0.5;
        const babyNamesM = ['Enzo Gabriel', 'Arthur Miguel', 'Gael', 'Bernardo', 'Noah', 'Davi Lucca', 'Theo', 'Lucas'];
        const babyNamesF = ['Valentina', 'Helena', 'Alice', 'Laura', 'Sophia', 'Manuela', 'Isabella', 'Lorena'];
        const babyName = isBabyMale
          ? babyNamesM[Math.floor(Math.random() * babyNamesM.length)]
          : babyNamesF[Math.floor(Math.random() * babyNamesF.length)];

        unplannedChildCreated = {
          id: `child_extramarital_${Date.now()}`,
          name: babyName,
          age: 0,
          gender: isBabyMale ? 'M' : 'F',
          isAdopted: false,
          isExtramarital: true,
          isUnplanned: true,
          otherParentName: targetFriend.name,
          affection: 80
        };

        msg += ` 👶🍼 FILHO EXTRACONJUGAL DA AMANTE! O encontro íntimo resultou em uma gravidez não planejada com ${targetFriend.name}! Nasceu ${babyName}!`;
      }

      if ((prev.relationship.status === 'namorando' || prev.relationship.status === 'casado') && isCheatingAction) {
        // Chance of discovery increases with bolder actions
        const betrayalChance = (actionType === 'viagem_secreta' || actionType === 'motel_secreto') ? 0.60 : 0.40;
        if (Math.random() < betrayalChance) {
          discoveredBetrayal = true;
          newDiscoveries += 1;
          newRel.betrayalDiscoveriesCount = newDiscoveries;
          if (newDiscoveries >= 3 || Math.random() < 0.45) {
            newRel.status = 'solteiro';
            newRel.affection = 0;
            msg += ` 🚨 ESCÂNDALO: ${newRel.partnerName || 'Sua parceira'} descobriu a traição com ${targetFriend.name} e TERMINOU o relacionamento!`;
          } else {
            newRel.affection = Math.max(0, newRel.affection - 45);
            msg += ` ⚡ CLIMÃO: ${newRel.partnerName || 'Sua parceira'} pegou mensagens suspeitas com ${targetFriend.name}! Houve um bate-boca terrível, mas ela aceitou tentar perdoar (Afeto caiu para ${newRel.affection}%).`;
          }
        }
      }

      const updatedFriends = friends.map((f) => {
        if (f.id !== friendId) return f;
        const finalAffection = Math.min(100, Math.max(0, f.affection + affectionDelta));
        const finalIntimacy = Math.min(100, Math.max(0, f.intimacy + intimacyDelta));

        // Automatic relationship tier progression based on affection:
        // conhecido -> amigo (affection >= 40) -> melhor_amigo (affection >= 80)
        let resolvedType = newFriendType || f.type;
        if (resolvedType === 'conhecido' || resolvedType === 'amigo' || resolvedType === 'melhor_amigo') {
          if (finalAffection >= 80) {
            resolvedType = 'melhor_amigo';
          } else if (finalAffection >= 40) {
            resolvedType = 'amigo';
          } else {
            resolvedType = 'conhecido';
          }
        }

        const newInteraction = {
          id: `int_${Date.now()}`,
          action: actionType.replace(/_/g, ' ').toUpperCase(),
          description: msg,
          deltaAffection: affectionDelta,
          date: `Ano ${prev.character.year}`,
          timestamp: Date.now()
        };

        const existingHistory = f.interactionHistory || [];
        const updatedHistory = [newInteraction, ...existingHistory].slice(0, 5);

        return {
          ...f,
          affection: finalAffection,
          intimacy: finalIntimacy,
          type: resolvedType,
          hadAcceptedRecaida: f.id === friendId && targetHadAcceptedRecaida !== null ? targetHadAcceptedRecaida : (actionType === 'reatar_relacionamento' ? false : f.hadAcceptedRecaida),
          lastRecaidaYear: f.id === friendId && targetHadAcceptedRecaida ? prev.character.year : f.lastRecaidaYear,
          interactionHistory: updatedHistory
        };
      });

      const currentMental = prev.stats.saudeMental ?? 85;
      const deltaMental = discoveredBetrayal ? -35 : (affectionDelta > 20 ? 8 : 4);

      const updatedChildren = unplannedChildCreated
        ? [...(prevFam.children || []), unplannedChildCreated]
        : prevFam.children || [];

      return {
        ...prev,
        stats: {
          ...prev.stats,
          grana: Math.max(0, prev.stats.grana - cost),
          felicidade: Math.min(100, Math.max(0, prev.stats.felicidade + (discoveredBetrayal ? -30 : 10))),
          saudeMental: Math.min(100, Math.max(0, currentMental + deltaMental))
        },
        relationship: newRel,
        family: {
          parents: prevFam.parents || [],
          siblings: prevFam.siblings || [],
          children: updatedChildren,
          friends: updatedFriends
        },
        logs: [
          {
            id: `log_f_act_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: `Interação: ${targetFriend.name}`,
            description: msg,
            type: 'love'
          },
          ...prev.logs
        ]
      };
    });

    if (discoveredBetrayal) {
      playErrorSound();
      confetti({ particleCount: 20, spread: 40 });
    } else {
      playSuccessSound();
      confetti({ particleCount: 30, spread: 50 });
    }

    return { success: true, message: msg, discoveredBetrayal };
  };

  const handleDoFamilyAction = (actionType: string, memberName?: string, cost: number = 0, itemGiven?: string): { success: boolean; message: string; affectionDelta?: number } => {
    playClickSound();

    if (actionType === 'dar_bem_material' && itemGiven) {
      const member = memberName || 'familiar';
      setGameState((prev) => {
        const remainingItems = (prev.housing.itemsPurchased || []).filter((i) => i !== itemGiven);
        const prevFam = prev.family || { parents: [], siblings: [], children: [] };
        const updatedParents = (prevFam.parents || []).map((p) => p.name === member ? { ...p, affection: Math.min(100, p.affection + 40) } : p);
        const updatedSiblings = (prevFam.siblings || []).map((s) => s.name === member ? { ...s, affection: Math.min(100, s.affection + 40) } : s);
        const updatedChildren = (prevFam.children || []).map((c) => c.name === member ? { ...c, affection: Math.min(100, c.affection + 40) } : c);

        return {
          ...prev,
          housing: {
            ...prev.housing,
            itemsPurchased: remainingItems
          },
          stats: {
            ...prev.stats,
            felicidade: Math.min(100, prev.stats.felicidade + 25)
          },
          family: {
            ...prevFam,
            parents: updatedParents,
            siblings: updatedSiblings,
            children: updatedChildren
          },
          logs: [
            {
              id: `gift_item_${Date.now()}`,
              year: prev.character.year,
              age: prev.character.age,
              title: `Presenteou ${member} com item! 🎁`,
              description: `Você doou seu(sua) ${itemGiven} para ${member}. Emoção e gratidão profunda! (+40 Afeto)`,
              type: 'milestone'
            },
            ...prev.logs
          ]
        };
      });
      playSuccessSound();
      confetti({ particleCount: 50, spread: 60 });
      return { success: true, message: `Você doou ${itemGiven} para ${member}! Nível de afeto aumentou em +40!`, affectionDelta: 40 };
    }

    if (cost > 0 && gameState.stats.grana < cost) {
      return { success: false, message: `Saldo insuficiente! Necessário R$ ${cost.toLocaleString('pt-BR')}.` };
    }

    const familyEnergyCostMap: Record<string, number> = {
      dar_banho: 5,
      alimentar: 5,
      passear_bebe: 10,
      brincar: 10,
      ajudar_casa: 10,
      acompanhar_medico: 10,
      videogame: 5,
      amamentar_mamadeira: 5,
      ninar: 5,
      parquinho: 10,
      banho_patinhos: 5,
      andar_bicicleta: 10,
      pet_banho: 10,
      pet_passeio: 10,
      pet_brincar: 5,
    };

    const reqEnergy = familyEnergyCostMap[actionType] || 0;
    if (reqEnergy > 0 && gameState.stats.energia < reqEnergy) {
      playErrorSound();
      return { 
        success: false, 
        message: `⚡ Você está exausto(a) (${gameState.stats.energia}% de energia)! Necessário ao menos ${reqEnergy}% de energia. Descanse primeiro!` 
      };
    }

    const member = memberName || 'familiar';
    let delta = 10;
    let desc = '';
    let healthDelta = 0;
    let happinessDelta = 10;
    let intellectDelta = 0;
    let energyDelta = 0;

    if (actionType === 'dar_banho') {
      delta = 15;
      healthDelta = 10;
      energyDelta = -5;
      desc = `Você deu um banho gostoso e quentinho em ${member}! (+15 Afeto, +10 Saúde, -5 Energia)`;
    } else if (actionType === 'alimentar') {
      delta = 18;
      healthDelta = 10;
      energyDelta = -5;
      desc = `Você alimentou e deu mamadeira/papinha para ${member}! (+18 Afeto, +10 Saúde, -5 Energia)`;
    } else if (actionType === 'pediatra') {
      if (gameState.stats.grana < 150) return { success: false, message: 'Saldo insuficiente para a consulta médica (R$ 150).' };
      delta = 15;
      healthDelta = 25;
      desc = `Consulta de rotina no pediatra com ${member}! Vacinas e acompanhamento em dia. (+25 Saúde, +15 Afeto)`;
    } else if (actionType === 'passear_bebe') {
      if (gameState.stats.energia <= 0) return { success: false, message: '⚡ Sua energia está zerada! Descanse primeiro.' };
      delta = 15;
      happinessDelta = 20;
      energyDelta = -10;
      desc = `Passeio delicioso de carrinho na praça com ${member}! (+20 Felicidade, +15 Afeto, -10 Energia)`;
    } else if (actionType === 'brincar') {
      if (gameState.stats.energia <= 0) return { success: false, message: '⚡ Sua energia está zerada! Descanse primeiro.' };
      delta = 18;
      happinessDelta = 22;
      energyDelta = -10;
      desc = `Sessão de brincadeiras e historinhas com ${member}! (+22 Felicidade, +18 Afeto, -10 Energia)`;
    } else if (actionType === 'presente_bebe') {
      if (gameState.stats.grana < 60) return { success: false, message: 'Saldo insuficiente para presente e fralda (R$ 60).' };
      delta = 25;
      happinessDelta = 30;
      desc = `Você comprou fraldas premium e brinquedo novo para ${member}! (+30 Felicidade, +25 Afeto)`;
    } else if (actionType === 'conversar') {
      delta = 10;
      happinessDelta = 8;
      desc = `Ótima conversa e desabafo com ${member}. (+10 Afeto, +8 Felicidade)`;
    } else if (actionType === 'pedir_conselho') {
      delta = 12;
      intellectDelta = 12;
      happinessDelta = 6;
      desc = `${member} te deu conselhos valiosos sobre finanças e escolhas de vida! (+12 Afeto, +12 Intelecto)`;
    } else if (actionType === 'sair_juntos') {
      delta = 18;
      happinessDelta = 18;
      desc = `Passeio descontraído com ${member}! (+18 Afeto, +18 Felicidade)`;
    } else if (actionType === 'dar_presente') {
      delta = 25;
      happinessDelta = 20;
      desc = `Você deu um lindo presente para ${member}! (+25 Afeto, +20 Felicidade)`;
    } else if (actionType === 'almoço') {
      delta = 22;
      happinessDelta = 20;
      desc = `Almoço especial de domingo com ${member}! Feijoada na mesa, boas risadas e aconchego familiar! (+22 Afeto, +20 Felicidade)`;
    } else if (actionType === 'abraco') {
      delta = 20;
      happinessDelta = 15;
      desc = `Você deu um abraço apertado e sincero em ${member}, expressando amor e gratidão! (+20 Afeto, +15 Felicidade)`;
    } else if (actionType === 'cafe_tarde') {
      delta = 18;
      happinessDelta = 12;
      desc = `Café da tarde quentinho com bolo de fubá e conversas reconfortantes com ${member}! (+18 Afeto, +12 Felicidade)`;
    } else if (actionType === 'historias') {
      delta = 18;
      intellectDelta = 15;
      happinessDelta = 10;
      desc = `Vocês passaram horas relembrando histórias da juventude e folheando fotos antigas com ${member}! (+18 Afeto, +15 Intelecto)`;
    } else if (actionType === 'ajudar_casa') {
      if (gameState.stats.energia <= 0) return { success: false, message: '⚡ Sua energia está zerada! Descanse primeiro.' };
      delta = 22;
      energyDelta = -10;
      desc = `Você ajudou ${member} com consertos domésticos e manutenção da casa! (+22 Afeto, -10 Energia)`;
    } else if (actionType === 'acompanhar_medico') {
      if (gameState.stats.energia <= 0) return { success: false, message: '⚡ Sua energia está zerada! Descanse primeiro.' };
      delta = 25;
      healthDelta = 12;
      energyDelta = -10;
      desc = `Você acompanhou ${member} na consulta médica e garantiu exames de rotina em dia! (+25 Afeto, +12 Saúde)`;
    } else if (actionType === 'videogame') {
      if (gameState.stats.energia <= 0) return { success: false, message: '⚡ Sua energia está zerada! Descanse primeiro.' };
      delta = 20;
      happinessDelta = 22;
      energyDelta = -5;
      desc = `Partida eletrizante de videogame com muita zoeira e comemoração com ${member}! (+20 Afeto, +22 Felicidade)`;
    } else if (actionType === 'pizza_fofoca') {
      delta = 22;
      happinessDelta = 18;
      desc = `Noite regada a pizza crocante e fofocas familiares divertidas com ${member}! (+22 Afeto, +18 Felicidade)`;
    } else if (actionType === 'desabafo') {
      delta = 22;
      happinessDelta = 15;
      desc = `Conversa sincera e acolhedora de peito aberto com ${member}! (+22 Afeto, +15 Felicidade)`;
    } else if (actionType === 'estudos_ajuda') {
      delta = 18;
      intellectDelta = 16;
      desc = `Você deu aquela força nos estudos e tirou dúvidas com paciência com ${member}! (+18 Afeto, +16 Intelecto)`;
    } else if (actionType === 'briga_irmao') {
      delta = -18;
      happinessDelta = -12;
      desc = `Você teve uma discussão acalorada e briga feia com ${member}! Clima tenso entre irmãos (-18 Afeto, -12 Felicidade).`;
    } else if (actionType === 'emprestar_roupa') {
      delta = 12;
      happinessDelta = 10;
      desc = `Você pegou roupas e tênis emprestados com ${member} e elogiaram o look! Parceria de irmãos (+12 Afeto, +10 Felicidade).`;
    } else if (actionType === 'fazer_elogio') {
      delta = 10;
      happinessDelta = 8;
      desc = `Você fez um elogio sincero e reconheceu o esforço de ${member}, que abriu um sorrisão! (+10 Afeto, +8 Felicidade).`;
    } else if (actionType === 'amamentar_mamadeira') {
      if (gameState.stats.energia <= 0) return { success: false, message: '⚡ Sua energia está zerada! Descanse primeiro.' };
      delta = 20;
      healthDelta = 15;
      energyDelta = -5;
      desc = `Você alimentou ${member} com mamadeira quentinha no colo e fez arrotar com calma! (+20 Afeto, +15 Saúde)`;
    } else if (actionType === 'ninar') {
      if (gameState.stats.energia <= 0) return { success: false, message: '⚡ Sua energia está zerada! Descanse primeiro.' };
      delta = 20;
      happinessDelta = 18;
      energyDelta = -5;
      desc = `Você ninou ${member} cantando cantigas suaves até o soninho profundo! (+20 Afeto, +18 Felicidade)`;
    } else if (actionType === 'tapetinho') {
      delta = 16;
      intellectDelta = 16;
      desc = `Estímulo ao desenvolvimento psicomotor no tapetinho colorido com brinquedinhos com ${member}! (+16 Afeto, +16 Intelecto)`;
    } else if (actionType === 'banho_sol') {
      delta = 15;
      healthDelta = 15;
      desc = `Banho de sol matinal agradável na varanda com ${member} para absorver vitamina D! (+15 Afeto, +15 Saúde)`;
    } else if (actionType === 'papinha') {
      delta = 18;
      healthDelta = 16;
      desc = `Você preparou e deu uma deliciosa papinha caseira nutritiva para ${member}! (+18 Afeto, +16 Saúde)`;
    } else if (actionType === 'parquinho') {
      if (gameState.stats.energia <= 0) return { success: false, message: '⚡ Sua energia está zerada! Descanse primeiro.' };
      delta = 25;
      happinessDelta = 25;
      energyDelta = -10;
      desc = `Tarde repleta de diversão no parquinho, correndo e escorregando com ${member}! (+25 Afeto, +25 Felicidade)`;
    } else if (actionType === 'banho_patinhos') {
      if (gameState.stats.energia <= 0) return { success: false, message: '⚡ Sua energia está zerada! Descanse primeiro.' };
      delta = 16;
      healthDelta = 12;
      energyDelta = -5;
      desc = `Banho alegre com espuma e patinhos de borracha, cheinho de risadas com ${member}! (+16 Afeto, +12 Higiene)`;
    } else if (actionType === 'desenhar') {
      delta = 18;
      intellectDelta = 16;
      happinessDelta = 16;
      desc = `Vocês desenharam e coloriram juntos com giz de cera e massinhas divertidas! (+18 Afeto, +16 Criatividade)`;
    } else if (actionType === 'ler_livro') {
      delta = 20;
      intellectDelta = 20;
      happinessDelta = 14;
      desc = `Leitura envolvente de livrinho infantil ilustrado com fábulas e historinhas para ${member}! (+20 Afeto, +20 Intelecto)`;
    } else if (actionType === 'ajudar_dever') {
      delta = 20;
      intellectDelta = 22;
      desc = `Você ajudou ${member} com o dever de casa e tirou todas as dúvidas escolares com carinho! (+20 Afeto, +22 Intelecto)`;
    } else if (actionType === 'andar_bicicleta') {
      if (gameState.stats.energia <= 0) return { success: false, message: '⚡ Sua energia está zerada! Descanse primeiro.' };
      delta = 25;
      happinessDelta = 25;
      energyDelta = -10;
      desc = `Vocês praticaram bicicleta no parque! ${member} perdeu o medo e pedalou com orgulho! (+25 Afeto, +25 Felicidade)`;
    } else if (actionType === 'cinema') {
      delta = 22;
      happinessDelta = 25;
      desc = `Sessão no cinema com balde de pipoca e doces ao lado de ${member}! (+22 Afeto, +25 Felicidade)`;
    } else if (actionType === 'conversa_jovem') {
      delta = 22;
      happinessDelta = 16;
      intellectDelta = 16;
      desc = `Conversa madura e sem julgamentos sobre amizades, planos e dilemas com ${member}! (+22 Afeto, +16 Cumplicidade)`;
    } else if (actionType === 'orientar_carreira') {
      delta = 20;
      intellectDelta = 25;
      desc = `Conselhos valiosos sobre faculdade, vestibulares e escolhas de futuro para ${member}! (+20 Afeto, +25 Intelecto)`;
    } else if (actionType === 'mesada_educacao') {
      delta = 25;
      happinessDelta = 25;
      intellectDelta = 18;
      desc = `Você entregou a mesada e ensinou como economizar e administrar o dinheiro para ${member}! (+25 Afeto, +25 Felicidade)`;
    } else if (actionType === 'pet_racao') {
      happinessDelta = 18;
      healthDelta = 12;
      desc = `Você serviu uma porção farta de ração crocante super premium para ${member}! (+18 Felicidade, +12 Saúde)`;
    } else if (actionType === 'pet_petisco') {
      happinessDelta = 25;
      desc = `${member} abanou o rabo e devorou o sachê e petisco favorito com alegria! (+25 Felicidade)`;
    } else if (actionType === 'pet_banho') {
      if (gameState.stats.energia <= 0) return { success: false, message: '⚡ Sua energia está zerada! Descanse primeiro.' };
      happinessDelta = 20;
      healthDelta = 16;
      energyDelta = -10;
      desc = `Banho caprichado com xampu cheiroso e secador! ${member} ficou limpinho e macio! (+20 Felicidade, +16 Higiene)`;
    } else if (actionType === 'pet_tosa') {
      happinessDelta = 16;
      desc = `Tosa higiênica e escovação caprichada nos pelos de ${member}! (+16 Conforto do Pet)`;
    } else if (actionType === 'pet_passeio') {
      if (gameState.stats.energia <= 0) return { success: false, message: '⚡ Sua energia está zerada! Descanse primeiro.' };
      happinessDelta = 25;
      healthDelta = 15;
      energyDelta = -10;
      desc = `Passeio delicioso na praça e calçadão com ${member}! Farejou e gastou muita energia! (+25 Felicidade, +15 Saúde)`;
    } else if (actionType === 'pet_brincar') {
      if (gameState.stats.energia <= 0) return { success: false, message: '⚡ Sua energia está zerada! Descanse primeiro.' };
      happinessDelta = 22;
      energyDelta = -5;
      desc = `Muita brincadeira com a bolinha e mordedor com ${member}! (+22 Felicidade)`;
    } else if (actionType === 'pet_carinho') {
      happinessDelta = 20;
      desc = `Você passou um bom tempo fazendo cafuné gostoso na barriguinha de ${member}! (+20 Felicidade)`;
    } else if (actionType === 'pet_veterinario') {
      healthDelta = 30;
      happinessDelta = 12;
      desc = `Visita ao veterinário com vacinas e vermífugo em dia para ${member}! (+30 Saúde do Pet)`;
    } else if (actionType === 'pet_truques') {
      intellectDelta = 16;
      happinessDelta = 18;
      desc = `Sessão de treinamento positivo! ${member} aprendeu a sentar e dar a patinha! (+18 Felicidade, +16 Intelecto)`;
    } else if (actionType === 'pet_higiene_cantinho') {
      healthDelta = 12;
      happinessDelta = 12;
      desc = `Você lavou as tigelinhas, colocou água fresca e limpou a caminha de ${member}! (+12 Saúde, +12 Bem-estar)`;
    } else if (actionType === 'enviar_pix') {
      const pixAmount = cost || 100;
      if (gameState.stats.grana < pixAmount) return { success: false, message: 'Saldo insuficiente na conta para enviar o PIX.' };
      delta = 25;
      happinessDelta = 20;
      desc = `Você enviou um PIX de R$ ${pixAmount} para ${member}! Agradecimento imediato no WhatsApp! (+25 Afeto, +20 Felicidade)`;
    } else if (actionType === 'cobrar_pix') {
      const prevFam = gameState.family || { parents: [], siblings: [], children: [] };
      const allMembers = [...(prevFam.parents || []), ...(prevFam.siblings || []), ...(prevFam.children || [])];
      const targetMem = allMembers.find(m => m.name === member);
      const currentAffection = targetMem ? targetMem.affection : 50;

      if (currentAffection >= 45) {
        delta = -15;
        happinessDelta = -5;
        desc = `Você cobrou o PIX de ${member}. ${member} pagou R$ 100 de volta via chave aleatória, mas ficou aquele climão no grupo! (-15 Afeto, +R$ 100)`;
        setGameState((prev) => ({ ...prev, stats: { ...prev.stats, grana: prev.stats.grana + 100 } }));
      } else {
        delta = -25;
        happinessDelta = -10;
        desc = `Você cobrou o PIX de ${member}, mas ${member} visualizou e deixou no vácuo! Climão total... (-25 Afeto)`;
      }
    }

    if (!desc) {
      desc = `Você compartilhou um momento especial com ${member}! (+${delta} Afeto)`;
    }

    setGameState((prev) => {
      const prevFam = prev.family || { parents: [], siblings: [], children: [] };
      const defaultSiblings = [{ id: '1', name: 'Lucas', gender: 'M' as const, age: 14, affection: 75 }];
      const currentSiblings = (prevFam.siblings && prevFam.siblings.length > 0) ? prevFam.siblings : defaultSiblings;

      const updatedParents = (prevFam.parents || []).map((p) => p.name === member ? { ...p, affection: Math.min(100, Math.max(0, p.affection + delta)) } : p);
      const updatedSiblings = currentSiblings.map((s) => (s.name === member || s.id === member) ? { ...s, affection: Math.min(100, Math.max(0, s.affection + delta)) } : s);
      const updatedChildren = (prevFam.children || []).map((c) => c.name === member ? { ...c, affection: Math.min(100, Math.max(0, c.affection + delta)) } : c);

      return {
        ...prev,
        stats: {
          ...prev.stats,
          grana: prev.stats.grana - cost,
          felicidade: Math.min(100, Math.max(0, prev.stats.felicidade + happinessDelta)),
          saude: Math.min(100, Math.max(0, prev.stats.saude + healthDelta)),
          intelecto: Math.min(100, Math.max(0, prev.stats.intelecto + intellectDelta)),
          energia: Math.min(100, Math.max(0, prev.stats.energia + energyDelta))
        },
        family: {
          ...prevFam,
          parents: updatedParents,
          siblings: updatedSiblings,
          children: updatedChildren
        },
        logs: [
          {
            id: `fam_act_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: `Interação Familiar: ${member}`,
            description: desc,
            type: 'milestone'
          },
          ...prev.logs
        ]
      };
    });

    playSuccessSound();
    return { success: true, message: desc, affectionDelta: delta };
  };

  const handlePlanFamilyEvent = (data: {
    eventTitle: string;
    eventType: string;
    cost: number;
    happinessGain: number;
    mentalHealthGain: number;
    energyGain: number;
    guestNames: string[];
  }): { success: boolean; message: string } => {
    playClickSound();
    if (gameState.stats.grana < data.cost) {
      playErrorSound();
      return { success: false, message: `Saldo insuficiente! O evento requer R$ ${data.cost.toLocaleString('pt-BR')}.` };
    }

    playSuccessSound();
    confetti({ particleCount: 80, spread: 75, origin: { y: 0.6 } });

    setGameState((prev) => {
      const prevFam = prev.family || { parents: [], siblings: [], children: [], friends: [] };
      const guestsSet = new Set(data.guestNames);

      const updatedParents = (prevFam.parents || []).map((p) =>
        guestsSet.has(p.name) ? { ...p, affection: Math.min(100, p.affection + 20) } : p
      );
      const updatedSiblings = (prevFam.siblings || []).map((s) =>
        guestsSet.has(s.name) ? { ...s, affection: Math.min(100, s.affection + 20) } : s
      );
      const updatedChildren = (prevFam.children || []).map((c) =>
        guestsSet.has(c.name) ? { ...c, affection: Math.min(100, c.affection + 20) } : c
      );
      const updatedFriends = (prevFam.friends || []).map((f) =>
        guestsSet.has(f.name) ? { ...f, affection: Math.min(100, f.affection + 20) } : f
      );

      let updatedRel = { ...prev.relationship };
      if (data.guestNames.includes(prev.relationship.partnerName || 'Patrícia')) {
        updatedRel.affection = Math.min(100, updatedRel.affection + 20);
      }

      const currentMental = prev.stats.saudeMental ?? 85;

      return {
        ...prev,
        stats: {
          ...prev.stats,
          grana: prev.stats.grana - data.cost,
          felicidade: Math.min(100, prev.stats.felicidade + data.happinessGain),
          saudeMental: Math.min(100, currentMental + data.mentalHealthGain),
          energia: Math.min(100, prev.stats.energia + data.energyGain)
        },
        relationship: updatedRel,
        family: {
          parents: updatedParents,
          siblings: updatedSiblings,
          children: updatedChildren,
          friends: updatedFriends
        },
        logs: [
          {
            id: `event_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: `🎉 Evento Concluído: ${data.eventTitle}`,
            description: `Você organizou ${data.eventTitle} reunindo ${data.guestNames.length} convidado(s)! Momentos inesquecíveis, estresse reduzido e felicidade lá no alto! (+${data.happinessGain} Felicidade, +${data.mentalHealthGain} Saúde Mental)`,
            type: 'milestone',
            statDeltas: { grana: -data.cost, felicidade: data.happinessGain }
          },
          ...prev.logs
        ]
      };
    });

    return {
      success: true,
      message: `🎉 Evento "${data.eventTitle}" realizado com enorme sucesso! (+${data.happinessGain}% Felicidade, +${data.mentalHealthGain}% Saúde Mental, Estresse Reduzido!)`
    };
  };

  const handleAdoptPet = (newPet: Pet): { success: boolean; message: string } => {
    playClickSound();
    setGameState((prev) => ({
      ...prev,
      pet: newPet,
      stats: { ...prev.stats, felicidade: Math.min(100, prev.stats.felicidade + 20) },
      logs: [{ id: `pet_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Novo Pet: ${newPet.name}`, description: `Adotou ${newPet.name}!`, type: 'milestone' }, ...prev.logs]
    }));
    return { success: true, message: `Você adotou ${newPet.name}!` };
  };

  const handlePartnerAction = (
    action: string,
    itemGiven?: string
  ): { success: boolean; message: string; gotPregnant?: boolean } => {
    playClickSound();

    if (action === 'seek_partner') {
      if (gameState.character.age < 14) {
        return { success: false, message: 'Muito novo para namorar! Foque na escola e amigos de infância.' };
      }
      if (gameState.stats.grana < 30) return { success: false, message: 'Precisa de R$ 30 para sair e conhecer pretendentes.' };

      const chosenName = getRandomName();
      const chosenJob = getRandomJob(false);
      const chosenBio = getRandomBio();

      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, grana: prev.stats.grana - 30, felicidade: Math.min(100, prev.stats.felicidade + 20) },
        relationship: {
          status: 'namorando',
          partnerName: chosenName,
          partnerJob: chosenJob,
          partnerBio: chosenBio,
          affection: 70,
          yearsTogether: 0,
          partnerAge: Math.max(14, prev.character.age - 1 + Math.floor(Math.random() * 3))
        },
        logs: [
          {
            id: `love_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: `Novo Amor: ${chosenName} ❤️`,
            description: `Você e ${chosenName} (${chosenJob}) começaram um namoro apaixonado!`,
            type: 'love'
          },
          ...prev.logs
        ]
      }));
      playSuccessSound();
      return { success: true, message: `Você conheceu ${chosenName} (${chosenJob})! Agora vocês estão namorando sério! ❤️` };
    }

    if (!gameState.relationship.partnerName || gameState.relationship.status === 'solteiro') {
      return { success: false, message: 'Você precisa estar namorando primeiro!' };
    }

    const partner = gameState.relationship.partnerName;

    const partnerEnergyCostMap: Record<string, number> = {
      viagem_fim_semana: 15,
      cozinhar_juntos: 8,
      romantic_date: 5,
      intimate_safe: 10,
      intimate_unprotected: 12
    };

    const reqPartnerEnergy = partnerEnergyCostMap[action] || 0;
    if (reqPartnerEnergy > 0 && gameState.stats.energia < reqPartnerEnergy) {
      playErrorSound();
      return { 
        success: false, 
        message: `⚡ Você está exausto(a) (${gameState.stats.energia}% de energia)! Precisa de pelo menos ${reqPartnerEnergy}% de energia para esta atividade a dois. Descanse primeiro!` 
      };
    }

    if (action === 'viagem_fim_semana') {
      if (gameState.stats.grana < 800) return { success: false, message: 'Precisa de R$ 800 para a viagem de fim de semana.' };
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, grana: prev.stats.grana - 800, felicidade: Math.min(100, prev.stats.felicidade + 25) },
        relationship: { ...prev.relationship, affection: Math.min(100, prev.relationship.affection + 30) },
        logs: [{ id: `love_trip_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Viagem de Fim de Semana com ${partner} ✈️`, description: 'Passeio romântico de descanso e amor a dois.', type: 'love' }, ...prev.logs]
      }));
      playSuccessSound();
      return { success: true, message: `Viagem inesquecível de fim de semana com ${partner}! (+30 Afeto, +25 Felicidade)` };
    }

    if (action === 'conversa_futuro') {
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, intelecto: Math.min(100, prev.stats.intelecto + 10), felicidade: Math.min(100, prev.stats.felicidade + 10) },
        relationship: { ...prev.relationship, affection: Math.min(100, prev.relationship.affection + 15) }
      }));
      playSuccessSound();
      return { success: true, message: `Conversa profunda e madura sobre o futuro com ${partner}! (+15 Afeto, +10 Intelecto)` };
    }

    if (action === 'cozinhar_juntos') {
      if (gameState.stats.grana < 50) return { success: false, message: 'Precisa de R$ 50 para os ingredientes do jantar.' };
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, grana: prev.stats.grana - 50, felicidade: Math.min(100, prev.stats.felicidade + 15) },
        relationship: { ...prev.relationship, affection: Math.min(100, prev.relationship.affection + 18) }
      }));
      playSuccessSound();
      return { success: true, message: `Cozinharam um jantar delicioso a dois na cozinha! (+18 Afeto)` };
    }

    if (action === 'massagem_relaxante') {
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, energia: Math.min(100, prev.stats.energia + 12), felicidade: Math.min(100, prev.stats.felicidade + 12) },
        relationship: { ...prev.relationship, affection: Math.min(100, prev.relationship.affection + 15) }
      }));
      playSuccessSound();
      return { success: true, message: `Sessão de massagem relaxante com óleos perfumados! (+15 Afeto, +12 Energia)` };
    }

    if (action === 'planejamento_financeiro') {
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, intelecto: Math.min(100, prev.stats.intelecto + 15) },
        relationship: { ...prev.relationship, affection: Math.min(100, prev.relationship.affection + 12) }
      }));
      playSuccessSound();
      return { success: true, message: `Alinhamento financeiro e metas de economia do casal! (+12 Afeto, +15 Intelecto)` };
    }

    if (action === 'noite_cinema') {
      if (gameState.stats.grana < 30) return { success: false, message: 'Precisa de R$ 30 para o aluguel do filme e pipoca.' };
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, grana: prev.stats.grana - 30, felicidade: Math.min(100, prev.stats.felicidade + 14) },
        relationship: { ...prev.relationship, affection: Math.min(100, prev.relationship.affection + 14) }
      }));
      playSuccessSound();
      return { success: true, message: `Noite de filme aconchegante com pipoca no sofá com ${partner}! (+14 Afeto)` };
    }

    if (action === 'discutir_relacao') {
      setGameState((prev) => ({
        ...prev,
        relationship: { ...prev.relationship, affection: Math.min(100, prev.relationship.affection + 10) }
      }));
      playSuccessSound();
      return { success: true, message: `Diálogo aberto e saudável (DR) fortaleceu a cumplicidade com ${partner}! (+10 Afeto)` };
    }

    if (action === 'romantic_date') {
      if (gameState.stats.grana < 120) return { success: false, message: 'Precisa de R$ 120 para o jantar romântico.' };
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, grana: prev.stats.grana - 120, felicidade: Math.min(100, prev.stats.felicidade + 18) },
        relationship: { ...prev.relationship, affection: Math.min(100, prev.relationship.affection + 18) },
        logs: [
          {
            id: `date_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: `Jantar Romântico com ${partner} 🍷`,
            description: 'Vinho, boa comida e clima de romance à luz de velas (+18 Afeto).',
            type: 'love'
          },
          ...prev.logs
        ]
      }));
      playSuccessSound();
      return { success: true, message: `Jantar romântico incrível com ${partner}! (+18 Afeto, +18 Felicidade)` };
    }

    if (action === 'give_gift') {
      if (itemGiven) {
        setGameState((prev) => ({
          ...prev,
          housing: {
            ...prev.housing,
            itemsPurchased: (prev.housing.itemsPurchased || []).filter((i) => i !== itemGiven)
          },
          stats: { ...prev.stats, felicidade: Math.min(100, prev.stats.felicidade + 25) },
          relationship: { ...prev.relationship, affection: Math.min(100, prev.relationship.affection + 35) },
          logs: [
            {
              id: `love_gift_${Date.now()}`,
              year: prev.character.year,
              age: prev.character.age,
              title: `Presenteou ${partner} com ${itemGiven}! 🎁`,
              description: `Presente marcante que aqueceu os corações de vocês! (+35 Afeto)`,
              type: 'love'
            },
            ...prev.logs
          ]
        }));
        playSuccessSound();
        return { success: true, message: `Você presenteou ${partner} com seu(sua) ${itemGiven}! (+35 Afeto)` };
      }

      if (gameState.stats.grana < 150) return { success: false, message: 'Precisa de R$ 150 para comprar flores e chocolate.' };
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, grana: prev.stats.grana - 150, felicidade: Math.min(100, prev.stats.felicidade + 20) },
        relationship: { ...prev.relationship, affection: Math.min(100, prev.relationship.affection + 25) }
      }));
      playSuccessSound();
      return { success: true, message: `Presente inesquecível entregue a ${partner}! (+25 Afeto)` };
    }

    if (action === 'intimate_safe') {
      if (gameState.stats.energia <= 0) {
        return { success: false, message: '⚡ Sua energia está zerada! Descanse primeiro para ter disposição.' };
      }

      setGameState((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          felicidade: Math.min(100, prev.stats.felicidade + 22),
          energia: Math.max(0, prev.stats.energia - 10)
        },
        relationship: {
          ...prev.relationship,
          affection: Math.min(100, prev.relationship.affection + 20),
          unprotectedSexCount: 0
        },
        logs: [
          {
            id: `inti_safe_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: `Noite Íntima com ${partner} 💕`,
            description: 'Sexo seguro e protegido com cumplicidade total e carinho.',
            type: 'love'
          },
          ...prev.logs
        ]
      }));
      playSuccessSound();
      return { success: true, message: `Noite apaixonada e segura com ${partner}! (+22 Felicidade, +20 Afeto, 100% Protegido)` };
    }

    if (action === 'intimate_unprotected') {
      if (gameState.stats.energia <= 0) {
        return { success: false, message: '⚡ Sua energia está zerada! Descanse primeiro para ter disposição.' };
      }

      const currentSeq = gameState.relationship?.unprotectedSexCount || 0;
      const nextSeq = currentSeq + 1;
      const isInfertile = gameState.character.isInfertile || gameState.fertility?.hasVasectomy;
      // 4 consecutive unprotected acts guarantees pregnancy if fertile, or 35% chance per act
      const willGetPregnant = !isInfertile && (nextSeq >= 4 || Math.random() < 0.35);

      setGameState((prev) => {
        const babyName = Math.random() > 0.5 ? 'Enzo Gabriel' : 'Valentina';
        const prevFam = prev.family || { parents: [], siblings: [], children: [] };
        const newChildList = willGetPregnant
          ? [
              ...(prevFam.children || []),
              {
                id: `child_unprotected_${Date.now()}`,
                name: `${babyName} ${prev.character.name.split(' ').slice(1).join(' ') || 'Silva'}`,
                age: 0,
                gender: Math.random() > 0.5 ? ('M' as const) : ('F' as const),
                isAdopted: false,
                affection: 95
              }
            ]
          : prevFam.children || [];

        return {
          ...prev,
          stats: {
            ...prev.stats,
            felicidade: Math.min(100, prev.stats.felicidade + (willGetPregnant ? 25 : 20)),
            energia: Math.max(0, prev.stats.energia - 12)
          },
          relationship: {
            ...prev.relationship,
            affection: Math.min(100, prev.relationship.affection + 25),
            unprotectedSexCount: willGetPregnant ? 0 : nextSeq
          },
          family: {
            ...prevFam,
            children: newChildList
          },
          logs: [
            {
              id: `inti_unprot_${Date.now()}`,
              year: prev.character.year,
              age: prev.character.age,
              title: willGetPregnant
                ? `🚨 GRAVIDEZ INESPERADA (${nextSeq}ª Relação Desprotegida Consecutiva)! Nasceu ${babyName}! 👶`
                : `Sexo Sem Proteção com ${partner} 🔥 (${nextSeq}/4º ato consecutivo)`,
              description: willGetPregnant
                ? `A sequência de sexo desprotegido resultou em uma gravidez! Um lindo bebê nasceu na família: ${babyName}!`
                : isInfertile
                ? `Relação íntima desprotegida. Como você realizou Vasectomia/Laqueadura, você é 100% infértil (sem risco de gravidez).`
                : `Momento de pura paixão sem proteção (${nextSeq}/4 acts). Desta vez não houve gravidez.`,
              type: willGetPregnant ? 'milestone' : 'love'
            },
            ...prev.logs
          ]
        };
      });

      if (willGetPregnant) {
        playSuccessSound();
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        return {
          success: true,
          message: `🚨 Atenção! O sexo sem proteção gerou uma gravidez inesperada! Um bebê acabou de nascer na família! 👶🍼`,
          gotPregnant: true
        };
      }

      playSuccessSound();
      return {
        success: true,
        message: isInfertile
          ? `Noite de amor desprotegido com ${partner}! (+25 Felicidade, +25 Afeto. Vasectomia/Laqueadura impede a gravidez.)`
          : `Noite intensa de sexo desprotegido com ${partner}! (+25 Felicidade, +25 Afeto. Sem gravidez desta vez!)`
      };
    }

    if (action === 'propose_marriage') {
      if (gameState.character.age < 18) {
        return {
          success: false,
          message: `Casamento permitido apenas após os 18 anos de idade! Você tem ${gameState.character.age} anos.`
        };
      }

      if (gameState.relationship.yearsTogether < 3) {
        return {
          success: false,
          message: `Para casar, é necessário ter pelo menos 3 anos de relacionamento sério! Vocês estão juntos há ${gameState.relationship.yearsTogether} ano(s).`
        };
      }

      setIsWeddingPlannerOpen(true);
      return {
        success: true,
        message: '💍 Planejador do Casamento aberto! Escolha orçamento, temporada, local e convidados!'
      };
    }

    if (action === 'breakup') {
      const exPartnerName = partner;
      setGameState((prev) => {
        const exContact = {
          id: `ex_${Date.now()}`,
          name: exPartnerName,
          gender: 'F' as const,
          age: prev.character.age,
          job: 'Ex-parceira(o)',
          affection: 30,
          intimacy: 40,
          type: 'ex' as const,
          interactionHistory: [
            {
              id: `int_break_${Date.now()}`,
              action: 'Fim do Relacionamento',
              description: `Término do relacionamento com ${exPartnerName}.`,
              deltaAffection: -30,
              date: `Ano ${prev.character.year}`,
              timestamp: Date.now()
            }
          ]
        };
        const updatedFriends = [...(prev.family?.friends || []), exContact];
        return {
          ...prev,
          family: {
            parents: prev.family?.parents || [],
            siblings: prev.family?.siblings || [],
            children: prev.family?.children || [],
            friends: updatedFriends
          },
          stats: {
            ...prev.stats,
            felicidade: Math.max(0, prev.stats.felicidade - 30),
            saudeMental: Math.max(0, (prev.stats.saudeMental ?? 85) - 30)
          },
          relationship: { status: 'solteiro', affection: 0, yearsTogether: 0, partnerName: undefined },
          logs: [
            {
              id: `break_${Date.now()}`,
              year: prev.character.year,
              age: prev.character.age,
              title: `Fim do Relacionamento com ${exPartnerName} 💔`,
              description: `Vocês conversaram e decidiram seguir caminhos separados. ${exPartnerName} agora está na sua lista de contatos como Ex.`,
              type: 'love'
            },
            ...prev.logs
          ]
        };
      });
      return { success: true, message: `Relacionamento com ${partner} encerrado.` };
    }

    if (action === 'lover_date') {
      const lover = gameState.relationship.loverName || 'Amante';
      if (gameState.stats.grana < 100) return { success: false, message: 'Precisa de R$ 100 para o encontro secreto num motel discreto.' };
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, grana: prev.stats.grana - 100, felicidade: Math.min(100, prev.stats.felicidade + 20) },
        relationship: { ...prev.relationship, loverAffection: Math.min(100, (prev.relationship.loverAffection || 70) + 15) },
        logs: [{ id: `lover_date_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Encontro Secreto com ${lover} 🤫`, description: `Noite sigilosa longe dos olhos do seu par oficial. (+15 Afeto da amante)`, type: 'love' }, ...prev.logs]
      }));
      playSuccessSound();
      return { success: true, message: `Encontro sigiloso e inesquecível com ${lover}! (+20 Felicidade, +15 Afeto)` };
    }

    if (action === 'lover_end') {
      const lover = gameState.relationship.loverName || 'Amante';
      setGameState((prev) => ({
        ...prev,
        relationship: { ...prev.relationship, hasLover: false, loverName: undefined, loverAffection: undefined },
        logs: [{ id: `lover_end_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Fim do Caso Extraconjugal ✂️`, description: `Você colocou um ponto final no romance secreto com ${lover}.`, type: 'love' }, ...prev.logs]
      }));
      playSuccessSound();
      return { success: true, message: `Você encerrou o caso com ${lover}.` };
    }

    if (action === 'lover_promote') {
      const lover = gameState.relationship.loverName || 'Amante';
      const oldPartner = gameState.relationship.partnerName || 'Par Oficial';
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, felicidade: Math.max(0, prev.stats.felicidade - 20) },
        relationship: {
          status: 'namorando',
          partnerName: lover,
          affection: prev.relationship.loverAffection || 80,
          yearsTogether: 1,
          hasLover: false,
          loverName: undefined,
          loverAffection: undefined
        },
        logs: [{ id: `lover_promo_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Assumiu a Amante: ${lover} ❤️`, description: `Você terminou com ${oldPartner} e assumiu ${lover} como sua nova parceira oficial!`, type: 'milestone' }, ...prev.logs]
      }));
      playSuccessSound();
      confetti({ particleCount: 70, spread: 70 });
      return { success: true, message: `Você largou ${oldPartner} e assumiu ${lover} como parceira oficial!` };
    }

    if (action === 'lover_baby') {
      const lover = gameState.relationship.loverName || 'Amante';
      const babyName = Math.random() > 0.5 ? 'Gael' : 'Maite';
      const fullName = `${babyName} ${gameState.character.name.split(' ').slice(1).join(' ') || 'Silva'}`;
      
      setGameState((prev) => {
        const prevFam = prev.family || { parents: [], siblings: [], children: [] };
        return {
          ...prev,
          family: {
            ...prevFam,
            children: [
              ...(prevFam.children || []),
              {
                id: `extramarital_child_${Date.now()}`,
                name: fullName,
                age: 0,
                gender: Math.random() > 0.5 ? 'M' : 'F',
                isAdopted: false,
                isExtramarital: true,
                affection: 80
              }
            ]
          },
          logs: [
            { id: `extra_baby_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `🚨 NASCEU FILHO EXTRACONJUGAL! ${fullName} 👶`, description: `Sua amante ${lover} deu à luz a ${fullName}! Você registrou a criança e assumiu a pensão alimentícia.`, type: 'milestone' },
            ...prev.logs
          ]
        };
      });

      setEventBombaModal({
        type: 'gravidez',
        title: 'Filho Extraconjugal Nasceu! 👶',
        subtitle: `Mãe: ${lover} • Bebê: ${fullName}`,
        description: `Sua amante ${lover} deu à luz a um lindo bebê! O nascimento gerou forte burburinho na cidade, exige pensão alimentícia e colocou seu relacionamento oficial sob extrema tensão!`,
        icon: '🍼',
        badge: 'FILHO EXTRACONJUGAL REGISTRADO',
        statDeltas: { felicidade: -15, grana: -800 },
        actionText: 'Assumir Paternidade & Pensão'
      });

      playSuccessSound();
      return { success: true, message: `Nasceu seu filho extraconjugal ${fullName}! Pensão registrada no sistema.`, gotPregnant: true };
    }

    return { success: false, message: 'Ação concluída.' };
  };

  const handleDatePartner = () => handlePartnerAction('romantic_date');
  const handleMarryPartner = () => handlePartnerAction('propose_marriage');

  const handleConfirmWeddingPlan = (data: WeddingPlanData): { success: boolean; message: string } => {
    if (gameState.character.age < 18) {
      return {
        success: false,
        message: `Casamento permitido apenas para maiores de 18 anos! (Sua idade: ${gameState.character.age} anos).`
      };
    }

    if (gameState.relationship.yearsTogether < 3) {
      return {
        success: false,
        message: `Para casar, é necessário ter pelo menos 3 anos de relacionamento sério! (Vocês estão juntos há ${gameState.relationship.yearsTogether} ano(s)).`
      };
    }

    const payCheck = processPayment(data.totalCost);
    if (!payCheck.success) {
      return {
        success: false,
        message: payCheck.message || `Saldo em conta e limite de cartão insuficientes para cobrir R$ ${data.totalCost.toLocaleString('pt-BR')}.`
      };
    }

    const partner = gameState.relationship.partnerName || 'Patrícia';

    setGameState((prev) => {
      const updatedState = deductCost(prev, data.totalCost, data.paymentMethod || payCheck.paidBy);

      return {
        ...updatedState,
        stats: {
          ...updatedState.stats,
          felicidade: Math.min(100, updatedState.stats.felicidade + data.happinessBonus),
          saudeMental: Math.min(100, (updatedState.stats.saudeMental ?? 85) + data.mentalHealthBonus)
        },
        relationship: {
          ...updatedState.relationship,
          status: 'casado',
          affection: Math.min(100, updatedState.relationship.affection + data.affectionBonus)
        },
        logs: [
          {
            id: `wedding_ceremony_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: `💍 CASAMENTO DOS SONHOS CELEBRADO COM ${partner}!`,
            description: `Cerimônia inesquecível com ${data.guestNames.length} convidados! Orçamento total do casamento: R$ ${data.totalCost.toLocaleString('pt-BR')}. (+${data.happinessBonus}% Felicidade, +${data.affectionBonus}% Afeto do Casal)`,
            type: 'milestone'
          },
          ...prev.logs
        ]
      };
    });

    playSuccessSound();
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });

    return {
      success: true,
      message: `💍 Parabéns! O casamento dos seus sonhos com ${partner} foi realizado com celebração espetacular!`
    };
  };

  // Education System Handlers
  const handleAdvanceSchoolYear = (level: 'fundamental' | 'medio'): { success: boolean; message: string; graduated?: boolean } => {
    if (level === 'fundamental' && gameState.character.age < 6) {
      return { success: false, message: 'O Ensino Fundamental inicia a partir dos 6 anos de idade.' };
    }
    if (level === 'medio' && gameState.character.age < 14) {
      return { success: false, message: 'O Ensino Médio inicia a partir dos 14/15 anos de idade.' };
    }
    playClickSound();
    let graduated = false;
    let message = '';

    setGameState((prev) => {
      const edu = prev.educationSystem || {
        currentStage: 'fundamental',
        fundamentalYearsDone: 0,
        medioYearsDone: 0,
        superiorYearsDone: 0,
        graduatedCourses: []
      };

      if (level === 'fundamental') {
        const nextYears = Math.min(6, edu.fundamentalYearsDone + 1);
        graduated = nextYears === 6;
        message = graduated
          ? '🎉 Parabéns! Você concluiu os 6 anos do Ensino Fundamental com honras!'
          : `Aprovado no ${nextYears}º ano do Ensino Fundamental! (+15 Intelecto)`;

        return {
          ...prev,
          stats: {
            ...prev.stats,
            intelecto: Math.min(100, prev.stats.intelecto + 15),
            felicidade: Math.min(100, prev.stats.felicidade + (graduated ? 30 : 10))
          },
          career: {
            ...prev.career,
            educationLevel: graduated ? 'Ensino Fundamental Completo' : prev.career.educationLevel
          },
          educationSystem: {
            ...edu,
            fundamentalYearsDone: nextYears,
            currentStage: graduated ? 'medio' : 'fundamental'
          },
          logs: [
            {
              id: `edu_fund_${Date.now()}`,
              year: prev.character.year,
              age: prev.character.age,
              title: graduated ? 'Formatura do Ensino Fundamental! 🏫' : `Conclusão do ${nextYears}º Ano Escolar`,
              description: message,
              type: 'milestone'
            },
            ...prev.logs
          ]
        };
      } else {
        const nextYears = Math.min(6, edu.medioYearsDone + 1);
        graduated = nextYears === 6;
        message = graduated
          ? '🎓 Formado no Ensino Médio! Agora você pode escolher qual faculdade cursar no Ensino Superior ou prestar concursos!'
          : `Aprovado no ${nextYears}º ano do Ensino Médio! (+20 Intelecto)`;

        return {
          ...prev,
          stats: {
            ...prev.stats,
            intelecto: Math.min(100, prev.stats.intelecto + 20),
            felicidade: Math.min(100, prev.stats.felicidade + (graduated ? 40 : 15))
          },
          career: {
            ...prev.career,
            educationLevel: graduated ? 'Ensino Médio Completo' : prev.career.educationLevel
          },
          educationSystem: {
            ...edu,
            medioYearsDone: nextYears,
            currentStage: graduated ? 'superior' : 'medio'
          },
          logs: [
            {
              id: `edu_medio_${Date.now()}`,
              year: prev.character.year,
              age: prev.character.age,
              title: graduated ? 'Diploma do Ensino Médio Conquistado! 📜' : `Conclusão do ${nextYears}º Ano do Ensino Médio`,
              description: message,
              type: 'milestone'
            },
            ...prev.logs
          ]
        };
      }
    });

    if (graduated) {
      playSuccessSound();
      confetti({ particleCount: 70, spread: 70 });
    }

    return { success: true, message, graduated };
  };

  const handleStudyDaily = (level: 'fundamental' | 'medio' | 'superior'): { success: boolean; message: string } => {
    playClickSound();
    if (gameState.stats.energia < 10) {
      return { success: false, message: 'Energia insuficiente! Descanse ou alimente-se antes de estudar.' };
    }

    setGameState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        energia: Math.max(0, prev.stats.energia - 10),
        intelecto: Math.min(100, prev.stats.intelecto + 6),
        felicidade: Math.min(100, prev.stats.felicidade + 4)
      }
    }));

    return { success: true, message: 'Sessão de estudos concluída! Conhecimento ampliado (+6 Intelecto, -10 Energia)' };
  };

  const handleAdvanceCollegeYear = (): { success: boolean; message: string; graduated?: boolean } => {
    playClickSound();
    let graduated = false;
    let message = '';

    setGameState((prev) => {
      const edu = prev.educationSystem || {
        currentStage: 'superior',
        fundamentalYearsDone: 6,
        medioYearsDone: 6,
        superiorYearsDone: 0,
        graduatedCourses: []
      };

      const courseName = edu.selectedCollegeCourse || prev.career.collegeMajor || 'Graduação';
      const nextYears = Math.min(4, edu.superiorYearsDone + 1);
      graduated = nextYears === 4;

      message = graduated
        ? `🎓 PARABÉNS! Você se formou no Ensino Superior com Diploma de Bacharel em ${courseName}! Habilitado para cargos de alto nível!`
        : `Aprovado no ${nextYears}º ano da Faculdade de ${courseName}! (+25 Intelecto)`;

      const updatedGraduated = graduated
        ? [...(edu.graduatedCourses || []), courseName]
        : edu.graduatedCourses || [];

      return {
        ...prev,
        stats: {
          ...prev.stats,
          intelecto: Math.min(100, prev.stats.intelecto + 25),
          felicidade: Math.min(100, prev.stats.felicidade + (graduated ? 50 : 20))
        },
        career: {
          ...prev.career,
          collegeStatus: graduated ? 'formado' : 'cursando',
          educationLevel: graduated ? `Graduado em ${courseName}` : prev.career.educationLevel,
          collegeMajor: courseName
        },
        educationSystem: {
          ...edu,
          superiorYearsDone: nextYears,
          graduatedCourses: updatedGraduated
        },
        logs: [
          {
            id: `edu_sup_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: graduated ? `FORMATURA DO ENSINO SUPERIOR: ${courseName}! 🎓` : `Aprovado no ${nextYears}º Ano da Faculdade`,
            description: message,
            type: 'milestone'
          },
          ...prev.logs
        ]
      };
    });

    if (graduated) {
      playSuccessSound();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }

    return { success: true, message, graduated };
  };

  // Company Benefits Action Handler
  const handleUseBenefitAction = (benefitName: string): { success: boolean; message: string } => {
    playClickSound();
    const bLower = benefitName.toLowerCase();

    if (bLower.includes('gympass') || bLower.includes('academia')) {
      if (gameState.stats.energia < 10) return { success: false, message: 'Cansaço demais para ir à academia! Descanse primeiro.' };
      setGameState((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          saude: Math.min(100, prev.stats.saude + 18),
          felicidade: Math.min(100, prev.stats.felicidade + 12),
          energia: Math.max(0, prev.stats.energia - 10)
        },
        logs: [
          {
            id: `ben_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: 'Treino no Gympass 💪',
            description: 'Aproveitou a academia corporativa do Gympass. Shape em dia e saúde revigorada! (+18 Saúde, +12 Felicidade)',
            type: 'health'
          },
          ...prev.logs
        ]
      }));
      playSuccessSound();
      return { success: true, message: 'Treino completo no Gympass! (+18 Saúde, +12 Felicidade, -10 Energia)' };
    }

    if (bLower.includes('vr') || bLower.includes('refeição')) {
      setGameState((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          energia: Math.min(100, prev.stats.energia + 25),
          felicidade: Math.min(100, prev.stats.felicidade + 15)
        },
        logs: [
          {
            id: `ben_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: 'Almoço com Vale-Refeição 🍽️',
            description: 'Restaurante por quilo pago integralmente com o saldo do VR da empresa!',
            type: 'health'
          },
          ...prev.logs
        ]
      }));
      playCoinSound();
      return { success: true, message: 'Almoço farto no quilo pago com VR! (+25 Energia, +15 Felicidade, R$ 0 gasto)' };
    }

    if (bLower.includes('va') || bLower.includes('alimentação')) {
      setGameState((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          saude: Math.min(100, prev.stats.saude + 16),
          felicidade: Math.min(100, prev.stats.felicidade + 12),
          energia: Math.min(100, prev.stats.energia + 10)
        },
        logs: [
          {
            id: `ben_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: 'Compras de Mercado com VA 🛒',
            description: 'Abasteceu a geladeira com frutas, proteínas e legumes usando o Vale-Alimentação corporativo!',
            type: 'health'
          },
          ...prev.logs
        ]
      }));
      playCoinSound();
      return { success: true, message: 'Feira do mês garantida com VA! Geladeira cheia e saudável (+16 Saúde, +12 Fel)' };
    }

    if (bLower.includes('saúde') || bLower.includes('médic') || bLower.includes('odonto')) {
      setGameState((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          saude: Math.min(100, prev.stats.saude + 25),
          energia: Math.min(100, prev.stats.energia + 10)
        },
        logs: [
          {
            id: `ben_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: 'Check-up no Plano de Saúde 🩺',
            description: 'Consulta médica completa coberta pelo convênio da empresa!',
            type: 'health'
          },
          ...prev.logs
        ]
      }));
      playSuccessSound();
      return { success: true, message: 'Consulta e exames realizados pelo Plano de Saúde! (+25 Saúde, +10 Energia)' };
    }

    if (bLower.includes('transporte') || bLower.includes('vt')) {
      setGameState((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          energia: Math.min(100, prev.stats.energia + 12),
          felicidade: Math.min(100, prev.stats.felicidade + 5)
        }
      }));
      return { success: true, message: 'Deslocamento de ida e volta pelo Vale Transporte da empresa! (+12 Energia)' };
    }

    setGameState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        felicidade: Math.min(100, prev.stats.felicidade + 15),
        saude: Math.min(100, prev.stats.saude + 10)
      }
    }));
    return { success: true, message: `Benefício ${benefitName} utilizado com sucesso! (+15 Felicidade, +10 Saúde)` };
  };

  // Crime Action Handler (9 Expanded Crimes)
  const handleCrimeAction = (
    crimeType: 'furto_celular' | 'pendura' | 'bilhete' | 'racha' | 'phishing' | 'contrabando' | 'roubo_carga' | 'lavagem' | 'assalto_banco'
  ): { success: boolean; message: string } => {
    if (gameState.character.age < 14) {
      return { success: false, message: 'Crime e malandragem estão disponíveis somente a partir dos 14 anos de idade!' };
    }
    playClickSound();

    interface CrimeConfig {
      title: string;
      reward: number;
      successRate: number;
      serasaPenalty: number;
      healthRisk: number;
      minIntellect?: number;
      requiresVehicle?: boolean;
      requiresCash?: number;
      failMessage: string;
      successMessage: string;
    }

    const CRIMES: Record<string, CrimeConfig> = {
      furto_celular: {
        title: 'Furto de Celular no Bloco de Carnaval',
        reward: 1200,
        successRate: 0.65,
        serasaPenalty: 35,
        healthRisk: 10,
        failMessage: 'Você foi cercado pela multidão e a PM te deteve! Fiança paga.',
        successMessage: 'Aparelho desbloqueado e vendido na Santa Ifigênia por R$ 1.200!'
      },
      pendura: {
        title: 'Dar a Pendura (Sair sem Pagar a Conta)',
        reward: 250,
        successRate: 0.75,
        serasaPenalty: 20,
        healthRisk: 5,
        failMessage: 'O garçom te alcançou na esquina e você passou a maior vergonha pública!',
        successMessage: 'Você saiu de fininho enquanto o garçom foi à cozinha! Economizou R$ 250.'
      },
      bilhete: {
        title: 'Golpe do Bilhete Premiado',
        reward: 3500,
        successRate: 0.45,
        serasaPenalty: 50,
        healthRisk: 0,
        failMessage: 'A vítima desconfiou e chamou a viatura da polícia!',
        successMessage: 'Golpe do bilhete efetuado com sucesso! Lucrou R$ 3.500 no Pix.'
      },
      racha: {
        title: 'Racha Noturno Clandestino de Carros',
        reward: 2500,
        successRate: 0.50,
        serasaPenalty: 30,
        healthRisk: 25,
        requiresVehicle: true,
        failMessage: 'Batida violenta na curva do racha! Carro amassado e hospital.',
        successMessage: 'Venceu o racha com motor roncando! Levou R$ 2.500 de aposta!'
      },
      phishing: {
        title: 'Golpe de Phishing & Clonagem Bancária',
        reward: 6000,
        successRate: 0.55,
        serasaPenalty: 60,
        healthRisk: 0,
        minIntellect: 35,
        failMessage: 'A divisão de crimes cibernéticos rastreou o IP do servidor falso!',
        successMessage: 'Página falsa capturou credenciais! Pix de R$ 6.000 para a conta.'
      },
      contrabando: {
        title: 'Contrabando de Eletrônicos da Fronteira',
        reward: 8500,
        successRate: 0.45,
        serasaPenalty: 70,
        healthRisk: 15,
        failMessage: 'A Receita Federal e a Polícia Rodoviária apreenderam o porta-malas!',
        successMessage: 'Carga de iPhones e videogames descarregada sem fiscalização! +R$ 8.500.'
      },
      roubo_carga: {
        title: 'Roubo de Carga em Rodovia',
        reward: 28000,
        successRate: 0.35,
        serasaPenalty: 120,
        healthRisk: 40,
        failMessage: 'Troca de tiros com a escolta armada! Você foi ferido e fichado.',
        successMessage: 'Caminhão de eletrônicos interceptado e receptado! Faturou R$ 28.000!'
      },
      lavagem: {
        title: 'Lavagem de Dinheiro em Empresa de Fachada',
        reward: 45000,
        successRate: 0.40,
        serasaPenalty: 150,
        healthRisk: 0,
        minIntellect: 50,
        requiresCash: 5000,
        failMessage: 'Operação da Polícia Federal deflagrada com mandado de busca e apreensão!',
        successMessage: 'Notas frias emitidas com sucesso no esquema! Lucro de R$ 45.000 limpo.'
      },
      assalto_banco: {
        title: 'Assalto a Agência Bancária com Maçarico',
        reward: 120000,
        successRate: 0.25,
        serasaPenalty: 300,
        healthRisk: 60,
        requiresCash: 3000,
        failMessage: 'Alarme silencioso disparou e o BOPE cercou todo o quarteirão da agência!',
        successMessage: 'Cofre estourado na calada da noite! Bolada milionária de R$ 120.000!'
      }
    };

    const cfg = CRIMES[crimeType];
    if (!cfg) return { success: false, message: 'Crime desconhecido.' };

    if (cfg.requiresVehicle && !gameState.vehicle) {
      return { success: false, message: 'Você precisa ter um carro ou moto na garagem para disputar racha!' };
    }

    if (cfg.minIntellect && gameState.stats.intelecto < cfg.minIntellect) {
      return { success: false, message: `Requer intelecto técnico de pelo menos ${cfg.minIntellect} pontos!` };
    }

    if (cfg.requiresCash && gameState.stats.grana < cfg.requiresCash) {
      return { success: false, message: `Requer investimento inicial de R$ ${cfg.requiresCash.toLocaleString('pt-BR')} em equipamentos e estrutura!` };
    }

    const isSuccess = Math.random() < cfg.successRate;

    if (isSuccess) {
      playCoinSound();
      setGameState((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          grana: prev.stats.grana + cfg.reward - (cfg.requiresCash || 0),
          felicidade: Math.min(100, prev.stats.felicidade + 20)
        },
        serasa: {
          ...prev.serasa,
          score: Math.max(50, prev.serasa.score - cfg.serasaPenalty)
        },
        logs: [
          {
            id: `crime_win_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: `Crime Executado: ${cfg.title} 💰`,
            description: `${cfg.successMessage} -${cfg.serasaPenalty} pontos no Serasa Score.`,
            type: 'financial'
          },
          ...prev.logs
        ]
      }));
      confetti({ particleCount: 50, spread: 60 });
      return { success: true, message: `Sucesso no crime! ${cfg.successMessage}` };
    } else {
      playErrorSound();
      setGameState((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          grana: Math.max(0, prev.stats.grana - (cfg.requiresCash || 0) - 500),
          saude: Math.max(10, prev.stats.saude - cfg.healthRisk),
          felicidade: Math.max(0, prev.stats.felicidade - 25)
        },
        serasa: {
          ...prev.serasa,
          score: Math.max(50, prev.serasa.score - (cfg.serasaPenalty * 1.5))
        },
        logs: [
          {
            id: `crime_fail_${Date.now()}`,
            year: prev.character.year,
            age: prev.character.age,
            title: `CRIME FALHOU: ${cfg.title} 🚨`,
            description: `${cfg.failMessage} Consequências policiais e penais severas.`,
            type: 'milestone'
          },
          ...prev.logs
        ]
      }));
      return { success: false, message: `Deu ruim! ${cfg.failMessage}` };
    }
  };

  const handleFameAction = (fameType: 'reality' | 'podcast' | 'passarela'): { success: boolean; message: string } => {
    playClickSound();
    if (fameType === 'reality') {
      const isSelected = Math.random() < 0.35 || (gameState.influencer?.followers || 0) > 10000;
      if (isSelected) {
        playSuccessSound();
        const gainedFollowers = 85000;
        const prize = 15000;
        setGameState((prev) => ({
          ...prev,
          stats: { ...prev.stats, grana: prev.stats.grana + prize, felicidade: Math.min(100, prev.stats.felicidade + 40) },
          influencer: {
            followers: (prev.influencer?.followers || 1420) + gainedFollowers,
            postsCount: (prev.influencer?.postsCount || 0) + 15,
            totalEarningsFromPublis: (prev.influencer?.totalEarningsFromPublis || 0) + prize,
            fameLevel: 85
          },
          logs: [{ id: `bbb_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: 'Reality Show BBB!', description: `+85 mil seguidores e prêmio de R$ 15.000.`, type: 'milestone' }, ...prev.logs]
        }));
        return { success: true, message: 'Participou do Reality na TV! +85.000 seguidores!' };
      } else {
        return { success: false, message: 'Não foi selecionado para o Reality desta vez.' };
      }
    }

    if (fameType === 'podcast') {
      const gained = 4000;
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, felicidade: Math.min(100, prev.stats.felicidade + 15) },
        influencer: {
          followers: (prev.influencer?.followers || 1420) + gained,
          postsCount: (prev.influencer?.postsCount || 0) + 1,
          totalEarningsFromPublis: prev.influencer?.totalEarningsFromPublis || 0,
          fameLevel: Math.min(100, (prev.influencer?.fameLevel || 10) + 10)
        },
        logs: [{ id: `pod_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: 'Podcast Famoso', description: 'Cortes virais no TikTok! +4.000 seguidores.', type: 'fun' }, ...prev.logs]
      }));
      return { success: true, message: 'Podcast no ar! +4.000 seguidores com cortes no TikTok.' };
    }

    if (fameType === 'passarela') {
      const cachet = 2500;
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, grana: prev.stats.grana + cachet, felicidade: Math.min(100, prev.stats.felicidade + 20) },
        influencer: {
          followers: (prev.influencer?.followers || 1420) + 2500,
          postsCount: (prev.influencer?.postsCount || 0) + 2,
          totalEarningsFromPublis: (prev.influencer?.totalEarningsFromPublis || 0) + cachet
        },
        logs: [{ id: `fashion_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: 'Desfile SPFW', description: 'Cachê de R$ 2.500 na passarela.', type: 'milestone' }, ...prev.logs]
      }));
      return { success: true, message: 'Desfile realizado! Cachê de R$ 2.500 recebido.' };
    }

    return { success: false, message: 'Ação realizada.' };
  };

  const handleFertilityAction = (actionType: 'adocao' | 'vasectomia' | 'inseminacao' | 'doar_semen' | 'barriga_aluguel', ageRange?: string, isFastProcess?: boolean): { success: boolean; message: string } => {
    playClickSound();
    if (actionType === 'adocao') {
      const cost = isFastProcess ? 12000 : 0;
      if (cost > 0) {
        const payCheck = processPayment(cost);
        if (!payCheck.success) return { success: false, message: payCheck.message || 'Sem saldo.' };
        setGameState((prev) => deductCost(prev, cost, payCheck.paidBy));
      }

      const childName = gameState.character.gender === 'M' ? 'Enzo' : 'Sophia';
      const newChild: ChildMember = {
        id: `child_${Date.now()}`,
        name: `${childName} Silva`,
        age: ageRange === 'Bebê (0–2a)' ? 1 : ageRange === 'Criança (3–8a)' ? 5 : 11,
        gender: Math.random() > 0.5 ? 'M' : 'F',
        isAdopted: true,
        affection: 100
      };

      setGameState((prev) => ({
        ...prev,
        family: {
          ...prev.family,
          parents: prev.family?.parents || [],
          siblings: prev.family?.siblings || [],
          children: [...(prev.family?.children || []), newChild]
        },
        stats: { ...prev.stats, felicidade: Math.min(100, prev.stats.felicidade + 35) },
        logs: [{ id: `ado_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Adoção: ${newChild.name}`, description: `Adoção legal concluída!`, type: 'milestone' }, ...prev.logs]
      }));
      return { success: true, message: `🎉 Adoção de ${newChild.name} concluída com sucesso!` };
    }

    if (actionType === 'vasectomia') {
      const cost = 1500;
      const payCheck = processPayment(cost);
      if (!payCheck.success) return { success: false, message: payCheck.message || 'Sem saldo.' };

      setGameState((prev) => deductCost({
        ...prev,
        character: { ...prev.character, isInfertile: true },
        fertility: { ...prev.fertility, hasVasectomy: true },
        logs: [{ id: `vas_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: 'Vasectomia / Laqueadura 🩺', description: 'Procedimento reprodutivo definitivo realizado. Personagem agora está 100% infértil.', type: 'health' }, ...prev.logs]
      }, cost, payCheck.paidBy));
      return { success: true, message: '🎉 Procedimento reprodutivo (Vasectomia/Laqueadura) concluído! Você se tornou infértil com sucesso.' };
    }

    if (actionType === 'inseminacao') {
      const cost = 18000;
      const payCheck = processPayment(cost);
      if (!payCheck.success) return { success: false, message: payCheck.message || 'Sem saldo.' };

      const newChild: ChildMember = { id: `child_${Date.now()}`, name: 'Bernardo Silva', age: 0, gender: 'M', isAdopted: false, affection: 100 };

      setGameState((prev) => deductCost({
        ...prev,
        family: { ...prev.family, parents: prev.family?.parents || [], siblings: prev.family?.siblings || [], children: [...(prev.family?.children || []), newChild] },
        stats: { ...prev.stats, felicidade: Math.min(100, prev.stats.felicidade + 40) },
        logs: [{ id: `ivf_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: 'Inseminação IVF', description: `Nascimento do bebê ${newChild.name}!`, type: 'milestone' }, ...prev.logs]
      }, cost, payCheck.paidBy));

      return { success: true, message: '✨ Bebê nasceu saudável via fertilização in vitro!' };
    }

    if (actionType === 'doar_semen') {
      playCoinSound();
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, grana: prev.stats.grana + 800 },
        fertility: { ...prev.fertility, hasEggDonated: true },
        logs: [{ id: `donor_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: 'Doação de Gametas', description: 'Recompensado em R$ 800.', type: 'financial' }, ...prev.logs]
      }));
      return { success: true, message: 'Doação no banco reprodutivo efetuada! R$ 800 creditados.' };
    }

    if (actionType === 'barriga_aluguel') {
      const cost = 25000;
      const payCheck = processPayment(cost);
      if (!payCheck.success) return { success: false, message: payCheck.message || 'Sem saldo.' };

      const newChild: ChildMember = { id: `child_${Date.now()}`, name: 'Alice Silva', age: 0, gender: 'F', isAdopted: false, affection: 100 };

      setGameState((prev) => deductCost({
        ...prev,
        family: { ...prev.family, parents: prev.family?.parents || [], siblings: prev.family?.siblings || [], children: [...(prev.family?.children || []), newChild] },
        stats: { ...prev.stats, felicidade: Math.min(100, prev.stats.felicidade + 40) },
        logs: [{ id: `surro_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: 'Cessão Temporária de Útero', description: `Nascimento de ${newChild.name}!`, type: 'milestone' }, ...prev.logs]
      }, cost, payCheck.paidBy));

      return { success: true, message: '🎉 Bebê Alice nasceu através de cessão de útero!' };
    }

    return { success: false, message: 'Ação realizada.' };
  };

  const handleHealthAction = (actionType: 'sus' | 'plano_empresa' | 'plano_particular' | 'consulta_especialista'): { success: boolean; message: string } => {
    playClickSound();
    if (actionType === 'sus') {
      setGameState((prev) => ({ ...prev, stats: { ...prev.stats, saude: Math.min(100, prev.stats.saude + 20) }, logs: [{ id: `sus_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: 'Atendimento SUS', description: 'Consulta no postinho.', type: 'health' }, ...prev.logs] }));
      return { success: true, message: 'Atendido gratuitamente no Postinho SUS! (+20 Saúde)' };
    }

    if (actionType === 'plano_empresa') {
      const hasPlan = gameState.career.benefits?.some((b) => b.name.toLowerCase().includes('saúde') || b.name.toLowerCase().includes('saude'));
      if (!hasPlan) return { success: false, message: 'Seu cargo não oferece Plano de Saúde!' };

      setGameState((prev) => ({ ...prev, stats: { ...prev.stats, saude: Math.min(100, prev.stats.saude + 35) }, logs: [{ id: `plan_emp_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: 'Checkup da Empresa', description: 'Consulta sem custo.', type: 'health' }, ...prev.logs] }));
      return { success: true, message: 'Checkup realizado pelo Plano da Empresa! (+35 Saúde)' };
    }

    if (actionType === 'plano_particular') {
      const cost = 450;
      const payCheck = processPayment(cost);
      if (!payCheck.success) return { success: false, message: payCheck.message || 'Sem saldo.' };

      setGameState((prev) => deductCost({ ...prev, finances: { ...prev.finances, hasPrivateHealthPlan: true }, stats: { ...prev.stats, saude: Math.min(100, prev.stats.saude + 40) }, logs: [{ id: `plan_priv_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: 'Plano Particular Privado', description: 'Atendimento VIP.', type: 'health' }, ...prev.logs] }, cost, payCheck.paidBy));
      return { success: true, message: 'Plano de Saúde Privado ativado! (+40 Saúde)' };
    }

    if (actionType === 'consulta_especialista') {
      const cost = 350;
      const payCheck = processPayment(cost);
      if (!payCheck.success) return { success: false, message: payCheck.message || 'Sem saldo.' };

      setGameState((prev) => deductCost({ ...prev, stats: { ...prev.stats, saude: Math.min(100, prev.stats.saude + 30), felicidade: Math.min(100, prev.stats.felicidade + 15) }, logs: [{ id: `spec_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: 'Consulta Especialista', description: 'Consulta médica VIP.', type: 'health' }, ...prev.logs] }, cost, payCheck.paidBy));
      return { success: true, message: 'Consulta com especialista realizada! (+30 Saúde, +15 Felicidade)' };
    }

    return { success: false, message: 'Ação realizada.' };
  };

  const handleTravelCustom = (travel: { destName: string; basePrice: number; happinessBonus: number; isExec: boolean; companionMode: 'alone' | 'pay_all' | 'split' }): { success: boolean; message: string } => {
    playClickSound();
    let totalCost = travel.basePrice;
    if (travel.isExec) totalCost = Math.round(totalCost * 1.8);
    if (travel.companionMode === 'pay_all') totalCost = Math.round(totalCost * 2);
    if (travel.companionMode === 'split') totalCost = Math.round(totalCost * 1.5);

    const payCheck = processPayment(totalCost);
    if (!payCheck.success) return { success: false, message: payCheck.message || 'Sem saldo.' };

    setGameState((prev) => deductCost({
      ...prev,
      stats: { ...prev.stats, felicidade: Math.min(100, prev.stats.felicidade + travel.happinessBonus + (travel.isExec ? 15 : 0)) },
      logs: [{ id: `trv_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: `Viagem: ${travel.destName}`, description: `Viagem para ${travel.destName}.`, type: 'milestone' }, ...prev.logs]
    }, totalCost, payCheck.paidBy));

    return { success: true, message: `Boa viagem para ${travel.destName}! (+${travel.happinessBonus + (travel.isExec ? 15 : 0)} Felicidade)` };
  };

  const handleUpdateWill = (beneficiary: 'Filhos' | 'Cônjuge' | 'Pais' | 'Caridade') => {
    playClickSound();
    setGameState((prev) => ({
      ...prev,
      will: { beneficiary, percentageToCharity: beneficiary === 'Caridade' ? 100 : 0 },
      logs: [{ id: `will_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: 'Atualização de Testamento', description: `Favoreceu: ${beneficiary}.`, type: 'milestone' }, ...prev.logs]
    }));
  };

  const handleRewindTime = (years: number): { success: boolean; message: string } => {
    playClickSound();
    if ((gameState.timeRewindsLeft || 0) <= 0) {
      playErrorSound();
      return { success: false, message: 'Ampulhetas de Voltar no Tempo esgotadas!' };
    }

    const newAge = Math.max(0, gameState.character.age - years);
    const newYear = gameState.character.year - years;

    setGameState((prev) => ({
      ...prev,
      character: { ...prev.character, age: newAge, year: newYear },
      timeRewindsLeft: (prev.timeRewindsLeft || 3) - 1,
      stats: { ...prev.stats, saude: 100, energia: 100 },
      logs: [{ id: `time_${Date.now()}`, year: newYear, age: newAge, title: '⏳ Voltou no Tempo!', description: `Voltou ${years} anos no tempo!`, type: 'milestone' }, ...prev.logs]
    }));

    return { success: true, message: `⏳ Ampulheta ativada! Você voltou ${years} anos no tempo!` };
  };

  const handleSocialPost = (postType: 'photo' | 'reel' | 'publi' | 'live' | 'comments' | 'vlog' | 'assessoria' | 'polemica' | 'embaixador') => {
    playClickSound();
    const currentFollowers = gameState.influencer?.followers || 1420;
    if (postType === 'photo') {
      const gained = 200 + Math.floor(Math.random() * 250);
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, felicidade: Math.min(100, prev.stats.felicidade + 5) },
        influencer: { followers: (prev.influencer?.followers || 1420) + gained, postsCount: (prev.influencer?.postsCount || 0) + 1, totalEarningsFromPublis: prev.influencer?.totalEarningsFromPublis || 0, fameLevel: (prev.influencer?.fameLevel || 5) + 2 }
      }));
      return { success: true, message: `Foto nos stories! +${gained} seguidores.` };
    }
    if (postType === 'reel') {
      const gained = 500 + Math.floor(Math.random() * 800);
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, felicidade: Math.min(100, prev.stats.felicidade + 10) },
        influencer: { followers: (prev.influencer?.followers || 1420) + gained, postsCount: (prev.influencer?.postsCount || 0) + 1, totalEarningsFromPublis: prev.influencer?.totalEarningsFromPublis || 0, fameLevel: (prev.influencer?.fameLevel || 5) + 5 }
      }));
      return { success: true, message: `Reels viralizou no TikTok/Insta! +${gained} seguidores! 🚀` };
    }
    if (postType === 'publi') {
      const earnings = Math.max(300, Math.floor(currentFollowers * 0.45));
      playCoinSound();
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, grana: prev.stats.grana + earnings, felicidade: Math.min(100, prev.stats.felicidade + 15) },
        influencer: { followers: prev.influencer?.followers || 1420, postsCount: (prev.influencer?.postsCount || 0) + 1, totalEarningsFromPublis: (prev.influencer?.totalEarningsFromPublis || 0) + earnings, fameLevel: prev.influencer?.fameLevel || 5 }
      }));
      return { success: true, message: `Post patrocinado (#publi)! Marca pagou R$ ${earnings.toLocaleString('pt-BR')} no PIX!` };
    }
    if (postType === 'live') {
      const gained = 1000 + Math.floor(Math.random() * 1500);
      const donations = 250 + Math.floor(Math.random() * 500);
      playCoinSound();
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, grana: prev.stats.grana + donations, felicidade: Math.min(100, prev.stats.felicidade + 20) },
        influencer: { followers: (prev.influencer?.followers || 1420) + gained, postsCount: (prev.influencer?.postsCount || 0) + 1, totalEarningsFromPublis: (prev.influencer?.totalEarningsFromPublis || 0) + donations, fameLevel: (prev.influencer?.fameLevel || 5) + 8 }
      }));
      return { success: true, message: `Live Bombou! +${gained} novos seguidores e R$ ${donations} em doações dos fãs!` };
    }
    if (postType === 'comments') {
      const gained = 350 + Math.floor(Math.random() * 200);
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, felicidade: Math.min(100, prev.stats.felicidade + 10) },
        influencer: { followers: (prev.influencer?.followers || 1420) + gained, postsCount: prev.influencer?.postsCount || 1, totalEarningsFromPublis: prev.influencer?.totalEarningsFromPublis || 0, fameLevel: (prev.influencer?.fameLevel || 5) + 3 }
      }));
      return { success: true, message: `Respondeu o público e destruiu haters com classe! +${gained} seguidores.` };
    }
    if (postType === 'vlog') {
      const gained = 1800 + Math.floor(Math.random() * 1200);
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, felicidade: Math.min(100, prev.stats.felicidade + 15) },
        influencer: { followers: (prev.influencer?.followers || 1420) + gained, postsCount: (prev.influencer?.postsCount || 0) + 1, totalEarningsFromPublis: prev.influencer?.totalEarningsFromPublis || 0, fameLevel: (prev.influencer?.fameLevel || 5) + 10 }
      }));
      return { success: true, message: `Vlog do YouTube bateu em Alta no Brasil! +${gained} inscritos/seguidores! 📺` };
    }
    if (postType === 'assessoria') {
      if (gameState.stats.grana < 2000) return { success: false, message: 'Saldo insuficiente para contratar a assessoria (R$ 2.000).' };
      const gained = 5000;
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, grana: prev.stats.grana - 2000, felicidade: Math.min(100, prev.stats.felicidade + 20) },
        influencer: { followers: (prev.influencer?.followers || 1420) + gained, postsCount: prev.influencer?.postsCount || 1, totalEarningsFromPublis: prev.influencer?.totalEarningsFromPublis || 0, fameLevel: (prev.influencer?.fameLevel || 5) + 20 }
      }));
      return { success: true, message: `Assessoria de imprensa contratada! Matérias em grandes portais renderam +${gained} seguidores!` };
    }
    if (postType === 'polemica') {
      const gained = 3500;
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, felicidade: Math.min(100, prev.stats.felicidade + 10) },
        serasa: { ...prev.serasa, score: Math.max(50, prev.serasa.score - 15) },
        influencer: { followers: (prev.influencer?.followers || 1420) + gained, postsCount: (prev.influencer?.postsCount || 0) + 1, totalEarningsFromPublis: prev.influencer?.totalEarningsFromPublis || 0, fameLevel: (prev.influencer?.fameLevel || 5) + 15 }
      }));
      return { success: true, message: `Trend Polêmica Cancelamento! Trending Topics no Twitter rendeu +${gained} seguidores!` };
    }
    if (postType === 'embaixador') {
      if ((gameState.influencer?.followers || 0) < 10000) {
        return { success: false, message: 'Você precisa de pelo menos 10.000 seguidores para se tornar Embaixador de Marca de Luxo!' };
      }
      const earnings = 15000;
      playCoinSound();
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, grana: prev.stats.grana + earnings, felicidade: Math.min(100, prev.stats.felicidade + 30) },
        influencer: { followers: (prev.influencer?.followers || 10000) + 2000, postsCount: (prev.influencer?.postsCount || 0) + 1, totalEarningsFromPublis: (prev.influencer?.totalEarningsFromPublis || 0) + earnings, fameLevel: (prev.influencer?.fameLevel || 5) + 25 }
      }));
      return { success: true, message: `💎 Contrato de Embaixador de Marca assinado! Recebeu R$ ${earnings.toLocaleString('pt-BR')} de adiantamento!` };
    }
    return { success: false, message: 'Interação concluída.' };
  };

  const handleDonate = (type: 'cesta' | 'sangue') => {
    playClickSound();
    if (type === 'cesta') {
      if (gameState.stats.grana < 100) return { success: false, message: 'Precisa de R$ 100.' };
      setGameState((prev) => ({
        ...prev,
        stats: { ...prev.stats, grana: prev.stats.grana - 100, felicidade: Math.min(100, prev.stats.felicidade + 15) },
        serasa: { ...prev.serasa, score: Math.min(1000, prev.serasa.score + 30) }
      }));
      return { success: true, message: 'Cesta básica doada com carinho! (+15 Felicidade, +30 Serasa)' };
    }
    if (type === 'sangue') {
      setGameState((prev) => ({ ...prev, stats: { ...prev.stats, felicidade: Math.min(100, prev.stats.felicidade + 20), saude: Math.min(100, prev.stats.saude + 10) } }));
      return { success: true, message: 'Doação de sangue realizada! (+20 Felicidade)' };
    }
    return { success: false, message: 'Ação realizada.' };
  };

  const handlePlayJogoDoBicho = (bichoName: string, betAmount: number) => {
    if (gameState.character.age < 15) {
      return { success: false, message: 'Menores de 15 anos não têm acesso a jogos de azar e Jogo do Bicho!', won: false, payout: 0 };
    }
    playClickSound();
    if (gameState.stats.grana < betAmount) return { success: false, message: 'Saldo insuficiente.', won: false, payout: 0 };
    const randomBicho = ['Cachorro', 'Gato', 'Jacaré', 'Leão', 'Vira-Lata', 'Borboleta', 'Galo', 'Touro'][Math.floor(Math.random() * 8)];
    const won = randomBicho.toLowerCase() === bichoName.toLowerCase() || Math.random() < 0.25;
    const payout = won ? betAmount * 18 : 0;

    if (won) playCoinSound();

    setGameState((prev) => ({
      ...prev,
      stats: { ...prev.stats, grana: prev.stats.grana - betAmount + payout, felicidade: Math.min(100, prev.stats.felicidade + (won ? 25 : -5)) },
      logs: [{ id: `bicho_${Date.now()}`, year: prev.character.year, age: prev.character.age, title: won ? `Ganhou no Jogo do Bicho!` : `Aposta no Bicho (${bichoName})`, description: won ? `Ganhou R$ ${payout.toLocaleString('pt-BR')}!` : `Perdeu R$ ${betAmount}.`, type: 'fun' }, ...prev.logs]
    }));

    return { success: true, won, payout, message: won ? `DEU SORTE! Faturou R$ ${payout.toLocaleString('pt-BR')}!` : `Deu ${randomBicho} na cabeça!` };
  };

  const handlePlayTigrinho = (betAmount: number) => {
    if (gameState.character.age < 15) {
      return { success: false, message: 'Menores de 15 anos não têm acesso a jogos de cassino e apostas do Tigrinho!', won: false, payout: 0 };
    }
    playClickSound();
    if (gameState.stats.grana < betAmount) return { success: false, message: 'Saldo insuficiente.', won: false, payout: 0 };
    const won = Math.random() < 0.45;
    const mult = won ? (2 + Math.floor(Math.random() * 4)) : 0;
    const payout = betAmount * mult;

    if (won) playCoinSound();

    setGameState((prev) => ({
      ...prev,
      stats: { ...prev.stats, grana: prev.stats.grana - betAmount + payout, felicidade: Math.min(100, prev.stats.felicidade + (won ? 20 : -5)) }
    }));

    return { success: true, won, payout, message: won ? `SOLTOU A CARTA! Pagou R$ ${payout.toLocaleString('pt-BR')} (${mult}x)! 🐯🚀` : `Giro zerado! O Tigrinho segurou.` };
  };

  // Succession Handlers in GameOverModal
  const handleContinueAsRelative = (candidate: { name: string; relation: string; age?: number; inheritanceShare: number }) => {
    const newState = createInitialState({
      name: candidate.name,
      age: candidate.age || 18,
      familyClass: 'Média-Alta',
      city: gameState.character.currentCity,
      state: gameState.character.birthState,
      initialCashBonus: candidate.inheritanceShare,
      originTrait: `Legado de ${gameState.character.name}`,
      originDescription: `${candidate.relation} que assumiu o patrimônio familiar de R$ ${candidate.inheritanceShare.toLocaleString('pt-BR')} deixado por ${gameState.character.name}.`
    });

    setGameState(newState);
    setIsGameOverModalOpen(false);
    setViewMode('game');
  };

  const handleReincarnateWithFlashback = () => {
    const newState = createInitialState({
      name: 'Reencarnado Silva',
      familyClass: 'Média-Baixa',
      intelectoBonus: 15,
      originTrait: 'Memória da Vida Anterior',
      originDescription: 'Trouxe flashes de sabedoria e conhecimento acumulados de sua encarnação passada!'
    });

    setGameState(newState);
    setIsGameOverModalOpen(false);
    setViewMode('game');
  };

  const handleApplyWorkplaceDilemmaConsequence = (data: {
    felicidade?: number;
    grana?: number;
    saude?: number;
    serasa?: number;
    efficiency?: number;
    logTitle: string;
    logDesc: string;
  }) => {
    setGameState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        felicidade: Math.min(100, Math.max(0, prev.stats.felicidade + (data.felicidade || 0))),
        grana: Math.max(0, prev.stats.grana + (data.grana || 0)),
        saude: Math.min(100, Math.max(0, prev.stats.saude + (data.saude || 0)))
      },
      serasa: {
        ...prev.serasa,
        score: Math.min(1000, Math.max(50, prev.serasa.score + (data.serasa || 0)))
      },
      career: {
        ...prev.career,
        efficiency: Math.min(100, Math.max(0, (prev.career.efficiency || 50) + (data.efficiency || 0)))
      },
      logs: [
        {
          id: `work_dil_${Date.now()}`,
          year: prev.character.year,
          age: prev.character.age,
          title: data.logTitle,
          description: data.logDesc,
          type: 'milestone'
        },
        ...prev.logs
      ]
    }));
  };

  const handleUpdateWeeklySchedule = (items: any[]) => {
    setGameState((prev) => ({
      ...prev,
      weeklySchedule: {
        items
      }
    }));
  };

  // Welcome Screen & Multi-Save Actions
  const handleStartGame = (params: any) => {
    const newState = createInitialState(params);
    setGameState(newState);
    setViewMode('game');
    setIsNewCharModalOpen(false);
    setIsGameOverModalOpen(false);
  };

  const handleSelectSlot = (slot: SavedLifeSlot) => {
    setGameState(slot.state);
    setViewMode('game');
  };

  const handleDeleteSlot = (slotId: string) => {
    setSavedSlots((prev) => {
      const filtered = prev.filter((s) => s.id !== slotId);
      try {
        localStorage.setItem(STORAGE_SAVES_KEY, JSON.stringify(filtered));
      } catch (e) {}
      return filtered;
    });
  };

  const toggleSound = () => {
    const nextVal = !soundOn;
    setSoundOn(nextVal);
    setSoundEnabled(nextVal);
  };

  if (viewMode === 'welcome') {
    return (
      <>
        <HomeWelcomeScreen
          savedSlots={savedSlots}
          onSelectSlot={handleSelectSlot}
          onDeleteSlot={handleDeleteSlot}
          onStartNewGame={() => setIsNewCharModalOpen(true)}
        />
        <NewCharacterModal
          isOpen={isNewCharModalOpen}
          onStartGame={handleStartGame}
          onClose={() => setIsNewCharModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] flex justify-center selection:bg-[#93f7b4] selection:text-[#00210e] transition-colors duration-300">
      {/* Outer Shell for Desktop & Tablet centering */}
      <div className="w-full max-w-[1360px] mx-auto px-0 sm:px-4 py-0 sm:py-6 flex justify-center gap-6 items-start">
        {/* Left Flanking Panel (Desktop Only) */}
        <DesktopSidebar gameState={gameState} position="left" />

        {/* Central Ergonomic Mobile Container */}
        <main className="w-full max-w-[460px] bg-[var(--bg-color)] min-h-[100dvh] sm:min-h-[92vh] flex flex-col relative rounded-none sm:rounded-3xl sm:border sm:border-[#e4e1d7] sm:shadow-[0px_8px_32px_rgba(20,30,24,0.06)] overflow-hidden transition-colors duration-300">
          {/* Top Sticky Header */}
          <HeaderNav
            character={gameState.character}
            career={gameState.career}
            serasa={gameState.serasa}
            selectedTab={gameState.selectedTab}
            onSelectTab={(tab) => setGameState((prev) => ({ ...prev, selectedTab: tab }))}
            onNewGame={() => setViewMode('welcome')}
            onOpenDocuments={() => setIsDocumentModalOpen(true)}
            onOpenInventory={() => setIsInventoryModalOpen(true)}
          />

          {/* Main Content Area */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
            {/* TAB 1: INÍCIO / VIDA */}
            {gameState.selectedTab === 'historia' ? (
              <div className="space-y-3">
                {/* 1. Perfil do Personagem (Toy Block Card com Cabeça LEGO) */}
                <HomeCharacterProfileCard
                  character={gameState.character}
                  career={gameState.career}
                  stats={gameState.stats}
                />

                {/* 2. Medidores Táteis de Atributos Vitais (LEGO Capsule Gauges) */}
                <VitalStatsBars stats={gameState.stats} />

                {/* Current Story / Milestone Dilemma Card if exists */}
                {gameState.currentDilemma && (
                  <DilemmaCard
                    dilemma={gameState.currentDilemma}
                    character={gameState.character}
                    onChoose={handleChooseDilemma}
                  />
                )}

                {/* 3. Botão Principal de Passagem de Ano (Toy-Button 3D) */}
                <AdvanceYearButton
                  onAdvance={handleAdvanceYear}
                  currentAge={gameState.character.age}
                  currentYear={gameState.character.year}
                  timeAdvanceMode={gameState.timeAdvanceMode}
                  timeSubPeriod={gameState.timeSubPeriod}
                  disabled={!gameState.character.alive}
                />

                {/* 4. Diário da Vida Real */}
                <LifeTimeline logs={gameState.logs} />
              </div>
            ) : (
              /* Vital Stats Bars for other tabs */
              <VitalStatsBars stats={gameState.stats} />
            )}

            {/* TAB 2: CARREIRA & ESTUDOS (ENSINO) */}
            {gameState.selectedTab === 'carreira' && (
              <CareerTab
                character={gameState.character}
                career={gameState.career}
                stats={gameState.stats}
                educationSystem={gameState.educationSystem}
                onApplyJob={handleApplyJob}
                onTakeConcurso={handleTakeConcurso}
                onEnrollCollege={handleEnrollCollege}
                onRequestPromotion={handleRequestPromotion}
                onAdvanceSchoolYear={handleAdvanceSchoolYear}
                onStudyDaily={handleStudyDaily}
                onAdvanceCollegeYear={handleAdvanceCollegeYear}
                onUseBenefitAction={handleUseBenefitAction}
                onTriggerWorkplaceDilemma={handleTriggerWorkplaceDilemma}
                onRetire={handleRetire}
                onDoSideJob={handleDoSideJob}
                onOpenJobVacanciesModal={() => setIsJobVacanciesModalOpen(true)}
                onTakeVacation={handleTakeVacation}
              />
            )}

            {/* TAB 3: BANCO & FINANÇAS */}
            {gameState.selectedTab === 'financas' && (
              <BankTab
                finances={gameState.finances}
                serasa={gameState.serasa}
                checkingBalance={gameState.stats.grana}
                character={gameState.character}
                housing={gameState.housing}
                vehicle={gameState.vehicle}
                pet={gameState.pet}
                relationship={gameState.relationship}
                will={gameState.will}
                company={gameState.company}
                family={gameState.family}
                onDepositCDI={handleDepositCDI}
                onWithdrawCDI={handleWithdrawCDI}
                onPayDebt={handlePayDebt}
                onPayCreditCard={handlePayCreditCard}
                onRequestCreditCard={handleRequestCreditCard}
                onCancelCreditCard={handleCancelCreditCard}
                onPlayMegaSena={handlePlayMegaSena}
                onUpdateAdvancedWill={handleUpdateAdvancedWill}
              />
            )}

            {/* TAB 4: ROLÊS & ATIVIDADES */}
            {gameState.selectedTab === 'roles' && (
              <ActivitiesTab
                stats={gameState.stats}
                pet={gameState.pet}
                relationship={gameState.relationship}
                onDoActivity={handleDoActivity}
              />
            )}

            {/* TAB 5: BENS & PATRIMÔNIO */}
            {gameState.selectedTab === 'patrimonio' && (
              <AssetsTab
                housing={gameState.housing}
                vehicle={gameState.vehicle}
                pet={gameState.pet}
                relationship={gameState.relationship}
                achievements={gameState.achievements}
                stats={gameState.stats}
                resolvedConflicts={gameState.resolvedConflicts}
                logs={gameState.logs}
                character={gameState.character}
                finances={gameState.finances}
                company={gameState.company}
                onBuyVehicle={handleBuyVehicle}
                onChangeHousing={handleChangeHousing}
                onBuyHomeItem={handleBuyHomeItem}
                onPerformRenovation={handlePerformRenovation}
                onDoHomeAction={handleDoHomeAction}
                onMaintainVehicle={handleMaintainVehicle}
                onDatePartner={handleDatePartner}
                onMarryPartner={handleMarryPartner}
                onResolveConflict={handleResolveConflict}
              />
            )}

            {/* TAB 6: FAMÍLIA & RELACIONAMENTOS */}
            {gameState.selectedTab === 'familia' && (
              <FamilyTab
                character={gameState.character}
                stats={gameState.stats}
                relationship={gameState.relationship}
                housing={gameState.housing}
                family={gameState.family}
                pet={gameState.pet}
                timeSubPeriod={gameState.timeSubPeriod || 1}
                onUpdateAffection={handleUpdateAffection}
                onDoFamilyAction={handleDoFamilyAction}
                onAdoptPet={handleAdoptPet}
                onPartnerAction={handlePartnerAction}
                onRequestFamilyMoney={onRequestFamilyMoney}
                onAddRandomFriend={handleAddRandomFriend}
                onFriendAction={handleFriendAction}
                onPlanFamilyEvent={handlePlanFamilyEvent}
                onOpenWeddingPlanner={() => setIsWeddingPlannerOpen(true)}
              />
            )}

            {/* TAB 7: MAIS & MÓDULOS DE JOGABILIDADE */}
            {gameState.selectedTab === 'mais' && (
              <MoreTab
                character={gameState.character}
                stats={gameState.stats}
                career={gameState.career}
                influencer={gameState.influencer || { followers: 1420, postsCount: 5, totalEarningsFromPublis: 0, fameLevel: 10 }}
                fertility={gameState.fertility}
                will={gameState.will}
                company={gameState.company}
                achievements={gameState.achievements}
                soundEnabled={soundOn}
                onToggleSound={toggleSound}
                onPlayTigrinho={handlePlayTigrinho}
                onPlayJogoDoBicho={handlePlayJogoDoBicho}
                onSocialPost={handleSocialPost}
                onHealthAction={handleHealthAction}
                onTravelCustom={handleTravelCustom}
                onDonate={handleDonate}
                onCrimeAction={handleCrimeAction}
                onFameAction={handleFameAction}
                onFertilityAction={handleFertilityAction}
                onResignOrLayoff={handleResignOrLayoff}
                onUpdateWill={handleUpdateWill}
                onRewindTime={handleRewindTime}
                onCreateCompany={handleCreateCompany}
                onHireEmployee={handleHireEmployee}
                onPromoteEmployee={handlePromoteEmployee}
                onFireEmployee={handleFireEmployee}
                onExpandBranch={handleExpandBranch}
                onFranchiseCompany={handleFranchiseCompany}
                onLaunchIPO={handleLaunchIPO}
                onSellCompany={handleSellCompany}
                onArrendarTerra={handleArrendarTerra}
                onPlant={handlePlant}
                onMoveAbroad={handleMoveAbroad}
                onBuyMarketplaceItem={handleBuyMarketplaceItem}
                onTinderMatch={handleTinderMatch}
                driverLicense={gameState.driverLicense}
                onEarnCNH={handleEarnCNH}
                onOpenCreatorMode={() => setIsCreatorModalOpen(true)}
                onSaveGame={() => saveGameStateToSlots(gameState)}
                onNewGame={() => setIsNewCharModalOpen(true)}
                onGoHomeSaves={() => setViewMode('welcome')}
                timeAdvanceMode={gameState.timeAdvanceMode}
                onChangeTimeMode={handleChangeTimeMode}
                onGenderTransition={handleGenderTransition}
                onChangeOrientation={handleChangeOrientation}
                onSalonAction={handleSalonAction}
                onUpdateCharacterSettings={handleUpdateCharacterSettings}
                gameState={gameState}
                currentNews={gameState.currentNews}
                onReactToNews={handleReactToNews}
                onCelebrate={handleCelebrate}
                onApplyDilemmaConsequence={handleApplyWorkplaceDilemmaConsequence}
                weeklySchedule={gameState.weeklySchedule}
                onUpdateWeeklySchedule={handleUpdateWeeklySchedule}
                onOpenWhatsNew={handleOpenWhatsNew}
                onTestVersionNotice={handleTestVersionNotice}
              />
            )}
          </div>
        </main>

        {/* Right Flanking Panel (Desktop Only) */}
        <DesktopSidebar gameState={gameState} position="right" />
      </div>

      {/* Balão Visual / Toast de Notificação de Atualização (Bullet Journal Style) */}
      <VersionNotificationToast
        isOpen={showVersionToast}
        version={serverVersionInfo?.version || '2.5.0'}
        onUpdate={handleForceUpdateAndReload}
        onDismiss={handleDismissVersionToast}
      />

      {/* Modal "Novidades da Versão!" com os novos recursos recém-lançados */}
      <VersionWhatsNewModal
        isOpen={isWhatsNewModalOpen}
        version={serverVersionInfo?.version || '2.5.0'}
        onClose={() => setIsWhatsNewModalOpen(false)}
        onTriggerTestNotice={handleTestVersionNotice}
      />

      {/* Official Character Document Modal (RG Digital, Serasa, CTPS) */}
      <CharacterDocumentModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        character={gameState.character}
        career={gameState.career}
        serasa={gameState.serasa}
        housing={gameState.housing}
        vehicle={gameState.vehicle}
        pet={gameState.pet}
        relationship={gameState.relationship}
      />

      {/* New Character Creation Modal */}
      <NewCharacterModal
        isOpen={isNewCharModalOpen}
        onStartGame={handleStartGame}
        onClose={() => setIsNewCharModalOpen(false)}
      />

      {/* Creator / Sandbox Mode Modal */}
      <CreatorModeModal
        isOpen={isCreatorModalOpen}
        onClose={() => setIsCreatorModalOpen(false)}
        gameState={gameState}
        onUpdateCreatorState={handleUpdateCreatorState}
      />

      {/* Game Over / Retirement Modal */}
      {isGameOverModalOpen && (
        <GameOverModal
          gameState={gameState}
          onContinueAsRelative={handleContinueAsRelative}
          onReincarnateWithFlashback={handleReincarnateWithFlashback}
          onRestartNewChar={() => {
            setIsGameOverModalOpen(false);
            setIsNewCharModalOpen(true);
          }}
        />
      )}
      {/* Pop-up de Eventos Bomba (Morte, Gravidez, Prisão, etc) */}
      <EventBombaModal
        eventData={eventBombaModal}
        onClose={() => setEventBombaModal(null)}
      />

      {/* Job Vacancies Modal (+30 Cargos) */}
      <JobVacanciesModal
        isOpen={isJobVacanciesModalOpen}
        onClose={() => setIsJobVacanciesModalOpen(false)}
        character={gameState.character}
        career={gameState.career}
        stats={gameState.stats}
        educationSystem={gameState.educationSystem}
        onApplyJob={handleApplyJob}
      />

      {/* Inventory Backpack Modal */}
      <InventoryModal
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        inventory={gameState.inventory || []}
        stats={gameState.stats}
        onUseItem={handleUseInventoryItem}
      />

      {/* Modal de Pagamento à Vista vs Cartão de Crédito para Compras > R$ 500 */}
      <PurchasePaymentModal
        isOpen={purchaseModalState.isOpen}
        title={purchaseModalState.title}
        cost={purchaseModalState.cost}
        cashBalance={gameState.stats.grana}
        creditCardLimit={gameState.finances?.creditCardLimit || gameState.finances?.creditCard?.limit || 5000}
        creditCardUsed={gameState.finances?.creditCardUsed || gameState.finances?.creditCard?.used || 0}
        hasCreditCard={gameState.finances?.creditCard?.hasCard ?? true}
        onClose={() => setPurchaseModalState({ ...purchaseModalState, isOpen: false })}
        onConfirm={(method) => {
          purchaseModalState.onConfirm(method);
        }}
      />

      {/* Modal Interativo de Planejamento do Casamento dos Sonhos */}
      <WeddingPlannerModal
        isOpen={isWeddingPlannerOpen}
        onClose={() => setIsWeddingPlannerOpen(false)}
        gameState={gameState}
        onConfirmWedding={handleConfirmWeddingPlan}
      />

      {/* Toast Notificação de Auto-Salvamento */}
      {autoSaveToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-emerald-400 border border-emerald-500/50 px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md text-xs font-bold font-heading flex items-center gap-2 animate-bounce">
          <span>💾</span>
          <span>{autoSaveToast}</span>
        </div>
      )}
    </div>
  );
}
