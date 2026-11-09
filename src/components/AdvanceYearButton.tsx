import React, { useState } from 'react';
import { Hourglass, FastForward, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface AdvanceYearButtonProps {
  onAdvance: () => void;
  currentAge: number;
  currentYear: number;
  disabled?: boolean;
  timeAdvanceMode?: 'anual' | 'semestral' | 'mensal';
  timeSubPeriod?: number;
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const AdvanceYearButton: React.FC<AdvanceYearButtonProps> = ({
  onAdvance,
  currentAge,
  currentYear,
  disabled = false,
  timeAdvanceMode = 'anual',
  timeSubPeriod = 1
}) => {
  const [isAdvancing, setIsAdvancing] = useState(false);

  const getButtonLabel = () => {
    if (timeAdvanceMode === 'mensal') {
      const monthIdx = Math.max(0, Math.min(11, (timeSubPeriod || 1) - 1));
      const nextMonthIdx = (monthIdx + 1) % 12;
      const nextYear = monthIdx === 11 ? currentYear + 1 : currentYear;
      return `Avançar 1 Mês (${MONTH_NAMES[nextMonthIdx]} • ${nextYear})`;
    }
    if (timeAdvanceMode === 'semestral') {
      const isFirstSemester = (timeSubPeriod || 1) === 1;
      const nextLabel = isFirstSemester ? `2º Semestre • ${currentYear}` : `1º Semestre • ${currentYear + 1}`;
      return `Avançar 6 Meses (${nextLabel})`;
    }
    return `Avançar 1 Ano (+1 Idade)`;
  };

  const getSubtext = () => {
    if (timeAdvanceMode === 'mensal') {
      return 'Receba seu salário mensal, pague despesas e viva o cotidiano brasileiro';
    }
    if (timeAdvanceMode === 'semestral') {
      return 'Receba o rendimento semestral, pague custos e acompanhe novas oportunidades';
    }
    return 'Receba seu salário anual, juros de investimentos e novos marcos da vida';
  };

  const handleClick = () => {
    if (disabled || isAdvancing) return;
    playClickSound();
    setIsAdvancing(true);
    onAdvance();
    setTimeout(() => {
      setIsAdvancing(false);
    }, 600);
  };

  return (
    <div className="pt-1 pb-4">
      {/* Botão Principal de Passagem de Ano (Toy-Button 3D) */}
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isAdvancing}
        className="w-full bg-[#006740] text-white py-3.5 px-4 rounded-xl font-heading font-black text-base flex items-center justify-between shadow-[0_5px_0_0_#005232,0_10px_18px_rgba(0,103,64,0.25)] active:translate-y-[4px] active:shadow-[0_1px_0_0_#005232] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
      >
        <div className="flex items-center gap-2">
          <Hourglass className={`w-5 h-5 text-[#93f7be] ${isAdvancing ? 'animate-spin' : ''}`} />
          <span>{isAdvancing ? 'Avançando ciclo de vida...' : getButtonLabel()}</span>
        </div>
        <div className="flex items-center bg-[#0d8253] px-2.5 py-1 rounded-lg border border-[#0d8253]/50 shadow-xs">
          <FastForward className="w-4 h-4 text-[#e2ffe9]" />
        </div>
      </button>

      <p className="text-center text-[11px] text-[#566359] mt-2 font-medium">
        {getSubtext()}
      </p>
    </div>
  );
};
