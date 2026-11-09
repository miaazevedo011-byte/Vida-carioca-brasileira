import React, { useState } from 'react';
import { GameState } from '../types/game';
import { Sparkles, Sliders, DollarSign, Award, Check, User, Briefcase, Zap, ShieldCheck } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface CreatorModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  onUpdateCreatorState: (updates: {
    avatarIcon?: string;
    stats?: Partial<GameState['stats']>;
    serasaScore?: number;
    customJobTitle?: string;
    customSalary?: number;
  }) => void;
}

const AVATAR_STICKER_OPTIONS = [
  { label: 'Estudante', icon: '🧑' },
  { label: 'Profissional', icon: '👩‍💼' },
  { label: 'Jovem', icon: '👦' },
  { label: 'Casual', icon: '🧔' },
  { label: 'Esportista', icon: '👩‍🦰' },
  { label: 'Artístico', icon: '👨‍🎨' },
  { label: 'Cientista', icon: '👩‍🔬' },
  { label: 'Executivo', icon: '👨‍💻' },
  { label: 'Aposentado', icon: '👴' },
  { label: 'Criativo', icon: '👩‍🎨' }
];

export const CreatorModeModal: React.FC<CreatorModeModalProps> = ({
  isOpen,
  onClose,
  gameState,
  onUpdateCreatorState
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState(gameState.character.legoAvatar || '🧱 Trabalhador Lego');
  const [saude, setSaude] = useState(gameState.stats.saude);
  const [felicidade, setFelicidade] = useState(gameState.stats.felicidade);
  const [grana, setGrana] = useState(gameState.stats.grana);
  const [energia, setEnergia] = useState(gameState.stats.energia);
  const [intelecto, setIntelecto] = useState(gameState.stats.intelecto);
  const [serasaScore, setSerasaScore] = useState(gameState.serasa.score);
  const [jobTitle, setJobTitle] = useState(gameState.career.title);
  const [salary, setSalary] = useState(gameState.career.salaryMonthly);

  if (!isOpen) return null;

  const handleApplyChanges = () => {
    playSuccessSound();
    confetti({ particleCount: 60, spread: 60 });
    onUpdateCreatorState({
      avatarIcon: selectedAvatar,
      stats: {
        saude: Number(saude),
        felicidade: Number(felicidade),
        grana: Number(grana),
        energia: Number(energia),
        intelecto: Number(intelecto)
      },
      serasaScore: Number(serasaScore),
      customJobTitle: jobTitle,
      customSalary: Number(salary)
    });
    onClose();
  };

  const handleMaxBoost = () => {
    playClickSound();
    setSaude(100);
    setFelicidade(100);
    setGrana(1000000);
    setEnergia(100);
    setIntelecto(100);
    setSerasaScore(990);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#ffffff] rounded-3xl border border-[#e4e1d7] shadow-[0px_20px_50px_rgba(20,30,24,0.2)] max-w-lg w-full p-5 sm:p-6 text-left max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f0eee8] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fff0f0] border border-[#f9d7d7] text-[#D9532F] flex items-center justify-center text-xl font-heading font-black">
              🎨
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D9532F] bg-[#fff0f0] px-2 py-0.5 rounded font-heading">
                MODO CRIADOR & SANDBOX (GOD MODE)
              </span>
              <h3 className="font-heading font-extrabold text-base text-[#141E18]">
                Customizar Personagem & Vida
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f0eee8] hover:bg-[#e4e1d7] flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Quick Max Boost Button */}
        <button
          onClick={handleMaxBoost}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#F4B300] to-[#087F48] text-white font-heading font-extrabold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Ativar Boost Máximo (Grana R$ 1 Milhão, Stats 100% & Score 990)</span>
        </button>



        {/* Estilo de Vida (Humilde, Tranquila, Luxo) */}
        <div className="space-y-2">
          <label className="text-xs font-heading font-extrabold uppercase text-[#566359] block">
            💎 Estilo de Vida (Consumo Diário & Custo Fixo):
          </label>
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <button
              type="button"
              onClick={() => playClickSound()}
              className="p-2 rounded-xl bg-[#fbf9f3] border border-[#ece9df] hover:border-[#087F48] cursor-pointer"
            >
              <span className="text-base block">🏠</span>
              <span className="text-[11px] font-bold text-[#141E18] block font-heading">Humilde</span>
              <span className="text-[9px] text-[#566359]">Baixo custo</span>
            </button>

            <button
              type="button"
              onClick={() => playClickSound()}
              className="p-2 rounded-xl bg-[#edf5fd] border border-[#b2d3f5] hover:border-[#0B66C3] cursor-pointer"
            >
              <span className="text-base block">☕</span>
              <span className="text-[11px] font-bold text-[#141E18] block font-heading">Tranquila</span>
              <span className="text-[9px] text-[#0B66C3]">Custo médio</span>
            </button>

            <button
              type="button"
              onClick={() => playClickSound()}
              className="p-2 rounded-xl bg-[#fff2e6] border border-[#f5d0a1] hover:border-[#d97706] cursor-pointer"
            >
              <span className="text-base block">✨</span>
              <span className="text-[11px] font-bold text-[#141E18] block font-heading">Luxo</span>
              <span className="text-[9px] text-[#d97706]">Alto consumo</span>
            </button>
          </div>
        </div>

        {/* Roupas & Estilos (10 Roupas, Barbas, Acessórios) */}
        <div className="space-y-2">
          <label className="text-xs font-heading font-extrabold uppercase text-[#566359] block">
            👕 Estilos de Roupa & Acessórios de Cria:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {['Polo Clássica 👔', 'Jaqueta de Couro 🧥', 'Estilo Cria 🧢', 'Agro Sertanejo 🤠', 'Moda Praia 🏖️', 'Roupa de Baile 🪩', 'Social Executivo 💼', 'Visual Emo 🎸', 'Esportivo 👟', 'Casual 👕'].map((outfit, idx) => (
              <span key={idx} className="text-[10px] font-bold bg-[#f5f3ed] text-[#141E18] px-2 py-1 rounded-lg border border-[#ece9df]">
                {outfit}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] font-bold bg-[#e6f5ed] text-[#006437] px-2 py-0.5 rounded-md">
              🧔 6 Estilos de Barba
            </span>
            <span className="text-[10px] font-bold bg-[#edf5fd] text-[#0B66C3] px-2 py-0.5 rounded-md">
              👓 Óculos Juliet / Ray-Ban
            </span>
            <span className="text-[10px] font-bold bg-[#fff2e6] text-[#d97706] px-2 py-0.5 rounded-md">
              ⛓️ Corrente de Prata / Ouro
            </span>
          </div>
        </div>

        {/* Attribute Sliders */}
        <div className="space-y-3 pt-2 border-t border-[#f0eee8]">
          <label className="text-xs font-heading font-extrabold uppercase text-[#566359] block">
            Editar Atributos Vitais:
          </label>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] font-bold text-[#566359]">❤️ Saúde: {saude}%</span>
              <input
                type="range"
                min="1"
                max="100"
                value={saude}
                onChange={(e) => setSaude(Number(e.target.value))}
                className="w-full accent-[#087F48]"
              />
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#566359]">😊 Felicidade: {felicidade}%</span>
              <input
                type="range"
                min="1"
                max="100"
                value={felicidade}
                onChange={(e) => setFelicidade(Number(e.target.value))}
                className="w-full accent-[#F4B300]"
              />
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#566359]">⚡ Energia: {energia}%</span>
              <input
                type="range"
                min="1"
                max="100"
                value={energia}
                onChange={(e) => setEnergia(Number(e.target.value))}
                className="w-full accent-[#0B66C3]"
              />
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#566359]">🧠 Intelecto: {intelecto}%</span>
              <input
                type="range"
                min="1"
                max="100"
                value={intelecto}
                onChange={(e) => setIntelecto(Number(e.target.value))}
                className="w-full accent-[#8a6300]"
              />
            </div>
          </div>
        </div>

        {/* Financial & Job Customization */}
        <div className="space-y-3 pt-2 border-t border-[#f0eee8]">
          <label className="text-xs font-heading font-extrabold uppercase text-[#566359] block">
            Dinheiro & Carreira Livre:
          </label>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <span className="text-[10px] font-bold text-[#566359] block mb-1">Saldo em Conta (R$)</span>
              <input
                type="number"
                value={grana}
                onChange={(e) => setGrana(Number(e.target.value))}
                className="w-full p-2 rounded-xl bg-[#fbf9f3] border border-[#ece9df] font-heading font-bold text-xs text-[#006437]"
              />
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#566359] block mb-1">Serasa Score (0-1000)</span>
              <input
                type="number"
                min="0"
                max="1000"
                value={serasaScore}
                onChange={(e) => setSerasaScore(Number(e.target.value))}
                className="w-full p-2 rounded-xl bg-[#fbf9f3] border border-[#ece9df] font-heading font-bold text-xs text-[#0B66C3]"
              />
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#566359] block mb-1">Título do Emprego</span>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full p-2 rounded-xl bg-[#fbf9f3] border border-[#ece9df] font-heading font-bold text-xs"
              />
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#566359] block mb-1">Salário Mensal (R$)</span>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full p-2 rounded-xl bg-[#fbf9f3] border border-[#ece9df] font-heading font-bold text-xs text-[#006437]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex gap-2">
          <button
            onClick={handleApplyChanges}
            className="flex-1 py-3 rounded-2xl bg-[#087F48] text-white font-heading font-extrabold text-xs hover:bg-[#006437] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Check className="w-4 h-4" />
            <span>Aplicar Alterações no Personagem</span>
          </button>

          <button
            onClick={onClose}
            className="py-3 px-4 rounded-2xl bg-[#f5f3ed] text-[#566359] font-heading font-bold text-xs hover:bg-[#ebe7dc] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
