import React, { useState } from 'react';
import { CreditCard, Wallet, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { playClickSound, playSuccessSound, playErrorSound } from '../utils/audio';

interface PurchasePaymentModalProps {
  isOpen: boolean;
  title: string;
  cost: number;
  cashBalance: number;
  creditCardLimit: number;
  creditCardUsed: number;
  hasCreditCard: boolean;
  onClose: () => void;
  onConfirm: (method: 'vista' | 'cartao') => void;
}

export const PurchasePaymentModal: React.FC<PurchasePaymentModalProps> = ({
  isOpen,
  title,
  cost,
  cashBalance,
  creditCardLimit,
  creditCardUsed,
  hasCreditCard,
  onClose,
  onConfirm
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'vista' | 'cartao'>('vista');

  if (!isOpen) return null;

  const availableCredit = hasCreditCard ? Math.max(0, creditCardLimit - creditCardUsed) : 0;
  const canAffordCash = cashBalance >= cost;
  const canAffordCredit = availableCredit >= cost;

  const handleConfirm = () => {
    if (selectedMethod === 'vista' && !canAffordCash) {
      playErrorSound();
      return;
    }
    if (selectedMethod === 'cartao' && !canAffordCredit) {
      playErrorSound();
      return;
    }
    playSuccessSound();
    onConfirm(selectedMethod);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#fffdf7] dark:bg-slate-900 border-2 border-amber-500 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative space-y-4 text-slate-900 dark:text-slate-100">
        <button
          onClick={() => { playClickSound(); onClose(); }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2.5 py-0.5 rounded-full inline-block">
            Pagamento &gt; R$ 500
          </span>
          <h3 className="font-heading font-black text-lg sm:text-xl text-slate-900 dark:text-white">
            Forma de Pagamento
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Você está adquirindo: <strong className="text-slate-900 dark:text-white">{title}</strong> no valor de <strong className="text-emerald-600 dark:text-emerald-400">R$ {cost.toLocaleString('pt-BR')}</strong>.
          </p>
        </div>

        {/* Opções de Pagamento */}
        <div className="space-y-3 pt-2">
          {/* À VISTA */}
          <button
            type="button"
            onClick={() => { playClickSound(); setSelectedMethod('vista'); }}
            className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
              selectedMethod === 'vista'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-md'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                selectedMethod === 'vista' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm block">💵 À Vista (Débito / Saldo em Conta)</span>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Saldo disponível: <strong className={canAffordCash ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>R$ {cashBalance.toLocaleString('pt-BR')}</strong>
                </span>
              </div>
            </div>
            {selectedMethod === 'vista' && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
          </button>

          {/* CARTÃO DE CRÉDITO */}
          <button
            type="button"
            onClick={() => { playClickSound(); setSelectedMethod('cartao'); }}
            className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
              selectedMethod === 'cartao'
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-md'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                selectedMethod === 'cartao' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm block">💳 Cartão de Crédito</span>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {hasCreditCard ? (
                    <>Limite disponível: <strong className={canAffordCredit ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400'}>R$ {availableCredit.toLocaleString('pt-BR')}</strong></>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 font-bold">Sem cartão cadastrado</span>
                  )}
                </span>
              </div>
            </div>
            {selectedMethod === 'cartao' && <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />}
          </button>
        </div>

        {/* Informações se o método selecionado for insuficiente */}
        {selectedMethod === 'vista' && !canAffordCash && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Saldo em conta insuficiente para pagar R$ {cost.toLocaleString('pt-BR')} à vista.</span>
          </div>
        )}

        {selectedMethod === 'cartao' && !canAffordCredit && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{hasCreditCard ? `Limite do cartão de crédito insuficiente (R$ ${availableCredit.toLocaleString('pt-BR')} disp.).` : 'Você precisa ativar a função Cartão de Crédito no Banco.'}</span>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => { playClickSound(); onClose(); }}
            className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={(selectedMethod === 'vista' && !canAffordCash) || (selectedMethod === 'cartao' && !canAffordCredit)}
            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
          >
            Confirmar Pagamento
          </button>
        </div>
      </div>
    </div>
  );
};
