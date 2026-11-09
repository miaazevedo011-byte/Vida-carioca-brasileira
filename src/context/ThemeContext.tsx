import React, { createContext, useState, useEffect, useContext } from 'react';

export type ThemeKey = 
  | 'verde' 
  | 'preto' 
  | 'azul_escuro' 
  | 'rosa_claro' 
  | 'azul' 
  | 'amarelo' 
  | 'laranja' 
  | 'roxo' 
  | 'vinho'
  | 'esmeralda_escuro'
  | 'menta_claro'
  | 'cinza_grafite'
  | 'vermelho_escuro'
  | 'lavanda'
  | 'pessego'
  | 'areia';

export interface ThemeConfig {
  id: ThemeKey;
  label: string;
  icon: string;
  bgColor: string;
  textColor: string;
  headingColor: string;
  cardBg: string;
  cardBorder: string;
  swatch: string;
  accentColor: string;
  isDark: boolean;
  description: string;
}

export const THEMES: Record<string, ThemeConfig> = {
  verde: {
    id: 'verde',
    label: 'Verde Tropical',
    icon: '🌿',
    bgColor: '#f0fdf4',
    textColor: '#14532d',
    headingColor: '#064e3b',
    cardBg: '#ffffff',
    cardBorder: '#bbf7d0',
    swatch: '#16a34a',
    accentColor: '#087f48',
    isDark: false,
    description: 'Verde tropical relaxante'
  },
  preto: {
    id: 'preto',
    label: 'Preto Noturno',
    icon: '🌑',
    bgColor: '#121212',
    textColor: '#f1f5f9',
    headingColor: '#ffffff',
    cardBg: '#1e1e1e',
    cardBorder: '#2e2e2e',
    swatch: '#18181b',
    accentColor: '#10b981',
    isDark: true,
    description: 'Fundo preto com textos claros'
  },
  azul_escuro: {
    id: 'azul_escuro',
    label: 'Azul Escuro',
    icon: '🌌',
    bgColor: '#0a192f',
    textColor: '#e2e8f0',
    headingColor: '#ffffff',
    cardBg: '#112240',
    cardBorder: '#233554',
    swatch: '#1e3a8a',
    accentColor: '#38bdf8',
    isDark: true,
    description: 'Meia-noite com textos claros e nítidos'
  },
  rosa_claro: {
    id: 'rosa_claro',
    label: 'Rosa Claro',
    icon: '🌸',
    bgColor: '#fff1f2',
    textColor: '#881337',
    headingColor: '#4c0519',
    cardBg: '#ffffff',
    cardBorder: '#fecdd3',
    swatch: '#fb7185',
    accentColor: '#e11d48',
    isDark: false,
    description: 'Fundo rosa claro com textos escuros'
  },
  azul: {
    id: 'azul',
    label: 'Azul Céu',
    icon: '🌊',
    bgColor: '#eff6ff',
    textColor: '#1e3a8a',
    headingColor: '#0c2340',
    cardBg: '#ffffff',
    cardBorder: '#bfdbfe',
    swatch: '#2563eb',
    accentColor: '#1d4ed8',
    isDark: false,
    description: 'Oceânico suave e equilibrado'
  },
  amarelo: {
    id: 'amarelo',
    label: 'Amarelo Solar',
    icon: '☀️',
    bgColor: '#fefce8',
    textColor: '#713f12',
    headingColor: '#422006',
    cardBg: '#ffffff',
    cardBorder: '#fef08a',
    swatch: '#eab308',
    accentColor: '#ca8a04',
    isDark: false,
    description: 'Solar radiante com textos escuros'
  },
  laranja: {
    id: 'laranja',
    label: 'Laranja Quente',
    icon: '🍊',
    bgColor: '#fff7ed',
    textColor: '#7c2d12',
    headingColor: '#431407',
    cardBg: '#ffffff',
    cardBorder: '#fed7aa',
    swatch: '#ea580c',
    accentColor: '#c2410c',
    isDark: false,
    description: 'Tangerina aconchegante'
  },
  roxo: {
    id: 'roxo',
    label: 'Roxo Noturno',
    icon: '🔮',
    bgColor: '#160c28',
    textColor: '#f3e8ff',
    headingColor: '#ffffff',
    cardBg: '#23143d',
    cardBorder: '#3b2366',
    swatch: '#7e22ce',
    accentColor: '#c084fc',
    isDark: true,
    description: 'Ametista escuro com textos claros'
  },
  vinho: {
    id: 'vinho',
    label: 'Vinho Noturno',
    icon: '🍷',
    bgColor: '#260919',
    textColor: '#fce7f3',
    headingColor: '#ffffff',
    cardBg: '#3d122b',
    cardBorder: '#5c1e43',
    swatch: '#831843',
    accentColor: '#f472b6',
    isDark: true,
    description: 'Bordô escuro elegante'
  },
  esmeralda_escuro: {
    id: 'esmeralda_escuro',
    label: 'Esmeralda Escuro',
    icon: '🌲',
    bgColor: '#052317',
    textColor: '#d1fae5',
    headingColor: '#ffffff',
    cardBg: '#0b3827',
    cardBorder: '#145a40',
    swatch: '#047857',
    accentColor: '#34d399',
    isDark: true,
    description: 'Floresta noturna com textos claros'
  },
  menta_claro: {
    id: 'menta_claro',
    label: 'Menta Fresca',
    icon: '🍃',
    bgColor: '#f0fdfa',
    textColor: '#134e4a',
    headingColor: '#042f2e',
    cardBg: '#ffffff',
    cardBorder: '#99f6e4',
    swatch: '#14b8a6',
    accentColor: '#0d9488',
    isDark: false,
    description: 'Menta refrescante e suave'
  },
  cinza_grafite: {
    id: 'cinza_grafite',
    label: 'Cinza Grafite',
    icon: '⚙️',
    bgColor: '#18181b',
    textColor: '#f4f4f5',
    headingColor: '#ffffff',
    cardBg: '#27272a',
    cardBorder: '#3f3f46',
    swatch: '#52525b',
    accentColor: '#a1a1aa',
    isDark: true,
    description: 'Monocromático elegante e escuro'
  },
  vermelho_escuro: {
    id: 'vermelho_escuro',
    label: 'Vermelho Rubi',
    icon: '🩸',
    bgColor: '#2b0707',
    textColor: '#fee2e2',
    headingColor: '#ffffff',
    cardBg: '#401010',
    cardBorder: '#611a1a',
    swatch: '#b91c1c',
    accentColor: '#f87171',
    isDark: true,
    description: 'Rubi intenso com textos claros'
  },
  lavanda: {
    id: 'lavanda',
    label: 'Lavanda Suave',
    icon: '🪻',
    bgColor: '#faf5ff',
    textColor: '#581c87',
    headingColor: '#3b0764',
    cardBg: '#ffffff',
    cardBorder: '#e9d5ff',
    swatch: '#a855f7',
    accentColor: '#9333ea',
    isDark: false,
    description: 'Lavanda clara e serena'
  },
  pessego: {
    id: 'pessego',
    label: 'Pêssego Claro',
    icon: '🍑',
    bgColor: '#fffaf0',
    textColor: '#78350f',
    headingColor: '#451a03',
    cardBg: '#ffffff',
    cardBorder: '#fed7aa',
    swatch: '#f97316',
    accentColor: '#ea580c',
    isDark: false,
    description: 'Tons acolhedores com textos escuros'
  },
  areia: {
    id: 'areia',
    label: 'Areia Praiana',
    icon: '🏖️',
    bgColor: '#fbf8f1',
    textColor: '#45382b',
    headingColor: '#2b2118',
    cardBg: '#ffffff',
    cardBorder: '#e8e0d3',
    swatch: '#d4a373',
    accentColor: '#b07d00',
    isDark: false,
    description: 'Areia e praia clássica do Brasil'
  },
  // Aliases for compatibility
  vermelho: { id: 'vermelho_escuro', label: 'Vermelho Rubi', icon: '🩸', bgColor: '#2b0707', textColor: '#fee2e2', headingColor: '#ffffff', cardBg: '#401010', cardBorder: '#611a1a', swatch: '#b91c1c', accentColor: '#f87171', isDark: true, description: 'Rubi escuro' },
  green: { id: 'verde', label: 'Verde Tropical', icon: '🌿', bgColor: '#f0fdf4', textColor: '#14532d', headingColor: '#064e3b', cardBg: '#ffffff', cardBorder: '#bbf7d0', swatch: '#16a34a', accentColor: '#087f48', isDark: false, description: 'Verde tropical' },
  black: { id: 'preto', label: 'Preto Noturno', icon: '🌑', bgColor: '#121212', textColor: '#f1f5f9', headingColor: '#ffffff', cardBg: '#1e1e1e', cardBorder: '#2e2e2e', swatch: '#18181b', accentColor: '#10b981', isDark: true, description: 'Preto' },
  yellow: { id: 'amarelo', label: 'Amarelo Solar', icon: '☀️', bgColor: '#fefce8', textColor: '#713f12', headingColor: '#422006', cardBg: '#ffffff', cardBorder: '#fef08a', swatch: '#eab308', accentColor: '#ca8a04', isDark: false, description: 'Amarelo' },
  blue: { id: 'azul', label: 'Azul Céu', icon: '🌊', bgColor: '#eff6ff', textColor: '#1e3a8a', headingColor: '#0c2340', cardBg: '#ffffff', cardBorder: '#bfdbfe', swatch: '#2563eb', accentColor: '#1d4ed8', isDark: false, description: 'Azul' },
  orange: { id: 'laranja', label: 'Laranja Quente', icon: '🍊', bgColor: '#fff7ed', textColor: '#7c2d12', headingColor: '#431407', cardBg: '#ffffff', cardBorder: '#fed7aa', swatch: '#ea580c', accentColor: '#c2410c', isDark: false, description: 'Laranja' },
  purple: { id: 'roxo', label: 'Roxo Noturno', icon: '🔮', bgColor: '#160c28', textColor: '#f3e8ff', headingColor: '#ffffff', cardBg: '#23143d', cardBorder: '#3b2366', swatch: '#7e22ce', accentColor: '#c084fc', isDark: true, description: 'Roxo' },
  wine: { id: 'vinho', label: 'Vinho Noturno', icon: '🍷', bgColor: '#260919', textColor: '#fce7f3', headingColor: '#ffffff', cardBg: '#3d122b', cardBorder: '#5c1e43', swatch: '#831843', accentColor: '#f472b6', isDark: true, description: 'Vinho' },
  default: { id: 'verde', label: 'Verde Tropical', icon: '🌿', bgColor: '#f0fdf4', textColor: '#14532d', headingColor: '#064e3b', cardBg: '#ffffff', cardBorder: '#bbf7d0', swatch: '#16a34a', accentColor: '#087f48', isDark: false, description: 'Padrão' }
};

