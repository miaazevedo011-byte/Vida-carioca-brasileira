import React, { useState } from 'react';
import { Character, Stats, SocialInfluencerState, Achievement, Career, FamilyState, FertilityState, WillState, CompanyState, DriverLicenseState, Vehicle, GameState, WeeklyScheduleState, WeeklyScheduleItem } from '../../types/game';
import { Sparkles, Dices, Instagram, HeartPulse, Plane, HeartHandshake, Award, Settings, RefreshCw, Save, DollarSign, Trophy, ArrowRight, ShieldCheck, CheckCircle2, Skull, Tv, Baby, Clock, Scale, UserX, FileCheck, Volume2, VolumeX, History, Home, Building2, Sliders, Zap, Car, Bike, ShoppingBag, Smartphone, Calendar } from 'lucide-react';
import { BusinessModule } from '../BusinessModule';
import { SmartphoneModal } from '../SmartphoneModal';
import { playClickSound, playSuccessSound, playErrorSound, playCoinSound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { useTheme, THEMES, AVAILABLE_THEME_KEYS, ThemeKey } from '../../context/ThemeContext';

interface MoreTabProps {
  character: Character;
  stats: Stats;
  career: Career;
  influencer: SocialInfluencerState;
  fertility?: FertilityState;
  will?: WillState;
  company?: CompanyState;
  driverLicense?: DriverLicenseState;
  achievements: Achievement[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPlayTigrinho: (betAmount: number) => { success: boolean; message: string; won: boolean; payout: number };
  onPlayJogoDoBicho: (bichoName: string, betAmount: number) => { success: boolean; message: string; won: boolean; payout: number };
  onSocialPost: (postType: 'photo' | 'reel' | 'publi' | 'live' | 'comments' | 'vlog' | 'assessoria' | 'polemica' | 'embaixador') => { success: boolean; message: string; followersGained?: number; moneyEarned?: number };
  onHealthAction: (actionType: 'sus' | 'plano_empresa' | 'plano_particular' | 'consulta_especialista') => { success: boolean; message: string };
  onTravelCustom: (travel: { destName: string; basePrice: number; happinessBonus: number; isExec: boolean; companionMode: 'alone' | 'pay_all' | 'split' }) => { success: boolean; message: string };
  onDonate: (type: 'cesta' | 'sangue') => { success: boolean; message: string };
  onCrimeAction: (crimeType: 'furto_celular' | 'pendura' | 'bilhete' | 'racha' | 'phishing' | 'contrabando' | 'roubo_carga' | 'lavagem' | 'assalto_banco') => { success: boolean; message: string };
  onFameAction: (fameType: 'reality' | 'podcast' | 'passarela') => { success: boolean; message: string };
  onFertilityAction: (actionType: 'adocao' | 'vasectomia' | 'inseminacao' | 'doar_semen' | 'barriga_aluguel', ageRange?: string, isFastProcess?: boolean) => { success: boolean; message: string };
  onResignOrLayoff: (mode: 'pedir_demissao' | 'demissao_sem_justa_causa') => { success: boolean; message: string; severancePay?: number };
  onUpdateWill: (beneficiary: 'Filhos' | 'Cônjuge' | 'Pais' | 'Caridade') => void;
  onRewindTime: (years: number) => { success: boolean; message: string };
  onCreateCompany: (data: { name: string; sector: CompanyState['sector']; legalType: CompanyState['legalType'] }) => { success: boolean; message: string };
  onHireEmployee: (candidate: any) => { success: boolean; message: string };
  onPromoteEmployee: (empId: string) => { success: boolean; message: string };
  onFireEmployee: (empId: string) => { success: boolean; message: string };
  onExpandBranch: () => { success: boolean; message: string };
  onFranchiseCompany: () => { success: boolean; message: string };
  onLaunchIPO: () => { success: boolean; message: string };
  onSellCompany: () => { success: boolean; message: string; payout?: number };
  onArrendarTerra: () => { success: boolean; message: string };
  onPlant: (cropId: string, level: 'economico' | 'padrao' | 'completo') => { success: boolean; message: string };
  onMoveAbroad: (city: string) => { success: boolean; message: string };
  onBuyMarketplaceItem: (item: any) => { success: boolean; message: string };
  onTinderMatch: (partnerName: string) => { success: boolean; message: string };
  onEarnCNH: (category: 'A' | 'B' | 'AB') => { success: boolean; message: string };
  onOpenCreatorMode: () => void;
  onSaveGame: () => void;
  onNewGame: () => void;
  onGoHomeSaves: () => void;
  timeAdvanceMode?: 'anual' | 'semestral' | 'mensal';
  onChangeTimeMode?: (mode: 'anual' | 'semestral' | 'mensal') => void;
  onGenderTransition?: (targetGender: 'M' | 'F' | 'NB', surgeryType: string, cost: number) => { success: boolean; message: string };
  onChangeOrientation?: (orientation: string) => { success: boolean; message: string };
  onSalonAction?: (action: { type: 'cabelo' | 'pintura' | 'visual' | 'unhas' | 'sobrancelha' | 'spa'; name: string; cost: number; happinessBonus: number }) => { success: boolean; message: string };
  onUpdateCharacterSettings?: (updates: { styleLook?: string; lifeStyle?: 'Humilde' | 'Tranquilo' | 'Luxo'; artStyle?: 'Geométrico' | 'Ilustrado'; avatarSkinTone?: string; avatarOutfit?: string; avatarAccessory?: string; autoAgingEnabled?: boolean }) => void;
  gameState?: GameState;
  currentNews?: any;
  onReactToNews?: (news: any) => void;
  onCelebrate?: (desc: string) => void;
  onApplyDilemmaConsequence?: (consequences: any) => void;
  weeklySchedule?: WeeklyScheduleState;
  onUpdateWeeklySchedule?: (items: WeeklyScheduleItem[]) => void;
  onOpenWhatsNew?: () => void;
  onTestVersionNotice?: () => void;
}

const BICHOS_LIST = [
  { name: 'Avestruz', icon: '🦩', grupo: 1 },
  { name: 'Águia', icon: '🦅', grupo: 2 },
  { name: 'Burro', icon: '🫏', grupo: 3 },
  { name: 'Borboleta', icon: '🦋', grupo: 4 },
  { name: 'Cachorro', icon: '🐕', grupo: 5 },
  { name: 'Cabra', icon: '🐐', grupo: 6 },
  { name: 'Carneiro', icon: '🐏', grupo: 7 },
  { name: 'Camelo', icon: '🐪', grupo: 8 },
  { name: 'Cobra', icon: '🐍', grupo: 9 },
  { name: 'Coelho', icon: '🐇', grupo: 10 },
  { name: 'Cavalo', icon: '🐎', grupo: 11 },
  { name: 'Elefante', icon: '🐘', grupo: 12 },
  { name: 'Galo', icon: '🐓', grupo: 13 },
  { name: 'Gato', icon: '🐈', grupo: 14 },
  { name: 'Jacaré', icon: '🐊', grupo: 15 },
  { name: 'Leão', icon: '🦁', grupo: 16 },
  { name: 'Macaco', icon: '🐒', grupo: 17 },
  { name: 'Porco', icon: '🐖', grupo: 18 },
  { name: 'Pavão', icon: '🦚', grupo: 19 },
  { name: 'Peru', icon: '🦃', grupo: 20 },
  { name: 'Touro', icon: '🐂', grupo: 21 },
  { name: 'Urso', icon: '🐻', grupo: 22 },
  { name: 'Veado', icon: '🦌', grupo: 23 },
  { name: 'Vira-Lata', icon: '🐕‍🦺', grupo: 24 },
  { name: 'Vaca', icon: '🐄', grupo: 25 },
];

const INTERNATIONAL_TRAVELS_DATA = [
  { destName: 'Rio de Janeiro (Praia & Sol) 🏖️', basePrice: 1200, happinessBonus: 25 },
  { destName: 'Fernando de Noronha (Brasil) 🌴', basePrice: 4800, happinessBonus: 50 },
  { destName: 'Buenos Aires (Argentina) 🇦🇷', basePrice: 1800, happinessBonus: 30 },
  { destName: 'Montevidéu (Uruguai) 🇺🇾', basePrice: 2200, happinessBonus: 35 },
  { destName: 'Santiago & Andes (Chile) 🇨🇱', basePrice: 3200, happinessBonus: 40 },
  { destName: 'Cancún (México) 🇲🇽', basePrice: 8500, happinessBonus: 70 },
  { destName: 'Miami & Orlando (EUA) 🇺🇸', basePrice: 6500, happinessBonus: 60 },
  { destName: 'Lisboa (Portugal) 🇵🇹', basePrice: 8900, happinessBonus: 75 },
  { destName: 'Madri & Barcelona (Espanha) 🇪🇸', basePrice: 10500, happinessBonus: 80 },
  { destName: 'Paris (França) 🇫🇷', basePrice: 12000, happinessBonus: 85 },
  { destName: 'Roma & Milão (Itália) 🇮🇹', basePrice: 11500, happinessBonus: 85 },
  { destName: 'Londres (Reino Unido) 🇬🇧', basePrice: 13500, happinessBonus: 90 },
  { destName: 'Tóquio (Japão) 🇯🇵', basePrice: 18000, happinessBonus: 100 },
  { destName: 'Toronto (Canadá) 🇨🇦', basePrice: 14000, happinessBonus: 90 },
  { destName: 'Sydney (Austrália) 🇦🇺', basePrice: 19500, happinessBonus: 100 },
  { destName: 'Zurique (Suíça) 🇨🇭', basePrice: 16500, happinessBonus: 95 },
  { destName: 'Dublin (Irlanda) 🇮🇪', basePrice: 11000, happinessBonus: 80 }
];

const CNH_EXAM_QUESTIONS = [
  {
    id: 1,
    question: 'Qual a velocidade máxima permitida em vias urbanas residenciais sem sinalização no Brasil?',
    options: [
      { text: '30 km/h', isCorrect: true },
      { text: '60 km/h', isCorrect: false },
      { text: '80 km/h', isCorrect: false },
      { text: '110 km/h', isCorrect: false }
    ]
  },
  {
    id: 2,
    question: 'O uso do cinto de segurança é obrigatório para quais ocupantes do veículo?',
    options: [
      { text: 'Apenas para o condutor', isCorrect: false },
      { text: 'Apenas para passageiros da frente', isCorrect: false },
      { text: 'Para todos os ocupantes do veículo', isCorrect: true },
      { text: 'Apenas em rodovias federais', isCorrect: false }
    ]
  },
  {
    id: 3,
    question: 'Ao avistar a placa "PARADA OBRIGATÓRIA" (STOP), qual atitude o motorista deve tomar?',
    options: [
      { text: 'Apenas diminuir a velocidade', isCorrect: false },
      { text: 'Parar totalmente o veículo antes de prosseguir', isCorrect: true },
      { text: 'Buzinar e acelerar', isCorrect: false },
      { text: 'Ligar o pisca-alerta e passar rápido', isCorrect: false }
    ]
  },
  {
    id: 4,
    question: 'Dirigir sob efeito de álcool é considerado infração de trânsito de qual gravidade?',
    options: [
      { text: 'Gravíssima, com multa e suspensão da CNH', isCorrect: true },
      { text: 'Média, apenas com perda de pontos', isCorrect: false },
      { text: 'Leve, com advertência verbal', isCorrect: false },
      { text: 'Grave, apenas com retenção do veículo', isCorrect: false }
    ]
  },
  {
    id: 5,
    question: 'Em caso de pista molhada e aquaplanagem, qual é a conduta correta do condutor?',
    options: [
      { text: 'Pisar fundo no freio imediatamente', isCorrect: false },
      { text: 'Tirar o pé do acelerador suavemente e manter a direção firme', isCorrect: true },
      { text: 'Girar o volante para a esquerda bruscamente', isCorrect: false },
      { text: 'Puxar o freio de mão imediatamente', isCorrect: false }
    ]
  }
];

const MARKETPLACE_CATEGORIES = [
  {
    id: 'eletronicos',
    title: '📱 Eletrônicos & Tecnologia',
    items: [
      { name: 'Smartphone Pro 256GB', price: 4500, category: 'Eletrônicos', icon: '📱', desc: 'Câmera tripla e tela 120Hz' },
      { name: 'Notebook Gamer i7 16GB', price: 8200, category: 'Eletrônicos', icon: '💻', desc: 'Placa de vídeo dedicada e tela QHD' },
      { name: 'Smart TV OLED 65" 4K', price: 5800, category: 'Eletrônicos', icon: '📺', desc: 'Qualidade de cinema em casa' },
      { name: 'Console de Videogame 9ª Geração', price: 4200, category: 'Eletrônicos', icon: '🎮', desc: 'Com 2 controles sem fio' },
      { name: 'Fone Bluetooth Cancela Ruído', price: 1200, category: 'Eletrônicos', icon: '🎧', desc: 'Som de alta fidelidade e bateria de 30h' }
    ]
  },
  {
    id: 'casa',
    title: '🏠 Casa & Conforto',
    items: [
      { name: 'Geladeira Inverter Frost Free 450L', price: 5400, category: 'Casa', icon: '🧊', desc: 'Economia de energia e congelamento rápido' },
      { name: 'Sofá Retrátil Reclinável 4 Lugares', price: 3500, category: 'Casa', icon: '🛋️', desc: 'Tecido aveludado e mola ensacada' },
      { name: 'Robô Aspirador Inteligente LiDAR', price: 2200, category: 'Casa', icon: '🧹', desc: 'Mapeamento a laser e passa pano' },
      { name: 'Ar Condicionado Dual Inverter 12000 BTUs', price: 2900, category: 'Casa', icon: '❄️', desc: 'Quente e frio ultra silencioso' },
      { name: 'Cafeteira Espresso Barista', price: 1800, category: 'Casa', icon: '☕', desc: 'Pressão 19 bar e vaporizador de leite' }
    ]
  },
  {
    id: 'veiculos',
    title: '🚗 Veículos & Mobilidade',
    items: [
      { name: 'Moto Urbana 160cc Zero KM', price: 18500, category: 'Veículos', icon: '🛵', desc: 'Econômica, faz 42 km/L no centro' },
      { name: 'Carro Hatch 1.0 Completo Usado', price: 38000, category: 'Veículos', icon: '🚗', desc: 'Ar, direção, vidro e trava elétrica' },
      { name: 'SUV Flex Zero KM', price: 125000, category: 'Veículos', icon: '🚘', desc: 'Câmbio automático e teto solar' },
      { name: 'Moto Esportiva 600cc', price: 52000, category: 'Veículos', icon: '🏍️', desc: 'Alta performance e ronco forte' }
    ]
  },
  {
    id: 'imoveis',
    title: '💎 Imóveis & Alto Padrão',
    items: [
      { name: 'Apartamento Studio em Pinheiros', price: 290000, category: 'Imóveis', icon: '🏢', desc: '38m² com varanda gourmet e lazer completo' },
      { name: 'Casa de Praia em Fernando de Noronha', price: 850000, category: 'Imóveis', icon: '🏡', desc: '4 suítes e vista definitiva para o mar' },
      { name: 'Relógio Suíço de Ouro 18K', price: 35000, category: 'Luxo', icon: '⌚', desc: 'Movimento automático e mostrador azul' }
    ]
  },
  {
    id: 'consumaveis',
    title: '🧪 Consumíveis & Bem-Estar',
    items: [
      { id: 'energetico_monster', name: 'Lata de Energético Ultra 500ml', price: 15, category: 'consumavel', icon: '⚡', desc: 'Restaura +30% de Energia instantaneamente!', effects: { energia: 30 } },
      { id: 'cafe_gourmet', name: 'Café Gourmet Especial Moído', price: 35, category: 'consumavel', icon: '☕', desc: 'Sabor rico (+20% Energia, +10% Felicidade)', effects: { energia: 20, felicidade: 10 } },
      { id: 'chocolate_fino', name: 'Caixa de Trufas Artesanais', price: 45, category: 'consumavel', icon: '🍫', desc: 'Doces paulistanos (+25% Felicidade)', effects: { felicidade: 25 } },
      { id: 'kit_primeiros_socorros', name: 'Kit de Primeiros Socorros Completo', price: 120, category: 'saude', icon: '🩹', desc: 'Trata contusões e ferimentos (+30% Saúde, +15% Saúde Mental)', effects: { saude: 30, saudeMental: 15 } },
      { id: 'suco_detox', name: 'Garrafa de Suco Detox Natural', price: 25, category: 'consumavel', icon: '🥤', desc: 'Revigora o corpo (+15% Saúde Mental, +15% Energia)', effects: { saudeMental: 15, energia: 15 } }
    ]
  }
];

const TINDER_PROFILES = [
  {
    name: 'Camila Duarte',
    age: 27,
    profession: 'Arquiteta Urbanista',
    bio: '“Se você curte pastel de feira com caldo de cana no domingo e filmes do Studio Ghibli, já temos 90% em comum! 😜”',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCX7rFdQ9fKeJTqBYtr2ffootXCdBB3MgW7SbCv8ajh16ZTej1IVxGrdDIUSrMl19J36TgyArVEdfotUBkDG20HisQ8EyJwTNASahJPfeyk38o3k4Q5vFX-HSCKSC-cD0kRcrsW7qwfaVHVEgDAWDqYadQePbAErNQq4Gp9OADXDkdnFfm19iFfZ_9Jk4VrrMVjIa-_NtCPTCP9oc6hMzO7YSuSDBDzkqJ-mrrv2VjU',
    location: 'Pinheiros, SP • a 3 km de você',
    tags: ['🚲 Ciclismo', '🎶 Samba & MPB', '☕ Cafés Especiais', '🍷 Gastronomia']
  },
  {
    name: 'Juliana Paiva (Bixiga)',
    age: 26,
    profession: 'Designer & Murais Urbanos',
    bio: '“Amante de cantinas italianas do Bixiga, feiras de vinil e fotos analógicas. Vem de match!”',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkENpP07FRV77CR9X3S6eq61h5lDuNqBzNCXexsFnm0da9-2SCvGQceRch4hD2Zqy9g2brNVqAox2ktsyXUEIfkdqK9r_0n8ZTXXvak8WOiqQPvQM442hWEvSd_QNVqKDycCF4_oix5ODAny8Ixdkb8y7gECWq8W_GQZ_ejqGDp4JZO88DDot0ibCKZd6EkHKmLzkm52Q7I_Q61NTdHYJH3LJB2datFza3jgScx_Pm',
    location: 'Bixiga, SP • a 2 km de você',
    tags: ['🎨 Arte', '🍝 Cantinas', '📸 Fotografia', '🌿 Plantas']
  },
  {
    name: 'Bruno Guimarães',
    age: 29,
    profession: 'Desenvolvedor Sênior & Gamer',
    bio: '“Coffee lover, dev e corredor de rua aos domingos no Parque Ibirapuera. Rodízio japonês e memes de tecnologia.”',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVlsZ5cGN_yo8DVSXVT4RYwsO9gGpW0loUScVn-NFSCsijP1QmEo2o-Sbe4DQi6i_SrCHD7AqnN4-8Xe9_reyJralFPPGje_peiHsnSeRG25DFY-gBtpeYuQ59EapDPbn2-0FqoWmWEmxewYfbG_lfTi_9tCcePzLRW2nBvV8reInxeB4_e2qW7p-SHN86Vb92PrGfNkYrBnROtMmk4jz88Uf8tAyLlgBtchq6J-js',
    location: 'Vila Mariana, SP • a 5 km de você',
    tags: ['💻 Tech', '🍣 Sushi', '🏃‍♂️ Corrida', '🎮 Games']
  },
  {
    name: 'Beatriz Martins',
    age: 31,
    profession: 'Advogada & Sommelier',
    bio: '“Vinhos da Serra Gaúcha, livros na praça, MPB em vinil e debates enriquecedores.”',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ5sao_HHZBVDOmzYZgcqiYWKplKY9atGnH7R1Lw8JngeFP9csiB5_-wE4JYPBZ5VsGtyaGPUcM66zv6z4GeC4PKAeKtyRVFu1xfz6vjC8S0IQt7n-k4_Zp5P1IqLXuNjba_d2LYQJPHa_39KBfsCbyi64gXy6DILq9z6VmZooA2nef9cXcVOp87vvwR7Vqlr2jpn9iU9gmW6ZkGf7nDnn_rlWVHSsJJrfscuoGBcv',
    location: 'Jardins, SP • a 4 km de você',
    tags: ['🍷 Vinhos', '📚 Leitura', '🎷 Jazz', '⚖️ Direito']
  },
  {
    name: 'Gabriel Souza',
    age: 24,
    profession: 'Engenheiro Civil',
    bio: '“Fã de sertanejo universitário, churrasco de domingo e viagens de fim de semana.”',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCX7rFdQ9fKeJTqBYtr2ffootXCdBB3MgW7SbCv8ajh16ZTej1IVxGrdDIUSrMl19J36TgyArVEdfotUBkDG20HisQ8EyJwTNASahJPfeyk38o3k4Q5vFX-HSCKSC-cD0kRcrsW7qwfaVHVEgDAWDqYadQePbAErNQq4Gp9OADXDkdnFfm19iFfZ_9Jk4VrrMVjIa-_NtCPTCP9oc6hMzO7YSuSDBDzkqJ-mrrv2VjU',
    location: 'Moema, SP • a 4 km de você',
    tags: ['🥩 Churrasco', '🏋️‍♂️ Academia', '🎸 Sertanejo']
  }
];

export const MoreTab: React.FC<MoreTabProps> = ({
  character,
  stats,
  career,
  influencer,
  fertility,
  will = { beneficiary: 'Filhos', percentageToCharity: 0 },
  company,
  driverLicense,
  achievements,
  soundEnabled,
  onToggleSound,
  onPlayTigrinho,
  onPlayJogoDoBicho,
  onSocialPost,
  onHealthAction,
  onTravelCustom,
  onDonate,
  onCrimeAction,
  onFameAction,
  onFertilityAction,
  onResignOrLayoff,
  onUpdateWill,
  onRewindTime,
  onCreateCompany,
  onHireEmployee,
  onPromoteEmployee,
  onFireEmployee,
  onExpandBranch,
  onFranchiseCompany,
  onLaunchIPO,
  onSellCompany,
  onArrendarTerra,
  onPlant,
  onMoveAbroad,
  onBuyMarketplaceItem,
  onTinderMatch,
  onEarnCNH,
  onOpenCreatorMode,
  onSaveGame,
  onNewGame,
  onGoHomeSaves,
  timeAdvanceMode = 'anual',
  onChangeTimeMode,
  onGenderTransition,
  onChangeOrientation,
  onSalonAction,
  onUpdateCharacterSettings,
  gameState,
  currentNews,
  onReactToNews,
  onCelebrate,
  onApplyDilemmaConsequence,
  weeklySchedule,
  onUpdateWeeklySchedule,
  onOpenWhatsNew,
  onTestVersionNotice
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [salonCategory, setSalonCategory] = useState<'cabelo' | 'pintura' | 'visual' | 'unhas' | 'sobrancelha' | 'spa'>('cabelo');
  const [marketCategory, setMarketCategory] = useState<string>('eletronicos');
  const [tinderIndex, setTinderIndex] = useState<number>(0);
  const { theme, setTheme } = useTheme();
  const [selectedSkinTone, setSelectedSkinTone] = useState<string>(character.avatarSkinTone || 'Morena');
  const [selectedOutfit, setSelectedOutfit] = useState<string>(character.avatarOutfit || 'Casual');
  const [selectedAccessory, setSelectedAccessory] = useState<string>(character.avatarAccessory || 'Nenhum');
  const [autoAgingOn, setAutoAgingOn] = useState<boolean>(character.autoAgingEnabled ?? true);

  const defaultScheduleItems: WeeklyScheduleItem[] = [
    {
      id: 'estudos',
      name: 'Estudos & Leitura Guiada',
      icon: '📚',
      enabled: false,
      dayOfWeek: 'Terça',
      shift: 'Noite',
      cost: 50,
      earnings: 0,
      effectsDescription: '+10 Intelecto, -8% Energia (R$ 50/período)'
    },
    {
      id: 'terapia',
      name: 'Sessão de Terapia com Psicólogo',
      icon: '🧠',
      enabled: false,
      dayOfWeek: 'Quinta',
      shift: 'Tarde',
      cost: 140,
      earnings: 0,
      effectsDescription: '+35% Saúde Mental, +12% Felicidade (R$ 140/período)'
    },
    {
      id: 'trabalho_extra',
      name: 'Trabalho Extra / Bico Freelance',
      icon: '💼',
      enabled: false,
      dayOfWeek: 'Sábado',
      shift: 'Manhã',
      cost: 0,
      earnings: 250,
      effectsDescription: '+R$ 250 Rendimentos, -10% Energia, -5% Saúde Mental'
    }
  ];

  const [scheduleItems, setScheduleItems] = useState<WeeklyScheduleItem[]>(() => {
    return weeklySchedule?.items || defaultScheduleItems;
  });

  React.useEffect(() => {
    if (weeklySchedule?.items) {
      setScheduleItems(weeklySchedule.items);
    }
  }, [weeklySchedule]);

  // Travel Modal States
  const [travelDestIndex, setTravelDestIndex] = useState(0);
  const [isExecFlight, setIsExecFlight] = useState(false);
  const [companionMode, setCompanionMode] = useState<'alone' | 'pay_all' | 'split'>('alone');

  // Casino States
  const [casinoTab, setCasinoTab] = useState<'tigre' | 'bicho'>('tigre');
  const [casinoBet, setCasinoBet] = useState<number>(10);
  const [selectedBicho, setSelectedBicho] = useState<string>('Vira-Lata');
  const [lastCasinoResult, setLastCasinoResult] = useState<{ message: string; won: boolean; payout: number } | null>(null);
  const [isSpinningReels, setIsSpinningReels] = useState(false);

  // CNH Exam States
  const [cnhCategory, setCnhCategory] = useState<'A' | 'B' | 'AB'>('B');
  const [cnhExamStarted, setCnhExamStarted] = useState(false);
  const [cnhCurrentQIdx, setCnhCurrentQIdx] = useState(0);
  const [cnhCorrectCount, setCnhCorrectCount] = useState(0);
  const [cnhExamFinished, setCnhExamFinished] = useState(false);
  const [cnhPassed, setCnhPassed] = useState(false);

  // Agro & Safra States
  const [selectedCrop, setSelectedCrop] = useState<'soja' | 'milho' | 'cafe'>('soja');
  const [selectedPlantLevel, setSelectedPlantLevel] = useState<'economico' | 'padrao' | 'completo'>('padrao');

  // Abroad State
  const [selectedAbroadCity, setSelectedAbroadCity] = useState<string>('Lisboa');

  // Fertility States
  const [fertilityTab, setFertilityTab] = useState<'adocao' | 'fiv' | 'vasectomia' | 'outros'>('adocao');
  const [adoptionAge, setAdoptionAge] = useState<string>('Bebê (0–2a)');
  const [adoptionIsFast, setAdoptionIsFast] = useState<boolean>(false);

  // Will State
  const [selectedWillBeneficiary, setSelectedWillBeneficiary] = useState<'Filhos' | 'Cônjuge' | 'Pais' | 'Caridade'>(
    (will?.beneficiary && will.beneficiary !== 'Divisão Personalizada') ? will.beneficiary : 'Filhos'
  );

  const triggerClick = () => {
    playClickSound();
  };

  const showMsg = (res: { success: boolean; message: string; won?: boolean }) => {
    setFeedback(res.message);
    if (res.won || res.success) {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const getLifePhase = (age: number) => {
    if (age <= 10) return '🎓 INFÂNCIA (0–10A)';
    if (age <= 17) return '🎓 ADOLESCÊNCIA (11–17A)';
    if (age <= 24) return '🎓 JUVENTUDE (18–24A)';
    if (age <= 35) return '🎓 INÍCIO VIDA ADULTA (25–35A)';
    if (age <= 50) return '🎓 VIDA ADULTA (36–50A)';
    if (age <= 60) return '🎓 MEIA-IDADE (51–60A)';
    if (age <= 75) return '🎓 TERCEIRA IDADE (61–75A)';
    return '🎓 FASE FINAL (76+A)';
  };

  return (
    <div className="space-y-3.5 animate-fade-in pb-8 text-left">
      {/* Hero Stage Banner: Dense Tropical Emerald Gradient with Tactile Buttons */}
      <section
        className="rounded-3xl p-4 text-white relative overflow-hidden shadow-md"
        style={{
          background: 'linear-gradient(135deg, #09794d 0%, #065f3e 60%, #03422a 100%)',
          border: '2px solid #0ca768',
          boxShadow: '0 5px 0 #033c26, 0 12px 20px -3px rgba(6, 95, 62, 0.35)'
        }}
      >
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider mb-2.5"
          style={{
            backgroundColor: 'rgba(2, 44, 29, 0.65)',
            border: '1px solid rgba(52, 211, 153, 0.4)',
            color: '#6ee7b7'
          }}
        >
          <span>FASE ATUAL: {getLifePhase(character.age)}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h2 className="text-xl font-black leading-tight text-white drop-shadow-xs">
              Central de Experiências & Negócios
            </h2>
            <p className="text-xs mt-1.5 leading-relaxed font-medium" style={{ color: '#d1fae5' }}>
              Empresas, contratações, criador, crimes, fama, viagens e redes sociais
            </p>
          </div>
          {/* Action Button Triad (✏️, ⚙️, 🔊) */}
          <div className="flex items-center gap-2 flex-shrink-0 pt-1">
            <button
              aria-label="Editar Tema"
              onClick={() => {
                triggerClick();
                const currentIndex = AVAILABLE_THEME_KEYS.indexOf(theme as ThemeKey);
                const nextKey = AVAILABLE_THEME_KEYS[(currentIndex + 1) % AVAILABLE_THEME_KEYS.length];
                setTheme(nextKey);
                showMsg({ success: true, message: `Tema alterado para "${THEMES[nextKey]?.label || nextKey}"!` });
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center transition active:scale-95 shadow-xs cursor-pointer"
              style={{ backgroundColor: '#10b981', border: '1.5px solid #6ee7b7', boxShadow: '0 2px 0 #047857' }}
            >
              <span className="text-sm">✏️</span>
            </button>

            <button
              aria-label="Configurações"
              onClick={() => { triggerClick(); setActiveModal('settings'); }}
              className="w-9 h-9 rounded-full flex items-center justify-center transition active:scale-95 shadow-xs cursor-pointer"
              style={{ backgroundColor: '#0f766e', border: '1.5px solid #2dd4bf', boxShadow: '0 2px 0 #115e59' }}
            >
              <span className="text-sm">⚙️</span>
            </button>

            <button
              aria-label="Som"
              onClick={() => { triggerClick(); onToggleSound(); }}
              className="w-9 h-9 rounded-full flex items-center justify-center transition active:scale-95 shadow-xs cursor-pointer"
              style={{ backgroundColor: '#0d9488', border: '1.5px solid #5eead4', boxShadow: '0 2px 0 #0f766e' }}
            >
              <span className="text-sm">{soundEnabled ? '🔊' : '🔇'}</span>
            </button>
          </div>
        </div>
      </section>

      {feedback && (
        <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] text-[#047857] text-xs font-bold rounded-2xl flex items-center gap-2 shadow-xs animate-fade-in">
          <Sparkles className="w-4 h-4 flex-shrink-0 text-[#10b981]" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Special Card: Smartphone Digital Module */}
      <section
        onClick={() => {
          triggerClick();
          if (character.age < 15) {
            showMsg({ success: false, message: '🚫 Menores de 15 anos não têm permissão para acessar o Smartphone Digital.' });
            return;
          }
          setIsPhoneModalOpen(true);
        }}
        className="rounded-2xl p-3.5 relative overflow-hidden transition active:translate-y-0.5 cursor-pointer"
        style={{
          background: 'linear-gradient(145deg, #093325 0%, #052319 100%)',
          border: '1.5px solid #10b981',
          boxShadow: '0 4px 0 #021a12, 0 8px 16px rgba(0,0,0,0.2)'
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#0e4432', border: '1.5px solid #10b981' }}
          >
            <span className="text-2xl">📱</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white">Smartphone Digital</h3>
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: '#34d399', boxShadow: '0 0 8px #10b981' }}
              ></span>
            </div>
            <p className="text-[11px] mt-0.5 leading-snug" style={{ color: '#a7f3d0' }}>
              Notícias Brasil, Dilemas de Trabalho, Calendário, WhatsApp & Apps
            </p>
            <div className="mt-2">
              <span
                className="inline-flex items-center gap-1 text-[11px] font-extrabold tracking-wide uppercase"
                style={{ color: '#6ee7b7' }}
              >
                ABRIR CELULAR →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2-Column Experience Grid (19 Cards matching Attachment 1) */}
      <section className="grid grid-cols-2 gap-3 p-2 bg-slate-50/80 rounded-3xl border border-slate-300 shadow-xs">
        {/* 0. Agenda Semanal Recorrente */}
        <article
          onClick={() => {
            triggerClick();
            setActiveModal('weekly_schedule');
          }}
          className="lego-card col-span-2 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 border-2 border-amber-300 shadow-sm hover:border-amber-400 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-white border border-amber-200 shadow-xs">
              📅
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black text-slate-900">Agenda Semanal Recorrente</h4>
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black uppercase shadow-xs">Novo</span>
              </div>
              <p className="text-[11px] text-amber-900 font-medium mt-0.5">Agendar Estudos, Terapia &amp; Trabalho Extra a cada avanço</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500 text-white shadow-xs hover:bg-amber-600 transition-all">
            Agendar <span className="text-xs">→</span>
          </span>
        </article>

        {/* 1. Habilitação & CNH */}
        <article
          onClick={() => {
            triggerClick();
            if (character.age < 18) {
              showMsg({ success: false, message: '🚫 Apenas maiores de 18 anos podem tirar CNH no DETRAN.' });
              return;
            }
            setCnhExamStarted(false);
            setCnhExamFinished(false);
            setActiveModal('cnh');
          }}
          className="lego-card rounded-2xl p-3 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2" style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
              💳
            </div>
            <h4 className="text-xs font-bold text-slate-800 leading-snug">Habilitação & CNH</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">Fazer prova do DETRAN (18+)</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2.5" style={{ color: '#0284c7' }}>
            Tirar CNH <span className="text-xs">→</span>
          </span>
        </article>

        {/* 2. Marketplace Online */}
        <article
          onClick={() => {
            triggerClick();
            if (character.age < 18) {
              showMsg({ success: false, message: '🚫 Marketplace Online é exclusivo para maiores de 18 anos!' });
              return;
            }
            setActiveModal('marketplace');
          }}
          className="lego-card rounded-2xl p-3 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2" style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0' }}>
              🛍️
            </div>
            <h4 className="text-xs font-bold text-slate-800 leading-snug">Marketplace Online</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">Eletrônicos, casa, motos e carros (18+)</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2.5" style={{ color: '#059669' }}>
            Comprar Agora <span className="text-xs">→</span>
          </span>
        </article>

        {/* 3. Tinder Tropical */}
        <article
          onClick={() => {
            triggerClick();
            if (character.age < 18) {
              showMsg({ success: false, message: '🚫 Tinder Tropical é exclusivo para maiores de 18 anos!' });
              return;
            }
            setActiveModal('tinder');
          }}
          className="lego-card rounded-2xl p-3 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2" style={{ backgroundColor: '#fdf2f8', border: '1px solid #fbcfe8' }}>
              🔥
            </div>
            <h4 className="text-xs font-bold text-slate-800 leading-snug">Tinder Tropical</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">App de namoro para encontrar parceiros(as) (18+)</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2.5" style={{ color: '#db2777' }}>
            Dar Match <span className="text-xs">→</span>
          </span>
        </article>

        {/* 3.5. Customização de Avatar & Auto-Aging */}
        <article
          onClick={() => { triggerClick(); setActiveModal('avatar_custom'); }}
          className="lego-card rounded-2xl p-3 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2" style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a' }}>
              👤
            </div>
            <h4 className="text-xs font-bold text-slate-800 leading-snug">Customização de Avatar</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">Pele, roupas, acessórios & envelhecimento autônomo</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2.5" style={{ color: '#d97706' }}>
            Personalizar <span className="text-xs">→</span>
          </span>
        </article>

        {/* 4. Identidade & Transição */}
        <article
          onClick={() => { triggerClick(); setActiveModal('identity'); }}
          className="lego-card rounded-2xl p-3 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2" style={{ backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe' }}>
              ⚧️
            </div>
            <h4 className="text-xs font-bold text-slate-800 leading-snug">Identidade & Transição</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">Cirurgia plástica, transição & orientação</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2.5" style={{ color: '#7c3aed' }}>
            Personalizar <span className="text-xs">→</span>
          </span>
        </article>

        {/* 5. Salão & SPA Tropical */}
        <article
          onClick={() => { triggerClick(); setActiveModal('salon'); }}
          className="lego-card rounded-2xl p-3 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2" style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3' }}>
              💇‍♀️
            </div>
            <h4 className="text-xs font-bold text-slate-800 leading-snug">Salão & SPA Tropical</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">Cortes, sobrancelhas, unhas & visual</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2.5" style={{ color: '#e11d48' }}>
            Cuidar do Look <span className="text-xs">→</span>
          </span>
        </article>

        {/* 6. Negócios & Empresa */}
        <article
          onClick={() => { triggerClick(); setActiveModal('business'); }}
          className="lego-card rounded-2xl p-3 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2" style={{ backgroundColor: '#ecfeff', border: '1px solid #a5f3fc' }}>
              🏬
            </div>
            <h4 className="text-xs font-bold text-slate-800 leading-snug">Negócios & Empresa</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">Criar empresa, contratar, abrir capital e franquiar</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2.5" style={{ color: '#0891b2' }}>
            Gestão CNPJ <span className="text-xs">→</span>
          </span>
        </article>

        {/* 7. Agro & Fazenda */}
        <article
          onClick={() => { triggerClick(); setActiveModal('agro'); }}
          className="lego-card rounded-2xl p-3 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              🚜
            </div>
            <h4 className="text-xs font-bold text-slate-800 leading-snug">Agro & Fazenda</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">Arrendar terra, plantar e colher</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2.5" style={{ color: '#16a34a' }}>
            Gerir Safra <span className="text-xs">→</span>
          </span>
        </article>

        {/* 8. Vida no Exterior */}
        <article
          onClick={() => { triggerClick(); setActiveModal('international'); }}
          className="lego-card rounded-2xl p-3 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2" style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
              ✈️
            </div>
            <h4 className="text-xs font-bold text-slate-800 leading-snug">Vida no Exterior</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">Mudar de país, visto & trabalho</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2.5" style={{ color: '#2563eb' }}>
            Explorar Mundo <span className="text-xs">→</span>
          </span>
        </article>

        {/* 9. Posto de Saúde & Planos */}
        <article
          onClick={() => { triggerClick(); setActiveModal('health'); }}
          className="lego-card rounded-2xl p-3 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2" style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0' }}>
              🏥
            </div>
            <h4 className="text-xs font-bold text-slate-800 leading-snug">Posto de Saúde & Planos</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">SUS, Plano Empresa, Particular & Médicos</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2.5" style={{ color: '#059669' }}>
            Cuidar da Saúde <span className="text-xs">→</span>
          </span>
        </article>

        {/* 10. Viagens & Voos */}
        <article
          onClick={() => { triggerClick(); setActiveModal('travel'); }}
          className="lego-card rounded-2xl p-3 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2" style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}>
              🛫
            </div>
            <h4 className="text-xs font-bold text-slate-800 leading-snug">Viagens & Voos</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">Classe Executiva & Acompanhantes</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2.5" style={{ color: '#0284c7' }}>
            Agendar Viagem <span className="text-xs">→</span>
          </span>
        </article>

        {/* 11. Fertilidade & Adoção */}
        <article
          onClick={() => { triggerClick(); setActiveModal('fertility'); }}
          className="lego-card rounded-2xl p-3 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2" style={{ backgroundColor: '#f0fdfa', border: '1px solid #99f6e4' }}>
              🍼
            </div>
            <h4 className="text-xs font-bold text-slate-800 leading-snug">Fertilidade & Adoção</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">Adoção legal, FIV, Vasectomia & Doação</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2.5" style={{ color: '#0d9488' }}>
            Planejamento <span className="text-xs">→</span>
          </span>
        </article>

        {/* 12. Fama & Holofotes */}
        <article
          onClick={() => { triggerClick(); setActiveModal('fame'); }}
          className="lego-card rounded-2xl p-3 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2" style={{ backgroundColor: '#fefce8', border: '1px solid #fef08a' }}>
              ✨
            </div>
            <h4 className="text-xs font-bold text-slate-800 leading-snug">Fama & Holofotes</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">Reality Shows, TV & Podcasting</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2.5" style={{ color: '#ca8a04' }}>
            Brilhar na TV <span className="text-xs">→</span>
          </span>
        </article>

        {/* 13. Crime & Malandragem */}
        <article
          onClick={() => {
            triggerClick();
            if (character.age < 14) {
              showMsg({ success: false, message: '🚫 Crime e malandragem estão disponíveis somente a partir dos 14 anos!' });
              return;
            }
            setActiveModal('crime');
          }}
          className="lego-card rounded-2xl p-3 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2" style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1' }}>
              🎲
            </div>
            <h4 className="text-xs font-bold text-slate-800 leading-snug">Crime & Malandragem</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">Bilhete premiado, Racha & Golpes (14+)</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2.5" style={{ color: '#64748b' }}>
            Arriscar Vida <span className="text-xs">→</span>
          </span>
        </article>

        {/* 14. Rescisão Trabalhista */}
        <article
          onClick={() => { triggerClick(); setActiveModal('resignation'); }}
          className="lego-card rounded-2xl p-3 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2" style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
              📜
            </div>
            <h4 className="text-xs font-bold text-slate-800 leading-snug">Rescisão Trabalhista</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">Pedir demissão ou acerto com 40% FGTS</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2.5" style={{ color: '#d97706' }}>
            Calcular Acerto <span className="text-xs">→</span>
          </span>
        </article>

        {/* 15. Jogo do Bicho */}
        <article
          onClick={() => {
            triggerClick();
            if (character.age < 15) {
              showMsg({ success: false, message: '🚫 Menores de 15 anos não têm acesso a jogos de azar e Jogo do Bicho!' });
              return;
            }
            setCasinoTab('bicho');
            setActiveModal('casino');
          }}
          className="lego-card rounded-2xl p-3 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2" style={{ backgroundColor: '#fdf2f8', border: '1px solid #fbcfe8' }}>
              🦩
            </div>
            <h4 className="text-xs font-bold text-slate-800 leading-snug">Jogo do Bicho</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">Aposte no bicho e ganhe 18x (15+)</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2.5" style={{ color: '#be185d' }}>
            Apostar Bicho <span className="text-xs">→</span>
          </span>
        </article>

        {/* 16. Tigrinho da Sorte */}
        <article
          onClick={() => {
            triggerClick();
            if (character.age < 15) {
              showMsg({ success: false, message: '🚫 Menores de 15 anos não têm acesso ao Tigrinho e jogos de cassino!' });
              return;
            }
            setCasinoTab('tigre');
            setActiveModal('casino');
          }}
          className="lego-card rounded-2xl p-3 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2" style={{ backgroundColor: '#fefce8', border: '1px solid #fef08a' }}>
              🐯
            </div>
            <h4 className="text-xs font-bold text-slate-800 leading-snug">Tigrinho da Sorte</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">Gire a roleta e solte a carta (15+)</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2.5" style={{ color: '#b45309' }}>
            Girar Roleta <span className="text-xs">→</span>
          </span>
        </article>

        {/* 17. Redes Sociais */}
        <article
          onClick={() => {
            triggerClick();
            if (character.age < 15) {
              showMsg({ success: false, message: '🚫 Menores de 15 anos não têm acesso a Redes Sociais!' });
              return;
            }
            setActiveModal('social');
          }}
          className="lego-card rounded-2xl p-3 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2" style={{ backgroundColor: '#e0f2fe', border: '1px solid #bae6fd' }}>
              📸
            </div>
            <h4 className="text-xs font-bold text-slate-800 leading-snug">Redes Sociais</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">Influenciador ({influencer.followers.toLocaleString()} seg.) (15+)</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2.5" style={{ color: '#0284c7' }}>
            Ver Perfil <span className="text-xs">→</span>
          </span>
        </article>

        {/* 18. Testamento & Tempo */}
        <article
          onClick={() => { triggerClick(); setActiveModal('will'); }}
          className="lego-card rounded-2xl p-3 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              ⏳
            </div>
            <h4 className="text-xs font-bold text-slate-800 leading-snug">Testamento & Tempo</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">Herança e Voltar no Tempo</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2.5" style={{ color: '#15803d' }}>
            Configurar <span className="text-xs">→</span>
          </span>
        </article>

        {/* Barra de Ajustes & Avisos */}
        <article
          className="lego-card col-span-2 rounded-2xl p-3 flex items-center justify-between flex-wrap gap-2"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-600">Sistema &amp; Versão:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerClick();
                if (onOpenWhatsNew) onOpenWhatsNew();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-[#e6f5ed] hover:bg-[#d4edd9] text-[#087F48] font-heading font-bold text-[11px] border border-[#a2e6bd] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              title="Ver Novidades da Versão"
            >
              <span>Ver Novidades ✨</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerClick();
                if (onTestVersionNotice) {
                  onTestVersionNotice();
                  showMsg({ success: true, message: 'Balão "Nova versão disponível!" disparado no topo!' });
                }
              }}
              className="px-2.5 py-1.5 rounded-xl bg-[#fff8e1] hover:bg-[#ffecb3] text-[#b45309] font-heading font-bold text-[11px] border border-[#ffe082] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              title="Testar Balão de Aviso de Atualização"
            >
              <span>Testar Aviso 🔔</span>
            </button>

            <button
              type="button"
              onClick={() => { triggerClick(); setActiveModal('settings'); }}
              className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl text-slate-700 bg-[#f1f5f9] border border-[#cbd5e1] hover:bg-[#e2e8f0] cursor-pointer"
            >
              Ajustes <span className="text-xs">⚙️</span>
            </button>
          </div>
        </article>
      </section>

      {/* --- MODAL MARKETPLACE ONLINE --- */}
      {activeModal === 'marketplace' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-[#ece9df] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#f0eee8] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛍️</span>
                <div>
                  <h3 className="font-heading font-black text-sm text-[#141E18]">Marketplace Online Brasil</h3>
                  <p className="text-[10px] text-[#566359]">Seu Saldo: R$ {stats.grana.toLocaleString('pt-BR')}</p>
                </div>
              </div>
              <button onClick={() => { triggerClick(); setActiveModal(null); }} className="w-7 h-7 rounded-full bg-[#f0eee8] text-[#141E18] font-bold text-xs flex items-center justify-center">✕</button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs font-heading font-bold">
              {MARKETPLACE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { triggerClick(); setMarketCategory(cat.id); }}
                  className={`py-1.5 px-3 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                    marketCategory === cat.id ? 'bg-[#087F48] text-white' : 'bg-[#fbf9f3] text-[#566359] border border-[#ece9df]'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            {/* Items Listing */}
            <div className="space-y-2.5">
              {MARKETPLACE_CATEGORIES.find((c) => c.id === marketCategory)?.items.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#fbf9f3] border border-[#ece9df] flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h5 className="font-heading font-bold text-[#141E18]">{item.name}</h5>
                      <p className="text-[10px] text-[#566359]">{item.desc}</p>
                      <span className="text-xs font-black text-[#087F48]">R$ {item.price.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      triggerClick();
                      const res = onBuyMarketplaceItem(item);
                      showMsg(res);
                      if (res.success) playCoinSound();
                    }}
                    className="py-1.5 px-3 rounded-xl font-heading font-bold text-xs bg-[#0ca768] hover:bg-[#087F48] text-white cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    Comprar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL TINDER TROPICAL --- */}
      {activeModal === 'tinder' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 animate-fade-in text-left">
          <div className="bg-[#f4fbf5] rounded-3xl max-w-sm w-full p-4 shadow-2xl border border-[#dde4de] space-y-3">
            <div className="flex items-center justify-between border-b border-[#dde4de] pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center font-bold text-sm shadow-[0_2px_0_0_#ffdad6]">
                  🔥
                </div>
                <div>
                  <h3 className="font-heading font-black text-xs text-[#161d19] flex items-center gap-1">
                    Tinder Tropical
                    <span className="text-[9px] px-1 py-0.2 rounded-full bg-[#7bfbb3] text-[#002110] uppercase font-bold">BR</span>
                  </h3>
                  <p className="text-[10px] text-[#3d4a40]">São Paulo • até 15 km</p>
                </div>
              </div>
              <button
                onClick={() => { triggerClick(); setActiveModal(null); }}
                className="w-7 h-7 rounded-full bg-[#e3eae4] text-[#161d19] font-bold text-xs flex items-center justify-center cursor-pointer hover:bg-[#dde4de]"
              >
                ✕
              </button>
            </div>

            {/* Profile Polaroid Card */}
            {(() => {
              const currProf = TINDER_PROFILES[tinderIndex % TINDER_PROFILES.length];
              return (
                <div className="bg-white rounded-2xl p-3 border border-[#dde4de] shadow-[0_3px_0_0_#dde4de] space-y-2">
                  <div className="relative w-full h-52 rounded-xl overflow-hidden bg-[#e3eae4] shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                    <img
                      src={currProf.photoUrl}
                      alt={currProf.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-xs text-[#161d19] text-[9px] font-bold shadow-xs">
                      ✓ Verificada no Gov.br
                    </span>
                    <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                      <h4 className="font-heading font-black text-sm text-white">{currProf.name}, {currProf.age}</h4>
                      <p className="text-[10px] text-white/90">{currProf.profession}</p>
                      <p className="text-[9px] text-white/75">{currProf.location}</p>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-[#eef5ef] border border-[#dde4de] text-[11px] text-[#161d19] leading-snug">
                    {currProf.bio}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {currProf.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-[#e8f0e9] text-[#161d19] text-[9.5px] font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* 3D Decision Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  triggerClick();
                  setTinderIndex((tinderIndex + 1) % TINDER_PROFILES.length);
                }}
                className="py-2.5 rounded-xl bg-[#dde4de] hover:bg-[#bccabe] text-[#ba1a1a] font-bold text-xs shadow-[0_3px_0_0_#bccabe] active:translate-y-0.5 transition-all cursor-pointer text-center"
              >
                Passar ❌
              </button>

              <button
                onClick={() => {
                  triggerClick();
                  const currProf = TINDER_PROFILES[tinderIndex % TINDER_PROFILES.length];
                  const res = onTinderMatch(currProf.name);
                  showMsg(res);
                  if (res.success) {
                    setActiveModal(null);
                    setIsPhoneModalOpen(true);
                  }
                }}
                className="py-2.5 rounded-xl bg-[#0ca768] hover:bg-[#006d41] text-white font-bold text-xs shadow-[0_3px_0_0_#005230] active:translate-y-0.5 transition-all cursor-pointer text-center flex items-center justify-center gap-1"
              >
                <span>Dar Match!</span>
                <span>💚</span>
              </button>
            </div>

            <button
              onClick={() => {
                triggerClick();
                setActiveModal(null);
                setIsPhoneModalOpen(true);
              }}
              className="w-full py-2 text-center text-xs font-bold text-[#006d41] hover:underline cursor-pointer block"
            >
              Abrir App no Smartphone Digital 📱 →
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL UNIFICADO: TIGRINHO DA SORTE & JOGO DO BICHO (Attachment 2) --- */}
      {(activeModal === 'casino' || activeModal === 'tigrinho' || activeModal === 'bicho') && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-sm w-full p-4 shadow-2xl border border-[#bccabe] space-y-3 max-h-[92vh] overflow-y-auto">
            {/* Top Modal Bar */}
            <div className="flex items-center justify-between border-b border-[#e8f0e9] pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#cc8200] flex items-center justify-center text-white shadow-xs">
                  <span className="text-lg">🎰</span>
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm text-[#161d19] leading-tight">Loterias & Jogos</h3>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[9px] font-extrabold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
                    18+ Aposte com Moderação
                  </span>
                </div>
              </div>
              <button
                onClick={() => { triggerClick(); setActiveModal(null); }}
                className="w-8 h-8 rounded-lg bg-[#e8f0e9] flex items-center justify-center text-[#3d4a40] hover:bg-[#dde4de] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Balance HUD Brick Bar */}
            <div className="bg-[#eef5ef] rounded-xl p-2.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#0ca768] text-white flex items-center justify-center shadow-xs text-lg">
                  👛
                </div>
                <div>
                  <p className="text-[9px] font-extrabold uppercase text-[#3d4a40] tracking-wider">Saldo em Conta</p>
                  <p className="font-heading font-black text-sm text-[#161d19]">
                    R$ {stats.grana.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className="px-2 py-0.5 rounded-full bg-[#7bfbb3] text-[#002110] text-[9px] font-bold flex items-center gap-1">
                  ✓ Saldo Saudável
                </span>
                <span className="text-[9px] font-bold text-[#855300] flex items-center gap-0.5">
                  ⚡ Bônus Diário Ativo
                </span>
              </div>
            </div>

            {/* Segmented Switcher */}
            <div className="grid grid-cols-2 p-1 bg-[#e8f0e9] rounded-xl gap-1 text-xs">
              <button
                type="button"
                onClick={() => { triggerClick(); setCasinoTab('tigre'); }}
                className={`py-2 px-2 rounded-lg font-heading font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  casinoTab === 'tigre'
                    ? 'bg-white text-[#161d19] shadow-[0_3px_0_0_#bccabe]'
                    : 'text-[#3d4a40]'
                }`}
              >
                <span>🐯</span>
                <span>Tigrinho da Sorte</span>
              </button>
              <button
                type="button"
                onClick={() => { triggerClick(); setCasinoTab('bicho'); }}
                className={`py-2 px-2 rounded-lg font-heading font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  casinoTab === 'bicho'
                    ? 'bg-white text-[#161d19] shadow-[0_3px_0_0_#bccabe]'
                    : 'text-[#3d4a40]'
                }`}
              >
                <span>🦩</span>
                <span>Jogo do Bicho</span>
              </button>
            </div>

            {/* TAB 1: TIGRINHO DA SORTE */}
            {casinoTab === 'tigre' && (
              <div className="space-y-3">
                {/* Special Event Banner */}
                <div className="bg-gradient-to-r from-[#cc8200] via-[#855300] to-[#006d41] rounded-xl p-2.5 text-white shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-white text-[#855300] flex items-center justify-center text-xs font-bold shadow">
                        ⚡
                      </span>
                      <div>
                        <p className="font-heading font-bold text-xs leading-tight">Hora da Carta Secreta!</p>
                        <p className="text-[9.5px] text-[#ffddb8]">Multiplicadores de 10x até 50x ativos</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-bold">
                      Restam 04:12
                    </span>
                  </div>
                </div>

                {/* Toy Slot Box */}
                <div className="bg-[#e8f0e9] rounded-xl p-2.5 shadow-[0_4px_0_0_#bccabe]">
                  <div className="flex justify-around pb-1.5 px-2 opacity-60">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#dde4de] shadow-inner"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#dde4de] shadow-inner"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#dde4de] shadow-inner"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#dde4de] shadow-inner"></span>
                  </div>

                  {/* 3 Reels */}
                  <div className="grid grid-cols-3 gap-1.5 bg-[#e3eae4] p-1.5 rounded-xl shadow-inner">
                    <div className={`bg-white rounded-lg h-24 flex flex-col items-center justify-center shadow-[0_3px_0_0_#d5dcd6] ${isSpinningReels ? 'animate-bounce' : ''}`}>
                      <span className="text-2xl">🐯</span>
                      <span className="text-[9px] font-extrabold text-[#855300] mt-0.5">Lego Tigre</span>
                      <span className="text-[8.5px] font-black text-[#0ca768]">PAGA 25x</span>
                    </div>
                    <div className={`bg-white rounded-lg h-24 flex flex-col items-center justify-center shadow-[0_3px_0_0_#d5dcd6] ${isSpinningReels ? 'animate-pulse' : ''}`}>
                      <span className="text-2xl">💎</span>
                      <span className="text-[9px] font-extrabold text-[#006d41] mt-0.5">Esmeralda</span>
                      <span className="text-[8.5px] font-black text-[#0ca768]">WILDCARD</span>
                    </div>
                    <div className={`bg-white rounded-lg h-24 flex flex-col items-center justify-center shadow-[0_3px_0_0_#d5dcd6] ${isSpinningReels ? 'animate-bounce' : ''}`}>
                      <span className="text-2xl">💰</span>
                      <span className="text-[9px] font-extrabold text-[#855300] mt-0.5">Saco R$</span>
                      <span className="text-[8.5px] font-black text-[#0ca768]">PAGA 15x</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 px-1 text-[10px] text-[#3d4a40]">
                    <span className="flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0ca768] animate-pulse"></span>
                      25 Linhas Ativas
                    </span>
                    <span className="font-bold text-[#0051d5]">
                      RTP Estimado: 96.8%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: JOGO DO BICHO */}
            {casinoTab === 'bicho' && (
              <div className="space-y-3">
                <div className="bg-[#dbe1ff] text-[#00174b] p-2.5 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-heading font-black text-xs">Extração Tradicional RJ/SP</p>
                    <p className="text-[9.5px] opacity-80">Próximo sorteio às 14:00 (Deu no Poste)</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#0051d5] text-white flex items-center justify-center font-bold text-sm">
                    🦩
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-[#3d4a40] block">Escolha seu Bicho / Grupo</label>
                  <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto p-1">
                    {BICHOS_LIST.slice(0, 16).map((b) => (
                      <button
                        key={b.grupo}
                        type="button"
                        onClick={() => { triggerClick(); setSelectedBicho(b.name); }}
                        className={`flex flex-col items-center p-1.5 rounded-xl transition-all shadow-[0_2px_0_0_#bccabe] cursor-pointer ${
                          selectedBicho === b.name
                            ? 'bg-[#0051d5] text-white'
                            : 'bg-[#e3eae4] text-[#161d19] hover:bg-[#dde4de]'
                        }`}
                      >
                        <span className="text-xl">{b.icon}</span>
                        <span className="font-heading font-bold text-[10px] truncate max-w-full">{b.name}</span>
                        <span className="text-[8.5px] opacity-80">Gr. {b.grupo.toString().padStart(2, '0')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Bet Value Selector */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[#3d4a40]">Valor da Aposta</label>
                <span className="font-extrabold text-[#006d41]">
                  Prêmio Estimado: R$ {(casinoBet * (casinoTab === 'tigre' ? 5 : 18)).toLocaleString('pt-BR')}
                </span>
              </div>

              {/* Quick Chips */}
              <div className="grid grid-cols-5 gap-1">
                {[5, 10, 25, 50, 100].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => { triggerClick(); setCasinoBet(val); }}
                    className={`py-1.5 rounded-lg font-heading font-extrabold text-xs text-center transition-all shadow-[0_2px_0_0_#bccabe] cursor-pointer ${
                      casinoBet === val
                        ? 'bg-[#006d41] text-white shadow-[0_2px_0_0_#00321c]'
                        : 'bg-[#e8f0e9] text-[#161d19] hover:bg-[#dde4de]'
                    }`}
                  >
                    R$ {val}
                  </button>
                ))}
              </div>

              {/* Stepper */}
              <div className="flex items-center justify-between bg-[#eef5ef] p-1.5 rounded-xl">
                <button
                  type="button"
                  onClick={() => { triggerClick(); setCasinoBet(Math.max(5, casinoBet - 5)); }}
                  className="w-8 h-8 rounded-lg bg-[#e8f0e9] flex items-center justify-center font-black text-[#161d19] shadow-[0_2px_0_0_#bccabe] hover:bg-[#dde4de] cursor-pointer"
                >
                  -
                </button>
                <div className="text-center">
                  <span className="text-[9px] font-bold text-[#3d4a40] block leading-none">Aposta Selecionada</span>
                  <span className="font-heading font-black text-sm text-[#161d19]">R$ {casinoBet},00</span>
                </div>
                <button
                  type="button"
                  onClick={() => { triggerClick(); setCasinoBet(casinoBet + 5); }}
                  className="w-8 h-8 rounded-lg bg-[#e8f0e9] flex items-center justify-center font-black text-[#161d19] shadow-[0_2px_0_0_#bccabe] hover:bg-[#dde4de] cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Result feedback */}
            {lastCasinoResult && (
              <div className={`p-2.5 rounded-xl flex items-center justify-between text-xs font-bold ${
                lastCasinoResult.won ? 'bg-[#7bfbb3]/40 text-[#002110]' : 'bg-[#ffdad6] text-[#93000a]'
              }`}>
                <div className="flex items-center gap-1.5">
                  <span>{lastCasinoResult.won ? '🎉' : '💸'}</span>
                  <p>{lastCasinoResult.message}</p>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-1">
              <button
                type="button"
                disabled={isSpinningReels}
                onClick={() => {
                  triggerClick();
                  setIsSpinningReels(true);
                  setTimeout(() => {
                    setIsSpinningReels(false);
                    let res;
                    if (casinoTab === 'tigre') {
                      res = onPlayTigrinho(casinoBet);
                    } else {
                      res = onPlayJogoDoBicho(selectedBicho, casinoBet);
                    }
                    setLastCasinoResult({ message: res.message, won: !!res.won, payout: res.payout || 0 });
                    showMsg(res);
                  }, 600);
                }}
                className="w-full py-3 px-3 rounded-xl bg-[#0ca768] hover:bg-[#006d41] text-white font-heading font-black text-xs flex items-center justify-center gap-2 shadow-[0_4px_0_0_#005230] active:translate-y-1 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>🎰</span>
                <span>
                  {casinoTab === 'tigre'
                    ? `Girar Roleta do Tigre! 🎰 (R$ ${casinoBet})`
                    : `Apostar no Bicho (${selectedBicho}) 🦩 (R$ ${casinoBet})`}
                </span>
              </button>
            </div>

            <div className="pt-1 flex items-center justify-center gap-1.5 text-[10px] text-[#3d4a40]">
              <span>🌳</span>
              <span className="font-medium opacity-80">Bairro da Felicidade • Vida Real Brasil Miniatura</span>
              <span>🏡</span>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL CUSTOMIZAÇÃO DE AVATAR & AUTO-AGING --- */}
      {activeModal === 'avatar_custom' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-[#ece9df] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#f0eee8] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👤</span>
                <div>
                  <h3 className="font-heading font-black text-sm text-[#141E18]">Customização de Avatar & Auto-Aging</h3>
                  <p className="text-[10px] text-[#566359]">Escolha pele, look, acessórios e envelhecimento autônomo</p>
                </div>
              </div>
              <button onClick={() => { triggerClick(); setActiveModal(null); }} className="w-7 h-7 rounded-full bg-[#f0eee8] text-[#141E18] font-bold text-xs flex items-center justify-center hover:bg-[#e4e1d7]">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-heading font-bold text-[#141E18] block mb-1">Tom de Pele:</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Clara', 'Morena Clara', 'Morena', 'Morena Escura', 'Negra'].map(tone => (
                    <button
                      key={tone}
                      onClick={() => setSelectedSkinTone(tone)}
                      className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer ${selectedSkinTone === tone ? 'bg-[#087F48] text-white border-[#087F48]' : 'bg-slate-50 text-slate-800 border-slate-200'}`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-heading font-bold text-[#141E18] block mb-1">Estilo de Roupa / Look:</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Casual Estiloso', 'Social Executivo', 'Esportivo', 'Moda Praia', 'Moletom Confortável', 'Pijama'].map(outfit => (
                    <button
                      key={outfit}
                      onClick={() => setSelectedOutfit(outfit)}
                      className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer ${selectedOutfit === outfit ? 'bg-[#087F48] text-white border-[#087F48]' : 'bg-slate-50 text-slate-800 border-slate-200'}`}
                    >
                      {outfit}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-heading font-bold text-[#141E18] block mb-1">Acessório:</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Nenhum', 'Óculos Escuros', 'Boné Estiloso', 'Relógio de Ouro', 'Colar de Prata'].map(acc => (
                    <button
                      key={acc}
                      onClick={() => setSelectedAccessory(acc)}
                      className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer ${selectedAccessory === acc ? 'bg-[#087F48] text-white border-[#087F48]' : 'bg-slate-50 text-slate-800 border-slate-200'}`}
                    >
                      {acc}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">Envelhecimento Autônomo de Parentes & Amigos</span>
                  <span className="text-[10px] text-emerald-700">Simula o crescimento natural da família junto ao jogador</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoAgingOn}
                  onChange={(e) => setAutoAgingOn(e.target.checked)}
                  className="w-5 h-5 accent-[#087F48] cursor-pointer"
                />
              </div>

              <button
                onClick={() => {
                  triggerClick();
                  if (onUpdateCharacterSettings) {
                    onUpdateCharacterSettings({
                      avatarSkinTone: selectedSkinTone,
                      avatarOutfit: selectedOutfit,
                      avatarAccessory: selectedAccessory,
                      autoAgingEnabled: autoAgingOn
                    });
                    showMsg({ success: true, message: 'Perfil e avatar atualizados com sucesso!' });
                    setActiveModal(null);
                  }
                }}
                className="w-full py-3 rounded-xl bg-[#087F48] hover:bg-[#066337] text-white font-heading font-black text-xs cursor-pointer shadow-md transition"
              >
                Salvar Alterações do Avatar →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL IDENTIDADE & TRANSIÇÃO --- */}
      {activeModal === 'identity' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-[#ece9df] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#f0eee8] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚧️</span>
                <div>
                  <h3 className="font-heading font-black text-sm text-[#141E18]">Identidade & Transição</h3>
                  <p className="text-[10px] text-[#566359]">Procedimentos cirúrgicos & identidade</p>
                </div>
              </div>
              <button onClick={() => { triggerClick(); setActiveModal(null); }} className="w-7 h-7 rounded-full bg-[#f0eee8] text-[#141E18] font-bold text-xs flex items-center justify-center hover:bg-[#e4e1d7]">✕</button>
            </div>

            {/* Current Identity Status */}
            <div className="p-3.5 bg-[#f5eeff] rounded-2xl border border-[#dfcbf9] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-heading font-extrabold uppercase text-[#7828c8] tracking-wider">
                  Situação Atual
                </span>
                <span className="text-[10px] font-bold text-[#7828c8] bg-white/70 px-2 py-0.5 rounded-full">
                  {character.gender === 'M' ? 'Gênero Masculino 👨' : character.gender === 'F' ? 'Gênero Feminino 👩' : 'Não-Binário ⚧️'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-[#566359] block">Orientação Sexual:</span>
                  <span className="font-heading font-bold text-[#141E18]">{character.sexualOrientation || 'Heterossexual'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#566359] block">Histórico de Transição:</span>
                  <span className="font-heading font-bold text-[#141E18]">{character.transGenderHistory ? 'Sim (Transicionado)' : 'Cisgênero'}</span>
                </div>
              </div>
            </div>

            {/* Section 1: Cirurgia Plástica de Transição de Gênero */}
            <div className="space-y-2">
              <h4 className="font-heading font-extrabold text-xs text-[#141E18] flex items-center gap-1.5">
                <span>🏥</span>
                <span>Cirurgias de Afirmação & Transição de Gênero</span>
              </h4>
              <p className="text-[11px] text-[#566359] leading-tight">
                Procedimentos realizados em hospital de excelência com equipe especializada e acompanhamento pós-operatório.
              </p>

              <div className="space-y-2">
                {/* Opção Feminilização */}
                <div className="p-3 rounded-xl bg-[#fdf2f8] border border-[#fbcfe8] flex items-center justify-between gap-2.5">
                  <div>
                    <h5 className="font-heading font-bold text-xs text-[#9d174d]">
                      Transição para Gênero Feminino (Mulher Trans)
                    </h5>
                    <p className="text-[10px] text-[#566359]">
                      Feminização facial, mamoplastia com próteses e redesignação sexual (+35 Felicidade)
                    </p>
                    <span className="text-xs font-black text-[#9d174d]">R$ 18.000</span>
                  </div>
                  <button
                    type="button"
                    disabled={character.gender === 'F'}
                    onClick={() => {
                      triggerClick();
                      if (onGenderTransition) {
                        const res = onGenderTransition('F', 'Cirurgia de Redesignação & Feminização', 18000);
                        showMsg(res);
                        if (res.success) setActiveModal(null);
                      }
                    }}
                    className="py-1.5 px-3 rounded-lg font-heading font-bold text-xs bg-[#db2777] hover:bg-[#be185d] text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                  >
                    {character.gender === 'F' ? 'Atual' : 'Realizar'}
                  </button>
                </div>

                {/* Opção Masculinização */}
                <div className="p-3 rounded-xl bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-between gap-2.5">
                  <div>
                    <h5 className="font-heading font-bold text-xs text-[#1e40af]">
                      Transição para Gênero Masculino (Homem Trans)
                    </h5>
                    <p className="text-[10px] text-[#566359]">
                      Mastectomia masculinizadora, hormonioterapia e procedimentos corporais (+35 Felicidade)
                    </p>
                    <span className="text-xs font-black text-[#1e40af]">R$ 18.000</span>
                  </div>
                  <button
                    type="button"
                    disabled={character.gender === 'M'}
                    onClick={() => {
                      triggerClick();
                      if (onGenderTransition) {
                        const res = onGenderTransition('M', 'Mastectomia Masculinizadora & Hormonioterapia', 18000);
                        showMsg(res);
                        if (res.success) setActiveModal(null);
                      }
                    }}
                    className="py-1.5 px-3 rounded-lg font-heading font-bold text-xs bg-[#2563eb] hover:bg-[#1d4ed8] text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                  >
                    {character.gender === 'M' ? 'Atual' : 'Realizar'}
                  </button>
                </div>

                {/* Opção Não-Binário */}
                <div className="p-3 rounded-xl bg-[#f5f3ff] border border-[#ddd6fe] flex items-center justify-between gap-2.5">
                  <div>
                    <h5 className="font-heading font-bold text-xs text-[#5b21b6]">
                      Afirmação de Identidade Não-Binária (NB)
                    </h5>
                    <p className="text-[10px] text-[#566359]">
                      Harmonização corporal personalizada e expressão neutra (+25 Felicidade)
                    </p>
                    <span className="text-xs font-black text-[#5b21b6]">R$ 12.000</span>
                  </div>
                  <button
                    type="button"
                    disabled={character.gender === 'NB'}
                    onClick={() => {
                      triggerClick();
                      if (onGenderTransition) {
                        const res = onGenderTransition('NB', 'Afirmação Corporal Não-Binária', 12000);
                        showMsg(res);
                        if (res.success) setActiveModal(null);
                      }
                    }}
                    className="py-1.5 px-3 rounded-lg font-heading font-bold text-xs bg-[#7c3aed] hover:bg-[#6d28d9] text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                  >
                    {character.gender === 'NB' ? 'Atual' : 'Realizar'}
                  </button>
                </div>
              </div>
            </div>

            {/* Section 2: Orientação Sexual */}
            <div className="space-y-2 border-t border-[#f0eee8] pt-3">
              <h4 className="font-heading font-extrabold text-xs text-[#141E18] flex items-center gap-1.5">
                <span>🌈</span>
                <span>Definir / Assumir Orientação Sexual</span>
              </h4>
              <p className="text-[11px] text-[#566359]">
                Escolha como deseja se identificar no seu círculo social e relacionamentos:
              </p>

              <div className="grid grid-cols-2 gap-1.5">
                {[
                  'Heterossexual',
                  'Homossexual',
                  'Bissexual',
                  'Pansexual',
                  'Assexual',
                  'Demissexual',
                  'Queer',
                  'Fluida'
                ].map((ori) => (
                  <button
                    key={ori}
                    type="button"
                    onClick={() => {
                      triggerClick();
                      if (onChangeOrientation) {
                        const res = onChangeOrientation(ori);
                        showMsg(res);
                      }
                    }}
                    className={`p-2.5 rounded-xl text-left font-heading font-bold text-xs transition-all cursor-pointer flex items-center justify-between ${
                      character.sexualOrientation === ori
                        ? 'bg-[#7828c8] text-white shadow-xs'
                        : 'bg-[#fbf9f3] text-[#141E18] border border-[#ece9df] hover:border-[#7828c8]'
                    }`}
                  >
                    <span>{ori}</span>
                    {character.sexualOrientation === ori && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL SALÃO & SPA TROPICAL --- */}
      {activeModal === 'salon' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-[#ece9df] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#f0eee8] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💇‍♀️</span>
                <div>
                  <h3 className="font-heading font-black text-sm text-[#141E18]">Salão & SPA Tropical</h3>
                  <p className="text-[10px] text-[#566359]">Cabelo, sobrancelhas, unhas, estética & spa relax</p>
                </div>
              </div>
              <button onClick={() => { triggerClick(); setActiveModal(null); }} className="w-7 h-7 rounded-full bg-[#f0eee8] text-[#141E18] font-bold text-xs flex items-center justify-center hover:bg-[#e4e1d7]">✕</button>
            </div>

            {/* Current Look Badge */}
            <div className="p-3 bg-[#fdf2f8] rounded-2xl border border-[#fbcfe8] text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-heading font-extrabold text-[10px] text-[#db2777] uppercase tracking-wider">
                  Seu Visual Atual
                </span>
                <span className="text-[10px] font-bold text-[#db2777]">Saldo: R$ {stats.grana.toLocaleString('pt-BR')}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-[#831843]">
                <span>✂️ Corte: <strong>{character.hairStyle || 'Natural'}</strong></span>
                <span>🎨 Cor: <strong>{character.hairColor || 'Natural'}</strong></span>
                <span>👗 Look: <strong>{character.styleLook || 'Casual Tropical'}</strong></span>
                <span>💅 Unhas: <strong>{character.nailStyle || 'Naturais'}</strong></span>
              </div>
            </div>

            {/* Categories Switcher */}
            <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'cabelo' as const, label: '✂️ Corte' },
                { id: 'pintura' as const, label: '🎨 Cor' },
                { id: 'visual' as const, label: '👗 Visual' },
                { id: 'unhas' as const, label: '💅 Unhas' },
                { id: 'sobrancelha' as const, label: '✨ Sobrancelha' },
                { id: 'spa' as const, label: '🧖‍♀️ SPA' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => { triggerClick(); setSalonCategory(cat.id); }}
                  className={`py-1.5 px-3 rounded-xl font-heading font-bold whitespace-nowrap text-xs transition-colors cursor-pointer ${
                    salonCategory === cat.id
                      ? 'bg-[#db2777] text-white shadow-xs'
                      : 'bg-[#fbf9f3] text-[#566359] border border-[#ece9df] hover:border-[#db2777]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Services List by Active Category */}
            <div className="space-y-2">
              {salonCategory === 'cabelo' && (
                <>
                  {[
                    { name: 'Degradê na Régua / Fade Carioca', cost: 45, bonus: 12, desc: 'Acabamento perfeito com navalha e fixador' },
                    { name: 'Chanel Tropical Repicado', cost: 80, bonus: 18, desc: 'Corte moderno, fresco e jovial' },
                    { name: 'Black Power Imponente & Estiloso', cost: 65, bonus: 20, desc: 'Volume e definição com óleos naturais' },
                    { name: 'Corte Surfista Praiano', cost: 50, bonus: 15, desc: 'Fios desconectados com parafina' },
                    { name: 'Raspado Militar Moderno', cost: 35, bonus: 10, desc: 'Praticidade total para a rotina diária' },
                    { name: 'Tranças Afro / Box Braids', cost: 220, bonus: 30, desc: 'Trançamento artesanal com jumbo de alta qualidade' }
                  ].map((srv, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#fbf9f3] border border-[#ece9df] flex items-center justify-between gap-3 text-xs">
                      <div>
                        <h5 className="font-heading font-bold text-[#141E18]">{srv.name}</h5>
                        <p className="text-[10px] text-[#566359]">{srv.desc} (+{srv.bonus} Felicidade)</p>
                        <span className="text-xs font-bold text-[#087F48]">R$ {srv.cost.toLocaleString('pt-BR')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          triggerClick();
                          if (onSalonAction) {
                            const res = onSalonAction({ type: 'cabelo', name: srv.name, cost: srv.cost, happinessBonus: srv.bonus });
                            showMsg(res);
                          }
                        }}
                        className="py-1 px-3 rounded-lg font-heading font-bold text-xs bg-[#0ca768] hover:bg-[#087F48] text-white cursor-pointer"
                      >
                        Fazer
                      </button>
                    </div>
                  ))}
                </>
              )}

              {salonCategory === 'pintura' && (
                <>
                  {[
                    { name: 'Loiro Platinado Nevou', cost: 180, bonus: 25, desc: 'Descoloração total estilo clássico brasileiro' },
                    { name: 'Morena Iluminada Caramelo', cost: 210, bonus: 22, desc: 'Mechas sutis e sofisticadas com brilho' },
                    { name: 'Rosa Choque / Cabelo Fantasia', cost: 240, bonus: 28, desc: 'Pigmento vibrante e cheio de personalidade' },
                    { name: 'Castanho Aveludado Brilhante', cost: 130, bonus: 15, desc: 'Banho de verniz e tonalizante suave' },
                    { name: 'Ruivo Acobreado Intenso', cost: 220, bonus: 25, desc: 'Cor quente e elegante com hidratação' }
                  ].map((srv, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#fbf9f3] border border-[#ece9df] flex items-center justify-between gap-3 text-xs">
                      <div>
                        <h5 className="font-heading font-bold text-[#141E18]">{srv.name}</h5>
                        <p className="text-[10px] text-[#566359]">{srv.desc} (+{srv.bonus} Felicidade)</p>
                        <span className="text-xs font-bold text-[#087F48]">R$ {srv.cost.toLocaleString('pt-BR')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          triggerClick();
                          if (onSalonAction) {
                            const res = onSalonAction({ type: 'pintura', name: srv.name, cost: srv.cost, happinessBonus: srv.bonus });
                            showMsg(res);
                          }
                        }}
                        className="py-1 px-3 rounded-lg font-heading font-bold text-xs bg-[#0ca768] hover:bg-[#087F48] text-white cursor-pointer"
                      >
                        Pintar
                      </button>
                    </div>
                  ))}
                </>
              )}

              {salonCategory === 'visual' && (
                <>
                  {[
                    { name: 'Consultoria de Estilo Faria Lima Chic', cost: 650, bonus: 35, desc: 'Alfaiataria moderna, blazer e tênis branco' },
                    { name: 'Look Streetwear Cria de Quebrada', cost: 380, bonus: 30, desc: 'Camisa oversized, bermuda cargo e cordão' },
                    { name: 'Look Praia Chique Tropical', cost: 420, bonus: 25, desc: 'Linho leve, chapéu panamá e óculos escuros' },
                    { name: 'Estilo Minimalista Elegante', cost: 500, bonus: 28, desc: 'Cores sóbrias e tecidos premium atemporais' }
                  ].map((srv, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#fbf9f3] border border-[#ece9df] flex items-center justify-between gap-3 text-xs">
                      <div>
                        <h5 className="font-heading font-bold text-[#141E18]">{srv.name}</h5>
                        <p className="text-[10px] text-[#566359]">{srv.desc} (+{srv.bonus} Felicidade)</p>
                        <span className="text-xs font-bold text-[#087F48]">R$ {srv.cost.toLocaleString('pt-BR')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          triggerClick();
                          if (onSalonAction) {
                            const res = onSalonAction({ type: 'visual', name: srv.name, cost: srv.cost, happinessBonus: srv.bonus });
                            showMsg(res);
                          }
                        }}
                        className="py-1 px-3 rounded-lg font-heading font-bold text-xs bg-[#0ca768] hover:bg-[#087F48] text-white cursor-pointer"
                      >
                        Renovar
                      </button>
                    </div>
                  ))}
                </>
              )}

              {salonCategory === 'unhas' && (
                <>
                  {[
                    { name: 'Alongamento em Fibra de Vidro', cost: 160, bonus: 20, desc: 'Resistência máxima com curvatura natural' },
                    { name: 'Unhas em Gel Decoradas (Nail Art)', cost: 120, bonus: 18, desc: 'Glitter, degradê e joias encapsuladas' },
                    { name: 'Francesinha Tradicional Perfeita', cost: 55, bonus: 12, desc: 'Unhas clássicas, delicadas e polidas' },
                    { name: 'Esmaltação Vermelho Clássico', cost: 40, bonus: 10, desc: 'Manicure express com secagem rápida' }
                  ].map((srv, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#fbf9f3] border border-[#ece9df] flex items-center justify-between gap-3 text-xs">
                      <div>
                        <h5 className="font-heading font-bold text-[#141E18]">{srv.name}</h5>
                        <p className="text-[10px] text-[#566359]">{srv.desc} (+{srv.bonus} Felicidade)</p>
                        <span className="text-xs font-bold text-[#087F48]">R$ {srv.cost.toLocaleString('pt-BR')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          triggerClick();
                          if (onSalonAction) {
                            const res = onSalonAction({ type: 'unhas', name: srv.name, cost: srv.cost, happinessBonus: srv.bonus });
                            showMsg(res);
                          }
                        }}
                        className="py-1 px-3 rounded-lg font-heading font-bold text-xs bg-[#0ca768] hover:bg-[#087F48] text-white cursor-pointer"
                      >
                        Fazer Unhas
                      </button>
                    </div>
                  ))}
                </>
              )}

              {salonCategory === 'sobrancelha' && (
                <>
                  {[
                    { name: 'Micropigmentação Fio a Fio', cost: 350, bonus: 28, desc: 'Preenchimento realista com durabilidade de 1 ano' },
                    { name: 'Design com Aplicação de Henna', cost: 65, bonus: 15, desc: 'Contorno marcante e desenho harmônico' },
                    { name: 'Epilação na Linha Egípcia', cost: 45, bonus: 12, desc: 'Remoção precisa pela raiz sem agredir a pele' },
                    { name: 'Brow Lamination & Alinhamento', cost: 150, bonus: 22, desc: 'Fios alinhados, encorpados e volumosos' }
                  ].map((srv, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#fbf9f3] border border-[#ece9df] flex items-center justify-between gap-3 text-xs">
                      <div>
                        <h5 className="font-heading font-bold text-[#141E18]">{srv.name}</h5>
                        <p className="text-[10px] text-[#566359]">{srv.desc} (+{srv.bonus} Felicidade)</p>
                        <span className="text-xs font-bold text-[#087F48]">R$ {srv.cost.toLocaleString('pt-BR')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          triggerClick();
                          if (onSalonAction) {
                            const res = onSalonAction({ type: 'sobrancelha', name: srv.name, cost: srv.cost, happinessBonus: srv.bonus });
                            showMsg(res);
                          }
                        }}
                        className="py-1 px-3 rounded-lg font-heading font-bold text-xs bg-[#0ca768] hover:bg-[#087F48] text-white cursor-pointer"
                      >
                        Modelar
                      </button>
                    </div>
                  ))}
                </>
              )}

              {salonCategory === 'spa' && (
                <>
                  {[
                    { name: 'Massagem com Pedras Quentes', cost: 280, bonus: 35, desc: 'Alívio completo de tensões e renovação energética' },
                    { name: 'Banho de Ofurô com Flores Tropicais', cost: 320, bonus: 40, desc: 'Imersão aromática com óleos da Amazônia' },
                    { name: 'Limpeza de Pele Profunda com Argila', cost: 180, bonus: 25, desc: 'Extração, hidratação profunda e máscara facial' }
                  ].map((srv, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#fbf9f3] border border-[#ece9df] flex items-center justify-between gap-3 text-xs">
                      <div>
                        <h5 className="font-heading font-bold text-[#141E18]">{srv.name}</h5>
                        <p className="text-[10px] text-[#566359]">{srv.desc} (+{srv.bonus} Felicidade)</p>
                        <span className="text-xs font-bold text-[#087F48]">R$ {srv.cost.toLocaleString('pt-BR')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          triggerClick();
                          if (onSalonAction) {
                            const res = onSalonAction({ type: 'spa', name: srv.name, cost: srv.cost, happinessBonus: srv.bonus });
                            showMsg(res);
                          }
                        }}
                        className="py-1 px-3 rounded-lg font-heading font-bold text-xs bg-[#0ca768] hover:bg-[#087F48] text-white cursor-pointer"
                      >
                        Relaxar
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL CONFIGURAÇÕES COMPLETO & SAVES --- */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-[#ece9df] space-y-4">
            <div className="flex items-center justify-between border-b border-[#f0eee8] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚙️</span>
                <div>
                  <h3 className="font-heading font-black text-sm text-[#141E18]">Configurações do Jogo</h3>
                  <p className="text-[10px] text-[#566359]">Gerencie seus saves, temas e preferências</p>
                </div>
              </div>
              <button
                onClick={() => { triggerClick(); setActiveModal(null); }}
                className="w-7 h-7 rounded-full bg-[#f0eee8] text-[#141E18] font-bold text-xs flex items-center justify-center hover:bg-[#e4e1d7]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
              {/* Estilo de Vida */}
              <div className="p-3 bg-[#fbf9f3] rounded-2xl border border-[#ece9df] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-extrabold text-xs text-[#141E18]">🏡 Estilo de Vida</span>
                  <span className="text-[10px] font-bold text-[#b07d00] uppercase bg-[#fff9e6] px-2 py-0.5 rounded-full">
                    {character.lifeStyle || 'Tranquilo'}
                  </span>
                </div>
                <p className="text-[10px] text-[#566359] leading-tight">
                  Define o consumo diário e padrão dos seus gastos pessoais:
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Humilde', 'Tranquilo', 'Luxo'] as const).map((ls) => (
                    <button
                      key={ls}
                      type="button"
                      onClick={() => {
                        triggerClick();
                        if (onUpdateCharacterSettings) onUpdateCharacterSettings({ lifeStyle: ls });
                        showMsg({ success: true, message: `Estilo de vida definido como: ${ls.toUpperCase()}!` });
                      }}
                      className={`py-1.5 px-1 rounded-xl font-heading font-bold text-[10px] text-center transition-all cursor-pointer ${
                        (character.lifeStyle || 'Tranquilo') === ls
                          ? 'bg-[#006437] text-white shadow-xs'
                          : 'bg-white text-[#566359] border border-[#ece9df] hover:border-[#006437]'
                      }`}
                    >
                      {ls === 'Humilde' ? '🌾 Humilde' : ls === 'Tranquilo' ? '☕ Tranquilo' : '💎 Luxo'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Estilo de Roupa */}
              <div className="p-3 bg-[#fbf9f3] rounded-2xl border border-[#ece9df] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-extrabold text-xs text-[#141E18]">👔 Estilo de Roupa</span>
                  <span className="text-[10px] font-bold text-[#0B66C3] uppercase bg-[#edf5fd] px-2 py-0.5 rounded-full truncate max-w-[110px]">
                    {character.styleLook || 'Casual'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {[
                    'Casual Tropical',
                    'Cria de Quebrada',
                    'Social / Faria Lima Chic',
                    'Agro Sertanejo',
                    'Praia & Surf',
                    'Minimalista Chic'
                  ].map((look) => (
                    <button
                      key={look}
                      type="button"
                      onClick={() => {
                        triggerClick();
                        if (onUpdateCharacterSettings) onUpdateCharacterSettings({ styleLook: look });
                        showMsg({ success: true, message: `Estilo de roupa alterado para ${look}!` });
                      }}
                      className={`py-1.5 px-2 rounded-xl font-heading font-bold text-[10px] truncate text-center transition-all cursor-pointer ${
                        (character.styleLook || 'Casual Tropical') === look
                          ? 'bg-[#0B66C3] text-white shadow-xs'
                          : 'bg-white text-[#566359] border border-[#ece9df] hover:border-[#0B66C3]'
                      }`}
                    >
                      {look}
                    </button>
                  ))}
                </div>
              </div>

              {/* Passagem do Tempo (Ritmo do Jogo) */}
              <div className="p-3 bg-[#fbf9f3] rounded-2xl border border-[#ece9df] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#0B66C3]" />
                    <span className="font-heading font-extrabold text-xs text-[#141E18]">
                      Passagem do Tempo (Tempo ⚙️)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#0B66C3] uppercase font-heading bg-[#edf5fd] px-2 py-0.5 rounded-full border border-[#b8d6f5]">
                    {timeAdvanceMode}
                  </span>
                </div>
                <p className="text-[10px] text-[#566359] leading-tight">
                  Escolha como o tempo avança a cada avanço no jogo:
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['anual', 'semestral', 'mensal'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        triggerClick();
                        if (onChangeTimeMode) onChangeTimeMode(mode);
                        showMsg({ success: true, message: `Ritmo de tempo ajustado para: ${mode.toUpperCase()}!` });
                      }}
                      className={`py-2 px-1 rounded-xl font-heading font-bold text-[10px] sm:text-[11px] capitalize text-center transition-all cursor-pointer ${
                        timeAdvanceMode === mode
                          ? 'bg-[#006437] text-white shadow-xs'
                          : 'bg-white text-[#566359] border border-[#ece9df] hover:border-[#006437]'
                      }`}
                    >
                      {mode === 'anual' ? '📅 Anual' : mode === 'semestral' ? '🌓 Semestral' : '🌙 Mensal'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opções de Atualizações do Diário (Tempo ⚙️) */}
              <div className="p-3 bg-[#fbf9f3] rounded-2xl border-2 border-dashed border-[#cbb390] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#087F48]" />
                    <span className="font-heading font-extrabold text-xs text-[#141E18]">
                      Configuração (Tempo ⚙️) &amp; Novidades
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-[#e8f5e9] text-[#1b5e20] px-2 py-0.5 rounded-full border border-[#a5d6a7]">
                    v2.5.0
                  </span>
                </div>
                <p className="text-[10px] text-[#566359] leading-tight">
                  Veja os novos recursos do diário ou teste o aviso de atualização a qualquer momento:
                </p>
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      triggerClick();
                      if (onOpenWhatsNew) {
                        onOpenWhatsNew();
                      }
                    }}
                    className="py-2 px-2 rounded-xl bg-[#087F48] hover:bg-[#066337] active:scale-95 text-white font-heading font-bold text-xs text-center transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Ver Novidades ✨</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerClick();
                      if (onTestVersionNotice) {
                        onTestVersionNotice();
                        showMsg({ success: true, message: 'Balão "Nova versão disponível!" disparado no topo!' });
                      }
                    }}
                    className="py-2 px-2 rounded-xl bg-white hover:bg-[#f0eee8] active:scale-95 text-[#2e1d0f] border border-[#cbb390] font-heading font-bold text-xs text-center transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Testar Aviso 🔔</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  triggerClick();
                  setActiveModal(null);
                  onOpenCreatorMode();
                }}
                className="w-full p-3 rounded-xl bg-[#fff0f0] hover:bg-[#fce5e5] border border-[#f9d7d7] text-left transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-[#D9532F]" />
                <div>
                  <h5 className="font-heading font-bold text-xs text-[#D9532F]">Abrir Modo Criador (God Mode)</h5>
                  <p className="text-[10px] text-[#b53c1d]">Customizar personagem, atributos e grana</p>
                </div>
              </button>

              <button
                onClick={() => {
                  triggerClick();
                  onSaveGame();
                  showMsg({ success: true, message: 'Vida atual salva no navegador com sucesso!' });
                }}
                className="w-full p-3 rounded-xl bg-[#E6F5ED] hover:bg-[#d5f0e1] border border-[#a2e6bd] text-left transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#087F48]" />
                <div>
                  <h5 className="font-heading font-bold text-xs text-[#006437]">Salvar Jogo Atual</h5>
                  <p className="text-[10px] text-[#087F48]">Grava o estado atual no seu dispositivo</p>
                </div>
              </button>

              <button
                onClick={() => {
                  triggerClick();
                  setActiveModal(null);
                  onGoHomeSaves();
                }}
                className="w-full p-3 rounded-xl bg-[#edf5fd] hover:bg-[#dbebfb] border border-[#b2d3f5] text-left transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4 text-[#0B66C3]" />
                <div>
                  <h5 className="font-heading font-bold text-xs text-[#0B66C3]">Página Inicial (Gerenciar Saves)</h5>
                  <p className="text-[10px] text-[#0B66C3]">Escolher outros saves ou iniciar nova vida</p>
                </div>
              </button>

              <button
                onClick={() => {
                  triggerClick();
                  setActiveModal(null);
                  onNewGame();
                }}
                className="w-full p-3 rounded-xl bg-[#fff0f0] hover:bg-[#fce5e5] border border-[#f9d7d7] text-left transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-[#D9532F]" />
                <div>
                  <h5 className="font-heading font-bold text-xs text-[#D9532F]">Criar Novo Personagem</h5>
                  <p className="text-[10px] text-[#b53c1d]">Começar trajetória do zero</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL NEGÓCIOS & EMPRESA --- */}
      {activeModal === 'business' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-[#ece9df] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#f0eee8] pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#087F48]" />
                <div>
                  <h3 className="font-heading font-black text-sm text-[#141E18]">Módulo de Negócios & Empresa</h3>
                  <p className="text-[10px] text-[#566359]">Sua empresa própria no Brasil</p>
                </div>
              </div>
              <button
                onClick={() => { triggerClick(); setActiveModal(null); }}
                className="w-7 h-7 rounded-full bg-[#f0eee8] text-[#141E18] font-bold text-xs flex items-center justify-center hover:bg-[#e4e1d7]"
              >
                ✕
              </button>
            </div>

            <BusinessModule
              company={company}
              userCash={stats.grana}
              onCreateCompany={onCreateCompany}
              onHireEmployee={onHireEmployee}
              onPromoteEmployee={onPromoteEmployee}
              onFireEmployee={onFireEmployee}
              onExpandBranch={onExpandBranch}
              onFranchiseCompany={onFranchiseCompany}
              onLaunchIPO={onLaunchIPO}
              onSellCompany={onSellCompany}
            />
          </div>
        </div>
      )}

      {/* --- MODAL HABILITAÇÃO & CNH --- */}
      {activeModal === 'cnh' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-[#ece9df] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#f0eee8] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💳</span>
                <div>
                  <h3 className="font-heading font-black text-sm text-[#141E18]">Habilitação & CNH (DETRAN)</h3>
                  <p className="text-[10px] text-[#566359]">Exame teórico e emissão oficial de carteira</p>
                </div>
              </div>
              <button
                onClick={() => { triggerClick(); setActiveModal(null); setCnhExamStarted(false); setCnhExamFinished(false); }}
                className="w-7 h-7 rounded-full bg-[#f0eee8] text-[#141E18] font-bold text-xs flex items-center justify-center hover:bg-[#e4e1d7]"
              >
                ✕
              </button>
            </div>

            {/* Current Status */}
            <div className="p-3 bg-[#f5f8f6] rounded-2xl border border-[#d1e5d9] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#566359] block font-bold">Situação Atual:</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs font-heading font-bold px-2 py-0.5 rounded-full ${driverLicense?.hasCategoryA ? 'bg-[#e6f5ed] text-[#006437]' : 'bg-[#fff0f0] text-[#D9532F]'}`}>
                    {driverLicense?.hasCategoryA ? '🏍️ Categoria A (Moto)' : '❌ Sem Moto'}
                  </span>
                  <span className={`text-xs font-heading font-bold px-2 py-0.5 rounded-full ${driverLicense?.hasCategoryB ? 'bg-[#e6f5ed] text-[#006437]' : 'bg-[#fff0f0] text-[#D9532F]'}`}>
                    {driverLicense?.hasCategoryB ? '🚗 Categoria B (Carro)' : '❌ Sem Carro'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-black text-[#006437]">R$ {stats.grana.toLocaleString('pt-BR')}</span>
            </div>

            {!cnhExamStarted && !cnhExamFinished ? (
              <div className="space-y-3">
                <label className="text-xs font-heading font-bold text-[#141E18] block">
                  Escolha a categoria que deseja tirar:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['A', 'B', 'AB'] as const).map((cat) => {
                    const price = cat === 'A' ? 1200 : cat === 'B' ? 1800 : 2500;
                    return (
                      <button
                        key={cat}
                        onClick={() => { triggerClick(); setCnhCategory(cat); }}
                        className={`p-2.5 rounded-2xl border text-center transition cursor-pointer ${
                          cnhCategory === cat
                            ? 'bg-[#006437] text-white border-[#006437] shadow-xs'
                            : 'bg-[#fbf9f3] text-[#141E18] border-[#ece9df] hover:border-[#006437]'
                        }`}
                      >
                        <span className="font-heading font-black text-sm block">Cat. {cat}</span>
                        <span className="text-[10px] opacity-80 block">{cat === 'A' ? 'Moto' : cat === 'B' ? 'Carro' : 'Moto + Carro'}</span>
                        <span className="text-[11px] font-bold block mt-1">R$ {price.toLocaleString('pt-BR')}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 bg-[#fffbeb] border border-[#fef08a] rounded-2xl text-[11px] text-[#92400e] space-y-1">
                  <p className="font-bold flex items-center gap-1">📋 Regras da Autoescola & DETRAN:</p>
                  <p>• A prova teórica possui 5 perguntas sobre sinalização e Código de Trânsito Brasileiro (CTB).</p>
                  <p>• Você precisa acertar no mínimo 3 de 5 (60%) para ser aprovado(a) e receber a CNH.</p>
                </div>

                <button
                  onClick={() => {
                    triggerClick();
                    setCnhExamStarted(true);
                    setCnhCurrentQIdx(0);
                    setCnhCorrectCount(0);
                    setCnhExamFinished(false);
                  }}
                  className="w-full py-3 rounded-2xl bg-[#006437] hover:bg-[#07532f] text-white font-heading font-black text-xs cursor-pointer shadow-md transition"
                >
                  Iniciar Exame Teórico do DETRAN →
                </button>
              </div>
            ) : cnhExamStarted && !cnhExamFinished ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-[#566359]">
                  <span>Questão {cnhCurrentQIdx + 1} de {CNH_EXAM_QUESTIONS.length}</span>
                  <span className="text-[#006437] font-extrabold">{cnhCorrectCount} corretas até aqui</span>
                </div>

                <div className="p-3.5 bg-[#fbf9f3] border border-[#ece9df] rounded-2xl text-xs font-heading font-extrabold text-[#141E18] leading-snug">
                  {CNH_EXAM_QUESTIONS[cnhCurrentQIdx]?.question}
                </div>

                <div className="space-y-2">
                  {CNH_EXAM_QUESTIONS[cnhCurrentQIdx]?.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => {
                        triggerClick();
                        const wasCorrect = opt.isCorrect;
                        const updatedCorrect = wasCorrect ? cnhCorrectCount + 1 : cnhCorrectCount;
                        setCnhCorrectCount(updatedCorrect);

                        if (cnhCurrentQIdx + 1 < CNH_EXAM_QUESTIONS.length) {
                          setCnhCurrentQIdx(cnhCurrentQIdx + 1);
                        } else {
                          setCnhExamFinished(true);
                          const passed = updatedCorrect >= 3;
                          setCnhPassed(passed);
                          if (passed) {
                            const res = onEarnCNH(cnhCategory);
                            showMsg(res);
                          } else {
                            playErrorSound();
                            showMsg({ success: false, message: `Reprovado(a)! Você acertou ${updatedCorrect}/5. É necessário ao menos 3/5.` });
                          }
                        }
                      }}
                      className="w-full p-3 rounded-xl bg-white hover:bg-[#f0fbf4] border border-[#ece9df] hover:border-[#006437] text-left text-xs font-medium text-[#141E18] transition cursor-pointer flex items-center justify-between"
                    >
                      <span>{opt.text}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#566359] flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center py-2">
                <div className="text-4xl">{cnhPassed ? '🎉' : '❌'}</div>
                <h4 className="font-heading font-black text-base text-[#141E18]">
                  {cnhPassed ? 'Parabéns, você foi Aprovado(a)!' : 'Você foi Reprovado(a) no Exame!'}
                </h4>
                <p className="text-xs text-[#566359]">
                  {cnhPassed
                    ? `Você acertou ${cnhCorrectCount} de 5 questões e sua CNH Categoria ${cnhCategory} já está ativa!`
                    : `Você acertou apenas ${cnhCorrectCount} de 5 questões. Estude a legislação e tente de novo.`}
                </p>

                <button
                  onClick={() => {
                    triggerClick();
                    setCnhExamStarted(false);
                    setCnhExamFinished(false);
                    if (cnhPassed) setActiveModal(null);
                  }}
                  className="w-full py-2.5 rounded-2xl bg-[#006437] text-white font-heading font-bold text-xs cursor-pointer shadow-xs"
                >
                  {cnhPassed ? 'Concluir & Fechar' : 'Tentar Novamente'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL AGRO & FAZENDA --- */}
      {activeModal === 'agro' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-[#ece9df] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#f0eee8] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚜</span>
                <div>
                  <h3 className="font-heading font-black text-sm text-[#141E18]">Agro & Fazenda Brasil</h3>
                  <p className="text-[10px] text-[#566359]">Arrendamento rural, safra de grãos & custeio</p>
                </div>
              </div>
              <button onClick={() => { triggerClick(); setActiveModal(null); }} className="w-7 h-7 rounded-full bg-[#f0eee8] text-[#141E18] font-bold text-xs flex items-center justify-center">✕</button>
            </div>

            {/* Farm Status */}
            <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-xs font-heading font-bold">
                <span className="text-[#166534]">🌱 Propriedade Rural:</span>
                <span className="text-[#15803d]">{gameState?.agro?.hasLand ? '50 ha Arrendados' : 'Nenhuma terra ativa'}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#566359]">
                <span>Cultivo Atual:</span>
                <span className="font-bold text-[#141E18]">{gameState?.agro?.cultivo ? `Custeio ${gameState.agro.cultivo}` : 'Pronto para semear'}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#566359]">
                <span>Saldo em Conta:</span>
                <span className="font-black text-[#006437]">R$ {stats.grana.toLocaleString('pt-BR')}</span>
              </div>
            </div>

            {/* Arrendamento Section */}
            <div className="p-3 bg-[#fbf9f3] border border-[#ece9df] rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-xs text-[#141E18]">1. Arrendamento de Terras</h4>
                <span className="text-[10px] font-bold text-[#16a34a] bg-[#dcfce7] px-2 py-0.5 rounded-full">R$ 2.000 / safra</span>
              </div>
              <p className="text-[11px] text-[#566359]">
                Arrende 50 hectares de terra roxa fértil no interior do Brasil para cultivar safras agrícolas.
              </p>
              <button
                onClick={() => {
                  triggerClick();
                  const res = onArrendarTerra();
                  showMsg(res);
                }}
                className="w-full py-2 px-3 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-heading font-bold text-xs cursor-pointer shadow-xs transition"
              >
                {gameState?.agro?.hasLand ? 'Renovar Arrendamento (R$ 2.000)' : 'Arrendar 50 Hectares (R$ 2.000)'}
              </button>
            </div>

            {/* Safra & Custeio Section */}
            <div className="p-3 bg-[#fbf9f3] border border-[#ece9df] rounded-2xl space-y-3">
              <h4 className="font-heading font-bold text-xs text-[#141E18]">2. Escolha da Cultura & Nível Tecnológico</h4>

              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'soja', name: '🌱 Soja', desc: 'Alta liquidez' },
                  { id: 'milho', name: '🌽 Milho', desc: 'Safrinha veloz' },
                  { id: 'cafe', name: '☕ Café', desc: 'Alto valor' }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { triggerClick(); setSelectedCrop(c.id as any); }}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                      selectedCrop === c.id
                        ? 'bg-[#15803d] text-white border-[#15803d]'
                        : 'bg-white text-[#141E18] border-[#ece9df] hover:border-[#15803d]'
                    }`}
                  >
                    <span className="font-bold text-xs block">{c.name}</span>
                    <span className="text-[9px] opacity-80 block">{c.desc}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                {[
                  { level: 'economico', name: '🌾 Custeio Econômico', price: 500, desc: 'Sementes convencionais e manejo básico' },
                  { level: 'padrao', name: '🚜 Custeio Padrão', price: 1500, desc: 'Sementes transgênicas e defensivos recomendados' },
                  { level: 'completo', name: '🚁 Alta Tecnologia (Drones)', price: 4000, desc: 'Agricultura de precisão, drones e bioinsumos' }
                ].map((item) => (
                  <button
                    key={item.level}
                    onClick={() => { triggerClick(); setSelectedPlantLevel(item.level as any); }}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                      selectedPlantLevel === item.level
                        ? 'bg-[#e8f5e9] border-[#15803d] text-[#15803d]'
                        : 'bg-white border-[#ece9df] text-[#141E18] hover:border-[#15803d]'
                    }`}
                  >
                    <div>
                      <span className="font-heading font-bold text-xs block">{item.name}</span>
                      <span className="text-[10px] text-[#566359] block">{item.desc}</span>
                    </div>
                    <span className="font-extrabold text-xs text-[#15803d] whitespace-nowrap">R$ {item.price.toLocaleString('pt-BR')}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  triggerClick();
                  const res = onPlant(selectedCrop, selectedPlantLevel);
                  showMsg(res);
                }}
                className="w-full py-2.5 rounded-xl bg-[#006437] hover:bg-[#07532f] text-white font-heading font-black text-xs cursor-pointer shadow-md transition"
              >
                Semear Safra Agora →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL VIDA NO EXTERIOR --- */}
      {activeModal === 'international' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-[#ece9df] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#f0eee8] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✈️</span>
                <div>
                  <h3 className="font-heading font-black text-sm text-[#141E18]">Vida no Exterior & Emigração</h3>
                  <p className="text-[10px] text-[#566359]">Mude-se de país, obtenha vistos e ganhe em moeda forte</p>
                </div>
              </div>
              <button onClick={() => { triggerClick(); setActiveModal(null); }} className="w-7 h-7 rounded-full bg-[#f0eee8] text-[#141E18] font-bold text-xs flex items-center justify-center">✕</button>
            </div>

            <div className="p-3 bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-[#1e40af] block font-bold">Localização Atual:</span>
                <span className="font-heading font-extrabold text-[#1e3a8a]">{character.currentCity || 'São Paulo (Brasil) 🇧🇷'}</span>
              </div>
              <span className="text-xs font-black text-[#006437]">R$ {stats.grana.toLocaleString('pt-BR')}</span>
            </div>

            <div className="space-y-2">
              {[
                { city: 'Lisboa', country: 'Portugal 🇵🇹', cost: 8000, desc: 'Facilidade de idioma, visto D2/D7 e custo em Euro' },
                { city: 'Miami', country: 'Estados Unidos 🇺🇸', cost: 12000, desc: 'Clima tropical, comunidade de brasileiros e dólar' },
                { city: 'Tóquio', country: 'Japão 🇯🇵', cost: 15000, desc: 'Metrópole futurista, segurança máxima e alta tecnologia' },
                { city: 'Buenos Aires', country: 'Argentina 🇦🇷', cost: 5000, desc: 'Próximo do Brasil, tango, gastronomia e livre trânsito Mercosul' },
                { city: 'Londres', country: 'Reino Unido 🇬🇧', cost: 12000, desc: 'Centro financeiro internacional, pontualidade e libra esterlina' },
                { city: 'Paris', country: 'França 🇫🇷', cost: 11000, desc: 'Capital cultural da Europa, gastronomia e museus' },
                { city: 'Barcelona', country: 'Espanha 🇪🇸', cost: 10000, desc: 'Praias, arquitetura única e alta qualidade de vida' },
                { city: 'Dubai', country: 'Emirados Árabes 🇦🇪', cost: 14000, desc: 'Isenção de imposto de renda e luxo internacional' }
              ].map((dest) => (
                <div key={dest.city} className="p-3 bg-[#fbf9f3] border border-[#ece9df] rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <h5 className="font-heading font-extrabold text-[#141E18]">{dest.city} - {dest.country}</h5>
                    <p className="text-[10px] text-[#566359] leading-tight">{dest.desc}</p>
                    <span className="text-xs font-black text-[#2563eb] mt-0.5 block">Passagem + Visto: R$ {dest.cost.toLocaleString('pt-BR')}</span>
                  </div>
                  <button
                    onClick={() => {
                      triggerClick();
                      const res = onMoveAbroad(dest.city);
                      showMsg(res);
                      if (res.success) setActiveModal(null);
                    }}
                    className="py-1.5 px-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-heading font-bold text-xs cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    Mudar-se
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL POSTO DE SAÚDE & PLANOS --- */}
      {activeModal === 'health' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-[#ece9df] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#f0eee8] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏥</span>
                <div>
                  <h3 className="font-heading font-black text-sm text-[#141E18]">Posto de Saúde & Planos Médicos</h3>
                  <p className="text-[10px] text-[#566359]">Atendimento público e particular no Brasil</p>
                </div>
              </div>
              <button onClick={() => { triggerClick(); setActiveModal(null); }} className="w-7 h-7 rounded-full bg-[#f0eee8] text-[#141E18] font-bold text-xs flex items-center justify-center">✕</button>
            </div>

            <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#065f46] block font-bold">Saúde Atual do Personagem:</span>
                <span className="text-sm font-heading font-extrabold text-[#047857]">{stats.saude}% / 100%</span>
              </div>
              <div className="w-24 bg-[#d1fae5] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#10b981] h-full rounded-full transition-all" style={{ width: `${stats.saude}%` }} />
              </div>
            </div>

            <div className="space-y-2.5">
              {/* 1. SUS */}
              <div className="p-3 bg-[#fbf9f3] border border-[#ece9df] rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div>
                  <h5 className="font-heading font-bold text-[#141E18] flex items-center gap-1.5">
                    🏛️ Postinho do SUS <span className="text-[9px] font-bold bg-[#dcfce7] text-[#15803d] px-1.5 py-0.5 rounded-full">100% Gratuito</span>
                  </h5>
                  <p className="text-[10px] text-[#566359]">Fila de espera, atendimento humanizado e remédios básicos (+20 Saúde)</p>
                </div>
                <button
                  onClick={() => {
                    triggerClick();
                    const res = onHealthAction('sus');
                    showMsg(res);
                  }}
                  className="py-1.5 px-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-heading font-bold text-xs cursor-pointer shadow-xs whitespace-nowrap"
                >
                  Consultar
                </button>
              </div>

              {/* 2. Plano Empresa */}
              <div className="p-3 bg-[#fbf9f3] border border-[#ece9df] rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div>
                  <h5 className="font-heading font-bold text-[#141E18] flex items-center gap-1.5">
                    🏢 Check-up pelo Plano da Empresa
                  </h5>
                  <p className="text-[10px] text-[#566359]">Exige benefício corporativo no emprego atual (+35 Saúde)</p>
                </div>
                <button
                  onClick={() => {
                    triggerClick();
                    const res = onHealthAction('plano_empresa');
                    showMsg(res);
                  }}
                  className="py-1.5 px-3 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-heading font-bold text-xs cursor-pointer shadow-xs whitespace-nowrap"
                >
                  Agendar
                </button>
              </div>

              {/* 3. Plano Particular */}
              <div className="p-3 bg-[#fbf9f3] border border-[#ece9df] rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div>
                  <h5 className="font-heading font-bold text-[#141E18] flex items-center gap-1.5">
                    🩺 Plano de Saúde Particular <span className="text-[10px] font-bold text-[#b45309]">R$ 450</span>
                  </h5>
                  <p className="text-[10px] text-[#566359]">Adesão mensal particular, hospitais de ponta e leito VIP (+40 Saúde)</p>
                </div>
                <button
                  onClick={() => {
                    triggerClick();
                    const res = onHealthAction('plano_particular');
                    showMsg(res);
                  }}
                  className="py-1.5 px-3 rounded-xl bg-[#006437] hover:bg-[#07532f] text-white font-heading font-bold text-xs cursor-pointer shadow-xs whitespace-nowrap"
                >
                  Contratar
                </button>
              </div>

              {/* 4. Consulta Especialista */}
              <div className="p-3 bg-[#fbf9f3] border border-[#ece9df] rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div>
                  <h5 className="font-heading font-bold text-[#141E18] flex items-center gap-1.5">
                    👨‍⚕️ Consulta Especialista VIP <span className="text-[10px] font-bold text-[#b45309]">R$ 350</span>
                  </h5>
                  <p className="text-[10px] text-[#566359]">Atendimento sem espera com especialista renomado (+30 Saúde, +15 Felicidade)</p>
                </div>
                <button
                  onClick={() => {
                    triggerClick();
                    const res = onHealthAction('consulta_especialista');
                    showMsg(res);
                  }}
                  className="py-1.5 px-3 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-heading font-bold text-xs cursor-pointer shadow-xs whitespace-nowrap"
                >
                  Consultar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL VIAGENS & VOOS --- */}
      {activeModal === 'travel' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-[#ece9df] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#f0eee8] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛫</span>
                <div>
                  <h3 className="font-heading font-black text-sm text-[#141E18]">Agendar Viagem & Voos</h3>
                  <p className="text-[10px] text-[#566359]">Destinos nacionais, internacionais & classe executiva</p>
                </div>
              </div>
              <button onClick={() => { triggerClick(); setActiveModal(null); }} className="w-7 h-7 rounded-full bg-[#f0eee8] text-[#141E18] font-bold text-xs flex items-center justify-center">✕</button>
            </div>

            {/* Destination Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-bold text-[#141E18]">Escolha o Destino:</label>
              <select
                value={travelDestIndex}
                onChange={(e) => setTravelDestIndex(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#ece9df] bg-[#fbf9f3] text-xs font-heading font-bold text-[#141E18] focus:outline-none focus:border-[#0284c7]"
              >
                {INTERNATIONAL_TRAVELS_DATA.map((t, idx) => (
                  <option key={idx} value={idx}>
                    {t.destName} — Base R$ {t.basePrice.toLocaleString('pt-BR')} (+{t.happinessBonus} Felicidade)
                  </option>
                ))}
              </select>
            </div>

            {/* Cabin Class */}
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-bold text-[#141E18]">Classe do Voo:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { triggerClick(); setIsExecFlight(false); }}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                    !isExecFlight ? 'bg-[#0284c7] text-white border-[#0284c7]' : 'bg-[#fbf9f3] text-[#566359] border-[#ece9df]'
                  }`}
                >
                  <span className="font-bold text-xs block">💺 Econômica</span>
                  <span className="text-[10px] block opacity-80">Preço Padrão</span>
                </button>
                <button
                  type="button"
                  onClick={() => { triggerClick(); setIsExecFlight(true); }}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                    isExecFlight ? 'bg-[#0284c7] text-white border-[#0284c7]' : 'bg-[#fbf9f3] text-[#566359] border-[#ece9df]'
                  }`}
                >
                  <span className="font-bold text-xs block">🥂 Executiva VIP</span>
                  <span className="text-[10px] block opacity-80">+80% valor (+15 Felicidade)</span>
                </button>
              </div>
            </div>

            {/* Companion Mode */}
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-bold text-[#141E18]">Acompanhante:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { mode: 'alone', label: '👤 Sozinho(a)', mult: '1x custo' },
                  { mode: 'pay_all', label: '👫 Pagar Tudo', mult: '2x custo' },
                  { mode: 'split', label: '🤝 Rachar 50%', mult: '1.5x custo' }
                ].map((item) => (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => { triggerClick(); setCompanionMode(item.mode as any); }}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                      companionMode === item.mode ? 'bg-[#006437] text-white border-[#006437]' : 'bg-[#fbf9f3] text-[#566359] border-[#ece9df]'
                    }`}
                  >
                    <span className="font-bold text-[11px] block">{item.label}</span>
                    <span className="text-[9px] block opacity-80">{item.mult}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Preview */}
            {(() => {
              const selected = INTERNATIONAL_TRAVELS_DATA[travelDestIndex] || INTERNATIONAL_TRAVELS_DATA[0];
              let cost = selected.basePrice;
              if (isExecFlight) cost = Math.round(cost * 1.8);
              if (companionMode === 'pay_all') cost = Math.round(cost * 2);
              if (companionMode === 'split') cost = Math.round(cost * 1.5);

              return (
                <div className="p-3 bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#0369a1] font-bold block">Investimento da Viagem:</span>
                    <span className="text-base font-black text-[#0284c7]">R$ {cost.toLocaleString('pt-BR')}</span>
                  </div>
                  <button
                    onClick={() => {
                      triggerClick();
                      const res = onTravelCustom({
                        destName: selected.destName,
                        basePrice: selected.basePrice,
                        happinessBonus: selected.happinessBonus,
                        isExec: isExecFlight,
                        companionMode
                      });
                      showMsg(res);
                      if (res.success) setActiveModal(null);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-heading font-black text-xs cursor-pointer shadow-md transition"
                  >
                    Comprar & Embarcar →
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* --- MODAL FERTILIDADE & ADOÇÃO --- */}
      {activeModal === 'fertility' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-[#ece9df] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#f0eee8] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍼</span>
                <div>
                  <h3 className="font-heading font-black text-sm text-[#141E18]">Fertilidade & Planejamento Familiar</h3>
                  <p className="text-[10px] text-[#566359]">Adoção legal, reprodução assistida & procedimentos</p>
                </div>
              </div>
              <button onClick={() => { triggerClick(); setActiveModal(null); }} className="w-7 h-7 rounded-full bg-[#f0eee8] text-[#141E18] font-bold text-xs flex items-center justify-center">✕</button>
            </div>

            {/* Fertility Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs font-heading font-bold">
              {[
                { id: 'adocao', label: '👶 Adoção Legal' },
                { id: 'fiv', label: '🧪 FIV / Inseminação' },
                { id: 'vasectomia', label: '✂️ Vasectomia' },
                { id: 'outros', label: '🧬 Doação & Útero' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { triggerClick(); setFertilityTab(tab.id as any); }}
                  className={`py-1.5 px-3 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                    fertilityTab === tab.id ? 'bg-[#0d9488] text-white' : 'bg-[#fbf9f3] text-[#566359] border border-[#ece9df]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Adoção */}
            {fertilityTab === 'adocao' && (
              <div className="space-y-3">
                <div className="p-3 bg-[#f0fdfa] border border-[#99f6e4] rounded-2xl text-[11px] text-[#0f766e] leading-snug">
                  Processo oficial perante a Vara da Infância e Juventude. O filho(a) adotado fará parte integral da sua árvore genealógica!
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-heading font-bold text-[#141E18]">Perfil Etário Desejado:</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Bebê (0–2a)', 'Criança (3–8a)', 'Adolescente (9–17a)'].map((range) => (
                      <button
                        key={range}
                        onClick={() => { triggerClick(); setAdoptionAge(range); }}
                        className={`p-2 rounded-xl border text-center transition cursor-pointer text-xs font-bold ${
                          adoptionAge === range ? 'bg-[#0d9488] text-white border-[#0d9488]' : 'bg-[#fbf9f3] text-[#566359] border-[#ece9df]'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-heading font-bold text-[#141E18]">Modalidade do Processo:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { triggerClick(); setAdoptionIsFast(false); }}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        !adoptionIsFast ? 'bg-[#e6f5ed] border-[#006437] text-[#006437]' : 'bg-white border-[#ece9df] text-[#566359]'
                      }`}
                    >
                      <span className="font-bold text-xs block">🏛️ Fila Regular CNA</span>
                      <span className="text-[10px] block opacity-80">100% Gratuito</span>
                    </button>
                    <button
                      onClick={() => { triggerClick(); setAdoptionIsFast(true); }}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        adoptionIsFast ? 'bg-[#f0fdfa] border-[#0d9488] text-[#0d9488]' : 'bg-white border-[#ece9df] text-[#566359]'
                      }`}
                    >
                      <span className="font-bold text-xs block">⚡ Processo Prioritário</span>
                      <span className="text-[10px] block opacity-80">R$ 12.000 (Advocacia)</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    triggerClick();
                    const res = onFertilityAction('adocao', adoptionAge, adoptionIsFast);
                    showMsg(res);
                    if (res.success) setActiveModal(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white font-heading font-black text-xs cursor-pointer shadow-md transition"
                >
                  Finalizar Adoção Legal →
                </button>
              </div>
            )}

            {/* Tab: FIV */}
            {fertilityTab === 'fiv' && (
              <div className="p-3 bg-[#fbf9f3] border border-[#ece9df] rounded-2xl space-y-2.5">
                <h5 className="font-heading font-bold text-xs text-[#141E18]">Fertilização In Vitro (FIV)</h5>
                <p className="text-[11px] text-[#566359]">
                  Tratamento reprodutivo completo em clínica de ponta, com punção folicular e transferência embrionária.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#0d9488]">Custo: R$ 18.000</span>
                  <button
                    onClick={() => {
                      triggerClick();
                      const res = onFertilityAction('inseminacao');
                      showMsg(res);
                      if (res.success) setActiveModal(null);
                    }}
                    className="py-1.5 px-3 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white font-heading font-bold text-xs cursor-pointer shadow-xs"
                  >
                    Iniciar Tratamento FIV
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Vasectomia */}
            {fertilityTab === 'vasectomia' && (
              <div className="p-3 bg-[#fbf9f3] border border-[#ece9df] rounded-2xl space-y-2.5">
                <h5 className="font-heading font-bold text-xs text-[#141E18]">Vasectomia / Laqueadura Tubária</h5>
                <p className="text-[11px] text-[#566359]">
                  Cirurgia ambulatorial definitiva de esterilização voluntária. Evita gestações indesejadas permanentemente.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#0d9488]">Custo: R$ 1.500</span>
                  <button
                    onClick={() => {
                      triggerClick();
                      const res = onFertilityAction('vasectomia');
                      showMsg(res);
                      if (res.success) setActiveModal(null);
                    }}
                    className="py-1.5 px-3 rounded-xl bg-[#006437] hover:bg-[#07532f] text-white font-heading font-bold text-xs cursor-pointer shadow-xs"
                  >
                    Realizar Procedimento
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Outros (Doação e Cessão) */}
            {fertilityTab === 'outros' && (
              <div className="space-y-2">
                <div className="p-3 bg-[#fbf9f3] border border-[#ece9df] rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <h5 className="font-heading font-bold text-[#141E18]">🧬 Doação Voluntária de Gametas</h5>
                    <p className="text-[10px] text-[#566359]">Contribua com o banco reprodutivo e receba compensação</p>
                    <span className="text-xs font-black text-[#15803d]">+R$ 800 de remuneração</span>
                  </div>
                  <button
                    onClick={() => {
                      triggerClick();
                      const res = onFertilityAction('doar_semen');
                      showMsg(res);
                    }}
                    className="py-1.5 px-3 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-heading font-bold text-xs cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    Doar
                  </button>
                </div>

                <div className="p-3 bg-[#fbf9f3] border border-[#ece9df] rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <h5 className="font-heading font-bold text-[#141E18]">🤰 Cessão Temporária de Útero</h5>
                    <p className="text-[10px] text-[#566359]">Barriga solidária assistida conforme resolução do CFM</p>
                    <span className="text-xs font-black text-[#0d9488]">Custo: R$ 25.000</span>
                  </div>
                  <button
                    onClick={() => {
                      triggerClick();
                      const res = onFertilityAction('barriga_aluguel');
                      showMsg(res);
                      if (res.success) setActiveModal(null);
                    }}
                    className="py-1.5 px-3 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white font-heading font-bold text-xs cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    Contratar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL FAMA & HOLOFOTES --- */}
      {activeModal === 'fame' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-[#ece9df] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#f0eee8] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <div>
                  <h3 className="font-heading font-black text-sm text-[#141E18]">Fama & Holofotes</h3>
                  <p className="text-[10px] text-[#566359]">Reality shows, podcasts virais e passarelas de moda</p>
                </div>
              </div>
              <button onClick={() => { triggerClick(); setActiveModal(null); }} className="w-7 h-7 rounded-full bg-[#f0eee8] text-[#141E18] font-bold text-xs flex items-center justify-center">✕</button>
            </div>

            <div className="p-3 bg-[#fefce8] border border-[#fef08a] rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-[#854d0e] block font-bold">Seguidores Atuais:</span>
                <span className="font-heading font-extrabold text-[#a16207]">
                  {influencer.followers.toLocaleString('pt-BR')} seguidores
                </span>
              </div>
              <span className="text-xs font-bold bg-[#fef08a] text-[#854d0e] px-2 py-0.5 rounded-full">
                Nível de Fama: {influencer.fameLevel || 10}
              </span>
            </div>

            <div className="space-y-2.5">
              {/* 1. Reality Show */}
              <div className="p-3 bg-[#fbf9f3] border border-[#ece9df] rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div>
                  <h5 className="font-heading font-bold text-[#141E18] flex items-center gap-1.5">
                    👁️ Inscrição em Reality Show (BBB / A Fazenda)
                  </h5>
                  <p className="text-[10px] text-[#566359]">Concorra a uma vaga. Se aprovado: +85.000 seguidores e R$ 15.000!</p>
                </div>
                <button
                  onClick={() => {
                    triggerClick();
                    const res = onFameAction('reality');
                    showMsg(res);
                  }}
                  className="py-1.5 px-3 rounded-xl bg-[#ca8a04] hover:bg-[#a16207] text-white font-heading font-bold text-xs cursor-pointer shadow-xs whitespace-nowrap"
                >
                  Candidatar-se
                </button>
              </div>

              {/* 2. Podcast */}
              <div className="p-3 bg-[#fbf9f3] border border-[#ece9df] rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div>
                  <h5 className="font-heading font-bold text-[#141E18] flex items-center gap-1.5">
                    🎙️ Entrevista em Podcast Viral
                  </h5>
                  <p className="text-[10px] text-[#566359]">Gere cortes no TikTok e Reels (+4.000 seguidores)</p>
                </div>
                <button
                  onClick={() => {
                    triggerClick();
                    const res = onFameAction('podcast');
                    showMsg(res);
                  }}
                  className="py-1.5 px-3 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-heading font-bold text-xs cursor-pointer shadow-xs whitespace-nowrap"
                >
                  Gravar Episódio
                </button>
              </div>

              {/* 3. Passarela */}
              <div className="p-3 bg-[#fbf9f3] border border-[#ece9df] rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div>
                  <h5 className="font-heading font-bold text-[#141E18] flex items-center gap-1.5">
                    👠 Desfile SPFW na Passarela
                  </h5>
                  <p className="text-[10px] text-[#566359]">Cachê de modelo profissional de R$ 2.500 e +2.500 seguidores</p>
                </div>
                <button
                  onClick={() => {
                    triggerClick();
                    const res = onFameAction('passarela');
                    showMsg(res);
                  }}
                  className="py-1.5 px-3 rounded-xl bg-[#db2777] hover:bg-[#be185d] text-white font-heading font-bold text-xs cursor-pointer shadow-xs whitespace-nowrap"
                >
                  Desfilar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL CRIME & MALANDRAGEM --- */}
      {activeModal === 'crime' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-[#ece9df] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#f0eee8] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎲</span>
                <div>
                  <h3 className="font-heading font-black text-sm text-[#141E18]">Crime & Malandragem</h3>
                  <p className="text-[10px] text-[#566359]">Ações de alto risco com penalidades penais severas</p>
                </div>
              </div>
              <button onClick={() => { triggerClick(); setActiveModal(null); }} className="w-7 h-7 rounded-full bg-[#f0eee8] text-[#141E18] font-bold text-xs flex items-center justify-center">✕</button>
            </div>

            <div className="p-3 bg-[#fff0f0] border border-[#fca5a5] rounded-2xl text-[11px] text-[#b91c1c] leading-tight flex items-start gap-2">
              <span className="text-base flex-shrink-0">⚠️</span>
              <div>
                <p className="font-bold">Aviso de Risco Real:</p>
                <p>Falhas criminosas reduzem drasticamente seu Serasa Score, causam sequelas de saúde e prisões!</p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { type: 'pendura', name: 'Dar a Pendura no Restaurante', reward: 250, risk: 'Baixo (75% sucesso)' },
                { type: 'furto_celular', name: 'Furto de Celular no Carnaval', reward: 1200, risk: 'Médio (65% sucesso)' },
                { type: 'bilhete', name: 'Golpe do Bilhete Premiado', reward: 3500, risk: 'Moderado (45% sucesso)' },
                { type: 'racha', name: 'Racha Noturno Clandestino', reward: 2500, risk: 'Requer Carro/Moto (50% sucesso)' },
                { type: 'phishing', name: 'Golpe de Phishing Bancário', reward: 6000, risk: 'Requer Intelecto 35+ (55% sucesso)' },
                { type: 'contrabando', name: 'Contrabando da Fronteira', reward: 8500, risk: 'Alto Risco (45% sucesso)' },
                { type: 'roubo_carga', name: 'Roubo de Carga em Rodovia', reward: 28000, risk: 'Perigo Armado (35% sucesso)' },
                { type: 'lavagem', name: 'Lavagem em Empresa Fantasma', reward: 45000, risk: 'Requer R$ 5.000 (40% sucesso)' },
                { type: 'assalto_banco', name: 'Assalto a Banco com Maçarico', reward: 120000, risk: 'Risco Extremo (25% sucesso)' }
              ].map((c) => (
                <div key={c.type} className="p-2.5 bg-[#fbf9f3] border border-[#ece9df] rounded-2xl flex items-center justify-between gap-2 text-xs">
                  <div>
                    <h5 className="font-heading font-bold text-[#141E18]">{c.name}</h5>
                    <span className="text-[10px] text-[#566359] block">{c.risk}</span>
                    <span className="text-xs font-black text-[#15803d]">Recompensa: R$ {c.reward.toLocaleString('pt-BR')}</span>
                  </div>
                  <button
                    onClick={() => {
                      triggerClick();
                      const res = onCrimeAction(c.type as any);
                      showMsg(res);
                    }}
                    className="py-1.5 px-3 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading font-bold text-xs cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    Executar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL RESCISÃO TRABALHISTA --- */}
      {activeModal === 'resignation' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-[#ece9df] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#f0eee8] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📜</span>
                <div>
                  <h3 className="font-heading font-black text-sm text-[#141E18]">Rescisão Trabalhista (CLT)</h3>
                  <p className="text-[10px] text-[#566359]">Cálculo rescisório oficial, multa FGTS e seguro-desemprego</p>
                </div>
              </div>
              <button onClick={() => { triggerClick(); setActiveModal(null); }} className="w-7 h-7 rounded-full bg-[#f0eee8] text-[#141E18] font-bold text-xs flex items-center justify-center">✕</button>
            </div>

            {career.type === 'desempregado' ? (
              <div className="p-4 bg-[#fbf9f3] border border-[#ece9df] rounded-2xl text-center space-y-2">
                <span className="text-3xl block">📋</span>
                <h4 className="font-heading font-black text-xs text-[#141E18]">Você não possui emprego formal ativo</h4>
                <p className="text-[11px] text-[#566359]">
                  Atualmente você está desempregado(a). Para usufruir de direitos rescisórios como aviso prévio e FGTS, conquiste uma vaga CLT na aba Carreira!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Career Info */}
                <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#166534] font-bold">Cargo Atual:</span>
                    <span className="font-heading font-extrabold text-[#141E18]">{career.title}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#566359]">
                    <span>Empresa / Órgão:</span>
                    <span className="font-bold text-[#141E18]">{career.companyOrOrg}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#566359]">
                    <span>Salário Registrado:</span>
                    <span className="font-bold text-[#006437]">R$ {career.salaryMonthly.toLocaleString('pt-BR')} / mês</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#566359]">
                    <span>Saldo Acumulado FGTS:</span>
                    <span className="font-bold text-[#0284c7]">R$ {career.fgtsAccumulated.toLocaleString('pt-BR')}</span>
                  </div>
                </div>

                {/* Option 1: Pedir Demissão */}
                <div className="p-3 bg-[#fbf9f3] border border-[#ece9df] rounded-2xl space-y-2">
                  <h4 className="font-heading font-bold text-xs text-[#141E18]">1. Pedido de Demissão Voluntária</h4>
                  <p className="text-[11px] text-[#566359] leading-tight">
                    Você se desliga por decisão própria. Abre mão da multa de 40% do FGTS e do seguro-desemprego.
                  </p>
                  <button
                    onClick={() => {
                      triggerClick();
                      const res = onResignOrLayoff('pedir_demissao');
                      showMsg(res);
                      if (res.success) setActiveModal(null);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#fff0f0] border border-[#fca5a5] text-[#b91c1c] font-heading font-bold text-xs cursor-pointer shadow-xs transition"
                  >
                    Pedir Demissão Voluntária
                  </button>
                </div>

                {/* Option 2: Demissão sem Justa Causa */}
                {(() => {
                  const fgtsFine = Math.round(career.fgtsAccumulated * 0.40);
                  const noticePay = career.salaryMonthly;
                  const seguroDesemprego = Math.round(career.salaryMonthly * 2.5);
                  const totalSeverance = career.fgtsAccumulated + fgtsFine + noticePay + seguroDesemprego;

                  return (
                    <div className="p-3 bg-[#fffbeb] border border-[#fde68a] rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-heading font-bold text-xs text-[#92400e]">2. Demissão Sem Justa Causa (Acerto CLT)</h4>
                        <span className="text-[10px] font-bold text-[#92400e] bg-[#fef3c7] px-2 py-0.5 rounded-full">Direitos Completos</span>
                      </div>
                      <div className="text-[10px] text-[#78350f] space-y-0.5">
                        <p>• Multa de 40% FGTS: +R$ {fgtsFine.toLocaleString('pt-BR')}</p>
                        <p>• Aviso Prévio Indenizado: +R$ {noticePay.toLocaleString('pt-BR')}</p>
                        <p>• Seguro-Desemprego Estimado: +R$ {seguroDesemprego.toLocaleString('pt-BR')}</p>
                        <p>• Saque do Saldo FGTS: +R$ {career.fgtsAccumulated.toLocaleString('pt-BR')}</p>
                        <p className="font-black text-xs text-[#006437] pt-1 border-t border-[#fde68a]">
                          Total do Acerto a Receber: R$ {totalSeverance.toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          triggerClick();
                          const res = onResignOrLayoff('demissao_sem_justa_causa');
                          showMsg(res);
                          if (res.success) setActiveModal(null);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#006437] hover:bg-[#07532f] text-white font-heading font-black text-xs cursor-pointer shadow-md transition"
                      >
                        Executar Demissão Sem Justa Causa (+ Acerto)
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL REDES SOCIAIS --- */}
      {activeModal === 'social' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-[#ece9df] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#f0eee8] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📸</span>
                <div>
                  <h3 className="font-heading font-black text-sm text-[#141E18]">Redes Sociais & Influenciador</h3>
                  <p className="text-[10px] text-[#566359]">{influencer.followers.toLocaleString('pt-BR')} seguidores no perfil</p>
                </div>
              </div>
              <button onClick={() => { triggerClick(); setActiveModal(null); }} className="w-7 h-7 rounded-full bg-[#f0eee8] text-[#141E18] font-bold text-xs flex items-center justify-center">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { type: 'photo', name: '📸 Postar Foto Feed', desc: 'Engajamento leve' },
                { type: 'reel', name: '🎬 Gravar Reels / TikTok', desc: 'Alcance viral' },
                { type: 'publi', name: '💰 Fazer Publi Patrocinada', desc: 'Monetização de marca' },
                { type: 'live', name: '🔴 Abrir Live Transmissão', desc: 'Conectar com a base' },
                { type: 'comments', name: '💬 Responder Comentários', desc: 'Fidelidade de público' },
                { type: 'polemica', name: '🔥 Polêmica / Treta Viral', desc: 'Risco e engajamento' }
              ].map((p) => (
                <button
                  key={p.type}
                  onClick={() => {
                    triggerClick();
                    const res = onSocialPost(p.type as any);
                    showMsg(res);
                  }}
                  className="p-3 rounded-2xl bg-[#fbf9f3] hover:bg-[#edf5fd] border border-[#ece9df] hover:border-[#0284c7] text-left transition cursor-pointer"
                >
                  <span className="font-heading font-bold text-xs text-[#141E18] block">{p.name}</span>
                  <span className="text-[10px] text-[#566359] block mt-0.5">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL TESTAMENTO & HERANÇA --- */}
      {activeModal === 'will' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-[#ece9df] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#f0eee8] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏳</span>
                <div>
                  <h3 className="font-heading font-black text-sm text-[#141E18]">Testamento & Linha do Tempo</h3>
                  <p className="text-[10px] text-[#566359]">Destino dos bens após a vida e ampulhetas do tempo</p>
                </div>
              </div>
              <button onClick={() => { triggerClick(); setActiveModal(null); }} className="w-7 h-7 rounded-full bg-[#f0eee8] text-[#141E18] font-bold text-xs flex items-center justify-center">✕</button>
            </div>

            {/* Testamento Beneficiary */}
            <div className="p-3 bg-[#fbf9f3] border border-[#ece9df] rounded-2xl space-y-2">
              <h4 className="font-heading font-bold text-xs text-[#141E18]">Beneficiário do Testamento:</h4>
              <p className="text-[10px] text-[#566359]">Escolha quem herdará seu patrimônio acumulado:</p>
              <div className="grid grid-cols-2 gap-1.5">
                {(['Filhos', 'Cônjuge', 'Pais', 'Caridade'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      triggerClick();
                      setSelectedWillBeneficiary(b);
                      onUpdateWill(b);
                      showMsg({ success: true, message: `Testamento lavrado em cartório favorecendo: ${b}!` });
                    }}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer text-xs font-bold ${
                      (will?.beneficiary || selectedWillBeneficiary) === b
                        ? 'bg-[#006437] text-white border-[#006437]'
                        : 'bg-white text-[#566359] border-[#ece9df] hover:border-[#006437]'
                    }`}
                  >
                    {b === 'Filhos' ? '👶 Filhos' : b === 'Cônjuge' ? '💍 Cônjuge' : b === 'Pais' ? '👴 Pais' : '🎗️ Caridade'}
                  </button>
                ))}
              </div>
            </div>

            {/* Rewind Time */}
            <div className="p-3 bg-[#fffbeb] border border-[#fde68a] rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-xs text-[#92400e]">Ampulheta do Tempo</h4>
                <span className="text-[10px] font-bold text-[#b45309] bg-[#fef3c7] px-2 py-0.5 rounded-full">
                  {gameState?.timeRewindsLeft ?? 3} restantes
                </span>
              </div>
              <p className="text-[10px] text-[#78350f]">
                Rebobine o tempo para alterar escolhas cruciais do seu personagem:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    triggerClick();
                    const res = onRewindTime(1);
                    showMsg(res);
                  }}
                  className="py-2 px-3 rounded-xl bg-white hover:bg-[#fff8db] border border-[#fcd34d] text-[#b45309] font-heading font-bold text-xs cursor-pointer shadow-xs"
                >
                  Voltar 1 Ano
                </button>
                <button
                  onClick={() => {
                    triggerClick();
                    const res = onRewindTime(5);
                    showMsg(res);
                  }}
                  className="py-2 px-3 rounded-xl bg-white hover:bg-[#fff8db] border border-[#fcd34d] text-[#b45309] font-heading font-bold text-xs cursor-pointer shadow-xs"
                >
                  Voltar 5 Anos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL AGENDA SEMANAL RECORRENTE --- */}
      {activeModal === 'weekly_schedule' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left font-sans">
          <div className="bg-[#fffdf7] rounded-3xl max-w-lg w-full p-5 shadow-2xl border-2 border-amber-400 space-y-4 max-h-[90vh] overflow-y-auto relative">
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shrink-0 border border-amber-300">
                  📅
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-slate-900">
                    Agenda Semanal Recorrente
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Compromissos agendados repetem automaticamente a cada período
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { triggerClick(); setActiveModal(null); }}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 font-bold text-xs flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-700 bg-amber-50 p-3 rounded-2xl border border-amber-200 font-medium leading-relaxed">
              💡 <strong>Como funciona:</strong> Ao ativar uma atividade e escolher o dia e turno, ela será executada automaticamente cada vez que você avançar o tempo (Mês, Semestre ou Ano), atualizando seus atributos e gerando relatórios de conclusão.
            </p>

            <div className="space-y-3">
              {scheduleItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    item.enabled ? 'bg-amber-50/60 border-amber-400 shadow-sm' : 'bg-white border-slate-200 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-2xl shrink-0">{item.icon}</span>
                      <div className="min-w-0">
                        <h4 className="font-black text-xs text-slate-900 truncate">{item.name}</h4>
                        <p className="text-[11px] text-amber-800 font-bold mt-0.5">{item.effectsDescription}</p>
                      </div>
                    </div>
                    {/* TOGGLE SWITCH */}
                    <button
                      type="button"
                      onClick={() => {
                        triggerClick();
                        const updated = scheduleItems.map((s, i) => i === idx ? { ...s, enabled: !s.enabled } : s);
                        setScheduleItems(updated);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        item.enabled
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {item.enabled ? '✓ Agendado' : '+ Agendar'}
                    </button>
                  </div>

                  {item.enabled && (
                    <div className="mt-3 pt-3 border-t border-amber-200/80 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider block mb-1">
                          Dia da Semana:
                        </label>
                        <select
                          value={item.dayOfWeek}
                          onChange={(e) => {
                            triggerClick();
                            const updated = scheduleItems.map((s, i) => i === idx ? { ...s, dayOfWeek: e.target.value as any } : s);
                            setScheduleItems(updated);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-amber-300 font-bold text-xs text-slate-800 focus:ring-2 focus:ring-amber-500"
                        >
                          {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider block mb-1">
                          Turno do Dia:
                        </label>
                        <select
                          value={item.shift}
                          onChange={(e) => {
                            triggerClick();
                            const updated = scheduleItems.map((s, i) => i === idx ? { ...s, shift: e.target.value as any } : s);
                            setScheduleItems(updated);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-amber-300 font-bold text-xs text-slate-800 focus:ring-2 focus:ring-amber-500"
                        >
                          {['Manhã', 'Tarde', 'Noite'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => { triggerClick(); setActiveModal(null); }}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerClick();
                  if (onUpdateWeeklySchedule) {
                    onUpdateWeeklySchedule(scheduleItems);
                  }
                  playSuccessSound();
                  confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
                  showMsg({ success: true, message: '📅 Agenda Semanal salva com sucesso!' });
                  setActiveModal(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black shadow-md hover:from-amber-600 hover:to-orange-600 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Salvar Agenda Semanal</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-200 fill-current" />
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState && (
        <SmartphoneModal
          isOpen={isPhoneModalOpen}
          onClose={() => setIsPhoneModalOpen(false)}
          gameState={gameState}
          currentNews={currentNews || gameState.currentNews}
          onReactToNews={onReactToNews}
          onCelebrate={onCelebrate || (() => {})}
          onSocialPost={onSocialPost}
          onApplyDilemmaConsequence={onApplyDilemmaConsequence}
        />
      )}
    </div>
  );
};
