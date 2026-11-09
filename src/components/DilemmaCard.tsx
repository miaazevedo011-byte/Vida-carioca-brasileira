import React from 'react';
import { Dilemma, Choice, Character } from '../types/game';
import { Sparkles, ArrowRight, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';

interface DilemmaCardProps {
  dilemma: Dilemma;
  character: Character;
  onChoose: (choice: Choice) => void;
}

export const DilemmaCard: React.FC<DilemmaCardProps> = ({
  dilemma,
  character,
  onChoose
}) => {
  return (
    <div className="bg-[#ffffff] rounded-2xl border border-[#e4e1d7] shadow-[0px_10px_24px_rgba(20,30,24,0.06)] p-4 sm:p-5 mb-4 relative overflow-hidden">
      {/* Top Banner Stripe with Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#006437] bg-[#e6f5ed] px-2.5 py-1 rounded-full font-heading flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#087F48]" />
          {dilemma.badge}
        </span>
        <span className="text-[11px] font-semibold text-[#566359] font-heading">
          Idade: {character.age} anos • {character.currentCity}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-extrabold text-[#141E18] font-heading tracking-tight leading-tight mb-2.5">
        {dilemma.title}
      </h2>

      {/* Narrative context set in body-lg with 1.5 line height */}
      <p className="text-[15px] sm:text-[16px] text-[#3e4940] leading-relaxed mb-5 font-normal">
        {dilemma.context}
      </p>

      {/* Dilemma Choice Buttons */}
      <div className="space-y-2.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#566359] font-heading block mb-1">
          O que você decide fazer?
        </span>

        {dilemma.choices.map((choice, index) => {
          return (
            <button
              key={choice.id || index}
              onClick={() => onChoose(choice)}
              className="w-full text-left p-3.5 sm:p-4 rounded-xl bg-[#ffffff] border-[1.5px] border-[#E4E1D7] hover:border-[#087F48] focus:border-[#087F48] focus:outline-none transition-all duration-150 group shadow-[0px_2px_6px_rgba(20,30,24,0.03)] hover:shadow-[0px_4px_12px_rgba(8,127,72,0.12)] active:scale-[0.985] cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-[14px] sm:text-[15px] font-semibold text-[#141E18] group-hover:text-[#006437] transition-colors leading-snug mb-2">
                    {choice.text}
                  </p>

                  {/* Contextual mini stat preview indicators */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {choice.preview.grana !== undefined && choice.preview.grana !== 0 && (
                      <span
                        className={`text-[11px] font-extrabold font-heading px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
                          choice.preview.grana > 0
                            ? 'bg-[#e6f5ed] text-[#087F48]'
                            : 'bg-[#fdeee9] text-[#D9532F]'
                        }`}
                      >
                        {choice.preview.grana > 0 ? '+' : ''}R$ {Math.abs(choice.preview.grana).toLocaleString('pt-BR')}
                      </span>
                    )}

                    {choice.preview.felicidade !== undefined && choice.preview.felicidade !== 0 && (
                      <span
                        className={`text-[11px] font-bold font-heading px-2 py-0.5 rounded-md ${
                          choice.preview.felicidade > 0
                            ? 'bg-[#fff9e6] text-[#9b6f00]'
                            : 'bg-[#fdeee9] text-[#D9532F]'
                        }`}
                      >
                        {choice.preview.felicidade > 0 ? '+' : ''}{choice.preview.felicidade}% Felicidade
                      </span>
                    )}

                    {choice.preview.saude !== undefined && choice.preview.saude !== 0 && (
                      <span
                        className={`text-[11px] font-bold font-heading px-2 py-0.5 rounded-md ${
                          choice.preview.saude > 0
                            ? 'bg-[#e6f5ed] text-[#087F48]'
                            : 'bg-[#fdeee9] text-[#D9532F]'
                        }`}
                      >
                        {choice.preview.saude > 0 ? '+' : ''}{choice.preview.saude}% Saúde
                      </span>
                    )}

                    {choice.preview.intelecto !== undefined && choice.preview.intelecto !== 0 && (
                      <span
                        className={`text-[11px] font-bold font-heading px-2 py-0.5 rounded-md ${
                          choice.preview.intelecto > 0
                            ? 'bg-[#edf5fd] text-[#0B66C3]'
                            : 'bg-[#fdeee9] text-[#D9532F]'
                        }`}
                      >
                        {choice.preview.intelecto > 0 ? '+' : ''}{choice.preview.intelecto}% Intelecto
                      </span>
                    )}

                    {choice.preview.serasa !== undefined && choice.preview.serasa !== 0 && (
                      <span
                        className={`text-[11px] font-bold font-heading px-2 py-0.5 rounded-md ${
                          choice.preview.serasa > 0
                            ? 'bg-[#e6f5ed] text-[#087F48]'
                            : 'bg-[#fdeee9] text-[#D9532F]'
                        }`}
                      >
                        {choice.preview.serasa > 0 ? '+' : ''}{choice.preview.serasa} pts Serasa
                      </span>
                    )}

                    {choice.preview.energia !== undefined && choice.preview.energia !== 0 && (
                      <span
                        className={`text-[11px] font-bold font-heading px-2 py-0.5 rounded-md ${
                          choice.preview.energia > 0
                            ? 'bg-[#fff9e6] text-[#9b6f00]'
                            : 'bg-[#fdeee9] text-[#D9532F]'
                        }`}
                      >
                        {choice.preview.energia > 0 ? '+' : ''}{choice.preview.energia}% Energia
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-[#f5f3ed] group-hover:bg-[#087F48] group-hover:text-white flex items-center justify-center text-[#566359] transition-colors mt-0.5 flex-shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
