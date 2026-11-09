import { HomeItem, HomeRenovation } from '../types/game';

export const AVAILABLE_HOME_ITEMS: HomeItem[] = [
  { id: 'tv_55_4k', name: 'Smart TV 55" 4K QLED', category: 'eletro', icon: '📺', price: 2800, happinessBonus: 8 },
  { id: 'geladeira_inox', name: 'Geladeira Inox Frost Free 450L', category: 'eletro', icon: '🧊', price: 3400, happinessBonus: 10 },
  { id: 'ps5_console', name: 'Videogame PlayStation 5', category: 'lazer', icon: '🎮', price: 3950, happinessBonus: 15 },
  { id: 'sofa_retratil', name: 'Sofá Retrátil e Reclinável 3 Lugares', category: 'movel', icon: '🛋️', price: 2200, happinessBonus: 7 },
  { id: 'ar_inverter', name: 'Ar Condicionado Inverter 12.000 BTUs', category: 'eletro', icon: '❄️', price: 2100, happinessBonus: 12 },
  { id: 'robo_aspirador', name: 'Robô Aspirador Inteligente', category: 'eletro', icon: '🤖', price: 1200, happinessBonus: 6 },
  { id: 'cama_king', name: 'Cama Box King Size com Pillow Top', category: 'movel', icon: '🛏️', price: 3100, happinessBonus: 12 },
  { id: 'mesa_jantar', name: 'Mesa de Jantar 6 Lugares em Madeira', category: 'movel', icon: '🪑', price: 1800, happinessBonus: 6 },
  { id: 'airfryer_digital', name: 'Fritadeira Air Fryer Digital 5L', category: 'eletro', icon: '🍟', price: 420, happinessBonus: 5 }
];

export const AVAILABLE_RENOVATIONS: HomeRenovation[] = [
  { id: 'pintura_nova', name: 'Pintura Interna e Externa com Suvinil', icon: '🎨', price: 1800, happinessBonus: 8 },
  { id: 'varanda_gourmet', name: 'Construir Varanda Gourmet com Churrasqueira', icon: '🥩', price: 8500, happinessBonus: 22 },
  { id: 'suite_master', name: 'Acrescentar Suíte Master com Banheira', icon: '🛁', price: 14000, happinessBonus: 28 },
  { id: 'piscina_aquecida', name: 'Instalar Piscina de Fibra Aquecida', icon: '🏊', price: 22000, happinessBonus: 35 },
  { id: 'painel_solar', name: 'Instalar Painel de Energia Solar', icon: '☀️', price: 12000, happinessBonus: 15 }
];

export interface VehicleCustomization {
  id: string;
  name: string;
  icon: string;
  price: number;
  happinessBonus: number;
}

export const VEHICLE_CUSTOMIZATIONS: VehicleCustomization[] = [
  { id: 'lavagem_detalhada', name: 'Lavar no Lava-Rápido de Sábado', icon: '🧽', price: 60, happinessBonus: 5 },
  { id: 'revisao_mecanica', name: 'Revisão Mecânica Preventiva (Óleo e Freios)', icon: '🔧', price: 450, happinessBonus: 8 },
  { id: 'insulfilm_g20', name: 'Aplicar Insulfilm G20 Antifurto', icon: '🕶️', price: 280, happinessBonus: 6 },
  { id: 'som_potente', name: 'Instalar Kit de Som com Subwoofer', icon: '🔊', price: 1200, happinessBonus: 14 },
  { id: 'rodas_liga', name: 'Jogo de Rodas de Liga Leve 17"', icon: '🛞', price: 2800, happinessBonus: 18 }
];
