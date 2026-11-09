import React, { createContext, useState, useEffect, useContext } from 'react';

export type ThemeKey = 
  | 'verde' 
  | 'vermelho' 
  | 'preto' 
  | 'amarelo' 
  | 'azul' 
  | 'laranja' 
  | 'roxo' 
  | 'vinho';

export interface ThemeConfig {
  id: ThemeKey;
  label: string;
  icon: string;
  bgColor: string;
  textColor: string;
  swatch: string;
  accentColor: string;
  description: string;
}

export const THEMES: Record<string, ThemeConfig> = {
  verde: {
    id: 'verde',
    label: 'Verde',
    icon: '🌿',
    bgColor: '#f0fdf4',
    textColor: '#14532d',
    swatch: '#16a34a',
    accentColor: '#087f48',
    description: 'Verde tropical relaxante'
  },
  vermelho: {
    id: 'vermelho',
    label: 'Vermelho',
    icon: '🌹',
    bgColor: '#fef2f2',
    textColor: '#7f1d1d',
    swatch: '#dc2626',
    accentColor: '#b91c1c',
    description: 'Rubro marcante e vibrante'
  },
  preto: {
    id: 'preto',
    label: 'Preto',
    icon: '🌑',
    bgColor: '#171717',
    textColor: '#f5f5f5',
    swatch: '#262626',
    accentColor: '#404040',
    description: 'Tema escuro e noturno'
  },
  amarelo: {
    id: 'amarelo',
    label: 'Amarelo',
    icon: '☀️',
    bgColor: '#fefce8',
    textColor: '#713f12',
    swatch: '#eab308',
    accentColor: '#ca8a04',
    description: 'Solar e radiante'
  },
  azul: {
    id: 'azul',
    label: 'Azul',
    icon: '🌊',
    bgColor: '#eff6ff',
    textColor: '#1e3a8a',
    swatch: '#2563eb',
    accentColor: '#1d4ed8',
    description: 'Oceânico e equilibrado'
  },
  laranja: {
    id: 'laranja',
    label: 'Laranja',
    icon: '🍊',
    bgColor: '#fff7ed',
    textColor: '#7c2d12',
    swatch: '#ea580c',
    accentColor: '#c2410c',
    description: 'Tangerina aconchegante'
  },
  roxo: {
    id: 'roxo',
    label: 'Roxo',
    icon: '🔮',
    bgColor: '#faf5ff',
    textColor: '#581c87',
    swatch: '#9333ea',
    accentColor: '#7e22ce',
    description: 'Ametista moderno'
  },
  vinho: {
    id: 'vinho',
    label: 'Vinho',
    icon: '🍷',
    bgColor: '#fdf2f8',
    textColor: '#701a75',
    swatch: '#9d174d',
    accentColor: '#831843',
    description: 'Bordô refinado'
  },
  // English aliases for compatibility
  green: { id: 'verde', label: 'Verde', icon: '🌿', bgColor: '#f0fdf4', textColor: '#14532d', swatch: '#16a34a', accentColor: '#087f48', description: 'Verde tropical' },
  red: { id: 'vermelho', label: 'Vermelho', icon: '🌹', bgColor: '#fef2f2', textColor: '#7f1d1d', swatch: '#dc2626', accentColor: '#b91c1c', description: 'Rubro' },
  black: { id: 'preto', label: 'Preto', icon: '🌑', bgColor: '#171717', textColor: '#f5f5f5', swatch: '#262626', accentColor: '#404040', description: 'Tema escuro' },
  yellow: { id: 'amarelo', label: 'Amarelo', icon: '☀️', bgColor: '#fefce8', textColor: '#713f12', swatch: '#eab308', accentColor: '#ca8a04', description: 'Solar' },
  blue: { id: 'azul', label: 'Azul', icon: '🌊', bgColor: '#eff6ff', textColor: '#1e3a8a', swatch: '#2563eb', accentColor: '#1d4ed8', description: 'Oceânico' },
  orange: { id: 'laranja', label: 'Laranja', icon: '🍊', bgColor: '#fff7ed', textColor: '#7c2d12', swatch: '#ea580c', accentColor: '#c2410c', description: 'Laranja' },
  purple: { id: 'roxo', label: 'Roxo', icon: '🔮', bgColor: '#faf5ff', textColor: '#581c87', swatch: '#9333ea', accentColor: '#7e22ce', description: 'Roxo' },
  wine: { id: 'vinho', label: 'Vinho', icon: '🍷', bgColor: '#fdf2f8', textColor: '#701a75', swatch: '#9d174d', accentColor: '#831843', description: 'Vinho' },
  default: { id: 'verde', label: 'Verde', icon: '🌿', bgColor: '#f0fdf4', textColor: '#14532d', swatch: '#16a34a', accentColor: '#087f48', description: 'Padrão' }
};

export const AVAILABLE_THEME_KEYS: ThemeKey[] = [
  'verde',
  'vermelho',
  'preto',
  'amarelo',
  'azul',
  'laranja',
  'roxo',
  'vinho'
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
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'verde',
  currentThemeConfig: THEMES.verde,
  setTheme: () => {},
  availableThemes: AVAILABLE_THEME_KEYS.map(k => THEMES[k]),
  isDarkMode: false,
  setIsDarkMode: () => {},
  toggleDarkMode: () => {}
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
    document.documentElement.setAttribute('data-theme', config.id);

    if (dark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-dark', 'true');
      document.documentElement.style.setProperty('--bg-color', '#0f1715');
      document.documentElement.style.setProperty('--text-color', '#f1f5f3');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-dark', 'false');
      document.documentElement.style.setProperty('--bg-color', config.bgColor);
      document.documentElement.style.setProperty('--text-color', config.textColor);
    }
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
    <ThemeContext.Provider value={{ theme, currentThemeConfig, setTheme, availableThemes, isDarkMode, setIsDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

