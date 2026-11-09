import React, { useState } from 'react';
import { BRAZILIAN_CITIES } from '../data/dilemmas';
import { Sparkles, Dices, Check, X } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../utils/audio';
import { LegoMinifigHead, LEGO_AVATARS_LIST } from './LegoMinifigHead';

interface NewCharacterModalProps {
  isOpen: boolean;
  onStartGame: (params: {
    name: string;
    gender: 'M' | 'F' | 'NB';
    sexualOrientation: 'Heterossexual' | 'Homossexual' | 'Bissexual' | 'Pansexual' | 'Assexual' | 'Demissexual' | 'Polissexual' | 'Queer' | 'Fluida' | string;
    legoAvatar: string;
    avatarImageUrl?: string;
    personality: string;
    countryOfBirth: string;
    familyClass: 'Baixa (Periferia)' | 'Média-Baixa' | 'Média-Alta' | 'Rica (Elite)';
    city: string;
    state: string;
    originTrait: string;
    originDescription: string;
    birthZone?: 'urbano' | 'campo';
    appearance?: number;
    intelligence?: number;
    social?: number;
    birthStory?: string;
  }) => void;
  onClose?: () => void;
}

const BIRTH_STORIES = [
  { id: 'cha_revelacao', title: 'Chá de Revelação Desastroso 💥', desc: 'A fumaça rosa pegou fogo nas cortinas do salão! O bombeiro teve que vir e a família ri até hoje.' },
  { id: 'churrasco', title: 'Churrasco de Domingo 🍖', desc: 'Você nasceu ao som de pagode 90 e cheiro de picanha assada na casa da vovó.' },
  { id: 'taxi_marginal', title: 'Parto no Táxi na Marginal 🚕', desc: 'Sua mãe não aguentou o trânsito travado e você nasceu no banco de trás do táxi!' },
  { id: 'hospital_calmo', title: 'Recepção Calorosa no Hospital 🏥', desc: 'Toda a família reunida na sala de espera festejando sua chegada com salgadinhos.' }
];

const PERSONALITIES = [
  { name: 'Focado & Determinado', desc: 'Sempre cumpre metas com disciplina extrema', bonus: '(+10 Intelecto, +10 Energia)', color: 'text-blue-700' },
  { name: 'Extrovertido & Comunicativo', desc: 'Conecta-se fácil com as pessoas e faz amigos rápido', bonus: '(+15 Felicidade)', color: 'text-emerald-700' },
  { name: 'Ambicioso & Empreendedor', desc: 'Foco total em crescer na vida e acumular patrimônio', bonus: '(+15 Grana Inicial)', color: 'text-amber-700' },
  { name: 'Criativo & Artístico', desc: 'Visão inovadora e talento para soluções fora da caixa', bonus: '(+15 Intelecto)', color: 'text-purple-700' },
  { name: 'Calmo & Analítico', desc: 'Manteve a cabeça fria nas crises financeiras', bonus: '(+15 Saúde, +30 Serasa Score)', color: 'text-teal-700' }
];

const ORIENTATIONS = ['Heterossexual', 'Homossexual', 'Bissexual', 'Pansexual', 'Assexual'] as const;

const COUNTRIES = ['Brasil 🇧🇷', 'Portugal 🇵🇹', 'Estados Unidos 🇺🇸', 'Japão 🇯🇵', 'Argentina 🇦🇷', 'Itália 🇮🇹', 'Alemanha 🇩🇪'];

const FAMILY_CLASSES = [
  { name: 'Baixa (Periferia)', desc: 'Guerreiro de origem humilde (R$ 450 inicial, moradia simples em família)' },
  { name: 'Média-Baixa', desc: 'Família trabalhadora e esforçada (R$ 1.200 inicial, suporte da família)' },
  { name: 'Média-Alta', desc: 'Infância confortável com boas oportunidades (R$ 5.500 inicial)' },
  { name: 'Rica (Elite)', desc: 'Herança familiar e alta reserva financeira (R$ 25.000 inicial)' }
] as const;

