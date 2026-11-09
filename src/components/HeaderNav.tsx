import React from 'react';
import { Character, Career, SerasaProfile, GameState } from '../types/game';
import { MapPin, Briefcase, RefreshCw } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { LegoMinifigHead } from './LegoMinifigHead';
import { useTheme } from '../context/ThemeContext';

interface HeaderNavProps {
  character: Character;
  career: Career;
  serasa: SerasaProfile;
  selectedTab: GameState['selectedTab'];
  onSelectTab: (tab: GameState['selectedTab']) => void;
  onNewGame: () => void;
  onOpenDocuments: () => void;
  onOpenInventory?: () => void;
}

const getCountryTheme = (city: string) => {
  switch (city) {
    case 'Tóquio':
      return { bg: '#ffffff', border: '#bc002d', flag: '🇯🇵' };
    case 'Paris':
      return { bg: '#ffffff', border: '#002654', flag: '🇫🇷' };
    case 'Londres':
      return { bg: '#ffffff', border: '#012169', flag: '🇬🇧' };
    case 'Barcelona':
      return { bg: '#f1bf00', border: '#aa151b', flag: '🇪🇸' };
    case 'Lisboa':
      return { bg: '#006600', border: '#ff0000', flag: '🇵🇹' };
    case 'Miami':
    case 'Nova York':
      return { bg: '#ffffff', border: '#3c3b6e', flag: '🇺🇸' };
    case 'Buenos Aires':
      return { bg: '#ffffff', border: '#75aadb', flag: '🇦🇷' };
    case 'Dubai':
      return { bg: '#ffffff', border: '#ce1126', flag: '🇦🇪' };
    case 'Berlim':
      return { bg: '#ffcc00', border: '#dd0000', flag: '🇩🇪' };
    case 'Toronto':
      return { bg: '#ffffff', border: '#ff0000', flag: '🇨🇦' };
    case 'Sydney':
      return { bg: '#ffffff', border: '#012169', flag: '🇦🇺' };
    default:
      return { bg: '#fdbb2d', border: '#087F48', flag: '🇧🇷' };
  }
};

