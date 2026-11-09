export interface CropType {
  id: string;
  name: string;
  icon: string;
  costToPlantBasePerHa: number; // Custo base de sementes e preparo por ha
  baseYieldSacasPerHa: number; // Média de sacas por hectare
  marketPriceBase: number; // Preço base da saca em R$
  description: string;
  unitLabel: string; // 'sacas' | 'arrobas' | 'toneladas'
}

export interface MachineryItem {
  id: string;
  name: string;
  icon: string;
  price: number;
  maintenanceAnnual: number;
  yieldBonusPercent: number;
  description: string;
}

export interface LivestockOption {
  id: string;
  name: string;
  icon: string;
  headsCount: number; // Quantidade de cabeças de gado
  buyCost: number;
  yearlyRevenue: number;
  type: 'corte' | 'leiteiro' | 'bezerros';
  breed: string;
  description: string;
}

export interface MidCropDilemma {
  id: string;
  title: string;
  description: string;
  threat: string;
  investCostPerHa: number;
  yieldLossIfSkipPercent: number; // % de perda se economizar e não tratar
}

// 6 TIPOS DE CULTURAS RURAIS DIFERENTES
export const CROP_TYPES: CropType[] = [
  {
    id: 'soja',
    name: 'Soja Transgênica',
    icon: '🌱',
    costToPlantBasePerHa: 2400,
    baseYieldSacasPerHa: 62,
    marketPriceBase: 138,
    unitLabel: 'sacas',
    description: 'Maior commodity do agronegócio nacional, líder em exportações com liquidez global imediata.'
  },
  {
    id: 'milho',
    name: 'Milho Safrinha',
    icon: '🌽',
    costToPlantBasePerHa: 1750,
    baseYieldSacasPerHa: 95,
    marketPriceBase: 78,
    unitLabel: 'sacas',
    description: 'Rotação vital para alimentação do gado e indústria de etanol verde de milho.'
  },
  {
    id: 'cafe',
    name: 'Café Arábica Especial',
    icon: '☕',
    costToPlantBasePerHa: 4800,
    baseYieldSacasPerHa: 36,
    marketPriceBase: 960,
    unitLabel: 'sacas',
    description: 'Grãos nobres cultivados em altitude no Cerrado e Sul de Minas com alta cotação em dólar.'
  },
  {
    id: 'algodao',
    name: 'Algodão Pluma',
    icon: '☁️',
    costToPlantBasePerHa: 4100,
    baseYieldSacasPerHa: 70,
    marketPriceBase: 380,
    unitLabel: 'arrobas',
    description: 'Fibra de alto valor agregado demandada pelas maiores tecelagens do mundo.'
  },
  {
    id: 'cana',
    name: 'Cana-de-Açúcar',
    icon: '🎋',
    costToPlantBasePerHa: 3500,
    baseYieldSacasPerHa: 85,
    marketPriceBase: 125,
    unitLabel: 'toneladas',
    description: 'Contratos garantidos com usinas de açúcar e bioenergia renovável.'
  },
  {
    id: 'cacau',
    name: 'Cacau Cabruca Fino',
    icon: '🍫',
    costToPlantBasePerHa: 3200,
    baseYieldSacasPerHa: 42,
    marketPriceBase: 510,
    unitLabel: 'sacas',
    description: 'Cacau de alta pureza sob sombra da Mata Atlântica baiana, favorito dos chocolates finos europeus.'
  }
];

