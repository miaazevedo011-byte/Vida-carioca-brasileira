import React, { useState } from 'react';
import { Finances, SerasaProfile, Debt, Character, Housing, Vehicle, Pet, Relationship, WillState, AdvancedWillState, CompanyState, FamilyState } from '../../types/game';
import { Wallet, ShieldCheck, ShieldAlert, TrendingUp, CreditCard, ArrowUpRight, ArrowDownLeft, Sparkles, CheckCircle2, Ticket, Landmark } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound } from '../../utils/audio';

interface BankTabProps {
  finances: Finances;
  serasa: SerasaProfile;
  checkingBalance: number;
  character: Character;
  housing: Housing;
  vehicle?: Vehicle;
  pet?: Pet;
  relationship: Relationship;
  will?: WillState;
  company?: CompanyState;
  family?: FamilyState;
  onDepositCDI: (amount: number) => void;
  onWithdrawCDI: (amount: number) => void;
  onPayDebt: (debt: Debt) => void;
  onPayCreditCard: () => void;
  onRequestCreditCard: (tier: 'Básico' | 'Gold' | 'Black', limit: number) => { success: boolean; message: string };
  onCancelCreditCard: () => { success: boolean; message: string };
  onPlayMegaSena: (numbers: number[]) => { matches: number[]; prize: number; drawnNumbers: number[] };
  onUpdateAdvancedWill?: (will: AdvancedWillState) => void;
}