export const HeaderNav: React.FC<HeaderNavProps> = ({
  character,
  career,
  serasa,
  selectedTab,
  onSelectTab,
  onNewGame,
  onOpenDocuments,
  onOpenInventory
}) => {
  const theme = getCountryTheme(character.currentCity);
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <header className="bg-[#ffffff] border-b border-[#e4e1d7] shadow-[0px_2px_8px_rgba(20,30,24,0.03)] sticky top-0 z-30">
      {/* Topmost Micro Bar */}
      <div className="max-w-md mx-auto px-3 sm:px-4 pt-2.5 sm:pt-3 pb-2 flex items-center justify-between gap-1.5">
        <button
          onClick={onOpenDocuments}
          className="flex items-center gap-2 text-left group cursor-pointer hover:opacity-90 transition-opacity min-w-0"
          title="Clique para abrir RG Digital, Serasa Score e CTPS"
        >
          {/* Avatar icon */}
          <div className="relative flex-shrink-0">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform overflow-hidden p-0.5 border-2"
              style={{ backgroundColor: theme.bg, borderColor: theme.border }}
            >
              <LegoMinifigHead avatarId={character.legoAvatar || 'estudante'} size="md" className="w-full h-full" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white rounded-full flex items-center justify-center text-[9px] shadow-xs border border-slate-200">
              {theme.flag}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-heading font-extrabold text-xs sm:text-sm text-[#141E18] group-hover:text-[#006437] transition-colors truncate max-w-[100px] xs:max-w-[130px] sm:max-w-none">
                {character.name}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-[#566359] bg-[#f0eee8] px-1 py-0.5 rounded-md font-heading flex-shrink-0">
                {character.age}a
              </span>
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] text-[#566359] truncate">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#087F48] flex-shrink-0" />
              <span className="truncate">{character.currentCity}, {character.birthState}</span>
              <span className="text-[#becabe]">•</span>
              <span className="font-bold text-[#006437] flex-shrink-0">{character.year}</span>
            </div>
          </div>
        </button>

        {/* Top Right Action Buttons: Mochila (Inventário) e Lua (Tema) */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {onOpenInventory && (
            <button
              type="button"
              onClick={onOpenInventory}
              className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-300 flex items-center gap-1 hover:bg-emerald-100 cursor-pointer shadow-xs transition-transform active:scale-95"
              title="Abrir Mochila de Inventário"
            >
              <span>🎒</span>
              <span className="hidden xs:inline">Mochila</span>
            </button>
          )}

          <PWAInstallButton />

          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
            title={isDarkMode ? 'Mudar para Modo Claro ☀️' : 'Mudar para Modo Escuro 🌙'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          <button
            onClick={onNewGame}
            className="p-1 sm:p-1.5 text-[#566359] hover:text-[#141E18] hover:bg-[#f0eee8] rounded-full transition-colors cursor-pointer"
            title="Reiniciar Nova Vida"
          >
            <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>

      {/* Role / Career Tag Ribbon */}
      <div className="max-w-md mx-auto px-3 sm:px-4 pb-1.5 flex items-center justify-between text-xs">
        <button
          onClick={onOpenDocuments}
          className="flex items-center gap-1 sm:gap-1.5 cursor-pointer hover:underline min-w-0"
        >
          <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#0B66C3] flex-shrink-0" />
          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#0B66C3] bg-[#edf5fd] px-1.5 sm:px-2 py-0.5 rounded font-heading truncate max-w-[180px] sm:max-w-none">
            {career.title}
          </span>
        </button>
        <span className="text-[10px] sm:text-[11px] font-bold text-[#141E18] flex-shrink-0">
          {career.salaryMonthly > 0 ? `R$ ${career.salaryMonthly.toLocaleString('pt-BR')}/mês` : 'Sem renda'}
        </span>
      </div>

      {/* ALERT BADGE BANNER WHEN UNEMPLOYED */}
      {career.type === 'desempregado' && character.age >= 18 && (
        <div
          onClick={() => onSelectTab('carreira')}
          className="max-w-md mx-auto mx-1 mb-1 p-2 bg-[#fff0f0] border border-[#f9d7d7] rounded-xl flex items-center justify-between text-xs text-[#D9532F] cursor-pointer hover:bg-[#ffe5e5] transition-colors shadow-xs"
          title="Clique para acessar a aba Carreira e acionar o Seguro-Desemprego!"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm flex-shrink-0">🚨</span>
            <span className="truncate text-[10px] sm:text-[11px] font-extrabold font-heading">
              DESEMPREGADO: Solicite já o Seguro-Desemprego!
            </span>
          </div>
          <span className="text-[9px] bg-[#D9532F] text-white font-heading font-black px-2 py-0.5 rounded-full uppercase flex-shrink-0 shadow-xs">
            Acionar 🏦
          </span>
        </div>
      )}

      {/* Modern Tropical Navigation Tabs */}
      <div className="max-w-md mx-auto px-1 flex items-center justify-between border-t border-[#f0eee8] overflow-x-auto no-scrollbar">
        {[
          { key: 'historia', label: 'Início', icon: '👤' },
          { key: 'carreira', label: 'Carreira', icon: '💼' },
          { key: 'financas', label: 'Banco', icon: '💳' },
          { key: 'patrimonio', label: 'Bens & Eu', icon: '🏠' },
          { key: 'familia', label: 'Família', icon: '👨‍👩‍👧‍👦' },
          { key: 'roles', label: 'Atividades', icon: '🌴' },
          { key: 'mais', label: 'Mais', icon: '⚡' }
        ].map((tab) => {
          const isActive = selectedTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key as any)}
              className={`py-1.5 px-1.5 flex flex-col items-center gap-0.5 relative text-center transition-all cursor-pointer flex-shrink-0 min-w-[48px] sm:min-w-[54px] ${
                isActive
                  ? 'text-[#006437] font-extrabold'
                  : 'text-[#566359] hover:text-[#141E18] font-medium'
              }`}
            >
              <span className="text-xs leading-none">{tab.icon}</span>
              <span className="text-[9px] sm:text-[10px] tracking-tight font-heading whitespace-nowrap">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-[#087F48] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
