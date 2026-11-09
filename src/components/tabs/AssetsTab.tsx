import React, { useState, useMemo } from 'react';
import { Housing, Vehicle, Pet, Relationship, Achievement, Stats, LogEntry, Character, Finances, CompanyState } from '../../types/game';
import { AVAILABLE_HOME_ITEMS, AVAILABLE_RENOVATIONS, VEHICLE_CUSTOMIZATIONS } from '../../data/home_items';
import { NEIGHBORHOOD_CONFLICTS, NeighborhoodConflict, ConflictOption } from '../../data/neighborhood_conflicts';
import { Home, Car, Heart, Award, Sparkles, Plus, CheckCircle2, Wrench, Tv, Utensils, PartyPopper, Palette, Volume2, ShieldAlert, Users, MessageSquare, TrendingUp, DollarSign, Building2, Wallet, RotateCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound, playSuccessSound } from '../../utils/audio';
import { VehicleVisualPreview } from '../VehicleVisualPreview';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface AssetsTabProps {
  housing: Housing;
  vehicle?: Vehicle;
  pet?: Pet;
  relationship: Relationship;
  achievements: Achievement[];
  stats: Stats;
  resolvedConflicts?: string[];
  logs?: LogEntry[];
  character?: Character;
  finances?: Finances;
  company?: CompanyState;
  onBuyVehicle: (veh: Vehicle) => void;
  onChangeHousing: (hou: Housing) => void;
  onBuyHomeItem: (item: typeof AVAILABLE_HOME_ITEMS[0]) => { success: boolean; message: string };
  onPerformRenovation: (renov: typeof AVAILABLE_RENOVATIONS[0]) => { success: boolean; message: string };
  onDoHomeAction: (actionType: 'arrumar_quarto' | 'almoco_familia' | 'festa_casa' | 'maratona_serie' | 'cozinhar_gourmet' | 'jardinagem' | 'jogar_videogame' | 'treino_casa' | 'ler_livro' | 'reparo_diy' | string) => { success: boolean; message: string };
  onMaintainVehicle: (action: typeof VEHICLE_CUSTOMIZATIONS[0]) => { success: boolean; message: string };
  onDatePartner: () => { success: boolean; message: string };
  onMarryPartner: () => { success: boolean; message: string };
  onResolveConflict: (conflict: NeighborhoodConflict, option: ConflictOption) => { success: boolean; message: string };
}

const AVAILABLE_HOUSES: Housing[] = [
  { id: 'pais', name: 'Casa dos Pais (Família)', type: 'pais', monthlyCost: 150, propertyValue: 0, icon: '🏡' },
  { id: 'republica', name: 'Quarto Compartilhado em República', type: 'aluguel', monthlyCost: 380, propertyValue: 0, icon: '🛏️' },
  { id: 'kitnet', name: 'Kitnet Compacta no Centro', type: 'aluguel', monthlyCost: 850, propertyValue: 0, icon: '🏙️' },
  { id: 'studio', name: 'Studio Moderno com Varanda', type: 'aluguel', monthlyCost: 1250, propertyValue: 0, icon: '🏬' },
  { id: 'ape_alugado', name: 'Apartamento 2 Quartos Alugado', type: 'aluguel', monthlyCost: 1600, propertyValue: 0, icon: '🏢' },
  { id: 'loft_alugado', name: 'Loft Duplex na Zona Sul', type: 'aluguel', monthlyCost: 2800, propertyValue: 0, icon: '🌃' },
  { id: 'casa_alugada', name: 'Casa Familiar 3 Quartos Alugada', type: 'aluguel', monthlyCost: 3200, propertyValue: 0, icon: '🏡' },
  { id: 'cobertura_alugada', name: 'Cobertura Alugada com Vista Panorâmica', type: 'aluguel', monthlyCost: 7500, propertyValue: 0, icon: '💎' },
  { id: 'ape_studio_proprio', name: 'Apê Studio Quitado', type: 'proprio', monthlyCost: 300, propertyValue: 180000, icon: '🔑' },
  { id: 'ape_proprio', name: 'Apê Próprio 2 Quartos', type: 'proprio', monthlyCost: 450, propertyValue: 280000, icon: '✨' },
  { id: 'casa_bairro', name: 'Casa de Bairro com Quintal', type: 'proprio', monthlyCost: 200, propertyValue: 420000, icon: '🏡' },
  { id: 'ape_club', name: 'Apê 3 Suítes em Condomínio Club', type: 'proprio', monthlyCost: 950, propertyValue: 680000, icon: '🏊' },
  { id: 'casa_condominio', name: 'Sobrado em Condomínio Fechado', type: 'proprio', monthlyCost: 850, propertyValue: 850000, icon: '🏰' },
  { id: 'cobertura_triplex', name: 'Cobertura Triplex com Jacuzzi', type: 'proprio', monthlyCost: 1800, propertyValue: 1800000, icon: '💎' },
  { id: 'mansao_piscina', name: 'Mansão Térrea com Piscina Aquecida', type: 'proprio', monthlyCost: 2500, propertyValue: 3500000, icon: '🏰✨' }
];

interface ShowroomVehicle {
  id: string;
  name: string;
  category: 'suvs' | 'populares' | 'motos' | 'esportivos' | 'leilao';
  tag: string;
  price: number;
  maintenanceYearly: number;
  conforto: number;
  statusSocial: number;
  consumo: string;
  custosAnuais: string;
  icon: string;
  image: string;
  placa: string;
}