const RANDOM_NAMES = {
  M: ['Lucas Silva', 'Matheus Oliveira', 'Gabriel Souza', 'Enzo Ferreira', 'Bruno Carvalho', 'Rodrigo Costa', 'Thiago Lima'],
  F: ['Beatriz Silva', 'Juliana Lima', 'Larissa Santos', 'Camila Ribeiro', 'Mariana Rocha', 'Amanda Costa', 'Fernanda Martins'],
  NB: ['Alexandre Alex', 'Cris Silva', 'Robin Pereira', 'Sam Albuquerque', 'Kim Santos']
};

export const NewCharacterModal: React.FC<NewCharacterModalProps> = ({
  isOpen,
  onStartGame,
  onClose
}) => {
  const [gender, setGender] = useState<'M' | 'F' | 'NB'>('M');
  const [name, setName] = useState('Lucas Silva');
  const [selectedLegoIndex, setSelectedLegoIndex] = useState(0); // 0 = Estudante
  const [personalityIndex, setPersonalityIndex] = useState(0);
  const [orientationIndex, setOrientationIndex] = useState(0);
  const [countryOfBirth, setCountryOfBirth] = useState('Brasil 🇧🇷');
  const [familyClassIndex, setFamilyClassIndex] = useState(1); // Média-Baixa
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);
  const [birthStoryIndex, setBirthStoryIndex] = useState(0);
  const [appearance, setAppearance] = useState(50);
  const [intelligence, setIntelligence] = useState(50);
  const [social, setSocial] = useState(50);
  const [birthZone, setBirthZone] = useState<'urbano' | 'campo'>('urbano');

  if (!isOpen) return null;

  const currentLego = LEGO_AVATARS_LIST[selectedLegoIndex] || LEGO_AVATARS_LIST[0];

  const handleRandomize = () => {
    playClickSound();
    const list = RANDOM_NAMES[gender];
    const randName = list[Math.floor(Math.random() * list.length)];
    setName(randName);
    setSelectedLegoIndex(Math.floor(Math.random() * LEGO_AVATARS_LIST.length));
    setPersonalityIndex(Math.floor(Math.random() * PERSONALITIES.length));
    setOrientationIndex(Math.floor(Math.random() * ORIENTATIONS.length));
    setSelectedCityIndex(Math.floor(Math.random() * BRAZILIAN_CITIES.length));
    setBirthZone(Math.random() > 0.5 ? 'campo' : 'urbano');
    setBirthStoryIndex(Math.floor(Math.random() * BIRTH_STORIES.length));
    setAppearance(30 + Math.floor(Math.random() * 45));
    setIntelligence(30 + Math.floor(Math.random() * 45));
    setSocial(30 + Math.floor(Math.random() * 45));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccessSound();
    const cityObj = BRAZILIAN_CITIES[selectedCityIndex];
    const persObj = PERSONALITIES[personalityIndex];
    const famObj = FAMILY_CLASSES[familyClassIndex];
    const bStory = BIRTH_STORIES[birthStoryIndex];

    onStartGame({
      name: name.trim() || 'Lucas Silva',
      gender,
      sexualOrientation: ORIENTATIONS[orientationIndex],
      legoAvatar: `${currentLego.icon} ${currentLego.title}`,
      avatarImageUrl: currentLego.avatarImageUrl,
      personality: persObj.name,
      countryOfBirth: countryOfBirth.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').trim(),
      familyClass: famObj.name,
      city: cityObj.name,
      state: cityObj.state,
      originTrait: persObj.name,
      originDescription: `${persObj.desc} ${persObj.bonus} • Origem familiar ${famObj.name}.`,
      birthZone,
      appearance,
      intelligence,
      social,
      birthStory: `${bStory.title}: ${bStory.desc}`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="app-viewport w-full max-w-md bg-white rounded-3xl sm:rounded-[36px] overflow-hidden shadow-2xl border border-slate-200 max-h-[94vh] flex flex-col my-auto text-left relative">
        {/* Top Glow Header Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-emerald-400 via-amber-400 to-blue-500 shrink-0" />

        {/* Close Button if provided */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 pt-5 pb-8 space-y-5">
          {/* BEGIN: HeroAvatarSection */}
          <section className="flex flex-col items-center justify-center">
            <div className="relative group cursor-pointer" onClick={() => setSelectedLegoIndex((prev) => (prev + 1) % LEGO_AVATARS_LIST.length)}>
              {/* Moldura circular com estilo tátil e contorno verde esmeralda */}
              <div className="w-24 h-24 rounded-3xl bg-emerald-50 border-2 border-emerald-500 shadow-[0_4px_0_0_rgba(0,0,0,0.06),0_8px_16px_-4px_rgba(15,23,42,0.08)] flex items-center justify-center p-1.5 transition-transform active:scale-95">
                <LegoMinifigHead
                  avatarId={currentLego.id}
                  size="hero"
                  className="w-18 h-18 drop-shadow-md"
                />
              </div>

              {/* Badge de Edição / Brilho */}
              <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-1.5 shadow-md border-2 border-white">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
            </div>

            <h1 className="font-heading text-2xl font-black text-slate-900 mt-2.5 text-center tracking-tight">
              Criar Personagem
            </h1>
            <p className="text-xs text-slate-500 text-center max-w-xs mt-0.5 leading-relaxed font-normal">
              Personalize visual, personalidade, gênero, orientação, país e classe familiar do seu avatar!
            </p>
          </section>

          {/* BEGIN: NameSection */}
          <section>
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <label className="text-[11px] font-extrabold tracking-wider text-slate-600 uppercase font-heading" htmlFor="char-name">
                NOME DO PERSONAGEM
              </label>
              <button
                type="button"
                onClick={handleRandomize}
                className="inline-flex items-center gap-1 text-[12px] font-bold text-blue-600 hover:text-blue-700 active:scale-95 transition-transform cursor-pointer font-heading"
              >
                <span>🎲</span> Sortear Tudo
              </button>
            </div>
            <div className="relative">
              <input
                id="char-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome..."
                className="w-full h-11 px-4 text-base font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl shadow-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
              />
            </div>
          </section>

          {/* BEGIN: LegoAvatarSelector */}
          <section>
            <div className="flex items-center justify-between mb-2 px-0.5">
              <h2 className="text-[11px] font-extrabold tracking-wider text-slate-600 uppercase font-heading">
                ESCOLHER ÍCONE / AVATAR LEGO PEÇAS DE MONTAR
              </h2>
            </div>
            {/* Grade de 10 cabeças LEGO detalhadas */}
            <div className="grid grid-cols-5 gap-2">
              {LEGO_AVATARS_LIST.map((item, idx) => {
                const isSelected = selectedLegoIndex === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { playClickSound(); setSelectedLegoIndex(idx); }}
                    className={`flex flex-col items-center p-1.5 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'border-2 border-emerald-500 bg-emerald-50/70 shadow-xs scale-105'
                        : 'border border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="w-11 h-12 relative flex items-center justify-center">
                      <LegoMinifigHead avatarId={item.id} size="md" className="w-full h-full" />
                    </div>
                    <span className={`text-[10px] mt-1 truncate w-full text-center ${isSelected ? 'font-bold text-emerald-800' : 'font-semibold text-slate-700'}`}>
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* BEGIN: PersonalitySection */}
          <section>
            <h2 className="text-[11px] font-extrabold tracking-wider text-slate-600 uppercase mb-2 px-0.5 font-heading">
              PERSONALIDADE INICIAL
            </h2>
            <div className="space-y-2">
              {PERSONALITIES.map((pers, idx) => {
                const isSelected = personalityIndex === idx;
                return (
                  <div
                    key={pers.name}
                    onClick={() => { playClickSound(); setPersonalityIndex(idx); }}
                    className={`p-3 rounded-2xl cursor-pointer relative transition-all ${
                      isSelected
                        ? 'border-2 border-blue-500 bg-blue-50/50 shadow-xs'
                        : 'border border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight font-heading">
                          {pers.name}
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {pers.desc} <span className={`font-semibold ${pers.color}`}>{pers.bonus}</span>
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 ml-2">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* BEGIN: DemographicsRow */}
          <section className="grid grid-cols-12 gap-3">
            {/* Gênero */}
            <div className="col-span-5">
              <label className="block text-[11px] font-extrabold tracking-wider text-slate-600 uppercase mb-1.5 px-0.5 font-heading">
                GÊNERO
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                {[
                  { key: 'M', label: 'M', icon: '👨' },
                  { key: 'F', label: 'F', icon: '👩' },
                  { key: 'NB', label: 'NB', icon: '🧑' }
                ].map((g) => (
                  <button
                    key={g.key}
                    type="button"
                    onClick={() => { playClickSound(); setGender(g.key as any); }}
                    className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-0.5 transition-colors cursor-pointer ${
                      gender === g.key
                        ? 'bg-white border border-emerald-500 shadow-xs text-emerald-800'
                        : 'hover:bg-white/60 text-slate-700'
                    }`}
                  >
                    {g.label} <span className="text-xs">{g.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Orientação Sexual */}
            <div className="col-span-7">
              <label className="block text-[11px] font-extrabold tracking-wider text-slate-600 uppercase mb-1.5 px-0.5 font-heading">
                ORIENTAÇÃO SEXUAL
              </label>
              <div className="relative">
                <select
                  value={ORIENTATIONS[orientationIndex]}
                  onChange={(e) => setOrientationIndex(ORIENTATIONS.indexOf(e.target.value as any))}
                  className="w-full h-[42px] px-3 pr-8 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-2xl shadow-xs appearance-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {ORIENTATIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
              </div>
            </div>
          </section>

          {/* País e Cidade Atual */}
          <section className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-extrabold tracking-wider text-slate-600 uppercase mb-1.5 px-0.5 font-heading">
                PAÍS DE NASCIMENTO
              </label>
              <div className="relative">
                <select
                  value={countryOfBirth}
                  onChange={(e) => setCountryOfBirth(e.target.value)}
                  className="w-full h-10 px-3 pr-8 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl shadow-xs appearance-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold tracking-wider text-slate-600 uppercase mb-1.5 px-0.5 font-heading">
                CIDADE ATUAL (BR)
              </label>
              <div className="relative">
                <select
                  value={selectedCityIndex}
                  onChange={(e) => setSelectedCityIndex(Number(e.target.value))}
                  className="w-full h-10 px-3 pr-8 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl shadow-xs appearance-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {BRAZILIAN_CITIES.map((c, idx) => (
                    <option key={c.name} value={idx}>{c.name} ({c.state})</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
              </div>
            </div>
          </section>

          {/* BEGIN: SocialClassSection */}
          <section>
            <h2 className="text-[11px] font-extrabold tracking-wider text-slate-600 uppercase mb-2 px-0.5 font-heading">
              CLASSE SOCIAL DA FAMÍLIA DE ORIGEM
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {FAMILY_CLASSES.map((fc, idx) => {
                const isSelected = familyClassIndex === idx;
                return (
                  <div
                    key={fc.name}
                    onClick={() => { playClickSound(); setFamilyClassIndex(idx); }}
                    className={`p-3 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? 'border-2 border-emerald-500 bg-emerald-50/50'
                        : 'border border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <h3 className={`text-xs font-bold leading-snug font-heading ${isSelected ? 'text-emerald-950' : 'text-slate-900'}`}>
                      {fc.name}
                    </h3>
                    <p className={`text-[11px] mt-1 leading-tight ${isSelected ? 'text-emerald-900/80 font-medium' : 'text-slate-500'}`}>
                      {fc.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* BEGIN: BirthOriginSection */}
          <section>
            <h2 className="text-[11px] font-extrabold tracking-wider text-slate-600 uppercase mb-2 px-0.5 font-heading">
              ORIGEM DE NASCIMENTO (ONDE COMEÇA SUA HISTÓRIA)
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              <div
                onClick={() => { playClickSound(); setBirthZone('urbano'); }}
                className={`p-3 rounded-2xl cursor-pointer flex flex-col justify-between transition-all ${
                  birthZone === 'urbano'
                    ? 'border-2 border-blue-500 bg-blue-50/40'
                    : 'border border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-lg">🏙️</span>
                    <h3 className="text-xs font-bold text-slate-900 font-heading">Cidade / Metrópole</h3>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Nascido na agitação urbana da cidade grande
                  </p>
                </div>
              </div>

              <div
                onClick={() => { playClickSound(); setBirthZone('campo'); }}
                className={`p-3 rounded-2xl cursor-pointer flex flex-col justify-between transition-all ${
                  birthZone === 'campo'
                    ? 'border-2 border-emerald-500 bg-emerald-50/40'
                    : 'border border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-lg">🚜</span>
                    <h3 className="text-xs font-bold text-slate-900 font-heading">Campo / Zona Rural</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Nascido no campo, entre lavouras e fazendas
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* BEGIN: BirthEventsSection */}
          <section>
            <h2 className="text-[11px] font-extrabold tracking-wider text-slate-700 uppercase mb-2 px-0.5 flex items-center gap-1.5 font-heading">
              <span>🎉</span> O QUE ROLOU NO SEU NASCIMENTO?
            </h2>
            <div className="space-y-2">
              {BIRTH_STORIES.map((story, idx) => {
                const isSelected = birthStoryIndex === idx;
                return (
                  <div
                    key={story.id}
                    onClick={() => { playClickSound(); setBirthStoryIndex(idx); }}
                    className={`p-3.5 rounded-2xl cursor-pointer relative transition-all ${
                      isSelected
                        ? 'border-2 border-amber-500 bg-amber-50/60'
                        : 'border border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`text-xs font-bold flex items-center gap-1.5 font-heading ${isSelected ? 'text-amber-950' : 'text-slate-900'}`}>
                          {story.title}
                        </h3>
                        <p className={`text-[11px] mt-1 leading-tight ${isSelected ? 'text-amber-900/80 font-medium' : 'text-slate-500'}`}>
                          {story.desc}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 ml-2">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* BEGIN: CreatorModeAttributes */}
          <section className="p-4 rounded-3xl border border-emerald-300 bg-emerald-50/40 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-emerald-800">
                <span className="text-sm font-bold">✨</span>
                <span className="text-xs font-black tracking-wide uppercase font-heading">MODO CRIADOR: ATRIBUTOS DE NASCIMENTO</span>
              </div>
              <span className="text-[11px] font-bold text-slate-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs font-heading">
                Média: {Math.round((appearance + intelligence + social) / 3)} pts
              </span>
            </div>

            <div className="space-y-3">
              {/* Slider Aparência Visual */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    ✨ Aparência Visual
                  </span>
                  <span className="font-extrabold text-emerald-700">{appearance} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={appearance}
                  onChange={(e) => setAppearance(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
                  <span>Comum (0)</span>
                  <span>Equilibrado (50)</span>
                  <span>Estiloso (100)</span>
                </div>
              </div>

              {/* Slider Inteligência */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    🧠 Inteligência & Raciocínio
                  </span>
                  <span className="font-extrabold text-blue-700">{intelligence} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={intelligence}
                  onChange={(e) => setIntelligence(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Slider Carisma Social */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    🗣️ Carisma & Habilidade Social
                  </span>
                  <span className="font-extrabold text-amber-700">{social} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={social}
                  onChange={(e) => setSocial(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>
          </section>

          {/* BEGIN: ConfirmButton */}
          <section className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white font-heading text-base font-black shadow-lg shadow-emerald-500/25 border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Criar Personagem & Iniciar Vida</span>
              <span className="text-lg">🚀</span>
            </button>
          </section>
        </form>
      </div>
    </div>
  );
};