export const BankTab: React.FC<BankTabProps> = ({
  finances,
  serasa,
  checkingBalance,
  character,
  housing,
  vehicle,
  onDepositCDI,
  onWithdrawCDI,
  onPayDebt,
  onPayCreditCard,
  onRequestCreditCard,
  onCancelCreditCard,
  onPlayMegaSena
}) => {
  const [bankSubTab, setBankSubTab] = useState<'contas' | 'sucessao'>('contas');
  const [cdiAmountInput, setCdiAmountInput] = useState('');
  const [lotterySelected, setLotterySelected] = useState<number[]>([]);
  const [lotteryResult, setLotteryResult] = useState<{
    matches: number[];
    prize: number;
    drawn: number[];
  } | null>(null);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [extratoModalOpen, setExtratoModalOpen] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const isNomeLimpo = (serasa?.score || 0) >= 500 && (serasa?.dividas || []).length === 0;

  const handleDeposit = () => {
    const val = Number(cdiAmountInput);
    if (!val || val <= 0 || val > checkingBalance) {
      setStatusNotice('Digite um valor válido até o seu saldo em conta.');
      return;
    }
    onDepositCDI(val);
    setCdiAmountInput('');
    setStatusNotice(`R$ ${val.toLocaleString('pt-BR')} guardados na Caixinha CDI!`);
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleWithdraw = () => {
    const val = Number(cdiAmountInput);
    if (!val || val <= 0 || val > finances.cdiBalance) {
      setStatusNotice('Digite um valor válido até o saldo da Caixinha.');
      return;
    }
    onWithdrawCDI(val);
    setCdiAmountInput('');
    setStatusNotice(`R$ ${val.toLocaleString('pt-BR')} resgatados para a conta corrente!`);
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleApplyCardTier = (tier: 'Básico' | 'Gold' | 'Black', limit: number) => {
    const res = onRequestCreditCard(tier, limit);
    setStatusNotice(res.message);
    setCardModalOpen(false);
    if (res.success) {
      confetti({ particleCount: 60, spread: 60 });
    }
    setTimeout(() => setStatusNotice(null), 4000);
  };

  const handleCancelCardClick = () => {
    const res = onCancelCreditCard();
    setStatusNotice(res.message);
    setTimeout(() => setStatusNotice(null), 4000);
  };

  const handleSurpresinha = () => {
    const randomSet = new Set<number>();
    while (randomSet.size < 6) {
      randomSet.add(Math.floor(Math.random() * 60) + 1);
    }
    setLotterySelected(Array.from(randomSet).sort((a, b) => a - b));
  };

  const handleDrawLottery = () => {
    if (lotterySelected.length !== 6) {
      setStatusNotice('Selecione exatamente 6 dezenas para apostar!');
      return;
    }
    if (checkingBalance < 5) {
      setStatusNotice('Saldo insuficiente para a aposta de R$ 5,00.');
      return;
    }
    const result = onPlayMegaSena(lotterySelected);
    setLotteryResult({
      matches: result.matches,
      prize: result.prize,
      drawn: result.drawnNumbers
    });
    if (result.prize > 0) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }
  };

  return (
    <div className="flex flex-col gap-4 text-left font-sans bg-[#F8F5EE] text-slate-900 p-1 rounded-3xl">
      {/* Sub-tab Navigation (Estilo Pílulas Tropical Quente) */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 gap-2 select-none shadow-[0_2px_0_#d8bd92]">
        <button
          type="button"
          onClick={() => { playClickSound(); setBankSubTab('contas'); }}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            bankSubTab === 'contas'
              ? 'bg-[#0CA768] text-white shadow-[0_3px_0_#076940]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-[#ebd9c1]'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>💳 Contas & Finanças</span>
        </button>

        <button
          type="button"
          onClick={() => { playClickSound(); setBankSubTab('sucessao'); }}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            bankSubTab === 'sucessao'
              ? 'bg-[#0CA768] text-white shadow-[0_3px_0_#076940]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-[#ebd9c1]'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>🏛️ Sucessão & Bens</span>
        </button>
      </div>

      {bankSubTab === 'contas' && (
        <>
          {/* Ticker Notícias Rápidas Mercado */}
          <div className="bg-slate-100 rounded-xl p-3 shadow-[0_2px_0_#d8bd92] border border-slate-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0CA768] animate-pulse"></span>
              <span className="text-[11px] text-slate-900 font-black uppercase tracking-wide">MERCADO 2031</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto text-[11px] text-slate-600 font-bold whitespace-nowrap">
              <span className="bg-[#F8F5EE] px-2 py-0.5 rounded-full text-slate-900">SELIC <strong className="text-emerald-600">10,75%</strong></span>
              <span className="bg-[#F8F5EE] px-2 py-0.5 rounded-full text-slate-900">IPCA <strong className="text-[#d97706]">3,80%</strong></span>
              <span className="bg-[#F8F5EE] px-2 py-0.5 rounded-full text-slate-900">USD <strong className="text-[#059669]">R$ 5,42</strong></span>
            </div>
          </div>

          {/* 1. Painel Superior: Conta Corrente Estilo Cofre Modular */}
          <div className="relative bg-[#fffdf7] rounded-2xl p-4 shadow-sm flex flex-col gap-3 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#ffe9c7] flex items-center justify-center text-emerald-600 shadow-[0_2px_0_#e2b266]">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#7c5c3b] uppercase tracking-wider font-extrabold">Conta Corrente Digital</span>
                  <span className="text-xs text-slate-900 font-black">Banco Pindorama S.A.</span>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e6f4ea] text-[#059669] shadow-[0_1.5px_0_#a8e0b9] font-black text-[10px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PIX ATIVO</span>
              </div>
            </div>

            <div className="flex flex-col gap-0.5 bg-[#fbf3e4] rounded-xl p-3.5 border border-[#eedcc1]">
              <span className="text-xs text-[#7c5c3b] flex items-center gap-1 font-bold">
                Saldo em Conta Disponível <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl text-slate-900 font-black tracking-tight">
                  R$ {checkingBalance.toLocaleString('pt-BR')}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#e6f4ea] text-[#059669] text-[10px] font-extrabold shrink-0 border border-[#b7e4c7]">Livre</span>
              </div>
              <span className="text-[11px] text-[#7c5c3b] font-medium mt-1">Disponível para uso imediato em transferências, boletos e compras</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  playClickSound();
                  setStatusNotice('Atalho PIX: Informe a chave de destino para transferir.');
                  setTimeout(() => setStatusNotice(null), 3000);
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#0CA768] text-white font-bold text-xs shadow-[0_3.5px_0_#cc6e00] active:translate-y-0.5 transition-all cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>↗ Fazer PIX</span>
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  setExtratoModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-900 border border-slate-200 font-bold text-xs shadow-[0_3.5px_0_#d8bd92] active:translate-y-0.5 transition-all cursor-pointer"
              >
                <TrendingUp className="w-4 h-4" />
                <span>📜 Extrato</span>
              </button>
            </div>
          </div>

          {/* 2. Caixinha 100% CDI & Movimentação Interativa */}
          <div className="bg-[#fffdf7] rounded-2xl p-4 shadow-sm flex flex-col gap-3 border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#e6f4ea] flex items-center justify-center text-[#059669] shadow-[0_2px_0_#a8e0b9]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900">Reserva de Emergência</span>
                  <span className="text-[11px] text-[#7c5c3b]">Caixinha Liquidez Diária</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#059669] font-extrabold text-[10px] uppercase border border-[#b7e4c7]">~10.5% A.A.</span>
            </div>

            <div className="flex flex-col gap-2 bg-[#fbf3e4] rounded-xl p-3.5 border border-[#eedcc1]">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#7c5c3b] font-bold block">Saldo Acumulado</span>
                  <span className="text-xl text-slate-900 font-black tracking-tight">
                    R$ {finances.cdiBalance.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#059669] font-extrabold block">
                    +R$ {Math.round(finances.cdiBalance * (0.105 / 12)).toLocaleString('pt-BR')}/mês
                  </span>
                  <span className="text-[10px] text-[#7c5c3b] font-medium">Rendimento líquido</span>
                </div>
              </div>

              {/* Sparkline SVG de Evolução */}
              <div className="w-full pt-2 flex items-end justify-between gap-1 h-9">
                <div className="flex-1 bg-[#0CA768]/20 rounded-t-sm h-3"></div>
                <div className="flex-1 bg-[#0CA768]/25 rounded-t-sm h-4"></div>
                <div className="flex-1 bg-[#0CA768]/30 rounded-t-sm h-4"></div>
                <div className="flex-1 bg-[#0CA768]/40 rounded-t-sm h-5"></div>
                <div className="flex-1 bg-[#0CA768]/50 rounded-t-sm h-6"></div>
                <div className="flex-1 bg-[#0CA768]/60 rounded-t-sm h-6"></div>
                <div className="flex-1 bg-[#0CA768]/75 rounded-t-sm h-7"></div>
                <div className="flex-1 bg-[#0CA768] rounded-t-sm h-8 shadow-[0_2px_0_#cc6e00]"></div>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-[#7c5c3b] font-bold">Histórico últimos 8 ciclos</span>
                <button
                  type="button"
                  onClick={() => { playClickSound(); setExtratoModalOpen(true); }}
                  className="text-[10px] text-emerald-600 font-black hover:underline cursor-pointer"
                >
                  Ver Extrato & Rendimentos →
                </button>
              </div>
            </div>

            {/* Caixa de Movimentação Rápida */}
            <div className="flex flex-col gap-2 bg-slate-100 rounded-xl p-3 border border-slate-200">
              <span className="text-xs text-slate-900 font-bold">Movimentação Instantânea</span>
              <div className="flex items-center gap-2 bg-[#fffdf7] rounded-xl px-3 py-2 border border-slate-200">
                <span className="text-xs text-[#7c5c3b] font-bold">R$</span>
                <input
                  type="number"
                  value={cdiAmountInput}
                  onChange={(e) => setCdiAmountInput(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-transparent text-sm text-slate-900 font-black outline-none"
                />
                <button
                  type="button"
                  onClick={() => setCdiAmountInput(checkingBalance.toString())}
                  className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-extrabold text-slate-900 hover:bg-[#eedcc1] cursor-pointer"
                >
                  Max
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleDeposit}
                  className="py-2.5 rounded-xl bg-[#0CA768] text-white font-bold text-xs shadow-[0_3.5px_0_#cc6e00] active:translate-y-0.5 flex items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  <ArrowDownLeft className="w-4 h-4" /> ↙ Guardar
                </button>
                <button
                  onClick={handleWithdraw}
                  className="py-2.5 rounded-xl bg-[#fffdf7] text-slate-900 border border-slate-200 font-bold text-xs shadow-[0_3.5px_0_#d8bd92] active:translate-y-0.5 flex items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  <ArrowUpRight className="w-4 h-4" /> ↗ Resgatar
                </button>
              </div>
            </div>

            {statusNotice && (
              <p className="text-xs font-bold text-slate-900 bg-[#fff3d6] p-2.5 rounded-xl border border-[#ff9f1c]">
                {statusNotice}
              </p>
            )}
          </div>

          {/* 3. CDB com Prazo Fechado & Taxa Real */}
          <div className="flex flex-col gap-3 bg-[#fffdf7] rounded-2xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-black text-slate-900">CDBs a Prazo Fechado</span>
              </div>
              <span className="text-[10px] text-[#7c5c3b] font-bold">3 opções disponíveis</span>
            </div>

            <div className="bg-[#fff5e0] rounded-xl p-3 border border-[#ff9f1c]/40 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#0CA768] flex items-center justify-center text-white shrink-0 shadow-[0_2px_0_#cc6e00]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-black text-slate-900 uppercase">📉 INFLAÇÃO VIGENTE: 4,5% A.A.</span>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                  Dinheiro parado na conta perde poder de compra. Trave rentabilidade acima do CDI garantida pelo FGC!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <div className="bg-[#fffdf7] rounded-xl p-3 border border-slate-200 shadow-[0_2px_0_#e8d5b7] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex flex-col items-center justify-center text-slate-900 shrink-0 font-extrabold">
                    <span className="text-xs font-black">1</span>
                    <span className="text-[8px] uppercase">Ano</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900">CDB 1 Ano</span>
                      <span className="px-1.5 py-0.2 rounded bg-[#e6f4ea] text-[#059669] text-[10px] font-extrabold">110% CDI</span>
                    </div>
                    <span className="text-[11px] text-[#7c5c3b]">Carência 12 meses • Mín. R$ 500</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    if (checkingBalance < 500) {
                      setStatusNotice('Saldo insuficiente para aplicar no CDB 1 Ano (Mínimo R$ 500).');
                      return;
                    }
                    setStatusNotice('Aplicação no CDB 1 Ano (110% CDI) confirmada!');
                    confetti({ particleCount: 40, spread: 60 });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#0CA768] text-white text-xs font-bold shadow-[0_2.5px_0_#cc6e00] active:translate-y-0.5 shrink-0 cursor-pointer"
                >
                  Aplicar
                </button>
              </div>

              <div className="bg-[#fffdf7] rounded-xl p-3 border border-slate-200 shadow-[0_2px_0_#e8d5b7] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex flex-col items-center justify-center text-slate-900 shrink-0 font-extrabold">
                    <span className="text-xs font-black">2</span>
                    <span className="text-[8px] uppercase">Anos</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900">CDB 2 Anos</span>
                      <span className="px-1.5 py-0.2 rounded bg-[#e6f4ea] text-[#059669] text-[10px] font-extrabold">120% CDI</span>
                    </div>
                    <span className="text-[11px] text-[#7c5c3b]">Carência 24 meses • Mín. R$ 1.000</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    if (checkingBalance < 1000) {
                      setStatusNotice('Saldo insuficiente para aplicar no CDB 2 Anos (Mínimo R$ 1.000).');
                      return;
                    }
                    setStatusNotice('Aplicação no CDB 2 Anos (120% CDI) confirmada!');
                    confetti({ particleCount: 40, spread: 60 });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#0CA768] text-white text-xs font-bold shadow-[0_2.5px_0_#cc6e00] active:translate-y-0.5 shrink-0 cursor-pointer"
                >
                  Aplicar
                </button>
              </div>

              <div className="bg-[#fff5e0] rounded-xl p-3 border-2 border-[#ff9f1c] shadow-[0_3px_0_#076940] flex items-center justify-between gap-2 relative overflow-hidden">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#0CA768] flex flex-col items-center justify-center text-white shadow-[0_2px_0_#cc6e00] shrink-0 font-extrabold">
                    <span className="text-xs font-black">3</span>
                    <span className="text-[8px] uppercase font-extrabold">Anos</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900">CDB 3 Anos</span>
                      <span className="px-1.5 py-0.2 rounded bg-[#0CA768] text-white text-[10px] font-black">130% CDI ★</span>
                    </div>
                    <span className="text-[11px] text-[#7c5c3b] font-medium">Carência 36 meses • Mín. R$ 2.000</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    if (checkingBalance < 2000) {
                      setStatusNotice('Saldo insuficiente para aplicar no CDB 3 Anos (Mínimo R$ 2.000).');
                      return;
                    }
                    setStatusNotice('Aplicação no CDB 3 Anos Ouro (130% CDI) realizada com sucesso!');
                    confetti({ particleCount: 60, spread: 70 });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#0CA768] text-white text-xs font-bold shadow-[0_3px_0_#076940] active:translate-y-0.5 shrink-0 cursor-pointer"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>

          {/* 4. Cartão Tropical Black (Visual Físico Noturno) */}
          <div className="bg-[#fffdf7] rounded-2xl p-4 shadow-sm flex flex-col gap-3 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-black text-slate-900">Cartão Tropical Black</span>
              </div>
              {finances.creditCardLimit > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-[#e6f4ea] text-[#059669] text-[10px] font-black border border-[#b7e4c7]">
                  ATIVO ({finances.creditCard?.tier || 'Básico'})
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[#7c5c3b] text-[10px] font-bold">
                  Sem Cartão Ativo
                </span>
              )}
            </div>

            {/* Representação Física do Cartão */}
            <div className="relative w-full h-44 rounded-2xl bg-gradient-to-br from-[#382618] via-[#2d1e12] to-[#1c120a] text-white p-4 shadow-lg border border-[#5c4028] flex flex-col justify-between overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-[#0CA768]/20 blur-xl pointer-events-none"></div>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-6 rounded bg-amber-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] flex items-center justify-center font-bold text-[9px] text-slate-900">
                    CHIP
                  </div>
                  <span className="text-xs text-amber-200/80">📡 contactless</span>
                </div>
                <span className="text-xs font-black tracking-widest text-emerald-600">VR BRASIL</span>
              </div>
              <div className="flex flex-col gap-1 relative z-10">
                <span className="text-[10px] text-amber-200/70 tracking-widest uppercase font-bold">
                  {finances.creditCardLimit > 0 ? `LIMITE: R$ ${finances.creditCardLimit.toLocaleString('pt-BR')}` : 'Cartão Não Emitido'}
                </span>
                <span className="text-base tracking-widest font-mono">•••• •••• •••• 8821</span>
              </div>
              <div className="flex items-center justify-between text-amber-100/70 relative z-10">
                <span className="text-xs font-extrabold uppercase">{character.name}</span>
                <span className="text-xs font-bold text-emerald-600">SCORE: {serasa.score}</span>
              </div>
            </div>

            {finances.creditCardLimit > 0 ? (
              <div className="flex flex-col gap-2 bg-slate-100 rounded-xl p-3 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-900 font-bold">Fatura Atual do Mês:</span>
                  <span className="text-sm text-rose-700 font-black">R$ {finances.creditCardUsed.toLocaleString('pt-BR')}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={onPayCreditCard}
                    disabled={finances.creditCardUsed <= 0 || checkingBalance < finances.creditCardUsed}
                    className="py-2.5 rounded-xl bg-[#0CA768] text-white font-bold text-xs shadow-[0_3px_0_#076940] active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
                  >
                    Pagar Fatura Total
                  </button>
                  <button
                    onClick={handleCancelCardClick}
                    className="py-2.5 rounded-xl bg-rose-100 text-rose-900 border border-rose-300 font-bold text-xs shadow-[0_3px_0_#e59898] active:translate-y-0.5 cursor-pointer"
                  >
                    Cancelar Cartão
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 bg-slate-100 rounded-xl p-3 border border-slate-200">
                <div className="flex items-center gap-1 text-emerald-600">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-extrabold text-slate-900">Pontuação Serasa Elegível</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Você tem perfil qualificado para limite inicial de até <strong>R$ 35.000</strong> com cashback direto na conta e anuidade zero vitalícia.
                </p>
                <button
                  onClick={() => setCardModalOpen(true)}
                  className="w-full py-3 rounded-xl bg-[#0CA768] text-white font-bold text-xs shadow-[0_4px_0_#cc6e00] active:translate-y-1 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>💳 Solicitar Cartão (+ Análise Serasa)</span>
                </button>
              </div>
            )}
          </div>

          {/* 5. Compromissos Fixos do Mês */}
          <div className="bg-[#fffdf7] rounded-2xl p-4 shadow-sm flex flex-col gap-3 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-slate-900">Compromissos Fixos</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[#7c5c3b] text-[10px] font-extrabold border border-slate-200">
                ⚡ Débito Anual
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-3 bg-slate-100 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F8F5EE] flex items-center justify-center text-lg">
                    🏡
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">{housing.name}</span>
                    <span className="text-[11px] text-[#7c5c3b]">R$ {housing.monthlyCost.toLocaleString('pt-BR')}/mês</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-900">R$ {(housing.monthlyCost * 12).toLocaleString('pt-BR')}/ano</span>
                  <span className="text-[10px] text-[#059669] block font-bold">Em dia</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-100 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F8F5EE] flex items-center justify-center text-lg">
                    💡
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">Energia Elétrica & Luz</span>
                    <span className="text-[11px] text-[#7c5c3b]">Tarifa residencial</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-900">
                    R$ {(housing.monthlyCost > 0 ? Math.round(housing.monthlyCost * 0.25 * 12) : 1800).toLocaleString('pt-BR')}/ano
                  </span>
                  <span className="text-[10px] text-[#059669] block font-bold">Em dia</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[#7c5c3b] text-xs font-bold border-t border-slate-200">
              <span>Custo de Vida Anual Estimado:</span>
              <span className="text-slate-900 font-black text-sm">
                R$ {((housing.monthlyCost * 12) + (housing.monthlyCost > 0 ? Math.round(housing.monthlyCost * 0.25 * 12) : 1800)).toLocaleString('pt-BR')} / ano
              </span>
            </div>
          </div>

          {/* 6. Serasa Experian & Limpa Nome */}
          <div className="bg-[#fffdf7] rounded-2xl p-4 shadow-sm flex flex-col gap-3 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                {isNomeLimpo ? (
                  <ShieldCheck className="w-6 h-6 text-[#059669]" />
                ) : (
                  <ShieldAlert className="w-6 h-6 text-rose-600" />
                )}
                <div>
                  <h4 className="text-sm font-black text-slate-900">Serasa Experian • Cadastro Positivo</h4>
                  <p className="text-[11px] text-[#7c5c3b]">Score de crédito para financiamentos e cartões</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-slate-900">{serasa.score}</span>
                <span className="text-[10px] text-[#7c5c3b] block font-bold">de 1000 pts</span>
              </div>
            </div>

            {serasa.dividas.length > 0 ? (
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-rose-100 text-rose-900 border border-rose-300 text-xs font-bold flex items-center justify-between">
                  <span>Pendências ativas no Serasa Limpa Nome!</span>
                  <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black uppercase">Até 90% OFF</span>
                </div>
                {serasa.dividas.map((debt) => (
                  <div key={debt.id} className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-black text-slate-900">{debt.credor}</h5>
                      <span className="text-[11px] text-[#7c5c3b] block">{debt.tipo}</span>
                      <span className="text-xs font-black text-[#059669] block mt-0.5">
                        R$ {debt.valorNegociado.toLocaleString('pt-BR')} no PIX
                      </span>
                    </div>
                    <button
                      onClick={() => onPayDebt(debt)}
                      disabled={checkingBalance < debt.valorNegociado}
                      className="px-3 py-2 rounded-xl bg-[#0CA768] text-white font-bold text-xs shadow-[0_2.5px_0_#cc6e00] active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
                    >
                      Quitar Dívida
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-[#e6f4ea] text-[#059669] rounded-xl font-extrabold text-xs flex items-center gap-2 border border-[#b7e4c7]">
                <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                <span>Nenhuma pendência financeira em seu CPF. Cadastro limpo com crédito aprovado!</span>
              </div>
            )}
          </div>

          {/* 7. Loteria Federal Mega-Sena */}
          <div className="bg-[#fffdf7] rounded-2xl p-4 shadow-sm flex flex-col gap-3 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-black text-slate-900">Mega-Sena Tropical Caixa</h4>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-extrabold text-[#7c5c3b]">Aposta: R$ 5,00</span>
            </div>

            <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">Seus Números:</span>
                {lotterySelected.length === 0 ? (
                  <span className="text-xs text-[#7c5c3b] italic">Nenhum escolhido</span>
                ) : (
                  <div className="flex gap-1">
                    {lotterySelected.map((num) => (
                      <span key={num} className="w-6 h-6 rounded-full bg-[#0CA768] text-white text-[11px] font-black flex items-center justify-center">
                        {num.toString().padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleSurpresinha}
                className="text-xs text-emerald-600 font-black hover:underline cursor-pointer"
              >
                🎲 Surpresinha
              </button>
            </div>

            <button
              onClick={handleDrawLottery}
              disabled={lotterySelected.length !== 6 || checkingBalance < 5}
              className="w-full py-3 rounded-xl bg-[#0CA768] text-white font-bold text-xs shadow-[0_3.5px_0_#cc6e00] active:translate-y-1 disabled:opacity-50 cursor-pointer transition-all"
            >
              Registrar Aposta & Sortear Agora (R$ 5,00)
            </button>

            {lotteryResult && (
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-900 block">Dezenas Sorteadas no Globo:</span>
                <div className="flex flex-wrap gap-1.5">
                  {lotteryResult.drawn.map((num) => {
                    const isMatch = lotteryResult.matches.includes(num);
                    return (
                      <span
                        key={num}
                        className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center ${
                          isMatch ? 'bg-[#0CA768] text-white ring-2 ring-[#ffd166] scale-110' : 'bg-[#fffdf7] text-slate-900 border border-slate-200'
                        }`}
                      >
                        {num.toString().padStart(2, '0')}
                      </span>
                    );
                  })}
                </div>
                <span className="text-xs font-extrabold text-[#059669] block mt-1">
                  Acertos: {lotteryResult.matches.length} • Prêmio: R$ {lotteryResult.prize.toLocaleString('pt-BR')}
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {/* SUBTAB 2: SUCESSÃO FAMILIAR & TESTAMENTO */}
      {bankSubTab === 'sucessao' && (
        <div className="bg-[#fffdf7] rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-emerald-600" />
              <h4 className="text-sm font-black text-slate-900">Direito Sucessório & Herança</h4>
            </div>
            <span className="text-xs font-bold text-[#7c5c3b]">Ano {character.year}</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Organize em vida a partilha de seus bens, imóveis, investimentos e empresas para os seus herdeiros com registro em cartório.
          </p>

          <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 space-y-1">
            <span className="text-xs font-extrabold text-slate-900 block">Patrimônio Declarado:</span>
            <span className="text-2xl text-emerald-600 font-black block">
              R$ {(checkingBalance + finances.cdiBalance + housing.propertyValue + (vehicle?.value || 0)).toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      )}

      {/* Credit Card Tier Request Modal */}
      {cardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#fffdf7] rounded-3xl p-5 border border-slate-200 max-w-sm w-full shadow-2xl space-y-3">
            <h3 className="text-base font-black text-slate-900">Solicitar Cartão de Crédito</h3>
            <p className="text-xs text-slate-600">
              Seu Serasa Score atual é de <strong>{serasa.score} pontos</strong>. Escolha a modalidade desejada:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleApplyCardTier('Básico', 800)}
                className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-100 hover:border-[#ff9f1c] text-left transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Cartão Básico</span>
                  <span className="text-xs font-black text-emerald-600">Limite R$ 800</span>
                </div>
                <span className="text-[11px] text-[#7c5c3b]">Score mínimo: 450</span>
              </button>

              <button
                onClick={() => handleApplyCardTier('Gold', 3500)}
                className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-100 hover:border-[#ff9f1c] text-left transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Cartão Gold</span>
                  <span className="text-xs font-black text-emerald-600">Limite R$ 3.500</span>
                </div>
                <span className="text-[11px] text-[#7c5c3b]">Score mínimo: 650</span>
              </button>

              <button
                onClick={() => handleApplyCardTier('Black', 15000)}
                className="w-full p-3 rounded-2xl border border-[#ff9f1c] bg-[#fff3d6] hover:bg-[#ffeac2] text-left transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">Cartão Black Tropical</span>
                  <span className="text-xs font-black text-emerald-600">Limite R$ 15.000</span>
                </div>
                <span className="text-[11px] text-[#7c5c3b]">Score mínimo: 750</span>
              </button>
            </div>

            <button
              onClick={() => setCardModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-900 font-bold text-xs border border-slate-200 cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