const SHOWROOM_VEHICLES: ShowroomVehicle[] = [
  // SUVs & Crossovers
  {
    id: 'byd_song',
    name: 'BYD Song Plus Híbrido 2025',
    category: 'suvs',
    tag: 'Híbrido 2025 • 0km',
    price: 229000,
    maintenanceYearly: 4200,
    conforto: 95,
    statusSocial: 82,
    consumo: '14.2 km/l elétr.',
    custosAnuais: '~R$ 7.900/ano',
    icon: '🚙',
    image: '',
    placa: 'BYD-2025'
  },
  {
    id: 'jeep_compass',
    name: 'Jeep Compass Longitude 1.3T',
    category: 'suvs',
    tag: 'Semi-Novo 2024',
    price: 165000,
    maintenanceYearly: 3800,
    conforto: 88,
    statusSocial: 75,
    consumo: '10.5 km/l flex',
    custosAnuais: '~R$ 6.200/ano',
    icon: '🚙',
    image: '',
    placa: 'JCP-9942'
  },
  {
    id: 'corolla_cross',
    name: 'Toyota Corolla Cross Hybrid',
    category: 'suvs',
    tag: 'Novo 0km',
    price: 198000,
    maintenanceYearly: 3200,
    conforto: 92,
    statusSocial: 78,
    consumo: '17.8 km/l flex',
    custosAnuais: '~R$ 6.800/ano',
    icon: '🚙',
    image: '',
    placa: 'TCC-8819'
  },

  // Populares & Clássicos (Fusca, Siena, HB20, Gol)
  {
    id: 'vw_fusca',
    name: 'VW Fusca 1300 Clássico',
    category: 'populares',
    tag: 'Relíquia Colecionador',
    price: 26000,
    maintenanceYearly: 900,
    conforto: 55,
    statusSocial: 65,
    consumo: '10.2 km/l gasolina',
    custosAnuais: '~R$ 1.200/ano',
    icon: '🚗',
    image: '',
    placa: 'FUS-1974'
  },
  {
    id: 'fiat_siena',
    name: 'Fiat Siena 1.4 Fire Sedan',
    category: 'populares',
    tag: 'Sedan Espaçoso & Econômico',
    price: 36000,
    maintenanceYearly: 1400,
    conforto: 72,
    statusSocial: 45,
    consumo: '12.8 km/l flex',
    custosAnuais: '~R$ 2.100/ano',
    icon: '🚗',
    image: '',
    placa: 'SIE-2015'
  },
  {
    id: 'hb20_comfort',
    name: 'Hyundai HB20 1.0 Turbo TGDI',
    category: 'populares',
    tag: 'Econômico 2023',
    price: 72000,
    maintenanceYearly: 1800,
    conforto: 75,
    statusSocial: 55,
    consumo: '14.1 km/l gasolina',
    custosAnuais: '~R$ 3.100/ano',
    icon: '🚗',
    image: '',
    placa: 'HB2-2023'
  },
  {
    id: 'gol_quadrado',
    name: 'VW Gol 1.0 Flex G6',
    category: 'populares',
    tag: 'Econômico • Usado',
    price: 32000,
    maintenanceYearly: 1200,
    conforto: 60,
    statusSocial: 30,
    consumo: '13.5 km/l gasolina',
    custosAnuais: '~R$ 1.800/ano',
    icon: '🚗',
    image: '',
    placa: 'GOL-1020'
  },

  // Motos & Scooters (Suzuki, Lambreta, Biz, Yamaha)
  {
    id: 'suzuki_gsx',
    name: 'Suzuki GSX-S 750cc',
    category: 'motos',
    tag: 'Superbike Japonesa',
    price: 52000,
    maintenanceYearly: 1900,
    conforto: 68,
    statusSocial: 82,
    consumo: '19.2 km/l podium',
    custosAnuais: '~R$ 2.900/ano',
    icon: '🏍️',
    image: '',
    placa: 'SUZ-7500'
  },
  {
    id: 'lambreta_classica',
    name: 'Lambreta / Vespa 150 Vintage',
    category: 'motos',
    tag: 'Estilo Retrô Urbano',
    price: 18500,
    maintenanceYearly: 600,
    conforto: 65,
    statusSocial: 64,
    consumo: '35.0 km/l gasolina',
    custosAnuais: '~R$ 800/ano',
    icon: '🛵',
    image: '',
    placa: 'LAM-1968'
  },
  {
    id: 'honda_biz',
    name: 'Honda Biz 125 ES',
    category: 'motos',
    tag: 'Econômica Urban',
    price: 14500,
    maintenanceYearly: 450,
    conforto: 50,
    statusSocial: 25,
    consumo: '42.0 km/l',
    custosAnuais: '~R$ 600/ano',
    icon: '🛵',
    image: '',
    placa: 'BIZ-1250'
  },
  {
    id: 'yamaha_mt07',
    name: 'Yamaha MT-07 ABS',
    category: 'motos',
    tag: 'Esportiva Naked',
    price: 46900,
    maintenanceYearly: 1600,
    conforto: 70,
    statusSocial: 68,
    consumo: '21.5 km/l',
    custosAnuais: '~R$ 2.400/ano',
    icon: '🏍️',
    image: '',
    placa: 'MTO-0707'
  },

  // Esportivos de Luxo
  {
    id: 'mustang_gt',
    name: 'Ford Mustang GT 5.0 V8',
    category: 'esportivos',
    tag: 'Esportivo V8 488cv',
    price: 540000,
    maintenanceYearly: 14000,
    conforto: 90,
    statusSocial: 98,
    consumo: '6.8 km/l V8',
    custosAnuais: '~R$ 22.000/ano',
    icon: '🏎️',
    image: '',
    placa: 'V88-5000'
  },

  // Leilão / Oportunidades
  {
    id: 'civic_leilao',
    name: 'Honda Civic LXR (Leilão SP)',
    category: 'leilao',
    tag: 'Recuperado Leilão',
    price: 45000,
    maintenanceYearly: 2800,
    conforto: 80,
    statusSocial: 65,
    consumo: '11.8 km/l',
    custosAnuais: '~R$ 2.100/ano',
    icon: '🔨',
    image: '',
    placa: 'LEI-2026'
  }
];