// DILEMAS DE MEIO DE SAFRA ("No meio da safra a lavoura pergunta: aplicar e gastar, ou economizar e torcer?")
export const MID_CROP_DILEMMAS: MidCropDilemma[] = [
  {
    id: 'praga_lagarta',
    title: 'Ataque de Lagarta Falsa-Medideira & Percevejo',
    description: 'O agrônomo detectou focos ativos nas folhas centrais. A lavoura está em pleno enchimento de grãos.',
    threat: 'Se não aplicar defensivo específico imediatamente, as lagartas perfurarão as vagens, derrubando a colheita em até 35%.',
    investCostPerHa: 280,
    yieldLossIfSkipPercent: 35
  },
  {
    id: 'ferrugem_asiatica',
    title: 'Alerta Vermelho: Ferrugem Asiática nos Talhões',
    description: 'Uma semana inteira de chuvas contínuas e calor acelerou o avanço de fungos nos tecidos foliares.',
    threat: 'Fungicida de choque multissítio precisa ser pulverizado para conter a desfolha precoce. Sem aplicação, a quebra é estimada em 40%.',
    investCostPerHa: 350,
    yieldLossIfSkipPercent: 40
  },
  {
    id: 'estiagem_severa',
    title: 'Estiagem e Veranico de 22 Dias',
    description: 'O solo secou na fase mais crítica da safra. Os pivôs de irrigação e fertirrigação foliar demandam diesel e adubação líquida de emergência.',
    threat: 'Gastar com bombas e bioestimulantes salva as plantas do abortamento floral. Economizar e esperar chuva é uma aposta arriscada de 50% de quebra.',
    investCostPerHa: 420,
    yieldLossIfSkipPercent: 45
  },
  {
    id: 'cigarrinha_milho',
    title: 'Surto de Cigarrinha e Enfezamento',
    description: 'Insetos vetores invadiram a lavoura vizinha e já estão atacando os brotos mais novos.',
    threat: 'Aplicação aérea via drone com inseticidas biológicos e químicos protege o rendimento da espiga.',
    investCostPerHa: 260,
    yieldLossIfSkipPercent: 30
  }
];

export const MACHINERY_CATALOG: MachineryItem[] = [
  { id: 'trator_john', name: 'Trator John Deere 180cv', icon: '🚜', price: 85000, maintenanceAnnual: 4000, yieldBonusPercent: 20, description: 'Acelera o plantio e preparo de solo, aumentando a produtividade por hectare.' },
  { id: 'colheitadeira_master', name: 'Colheitadeira Automática com GPS & Sensor', icon: '🌾', price: 210000, maintenanceAnnual: 9000, yieldBonusPercent: 35, description: 'Reduz o desperdício para perto de zero e colhe com máxima eficiência.' },
  { id: 'silo_armazenagem', name: 'Silo Secador de Grãos Cooperativa', icon: '🏢', price: 65000, maintenanceAnnual: 2500, yieldBonusPercent: 15, description: 'Permite reter a safra para vender no pico de alta das cotações.' }
];

export const LIVESTOCK_OPTIONS: LivestockOption[] = [
  { id: 'nelore_corte', name: 'Lote de 50 Bois Nelore de Corte', icon: '🐂', headsCount: 50, buyCost: 75000, yearlyRevenue: 32000, type: 'corte', breed: 'Nelore PO', description: 'Gado rústico, de alta carcaça e adaptado ao clima tropical brasileiro.' },
  { id: 'angus_confinado', name: 'Plantel de 40 Novilhos Red Angus', icon: '🥩', headsCount: 40, buyCost: 88000, yearlyRevenue: 41000, type: 'corte', breed: 'Red Angus', description: 'Carne premium com alto marmoreio para boutiques de carne e churrascarias gourmet.' },
  { id: 'gado_leiteiro', name: 'Rebanho de 30 Vacas Girolando', icon: '🐄', headsCount: 30, buyCost: 52000, yearlyRevenue: 24000, type: 'leiteiro', breed: 'Girolando 5/8', description: 'Produção diária de leite de excelente padrão para laticínios cooperados.' },
  { id: 'bezerros_desmama', name: 'Lote de 60 Bezerros Desmamados', icon: '🐑', headsCount: 60, buyCost: 42000, yearlyRevenue: 19000, type: 'bezerros', breed: 'Cruzamento Industrial', description: 'Bezerros de baixo custo para recria em pasto adubado.' }
];

export const INVESTMENT_LEVELS = {
  economico: { label: 'Básico / Econômico', costPerHa: 1400, yieldMultiplier: 0.85, desc: 'Sementes convencionais e defensivos básicos' },
  padrao: { label: 'Médio / Tecnologia Equilibrada', costPerHa: 2800, yieldMultiplier: 1.05, desc: 'Adubação de precisão, sementes certificadas e controle integrado' },
  completo: { label: 'Alta Tecnologia / Máximo Rendimento', costPerHa: 4800, yieldMultiplier: 1.35, desc: 'Agricultura 4.0, biológicos de ponta, drones e fertirrigação' },
};
