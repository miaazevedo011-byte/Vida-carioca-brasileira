import React from 'react';
import { AlertTriangle, HeartCrack, Baby, ShieldAlert, Skull, Sparkles, CheckCircle2 } from 'lucide-react';
import { playSuccessSound, playErrorSound, playClickSound } from '../utils/audio';
import confetti from 'canvas-confetti';

export interface EventBombaData {
  type: 'morte' | 'gravidez' | 'parto' | 'prisao' | 'morte_personagem';
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  badge: string;
  statDeltas?: { saude?: number; felicidade?: number; grana?: number };
  actionText?: string;
}

interface EventBombaModalProps {
  eventData: EventBombaData | null;
  onClose: () => void;
}

export const EventBombaModal: React.FC<EventBombaModalProps> = ({ eventData, onClose }) => {
  if (!eventData) return null;

  const isDeath = eventData.type === 'morte' || eventData.type === 'morte_personagem';
  const isBirth = eventData.type === 'gravidez' || eventData.type === 'parto';
  const isPrison = eventData.type === 'prisao';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in text-left">
      <div className={`rounded-3xl border-2 shadow-[0px_25px_60px_rgba(0,0,0,0.5)] max-w-md w-full p-6 text-center space-y-4 ${
        isDeath
          ? 'bg-[#141E18] text-white border-[#D9532F]'
          : isBirth
          ? 'bg-white text-[#141E18] border-[#087F48]'
          : 'bg-[#1e1b2e] text-white border-[#f59e0b]'
      }`}>
        {/* Animated Main Icon */}
        <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-2xl border ${
          isDeath
            ? 'bg-[#2a1310] border-[#D9532F] text-[#D9532F]'
            : isBirth
            ? 'bg-[#e6f5ed] border-[#087F48] text-[#087F48]'
            : 'bg-[#3b2a10] border-[#f59e0b] text-[#f59e0b]'
        }`}>
          {eventData.icon}
        </div>

        {/* Badge & Title */}
        <div>
          <span className={`text-[10px] font-heading font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-1.5 ${
            isDeath
              ? 'bg-[#3d1a16] text-[#ff8080] border border-[#7a2820]'
              : isBirth
              ? 'bg-[#e6f5ed] text-[#006437] border border-[#a1d1b5]'
              : 'bg-[#3d2e16] text-[#fcd34d] border border-[#7a5b20]'
          }`}>
            {eventData.badge}
          </span>
          <h2 className="text-2xl font-black font-heading leading-tight">
            {eventData.title}
          </h2>
          <p className="text-xs font-bold opacity-80 mt-0.5">
            {eventData.subtitle}
          </p>
        </div>

        {/* Narrative Context */}
        <div className={`p-4 rounded-2xl text-xs leading-relaxed border ${
          isDeath
            ? 'bg-[#1c2921] border-[#2d4235] text-[#e0e8e3]'
            : isBirth
            ? 'bg-[#fbf9f3] border-[#ece9df] text-[#566359]'
            : 'bg-[#2a263d] border-[#3e3859] text-[#e2dff0]'
        }`}>
          {eventData.description}
        </div>

        {/* Stat Impact Deltas */}
        {eventData.statDeltas && (
          <div className="flex justify-center gap-3 text-xs font-heading font-extrabold pt-1">
            {eventData.statDeltas.felicidade !== undefined && (
              <span className={eventData.statDeltas.felicidade >= 0 ? 'text-[#93f7b4]' : 'text-[#ff8080]'}>
                Felicidade: {eventData.statDeltas.felicidade >= 0 ? '+' : ''}{eventData.statDeltas.felicidade}%
              </span>
            )}
            {eventData.statDeltas.saude !== undefined && (
              <span className={eventData.statDeltas.saude >= 0 ? 'text-[#93f7b4]' : 'text-[#ff8080]'}>
                Saúde: {eventData.statDeltas.saude >= 0 ? '+' : ''}{eventData.statDeltas.saude}%
              </span>
            )}
            {eventData.statDeltas.grana !== undefined && (
              <span className={eventData.statDeltas.grana >= 0 ? 'text-[#93f7b4]' : 'text-[#ff8080]'}>
                Grana: R$ {eventData.statDeltas.grana.toLocaleString('pt-BR')}
              </span>
            )}
          </div>
        )}

        {/* Acknowledge Action Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className={`w-full py-3.5 px-6 rounded-2xl font-heading font-extrabold text-xs transition-all cursor-pointer shadow-lg ${
            isDeath
              ? 'bg-[#D9532F] hover:bg-[#b53c1d] text-white'
              : isBirth
              ? 'bg-[#087F48] hover:bg-[#006437] text-white'
              : 'bg-[#f59e0b] hover:bg-[#d97706] text-black'
          }`}
        >
          {eventData.actionText || 'Compreender & Continuar'}
        </button>
      </div>
    </div>
  );
};
