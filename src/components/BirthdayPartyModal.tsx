import React, { useState } from 'react';
import { Character } from '../types/game';
import { PartyPopper } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { LegoMinifigHead } from './LegoMinifigHead';

interface BirthdayPartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  celebrantName?: string;
  celebrantAge?: number;
  celebrantRelation?: string;
  onCompleteParty: (outcome: { happinessDelta: number; friendshipDelta: number }) => void;
}

export const BirthdayPartyModal: React.FC<BirthdayPartyModalProps> = ({
  isOpen,
  onClose,
  character,
  celebrantName = 'Enzo Gabriel',
  celebrantAge = 8,
  celebrantRelation = 'Amigo',
  onCompleteParty
}) => {
  const [round, setRound] = useState(1);
  const [energy, setEnergy] = useState(4);
  const [mood, setMood] = useState(95);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [unlockedPolaroids, setUnlockedPolaroids] = useState<number[]>([1, 2]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSelectActivity = (activityName: string, hBonus: number, eCost: number) => {
    playClickSound();
    setSelectedActivity(activityName);
    setEnergy((prev) => Math.max(0, prev - eCost));
    setMood((prev) => Math.min(100, prev + hBonus));
    showToast(`Ação escolhida: ${activityName}!`);
    playSuccessSound();
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  const handleNextRound = () => {
    playClickSound();
    if (round < 4) {
      setRound((prev) => prev + 1);
      setEnergy(4);
      setSelectedActivity(null);
      showToast(`Iniciando Rodada ${round + 1} da Festa! 🎉`);
    } else {
      playSuccessSound();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
      onCompleteParty({ happinessDelta: 25, friendshipDelta: 20 });
      onClose();
    }
  };

  const handleRest = () => {
    playClickSound();
    setEnergy(5);
    setMood((prev) => Math.min(100, prev + 10));
    showToast('Descansou na mesa com a família. Energia restaurada! 🧃');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn overflow-y-auto text-left">
      <div className="app-viewport w-full max-w-md bg-[#f4fbf2] rounded-3xl sm:rounded-[36px] overflow-hidden shadow-2xl border border-[#dde4db] max-h-[94vh] flex flex-col my-auto relative font-body-md text-[#161d18]">
        
        {/* Top Header Bar */}
        <header className="bg-[#f4fbf2]/85 backdrop-blur-xl border-b border-[#dde4db] px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#eef6ec] text-[#006740] flex items-center justify-center shadow-[0_3px_0_0_#d5dcd3]">
              <PartyPopper className="w-5 h-5 text-[#006740]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-[#7c5800] font-bold font-heading">
                Evento Especial • Aniversário
              </span>
              <h1 className="font-heading font-black text-base text-[#161d18] truncate">
                Festa de Aniversário de {celebrantName} ({celebrantAge} anos)
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#dde4db] hover:bg-[#cdd6cb] text-[#161d18] font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Contextual Status Brick */}
          <div className="w-full bg-[#e9f0e7] rounded-2xl p-4 shadow-xs relative overflow-hidden border border-[#bdcabf]">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ffdea8] text-[#5e4200] font-heading font-bold text-[10px] uppercase tracking-wide shadow-[0_2px_0_0_#fdbb2d]">
                <span>🎈</span> Buffet Pula-Pula & Magia
              </span>
              <div className="flex items-center gap-1 bg-[#e3eae1] px-3 py-0.5 rounded-full text-[#7c5800] text-xs font-bold font-heading">
                <span>🕒 Sábado • 15:30</span>
              </div>
            </div>

            {/* Mini Profile Diorama */}
            <div className="flex items-center justify-between gap-2 bg-white p-3 rounded-2xl shadow-[0_3px_0_0_#dde4db] border border-[#dde4db]">
              {/* Lucas (Personagem) */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative w-12 h-12 rounded-2xl bg-[#fdbb2d] flex items-center justify-center shadow-[0_3px_0_0_#9a6b00] shrink-0 p-1">
                  <LegoMinifigHead avatarId={character.legoAvatar || 'estudante'} size="md" className="w-full h-full" />
                  <span className="absolute -bottom-1 -right-1 bg-[#006740] text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                    {character.age}a
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-heading font-black text-sm text-[#161d18] truncate leading-tight">{character.name}</span>
                  <span className="text-[11px] text-[#3e4941] flex items-center gap-0.5">
                    <span>🎒</span> Convidado
                  </span>
                </div>
              </div>

              {/* Connector Heart */}
              <div className="flex flex-col items-center justify-center shrink-0 px-1 text-[#6e7a71]">
                <span className="text-base">❤️</span>
                <span className="text-[10px] text-[#7c5800] font-bold font-heading">{celebrantRelation}</span>
              </div>

              {/* Celebrant */}
              <div className="flex items-center gap-2 min-w-0 justify-end text-right">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center justify-end gap-1">
                    <span className="font-heading font-black text-sm text-[#161d18] truncate leading-tight">{celebrantName}</span>
                    <span>👑</span>
                  </div>
                  <span className="text-[11px] text-[#7c5800] font-bold flex items-center justify-end gap-0.5">
                    Aniversariante ({celebrantAge}a)
                  </span>
                </div>
                <div className="relative w-12 h-12 rounded-2xl bg-[#fdbb2d] flex items-center justify-center shadow-[0_3px_0_0_#9a6b00] shrink-0 p-1">
                  <LegoMinifigHead avatarId="jovem" size="md" className="w-full h-full" />
                </div>
              </div>
            </div>

            {/* Festive Gauges */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-[#e3eae1] rounded-xl p-3 flex flex-col justify-between border border-[#dde4db]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#3e4941] font-bold font-heading flex items-center gap-1">
                    ⚡ Rodada da Festa
                  </span>
                  <span className="text-xs text-[#006740] font-black font-heading">{round} / 4</span>
                </div>
                <div className="w-full h-3 bg-[#dde4db] rounded-full overflow-hidden flex gap-0.5 p-0.5">
                  {[1, 2, 3, 4].map((r) => (
                    <div key={r} className={`h-full flex-1 rounded-full ${r <= round ? 'bg-[#006740]' : 'bg-[#d5dcd3]'}`} />
                  ))}
                </div>
              </div>

              <div className="bg-[#e3eae1] rounded-xl p-3 flex flex-col justify-between border border-[#dde4db]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#3e4941] font-bold font-heading flex items-center gap-1">
                    😊 Humor Geral
                  </span>
                  <span className="text-xs text-[#7c5800] font-black font-heading">{mood}%</span>
                </div>
                <div className="w-full h-3 bg-[#dde4db] rounded-full overflow-hidden p-0.5 flex">
                  <div className="h-full bg-[#fdbb2d] rounded-full transition-all duration-300" style={{ width: `${mood}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Narrative Banner */}
          <div className="relative w-full bg-white rounded-2xl overflow-hidden shadow-[0_4px_0_0_#dde4db] border border-[#dde4db]">
            <div className="relative w-full h-36 overflow-hidden bg-gradient-to-r from-[#006740] via-[#0d8253] to-[#7c5800] flex items-end p-4">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
              <div className="relative z-10 text-white">
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Acontecendo Agora</span>
                <h3 className="font-heading font-black text-base mt-1">Festa Animada de Aniversário!</h3>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-[#3e4941] leading-relaxed font-medium">
                Você chegou para celebrar o aniversário de {celebrantName}! O som toca alto, há brigadeiros por toda parte e os amigos estão prontos para brincar e comemorar.
              </p>
            </div>
          </div>

          {/* Activity Selection Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-heading font-black text-sm text-[#161d18]">Escolhas da Rodada {round}</h2>
              <span className="text-[10px] font-bold text-[#3e4941] bg-[#e3eae1] px-2.5 py-0.5 rounded-full font-heading">
                Selecione 1 Ação
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { title: 'Piscina de Bolinhas Gigante', desc: 'Mergulhe fundo procurando o chaveiro perdido do aniversariante!', bonus: '+15 Amizade', cost: '1 Energia', icon: '🏐', color: 'bg-[#cde5ff] text-[#005e91]' },
                { title: 'Torneio no Castelo Inflável', desc: 'Disputar quem pula mais alto nas torres infláveis com meias coloridas.', bonus: '+Felicidade', cost: 'Risco tropeço', icon: '🤸', color: 'bg-[#ffdea8] text-[#7c5800]' },
                { title: 'Mesa de Guloseimas & Docinhos', desc: 'Devorar 8 brigadeiros com granulado e guaraná estupidamente gelado.', bonus: '+Recarrega Energia', cost: 'Barriga cheia', icon: '🧁', color: 'bg-[#e3eae1] text-[#161d18]' },
                { title: "Puxar o 'Com Quem Será?'", desc: 'Pegar o microfone do animador e cantar os parabéns com entusiasmo!', bonus: '+20 Carisma', cost: 'Popularidade', icon: '🎤', color: 'bg-[#93f7be] text-[#005232]' }
              ].map((act, i) => {
                const isSelected = selectedActivity === act.title;
                return (
                  <div
                    key={i}
                    onClick={() => handleSelectActivity(act.title, 10, 1)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs ${
                      isSelected ? 'bg-[#e2ffe9] border-[#006740] ring-2 ring-[#006740]/30' : 'bg-white border-[#dde4db] hover:border-[#006740]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${act.color}`}>
                        {act.icon}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-heading font-bold text-xs text-[#161d18] truncate">{act.title}</h4>
                        <p className="text-[11px] text-[#3e4941] mt-0.5 line-clamp-1">{act.desc}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-heading font-bold text-[#006740]">
                          <span>✨ {act.bonus}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold shrink-0 cursor-pointer ${
                        isSelected ? 'bg-[#006740] text-white' : 'bg-[#eef6ec] text-[#161d18] hover:bg-[#e3eae1]'
                      }`}
                    >
                      {isSelected ? 'Escolhido ✓' : 'Participar'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Polaroid Memories */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-heading font-black text-sm text-[#161d18]">Álbum de Memórias Coletadas</h2>
              <span className="text-[10px] font-bold text-[#006740]">2 / 4 Desbloqueadas</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white p-2 rounded-xl border border-[#dde4db] shadow-xs text-center">
                <div className="w-full h-24 rounded-lg bg-[#006740] text-white flex items-center justify-center text-2xl font-bold mb-1">
                  🎂
                </div>
                <span className="font-heading font-bold text-[11px] text-[#161d18] block truncate">Com o Aniversariante</span>
                <span className="text-[9px] text-[#3e4941]">Memória Colecionada</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-[#dde4db] shadow-xs text-center">
                <div className="w-full h-24 rounded-lg bg-[#7c5800] text-white flex items-center justify-center text-2xl font-bold mb-1">
                  🎈
                </div>
                <span className="font-heading font-bold text-[11px] text-[#161d18] block truncate">Brincadeiras no Pátio</span>
                <span className="text-[9px] text-[#3e4941]">Memória Colecionada</span>
              </div>
            </div>
          </div>

          {toastMessage && (
            <div className="fixed bottom-20 left-4 right-4 z-50 bg-[#161d18] text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-center text-xs font-bold animate-fadeIn">
              <span>{toastMessage}</span>
            </div>
          )}
        </main>

        {/* Bottom Playful Decision Bar */}
        <footer className="p-4 bg-[#e9f0e7] border-t border-[#dde4db] space-y-2 shrink-0">
          <button
            type="button"
            onClick={handleNextRound}
            className="w-full h-12 rounded-2xl bg-[#006740] hover:bg-[#0d8253] text-white font-heading font-black text-sm shadow-[0_4px_0_0_#005232] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{round < 4 ? 'Aproveitar Próxima Rodada! 🎈' : 'Concluir Festa & Parabéns! 🎂'}</span>
          </button>
          <button
            type="button"
            onClick={handleRest}
            className="w-full h-10 rounded-xl bg-[#e3eae1] hover:bg-[#d5dcd3] text-[#161d18] font-heading font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Descansar na Mesa com a Mamãe (+Energia)</span>
          </button>
        </footer>
      </div>
    </div>
  );
};
