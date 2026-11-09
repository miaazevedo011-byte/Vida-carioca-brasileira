import React, { useState } from 'react';
import { Character, Relationship, Pet, FamilyState, Stats, Housing } from '../../types/game';
import { 
  Heart, Users, Dog, Baby, Sparkles, Gift, MessageCircle, Utensils, ShieldCheck, 
  Flame, Landmark, Lock, HeartCrack, Compass, Gem, HandHeart, Church, CheckCircle2, 
  Coffee, Flower2, Pencil, Moon, ChevronDown, ChevronUp, Music, Sun, Bath, 
  Stethoscope, BookOpen, Gamepad2, ShoppingBag, Scissors, Bone, Tv, Check, Activity, Smile, Bike, Film
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound, playSuccessSound } from '../../utils/audio';
import { LegoMinifigHead } from '../LegoMinifigHead';
import { FamilyTreeD3 } from '../FamilyTreeD3';

interface FamilyTabProps {
  character: Character;
  stats: Stats;
  relationship: Relationship;
  housing?: Housing;
  family?: FamilyState;
  pet?: Pet;
  onUpdateAffection: (target: 'parent' | 'sibling' | 'partner' | 'pet' | 'child', memberName: string, delta: number) => void;
  onDoFamilyAction: (actionType: string, memberName: string, cost?: number, itemGiven?: string) => { success: boolean; message: string; affectionDelta?: number };
  onAdoptPet: (newPet: Pet) => { success: boolean; message: string };
  onPartnerAction: (action: any, itemGiven?: string) => { success: boolean; message: string; gotPregnant?: boolean };
  onRequestFamilyMoney: (memberName: string) => { success: boolean; message: string; amount?: number };
  onUpdateStepParentNickname?: (parentRole: string, newNickname: string) => { success: boolean; message: string };
  onAddRandomFriend?: () => { success: boolean; message: string };
  onFriendAction?: (friendId: string, actionType: string) => { success: boolean; message: string; discoveredBetrayal?: boolean };
  onPlanFamilyEvent?: (data: {
    eventTitle: string;
    eventType: string;
    cost: number;
    happinessGain: number;
    mentalHealthGain: number;
    energyGain: number;
    guestNames: string[];
  }) => { success: boolean; message: string };
  onOpenWeddingPlanner?: () => void;
}

const AVAILABLE_PETS: Pet[] = [
  { name: 'Caramelo', type: 'Cão Vira-Lata', breed: 'Vira-lata Caramelo 🐕', happinessBonus: 20, monthlyCost: 80, age: 1 },
  { name: 'Thor', type: 'Cão Golden', breed: 'Golden Retriever 🦮', happinessBonus: 30, monthlyCost: 220, age: 1 },
  { name: 'Pipoca', type: 'Porquinho', breed: 'Porquinho-da-Índia 🐹', happinessBonus: 12, monthlyCost: 40, age: 1 },
  { name: 'Bob', type: 'Cão Pug', breed: 'Pug Carlino 🐶', happinessBonus: 18, monthlyCost: 150, age: 1 },
  { name: 'Kira', type: 'Cão Husky', breed: 'Husky Siberiano 🐺', happinessBonus: 28, monthlyCost: 240, age: 2 },
  { name: 'Teddy', type: 'Cão Shih Tzu', breed: 'Shih Tzu 🐩', happinessBonus: 22, monthlyCost: 160, age: 1 },
  { name: 'Kiko', type: 'Calopsita', breed: 'Calopsita Amarela 🦜', happinessBonus: 10, monthlyCost: 35, age: 1 },
  { name: 'Bifinho', type: 'Hamster', breed: 'Hamster Sírio 🐭', happinessBonus: 8, monthlyCost: 25, age: 1 },
  { name: 'Mimi', type: 'Gato Siamês', breed: 'Siamês 🐈', happinessBonus: 15, monthlyCost: 70, age: 2 },
  { name: 'Capi', type: 'Capivara', breed: 'Capivara Silvestre 🦫', happinessBonus: 35, monthlyCost: 250, age: 1 }
];

