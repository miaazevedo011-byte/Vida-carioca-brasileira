import React from 'react';
import { GameState } from '../types/game';
import { Calendar, Sparkles, PartyPopper, Heart, Building, Award, Trophy, Sprout } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface CalendarOfEventsProps {
  gameState: GameState;
  onCelebrate: (event: string) => void;
}

export const CalendarOfEvents: React.FC<CalendarOfEventsProps> = ({ gameState, onCelebrate }) => {
  const { age, year, name } = gameState.character;

  const handleCelebrateClick = (desc: string) => {
    playSuccessSound();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    onCelebrate(desc);
  };

  // Generate age-appropriate and year-specific dynamic events
  const getDynamicEvents = () => {
    const list: Array<{ month: string; description: string; type: 'personal' | 'school' | 'culture' | 'finance'; icon: string }> = [];

    // Personal Birthday
    list.push({
      month: 'Março',
      description: age === 0 ? `Nascimento & Mesversário de ${name}` : `Aniversário de ${age} anos de ${name} 🎂`,
      type: 'personal',
      icon: '🎉'
    });

    // Age-specific calendar events
    if (age <= 2) {
      list.push({
        month: 'Maio',
        description: 'Campanha Nacional de Vacinação Infantil (Gotinha & Pólio)',
        type: 'personal',
        icon: '💉'
      });
      list.push({
        month: 'Outubro',
        description: 'Semana das Crianças & Primeiros Brinquedos',
        type: 'personal',
        icon: '🧸'
      });
    } else if (age <= 5) {
      list.push({
        month: 'Fevereiro',
        description: 'Início das Aulas na Creche / Educação Infantil',
        type: 'school',
        icon: '🖍️'
      });
      list.push({
        month: 'Junho',
        description: 'Festa Junina da Escolinha (Dança da Quadrilha)',
        type: 'culture',
        icon: '🌽'
      });
    } else if (age <= 11) {
      list.push({
        month: 'Fevereiro',
        description: 'Volta às Aulas no Ensino Fundamental',
        type: 'school',
        icon: '🎒'
      });
      list.push({
        month: 'Setembro',
        description: 'Feira de Ciências & Gincana Escolar',
        type: 'school',
        icon: '🔬'
      });
    } else if (age <= 17) {
      list.push({
        month: 'Agosto',
        description: 'Inscrições Abertas para o Simulado do ENEM',
        type: 'school',
        icon: '📝'
      });
      list.push({
        month: 'Novembro',
        description: 'Fim de Ano Letivo & Provas Finais do Ensino Médio',
        type: 'school',
        icon: '📚'
      });
    } else {
      list.push({
        month: 'Abril',
        description: 'Prazo de Entrega do Imposto de Renda (Receita Federal)',
        type: 'finance',
        icon: '📄'
      });
      if (gameState.career.type !== 'desempregado') {
        list.push({
          month: 'Novembro',
          description: 'Pagamento da 1ª Parcela do 13º Salário 💰',
          type: 'finance',
          icon: '💵'
        });
      }
    }

    // Historical & Brazilian Cultural Events based on year
    if (year % 4 === 2) {
      list.push({
        month: 'Junho',
        description: `Copa do Mundo da FIFA ${year} ⚽🇧🇷`,
        type: 'culture',
        icon: '🏆'
      });
    } else if (year % 4 === 0) {
      list.push({
        month: 'Julho',
        description: `Jogos Olímpicos de Verão ${year} 🥇`,
        type: 'culture',
        icon: '🏅'
      });
    }

    // Family or Agro event
    if (gameState.agro?.hasLand) {
      list.push({
        month: 'Agosto',
        description: `Período de Safra & Venda de Grãos (${year})`,
        type: 'finance',
        icon: '🌾'
      });
    } else if (gameState.family?.parents && gameState.family.parents.length > 0) {
      list.push({
        month: 'Agosto',
        description: `Dia dos Pais & Almoço com ${gameState.family.parents[0].name}`,
        type: 'personal',
        icon: '👨'
      });
    }

    return list;
  };

  const events = getDynamicEvents();

  return (
    <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#e4e1d7] shadow-sm space-y-3 text-left">
      <div className="flex items-center justify-between border-b border-[#f0eee8] pb-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#087F48]" />
          <div>
            <h3 className="font-heading font-black text-sm text-[#141E18]">
              Calendário Anual de Eventos • {year}
            </h3>
            <p className="text-[10px] text-[#566359]">
              Eventos dinâmicos da sua idade ({age} anos) e cultura brasileira
            </p>
          </div>
        </div>

        <span className="text-[10px] font-heading font-extrabold bg-[#e6f5ed] text-[#006437] px-2 py-0.5 rounded-full uppercase">
          Ano {year}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {events.map((event, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-[#fbf9f3] border border-[#ece9df] flex flex-col justify-between space-y-1.5 shadow-xs"
          >
            <div className="flex items-start justify-between gap-1.5">
              <div className="flex items-start gap-2">
                <span className="text-lg">{event.icon}</span>
                <div>
                  <span className="text-[10px] font-heading font-black text-[#087F48] uppercase block">
                    {event.month}
                  </span>
                  <p className="font-heading font-bold text-xs text-[#141E18] leading-snug">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>

            {event.type === 'personal' && (
              <button
                type="button"
                onClick={() => handleCelebrateClick(event.description)}
                className="w-full mt-1 bg-[#e6f5ed] hover:bg-[#d5f0e1] text-[#006437] text-[10px] font-heading font-bold py-1 px-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <PartyPopper className="w-3 h-3 text-[#087F48]" />
                <span>Comemorar Evento</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
