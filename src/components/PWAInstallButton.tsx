import React, { useState } from 'react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { Download, Smartphone, Check, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  return (
    <>
      {isInstallable && (
        <button
          type="button"
          onClick={() => {
            playClickSound();
            install();
          }}
          className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-[#087F48] hover:bg-[#006437] text-white text-[11px] font-heading font-extrabold shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          title="Baixar App para jogar offline no celular ou PC"
        >
          <Download className="w-3 h-3 text-[#F4B300]" />
          <span>Baixar App (Offline)</span>
        </button>
      )}

      {isIOS && !isInstallable && (
        <button
          type="button"
          onClick={() => {
            playClickSound();
            setShowIOSGuide(true);
          }}
          className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-[#0B66C3] hover:bg-[#084e96] text-white text-[11px] font-heading font-bold shadow-sm transition-transform hover:scale-105 cursor-pointer"
          title="Instalar no iPhone / iPad"
        >
          <Smartphone className="w-3 h-3 text-[#93c5fd]" />
          <span>Instalar no iPhone</span>
        </button>
      )}

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in text-left">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-[#ece9df] space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📱</span>
              <h3 className="text-base font-black font-heading text-[#141E18]">Como Instalar no iOS</h3>
            </div>
            <div className="text-xs text-[#566359] space-y-2 leading-relaxed bg-[#fbf9f3] p-3 rounded-2xl border border-[#ece9df]">
              <p>1. Toque no botão <strong>Compartilhar</strong> (ícone com quadrado e seta para cima) na barra do Safari.</p>
              <p>2. Role as opções e selecione <strong>Adicionar à Tela de Início</strong>.</p>
              <p>3. Pronto! O Vida Real Brasil funcionará com tela cheia e <strong>100% offline</strong>!</p>
            </div>
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-[#087F48] text-white text-xs font-heading font-bold hover:bg-[#006437] transition-colors cursor-pointer"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
};
