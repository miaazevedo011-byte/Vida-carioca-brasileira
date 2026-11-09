import React from 'react';
import { X, Sparkles, CheckCircle2, Bookmark, Heart, Bell } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound, playSuccessSound } from '../utils/audio';
import { VERSION_FEATURES_DETAIL } from '../utils/versionService';

interface VersionWhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerTestNotice?: () => void;
  version?: string;
}

export const VersionWhatsNewModal: React.FC<VersionWhatsNewModalProps> = ({
  isOpen,
  onClose,
  onTriggerTestNotice,
  version = '2.5.0'
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    playSuccessSound();
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    onClose();
  };

  const handleTestNotice = () => {
    playClickSound();
    if (onTriggerTestNotice) {
      onTriggerTestNotice();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] bg-[#fdfbf6] text-[#3e2723] rounded-3xl border-2 border-[#d5be9f] shadow-[0_20px_50px_rgba(40,25,10,0.35)] flex flex-col overflow-hidden text-left">
        {/* Washi Tape Decorativa no Topo */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 -rotate-1 bg-gradient-to-r from-amber-200 via-emerald-200 to-amber-200 text-[#4e342e] text-[10px] font-mono px-8 py-0.5 shadow-xs border-x border-[#bcaaa4] font-bold tracking-widest uppercase select-none pointer-events-none z-10">
          ✂️ DIÁRIO DE VIDA • EDIÇÃO ESPECIAL v{version}
        </div>

        {/* Cabeçalho do Modal */}
        <div className="pt-6 sm:pt-7 px-5 sm:px-6 pb-4 border-b border-[#ebdcc9] bg-[#fbf7ed] relative">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f0e6d6] hover:bg-[#e4d4be] text-[#4e342e] flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
            title="Fechar"
            aria-label="Fechar modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl select-none">🎉</span>
            <div>
              <h2 id="modal-title" className="font-heading font-black text-lg sm:text-xl text-[#2a1708] tracking-tight">
                🎉 Novidades da Versão!
              </h2>
              <p className="text-xs text-[#6d4c41] font-medium mt-0.5">
                Seu diário artesanal foi atualizado com novos recursos incríveis de papelaria e rotina!
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Recursos Recém-Lançados (Grid Scrapbook Style) */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-3.5 pr-2 custom-scrollbar">
          <div className="p-3 bg-[#fffde7]/70 rounded-2xl border border-[#ffe082] flex items-start gap-2.5 shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-[#5d4037] leading-relaxed">
              Tudo pronto para deixar a vida do seu personagem mais rica, criativa e saborosa! Conheça cada uma das novas ferramentas:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VERSION_FEATURES_DETAIL.map((feat) => (
              <div
                key={feat.id}
                className="bg-[#ffffff] rounded-2xl p-3.5 border border-[#e8dbc7] hover:border-[#bcaaa4] shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group overflow-hidden"
              >
                {/* Mini detalhe de costura pontilhada */}
                <div className="absolute top-0 right-0 w-12 h-1 bg-gradient-to-r from-transparent to-[#d7ccc8]" />

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1.5 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xl shrink-0 p-1.5 rounded-xl bg-[#f8f5ee] border border-[#ebdcc9]">
                        {feat.icon}
                      </span>
                      <h3 className="font-heading font-bold text-xs sm:text-sm text-[#2e1d0f] leading-snug">
                        {feat.title}
                      </h3>
                    </div>
                  </div>

                  <span className={`inline-block text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border ${feat.washiTapeColor}`}>
                    {feat.tag}
                  </span>

                  <p className="text-[11px] text-[#5d4037] leading-relaxed pt-1">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dica de Acesso Rápido */}
          <div className="p-3 bg-[#f3ede1] rounded-2xl border border-[#ded1be] flex items-center justify-between gap-2 flex-wrap text-xs text-[#4e342e]">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#087F48] shrink-0" />
              <span className="text-[11px]">
                Acesse a qualquer momento em <strong>Configuração (Tempo ⚙️)</strong>!
              </span>
            </div>

            {onTriggerTestNotice && (
              <button
                type="button"
                onClick={handleTestNotice}
                className="px-2.5 py-1 rounded-xl bg-[#ffffff] hover:bg-[#faf6ee] text-[#4e342e] border border-[#cbb390] text-[10px] font-heading font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                title="Simular e testar o balão de aviso"
              >
                <Bell className="w-3 h-3 text-[#d97706]" />
                <span>Testar Aviso 🔔</span>
              </button>
            )}
          </div>
        </div>

        {/* Rodapé de Ação */}
        <div className="p-4 sm:p-5 border-t border-[#ebdcc9] bg-[#fbf7ed] flex items-center justify-between gap-3">
          <div className="text-[11px] text-[#795548] font-medium flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>Feito com carinho para o seu diário</span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 rounded-2xl bg-[#087F48] hover:bg-[#066438] active:scale-95 text-white font-heading font-black text-xs sm:text-sm shadow-[0_3px_0_#034325] transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>Entendido &amp; Começar a Usar! ✨</span>
          </button>
        </div>
      </div>
    </div>
  );
};
