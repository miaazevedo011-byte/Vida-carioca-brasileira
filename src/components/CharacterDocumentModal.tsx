import React from 'react';
import { Character, Career, SerasaProfile, Housing, Vehicle, Pet, Relationship } from '../types/game';
import { ShieldCheck, ShieldAlert, FileText, X, Sparkles, MapPin, Briefcase, Award, Globe, Heart, Building, UserCheck } from 'lucide-react';
import { LegoMinifigHead } from './LegoMinifigHead';

interface CharacterDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  career: Career;
  serasa: SerasaProfile;
  housing: Housing;
  vehicle?: Vehicle;
  pet?: Pet;
  relationship: Relationship;
}

export const CharacterDocumentModal: React.FC<CharacterDocumentModalProps> = ({
  isOpen,
  onClose,
  character,
  career,
  serasa,
  housing,
  vehicle,
  pet,
  relationship
}) => {
  if (!isOpen) return null;

  const isNomeLimpo = serasa.score >= 500 && serasa.dividas.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#ffffff] rounded-3xl border border-[#e4e1d7] shadow-[0px_20px_50px_rgba(20,30,24,0.2)] max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#f5f3ed] hover:bg-[#eae8e2] text-[#566359] hover:text-[#141E18] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#087F48] bg-[#e6f5ed] px-3 py-1 rounded-full font-heading inline-block mb-1">
            DOCUMENTOS OFICIAIS DO CIDADÃO
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-[#141E18]">
            Perfil & Documentação
          </h2>
        </div>

        <div className="space-y-4 text-xs">
          {/* 1. Carteira de Identidade - RG Digital */}
          <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#087F48]/30 shadow-[0px_4px_16px_rgba(8,127,72,0.08)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#087F48]/5 rounded-bl-full pointer-events-none" />

            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#f0eee8]">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase text-[#006437] font-heading">
                  REPÚBLICA FEDERATIVA DO BRASIL
                </span>
              </div>
              <span className="text-[10px] font-extrabold bg-[#e6f5ed] text-[#087F48] px-2 py-0.5 rounded-full font-heading">
                GOV.BR
              </span>
            </div>

            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-16 h-16 rounded-2xl bg-[#fdbb2d] border-2 border-[#a2e6bd] flex items-center justify-center shadow-inner flex-shrink-0 p-1">
                <LegoMinifigHead avatarId={character.legoAvatar || 'estudante'} size="md" className="w-full h-full" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-[#566359] block">Nome do Cidadão</span>
                <h3 className="font-heading font-black text-base text-[#141E18] truncate">
                  {character.name}
                </h3>
                <p className="text-xs text-[#566359] mt-0.5 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#087F48]" />
                  {character.currentCity} - {character.birthState} • {character.age} anos ({character.year})
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#f0eee8] bg-[#fbf9f3] p-2.5 rounded-xl border border-[#ece9df]">
              <div>
                <span className="text-[10px] text-[#566359] block font-bold uppercase">CPF</span>
                <span className="font-mono font-bold text-[#141E18]">***.482.918-**</span>
              </div>
              <div>
                <span className="text-[10px] text-[#566359] block font-bold uppercase">País Natal</span>
                <span className="font-bold text-[#141E18]">{character.countryOfBirth || 'Brasil'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#566359] block font-bold uppercase">Orientação Sexual</span>
                <span className="font-bold text-[#141E18]">{character.sexualOrientation || 'Heterossexual'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#566359] block font-bold uppercase">Classe Familiar</span>
                <span className="font-bold text-[#006437] font-heading">{character.familyClass || 'Média-Baixa'}</span>
              </div>
              <div className="col-span-2 pt-1.5 border-t border-[#ece9df]">
                <span className="text-[10px] text-[#566359] block font-bold uppercase">Personalidade</span>
                <span className="font-bold text-[#0B66C3] font-heading">{character.personality || character.originTrait}</span>
                <p className="text-[11px] text-[#566359] mt-0.5">{character.originDescription}</p>
              </div>
            </div>
          </div>

          {/* 2. Termômetro Serasa Score */}
          <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#e4e1d7] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {isNomeLimpo ? (
                  <ShieldCheck className="w-5 h-5 text-[#087F48]" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-[#D9532F]" />
                )}
                <h4 className="font-heading font-extrabold text-sm text-[#141E18]">
                  Termômetro Serasa Score
                </h4>
              </div>
              <span
                className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  isNomeLimpo ? 'bg-[#e6f5ed] text-[#087F48]' : 'bg-[#fdeee9] text-[#D9532F]'
                }`}
              >
                {isNomeLimpo ? 'NOME LIMPO' : 'NEGATIVADO'}
              </span>
            </div>

            <div className="flex items-baseline justify-between my-1">
              <span className="text-3xl font-black font-heading text-[#141E18]">{serasa.score}</span>
              <span className="text-xs font-semibold text-[#566359]">/ 1000 pontos</span>
            </div>

            {/* Gauge bar */}
            <div className="h-3 w-full bg-[#ece9df] rounded-full overflow-hidden shadow-inner my-2">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(serasa.score / 1000) * 100}%`,
                  backgroundColor: isNomeLimpo ? '#087F48' : '#D9532F'
                }}
              />
            </div>

            <p className="text-xs text-[#566359] leading-relaxed">
              {serasa.score >= 800
                ? 'Score Excelente! Crédito pré-aprovado com taxas reduzidas nos principais bancos.'
                : serasa.score >= 500
                ? 'Score Bom. Nome sem apontamentos graves, aprovação regular em compras a prazo.'
                : 'Atenção! Nome com pendências financeiras ativas. Negocie no Serasa Limpa Nome para recuperar o crédito.'}
            </p>
          </div>

          {/* 3. Carteira de Trabalho Digital (CTPS) */}
          <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#e4e1d7] shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#f0eee8]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0B66C3]" />
                <h4 className="font-heading font-extrabold text-sm text-[#141E18]">
                  Carteira de Trabalho Digital (CTPS)
                </h4>
              </div>
              <span className="text-[10px] font-bold text-[#0B66C3] bg-[#edf5fd] px-2 py-0.5 rounded-full uppercase font-heading">
                {career.type}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#fbf9f3] border border-[#ece9df]">
                <span className="text-[#566359]">Cargo Atual:</span>
                <span className="font-extrabold text-[#141E18] font-heading">{career.title}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#fbf9f3] border border-[#ece9df]">
                <span className="text-[#566359]">Empregador / Entidade:</span>
                <span className="font-bold text-[#141E18]">{career.companyOrOrg}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#fbf9f3] border border-[#ece9df]">
                <span className="text-[#566359]">Salário Registrado:</span>
                <span className="font-black text-[#006437] font-heading text-sm">
                  {career.salaryMonthly > 0 ? `R$ ${career.salaryMonthly.toLocaleString('pt-BR')}/mês` : 'Sem renda fixa'}
                </span>
              </div>
              {career.hasCarteiraAssinada && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#e6f5ed] border border-[#a2e6bd]">
                  <span className="text-[#087F48] font-bold">Fundo de Garantia (FGTS):</span>
                  <span className="font-black text-[#087F48] font-heading">
                    R$ {career.fgtsAccumulated.toLocaleString('pt-BR')}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#edf5fd] border border-[#b2d3f5]">
                <span className="text-[#0B66C3] font-bold">Previdência & Aposentadoria:</span>
                <span className="font-extrabold text-[#0B66C3]">
                  {character.retired ? `✅ Aposentado (${career.retirementType === 'inss' ? 'INSS' : career.retirementType === 'privada' ? 'Prev. Privada' : 'INSS + Privada'})` : `${career.totalYearsWorked || 0} anos de contribuição`}
                </span>
              </div>
            </div>

            {/* HISTÓRICO DETALHADO DE CARGOS, SALÁRIOS E EMPRESAS (CTPS) */}
            <div className="pt-3 border-t border-[#f0eee8] space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <h5 className="font-heading font-extrabold text-xs text-[#141E18] uppercase tracking-wider flex items-center gap-1">
                  <span>💼 Histórico Profissional ({career.ctpsHistory?.length || 0})</span>
                </h5>
                <span className="text-[9px] font-bold text-[#0B66C3] bg-[#edf5fd] px-2 py-0.5 rounded-full font-heading">
                  Evolução Salarial
                </span>
              </div>

              {career.ctpsHistory && career.ctpsHistory.length > 0 ? (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {career.ctpsHistory.map((entry, idx) => {
                    const maxVal = Math.max(...career.ctpsHistory!.map(h => h.salaryMonthly), career.salaryMonthly || 1);
                    const barWidth = Math.min(100, Math.max(12, Math.round((entry.salaryMonthly / maxVal) * 100)));

                    return (
                      <div key={entry.id || idx} className="p-2.5 rounded-xl bg-[#fbf9f3] border border-[#ece9df] space-y-1.5 shadow-xs">
                        <div className="flex items-center justify-between">
                          <h6 className="font-heading font-extrabold text-xs text-[#141E18]">{entry.title}</h6>
                          <span className="text-[9px] font-bold text-[#006437] bg-[#e6f5ed] px-2 py-0.5 rounded font-heading">
                            {entry.startYear} - {entry.endYear}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#566359]">
                          <span className="font-bold text-[#3e4940]">🏢 {entry.companyOrOrg} ({entry.type})</span>
                          <span className="font-black text-[#006437]">R$ {entry.salaryMonthly.toLocaleString('pt-BR')}/mês</span>
                        </div>

                        {/* Visual Salary Bar Graph */}
                        <div className="w-full bg-[#ece9df] h-2 rounded-full overflow-hidden shadow-inner">
                          <div
                            className="bg-gradient-to-r from-[#0B66C3] to-[#087F48] h-full rounded-full transition-all duration-300"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[9px] text-[#566359] pt-0.5">
                          <span>Salário Registrado</span>
                          <span className="text-[#D9532F] font-bold">{entry.exitReason || 'Desligamento'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 bg-[#fbf9f3] rounded-xl border border-[#ece9df] text-center text-[11px] text-[#566359]">
                  Nenhum emprego anterior registrado no histórico da Carteira de Trabalho.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full h-12 rounded-xl font-heading font-bold text-sm btn-tactile-primary cursor-pointer"
          >
            Fechar Documentos
          </button>
        </div>
      </div>
    </div>
  );
};
