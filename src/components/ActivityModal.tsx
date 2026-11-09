import React, { useState } from 'react';
import { Activity } from '../data/activities';
import { Stats, Relationship } from '../types/game';
import { Sparkles, Heart, Users, Compass, CheckCircle2, Car, Train, X, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound, playSuccessSound, playErrorSound } from '../utils/audio';

interface ActivityModalProps {
  activity: Activity;
  stats: Stats;
  relationship: Relationship;
  onClose: () => void;
  onConfirm: (activity: Activity, companionType: string, transport: string, finalCost: number) => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  activity,
  stats,
  relationship,
  onClose,
  onConfirm
}) => {
  const [companion, setCompanion] = useState<'solo' | 'patricia' | 'amigos' | 'pais'>('patricia');
  const [transport, setTransport] = useState<'van' | 'metro' | 'uber'>('van');

  let multiplier = 1.0;
  if (companion === 'patricia') multiplier = 1.5;
  else if (companion === 'amigos') multiplier = 1.2;
  else if (companion === 'pais') multiplier = 1.4;
  else if (companion === 'solo') multiplier = 0.8;

  let transportCost = 40;
  if (transport === 'metro') transportCost = 10;
  else if (transport === 'uber') transportCost = 65;

  const baseCost = activity.cost > 0 ? activity.cost : 50;
  const finalCost = Math.round(baseCost * multiplier + transportCost);
  const canAfford = stats.grana >= finalCost;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col relative text-slate-800">
        {/* Top Studs Decorativos */}
        <div className="w-full bg-slate-100 py-2 flex items-center justify-center gap-3 border-b border-slate-200">
          <div className="w-6 h-2 rounded-full bg-slate-300 shadow-inner"></div>
          <div className="w-6 h-2 rounded-full bg-slate-300 shadow-inner"></div>
          <div className="w-6 h-2 rounded-full bg-slate-300 shadow-inner"></div>
          <div className="w-6 h-2 rounded-full bg-slate-300 shadow-inner"></div>
        </div>

        {/* Cabeçalho do Modal */}
        <div className="p-5 flex items-center justify-between border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm font-bold text-xl">
              {activity.icon}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-700">Planejamento de Rolê</span>
              <h2 className="text-base font-bold text-slate-900">Confirmar Atividade & Companhia</h2>
            </div>
          </div>
          <button
            onClick={() => { playClickSound(); onClose(); }}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[70vh] no-scrollbar">
          {/* Card da Atividade Selecionada */}
          <div className="w-full bg-slate-50 rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col gap-2.5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                {activity.category.toUpperCase()} • ROLÊ BRASIL
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                +{activity.effects.felicidade || 15}% Felicidade
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">{activity.name}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">{activity.description}</p>
          </div>

          {/* Seletor de Acompanhantes */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Quem vai com você?</span>
            
            {/* Sozinho */}
            <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              companion === 'solo' ? 'bg-emerald-50 border-emerald-500 shadow-sm' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <input type="radio" name="companion" checked={companion === 'solo'} onChange={() => { playClickSound(); setCompanion('solo'); }} className="accent-emerald-600" />
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Ir Sozinho (Momento Zen)</span>
                  <span className="text-[10px] text-slate-500">Ritmo próprio • +15% Energia</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700">R$ {Math.round(baseCost * 0.8)}</span>
            </label>

            {/* Patrícia */}
            {relationship.status !== 'solteiro' && relationship.partnerName && (
              <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                companion === 'patricia' ? 'bg-emerald-50 border-emerald-500 shadow-sm' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center gap-2.5">
                  <input type="radio" name="companion" checked={companion === 'patricia'} onChange={() => { playClickSound(); setCompanion('patricia'); }} className="accent-emerald-600" />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Com {relationship.partnerName} ♥</span>
                    <span className="text-[10px] text-emerald-700 font-bold">Romance • +35 Afeto de Casal</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700">R$ {Math.round(baseCost * 1.5)}</span>
              </label>
            )}

            {/* Amigos */}
            <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              companion === 'amigos' ? 'bg-emerald-50 border-emerald-500 shadow-sm' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <input type="radio" name="companion" checked={companion === 'amigos'} onChange={() => { playClickSound(); setCompanion('amigos'); }} className="accent-emerald-600" />
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Bonde dos Amigos do Bairro</span>
                  <span className="text-[10px] text-slate-500">Zoeira & Rateio • +30 Social</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700">R$ {Math.round(baseCost * 1.2)}</span>
            </label>

            {/* Pais */}
            <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              companion === 'pais' ? 'bg-emerald-50 border-emerald-500 shadow-sm' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <input type="radio" name="companion" checked={companion === 'pais'} onChange={() => { playClickSound(); setCompanion('pais'); }} className="accent-emerald-600" />
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Levar os Pais</span>
                  <span className="text-[10px] text-slate-500">Aconchego familiar • +40 Afeto Pais</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700">R$ {Math.round(baseCost * 1.4)}</span>
            </label>
          </div>

          {/* Seletor de Transporte */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Logística & Transporte</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { playClickSound(); setTransport('van'); }}
                className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  transport === 'van' ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm' : 'bg-white text-slate-800 border-slate-200'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Van (R$ 40)</span>
              </button>
              <button
                type="button"
                onClick={() => { playClickSound(); setTransport('metro'); }}
                className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  transport === 'metro' ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm' : 'bg-white text-slate-800 border-slate-200'
                }`}
              >
                <Train className="w-4 h-4" />
                <span>Metrô (R$ 10)</span>
              </button>
              <button
                type="button"
                onClick={() => { playClickSound(); setTransport('uber'); }}
                className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  transport === 'uber' ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm' : 'bg-white text-slate-800 border-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Uber (R$ 65)</span>
              </button>
            </div>
          </div>

          {/* Resumo Financeiro */}
          <div className="bg-slate-100 rounded-2xl p-3.5 flex items-center justify-between border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xl">💰</span>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">Custo Total (Ingresso + Acompanhante + Transporte)</span>
                <span className="text-sm font-bold text-slate-900">R$ {finalCost.toLocaleString('pt-BR')}</span>
              </div>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              canAfford ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {canAfford ? 'Saldo OK ✅' : 'Saldo Insuficiente ❌'}
            </span>
          </div>
        </div>

        {/* Rodapé / CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-2">
          <button
            type="button"
            disabled={!canAfford}
            onClick={() => {
              playSuccessSound();
              onConfirm(activity, companion, transport, finalCost);
            }}
            className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm shadow-sm active:translate-y-0.5 disabled:opacity-50 cursor-pointer transition-all flex items-center justify-center gap-2"
            style={{ backgroundColor: '#0CA768', boxShadow: '0 3px 0 0 #076940', border: '1px solid #0CA768' }}
          >
            <Flame className="w-4 h-4 fill-current text-white" />
            <span>Confirmar e Curtir Rolê! (R$ {finalCost.toLocaleString('pt-BR')})</span>
          </button>
          <button
            type="button"
            onClick={() => { playClickSound(); onClose(); }}
            className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};
