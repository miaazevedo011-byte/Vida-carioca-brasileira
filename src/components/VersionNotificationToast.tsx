import React from 'react';
import { RefreshCw, Sparkles, X } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface VersionNotificationToastProps {
  isOpen: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
  version?: string;
}

export const VersionNotificationToast: React.FC<VersionNotificationToastProps> = ({
  isOpen,
  onUpdate,
  onDismiss,
  version = '2.5.0'
}) => {
  if (!isOpen) return null;

  const handleUpdateClick = () => {
    playClickSound();
    onUpdate();
  };

  const handleDismissClick = () => {
    playClickSound();
    onDismiss();
  };

  return (
    <aside
      aria-label="Notificação de Atualização do Diário"
      className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-lg animate-in slide-in-from-top-4 duration-300 pointer-events-auto"
    >
      {/* Balão Visual no estilo Papelaria Artesanal / Bullet Journal */}
      <div className="relative bg-[#fefcf3] text-[#3e2723] rounded-2xl p-3 sm:p-3.5 border-2 border-dashed border-[#cbb390] shadow-[0_12px_32px_rgba(78,54,34,0.18),0_2px_6px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Fita Washi Tape decorativa superior com efeito de colagem artesanal */}
        <div className="absolute -top-1.5 left-8 -rotate-2 bg-gradient-to-r from-[#ffe082]/90 via-[#c8e6c9]/90 to-[#ffd54f]/90 text-[#4e342e] text-[9px] font-mono px-4 py-0.5 shadow-xs border-x border-[#cbb390]/50 tracking-wider font-bold uppercase pointer-events-none select-none">
          ✂️ DIÁRIO DE VIDA • ATUALIZAÇÃO v{version}
        </div>

        {/* Segundo mini-adesivo washi tape no canto direito */}
        <div className="absolute -bottom-1.5 right-6 rotate-1 bg-[#ffecb3]/80 text-[#5d4037] text-[8px] font-mono px-3 py-0.5 border-x border-[#d7ccc8] pointer-events-none select-none">
          bullet journal 🌿
        </div>

        {/* Conteúdo Principal do Balão */}
        <div className="pt-2 sm:pt-1.5 flex items-center justify-between gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Ícone de Recarregamento e Texto Exato */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-xl bg-[#e8f5e9] border border-[#a5d6a7] shadow-xs flex items-center justify-center shrink-0">
              <RefreshCw className="w-4 h-4 text-[#1b5e20] animate-[spin_4s_linear_infinite]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-heading font-black text-xs sm:text-sm text-[#2e1d0f] tracking-tight">
                  Nova versão disponível!
                </span>
                <span className="hidden xs:inline-block text-[9px] bg-[#fff3e0] text-[#e65100] font-bold px-1.5 py-0.2 rounded border border-[#ffe082]">
                  Recursos Fresquinhos
                </span>
              </div>
              <p className="text-[10px] text-[#6d4c41] font-medium leading-tight truncate">
                Caderno de Receitas com IA, Washi Tapes, Post-its e mais!
              </p>
            </div>
          </div>

          {/* Botão Clicável Exato: [Clique aqui para atualizar] */}
          <div className="flex items-center gap-1.5 shrink-0 ml-auto sm:ml-0">
            <button
              type="button"
              onClick={handleUpdateClick}
              className="px-3.5 py-2 rounded-xl bg-[#087F48] hover:bg-[#066438] active:scale-95 text-white font-heading font-black text-xs sm:text-xs shadow-[0_3px_0_#034325] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap group"
              title="Clique para recarregar e conferir as novidades imediatamente!"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-200 group-hover:rotate-180 transition-transform duration-500" />
              <span>[Clique aqui para atualizar]</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </button>

            {/* Botão de Fechar / Dispensar temporariamente */}
            <button
              type="button"
              onClick={handleDismissClick}
              className="w-7 h-7 rounded-lg bg-[#efebe4] hover:bg-[#e4ded5] text-[#5d4037] text-xs font-bold flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Dispensar aviso por agora"
              aria-label="Dispensar aviso"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