export const AssetsTab: React.FC<AssetsTabProps> = ({
  housing,
  vehicle,
  pet,
  relationship,
  achievements,
  stats,
  resolvedConflicts = [],
  logs = [],
  character,
  finances,
  company,
  onBuyVehicle,
  onChangeHousing,
  onBuyHomeItem,
  onPerformRenovation,
  onDoHomeAction,
  onMaintainVehicle,
  onResolveConflict
}) => {
  const [activeSection, setActiveSection] = useState<'chart' | 'housing' | 'vehicle'>('chart');
  const [homeSubSection, setHomeSubSection] = useState<'acoes' | 'eletro' | 'reformas' | 'conflitos'>('acoes');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [selectedConflictModal, setSelectedConflictModal] = useState<NeighborhoodConflict | null>(null);

  // ESTADOS DA CONCESSIONÁRIA & OFICINA DE CUSTOMIZAÇÃO
  const [vehCategory, setVehCategory] = useState<'populares' | 'suvs' | 'motos' | 'esportivos' | 'leilao'>('suvs');
  const [selectedShowroomVehId, setSelectedShowroomVehId] = useState<string>('byd_song');
  const [selectedColor, setSelectedColor] = useState<string>('#0077b6');
  const [selectedRoda, setSelectedRoda] = useState<'aro20' | 'original'>('aro20');
  const [accJBL, setAccJBL] = useState<boolean>(true);
  const [accInsulfilm, setAccInsulfilm] = useState<boolean>(true);
  const [accIsofix, setAccIsofix] = useState<boolean>(false);
  const [accBlindagem, setAccBlindagem] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'financiamento' | 'troca'>('pix');

  const selectedShowroomVeh = SHOWROOM_VEHICLES.find((v) => v.id === selectedShowroomVehId) || SHOWROOM_VEHICLES[0];

  // Cálculo Dinâmico do Total do Pedido
  const customPartsCost =
    (selectedRoda === 'aro20' ? 4500 : 0) +
    (accJBL ? 2400 : 0) +
    (accInsulfilm ? 800 : 0) +
    (accIsofix ? 1200 : 0) +
    (accBlindagem ? 48000 : 0);

  const basePrice = selectedShowroomVeh.price;
  const totalPrice = basePrice + customPartsCost;

  const pixPrice = Math.round(totalPrice * 0.95);
  const tradeInAbatement = vehicle?.value || 0;
  const tradeInRemaining = Math.max(0, totalPrice - tradeInAbatement);

  const currentAge = character?.age ?? 0;
  const currentYear = character?.year ?? 2026;
  const startYear = currentYear - currentAge;

  const cashBalance = stats.grana + (finances?.cdiBalance || 0);
  const propertyVal = housing.propertyValue || 0;
  const vehicleVal = vehicle?.value || 0;
  const companyVal = company?.valuation || 0;
  const currentNetWorth = cashBalance + propertyVal + vehicleVal + companyVal;

  const chartData = useMemo(() => {
    const yearsMap = new Map<number, { year: number; age: number; netWorth?: number }>();
    yearsMap.set(startYear, { year: startYear, age: 0, netWorth: 0 });

    if (logs && logs.length > 0) {
      logs.forEach((log) => {
        if (!yearsMap.has(log.year)) {
          yearsMap.set(log.year, { year: log.year, age: log.age });
        }
        if (log.statDeltas?.netWorth !== undefined) {
          const entry = yearsMap.get(log.year)!;
          entry.netWorth = log.statDeltas.netWorth;
        } else if (log.description && log.description.includes('Patrimônio Líquido: R$')) {
          const match = log.description.match(/Patrimônio Líquido: R\$\s*([\d\.\,]+)/);
          if (match && match[1]) {
            const parsed = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
            if (!isNaN(parsed)) {
              const entry = yearsMap.get(log.year)!;
              entry.netWorth = parsed;
            }
          }
        }
      });
    }

    yearsMap.set(currentYear, { year: currentYear, age: currentAge, netWorth: currentNetWorth });
    const sortedYears = Array.from(yearsMap.values()).sort((a, b) => a.year - b.year);

    let lastKnownNetWorth = 0;
    return sortedYears.map((item, index) => {
      let val = item.netWorth;
      if (val === undefined) {
        if (index === sortedYears.length - 1) {
          val = currentNetWorth;
        } else {
          const progress = index / Math.max(1, sortedYears.length - 1);
          val = Math.round(lastKnownNetWorth + (currentNetWorth - lastKnownNetWorth) * progress);
        }
      }
      lastKnownNetWorth = val;

      const isCurrent = item.year === currentYear;
      const cashComp = isCurrent ? cashBalance : Math.round(val * 0.4);
      const assetComp = isCurrent ? (propertyVal + vehicleVal + companyVal) : Math.round(val * 0.6);

      return {
        year: item.year,
        age: item.age,
        label: `${item.age}a (${item.year})`,
        netWorth: Math.max(0, val),
        cash: Math.max(0, cashComp),
        assets: Math.max(0, assetComp)
      };
    });
  }, [logs, currentYear, currentAge, currentNetWorth, startYear, cashBalance, propertyVal, vehicleVal, companyVal]);

  const formatYAxis = (val: number) => {
    if (val >= 1_000_000) return `R$ ${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `R$ ${(val / 1_000).toFixed(0)}k`;
    return `R$ ${val}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#141E18] text-white p-3 rounded-2xl shadow-2xl text-xs space-y-1.5 border border-[#2a382e] animate-fade-in text-left">
          <div className="flex items-center justify-between gap-4 border-b border-[#2a382e] pb-1.5">
            <span className="font-heading font-black text-[#75E2A7] text-sm">{data.label}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">Idade: {data.age} anos</span>
          </div>
          <div className="space-y-1 pt-0.5">
            <div className="flex items-center justify-between gap-3 text-white font-bold">
              <span>Patrimônio Líquido:</span>
              <span className="text-[#087F48] font-black text-sm">R$ {Number(data.netWorth).toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-gray-300 text-[11px]">
              <span>💵 Saldo / Caixinha:</span>
              <span>R$ {Number(data.cash).toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-gray-300 text-[11px]">
              <span>🏢 Imóvel & Bens:</span>
              <span>R$ {Number(data.assets).toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const showMsg = (res: { success: boolean; message: string }) => {
    setStatusNotice(res.message);
    if (res.success) {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    }
    setTimeout(() => setStatusNotice(null), 4000);
  };

  const handleBuyItemClick = (item: typeof AVAILABLE_HOME_ITEMS[0]) => {
    const res = onBuyHomeItem(item);
    showMsg(res);
  };

  const handleRenovationClick = (renov: typeof AVAILABLE_RENOVATIONS[0]) => {
    const res = onPerformRenovation(renov);
    showMsg(res);
  };

  const handleHomeAction = (actionType: string) => {
    const res = onDoHomeAction(actionType);
    showMsg(res);
  };

  const handleMaintainVehicleClick = (action: typeof VEHICLE_CUSTOMIZATIONS[0]) => {
    const res = onMaintainVehicle(action);
    showMsg(res);
  };

  const handleConflictOptionClick = (conflict: NeighborhoodConflict, option: ConflictOption) => {
    const res = onResolveConflict(conflict, option);
    showMsg(res);
    setSelectedConflictModal(null);
  };

  const handleExecuteDealershipPurchase = () => {
    playClickSound();
    let finalPayAmount = totalPrice;
    if (paymentMethod === 'pix') {
      finalPayAmount = pixPrice;
    } else if (paymentMethod === 'troca') {
      finalPayAmount = tradeInRemaining;
    }

    if (stats.grana < finalPayAmount) {
      setStatusNotice(`Saldo bancário insuficiente para fechar a compra! Faltam R$ ${(finalPayAmount - stats.grana).toLocaleString('pt-BR')}.`);
      return;
    }

    const boughtVeh: Vehicle = {
      id: selectedShowroomVeh.id,
      name: selectedShowroomVeh.name,
      icon: selectedShowroomVeh.icon,
      yearlyMaintenance: selectedShowroomVeh.maintenanceYearly,
      value: selectedShowroomVeh.price
    };

    onBuyVehicle(boughtVeh);
    playSuccessSound();
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    setStatusNotice(`Parabéns! ${selectedShowroomVeh.name} foi levado para a sua garagem! 🔑🏎️`);
    setTimeout(() => setStatusNotice(null), 5000);
  };

  const handleTestDrive = () => {
    playClickSound();
    if (stats.grana < 50) {
      setStatusNotice('Saldo insuficiente para o combustível do test-drive (R$ 50).');
      return;
    }
    setStatusNotice(`Test-Drive acelerando ${selectedShowroomVeh.name} no bairro! Ronco do motor sensacional (+10 Felicidade) 🚗💨`);
    setTimeout(() => setStatusNotice(null), 4000);
  };

  return (
    <div className="space-y-4 animate-fade-in pb-8 font-sans text-slate-900">
      {/* Top Main Section Switcher em Pílulas Táteis */}
      <div className="p-1 bg-[#fffdf7] rounded-2xl border border-slate-200 flex items-center justify-between gap-1 shadow-[0_2px_0_#d8bd92]">
        <button
          onClick={() => { playClickSound(); setActiveSection('chart'); }}
          className={`flex-1 py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSection === 'chart'
              ? 'bg-[#0CA768] text-white shadow-[0_3px_0_#076940]'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Evolução Patrimonial</span>
        </button>

        <button
          onClick={() => { playClickSound(); setActiveSection('housing'); }}
          className={`flex-1 py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSection === 'housing'
              ? 'bg-[#0CA768] text-white shadow-[0_3px_0_#076940]'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Moradia & Lar</span>
        </button>

        <button
          onClick={() => { playClickSound(); setActiveSection('vehicle'); }}
          className={`flex-1 py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSection === 'vehicle'
              ? 'bg-[#0CA768] text-white shadow-[0_3px_0_#076940]'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Veículo & Garagem</span>
        </button>
      </div>

      {statusNotice && (
        <div className="p-3 bg-[#fff3d6] border-2 border-[#ff9f1c] text-slate-900 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm animate-fade-in">
          <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* SECTION 0: GRÁFICO DE EVOLUÇÃO PATRIMONIAL */}
      {activeSection === 'chart' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-[#fffdf7] rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-black text-base text-slate-900">
                    Evolução do Patrimônio Líquido
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Gráfico de crescimento acumulado ao longo dos anos registrados
                </p>
              </div>

              <div className="bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-right shadow-[0_2px_0_#d8bd92]">
                <span className="text-[10px] font-extrabold uppercase text-slate-600 block">
                  Patrimônio Líquido Atual
                </span>
                <span className="font-black text-lg text-emerald-600">
                  R$ {currentNetWorth.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-600 font-bold block uppercase">💵 Saldo & Caixinha</span>
                <span className="font-black text-xs sm:text-sm text-slate-900">
                  R$ {cashBalance.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-600 font-bold block uppercase">🏠 Imóvel Próprio</span>
                <span className="font-black text-xs sm:text-sm text-slate-900">
                  R$ {propertyVal.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-600 font-bold block uppercase">🚗 Garagem/Veículo</span>
                <span className="font-black text-xs sm:text-sm text-slate-900">
                  R$ {vehicleVal.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-600 font-bold block uppercase">🏢 Empresa</span>
                <span className="font-black text-xs sm:text-sm text-slate-900">
                  R$ {companyVal.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

            {/* Recharts Container */}
            <div className="pt-2">
              <div className="h-64 sm:h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff9f1c" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#ff9f1c" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8d5b7" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: '#6b4d30' }}
                      stroke="#d8bd92"
                    />
                    <YAxis
                      tickFormatter={formatYAxis}
                      tick={{ fontSize: 11, fill: '#6b4d30' }}
                      stroke="#d8bd92"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="netWorth"
                      stroke="#ff9f1c"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#netWorthGrad)"
                      name="Patrimônio Líquido"
                      dot={{ r: 4, fill: '#ff9f1c', strokeWidth: 2, stroke: '#ffffff' }}
                      activeDot={{ r: 7, fill: '#ff9f1c', strokeWidth: 2, stroke: '#ffffff' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: MORADIA & LAR */}
      {activeSection === 'housing' && (
        <div className="space-y-4">
          <div className="bg-[#fffdf7] rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
            {/* Current Housing Banner */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-slate-100 rounded-xl border border-slate-200">
                  {housing.icon}
                </span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {housing.type === 'pais' ? 'FAMÍLIA' : housing.type === 'aluguel' ? 'ALUGADO' : 'PRÓPRIO'}
                  </span>
                  <h3 className="font-black text-base text-slate-900 mt-0.5">{housing.name}</h3>
                  <p className="text-xs text-slate-600">
                    Despesa mensal: <strong>R$ {housing.monthlyCost}/mês</strong>
                  </p>
                </div>
              </div>

              {housing.propertyValue > 0 && (
                <div className="text-right">
                  <span className="text-[10px] text-slate-600 block font-bold">Valor de Mercado</span>
                  <span className="font-black text-sm text-emerald-600">
                    R$ {housing.propertyValue.toLocaleString('pt-BR')}
                  </span>
                </div>
              )}
            </div>

            {/* Sub-menu de Interação com a Casa */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-3 overflow-x-auto no-scrollbar border border-slate-200">
              <button
                onClick={() => setHomeSubSection('acoes')}
                className={`flex-1 py-1.5 px-2 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  homeSubSection === 'acoes' ? 'bg-[#0CA768] text-white shadow-[0_2px_0_#cc6e00]' : 'text-slate-600'
                }`}
              >
                🏠 Vida na Casa
              </button>
              <button
                onClick={() => setHomeSubSection('eletro')}
                className={`flex-1 py-1.5 px-2 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  homeSubSection === 'eletro' ? 'bg-[#0CA768] text-white shadow-[0_2px_0_#cc6e00]' : 'text-slate-600'
                }`}
              >
                📺 Eletro & Móveis
              </button>
              <button
                onClick={() => setHomeSubSection('reformas')}
                className={`flex-1 py-1.5 px-2 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  homeSubSection === 'reformas' ? 'bg-[#0CA768] text-white shadow-[0_2px_0_#cc6e00]' : 'text-slate-600'
                }`}
              >
                🔨 Reformas
              </button>
              <button
                onClick={() => setHomeSubSection('conflitos')}
                className={`flex-1 py-1.5 px-2 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  homeSubSection === 'conflitos' ? 'bg-[#0CA768] text-white shadow-[0_2px_0_#cc6e00]' : 'text-slate-600'
                }`}
              >
                🔊 Conflitos Vizinhança
              </button>
            </div>

            {/* Sub-Ação 1: Vida na Casa */}
            {homeSubSection === 'acoes' && (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[#fffdf7] border border-slate-200 shadow-[0_2px_0_#e8d5b7] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🧹</span>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">Arrumar e Limpar o Quarto</h5>
                      <p className="text-[10px] text-slate-600">Organizar roupas e guardar sapatos (+5 Energia, +5 Felicidade)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleHomeAction('arrumar_quarto')}
                    className="py-1.5 px-3 rounded-xl text-xs font-bold bg-slate-100 text-slate-900 shadow-[0_2px_0_#d8bd92] active:translate-y-0.5 cursor-pointer"
                  >
                    Arrumar (Grátis)
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[#fffdf7] border border-slate-200 shadow-[0_2px_0_#e8d5b7] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🍿</span>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">Maratona de Séries & Filmes</h5>
                      <p className="text-[10px] text-slate-600">Pipoca e relaxamento no sofá (+12 Felicidade)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleHomeAction('maratona_serie')}
                    className="py-1.5 px-3 rounded-xl text-xs font-bold bg-slate-100 text-slate-900 shadow-[0_2px_0_#d8bd92] active:translate-y-0.5 cursor-pointer"
                  >
                    Assistir (Grátis)
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[#fffdf7] border border-slate-200 shadow-[0_2px_0_#e8d5b7] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🍳</span>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">Cozinhar Jantar Gourmet</h5>
                      <p className="text-[10px] text-slate-600">Ingredientes nobres e receita especial (+18 Felicidade)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleHomeAction('cozinhar_gourmet')}
                    disabled={stats.grana < 60}
                    className="py-1.5 px-3 rounded-xl text-xs font-bold bg-[#0CA768] text-white shadow-[0_2px_0_#cc6e00] active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
                  >
                    Cozinhar (R$ 60)
                  </button>
                </div>
              </div>
            )}

            {/* Sub-Ação 2: Eletrodomésticos */}
            {homeSubSection === 'eletro' && (
              <div className="space-y-2">
                {AVAILABLE_HOME_ITEMS.map((item) => {
                  const isPurchased = housing.itemsPurchased?.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-[#fffdf7] border border-slate-200 shadow-[0_2px_0_#e8d5b7] flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <h5 className="font-bold text-xs text-slate-900">{item.name}</h5>
                          <p className="text-[10px] text-emerald-600 font-bold">
                            +{item.happinessBonus}% Felicidade • R$ {item.price.toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>

                      <button
                        disabled={isPurchased}
                        onClick={() => handleBuyItemClick(item)}
                        className="py-1.5 px-3 rounded-xl text-xs font-bold bg-[#0CA768] text-white shadow-[0_2px_0_#cc6e00] active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
                      >
                        {isPurchased ? 'Comprado ✓' : 'Comprar'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Sub-Ação 3: Reformas */}
            {homeSubSection === 'reformas' && (
              <div className="space-y-2">
                {AVAILABLE_RENOVATIONS.map((renov) => {
                  const isDone = housing.renovationsCompleted?.includes(renov.id);
                  return (
                    <div
                      key={renov.id}
                      className="p-2.5 rounded-xl bg-[#fffdf7] border border-slate-200 shadow-[0_2px_0_#e8d5b7] flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{renov.icon}</span>
                        <div>
                          <h5 className="font-bold text-xs text-slate-900">{renov.name}</h5>
                          <p className="text-[10px] text-emerald-600 font-bold">
                            +{renov.happinessBonus}% Felicidade • R$ {renov.price.toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>

                      <button
                        disabled={isDone}
                        onClick={() => handleRenovationClick(renov)}
                        className="py-1.5 px-3 rounded-xl text-xs font-bold bg-[#0CA768] text-white shadow-[0_2px_0_#cc6e00] active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
                      >
                        {isDone ? 'Concluído ✓' : 'Reformar'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Change Housing Options */}
          <div className="bg-[#fffdf7] rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-600">
              Mudar de Moradia (Aluguel / Compra Própria)
            </h4>
            <div className="space-y-2">
              {AVAILABLE_HOUSES.map((h) => {
                const isCurrent = housing.id === h.id;
                return (
                  <div
                    key={h.id}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      isCurrent ? 'bg-[#fff3d6] border-[#ff9f1c]' : 'bg-[#fffdf7] border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{h.icon}</span>
                      <div>
                        <h5 className="font-bold text-xs text-slate-900">{h.name}</h5>
                        <p className="text-[10px] text-slate-600">
                          Custo mensal: R$ {h.monthlyCost}/mês
                        </p>
                      </div>
                    </div>

                    <button
                      disabled={isCurrent}
                      onClick={() => onChangeHousing(h)}
                      className="py-1.5 px-3 rounded-xl text-xs font-bold bg-[#0CA768] text-white shadow-[0_2px_0_#cc6e00] active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
                    >
                      {isCurrent ? 'Morando Aqui' : 'Mudar-se'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: VEÍCULOS & CONCESSIONÁRIA & OFICINA DE CUSTOMIZAÇÃO */}
      {activeSection === 'vehicle' && (
        <div className="space-y-4">
          {/* PAINEL SUPERIOR CONCESSIONÁRIA & GARAGEM AUTOTROPICAL */}
          <div className="w-full bg-slate-100 rounded-3xl p-4 flex flex-col gap-4 shadow-[0_4px_0_#d8bd92] border border-slate-200">
            {/* Header Area */}
            <div className="flex flex-col items-center w-full gap-2">
              <div className="w-12 h-1.5 rounded-full bg-[#d8bd92]"></div>
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#0CA768] flex items-center justify-center text-white shadow-[0_3px_0_#076940]">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-black text-base text-slate-900 block">Concessionária & Garagem</span>
                    <span className="text-xs text-slate-600 font-medium">AutoTropical • {character?.name || 'Lucas Silva'}, {character?.age || 27}a</span>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-[#ffd166] text-slate-900 text-[10px] font-black border border-[#dca52d]">
                  SP Auto Mall 🚘
                </div>
              </div>

              {/* Balance Toy Brick Pill */}
              <div className="w-full bg-[#fffdf7] rounded-2xl p-3 flex items-center justify-between shadow-sm border border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#ffd166] flex items-center justify-center text-slate-900 shadow-[0_2px_0_#c49746]">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">Saldo em Conta</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-base text-emerald-600">
                    R$ {stats.grana.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-[10px] text-slate-600 block font-bold">À vista ou Financiamento FIPE</span>
                </div>
              </div>
            </div>

            {/* Category Chips (3D Tactile Bricks) */}
            <div className="flex gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
              <button
                onClick={() => { playClickSound(); setVehCategory('populares'); }}
                className={`shrink-0 px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  vehCategory === 'populares'
                    ? 'bg-[#0CA768] text-white shadow-[0_3px_0_#076940]'
                    : 'bg-[#fffdf7] text-slate-600 shadow-[0_2px_0_#e8d5b7]'
                }`}
              >
                <span>🚗</span> Populares
              </button>

              <button
                onClick={() => { playClickSound(); setVehCategory('suvs'); }}
                className={`shrink-0 px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  vehCategory === 'suvs'
                    ? 'bg-[#0CA768] text-white shadow-[0_3px_0_#076940]'
                    : 'bg-[#fffdf7] text-slate-600 shadow-[0_2px_0_#e8d5b7]'
                }`}
              >
                <span>🚙</span> SUVs & Família
              </button>

              <button
                onClick={() => { playClickSound(); setVehCategory('motos'); }}
                className={`shrink-0 px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  vehCategory === 'motos'
                    ? 'bg-[#0CA768] text-white shadow-[0_3px_0_#076940]'
                    : 'bg-[#fffdf7] text-slate-600 shadow-[0_2px_0_#e8d5b7]'
                }`}
              >
                <span>🏍️</span> Motos & Rolê
              </button>

              <button
                onClick={() => { playClickSound(); setVehCategory('esportivos'); }}
                className={`shrink-0 px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  vehCategory === 'esportivos'
                    ? 'bg-[#0CA768] text-white shadow-[0_3px_0_#076940]'
                    : 'bg-[#fffdf7] text-slate-600 shadow-[0_2px_0_#e8d5b7]'
                }`}
              >
                <span>🏎️</span> Esportivos
              </button>

              <button
                onClick={() => { playClickSound(); setVehCategory('leilao'); }}
                className={`shrink-0 px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  vehCategory === 'leilao'
                    ? 'bg-[#0CA768] text-white shadow-[0_3px_0_#076940]'
                    : 'bg-[#fffdf7] text-slate-600 shadow-[0_2px_0_#e8d5b7]'
                }`}
              >
                <span>🔨</span> Leilões SP
              </button>
            </div>

            {/* SELEÇÃO DO MODELO DENTRO DA CATEGORIA */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {SHOWROOM_VEHICLES.filter((v) => v.category === vehCategory).map((v) => (
                <button
                  key={v.id}
                  onClick={() => { playClickSound(); setSelectedShowroomVehId(v.id); }}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedShowroomVehId === v.id
                      ? 'bg-[#ffd166] text-slate-900 border-[#ff9f1c] shadow-[0_2px_0_#dca52d]'
                      : 'bg-[#fffdf7] text-slate-600 border-slate-200'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>

            {/* Showcase Toy Diorama Card */}
            <div className="w-full bg-[#fffdf7] rounded-2xl p-4 shadow-sm flex flex-col gap-3 border border-slate-200">
              {/* Top Vehicle Title and Badge */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-[#ffd166] text-slate-900 text-[10px] font-black border border-[#dca52d]">
                      {selectedShowroomVeh.tag}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900">{selectedShowroomVeh.name}</h2>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-emerald-600">
                    R$ {selectedShowroomVeh.price.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-[10px] text-slate-600 block font-bold">FIPE Oficial</span>
                </div>
              </div>

              {/* Toy Render Container with Mercosul Plate */}
              <div className="w-full h-48 rounded-2xl overflow-hidden relative flex items-center justify-center bg-gradient-to-b from-[#f7ebd6] to-[#edd9ba] shadow-inner border border-slate-200">
                <VehicleVisualPreview
                  vehicleId={selectedShowroomVeh.id}
                  name={selectedShowroomVeh.name}
                  category={selectedShowroomVeh.category}
                  color={selectedColor}
                  wheelType={selectedRoda}
                  hasInsulfilm={accInsulfilm}
                />
                {/* Placa Mercosul Toy Badge */}
                <div className="absolute bottom-2.5 bg-[#fffdf7] px-2.5 py-1 rounded-lg shadow-[0_2px_0_#e8d5b7] border border-slate-200 flex items-center gap-1.5 z-10">
                  <div className="w-3 h-1.5 bg-[#0077b6] rounded-xs"></div>
                  <span className="text-[10px] font-mono font-black text-slate-900 tracking-widest">{selectedShowroomVeh.placa}</span>
                  <span className="text-[10px]">🇧🇷</span>
                </div>

                {/* 360 Degree Indicator */}
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs flex items-center gap-1 shadow-xs border border-slate-200 z-10">
                  <RotateCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '8s' }} />
                  <span className="text-[10px] font-bold text-slate-900">Giro 3D</span>
                </div>
              </div>

              {/* RPG Gauges */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-slate-100 p-2.5 rounded-xl flex flex-col gap-1 border border-slate-200">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                    <span>🛋️ Conforto</span>
                    <span className="text-emerald-600 font-black">{selectedShowroomVeh.conforto}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#e2cca6] overflow-hidden shadow-inner">
                    <div className="h-full bg-[#0CA768] rounded-full" style={{ width: `${selectedShowroomVeh.conforto}%` }}></div>
                  </div>
                </div>

                <div className="bg-slate-100 p-2.5 rounded-xl flex flex-col gap-1 border border-slate-200">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                    <span>👑 Status Social</span>
                    <span className="text-[#d97706] font-black">+{selectedShowroomVeh.statusSocial} Social</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#e2cca6] overflow-hidden shadow-inner">
                    <div className="h-full bg-[#ffd166] rounded-full" style={{ width: `${selectedShowroomVeh.statusSocial}%` }}></div>
                  </div>
                </div>

                <div className="bg-slate-100 p-2.5 rounded-xl flex items-center justify-between border border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">⚡</span>
                    <div>
                      <span className="text-[10px] text-slate-600 block font-bold">Consumo Médio</span>
                      <span className="text-xs font-black text-slate-900">{selectedShowroomVeh.consumo}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-100 p-2.5 rounded-xl flex items-center justify-between border border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">📋</span>
                    <div>
                      <span className="text-[10px] text-slate-600 block font-bold">IPVA + Seguro SP</span>
                      <span className="text-xs font-black text-slate-900">{selectedShowroomVeh.custosAnuais}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Oficina de Customização & Blocos Adicionais */}
            <div className="w-full bg-[#fffdf7] rounded-2xl p-4 shadow-sm flex flex-col gap-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#ffd166] text-slate-900 flex items-center justify-center font-bold text-xs shadow-[0_2px_0_#c49746]">
                    🛠️
                  </div>
                  <h3 className="text-sm font-black text-slate-900">Oficina de Customização</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-600">Pinos & Blocos Adicionais</span>
              </div>

              {/* Studs de Cores Táteis */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-wider text-slate-600 font-black">Pintura da Lataria (Pinos Esmaltados)</label>
                <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                  {[
                    { color: '#ffffff', name: 'Branco Pérola' },
                    { color: '#0077b6', name: 'Azul Tropical' },
                    { color: '#7c8c8e', name: 'Cinza Nardo' },
                    { color: '#161d18', name: 'Preto Black Piano' },
                    { color: '#006740', name: 'Verde Amazônia' }
                  ].map((c) => (
                    <button
                      key={c.color}
                      onClick={() => setSelectedColor(c.color)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-[0_2px_0_rgba(0,0,0,0.2)] ${
                        selectedColor === c.color ? 'ring-4 ring-[#ff9f1c] scale-110' : 'opacity-80'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.name}
                    >
                      {selectedColor === c.color && (
                        <span className="text-xs text-amber-300 font-black">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rodas & Suspensão Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-wider text-slate-600 font-black">Rodas & Molas</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedRoda('aro20')}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedRoda === 'aro20'
                        ? 'bg-[#ffd166] text-slate-900 border-[#ff9f1c] shadow-[0_2px_0_#dca52d]'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Aro 20 Diamantadas</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0CA768]"></span>
                    </div>
                    <span className="text-[11px] font-black text-emerald-600">+R$ 4.500</span>
                  </button>

                  <button
                    onClick={() => setSelectedRoda('original')}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedRoda === 'original'
                        ? 'bg-[#ffd166] text-slate-900 border-[#ff9f1c] shadow-[0_2px_0_#dca52d]'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Suspensão Original</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-600">Incluso</span>
                  </button>
                </div>
              </div>

              {/* Acessórios & Benefícios Familiares */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-wider text-slate-600 font-black">Acessórios & Benefícios Familiares</label>
                <div className="flex flex-col gap-2">
                  <div
                    onClick={() => setAccJBL(!accJBL)}
                    className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between cursor-pointer shadow-[0_2px_0_#d8bd92]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🔊</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900">Multimídia JBL c/ Subwoofer</span>
                        <span className="text-[10px] text-emerald-600 font-bold">+12% Felicidade com a Patrícia</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">+R$ 2.400</span>
                      <input type="checkbox" checked={accJBL} onChange={() => {}} className="accent-[#ff9f1c] w-4 h-4" />
                    </div>
                  </div>

                  <div
                    onClick={() => setAccInsulfilm(!accInsulfilm)}
                    className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between cursor-pointer shadow-[0_2px_0_#d8bd92]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">☀️</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900">Insulfilm Térmico G20</span>
                        <span className="text-[10px] text-slate-600 font-medium">+10% Conforto no calor</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">+R$ 800</span>
                      <input type="checkbox" checked={accInsulfilm} onChange={() => {}} className="accent-[#ff9f1c] w-4 h-4" />
                    </div>
                  </div>

                  <div
                    onClick={() => setAccIsofix(!accIsofix)}
                    className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between cursor-pointer shadow-[0_2px_0_#d8bd92]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">👶</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900">2x Cadeirinhas Isofix Infantil</span>
                        <span className="text-[10px] text-slate-600 font-medium">+Filhos Protegidos nas Viagens</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">+R$ 1.200</span>
                      <input type="checkbox" checked={accIsofix} onChange={() => {}} className="accent-[#ff9f1c] w-4 h-4" />
                    </div>
                  </div>

                  <div
                    onClick={() => setAccBlindagem(!accBlindagem)}
                    className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between cursor-pointer shadow-[0_2px_0_#d8bd92]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🛡️</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900">Blindagem Nível III-A SP</span>
                        <span className="text-[10px] text-[#059669] font-bold">+100% Proteção Urbana em SP</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">+R$ 48.000</span>
                      <input type="checkbox" checked={accBlindagem} onChange={() => {}} className="accent-[#ff9f1c] w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumo Financeiro & Condições de Pagamento */}
            <div className="w-full bg-[#fffdf7] rounded-2xl p-4 shadow-sm flex flex-col gap-3 border border-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-sm font-black text-slate-900">Total do Pedido</span>
                <div className="text-right">
                  <span className="text-lg font-black text-emerald-600">
                    R$ {totalPrice.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-[10px] text-slate-600 block font-bold">
                    R$ {basePrice.toLocaleString('pt-BR')} + R$ {customPartsCost.toLocaleString('pt-BR')} em peças
                  </span>
                </div>
              </div>

              {/* Métodos de Pagamento em Cards Táteis */}
              <div className="flex flex-col gap-2">
                <label
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3 rounded-xl flex items-start justify-between cursor-pointer transition-all border ${
                    paymentMethod === 'pix'
                      ? 'bg-[#fff3d6] border-[#ff9f1c] shadow-[0_3px_0_#dca52d]'
                      : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input type="radio" name="pagamento" checked={paymentMethod === 'pix'} onChange={() => {}} className="mt-1 accent-[#ff9f1c]" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">PIX à Vista (-5% Desconto)</span>
                        <span className="px-1.5 py-0.2 rounded bg-[#0CA768] text-white text-[10px] font-black">
                          Economize R$ {Math.round(totalPrice * 0.05).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-600 block">Débito imediato do saldo bancário</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-600">R$ {pixPrice.toLocaleString('pt-BR')}</span>
                </label>

                <label
                  onClick={() => setPaymentMethod('financiamento')}
                  className={`p-3 rounded-xl flex items-start justify-between cursor-pointer transition-all border ${
                    paymentMethod === 'financiamento'
                      ? 'bg-[#fff3d6] border-[#ff9f1c] shadow-[0_3px_0_#dca52d]'
                      : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input type="radio" name="pagamento" checked={paymentMethod === 'financiamento'} onChange={() => {}} className="mt-1 accent-[#ff9f1c]" />
                    <div>
                      <span className="text-xs font-bold text-slate-900">Financiamento Santander / Caixa</span>
                      <span className="text-[11px] text-slate-600 block">Entrada R$ {Math.round(totalPrice * 0.3).toLocaleString('pt-BR')} + 36x parcelas</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-600">36x</span>
                </label>

                {vehicle && (
                  <label
                    onClick={() => setPaymentMethod('troca')}
                    className={`p-3 rounded-xl flex items-start justify-between cursor-pointer transition-all border ${
                      paymentMethod === 'troca'
                        ? 'bg-[#fff3d6] border-[#ff9f1c] shadow-[0_3px_0_#dca52d]'
                        : 'bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input type="radio" name="pagamento" checked={paymentMethod === 'troca'} onChange={() => {}} className="mt-1 accent-[#ff9f1c]" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">Entregar Carro Atual na Troca</span>
                          <span className="px-1.5 py-0.2 rounded bg-[#ffd166] text-slate-900 text-[10px] font-bold">
                            {vehicle.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-600 block">Avaliação FIPE: R$ {vehicle.value.toLocaleString('pt-BR')} de abatimento</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-600">R$ {tradeInRemaining.toLocaleString('pt-BR')} restam</span>
                  </label>
                )}
              </div>
            </div>

            {/* Botões de Ação Principal em Relevo Tátil 3D */}
            <div className="flex flex-col gap-2.5 pt-1">
              <button
                onClick={handleExecuteDealershipPurchase}
                className="w-full py-4 px-6 rounded-2xl bg-[#0CA768] text-white font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_5px_0_#cc6e00] active:translate-y-1 active:shadow-[0_1px_0_#cc6e00] transition-all cursor-pointer"
              >
                <span>Fechar Compra & Levar pra Garagem</span>
                <span className="text-lg">🔑</span>
              </button>

              <button
                onClick={handleTestDrive}
                className="w-full py-3 px-4 rounded-xl bg-[#fffdf7] text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_3px_0_#d8bd92] border border-slate-200 active:translate-y-0.5 cursor-pointer"
              >
                <span>Fazer Test-Drive no Bairro</span>
                <span className="text-slate-600 text-[10px] font-semibold">(-R$ 50 de Gasolina)</span>
              </button>
            </div>
          </div>

          {/* VEÍCULO ATUAL NA GARAGEM (CASO EXISTA) */}
          {vehicle && (
            <div className="bg-[#fffdf7] rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4 mt-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 bg-slate-100 rounded-xl border border-slate-200">{vehicle.icon}</span>
                  <div>
                    <h3 className="font-black text-base text-slate-900">Carro em Uso: {vehicle.name}</h3>
                    <p className="text-xs text-slate-600">Manutenção anual: R$ {vehicle.yearlyMaintenance}/ano</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-600 block font-bold">Valor FIPE/Mercado</span>
                  <span className="font-black text-sm text-emerald-600">R$ {vehicle.value.toLocaleString('pt-BR')}</span>
                </div>
              </div>

              {/* Visual do Veículo em Uso na Garagem */}
              <div className="w-full h-36 rounded-xl overflow-hidden bg-gradient-to-b from-[#f7ebd6] to-[#edd9ba] border border-slate-200 flex items-center justify-center relative shadow-inner">
                <VehicleVisualPreview
                  vehicleId={vehicle.id}
                  name={vehicle.name}
                  category={vehicle.id.includes('moto') || vehicle.id.includes('biz') || vehicle.id.includes('yamaha') || vehicle.id.includes('suzuki') || vehicle.id.includes('lambreta') ? 'motos' : 'populares'}
                  color="#0077b6"
                />
                <div className="absolute bottom-2 left-2 bg-[#fffdf7] px-2 py-0.5 rounded shadow-xs border border-slate-200 text-[9px] font-mono font-bold text-slate-900 flex items-center gap-1">
                  <span>GARAGEM RESIDENCIAL 🔑</span>
                </div>
              </div>

              {/* Servicos de Manutenção em Garagem */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-600 block mb-1">
                  Serviços de Manutenção & Tuning do Veículo Atual:
                </span>
                {VEHICLE_CUSTOMIZATIONS.map((c, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-2 shadow-[0_2px_0_#d8bd92]">
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">{c.name}</h5>
                      <p className="text-[10px] text-emerald-600 font-bold">+{c.happinessBonus} Felicidade • R$ {c.price}</p>
                    </div>
                    <button
                      onClick={() => handleMaintainVehicleClick(c)}
                      className="py-1.5 px-3 rounded-xl text-xs font-bold bg-[#0CA768] text-white shadow-[0_2px_0_#cc6e00] active:translate-y-0.5 cursor-pointer"
                    >
                      Fazer Serviço
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- MODAL DE RESOLUÇÃO DE CONFLITO --- */}
      {selectedConflictModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#fffdf7] rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">{selectedConflictModal.icon}</span>
                <div>
                  <h3 className="font-black text-sm text-slate-900">{selectedConflictModal.title}</h3>
                  <p className="text-[10px] text-slate-600">{selectedConflictModal.neighborName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedConflictModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center hover:bg-[#ebd9c1]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-100 p-3 rounded-xl border border-slate-200">
              {selectedConflictModal.description}
            </p>

            <span className="text-[10px] font-bold uppercase text-slate-600 block">Escolha como resolver o problema:</span>

            <div className="space-y-2">
              {selectedConflictModal.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleConflictOptionClick(selectedConflictModal, opt)}
                  className="w-full p-3 rounded-xl bg-slate-100 hover:bg-[#ebd9c1] border border-slate-200 hover:border-[#ff9f1c] text-left transition-all cursor-pointer flex items-center justify-between gap-2 group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{opt.icon}</span>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 group-hover:text-emerald-600">{opt.label}</h5>
                      <p className="text-[10px] text-slate-600">
                        {opt.cost > 0 ? `Custo: R$ ${opt.cost} • ` : 'Grátis • '}
                        {opt.socialScoreDelta >= 0 ? `+${opt.socialScoreDelta} Score Social` : `${opt.socialScoreDelta} Score Social`}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">Escolher ➔</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