export const AVAILABLE_THEME_KEYS: ThemeKey[] = [
  'verde',
  'preto',
  'azul_escuro',
  'rosa_claro',
  'azul',
  'amarelo',
  'laranja',
  'roxo',
  'vinho',
  'esmeralda_escuro',
  'menta_claro',
  'cinza_grafite',
  'vermelho_escuro',
  'lavanda',
  'pessego',
  'areia'
];

export const THEME_STORAGE_KEY = 'tropic_vida_theme_preference';
export const DARK_MODE_STORAGE_KEY = 'tropic_vida_dark_mode_preference';

interface ThemeContextType {
  theme: string;
  currentThemeConfig: ThemeConfig;
  setTheme: (theme: string) => void;
  availableThemes: ThemeConfig[];
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  toggleDarkMode: () => void;
  pickRandomTheme: () => ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'verde',
  currentThemeConfig: THEMES.verde,
  setTheme: () => {},
  availableThemes: AVAILABLE_THEME_KEYS.map(k => THEMES[k]),
  isDarkMode: false,
  setIsDarkMode: () => {},
  toggleDarkMode: () => {},
  pickRandomTheme: () => THEMES.verde
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem('game_theme');
      if (saved && THEMES[saved]) {
        return THEMES[saved].id;
      }
    } catch (e) {
      console.warn('Erro ao ler tema do localStorage', e);
    }
    return 'verde';
  });

  const [isDarkMode, setIsDarkModeState] = useState<boolean>(() => {
    try {
      const savedDark = localStorage.getItem(DARK_MODE_STORAGE_KEY);
      if (savedDark !== null) {
        return savedDark === 'true';
      }
    } catch (e) {
      console.warn('Erro ao ler dark mode do localStorage', e);
    }
    return false;
  });

  const applyThemeToRoot = (themeKey: string, dark: boolean) => {
    const config = THEMES[themeKey] || THEMES.verde;
    const isDarkEffective = config.isDark || dark;

    document.documentElement.setAttribute('data-theme', config.id);
    document.documentElement.setAttribute('data-theme-mode', isDarkEffective ? 'dark' : 'light');

    if (isDarkEffective) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-dark', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-dark', 'false');
    }

    // Set core CSS variables for automatic contrast
    document.documentElement.style.setProperty('--bg-color', config.bgColor);
    document.documentElement.style.setProperty('--text-color', config.textColor);
    document.documentElement.style.setProperty('--heading-color', config.headingColor);
    document.documentElement.style.setProperty('--card-bg', config.cardBg);
    document.documentElement.style.setProperty('--card-border', config.cardBorder);
    document.documentElement.style.setProperty('--accent-color', config.accentColor);
    document.documentElement.style.setProperty('--swatch-color', config.swatch);
  };

  const setTheme = (newTheme: string) => {
    const config = THEMES[newTheme] || THEMES.verde;
    setThemeState(config.id);
    applyThemeToRoot(config.id, isDarkMode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, config.id);
      localStorage.setItem('game_theme', config.id);
    } catch (e) {
      console.warn('Erro ao salvar tema no localStorage', e);
    }
  };

  const pickRandomTheme = (): ThemeConfig => {
    const remaining = AVAILABLE_THEME_KEYS.filter(k => k !== theme);
    const randomKey = remaining[Math.floor(Math.random() * remaining.length)] || 'azul_escuro';
    const config = THEMES[randomKey];
    setTheme(randomKey);
    return config;
  };

  const setIsDarkMode = (dark: boolean) => {
    setIsDarkModeState(dark);
    applyThemeToRoot(theme, dark);
    try {
      localStorage.setItem(DARK_MODE_STORAGE_KEY, String(dark));
    } catch (e) {
      console.warn('Erro ao salvar dark mode no localStorage', e);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    applyThemeToRoot(theme, isDarkMode);
  }, [theme, isDarkMode]);

  const currentThemeConfig = THEMES[theme] || THEMES.verde;
  const availableThemes = AVAILABLE_THEME_KEYS.map(k => THEMES[k]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      currentThemeConfig, 
      setTheme, 
      availableThemes, 
      isDarkMode, 
      setIsDarkMode, 
      toggleDarkMode,
      pickRandomTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
