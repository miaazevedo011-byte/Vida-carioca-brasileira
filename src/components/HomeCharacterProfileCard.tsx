import React from 'react';
import { Character, Career, Stats } from '../types/game';
import { Wallet, TrendingUp, School, Briefcase, Award, CheckCircle2 } from 'lucide-react';

interface HomeCharacterProfileCardProps {
  character: Character;
  career: Career;
  stats: Stats;
}

export const HomeCharacterProfileCard: React.FC<HomeCharacterProfileCardProps> = ({
  character,
  career,
  stats
}) => {
  const isStudent = character.age < 18 || career.title.toLowerCase().includes('aprendiz') || career.title.toLowerCase().includes('estudante');
  const isRetired = character.retired || character.age >= 65 || career.title.toLowerCase().includes('aposentado');
  const monthlyFlow = career.salaryMonthly || 0;

  return (
    <section className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-[0_8px_24px_rgba(30,40,24,0.06)] border border-[#e4e1d7] relative overflow-hidden mb-3 text-left">
      {/* Subtle background glow */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-100/50 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center gap-3.5">
        {/* Detalhes do Personagem (Somente Dados Escritos) */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="font-heading font-black text-lg sm:text-xl text-[#161d18] truncate leading-tight">
              {character.name}
            </h2>
            <span className="text-[11px] font-extrabold text-[#5e4200] bg-[#ffdea8]/60 border border-[#ffdea8] px-2 py-0.5 rounded-full font-heading">
              {character.age} Anos
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#566359] mb-1.5 font-medium">
            <span className="text-sm">🇧🇷</span>
            <span className="truncate">{character.birthCity || 'São Paulo'}, {character.birthState || 'SP'}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-[#e2ffe9] text-[#005232] border border-[#93f7be] px-2.5 py-0.5 rounded-full shadow-xs">
            {isStudent ? (
              <School className="w-3.5 h-3.5 text-[#006740]" />
            ) : isRetired ? (
              <Award className="w-3.5 h-3.5 text-[#7c5800]" />
            ) : (
              <Briefcase className="w-3.5 h-3.5 text-[#006740]" />
            )}
            <span className="text-[10px] font-extrabold uppercase tracking-wide truncate max-w-[170px] font-heading">
              {career.title}
            </span>
          </div>

          {(character.avatarSkinTone || character.avatarOutfit || character.avatarAccessory) && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {character.avatarSkinTone && (
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[9.5px] font-bold">
                  Pele: {character.avatarSkinTone}
                </span>
              )}
              {character.avatarOutfit && (
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[9.5px] font-bold">
                  Look: {character.avatarOutfit}
                </span>
              )}
              {character.avatarAccessory && (
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 text-[9.5px] font-bold">
                  Acessório: {character.avatarAccessory}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Finanças: Painel de Caixa Tátil */}
      <div className="mt-3.5 pt-2 bg-[#f4fbf2] rounded-xl p-3 flex items-center justify-between border border-[#e4e1d7] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white border border-[#dde4db] flex items-center justify-center text-[#7c5800] shadow-[0_2px_0_0_#bdcabf]">
            <Wallet className="w-5 h-5 text-[#b07d00]" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-[#566359] block uppercase tracking-wider font-heading">
              Saldo em Conta
            </span>
            <span className="font-heading font-black text-base sm:text-lg text-[#161d18] tracking-tight leading-none">
              R$ {stats.grana.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        <div className="text-right bg-white px-2.5 py-1 rounded-xl border border-[#dde4db] shadow-xs">
          <span className="text-[11px] font-black text-[#006740] flex items-center justify-end font-heading">
            <TrendingUp className="w-3 h-3 mr-0.5 text-[#006740]" />
            {monthlyFlow > 0 ? `+R$ ${monthlyFlow.toLocaleString('pt-BR')}` : 'R$ 0'}
          </span>
          <span className="text-[9.5px] font-bold text-[#6e7a71] uppercase tracking-wider font-heading">
            fluxo / mês
          </span>
        </div>
      </div>
    </section>
  );
};
