import React from 'react';
import { GameState } from '../types/game';
import { ShieldCheck, ShieldAlert, Award, FileText, Newspaper, TrendingUp, Sparkles, Building2 } from 'lucide-react';

interface DesktopSidebarProps {
  gameState: GameState;
  position: 'left' | 'right';
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ gameState, position }) => {
  const { character, career, serasa, stats, housing, vehicle, pet, relationship } = gameState;
  const isNomeLimpo = serasa.score >= 500 && serasa.dividas.length === 0;

  if (position === 'left') {
    return (
      <aside className="hidden lg:flex flex-col gap-4 w-[290px] xl:w-[320px] flex-shrink-0">
        {/* RG Digital do Cidadão Brasileiro Card */}
        <div className="bg-[#ffffff] rounded-2xl p-4 sm:p-5 border border-[#e4e1d7] shadow-[0px_4px_16px_rgba(20,30,24,0.04)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#087F48]/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#f0eee8]">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase text-[#006437] font-heading">
                REPÚBLICA FEDERATIVA DO BRASIL
              </span>
            </div>
            <span className="text-[10px] font-extrabold bg-[#e6f5ed] text-[#087F48] px-2 py-0.5 rounded-full font-heading">
              GOV.BR
            </span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-[#f5f3ed] border border-[#e4e1d7] flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
              {character.gender === 'F' ? '👩' : character.gender === 'M' ? '👨' : '🧑'}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-[#566359] block">Nome do Cidadão</span>
              <h4 className="font-heading font-extrabold text-sm text-[#141E18] truncate">
                {character.name}
              </h4>
              <p className="text-[11px] text-[#566359] mt-0.5">
                {character.birthCity} - {character.birthState} • {character.age} anos
              </p>
            </div>
          </div>

          <div className="space-y-1.5 text-xs pt-1 border-t border-[#f0eee8]">
            <div className="flex justify-between">
              <span className="text-[#566359]">CPF:</span>
              <span className="font-mono font-bold text-[#141E18]">***.482.918-**</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#566359]">Origem:</span>
              <span className="font-bold text-[#006437] text-right truncate max-w-[170px]">
                {character.originTrait}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#566359]">Estado Civil:</span>
              <span className="font-bold text-[#141E18] capitalize">{relationship.status}</span>
            </div>
          </div>
        </div>

        {/* Serasa Score Gauge Card */}
        <div className="bg-[#ffffff] rounded-2xl p-4 sm:p-5 border border-[#e4e1d7] shadow-[0px_4px_16px_rgba(20,30,24,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              {isNomeLimpo ? (
                <ShieldCheck className="w-4 h-4 text-[#087F48]" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-[#D9532F]" />
              )}
              <h4 className="font-heading font-extrabold text-xs text-[#141E18]">
                Termômetro Serasa Score
              </h4>
            </div>
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                isNomeLimpo ? 'bg-[#e6f5ed] text-[#087F48]' : 'bg-[#fdeee9] text-[#D9532F]'
              }`}
            >
              {isNomeLimpo ? 'NOME LIMPO' : 'NEGATIVADO'}
            </span>
          </div>

          {/* Score number */}
          <div className="text-3xl font-black font-heading text-[#141E18] my-1">
            {serasa.score}{' '}
            <span className="text-xs font-semibold text-[#566359]">/ 1000</span>
          </div>

          {/* Progress bar gauge */}
          <div className="h-2.5 w-full bg-[#ece9df] rounded-full overflow-hidden shadow-inner my-2">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(serasa.score / 1000) * 100}%`,
                backgroundColor: isNomeLimpo ? '#087F48' : '#D9532F'
              }}
            />
          </div>

          <p className="text-[11px] text-[#566359] leading-snug">
            {serasa.score >= 800
              ? 'Excelente! Financiamentos Caixa com juros reduzidos e cartões Black liberados.'
              : serasa.score >= 500
              ? 'Bom! Crédito aprovado na maioria das instituições financeiras sem burocracia.'
              : 'Atenção: Nome negativado. Renegocie no feirão Serasa Limpa Nome para reabilitar o crédito!'}
          </p>
        </div>

        {/* Carteira de Trabalho Digital */}
        <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#e4e1d7] shadow-sm">
          <div className="flex items-center gap-2 pb-2 mb-2 border-b border-[#f0eee8]">
            <FileText className="w-4 h-4 text-[#0B66C3]" />
            <h4 className="font-heading font-extrabold text-xs text-[#141E18]">
              Carteira de Trabalho Digital (CTPS)
            </h4>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-[#566359]">Regime:</span>
              <span className="font-bold text-[#0B66C3] uppercase">{career.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#566359]">Cargo:</span>
              <span className="font-bold text-[#141E18] text-right truncate max-w-[170px]">{career.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#566359]">Empresa:</span>
              <span className="font-medium text-[#141E18] text-right truncate max-w-[170px]">{career.companyOrOrg}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-[#566359]">Salário Atual:</span>
              <span className="font-extrabold text-[#006437] font-heading">
                R$ {career.salaryMonthly.toLocaleString('pt-BR')}/mês
              </span>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // Right position: Notícias do Brasil & Vida Atual
  return (
    <aside className="hidden lg:flex flex-col gap-4 w-[290px] xl:w-[320px] flex-shrink-0">
      {/* Manchetes do Brasil do Ano */}
      <div className="bg-[#ffffff] rounded-2xl p-4 sm:p-5 border border-[#e4e1d7] shadow-[0px_4px_16px_rgba(20,30,24,0.04)]">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#f0eee8]">
          <div className="flex items-center gap-1.5">
            <Newspaper className="w-4 h-4 text-[#087F48]" />
            <h4 className="font-heading font-extrabold text-xs text-[#141E18]">
              Jornal do Brasil • Ano {character.year}
            </h4>
          </div>
          <span className="text-[10px] font-bold text-[#0B66C3] bg-[#edf5fd] px-1.5 py-0.5 rounded">
            AO VIVO
          </span>
        </div>

        {/* Economic Ticker */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-[#fbf9f3] p-2 rounded-xl border border-[#ece9df]">
            <span className="text-[9px] uppercase font-bold text-[#566359] block">Dólar PTAX</span>
            <span className="text-xs font-black text-[#141E18] font-heading">R$ 5,42</span>
          </div>
          <div className="bg-[#fbf9f3] p-2 rounded-xl border border-[#ece9df]">
            <span className="text-[9px] uppercase font-bold text-[#566359] block">Taxa Selic</span>
            <span className="text-xs font-black text-[#006437] font-heading">10.75% a.a.</span>
          </div>
        </div>

        {/* Headlines */}
        <div className="space-y-2 text-xs text-[#3e4940]">
          <div className="p-2.5 rounded-xl bg-[#fbf9f3] border border-[#ece9df]">
            <p className="font-bold text-[#141E18] mb-0.5">
              ☕ Safra de café bate recorde no sul de Minas Gerais
            </p>
            <p className="text-[11px] text-[#566359]">
              Exportações aquecem a economia e aumentam a circulação de renda nas capitais.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#fbf9f3] border border-[#ece9df]">
            <p className="font-bold text-[#141E18] mb-0.5">
              🎉 Carnaval de rua atrai 12 milhões de foliões
            </p>
            <p className="text-[11px] text-[#566359]">
              Setor de comércio e gastronomia comemora alta no consumo de cerveja e água de coco.
            </p>
          </div>
        </div>
      </div>

      {/* Patrimônio Acumulado & Família */}
      <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#e4e1d7] shadow-sm">
        <h4 className="font-heading font-extrabold text-xs text-[#141E18] mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#F4B300]" />
          Patrimônio & Estilo de Vida
        </h4>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#fbf9f3] border border-[#ece9df]">
            <span className="text-[#566359]">Moradia:</span>
            <span className="font-bold text-[#141E18] flex items-center gap-1">
              <span>{housing.icon}</span>
              <span className="truncate max-w-[140px]">{housing.name}</span>
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-[#fbf9f3] border border-[#ece9df]">
            <span className="text-[#566359]">Veículo:</span>
            <span className="font-bold text-[#141E18] flex items-center gap-1">
              <span>{vehicle ? vehicle.icon : '🚶'}</span>
              <span className="truncate max-w-[140px]">{vehicle ? vehicle.name : 'Transporte Público'}</span>
            </span>
          </div>

          {pet && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#fff9e6] border border-[#fbd37d]">
              <span className="text-[#6c4d00] font-medium">Pet:</span>
              <span className="font-bold text-[#b07d00] flex items-center gap-1">
                <span>🐕</span>
                <span>{pet.name} ({pet.breed})</span>
              </span>
            </div>
          )}

          {relationship.partnerName && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#fff0f3] border border-[#fbd3de]">
              <span className="text-[#991b1b] font-medium">Parceiro(a):</span>
              <span className="font-bold text-[#e02424] flex items-center gap-1">
                <span>❤️</span>
                <span>{relationship.partnerName}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