export const FamilyTab: React.FC<FamilyTabProps> = ({
  character,
  stats,
  relationship,
  family = {
    parents: [
      { name: 'Sérgio da Silva', role: 'Pai', age: 58, job: 'Aposentado', affection: 88, alive: true },
      { name: 'Cristina da Silva', role: 'Mãe', age: 56, job: 'Dona de Casa', affection: 91, alive: true }
    ],
    siblings: [
      { id: '1', name: 'Lucas', gender: 'M', age: 14, affection: 75 }
    ],
    children: [],
    friends: []
  },
  pet,
  onDoFamilyAction,
  onAdoptPet,
  onPartnerAction,
  onRequestFamilyMoney,
  onAddRandomFriend,
  onFriendAction,
  onPlanFamilyEvent,
  onOpenWeddingPlanner
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'amor' | 'pais_irmaos' | 'filhos' | 'pet' | 'amigos' | 'arvore'>('amor');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showMoreLoveGestures, setShowMoreLoveGestures] = useState<boolean>(false);
  const [parentActionTab, setParentActionTab] = useState<'afeto' | 'social'>('afeto');
  const [siblingActionTab, setSiblingActionTab] = useState<'lazer' | 'afeto'>('lazer');
  const [petActionTab, setPetActionTab] = useState<'alimentacao' | 'higiene' | 'social' | 'saude'>('alimentacao');
  const [expandedFriendId, setExpandedFriendId] = useState<string | null>(null);
  const [expandedHistoryFriendId, setExpandedHistoryFriendId] = useState<string | null>(null);

  // Event Planner State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState<'almoco' | 'churrasco' | 'aniversario' | 'cha_tarde'>('almoco');
  const [selectedGuestNames, setSelectedGuestNames] = useState<string[]>([]);

  const [selectedMember, setSelectedMember] = useState<{
    name: string;
    role: string;
    affection: number;
    type: 'parent' | 'sibling' | 'partner' | 'child' | 'pet';
    age?: number;
    gender?: string;
  } | null>(null);

  const showMsg = (res: { success: boolean; message: string }) => {
    setFeedback(res.message);
    if (res.success) {
      confetti({ particleCount: 35, spread: 65, origin: { y: 0.7 } });
    }
    setTimeout(() => setFeedback(null), 30000);
  };

  const handlePartnerClick = (act: any) => {
    playClickSound();
    const res = onPartnerAction(act);
    showMsg(res);
    if (res.gotPregnant) {
      playSuccessSound();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }
    setSelectedMember(null);
  };

  const childrenCount = family.children ? family.children.length : 0;

  const parentsList = family.parents && family.parents.length > 0 ? family.parents : [
    { name: 'Sérgio da Silva', role: 'Pai', age: 58, job: 'Aposentado', affection: 88, alive: true },
    { name: 'Cristina da Silva', role: 'Mãe', age: 56, job: 'Dona de Casa', affection: 91, alive: true }
  ];

  const siblingsList = family.siblings && family.siblings.length > 0 ? family.siblings : [
    { id: '1', name: 'Lucas', gender: 'M', age: 14, affection: 75 }
  ];

  const EVENT_TYPES = [
    {
      id: 'almoco',
      title: '🥟 Almoço de Família de Domingo',
      cost: 120,
      happinessGain: 25,
      mentalHealthGain: 20,
      energyGain: 15,
      icon: '🥟',
      desc: 'Feijoada saborosa na mesa, couve refogada, pudim de leite e conversas acolhedoras reunindo a família!'
    },
    {
      id: 'churrasco',
      title: '🥩 Churrascão com Pagode & Amigos',
      cost: 280,
      happinessGain: 38,
      mentalHealthGain: 30,
      energyGain: 25,
      icon: '🥩',
      desc: 'Picanha fatiada, vinagrete, pão de alho na brasa e roda de pagode ao vivo para renovar as energias e esquecer o estresse!'
    },
    {
      id: 'aniversario',
      title: '🥳 Festa de Aniversário Especial',
      cost: 500,
      happinessGain: 55,
      mentalHealthGain: 40,
      energyGain: 30,
      icon: '🥳',
      desc: 'Bolo de dois andares, salgadinhos de festa, guaraná gelado e comemoração memorável com parabéns animado!'
    },
    {
      id: 'cha_tarde',
      title: '☕ Chá da Tarde & Reunião Intimista',
      cost: 80,
      happinessGain: 18,
      mentalHealthGain: 15,
      energyGain: 10,
      icon: '☕',
      desc: 'Café passado na hora, bolo de fubá com goiabada e uma tarde agradável para trocar desabafos e aconchego.'
    }
  ];

  const allPossibleGuests = [
    ...(relationship.partnerName && relationship.status !== 'solteiro' ? [{ name: relationship.partnerName, role: 'Par Oficial 💖' }] : []),
    ...parentsList.map(p => ({ name: p.name, role: p.role })),
    ...siblingsList.map(s => ({ name: s.name, role: 'Irmão(ã)' })),
    ...(family.children || []).map(c => ({ name: c.name, role: 'Filho(a)' })),
    ...(family.friends || []).map(f => ({ name: f.name, role: f.type === 'ex' ? 'Ex-parceiro(a)' : f.type === 'amante' ? 'Caso Secreto' : 'Amigo(a)' }))
  ];

  const handleConfirmPlanEvent = () => {
    if (selectedGuestNames.length === 0) {
      showMsg({ success: false, message: 'Selecione ao menos 1 convidado para o evento!' });
      return;
    }
    const ev = EVENT_TYPES.find(e => e.id === selectedEventType) || EVENT_TYPES[0];
    if (stats.grana < ev.cost) {
      showMsg({ success: false, message: `Saldo insuficiente! Necessário R$ ${ev.cost.toLocaleString('pt-BR')}.` });
      return;
    }

    setIsEventModalOpen(false);

    if (onPlanFamilyEvent) {
      const res = onPlanFamilyEvent({
        eventTitle: ev.title,
        eventType: ev.id,
        cost: ev.cost,
        happinessGain: ev.happinessGain,
        mentalHealthGain: ev.mentalHealthGain,
        energyGain: ev.energyGain,
        guestNames: selectedGuestNames
      });
      showMsg(res);
    } else {
      playSuccessSound();
      confetti({ particleCount: 80, spread: 75, origin: { y: 0.6 } });
      selectedGuestNames.forEach(name => {
        onDoFamilyAction('almoco_domingo', name, 0);
      });
      showMsg({
        success: true,
        message: `🎉 Evento "${ev.title}" realizado com sucesso! (+${ev.happinessGain}% Felicidade, +${ev.mentalHealthGain}% Saúde Mental)`
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in pb-10 text-left font-sans bg-[#F8F5EE] text-slate-900 p-1 rounded-3xl relative">
      {/* TOAST FEEDBACK FLUTUANTE DE AÇÃO TÁTIL */}
      {feedback && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-auto transition-all duration-300 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-xl border border-emerald-500 max-w-sm text-center">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
          <span className="text-xs font-bold leading-snug">{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white font-bold text-xs ml-1 cursor-pointer">✕</button>
        </div>
      )}

      {/* BANNER PLANEJAR EVENTO EM FAMÍLIA / AMIGOS */}
      <div className="mx-1 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 rounded-2xl p-3.5 text-white shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shrink-0">
            🎉
          </div>
          <div className="min-w-0">
            <h3 className="font-heading font-black text-sm sm:text-base tracking-tight truncate">
              Planejar Evento Familiar &amp; Festas
            </h3>
            <p className="text-[11px] text-amber-100 font-medium truncate">
              Organize almoços, churrascos e festas com convidados específicos!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playClickSound();
            setSelectedGuestNames(allPossibleGuests.map(g => g.name));
            setIsEventModalOpen(true);
          }}
          className="shrink-0 px-3.5 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-amber-50 active:translate-y-0.5 transition-all cursor-pointer font-heading flex items-center gap-1"
        >
          <span>Organizar Evento</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-current" />
        </button>
      </div>

      {/* Sub-Navegação Superior em Pílulas Táteis Laranja & Bege */}
      <div className="px-1 py-1">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => { playClickSound(); setActiveSubTab('amor'); }}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
              activeSubTab === 'amor'
                ? 'bg-[#0CA768] text-white shadow-[0_3px_0_#076940]'
                : 'bg-slate-100 text-slate-600 shadow-[0_2px_0_#d8bd92] hover:bg-[#ebd9c1]'
            }`}
          >
            <Heart className={`w-4 h-4 shrink-0 ${activeSubTab === 'amor' ? 'fill-current text-white' : 'text-emerald-600'}`} />
            <span>Vida a Dois & Romance</span>
          </button>

          <button
            onClick={() => { playClickSound(); setActiveSubTab('pais_irmaos'); }}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
              activeSubTab === 'pais_irmaos'
                ? 'bg-[#0CA768] text-white shadow-[0_3px_0_#076940]'
                : 'bg-slate-100 text-slate-600 shadow-[0_2px_0_#d8bd92] hover:bg-[#ebd9c1]'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Pais & Irmãos</span>
          </button>

          <button
            onClick={() => { playClickSound(); setActiveSubTab('filhos'); }}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
              activeSubTab === 'filhos'
                ? 'bg-[#0CA768] text-white shadow-[0_3px_0_#076940]'
                : 'bg-slate-100 text-slate-600 shadow-[0_2px_0_#d8bd92] hover:bg-[#ebd9c1]'
            }`}
          >
            <Baby className="w-4 h-4 shrink-0" />
            <span>Filhos ({childrenCount})</span>
          </button>

          <button
            onClick={() => { playClickSound(); setActiveSubTab('pet'); }}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
              activeSubTab === 'pet'
                ? 'bg-[#0CA768] text-white shadow-[0_3px_0_#076940]'
                : 'bg-slate-100 text-slate-600 shadow-[0_2px_0_#d8bd92] hover:bg-[#ebd9c1]'
            }`}
          >
            <Dog className="w-4 h-4 shrink-0" />
            <span>Bichinhos (Pets)</span>
          </button>

          <button
            onClick={() => { playClickSound(); setActiveSubTab('amigos'); }}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
              activeSubTab === 'amigos'
                ? 'bg-[#0CA768] text-white shadow-[0_3px_0_#076940]'
                : 'bg-slate-100 text-slate-600 shadow-[0_2px_0_#d8bd92] hover:bg-[#ebd9c1]'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Conhecidos & Amigos</span>
          </button>

          <button
            onClick={() => { playClickSound(); setActiveSubTab('arvore'); }}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
              activeSubTab === 'arvore'
                ? 'bg-[#0CA768] text-white shadow-[0_3px_0_#076940]'
                : 'bg-slate-100 text-slate-600 shadow-[0_2px_0_#d8bd92] hover:bg-[#ebd9c1]'
            }`}
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span>Árvore Genealógica (D3)</span>
          </button>
        </div>
      </div>

      {/* Notificação Toast de Aniversário de Familiar / Amigo */}
      <div className="mx-1 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl p-3 text-white shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-lg shrink-0">
            🎂
          </div>
          <div className="min-w-0">
            <h4 className="font-heading font-black text-xs sm:text-sm tracking-tight truncate">
              Aniversário na Família &amp; Amigos!
            </h4>
            <p className="text-[11px] text-emerald-100 font-medium truncate">
              Hoje é o aniversário de {parentsList[0]?.name || 'Sérgio'}! Envie os parabéns.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            playClickSound();
            playSuccessSound();
            confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
            onDoFamilyAction('parabens', parentsList[0]?.name || 'Pai', 0);
            showMsg({ success: true, message: `🎁 Mensagem de parabéns enviada com sucesso! (+15 Afeto)` });
          }}
          className="shrink-0 px-3 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-emerald-50 active:translate-y-0.5 transition-all cursor-pointer font-heading"
        >
          Dar Parabéns 🎉
        </button>
      </div>

      {/* ============================================================== */}
      {/* ABA: ÁRVORE GENEALÓGICA D3 */}
      {/* ============================================================== */}
      {activeSubTab === 'arvore' && (
        <FamilyTreeD3 character={character} relationship={relationship} family={family} />
      )}

      {/* ============================================================== */}
      {/* ABA PRINCIPAL: AMOR, SINTONIA & VIDA A DOIS */}
      {/* ============================================================== */}
      {activeSubTab === 'amor' && (
        <div className="space-y-4">
          {character.age < 18 ? (
            <div className="bg-slate-100 rounded-2xl p-6 border-2 border-dashed border-[#ff9f1c] text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#0CA768]/20 text-emerald-600 flex items-center justify-center mx-auto shadow-[0_2px_0_#cc6e00]">
                <Lock className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="font-black text-base text-slate-900">
                Namoro & Casamento (Liberado aos 18+ Anos)
              </h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                Você atualmente tem <strong>{character.age} anos</strong>. Relacionamentos sérios e encontros amorosos desbloqueiam na maioridade!
              </p>
            </div>
          ) : relationship.status === 'solteiro' ? (
            <div className="p-6 rounded-2xl bg-[#fffdf7] border border-slate-200 shadow-[0_4px_16px_rgba(74,53,32,0.06)] text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto shadow-[0_3px_0_#e59898]">
                <HeartCrack className="w-8 h-8 text-rose-700" />
              </div>
              <h4 className="font-black text-base text-slate-900">Você está Solteiro(a)</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Procure um amor no Tinder ou por amigos para iniciar um relacionamento sério!
              </p>
              <button
                onClick={() => handlePartnerClick('seek_partner')}
                className="py-3 px-6 rounded-xl bg-[#0CA768] text-white font-bold text-xs shadow-[0_3.5px_0_#cc6e00] active:translate-y-0.5 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Heart className="w-4 h-4 text-white fill-current" />
                <span>Baixar Tinder / Ir ao Baile (R$ 30)</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 1. CABEÇALHO DO CASAL & SINTONIA (Toy-Card Almofadado com Ghibli Warmth) */}
              <div className="relative w-full rounded-2xl bg-[#fffdf7] p-4 shadow-[0_5px_0_#e8d5b7,0_12px_24px_rgba(74,53,32,0.06)] flex flex-col gap-3 overflow-hidden border border-slate-200">
                {/* Fita Decorativa Toy de Status Laranja */}
                <div className="absolute -right-10 top-3 rotate-12 bg-[#0CA768] text-white text-[10px] font-black py-0.5 px-10 shadow-[0_2px_0_#cc6e00] flex items-center gap-1 justify-center">
                  <Heart className="w-3 h-3 text-white fill-current" />
                  <span>{relationship.status === 'casado' ? 'ALMA GÊMEA' : 'NAMORANDO SÉRIAMENTE'}</span>
                </div>

                <div className="flex items-start gap-3.5">
                  {/* Mini Diorama / Avatar Toy Lego Patrícia */}
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-[#ffd166] flex items-center justify-center shadow-[0_3px_0_#c49746] overflow-hidden p-0.5 border border-[#e2cca6]">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwmRro_X3tuA0YNWo3KjWuzLMxurDvXHXQh2fNybUAS-lzZqGmqC9Sx3qk9fx2SMmd2M1uQfLlgQvZPJJTmTMY-OkM76SXxJXGnYLhAnIRJC9pYDkaPGZuWH2Mp-0P0YVlw8ZSivOOQzz2StYX6fzuS1otAoOfEFc7S55tYqz70ndZyLF-3aEohYZf5iSlyWBf9EIOXEcp-or5w2qw7EB0OrFaIGRBKMNxp7LrSHWW"
                        alt="Patrícia"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0CA768] flex items-center justify-center shadow-[0_1.5px_0_#cc6e00]">
                      <Heart className="w-3.5 h-3.5 text-white fill-current" />
                    </div>
                  </div>

                  {/* Dados e Fase do Relacionamento */}
                  <div className="flex flex-col min-w-0 flex-1 pr-6">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h2 className="text-lg font-black text-slate-900 truncate">
                        {relationship.partnerName || 'Patrícia Monteiro'}
                      </h2>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-900 text-[10px] font-black border border-slate-200">
                        {relationship.status === 'casado' ? 'Esposa' : 'Noiva'} • 26a
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs flex items-center gap-1.5 mt-0.5 font-medium">
                      <Compass className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{relationship.partnerJob || 'Arquiteta e Urbanista (Ateliê Vila Madalena)'}</span>
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-[#fff3d6] px-2.5 py-1 rounded-lg self-start border border-[#ff9f1c]/30">
                      <Gem className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Fase: Planejando Casamento na Praia 💍</span>
                    </div>
                  </div>
                </div>

                {/* Termômetro de Sintonia & Cumplicidade */}
                <div className="flex flex-col gap-1 mt-1 bg-slate-100 p-3 rounded-xl shadow-[0_2px_0_#d8bd92] border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <HandHeart className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs text-slate-900 font-bold">Sintonia & Cumplicidade</span>
                    </div>
                    <span className="text-xs text-emerald-600 font-black">{relationship.affection}% • Máxima Harmonia</span>
                  </div>
                  <div className="relative w-full h-3 bg-[#e2cca6] rounded-full overflow-hidden p-0.5 flex items-center shadow-inner">
                    <div
                      className="h-full bg-[#0CA768] rounded-full relative flex items-center justify-end pr-1 transition-all duration-500 shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                      style={{ width: `${relationship.affection}%` }}
                    >
                      <div className="w-1.5 h-1.5 bg-white rounded-full opacity-80 animate-ping"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. GRANDE PASSO / MARCO DA VIDA (Lego Event Brick) */}
              <div
                onClick={() => {
                  playClickSound();
                  if (onOpenWeddingPlanner) {
                    onOpenWeddingPlanner();
                  } else {
                    handlePartnerClick('propose_marriage');
                  }
                }}
                className="w-full rounded-2xl bg-[#ffd166] p-4 shadow-[0_4px_0_#dca52d] flex flex-col gap-2 relative overflow-hidden cursor-pointer active:translate-y-0.5 transition-all border border-[#f5b830]"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-[#0CA768] text-white text-[10px] font-black shadow-[0_1px_0_#cc6e00]">
                    Grande Passo da Vida
                  </span>
                  <Church className="w-6 h-6 text-slate-900" />
                </div>
                <h3 className="text-base font-black text-slate-900">Planejamento do Casamento dos Sonhos 💍</h3>
                <p className="text-xs text-slate-600 leading-snug font-medium">
                  Selecione o orçamento, a temporada da cerimônia, o local (praia, campo ou salão) e gerencie a lista de convidados!
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    if (onOpenWeddingPlanner) {
                      onOpenWeddingPlanner();
                    } else {
                      handlePartnerClick('propose_marriage');
                    }
                  }}
                  className="mt-1 w-full py-2.5 px-4 rounded-xl bg-[#0CA768] text-white text-xs shadow-[0_4px_0_#cc6e00] flex items-center justify-center gap-2 active:translate-y-1 transition-all font-black cursor-pointer"
                >
                  <Church className="w-4 h-4 text-white" />
                  <span>Abrir Planejador &amp; Escolher Buffet 💍</span>
                </button>
              </div>

              {/* 3. SEÇÃO: GESTOS DE AMOR COTIDIANO */}
              <div className="flex flex-col gap-2 mt-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0CA768]"></span>
                    <h3 className="text-base text-slate-900 font-black">Gestos de Amor Cotidiano</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => { playClickSound(); setShowMoreLoveGestures(!showMoreLoveGestures); }}
                    className="text-xs text-emerald-600 hover:text-[#d97706] bg-slate-100 hover:bg-[#ebd9c1] px-3 py-1 rounded-full font-black border border-slate-200 shadow-[0_2px_0_#d8bd92] active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showMoreLoveGestures ? 'Menos' : 'Mais'}</span>
                    {showMoreLoveGestures ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {/* Café na Cama */}
                  <div className="rounded-xl bg-[#fffdf7] p-3 shadow-sm flex items-center justify-between gap-3 border border-slate-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-[0_2px_0_#d8bd92]">
                        <Coffee className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-slate-900 truncate font-bold">Levar Café na Cama com Bilhete</span>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5 text-[10px]">
                          <span className="text-emerald-600 font-black">+15 Afeto</span>
                          <span className="text-[#d97706] font-bold">• +10 Feliz</span>
                          <span className="text-rose-600 font-bold">• -R$ 20</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePartnerClick('cozinhar_juntos')}
                      className="px-3 py-1.5 rounded-xl bg-[#0CA768] text-white text-xs shadow-[0_3px_0_#076940] shrink-0 active:translate-y-0.5 transition-all font-bold cursor-pointer"
                    >
                      Fazer
                    </button>
                  </div>

                  {/* Massagem Pós-Trabalho */}
                  <div className="rounded-xl bg-[#fffdf7] p-3 shadow-sm flex items-center justify-between gap-3 border border-slate-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#059669] shrink-0 shadow-[0_2px_0_#d8bd92]">
                        <Sparkles className="w-5 h-5 text-[#059669]" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-slate-900 truncate font-bold">Massagem Pós-Trabalho</span>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5 text-[10px]">
                          <span className="text-emerald-600 font-black">+20 Sintonia</span>
                          <span className="text-slate-600 font-bold">• Alivia Estresse</span>
                          <span className="text-rose-600 font-bold">• -10 Energia</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePartnerClick('massagem_relaxante')}
                      className="px-3 py-1.5 rounded-xl bg-[#0CA768] text-white text-xs shadow-[0_3px_0_#076940] shrink-0 active:translate-y-0.5 transition-all font-bold cursor-pointer"
                    >
                      Relaxar
                    </button>
                  </div>

                  {/* Elogiar Projeto */}
                  <div className="rounded-xl bg-[#fffdf7] p-3 shadow-sm flex items-center justify-between gap-3 border border-slate-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-[0_2px_0_#d8bd92]">
                        <Pencil className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-slate-900 truncate font-bold">Elogiar Projeto de Arquitetura</span>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5 text-[10px]">
                          <span className="text-emerald-600 font-black">+15 Cumplicidade</span>
                          <span className="text-[#059669] font-bold">• Grátis</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePartnerClick('conversa_futuro')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-900 text-xs shadow-[0_3px_0_#d8bd92] shrink-0 active:translate-y-0.5 transition-all font-bold cursor-pointer"
                    >
                      Conversar
                    </button>
                  </div>

                  {/* Girassóis & Trufas */}
                  <div className="rounded-xl bg-[#fffdf7] p-3 shadow-sm flex items-center justify-between gap-3 border border-slate-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#ffd166] flex items-center justify-center text-slate-900 shrink-0 shadow-[0_2px_0_#c49746]">
                        <Flower2 className="w-5 h-5 text-slate-900" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-slate-900 truncate font-bold">Girassóis & Trufas Paulistanas</span>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5 text-[10px]">
                          <span className="text-emerald-600 font-black">+35 Afeto Máx</span>
                          <span className="text-rose-600 font-bold">• -R$ 85</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePartnerClick('give_gift')}
                      className="px-3 py-1.5 rounded-xl bg-[#0CA768] text-white text-xs shadow-[0_3px_0_#076940] shrink-0 active:translate-y-0.5 transition-all font-bold cursor-pointer"
                    >
                      Presentear
                    </button>
                  </div>

                  {/* OPÇÕES EXPANDIDAS AO CLICAR EM MAIS */}
                  {showMoreLoveGestures && (
                    <>
                      {/* Cozinhar Jantar Romântico */}
                      <div className="rounded-xl bg-[#fffdf7] p-3 shadow-sm flex items-center justify-between gap-3 border border-slate-200 animate-fade-in">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-[0_2px_0_#d8bd92]">
                            <Utensils className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs text-slate-900 truncate font-bold">Cozinhar Jantar com Vinho</span>
                            <div className="flex items-center gap-1.5 flex-wrap mt-0.5 text-[10px]">
                              <span className="text-emerald-600 font-black">+22 Afeto</span>
                              <span className="text-[#d97706] font-bold">• +15 Feliz</span>
                              <span className="text-rose-600 font-bold">• -R$ 45</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePartnerClick('cozinhar_juntos')}
                          className="px-3 py-1.5 rounded-xl bg-[#0CA768] text-white text-xs shadow-[0_3px_0_#076940] shrink-0 active:translate-y-0.5 transition-all font-bold cursor-pointer"
                        >
                          Cozinhar
                        </button>
                      </div>

                      {/* Dançar na Sala */}
                      <div className="rounded-xl bg-[#fffdf7] p-3 shadow-sm flex items-center justify-between gap-3 border border-slate-200 animate-fade-in">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-[0_2px_0_#d8bd92]">
                            <Music className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs text-slate-900 truncate font-bold">Dançar Juntinhos ao Som de MPB</span>
                            <div className="flex items-center gap-1.5 flex-wrap mt-0.5 text-[10px]">
                              <span className="text-emerald-600 font-black">+20 Sintonia</span>
                              <span className="text-[#059669] font-bold">• Grátis</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePartnerClick('romantic_date')}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-900 text-xs shadow-[0_3px_0_#d8bd92] shrink-0 active:translate-y-0.5 transition-all font-bold cursor-pointer"
                        >
                          Dançar
                        </button>
                      </div>

                      {/* Mandar Mensagem no WhatsApp */}
                      <div className="rounded-xl bg-[#fffdf7] p-3 shadow-sm flex items-center justify-between gap-3 border border-slate-200 animate-fade-in">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-[0_2px_0_#d8bd92]">
                            <MessageCircle className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs text-slate-900 truncate font-bold">Mandar Mensagem Apaixonada</span>
                            <div className="flex items-center gap-1.5 flex-wrap mt-0.5 text-[10px]">
                              <span className="text-emerald-600 font-black">+15 Afeto</span>
                              <span className="text-[#059669] font-bold">• Grátis</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePartnerClick('conversa_futuro')}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-900 text-xs shadow-[0_3px_0_#d8bd92] shrink-0 active:translate-y-0.5 transition-all font-bold cursor-pointer"
                        >
                          Mandar
                        </button>
                      </div>

                      {/* Assistir Série */}
                      <div className="rounded-xl bg-[#fffdf7] p-3 shadow-sm flex items-center justify-between gap-3 border border-slate-200 animate-fade-in">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-[0_2px_0_#d8bd92]">
                            <Tv className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs text-slate-900 truncate font-bold">Maratona de Série no Sofá</span>
                            <div className="flex items-center gap-1.5 flex-wrap mt-0.5 text-[10px]">
                              <span className="text-emerald-600 font-black">+18 Afeto</span>
                              <span className="text-[#d97706] font-bold">• +10 Feliz</span>
                              <span className="text-rose-600 font-bold">• -R$ 15</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePartnerClick('noite_cinema')}
                          className="px-3 py-1.5 rounded-xl bg-[#0CA768] text-white text-xs shadow-[0_3px_0_#076940] shrink-0 active:translate-y-0.5 transition-all font-bold cursor-pointer"
                        >
                          Assistir
                        </button>
                      </div>

                      {/* Preparar Banho Relaxante */}
                      <div className="rounded-xl bg-[#fffdf7] p-3 shadow-sm flex items-center justify-between gap-3 border border-slate-200 animate-fade-in">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-[0_2px_0_#d8bd92]">
                            <Bath className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs text-slate-900 truncate font-bold">Banho Relaxante Perfumado a Dois</span>
                            <div className="flex items-center gap-1.5 flex-wrap mt-0.5 text-[10px]">
                              <span className="text-emerald-600 font-black">+25 Afeto</span>
                              <span className="text-slate-600 font-bold">• -10 Energia</span>
                              <span className="text-rose-600 font-bold">• -R$ 30</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePartnerClick('massagem_relaxante')}
                          className="px-3 py-1.5 rounded-xl bg-[#0CA768] text-white text-xs shadow-[0_3px_0_#076940] shrink-0 active:translate-y-0.5 transition-all font-bold cursor-pointer"
                        >
                          Preparar
                        </button>
                      </div>

                      {/* Caixinha de Doces Artesanais */}
                      <div className="rounded-xl bg-[#fffdf7] p-3 shadow-sm flex items-center justify-between gap-3 border border-slate-200 animate-fade-in">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-[#ffd166] flex items-center justify-center text-slate-900 shrink-0 shadow-[0_2px_0_#c49746]">
                            <Gift className="w-5 h-5 text-slate-900" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs text-slate-900 truncate font-bold">Caixa de Trufas & Bilhete Secreto</span>
                            <div className="flex items-center gap-1.5 flex-wrap mt-0.5 text-[10px]">
                              <span className="text-emerald-600 font-black">+30 Afeto</span>
                              <span className="text-rose-600 font-bold">• -R$ 40</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePartnerClick('give_gift')}
                          className="px-3 py-1.5 rounded-xl bg-[#0CA768] text-white text-xs shadow-[0_3px_0_#076940] shrink-0 active:translate-y-0.5 transition-all font-bold cursor-pointer"
                        >
                          Presentear
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 4. SEÇÃO: ENCONTROS & EXPERIÊNCIAS (Grid 2x2 com imagens estilo Studio Ghibli) */}
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffd166]"></span>
                    <h3 className="text-base text-slate-900 font-black">Encontros & Experiências</h3>
                  </div>
                  <span className="text-xs text-slate-600 font-medium">Memórias 📸</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Card 1: Jantar Bistrô */}
                  <div className="rounded-2xl bg-[#fffdf7] p-3 shadow-sm flex flex-col justify-between gap-2 border border-slate-200">
                    <div className="w-full h-24 rounded-xl overflow-hidden relative shadow-inner bg-slate-100">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnZz_1EI7LxyeB8GteIkLoJY0yOJCGINI2u35VBq5Txa016m3T7roZRYOol1rBqc2b6_ir6257VpcJen0CnSImqvZNKN8a6kwydsmpEba0jvp1AvmyF6bC_w9hfEkXt3JJIKzzprupYLaKrEgQg-ywFGU0IgW6DeYbbmzWgVrXSfsV6ZB7XxTBR2sLJp0ASeqmNHXT-_4pI_RnSzZFkYFZcFaoiBKN2KMBN6uby3DF"
                        alt="Jantar à Luz de Velas"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black shadow-xs">-R$ 180</span>
                    </div>
                    <div>
                      <h4 className="text-xs text-slate-900 truncate font-bold">Jantar à Luz de Velas</h4>
                      <p className="text-[11px] text-slate-600 truncate">Bistrô charmoso em Pinheiros</p>
                      <span className="inline-block mt-1 text-[10px] text-emerald-600 font-black">+30 Romance</span>
                    </div>
                    <button
                      onClick={() => handlePartnerClick('romantic_date')}
                      className="w-full py-1.5 rounded-xl bg-slate-100 text-slate-900 text-xs shadow-[0_2px_0_#d8bd92] active:translate-y-0.5 transition-all font-bold cursor-pointer"
                    >
                      Reservar Mesa
                    </button>
                  </div>

                  {/* Card 2: Maratona Ghibli */}
                  <div className="rounded-2xl bg-[#fffdf7] p-3 shadow-sm flex flex-col justify-between gap-2 border border-slate-200">
                    <div className="w-full h-24 rounded-xl overflow-hidden relative shadow-inner bg-slate-100">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDr8_ZNA3bZQ2JsAZGLbqAO3EddF2_22nbzNvVxyOdJ8yJbT52WzFJYzsLVCy2c7IdKZ0IKrH-RnLPSKWFsI7YA77g8TAnnC9NFA96IPA7qDYQ96kyGig8rNL13QgFQqc9O9ZPD2kTitHzOWa1UvRvpYCnZPZiVjCCPJVhJ0sffHi9DzqrTtDR2dFsz0FziihROFyHOtWJv3y4mjfVel8A-9VjzDBqhyELpolJ1jqHG"
                        alt="Maratona de Filmes"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-[#059669] text-white text-[10px] font-black shadow-xs">Grátis</span>
                    </div>
                    <div>
                      <h4 className="text-xs text-slate-900 truncate font-bold">Maratona de Filmes</h4>
                      <p className="text-[11px] text-slate-600 truncate">Pipoca de panela & cobertor</p>
                      <span className="inline-block mt-1 text-[10px] text-emerald-600 font-black">+25 Aconchego</span>
                    </div>
                    <button
                      onClick={() => handlePartnerClick('romantic_date')}
                      className="w-full py-1.5 rounded-xl bg-[#0CA768] text-white text-xs shadow-[0_2px_0_#cc6e00] active:translate-y-0.5 transition-all font-bold cursor-pointer"
                    >
                      Iniciar Sessão
                    </button>
                  </div>

                  {/* Card 3: Piquenique Parque */}
                  <div className="rounded-2xl bg-[#fffdf7] p-3 shadow-sm flex flex-col justify-between gap-2 border border-slate-200">
                    <div className="w-full h-24 rounded-xl overflow-hidden relative shadow-inner bg-slate-100">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRRcTeARXdzkOKeX1hTa_TxEKuMe3vjuuapxN1UxA6NyS7w9fci_nh2_TPsBjT_LQFj2G3de1c0huFFRLgsY4ToJtJ7Gc0FPIOBQGN6JD7_ds-jkvgW8py7SGWeawGH65bBPmqCz2txIg7QDUSUGEitfnHKUZVVLDm37RaBSXDFmDQoSLtVCFDqAgBVnTeuCIkep4rxXmG9-JPjbxdikT7gWk7eiSS9nj8MgcWlpvY"
                        alt="Piquenique no Parque"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black shadow-xs">-R$ 45</span>
                    </div>
                    <div>
                      <h4 className="text-xs text-slate-900 truncate font-bold">Piquenique no Parque</h4>
                      <p className="text-[11px] text-slate-600 truncate">Domingo de sol no Ibirapuera</p>
                      <span className="inline-block mt-1 text-[10px] text-emerald-600 font-black">+20 Afeto • +15 Saúde</span>
                    </div>
                    <button
                      onClick={() => handlePartnerClick('romantic_date')}
                      className="w-full py-1.5 rounded-xl bg-slate-100 text-slate-900 text-xs shadow-[0_2px_0_#d8bd92] active:translate-y-0.5 transition-all font-bold cursor-pointer"
                    >
                      Montar Cesta
                    </button>
                  </div>

                  {/* Card 4: Fim de Semana na Serra */}
                  <div className="rounded-2xl bg-[#fffdf7] p-3 shadow-sm flex flex-col justify-between gap-2 border border-slate-200">
                    <div className="w-full h-24 rounded-xl overflow-hidden relative shadow-inner bg-[#ffd166]">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0pulSitVL5eohHGvyIyYQsaGI7Hze3T6kt74z0KWzEoLY-CNkI95ZnTrKGO0nNmnqggHfSfd-8JfyRtyr74mZJr24WkKonNI6S2hadJMr7Gv6tauNhNT2LD_rcs8RUFFAdAlRowHQawlABwtisCKrQHaN5wGami_wA2XXqoO1fbrIaXEozFoPulYSBbkjv3DV04U1f2KUF93hLsQYLEWxnxzbAeMi3ti7KgHCFDZz"
                        alt="Fim de Semana na Serra"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black shadow-xs">-R$ 650</span>
                    </div>
                    <div>
                      <h4 className="text-xs text-slate-900 truncate font-bold">Fim de Semana na Serra</h4>
                      <p className="text-[11px] text-slate-600 truncate">Campos do Jordão com lareira</p>
                      <span className="inline-block mt-1 text-[10px] text-emerald-600 font-black">+60 Romance Épico</span>
                    </div>
                    <button
                      onClick={() => handlePartnerClick('romantic_date')}
                      className="w-full py-1.5 rounded-xl bg-[#0CA768] text-white text-xs shadow-[0_2px_0_#cc6e00] active:translate-y-0.5 transition-all font-bold cursor-pointer"
                    >
                      Viajar Juntos
                    </button>
                  </div>
                </div>
              </div>

              {/* 5. SEÇÃO: INTIMIDADE & VIDA CONJUNTA */}
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0CA768]"></span>
                  <h3 className="text-base text-slate-900 font-black">Intimidade & Futuro Compartilhado</h3>
                </div>
                <div className="rounded-2xl bg-slate-100 p-3 shadow-[0_3px_0_#d8bd92] flex flex-col gap-2 border border-slate-200">
                  {/* Conversa sobre o Futuro */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#fffdf7] shadow-[0_2px_0_#e8d5b7]">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Conversa sobre Filhos & Futuro</p>
                        <p className="text-[11px] text-slate-600">+20 Cumplicidade • Alinha Metas</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePartnerClick('conversa_futuro')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-900 text-xs shadow-[0_2px_0_#d8bd92] active:translate-y-0.5 transition-all font-bold cursor-pointer"
                    >
                      Conversar
                    </button>
                  </div>

                  {/* Massagem Sensual */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#fffdf7] shadow-[0_2px_0_#e8d5b7]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Massagem Sensual com Óleos</p>
                        <p className="text-[11px] text-slate-600">+25 Conexão Íntima • -R$ 35</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePartnerClick('massagem_relaxante')}
                      className="px-3 py-1.5 rounded-xl bg-[#0CA768] text-white text-xs shadow-[0_2px_0_#cc6e00] active:translate-y-0.5 transition-all font-bold cursor-pointer"
                    >
                      Relaxar
                    </button>
                  </div>

                  {/* Noite Íntima Segura */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0CA768] text-white shadow-[0_2px_0_#cc6e00]">
                    <div className="flex items-center gap-2">
                      <Moon className="w-5 h-5 text-white fill-current" />
                      <div>
                        <p className="text-xs font-bold text-white">Noite Especial & Intimidade Segura</p>
                        <p className="text-[11px] text-amber-100">+40 Harmonia • 100% Protegido</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePartnerClick('intimate_safe')}
                      className="px-3 py-1.5 rounded-xl bg-white text-emerald-600 text-xs shadow-[0_2px_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all font-black cursor-pointer"
                    >
                      Conectar
                    </button>
                  </div>

                  {/* Noite Íntima Sem Proteção (Tentar Bebê) */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#e07a5f] text-white shadow-[0_2px_0_#b55a42]">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-amber-200 fill-current" />
                      <div>
                        <p className="text-xs font-bold text-white">Momento sem Proteção (Tentar Bebê)</p>
                        <p className="text-[11px] text-amber-100">+45 Sintonia • Chance de Gravidez!</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePartnerClick('intimate_unprotected')}
                      className="px-3 py-1.5 rounded-xl bg-white text-[#e07a5f] text-xs shadow-[0_2px_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all font-black cursor-pointer"
                    >
                      Amar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 2: MOMENTOS EM FAMÍLIA (PAIS & IRMÃOS EM LINHAS / CORES RENOVADAS) */}
      {/* ============================================================== */}
      {activeSubTab === 'pais_irmaos' && (
        <div className="space-y-4">
          {/* Mini Cartão dos Pais Base com indicador de Saudade */}
          <div className="bg-slate-100 rounded-2xl p-3.5 border border-slate-200 shadow-[0_2px_0_#d8bd92] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#ffd166] text-slate-900 flex items-center justify-center shrink-0 shadow-[0_2px_0_#c49746]">
                <Users className="w-5 h-5 text-slate-900" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-black text-slate-900 truncate">Sérgio & Cristina Silva</h4>
                <p className="text-[11px] text-slate-600 truncate">Pais amorosos • Casados há 32 anos em SP</p>
              </div>
            </div>
            <div className="w-3 h-3 rounded-full bg-[#0CA768] animate-pulse shrink-0" title="Saudade da Família"></div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#0CA768]"></span>
                <h3 className="text-base text-slate-900 font-black">Familiares (Pais e Irmãos)</h3>
              </div>
              <span className="text-xs text-slate-600 font-bold bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                {parentsList.length + siblingsList.length} Membros
              </span>
            </div>

            {/* LISTA EM LINHAS (UM ABAIXO DO OUTRO COM ESPAÇAMENTO ADEQUADO) */}
            <div className="flex flex-col gap-3.5">
              {/* RENDERING PAIS */}
              {parentsList.map((parent, index) => {
                const isMother = parent.role.toLowerCase().includes('mãe') || parent.role.toLowerCase().includes('madrasta');
                const headId = isMother ? 'profissional' : 'executivo';
                return (
                  <div
                    key={`parent_${index}`}
                    className="flex flex-col gap-3 p-4 rounded-2xl bg-[#fffdf7] shadow-sm border border-slate-200 transition-all hover:border-[#ff9f1c]"
                  >
                    {/* Top Row: Avatar + Info + Affection Bar */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative shrink-0 flex flex-col items-center">
                          <div className="w-3.5 h-1.5 bg-[#ffd166] rounded-t-sm shadow-[0_1px_0_#c49746]"></div>
                          <div className="relative w-14 h-14 rounded-xl bg-[#ffd166] flex items-center justify-center shadow-[0_3px_0_#c49746] overflow-hidden p-1">
                            <LegoMinifigHead avatarId={headId} size="md" className="w-full h-full" />
                          </div>
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-black text-slate-900 truncate">{parent.name}</h4>
                            <span className="px-2 py-0.5 rounded-full bg-[#0CA768] text-white text-[10px] font-black">
                              {parent.role}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium mt-0.5">
                            {parent.age} anos {parent.job ? `• ${parent.job}` : ''}
                          </p>

                          {/* Progress bar do Afeto */}
                          <div className="flex items-center gap-2 mt-2">
                            <div className="w-full max-w-[140px] h-2 bg-[#e2cca6] rounded-full overflow-hidden shadow-inner">
                              <div
                                className="h-full bg-[#0CA768] rounded-full transition-all duration-300"
                                style={{ width: `${parent.affection}%` }}
                              ></div>
                            </div>
                            <span className="text-[11px] text-emerald-600 font-black">{parent.affection}% Afeto</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Botões Interativos em Linha de Ações */}
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#f0e2cb]">
                      <button
                        onClick={() => {
                          playClickSound();
                          showMsg(onDoFamilyAction('conversar', parent.name));
                        }}
                        className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-[#ebd9c1] text-slate-900 text-xs font-bold shadow-[0_2px_0_#d8bd92] active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Conversar</span>
                      </button>

                      <button
                        onClick={() => {
                          playClickSound();
                          showMsg(onRequestFamilyMoney(parent.name));
                        }}
                        className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-[#ebd9c1] text-slate-900 text-xs font-bold shadow-[0_2px_0_#d8bd92] active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Gift className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pedir R$</span>
                      </button>

                      <button
                        onClick={() => {
                          playClickSound();
                          setSelectedMember({
                            name: parent.name,
                            role: parent.role,
                            affection: parent.affection,
                            type: 'parent',
                            age: parent.age
                          });
                        }}
                        className="py-2 px-2.5 rounded-xl bg-[#0CA768] text-white text-xs font-bold shadow-[0_2px_0_#cc6e00] active:translate-y-0.5 transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>+ Ações</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* RENDERING IRMÃOS */}
              {siblingsList.map((sibling, index) => {
                const headId = sibling.gender === 'F' ? 'estudante' : 'crianca';
                const roleName = sibling.gender === 'F' ? 'Irmã' : 'Irmão';
                return (
                  <div
                    key={`sibling_${sibling.id || index}`}
                    className="flex flex-col gap-3 p-4 rounded-2xl bg-[#fffdf7] shadow-sm border border-slate-200 transition-all hover:border-[#ff9f1c]"
                  >
                    {/* Top Row: Avatar + Info + Affection Bar */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative shrink-0 flex flex-col items-center">
                          <div className="w-3.5 h-1.5 bg-[#ffd166] rounded-t-sm shadow-[0_1px_0_#c49746]"></div>
                          <div className="relative w-14 h-14 rounded-xl bg-[#ffd166] flex items-center justify-center shadow-[0_3px_0_#c49746] overflow-hidden p-1">
                            <LegoMinifigHead avatarId={headId} size="md" className="w-full h-full" />
                          </div>
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-black text-slate-900 truncate">{sibling.name}</h4>
                            <span className="px-2 py-0.5 rounded-full bg-[#ffd166] text-slate-900 text-[10px] font-black border border-[#dca52d]">
                              {roleName}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium mt-0.5">
                            {sibling.age} anos • Família
                          </p>

                          {/* Progress bar do Afeto */}
                          <div className="flex items-center gap-2 mt-2">
                            <div className="w-full max-w-[140px] h-2 bg-[#e2cca6] rounded-full overflow-hidden shadow-inner">
                              <div
                                className="h-full bg-[#0CA768] rounded-full transition-all duration-300"
                                style={{ width: `${sibling.affection}%` }}
                              ></div>
                            </div>
                            <span className="text-[11px] text-emerald-600 font-black">{sibling.affection}% Afeto</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Botões Interativos do Irmão(ã) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1 border-t border-[#f0e2cb]">
                      <button
                        onClick={() => {
                          playClickSound();
                          showMsg(onDoFamilyAction('conversar', sibling.name));
                        }}
                        className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-[#ebd9c1] text-slate-900 text-xs font-bold shadow-[0_2px_0_#d8bd92] active:translate-y-0.5 transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="Conversar (+10 Afeto)"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Conversar</span>
                      </button>

                      <button
                        onClick={() => {
                          playClickSound();
                          showMsg(onDoFamilyAction('emprestar_roupa', sibling.name));
                        }}
                        className="py-2 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-slate-900 text-xs font-bold shadow-[0_2px_0_#d8bd92] active:translate-y-0.5 transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="Pegar Roupa Emprestada (+12 Afeto)"
                      >
                        <span className="text-xs">👕</span>
                        <span>Roupa</span>
                      </button>

                      <button
                        onClick={() => {
                          playClickSound();
                          showMsg(onRequestFamilyMoney(sibling.name));
                        }}
                        className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-[#ebd9c1] text-slate-900 text-xs font-bold shadow-[0_2px_0_#d8bd92] active:translate-y-0.5 transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="Pedir Empréstimo (Afeto >= 40)"
                      >
                        <Gift className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pedir R$</span>
                      </button>

                      <button
                        onClick={() => {
                          playClickSound();
                          setSelectedMember({
                            name: sibling.name,
                            role: roleName,
                            affection: sibling.affection,
                            type: 'sibling',
                            age: sibling.age,
                            gender: sibling.gender
                          });
                        }}
                        className="py-2 px-2 rounded-xl bg-[#0CA768] text-white text-xs font-bold shadow-[0_2px_0_#cc6e00] active:translate-y-0.5 transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>+ Ações</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 3: FILHOS & HERDEIROS */}
      {/* ============================================================== */}
      {activeSubTab === 'filhos' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base text-slate-900 font-black">Filhos & Herdeiros</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#0CA768] text-white text-[10px] font-bold shadow-[0_1px_0_#cc6e00]">
                  {childrenCount} Herdeiro(s)
                </span>
              </div>
            </div>

            {family.children && family.children.length > 0 ? (
              <div className="flex flex-col gap-3">
                {family.children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#fffdf7] shadow-[0_2px_8px_rgba(74,53,32,0.05)] border border-slate-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0 flex flex-col items-center">
                        <div className="w-3 h-1.5 bg-[#ffd166] rounded-t-sm shadow-[0_1px_0_#c49746]"></div>
                        <div className="relative w-12 h-12 rounded-xl bg-[#ffd166] flex items-center justify-center shadow-[0_2px_0_#c49746] overflow-hidden p-1">
                          <LegoMinifigHead avatarId={child.gender === 'M' ? 'crianca' : 'estudante'} size="md" className="w-full h-full" />
                        </div>
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs text-slate-900 truncate font-bold">{child.name}</span>
                          <span className="px-1.5 rounded-full bg-slate-100 text-[#7c5c3b] text-[10px] font-bold">
                            {child.age}a
                          </span>
                          {child.isFromEx && (
                            <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[9px] font-black border border-rose-300" title={`Fruto de recaída com ${child.otherParentName || 'Ex'}`}>
                              👶 Bebê de Ex ({child.otherParentName || 'Ex'})
                            </span>
                          )}
                          {child.isUnplanned && !child.isFromEx && (
                            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[9px] font-black border border-amber-300">
                              🍼 Não Planejado
                            </span>
                          )}
                          {child.isExtramarital && (
                            <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 text-[9px] font-black border border-purple-300">
                              Extraconjugal
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-20 h-1.5 bg-[#e2cca6] rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-[#0CA768] rounded-full" style={{ width: `${child.affection}%` }}></div>
                          </div>
                          <span className="text-[10px] text-emerald-600 font-bold">{child.affection}% Afeto</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        playClickSound();
                        setSelectedMember({ 
                          name: child.name, 
                          role: child.isExtramarital ? 'Filho Extraconjugal' : 'Filho(a)', 
                          affection: child.affection, 
                          type: 'child',
                          age: child.age,
                          gender: child.gender
                        });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-900 text-xs shadow-[0_2px_0_#d8bd92] active:translate-y-0.5 transition-all flex items-center gap-1 shrink-0 cursor-pointer font-bold"
                    >
                      <span>Cuidar</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-[#fffdf7] border border-slate-200 text-center space-y-2">
                <span className="text-3xl block">🍼</span>
                <p className="text-xs text-slate-600">Você ainda não tem filhos. Viva momentos com seu parceiro(a) para formar uma família!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 4: PETS */}
      {/* ============================================================== */}
      {activeSubTab === 'pet' && (
        <div className="space-y-4">
          <div className="bg-[#fffdf7] rounded-2xl p-4 border border-slate-200 shadow-[0_4px_16px_rgba(74,53,32,0.06)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#ffd166] flex items-center justify-center text-slate-900 shadow-[0_2px_0_#c49746]">
                  <Dog className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-sm text-slate-900 font-black">Pet de Estimação</h3>
                  <p className="text-xs text-slate-600">Amigo fiel de quatro patas da família</p>
                </div>
              </div>
            </div>

            {pet ? (
              <div
                onClick={() => { playClickSound(); setSelectedMember({ name: pet.name, role: pet.type, affection: 95, type: 'pet', age: pet.age }); }}
                className="p-4 rounded-xl bg-slate-100 hover:bg-[#ebd9c1] border border-slate-200 flex items-center justify-between cursor-pointer transition-all shadow-[0_2px_0_#d8bd92]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#ffd166] flex items-center justify-center shadow-[0_2px_0_#c49746] text-2xl">
                    🐕
                  </div>
                  <div>
                    <h4 className="text-sm text-slate-900 font-black">{pet.name}</h4>
                    <p className="text-xs text-slate-600">{pet.type} ({pet.breed}) • {pet.age} ano(s)</p>
                  </div>
                </div>
                <span className="text-xs text-emerald-600 font-black">Ações & Cuidados ➔</span>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">Escolha um pet para adotar e alegrar sua rotina familiar:</p>
                <div className="grid grid-cols-1 gap-2.5">
                  {AVAILABLE_PETS.map((p, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-2 shadow-[0_2px_0_#d8bd92]">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{p.type.includes('Gato') ? '🐱' : p.type.includes('Capivara') ? '🦫' : '🐕'}</span>
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">{p.name} ({p.breed})</h5>
                          <p className="text-[11px] text-[#7c5c3b]">R$ {p.monthlyCost}/mês • +{p.happinessBonus} Felicidade</p>
                        </div>
                      </div>
                      <button
                        onClick={() => showMsg(onAdoptPet(p))}
                        className="py-1.5 px-3.5 rounded-xl bg-[#0CA768] text-white text-xs hover:bg-[#f08e0b] transition-all cursor-pointer shadow-[0_2px_0_#cc6e00] font-bold"
                      >
                        Adotar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL INTERATIVO DO MEMBRO SELECIONADO */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-[#fffdf7] rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#ffd166] text-slate-900 flex items-center justify-center text-xl font-bold shadow-[0_2px_0_#c49746]">
                  {selectedMember.type === 'partner' ? '💖' : selectedMember.type === 'pet' ? '🐶' : selectedMember.type === 'child' ? '👶' : '👨‍👩‍👧'}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">{selectedMember.name}</h3>
                  <p className="text-xs text-[#7c5c3b]">
                    {selectedMember.role} • Afeto: <strong className="text-emerald-600">{selectedMember.affection}%</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center hover:bg-[#ebd9c1] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* PAIS: OPÇÕES SOCIAIS E AFETIVAS */}
            {selectedMember.type === 'parent' && (
              <div className="space-y-3">
                {/* Seletor de Categoria: Afeto vs Social */}
                <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => { playClickSound(); setParentActionTab('afeto'); }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      parentActionTab === 'afeto' ? 'bg-[#0CA768] text-white shadow-[0_2px_0_#cc6e00]' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Afeto & Cuidado
                  </button>
                  <button
                    type="button"
                    onClick={() => { playClickSound(); setParentActionTab('social'); }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      parentActionTab === 'social' ? 'bg-[#0CA768] text-white shadow-[0_2px_0_#cc6e00]' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Social & Apoio
                  </button>
                </div>

                <div className="space-y-2">
                  {parentActionTab === 'afeto' ? (
                    <>
                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('abraco', selectedMember.name);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-rose-500 fill-current" />
                          <div>
                            <span className="block font-bold">Abraço Apertado & Gratidão</span>
                            <span className="text-[10px] text-emerald-600 font-black">+20 Afeto • +15 Feliz • Grátis</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('cafe_tarde', selectedMember.name, 15);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Coffee className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="block font-bold">Café da Tarde com Bolo de Fubá</span>
                            <span className="text-[10px] text-emerald-600 font-black">+18 Afeto • -R$ 15</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('historias', selectedMember.name);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#d97706]" />
                          <div>
                            <span className="block font-bold">Ouvir Histórias da Juventude & Fotos</span>
                            <span className="text-[10px] text-emerald-600 font-black">+18 Afeto • +15 Intelecto</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('acompanhar_medico', selectedMember.name);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="block font-bold">Acompanhar em Consulta Médica</span>
                            <span className="text-[10px] text-emerald-700 font-bold">+25 Afeto • +12 Saúde • -10 Energia</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('ajudar_casa', selectedMember.name);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="block font-bold">Ajudar em Consertos na Casa</span>
                            <span className="text-[10px] text-slate-600 font-bold">+22 Afeto • -10 Energia</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('dar_presente', selectedMember.name, 80);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#0CA768] text-white font-bold text-xs shadow-[0_2px_0_#cc6e00] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Flower2 className="w-4 h-4 text-white" />
                          <div>
                            <span className="block font-bold">Cesta de Flores & Doces (R$ 80)</span>
                            <span className="text-[10px] text-amber-100 font-bold">+30 Afeto • +20 Feliz</span>
                          </div>
                        </div>
                        <span className="text-xs text-white font-black">➔</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('almoço', selectedMember.name, 60);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Utensils className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="block font-bold">Almoço de Domingo (Feijoada)</span>
                            <span className="text-[10px] text-emerald-600 font-black">+22 Afeto • +20 Feliz • -R$ 60</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('conversar', selectedMember.name);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="block font-bold">Chamada de Vídeo no WhatsApp</span>
                            <span className="text-[10px] text-emerald-600 font-black">+15 Afeto • +10 Feliz • Grátis</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('pedir_conselho', selectedMember.name);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Compass className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="block font-bold">Pedir Conselho de Vida ou Finanças</span>
                            <span className="text-[10px] text-emerald-600 font-black">+15 Afeto • +15 Intelecto</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('enviar_pix', selectedMember.name, 150);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <HandHeart className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="block font-bold">Enviar PIX de Gratidão (R$ 150)</span>
                            <span className="text-[10px] text-emerald-700 font-bold">+30 Afeto • Gratidão Total</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onRequestFamilyMoney(selectedMember.name);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-slate-100 hover:bg-[#ebd9c1] border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="block font-bold">Pedir Ajuda Financeira / Mesada</span>
                            <span className="text-[10px] text-slate-600 font-bold">Depende do Afeto Familiar</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* IRMÃOS: DIVERSÃO, BRINCADEIRAS E DESABAFOS */}
            {selectedMember.type === 'sibling' && (
              <div className="space-y-3">
                <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => { playClickSound(); setSiblingActionTab('lazer'); }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      siblingActionTab === 'lazer' ? 'bg-[#0CA768] text-white shadow-[0_2px_0_#cc6e00]' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Diversão & Lazer
                  </button>
                  <button
                    type="button"
                    onClick={() => { playClickSound(); setSiblingActionTab('afeto'); }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      siblingActionTab === 'afeto' ? 'bg-[#0CA768] text-white shadow-[0_2px_0_#cc6e00]' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Afeto & Cumplicidade
                  </button>
                </div>

                <div className="space-y-2">
                  {siblingActionTab === 'lazer' ? (
                    <>
                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('videogame', selectedMember.name);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Gamepad2 className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="block font-bold">Jogar Videogame ou Futebol</span>
                            <span className="text-[10px] text-emerald-600 font-black">+20 Afeto • +22 Feliz • -5 Energia</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('pizza_fofoca', selectedMember.name, 45);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Utensils className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="block font-bold">Pedir Pizza & Fofocar da Família</span>
                            <span className="text-[10px] text-emerald-600 font-black">+22 Afeto • +18 Feliz • -R$ 45</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('sair_juntos', selectedMember.name, 55);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="block font-bold">Sair para Barzinho ou Lanchonete</span>
                            <span className="text-[10px] text-emerald-600 font-black">+25 Afeto • +20 Feliz • -R$ 55</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('conversar', selectedMember.name);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Smile className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="block font-bold">Contar Piadas e Relembrar Micos</span>
                            <span className="text-[10px] text-emerald-600 font-black">+15 Afeto • +10 Feliz • Grátis</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('briga_irmao', selectedMember.name);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 font-bold text-xs shadow-[0_2px_0_#e11d48] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">⚡</span>
                          <div>
                            <span className="block font-bold text-rose-950">Discutir Feio / Bate-Boca</span>
                            <span className="text-[10px] text-rose-700 font-black">-18 Afeto • -12 Felicidade • Climão</span>
                          </div>
                        </div>
                        <span className="text-xs text-rose-600 font-bold">➔</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('fazer_elogio', selectedMember.name);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">✨</span>
                          <div>
                            <span className="block font-bold text-amber-950">Fazer um Elogio Sincero</span>
                            <span className="text-[10px] text-emerald-700 font-black">+10 Afeto • +8 Felicidade • Carinho</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('emprestar_roupa', selectedMember.name);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">👕</span>
                          <div>
                            <span className="block font-bold">Pegar Roupa Emprestada</span>
                            <span className="text-[10px] text-emerald-600 font-black">+12 Afeto • +10 Felicidade • Look Novo</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('desabafo', selectedMember.name);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="block font-bold">Desabafar sobre Amores e Segredos</span>
                            <span className="text-[10px] text-emerald-600 font-black">+22 Afeto • +15 Feliz • Grátis</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('estudos_ajuda', selectedMember.name);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="block font-bold">Ajudar nos Estudos ou Projetos</span>
                            <span className="text-[10px] text-emerald-600 font-black">+18 Afeto • +16 Intelecto</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('presente', selectedMember.name, 40);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#0CA768] text-white font-bold text-xs shadow-[0_2px_0_#cc6e00] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-white" />
                          <div>
                            <span className="block font-bold">Comprar Doce ou Presente (R$ 40)</span>
                            <span className="text-[10px] text-amber-100 font-bold">+28 Afeto • +20 Feliz</span>
                          </div>
                        </div>
                        <span className="text-xs text-white font-black">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('enviar_pix', selectedMember.name, 80);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <HandHeart className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="block font-bold">Mandar PIX de Socorro (R$ 80)</span>
                            <span className="text-[10px] text-emerald-700 font-bold">+25 Afeto • Ajuda Imediata</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onRequestFamilyMoney(selectedMember.name);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-slate-100 hover:bg-[#ebd9c1] border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="block font-bold">Pedir Empréstimo de Irmão</span>
                            <span className="text-[10px] text-slate-600 font-bold">Se o afeto for alto</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* FILHOS: ALIMENTADO POR FAIXA ETÁRIA E VÍNCULO */}
            {selectedMember.type === 'child' && (() => {
              const childAge = selectedMember.age ?? 0;
              const isBaby = childAge <= 1;
              const isToddler = childAge >= 2 && childAge <= 3;
              const isChild = childAge >= 4 && childAge <= 11;
              const isTeen = childAge >= 12 && childAge <= 17;
              const isAdult = childAge >= 18 && childAge <= 59;
              const isElder = childAge >= 60;

              const stageLabel = isBaby
                ? 'Recém-Nascido / Bebê (0-1a)'
                : isToddler
                ? 'Criança de Colo (2-3a)'
                : isChild
                ? 'Criança (4-11a)'
                : isTeen
                ? 'Adolescente / Estudante (12-17a)'
                : isAdult
                ? 'Filho(a) Adulto(a) (18-59a)'
                : 'Filho(a) Idoso(a) / Maduro(a) (60a+)';

              return (
                <div className="space-y-3">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">{stageLabel}</span>
                    <span className="text-[10px] bg-[#0CA768] text-white px-2 py-0.5 rounded-full font-bold">{childAge} ano(s)</span>
                  </div>

                  <div className="space-y-2">
                    {/* FAIXA 1: BEBÊ / RECÉM-NASCIDO (0-1 ANO) */}
                    {isBaby && (
                      <>
                        <button
                          onClick={() => {
                            const res = onDoFamilyAction('amamentar_mamadeira', selectedMember.name);
                            showMsg(res);
                            setSelectedMember(null);
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">🍼</span>
                            <div>
                              <span className="block font-bold">Dar Mamadeira & Fazer Arrotar</span>
                              <span className="text-[10px] text-emerald-600 font-black">+20 Afeto • +15 Saúde • -5 Energia</span>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-600 font-bold">➔</span>
                        </button>

                        <button
                          onClick={() => {
                            const res = onDoFamilyAction('dar_banho', selectedMember.name);
                            showMsg(res);
                            setSelectedMember(null);
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <Bath className="w-4 h-4 text-sky-500" />
                            <div>
                              <span className="block font-bold">Banho Morno & Trocar Fraldinha</span>
                              <span className="text-[10px] text-emerald-600 font-black">+18 Afeto • +12 Higiene • -5 Energia</span>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-600 font-bold">➔</span>
                        </button>

                        <button
                          onClick={() => {
                            const res = onDoFamilyAction('pediatra', selectedMember.name, 150);
                            showMsg(res);
                            setSelectedMember(null);
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-emerald-600" />
                            <div>
                              <span className="block font-bold">Levar ao Pediatra (Vacinas & Peso)</span>
                              <span className="text-[10px] text-emerald-700 font-bold">+25 Saúde • +15 Afeto • -R$ 150</span>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-600 font-bold">➔</span>
                        </button>

                        <button
                          onClick={() => {
                            const res = onDoFamilyAction('ninar', selectedMember.name);
                            showMsg(res);
                            setSelectedMember(null);
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <Moon className="w-4 h-4 text-indigo-500" />
                            <div>
                              <span className="block font-bold">Ninar no Colo com Cantiga de Roda</span>
                              <span className="text-[10px] text-emerald-600 font-black">+20 Afeto • +18 Feliz • -5 Energia</span>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-600 font-bold">➔</span>
                        </button>
                      </>
                    )}

                    {/* FAIXA 2: CRIANÇA DE COLO (2-3 ANOS) */}
                    {isToddler && (
                      <>
                        <button
                          onClick={() => {
                            const res = onDoFamilyAction('papinha', selectedMember.name);
                            showMsg(res);
                            setSelectedMember(null);
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <Utensils className="w-4 h-4 text-emerald-600" />
                            <div>
                              <span className="block font-bold">Dar Papinha Caseira de Frutas</span>
                              <span className="text-[10px] text-emerald-600 font-black">+18 Afeto • +16 Saúde • Grátis</span>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-600 font-bold">➔</span>
                        </button>

                        <button
                          onClick={() => {
                            const res = onDoFamilyAction('parquinho', selectedMember.name);
                            showMsg(res);
                            setSelectedMember(null);
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <Smile className="w-4 h-4 text-emerald-600" />
                            <div>
                              <span className="block font-bold">Levar ao Parquinho & Balanço</span>
                              <span className="text-[10px] text-emerald-600 font-black">+25 Afeto • +25 Feliz • -10 Energia</span>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-600 font-bold">➔</span>
                        </button>
                      </>
                    )}

                    {/* FAIXA 3: CRIANÇA (4-11 ANOS) */}
                    {isChild && (
                      <>
                        <button
                          onClick={() => {
                            const res = onDoFamilyAction('ajudar_dever', selectedMember.name);
                            showMsg(res);
                            setSelectedMember(null);
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-emerald-600" />
                            <div>
                              <span className="block font-bold">Ajudar no Dever de Casa & Escola</span>
                              <span className="text-[10px] text-emerald-600 font-black">+20 Afeto • +22 Intelecto • Grátis</span>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-600 font-bold">➔</span>
                        </button>

                        <button
                          onClick={() => {
                            const res = onDoFamilyAction('brincar', selectedMember.name);
                            showMsg(res);
                            setSelectedMember(null);
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <Smile className="w-4 h-4 text-emerald-600" />
                            <div>
                              <span className="block font-bold">Jogar Bola / Brincar no Parque</span>
                              <span className="text-[10px] text-emerald-600 font-black">+25 Afeto • +25 Feliz • -10 Energia</span>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-600 font-bold">➔</span>
                        </button>
                      </>
                    )}

                    {/* FAIXA 4: ADOLESCENTE / JOVEM (12-17 ANOS) */}
                    {isTeen && (
                      <>
                        <button
                          onClick={() => {
                            const res = onDoFamilyAction('conversa_jovem', selectedMember.name);
                            showMsg(res);
                            setSelectedMember(null);
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-emerald-600" />
                            <div>
                              <span className="block font-bold">Conversa Aberta sobre Sonhos & Amigos</span>
                              <span className="text-[10px] text-emerald-600 font-black">+22 Afeto • +16 Cumplicidade</span>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-600 font-bold">➔</span>
                        </button>

                        <button
                          onClick={() => {
                            const res = onDoFamilyAction('orientar_carreira', selectedMember.name);
                            showMsg(res);
                            setSelectedMember(null);
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <Compass className="w-4 h-4 text-indigo-500" />
                            <div>
                              <span className="block font-bold">Orientar sobre Vestibular & Escolha de Carreira</span>
                              <span className="text-[10px] text-emerald-600 font-black">+20 Afeto • +25 Intelecto</span>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-600 font-bold">➔</span>
                        </button>

                        <button
                          onClick={() => {
                            const res = onDoFamilyAction('mesada_educacao', selectedMember.name, 120);
                            showMsg(res);
                            setSelectedMember(null);
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <HandHeart className="w-4 h-4 text-emerald-600" />
                            <div>
                              <span className="block font-bold">Dar Mesada & Educação Financeira</span>
                              <span className="text-[10px] text-emerald-700 font-bold">+25 Afeto • +25 Feliz • -R$ 120</span>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-600 font-bold">➔</span>
                        </button>
                      </>
                    )}

                    {/* FAIXA 5: FILHO(A) ADULTO(A) (18-59 ANOS) */}
                    {isAdult && (
                      <>
                        <button
                          onClick={() => {
                            const res = onDoFamilyAction('cafe_tarde', selectedMember.name, 25);
                            showMsg(res);
                            setSelectedMember(null);
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <Coffee className="w-4 h-4 text-amber-600" />
                            <div>
                              <span className="block font-bold">Tomar Café & Conversar sobre Carreira & Família</span>
                              <span className="text-[10px] text-emerald-600 font-black">+25 Afeto • +20 Felicidade • -R$ 25</span>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-600 font-bold">➔</span>
                        </button>

                        <button
                          onClick={() => {
                            const res = onDoFamilyAction('visita_casa', selectedMember.name);
                            showMsg(res);
                            setSelectedMember(null);
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-emerald-600" />
                            <div>
                              <span className="block font-bold">Visitar a Casa do Filho & Conhecer os Netos</span>
                              <span className="text-[10px] text-emerald-600 font-black">+30 Afeto • +25 Felicidade</span>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-600 font-bold">➔</span>
                        </button>

                        <button
                          onClick={() => {
                            const res = onDoFamilyAction('conselho_financeiro', selectedMember.name);
                            showMsg(res);
                            setSelectedMember(null);
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <Landmark className="w-4 h-4 text-indigo-500" />
                            <div>
                              <span className="block font-bold">Trocar Conselhos de Vida & Finanças</span>
                              <span className="text-[10px] text-emerald-600 font-black">+20 Intelecto • +20 Afeto</span>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-600 font-bold">➔</span>
                        </button>

                        <button
                          onClick={() => {
                            const res = onDoFamilyAction('almoco_familia', selectedMember.name, 120);
                            showMsg(res);
                            setSelectedMember(null);
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#0CA768] text-white font-bold text-xs shadow-[0_2px_0_#cc6e00] flex items-center justify-between text-left cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <Utensils className="w-4 h-4 text-white" />
                            <div>
                              <span className="block font-bold">Presentear com Almoço Especial em Família (R$ 120)</span>
                              <span className="text-[10px] text-amber-100 font-bold">+30 Afeto • +25 Felicidade</span>
                            </div>
                          </div>
                          <span className="text-xs text-white font-black">➔</span>
                        </button>
                      </>
                    )}

                    {/* FAIXA 6: FILHO(A) IDOSO(A) / MADURO(A) (60+ ANOS) */}
                    {isElder && (
                      <>
                        <button
                          onClick={() => {
                            const res = onDoFamilyAction('cha_tarde_idoso', selectedMember.name);
                            showMsg(res);
                            setSelectedMember(null);
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <Coffee className="w-4 h-4 text-amber-600" />
                            <div>
                              <span className="block font-bold">Chá da Tarde & Relembrar a História da Família</span>
                              <span className="text-[10px] text-emerald-600 font-black">+30 Afeto • +30 Felicidade</span>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-600 font-bold">➔</span>
                        </button>

                        <button
                          onClick={() => {
                            const res = onDoFamilyAction('acompanhar_medico_idoso', selectedMember.name);
                            showMsg(res);
                            setSelectedMember(null);
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-emerald-600" />
                            <div>
                              <span className="block font-bold">Preocupar-se com Saúde & Acompanhar ao Médico</span>
                              <span className="text-[10px] text-emerald-700 font-bold">+25 Saúde • +25 Afeto</span>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-600 font-bold">➔</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* PETS: CUIDADOS DE LIMPEZA, ALIMENTAÇÃO, SOCIAL E SAÚDE */}
            {selectedMember.type === 'pet' && (
              <div className="space-y-3">
                {/* Abas de Cuidados do Pet */}
                <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => { playClickSound(); setPetActionTab('alimentacao'); }}
                    className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      petActionTab === 'alimentacao' ? 'bg-[#0CA768] text-white shadow-[0_2px_0_#cc6e00]' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Alimentar
                  </button>
                  <button
                    type="button"
                    onClick={() => { playClickSound(); setPetActionTab('higiene'); }}
                    className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      petActionTab === 'higiene' ? 'bg-[#0CA768] text-white shadow-[0_2px_0_#cc6e00]' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Higiene
                  </button>
                  <button
                    type="button"
                    onClick={() => { playClickSound(); setPetActionTab('social'); }}
                    className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      petActionTab === 'social' ? 'bg-[#0CA768] text-white shadow-[0_2px_0_#cc6e00]' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Social
                  </button>
                  <button
                    type="button"
                    onClick={() => { playClickSound(); setPetActionTab('saude'); }}
                    className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      petActionTab === 'saude' ? 'bg-[#0CA768] text-white shadow-[0_2px_0_#cc6e00]' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Saúde
                  </button>
                </div>

                <div className="space-y-2">
                  {/* ALIMENTAÇÃO */}
                  {petActionTab === 'alimentacao' && (
                    <>
                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('pet_racao', selectedMember.name, 25);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Bone className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="block font-bold">Servir Ração Super Premium</span>
                            <span className="text-[10px] text-emerald-600 font-black">+18 Feliz • +12 Saúde • -R$ 25</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('pet_petisco', selectedMember.name, 15);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <div>
                            <span className="block font-bold">Dar Petisco Especial / Sachê</span>
                            <span className="text-[10px] text-emerald-600 font-black">+25 Felicidade Máx • -R$ 15</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('pet_higiene_cantinho', selectedMember.name);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Utensils className="w-4 h-4 text-sky-500" />
                          <div>
                            <span className="block font-bold">Água Fresca & Limpar Tigelinhas</span>
                            <span className="text-[10px] text-emerald-600 font-black">+12 Bem-estar • Grátis</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>
                    </>
                  )}

                  {/* HIGIENE */}
                  {petActionTab === 'higiene' && (
                    <>
                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('pet_banho', selectedMember.name, 40);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Bath className="w-4 h-4 text-sky-500" />
                          <div>
                            <span className="block font-bold">Banho Completo com Xampu Especial</span>
                            <span className="text-[10px] text-sky-700 font-bold">+20 Feliz • +16 Higiene • -R$ 40</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('pet_tosa', selectedMember.name, 35);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Scissors className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="block font-bold">Tosa Higiênica & Escovar Pelos</span>
                            <span className="text-[10px] text-emerald-600 font-black">+16 Conforto • -R$ 35</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('pet_higiene_cantinho', selectedMember.name);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="block font-bold">Higienizar Caminha & Caixa de Areia</span>
                            <span className="text-[10px] text-emerald-700 font-bold">+12 Saúde • +12 Conforto • Grátis</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>
                    </>
                  )}

                  {/* SOCIAL */}
                  {petActionTab === 'social' && (
                    <>
                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('pet_passeio', selectedMember.name);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Dog className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="block font-bold">Passeio no Parque ou Calçadão</span>
                            <span className="text-[10px] text-emerald-600 font-black">+25 Feliz • +15 Saúde • -10 Energia</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('pet_brincar', selectedMember.name);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <div>
                            <span className="block font-bold">Brincar de Buscar a Bolinha</span>
                            <span className="text-[10px] text-emerald-600 font-black">+22 Felicidade • -5 Energia</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('pet_carinho', selectedMember.name);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#0CA768] text-white font-bold text-xs shadow-[0_2px_0_#cc6e00] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-white fill-current" />
                          <div>
                            <span className="block font-bold">Cafuné Gostoso na Barriguinha</span>
                            <span className="text-[10px] text-amber-100 font-bold">+20 Felicidade • Amor Puro</span>
                          </div>
                        </div>
                        <span className="text-xs text-white font-black">➔</span>
                      </button>
                    </>
                  )}

                  {/* SAÚDE */}
                  {petActionTab === 'saude' && (
                    <>
                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('pet_veterinario', selectedMember.name, 130);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="block font-bold">Vacinas Anuais & Vermífugo</span>
                            <span className="text-[10px] text-emerald-700 font-bold">+30 Saúde do Pet • -R$ 130</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>

                      <button
                        onClick={() => {
                          const res = onDoFamilyAction('pet_truques', selectedMember.name, 10);
                          showMsg(res);
                          setSelectedMember(null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#fffdf7] hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs shadow-[0_2px_0_#d8bd92] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="block font-bold">Treinar Truques (Dar a Pata & Sentar)</span>
                            <span className="text-[10px] text-emerald-600 font-black">+18 Feliz • +16 Intelecto • -R$ 10</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold">➔</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA: CONHECIDOS & AMIGOS (AMIGOS, AMANTES, EXES, FICANTES) */}
      {/* ============================================================== */}
      {activeSubTab === 'amigos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-[#fffdf7] p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="text-sm font-black text-slate-900">Conhecidos, Amigos & Relacionamentos 🤝</h3>
              <p className="text-xs text-slate-600">Amigos feitos no trabalho, rolês e redes sociais, além de casos amorosos e ex-parceiros(as).</p>
            </div>
            <button
              onClick={() => {
                if (onAddRandomFriend) {
                  const res = onAddRandomFriend();
                  showMsg(res);
                }
              }}
              className="py-2 px-4 rounded-xl bg-[#0CA768] text-white text-xs font-bold shadow-[0_3px_0_#076940] active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>+ Adicionar Contato</span>
            </button>
          </div>

          <div className="space-y-3">
            {(!family.friends || family.friends.length === 0) ? (
              <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-slate-200 text-center space-y-2">
                <Users className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="font-bold text-xs text-slate-800">Sua lista de contatos está vazia</h4>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Clique no botão acima para adicionar contatos, ou use o Tinder / vá aos rolês para conhecer novas pessoas!
                </p>
              </div>
            ) : (
              family.friends.map((friend) => {
                const isEx = friend.type === 'ex';
                return (
                  <div
                    key={friend.id}
                    className={`rounded-2xl p-4 shadow-sm flex flex-col gap-3 transition-all relative overflow-hidden ${
                      isEx
                        ? 'bg-amber-50/40 border-2 border-amber-300 shadow-[0_3px_0_#d97706,0_6px_16px_rgba(217,119,6,0.08)]'
                        : 'bg-[#fffdf7] border border-slate-200 shadow-sm'
                    }`}
                  >
                    {/* Tarjeta / Alerta sutil visual para Ex */}
                    {isEx && (
                      <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9.5px] font-black px-2.5 py-0.5 rounded-bl-xl shadow-xs flex items-center gap-1">
                        <span>⚠️</span>
                        <span>EX-RELACIONAMENTO</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shadow-xs ${
                            isEx
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {isEx ? '💔' : friend.gender === 'F' ? '👩' : '👨'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-black text-slate-900">{friend.name}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              friend.type === 'ex' ? 'bg-amber-100 text-amber-900 border border-amber-400' :
                            friend.type === 'amante' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                            friend.type === 'ficante' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                            friend.type === 'melhor_amigo' ? 'bg-amber-400 text-amber-950 border border-amber-500 shadow-2xs font-black' :
                            friend.type === 'amigo' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                            'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {friend.type === 'ex' ? 'EX-PARCEIRA(O)' : friend.type === 'melhor_amigo' ? '★ MELHOR AMIGO(A)' : friend.type} • {friend.age}a
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{friend.job || 'Profissional'}</p>
                      </div>
                    </div>
                    <div className="text-right text-[11px]">
                      <span className="block text-emerald-600 font-black">Afeto: {friend.affection}%</span>
                      <span className="block text-amber-600 font-bold">Intimidade: {friend.intimacy}%</span>
                    </div>
                  </div>

                  {/* Tarjeta de Recaída Aceita e Opção de Reatar Relacionamento */}
                  {isEx && friend.hadAcceptedRecaida && (
                    <div className="p-3 bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 rounded-xl border-2 border-rose-400 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2.5 animate-pulse">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">💕</span>
                        <div>
                          <p className="text-xs font-black text-rose-950 leading-tight">Recaída foi aceita por ambos!</p>
                          <p className="text-[10.5px] text-rose-800">A chama reacendeu. Vocês podem reatar o namoro oficialmente!</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (onFriendAction) {
                            const res = onFriendAction(friend.id, 'reatar_relacionamento');
                            showMsg(res);
                          }
                        }}
                        className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white text-xs font-black shadow-[0_2px_0_#9f1239] active:translate-y-0.5 transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                      >
                        <span>💕 Reatar Namoro Oficial</span>
                      </button>
                    </div>
                  )}

                  {/* BOTÕES DE AÇÃO RÁPIDA & EXPANSÃO DE INTERAÇÕES */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      {friend.type === 'conhecido' ? (
                        <>
                          <button
                            onClick={() => {
                              if (onFriendAction) {
                                const res = onFriendAction(friend.id, 'cafe_conhecido');
                                showMsg(res);
                              }
                            }}
                            className="flex-1 py-2 px-2.5 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <span>☕ Sair / Chamar p/ Café (R$ 20)</span>
                          </button>
                          <button
                            onClick={() => {
                              if (onFriendAction) {
                                const res = onFriendAction(friend.id, 'bater_papo');
                                showMsg(res);
                              }
                            }}
                            className="flex-1 py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <span>💬 Bater Papo</span>
                          </button>
                        </>
                      ) : friend.type === 'amante' ? (
                        <>
                          <button
                            onClick={() => {
                              if (onFriendAction) {
                                const res = onFriendAction(friend.id, 'motel_secreto');
                                showMsg(res);
                              }
                            }}
                            className="flex-1 py-2 px-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold shadow-[0_2px_0_#581c87] active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <span>🏩 Motel Secreto (R$ 120)</span>
                          </button>
                          <button
                            onClick={() => {
                              if (onFriendAction) {
                                const res = onFriendAction(friend.id, 'mensagem_provocante');
                                showMsg(res);
                              }
                            }}
                            className="flex-1 py-2 px-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <span>🔥 Mensagem Hot</span>
                          </button>
                        </>
                      ) : isEx ? (
                        <>
                          <button
                            onClick={() => {
                              if (onFriendAction) {
                                const res = onFriendAction(friend.id, 'recaida');
                                showMsg(res);
                              }
                            }}
                            className="flex-1 py-2 px-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-[11px] font-black shadow-[0_2px_0_#9f1239] active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1"
                            title="Tentar recaída (R$ 60). Ex pode aceitar ou negar! Se aceito, risco de bebê não planejado."
                          >
                            <span>🔥 Tentar Recaída (R$ 60)</span>
                          </button>
                          <button
                            onClick={() => {
                              if (onFriendAction) {
                                const res = onFriendAction(friend.id, 'conversar_passado_ex');
                                showMsg(res);
                              }
                            }}
                            className="flex-1 py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <span>☕ Conversar</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              if (onFriendAction) {
                                const res = onFriendAction(friend.id, 'social');
                                showMsg(res);
                              }
                            }}
                            className="flex-1 py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <span>💬 Conversar</span>
                          </button>
                          <button
                            onClick={() => {
                              if (onFriendAction) {
                                const res = onFriendAction(friend.id, 'romance');
                                showMsg(res);
                              }
                            }}
                            className="flex-1 py-2 px-2 rounded-xl bg-[#0CA768] text-white text-[11px] font-bold shadow-[0_2px_0_#076940] hover:bg-[#076940] transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <span>❤️ Flertar</span>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => {
                          playClickSound();
                          setExpandedHistoryFriendId(expandedHistoryFriendId === friend.id ? null : friend.id);
                        }}
                        className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-xs ${
                          expandedHistoryFriendId === friend.id
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200'
                        }`}
                      >
                        <span>📜 {expandedHistoryFriendId === friend.id ? 'Fechar' : 'Histórico (5)'}</span>
                      </button>

                      <button
                        onClick={() => {
                          playClickSound();
                          setExpandedFriendId(expandedFriendId === friend.id ? null : friend.id);
                        }}
                        className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-black transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
                      >
                        <span>{expandedFriendId === friend.id ? 'Fechar' : '+ Opções'}</span>
                      </button>
                    </div>

                    {/* CARD EXPANSÍVEL: HISTÓRICO DAS ÚLTIMAS 5 INTERAÇÕES */}
                    {expandedHistoryFriendId === friend.id && (
                      <div className="p-3 bg-gradient-to-br from-indigo-50/70 to-purple-50/60 rounded-xl border border-indigo-200/90 mt-1 animate-fade-in text-left">
                        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-indigo-100">
                          <span className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                            <span>📜</span>
                            <span>Últimas Interações com {friend.name}</span>
                          </span>
                          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                            {(friend.interactionHistory || []).length} registro(s)
                          </span>
                        </div>

                        {(!friend.interactionHistory || friend.interactionHistory.length === 0) ? (
                          <div className="text-center py-2 text-slate-500 text-xs">
                            Nenhuma interação registrada ainda. Realize uma ação para começar a criar memórias!
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            {friend.interactionHistory.slice(0, 5).map((inter, idx) => (
                              <div
                                key={inter.id || idx}
                                className="p-2 bg-white/90 rounded-lg border border-indigo-100/90 shadow-2xs flex items-start justify-between gap-2 text-xs"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-extrabold text-[11px] text-indigo-900">
                                      {inter.action}
                                    </span>
                                    {inter.deltaAffection !== undefined && (
                                      <span
                                        className={`text-[9.5px] font-black px-1.5 py-0.2 rounded-full ${
                                          inter.deltaAffection >= 0
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-rose-100 text-rose-800'
                                        }`}
                                      >
                                        {inter.deltaAffection >= 0 ? `+${inter.deltaAffection}` : inter.deltaAffection} Afeto
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10.5px] text-slate-600 mt-0.5 leading-snug">
                                    {inter.description}
                                  </p>
                                </div>
                                <span className="text-[9.5px] font-semibold text-slate-400 shrink-0 mt-0.5">
                                  {inter.date}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* PAINEL EXPANDIDO DE INTERAÇÕES ESPECÍFICAS */}
                    {expandedFriendId === friend.id && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-amber-50/50 rounded-xl border border-amber-200/80 mt-1 animate-fade-in">
                        {/* OPÇÕES PARA CONHECIDO */}
                        {friend.type === 'conhecido' && (
                          <>
                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'cafe_conhecido');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-white hover:bg-amber-50 border border-slate-200 text-slate-800 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-bold text-slate-900">☕ Tomar Café Expresso</span>
                                <span className="block text-[10px] text-amber-700 font-semibold">+18 Afeto • Vira Amigo com 35%+ • R$ 20</span>
                              </div>
                              <span className="text-xs font-bold text-amber-600">➔</span>
                            </button>

                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'barzinho');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 text-slate-800 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-bold text-slate-900">🍻 Chamar pro Boteco</span>
                                <span className="block text-[10px] text-emerald-600 font-semibold">+22 Afeto • Vira Amigo • R$ 45</span>
                              </div>
                              <span className="text-xs font-bold text-emerald-600">➔</span>
                            </button>

                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'flertar');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 text-slate-800 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-bold text-slate-900">💋 Jogar Charme / Flerte</span>
                                <span className="block text-[10px] text-rose-600 font-semibold">+20 Afeto • +25 Intimidade • Grátis</span>
                              </div>
                              <span className="text-xs font-bold text-rose-600">➔</span>
                            </button>

                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'pedir_favor');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-bold text-slate-900">🤝 Pedir Indicação / Ajuda</span>
                                <span className="block text-[10px] text-slate-600 font-semibold">Exige 40%+ Afeto • +15 Intimidade</span>
                              </div>
                              <span className="text-xs font-bold text-slate-600">➔</span>
                            </button>
                          </>
                        )}

                        {/* OPÇÕES PARA AMANTE */}
                        {friend.type === 'amante' && (
                          <>
                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'viagem_secreta');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-white hover:bg-purple-50 border border-purple-200 text-slate-800 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-bold text-purple-900">✈️ Viagem Secreta na Serra</span>
                                <span className="block text-[10px] text-purple-700 font-semibold">+50 Afeto & Intimidade • R$ 600</span>
                              </div>
                              <span className="text-xs font-bold text-purple-600">➔</span>
                            </button>

                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'presente_caro');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-white hover:bg-amber-50 border border-amber-200 text-slate-800 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-bold text-amber-900">💎 Presentear Perfume Importado</span>
                                <span className="block text-[10px] text-amber-700 font-semibold">+45 Afeto • R$ 250</span>
                              </div>
                              <span className="text-xs font-bold text-amber-600">➔</span>
                            </button>

                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'sexual');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-white hover:bg-rose-50 border border-rose-200 text-slate-800 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-bold text-rose-900">🔥 Encontro Ardente no Carro</span>
                                <span className="block text-[10px] text-rose-700 font-semibold">+30 Afeto • +40 Intimidade • Risco</span>
                              </div>
                              <span className="text-xs font-bold text-rose-600">➔</span>
                            </button>

                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'terminar_caso');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-900 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-bold text-red-900">💔 Encerrar Caso Extraconjugal</span>
                                <span className="block text-[10px] text-red-700 font-semibold">Vira Ex • Clima tenso</span>
                              </div>
                              <span className="text-xs font-bold text-red-600">➔</span>
                            </button>
                          </>
                        )}

                        {/* OPÇÕES PARA AMIGO & MELHOR AMIGO */}
                        {(friend.type === 'amigo' || friend.type === 'melhor_amigo') && (
                          <>
                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'videogame_amigo');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 text-slate-800 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-bold text-indigo-950">🎮 Jogar Videogame Junto</span>
                                <span className="block text-[10px] text-indigo-700 font-semibold">+18 Afeto • +18 Intimidade • Grátis</span>
                              </div>
                              <span className="text-xs font-bold text-indigo-600">➔</span>
                            </button>

                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'pizza_amigo');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-white hover:bg-amber-50 border border-slate-200 text-slate-800 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-bold text-amber-950">🍕 Noite da Pizza em Casa</span>
                                <span className="block text-[10px] text-amber-700 font-semibold">+22 Afeto • +20 Intimidade • R$ 40</span>
                              </div>
                              <span className="text-xs font-bold text-amber-600">➔</span>
                            </button>

                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'pedir_conselho_amigo');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-white hover:bg-sky-50 border border-slate-200 text-slate-800 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-bold text-sky-950">💬 Pedir Conselho de Vida</span>
                                <span className="block text-[10px] text-sky-700 font-semibold">+18 Afeto • +12 Intelecto • Grátis</span>
                              </div>
                              <span className="text-xs font-bold text-sky-600">➔</span>
                            </button>

                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'emprestar_grana_amigo');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 text-slate-800 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-bold text-emerald-950">💸 Emprestar Grana no Aperto</span>
                                <span className="block text-[10px] text-emerald-700 font-semibold">+30 Afeto • Gratidão Eterna • R$ 100</span>
                              </div>
                              <span className="text-xs font-bold text-emerald-600">➔</span>
                            </button>

                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'barzinho');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 text-slate-800 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-bold text-slate-900">🍻 Rodada no Barzinho</span>
                                <span className="block text-[10px] text-emerald-600 font-semibold">+22 Afeto • +20 Intimidade • R$ 45</span>
                              </div>
                              <span className="text-xs font-bold text-emerald-600">➔</span>
                            </button>

                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'desentendimento_amigo');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-white hover:bg-rose-50 border border-rose-200 text-slate-800 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-bold text-rose-950">⚡ Desentendimento / Bate-Boca</span>
                                <span className="block text-[10px] text-rose-700 font-semibold">-20 Afeto • Divergência de opiniões</span>
                              </div>
                              <span className="text-xs font-bold text-rose-600">➔</span>
                            </button>

                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'flertar');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-white hover:bg-purple-50 border border-purple-200 text-slate-800 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-bold text-purple-900">🤫 Tentar Algo a Mais (Flerte)</span>
                                <span className="block text-[10px] text-purple-700 font-semibold">Pode virar Amante / Ficante</span>
                              </div>
                              <span className="text-xs font-bold text-purple-600">➔</span>
                            </button>
                          </>
                        )}

                        {/* OPÇÕES PARA EX-PARCEIRA(O) */}
                        {friend.type === 'ex' && (
                          <>
                            {friend.hadAcceptedRecaida && (
                              <button
                                onClick={() => {
                                  if (onFriendAction) {
                                    const res = onFriendAction(friend.id, 'reatar_relacionamento');
                                    showMsg(res);
                                  }
                                }}
                                className="w-full p-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 text-white text-left cursor-pointer transition-all shadow-[0_2px_0_#9f1239] flex items-center justify-between col-span-1 sm:col-span-2"
                              >
                                <div>
                                  <span className="block text-xs font-black text-white">💕 Reatar Namoro Oficial</span>
                                  <span className="block text-[10px] text-pink-100 font-medium">Recaída foi aceita por ambos! Volta a namorar com status oficial.</span>
                                </div>
                                <span className="text-sm font-black text-white">➔</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'recaida');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 text-rose-900 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-black text-rose-950">🔥 Tentar Recaída a Dois (R$ 60)</span>
                                <span className="block text-[10px] text-rose-800 font-semibold">Ex pode aceitar ou negar! Se aceito: ~35% chance de bebê não planejado</span>
                              </div>
                              <span className="text-xs font-bold text-rose-600">➔</span>
                            </button>

                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'conversar_passado_ex');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-bold text-slate-900">☕ Conversar sobre o Passado</span>
                                <span className="block text-[10px] text-emerald-700 font-semibold">+20 Afeto • +15 Saúde Mental • Grátis</span>
                              </div>
                              <span className="text-xs font-bold text-slate-600">➔</span>
                            </button>

                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'mensagem_noite_ex');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 text-slate-800 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-bold text-indigo-950">🌙 Mandar Mensagem de Madrugada</span>
                                <span className="block text-[10px] text-indigo-700 font-semibold">Se afeto alto, responde com carinho; senão, vácuo total!</span>
                              </div>
                              <span className="text-xs font-bold text-indigo-600">➔</span>
                            </button>

                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'discutir_termino_ex');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-white hover:bg-rose-50 border border-rose-200 text-slate-800 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-bold text-rose-950">⚡ Discutir o Término</span>
                                <span className="block text-[10px] text-rose-700 font-semibold">-22 Afeto • -15 Feliz • Lavar roupa suja</span>
                              </div>
                              <span className="text-xs font-bold text-rose-600">➔</span>
                            </button>

                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'devolver_pertences_ex');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-bold text-slate-900">📦 Devolver Pertences</span>
                                <span className="block text-[10px] text-slate-600 font-semibold">+12 Afeto • Relação civilizada</span>
                              </div>
                              <span className="text-xs font-bold text-slate-600">➔</span>
                            </button>

                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'relembrar_passado');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-bold text-slate-900">📸 Relembrar Momentos Bons</span>
                                <span className="block text-[10px] text-slate-600 font-semibold">+15 Afeto • +20 Intimidade</span>
                              </div>
                              <span className="text-xs font-bold text-slate-600">➔</span>
                            </button>
                          </>
                        )}

                        {/* OPÇÕES PARA FICANTE */}
                        {friend.type === 'ficante' && (
                          <>
                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'barzinho');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-white hover:bg-amber-50 border border-amber-200 text-slate-800 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-bold text-amber-900">🍸 Drink num Rooftop</span>
                                <span className="block text-[10px] text-amber-700 font-semibold">+22 Afeto • +20 Intimidade • R$ 45</span>
                              </div>
                              <span className="text-xs font-bold text-amber-600">➔</span>
                            </button>

                            <button
                              onClick={() => {
                                if (onFriendAction) {
                                  const res = onFriendAction(friend.id, 'motel_secreto');
                                  showMsg(res);
                                }
                              }}
                              className="w-full p-2 rounded-lg bg-white hover:bg-rose-50 border border-rose-200 text-slate-800 text-left cursor-pointer transition-all shadow-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="block text-xs font-bold text-rose-900">🔥 Noite Especial a Dois</span>
                                <span className="block text-[10px] text-rose-700 font-semibold">+35 Afeto • +45 Intimidade • R$ 120</span>
                              </div>
                              <span className="text-xs font-bold text-rose-600">➔</span>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* MODAL DE PLANEJAMENTO DE EVENTOS EM FAMÍLIA E AMIGOS */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#fffdf7] border-2 border-amber-400 max-w-lg w-full rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-left font-sans text-slate-900 relative">
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎉</span>
                <div>
                  <h3 className="font-heading font-black text-lg text-slate-900 leading-tight">
                    Planejar Evento & Reunião
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Escolha o tipo de festa e selecione os convidados especiais
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { playClickSound(); setIsEventModalOpen(false); }}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 font-bold flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* SELEÇÃO DO TIPO DE EVENTO */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                1. Escolha o Tipo de Evento:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {EVENT_TYPES.map(ev => {
                  const isSelected = selectedEventType === ev.id;
                  return (
                    <div
                      key={ev.id}
                      onClick={() => { playClickSound(); setSelectedEventType(ev.id as any); }}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'bg-amber-50/80 border-amber-500 shadow-sm ring-2 ring-amber-400/30'
                          : 'bg-white border-slate-200 hover:border-amber-200'
                      }`}
                    >
                      <div className="text-2xl shrink-0 mt-0.5">{ev.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-black text-xs text-slate-900">{ev.title}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-[10px] shrink-0 border border-amber-300">
                            R$ {ev.cost.toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{ev.desc}</p>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] font-bold">
                          <span className="text-emerald-600">+{ev.happinessGain}% Felicidade</span>
                          <span className="text-amber-700">+{ev.mentalHealthGain}% Saúde Mental</span>
                          <span className="text-cyan-700">+{ev.energyGain}% Energia</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LISTA DE CONVIDADOS */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  2. Lista de Convidados ({selectedGuestNames.length} selecionados):
                </label>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    if (selectedGuestNames.length === allPossibleGuests.length) {
                      setSelectedGuestNames([]);
                    } else {
                      setSelectedGuestNames(allPossibleGuests.map(g => g.name));
                    }
                  }}
                  className="text-[11px] font-bold text-amber-700 hover:underline cursor-pointer"
                >
                  {selectedGuestNames.length === allPossibleGuests.length ? 'Desmarcar Todos' : 'Marcar Todos'}
                </button>
              </div>

              {allPossibleGuests.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-3 text-center bg-slate-50 rounded-xl">
                  Nenhum parente ou amigo disponível no momento.
                </p>
              ) : (
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 font-sans">
                  {allPossibleGuests.map(guest => {
                    const isChecked = selectedGuestNames.includes(guest.name);
                    return (
                      <label
                        key={guest.name}
                        className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer text-xs ${
                          isChecked ? 'bg-amber-50 border-amber-300 text-slate-900 font-bold' : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              playClickSound();
                              if (e.target.checked) {
                                setSelectedGuestNames([...selectedGuestNames, guest.name]);
                              } else {
                                setSelectedGuestNames(selectedGuestNames.filter(n => n !== guest.name));
                              }
                            }}
                            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                          />
                          <span>{guest.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold px-2 py-0.5 rounded-full bg-slate-100">
                          {guest.role}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* BOTÃO DE CONFIRMAÇÃO */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => { playClickSound(); setIsEventModalOpen(false); }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmPlanEvent}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black shadow-md hover:from-amber-600 hover:to-orange-600 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5 font-heading"
              >
                <span>Confirmar & Realizar Evento</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-200 fill-current" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
