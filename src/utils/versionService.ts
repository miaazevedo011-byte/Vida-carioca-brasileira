export interface VersionFeature {
  id: string;
  icon: string;
  title: string;
  tag: string;
  description: string;
  bulletColor: string;
  washiTapeColor: string;
}

export interface VersionInfo {
  version: string;
  app: string;
  releaseDate: string;
  title: string;
  features: string[];
  timestamp: number;
}

export const CURRENT_CLIENT_VERSION = '2.4.9'; // Versão instalada pré-atualização
export const VERSION_STORAGE_KEY = 'vida_real_client_version';
export const PENDING_WHATS_NEW_KEY = 'vida_real_show_whats_new_after_reload';
export const DISMISSED_VERSION_KEY = 'vida_real_dismissed_version_notice';

export const VERSION_FEATURES_DETAIL: VersionFeature[] = [
  {
    id: 'receitas_ia',
    icon: '🍳',
    title: 'Novo Caderno de Receitas com IA',
    tag: 'Chef Inteligente 🤖',
    description: 'Sugestões culinárias afetivas e brasileiras geradas por IA, com cálculo de ingredientes, custo estimado, tempo de preparo e bônus de energia e bem-estar para o seu personagem.',
    bulletColor: '#ff9f1c',
    washiTapeColor: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    id: 'lista_compras',
    icon: '🛒',
    title: 'Envio Automático para a Lista de Compras',
    tag: 'Integração 1-Clique 📝',
    description: 'Adicione automaticamente todos os ingredientes de qualquer receita diretamente à sua Lista de Compras no celular, com controle de itens marcados e estimativa de gastos de supermercado.',
    bulletColor: '#087F48',
    washiTapeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    id: 'post_it',
    icon: '📌',
    title: 'Post-it de Anotações com Autosave',
    tag: 'Salva em Tempo Real 💾',
    description: 'Bloquinhos autoadesivos virtuais coloridos espalhados pelo seu diário para registrar metas, lembretes e planos diários com persistência contínua e salvamento automático sem perder nada.',
    bulletColor: '#0B66C3',
    washiTapeColor: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  {
    id: 'washi_tape',
    icon: '🎨',
    title: 'Adesivos Washi Tape & Papelaria',
    tag: 'Bullet Journal Craft ✂️',
    description: 'Cole fitas washi tape decorativas artesanais, fitas listradas, carimbos postais e marcadores temáticos com estética clássica de scrapbook para deixar cada página com o seu estilo.',
    bulletColor: '#e11d48',
    washiTapeColor: 'bg-rose-100 text-rose-800 border-rose-300'
  },
  {
    id: 'tempo_clima',
    icon: '☀️🌧️',
    title: 'Alteração do Tempo & Clima',
    tag: 'Atmosfera Viva 🌦️',
    description: 'Alterne dinamicamente o ritmo e o clima: dias ensolarados tropicais, chuva aconchegante, garoa ou tardes amenas de outono que influenciam na rotina e nas escolhas do seu diário.',
    bulletColor: '#d97706',
    washiTapeColor: 'bg-yellow-100 text-yellow-900 border-yellow-300'
  },
  {
    id: 'porquinho',
    icon: '🐷',
    title: 'Dicas do Porquinho (Educação Financeira)',
    tag: 'Sabedoria Financeira 🪙',
    description: 'O simpático cofrinho porquinho agora traz conselhos inteligentes de economia, alertas de preços no mercado, planejamento de caixinha e dicas práticas para multiplicar seu patrimônio.',
    bulletColor: '#ec4899',
    washiTapeColor: 'bg-pink-100 text-pink-800 border-pink-300'
  }
];

export const getStoredVersion = (): string => {
  if (typeof window === 'undefined') return CURRENT_CLIENT_VERSION;
  try {
    return localStorage.getItem(VERSION_STORAGE_KEY) || CURRENT_CLIENT_VERSION;
  } catch (e) {
    return CURRENT_CLIENT_VERSION;
  }
};

export const setStoredVersion = (version: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(VERSION_STORAGE_KEY, version);
  } catch (e) {}
};

export const hasPendingWhatsNew = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(PENDING_WHATS_NEW_KEY) === 'true';
  } catch (e) {
    return false;
  }
};

export const clearPendingWhatsNew = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(PENDING_WHATS_NEW_KEY);
  } catch (e) {}
};

export const triggerUpdateAndForcedReload = (targetVersion: string = '2.5.0') => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(VERSION_STORAGE_KEY, targetVersion);
    localStorage.setItem(PENDING_WHATS_NEW_KEY, 'true');
    localStorage.removeItem(DISMISSED_VERSION_KEY);
  } catch (e) {}
  
  // Forçar recarregamento imediato conforme especificação
  window.location.reload();
};

export const fetchServerVersion = async (): Promise<VersionInfo | null> => {
  try {
    const res = await fetch(`/api/version?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data as VersionInfo;
  } catch (e) {
    console.warn('Erro ao checar versão em /api/version', e);
    return null;
  }
};
