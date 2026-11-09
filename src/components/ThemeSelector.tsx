import React, { useState } from 'react';
import { useTheme, THEMES, AVAILABLE_THEME_KEYS, ThemeKey } from '../context/ThemeContext';
import { Palette, CheckCircle2, Sparkles, RefreshCw, Dices } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../utils/audio';

interface ThemeSelectorProps {
  compact?: boolean;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ compact = false }) => {
  const { theme, setTheme, currentThemeConfig, pickRandomTheme } = useTheme();
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSelectTheme = (themeKey: ThemeKey) => {
    playClickSound();
    setTheme(themeKey);
    const config = THEMES[themeKey];
    setFeedback(`Tema "${config.label}" aplicado! ${config.isDark ? 'Fundo escuro com textos claros' : 'Fundo claro com textos escuros'}.`);
    setTimeout(() => {
      setFeedback(null);
    }, 3500);
  };

  const handleCycleTheme = () => {
    playClickSound();
    const currentIndex = AVAILABLE_THEME_KEYS.indexOf(theme as ThemeKey);
    const nextKey = AVAILABLE_THEME_KEYS[(currentIndex + 1) % AVAILABLE_THEME_KEYS.length];
    handleSelectTheme(nextKey);
  };

  const handlePickRandom = () => {
    playSuccessSound();
    const chosen = pickRandomTheme();
    setFeedback(`🎲 Tema Sorteado: "${chosen.label}"! ${chosen.isDark ? 'Fundo escuro com textos claros' : 'Fundo claro com textos escuros'}.`);
    setTimeout(() => {
      setFeedback(null);
    }, 3500);
  };

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-[#087F48]" />
            <h5 className="font-heading font-extrabold text-xs text-[#141E18]">
              Paleta de Cores & Contraste
            </h5>
          </div>
          <button
            type="button"
            onClick={handlePickRandom}
            className="flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full hover:bg-purple-200 transition-colors cursor-pointer"
            title="Sortear um tema aleatório com alto contraste"
          >
            <Dices className="w-3 h-3" />
            <span>Tema Aleatório</span>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {AVAILABLE_THEME_KEYS.slice(0, 8).map((key) => {
            const item = THEMES[key];
            const isSelected = theme === key || theme === item.id;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectTheme(key)}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#087F48] bg-white shadow-md scale-105 ring-2 ring-[#087F48]/20'
                    : 'border-[#ece9df] bg-white/70 hover:bg-white hover:border-[#b8b3a5]'
                }`}
                title={`Mudar para o tema ${item.label}`}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-xs"
                  style={{ backgroundColor: item.swatch }}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </div>
                <span className="text-[10px] font-heading font-bold text-[#141E18]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {feedback && (
          <div className="p-2 bg-[#e6f5ed] border border-[#a2e6bd] rounded-lg text-[10px] text-[#006437] font-semibold flex items-center gap-1.5 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-[#087F48] flex-shrink-0" />
            <span>{feedback}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#ece9df] shadow-xs space-y-3.5 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#f0eee8]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#e6f5ed] text-[#087F48] flex items-center justify-center">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-heading font-black text-sm text-[#141E18]">
                Paleta de Cores & Temas Dinâmicos
              </h3>
              <span className="text-[9px] font-mono font-bold bg-[#edf5fd] text-[#0B66C3] px-1.5 py-0.5 rounded border border-[#b8d6f5]">
                {currentThemeConfig.isDark ? 'Contraste: Textos Claros ☀️' : 'Contraste: Textos Escuros 🌙'}
              </span>
            </div>
            <p className="text-[11px] text-[#566359]">
              As cores dos textos e títulos acompanham o fundo automaticamente (escuro → texto claro; claro → texto escuro).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePickRandom}
            className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title="Sortear um tema aleatório equilibrado"
          >
            <Dices className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Aleatório</span>
          </button>

          <button
            type="button"
            onClick={handleCycleTheme}
            className="p-1.5 rounded-lg bg-[#fbf9f3] hover:bg-[#f0eee8] text-[#566359] border border-[#ece9df] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title="Alternar para o próximo tema"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Próximo</span>
          </button>
        </div>
      </div>

      {/* Grid of Diverse Themes */}
      <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-4 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
        {AVAILABLE_THEME_KEYS.map((key) => {
          const item = THEMES[key];
          const isSelected = theme === key || theme === item.id;

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleSelectTheme(key)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'border-[#087F48] bg-[#fbf9f3] shadow-md ring-2 ring-[#087F48]/30 scale-[1.02]'
                  : 'border-[#ece9df] bg-[#ffffff] hover:border-[#087F48]/60 hover:bg-[#fcfbf7]'
              }`}
            >
              {isSelected && (
                <span className="absolute top-2 right-2 text-[#087F48]">
                  <CheckCircle2 className="w-4 h-4 fill-[#e6f5ed]" />
                </span>
              )}

              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-inner flex-shrink-0"
                  style={{ backgroundColor: item.swatch }}
                >
                  <span className="text-[11px]">{item.icon}</span>
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-xs text-[#141E18]">
                    {item.label}
                  </h4>
                  <span className="text-[9px] font-mono text-[#566359] block">
                    {item.isDark ? 'Fundo Escuro' : 'Fundo Claro'}
                  </span>
                </div>
              </div>

              {/* Color previews */}
              <div className="space-y-1 pt-1 border-t border-[#f0eee8] text-[9px] font-mono text-[#566359]">
                <div className="flex items-center justify-between">
                  <span>Fundo:</span>
                  <span className="font-semibold" style={{ color: item.accentColor }}>
                    {item.bgColor}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Texto:</span>
                  <span className="font-semibold" style={{ color: item.textColor }}>
                    {item.isDark ? 'Claro ⚪' : 'Escuro ⚫'}
                  </span>
                </div>
              </div>

              {isSelected && (
                <span className="text-[9px] font-heading font-extrabold text-[#087F48] mt-2 block text-center bg-[#e6f5ed] py-0.5 rounded">
                  ✓ Ativo
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback & Current Active Status Bar */}
      <div className="bg-[#fbf9f3] rounded-xl p-2.5 border border-[#ece9df] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-[11px] text-[#566359]">
          <span className="font-bold text-[#141E18]">Tema Atual:</span>
          <span
            className="px-2 py-0.5 rounded-full font-bold text-white text-[10px]"
            style={{ backgroundColor: currentThemeConfig.swatch }}
          >
            {currentThemeConfig.icon} {currentThemeConfig.label}
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#e4e1d7] bg-white text-slate-700">
            {currentThemeConfig.isDark ? 'Textos Claros Coordenados' : 'Textos Escuros Coordenados'}
          </span>
        </div>

        <div className="text-[10px] text-[#087F48] font-bold flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Contraste Garantido</span>
        </div>
      </div>

      {feedback && (
        <div className="p-2.5 bg-[#e6f5ed] border border-[#a2e6bd] rounded-xl text-xs text-[#006437] font-bold flex items-center gap-2 animate-fade-in shadow-xs">
          <Sparkles className="w-4 h-4 text-[#087F48] flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}
    </div>
  );
};
