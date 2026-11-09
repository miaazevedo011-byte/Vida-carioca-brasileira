import React from 'react';
import { InventoryItem, Stats } from '../types/game';
import { Package, Sparkles, Zap, Heart, Activity, Brain } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  stats: Stats;
  onUseItem: (itemId: string) => { success: boolean; message: string };
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  inventory = [],
  stats,
  onUseItem
}) => {
  if (!isOpen) return null;

  const totalItemCount = inventory.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in font-sans text-slate-900 text-left">
      <div className="bg-[#fffdf7] border-2 border-emerald-500 max-w-lg w-full rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto relative">
        <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shrink-0 border border-emerald-300">
              🎒
            </div>
            <div>
              <h3 className="font-heading font-black text-base text-slate-900">
                Mochila de Inventário ({totalItemCount} itens)
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Itens comprados no marketplace ou conquistados em dilemas de vida
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { playClickSound(); onClose(); }}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 font-bold text-xs flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {inventory.length === 0 ? (
          <div className="py-10 text-center space-y-2 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <Package className="w-12 h-12 text-slate-400 mx-auto" />
            <h4 className="font-bold text-sm text-slate-700">Mochila Vazia</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Compre consumíveis no Marketplace Online ou ganhe prêmios em dilemas e eventos para usar quando precisar!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {inventory.map((item) => {
              const hasEffects = Object.keys(item.effects).length > 0;
              return (
                <div
                  key={item.id}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 hover:border-emerald-300 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-2xl flex items-center justify-center shrink-0 border border-emerald-200 shadow-inner">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-xs text-slate-900 truncate">{item.name}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-black text-[10px] shrink-0 border border-slate-300">
                          x{item.quantity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{item.description}</p>
                      
                      {/* STAT DELTAS DISPLAY */}
                      {hasEffects && (
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-bold">
                          {item.effects.energia && (
                            <span className="text-cyan-700 flex items-center gap-0.5">
                              <Zap className="w-3 h-3 text-cyan-600 fill-current" />
                              +{item.effects.energia}% Energia
                            </span>
                          )}
                          {item.effects.felicidade && (
                            <span className="text-amber-700 flex items-center gap-0.5">
                              <Heart className="w-3 h-3 text-amber-600 fill-current" />
                              +{item.effects.felicidade}% Feliz
                            </span>
                          )}
                          {item.effects.saudeMental && (
                            <span className="text-indigo-700 flex items-center gap-0.5">
                              <Brain className="w-3 h-3 text-indigo-600 fill-current" />
                              +{item.effects.saudeMental}% Saúde Mental
                            </span>
                          )}
                          {item.effects.saude && (
                            <span className="text-emerald-700 flex items-center gap-0.5">
                              <Activity className="w-3 h-3 text-emerald-600" />
                              +{item.effects.saude}% Saúde
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {item.category === 'consumavel' || item.category === 'saude' ? (
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        const res = onUseItem(item.id);
                        if (res.success) {
                          playSuccessSound();
                          confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md hover:bg-emerald-700 active:translate-y-0.5 transition-all shrink-0 cursor-pointer font-heading flex items-center gap-1"
                    >
                      <span>Usar Item</span>
                      <Sparkles className="w-3.5 h-3.5 text-emerald-200 fill-current" />
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-500 font-bold text-[10px] shrink-0">
                      Colecionável
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={() => { playClickSound(); onClose(); }}
            className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer"
          >
            Fechar Mochila
          </button>
        </div>
      </div>
    </div>
  );
};
