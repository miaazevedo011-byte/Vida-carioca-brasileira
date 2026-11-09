import React, { useState } from 'react';
import { GameState, FriendMember } from '../types/game';
import { BrazilNews } from '../data/brazil_news';
import { BrazilNewsTicker } from './BrazilNewsTicker';
import { CalendarOfEvents } from './CalendarOfEvents';
import { REALTREE_NPCS } from '../data/random_npcs';
import {
  X, ChevronLeft, Wifi, BatteryCharging, Radio, Newspaper, Briefcase, Calendar,
  MessageCircle, CreditCard, Camera, Heart, Calculator, Settings, Phone, Compass,
  TrendingUp, TrendingDown, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck,
  Send, ThumbsUp, DollarSign, Award, Flame, Star, Zap, MapPin, CheckCheck,
  Pin, Users, Coffee, Search, SlidersHorizontal, ArrowLeft, ArrowRight, MoreVertical,
  Smartphone, Bot, ChevronRight, MessageSquare, Utensils, Smile, Check, Shield,
  Landmark, UserPlus
} from 'lucide-react';
import { playClickSound, playSuccessSound, playCoinSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { useTheme } from '../context/ThemeContext';

interface SmartphoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  currentNews?: BrazilNews;
  onReactToNews?: (news: BrazilNews) => void;
  onCelebrate: (desc: string) => void;
  onSocialPost?: (type: 'photo' | 'reel' | 'publi' | 'live' | 'comments') => { success: boolean; message: string };
  onApplyDilemmaConsequence?: (consequences: { felicidade?: number; grana?: number; saude?: number; serasa?: number; efficiency?: number; logTitle: string; logDesc: string }) => void;
  onTinderMatch?: (profile: FriendMember) => void;
}

type PhoneApp = 'home' | 'noticias' | 'dilemas' | 'calendario' | 'whatsapp' | 'banco' | 'redes' | 'clt' | 'tinder' | 'config';

interface WorkplaceDilemmaItem {
  id: string;
  title: string;
  category: string;
  description: string;
  options: {
    label: string;
    description: string;
    felicidade: number;
    grana: number;
    serasa: number;
    efficiency: number;
    narrative: string;
  }[];
}

const WORKPLACE_ETHICAL_DILEMMAS: WorkplaceDilemmaItem[] = [
  {
    id: 'dilema_hora_extra',
    title: 'Hora Extra sem Bater o Ponto ⏱️',
    category: 'Jornada & Direitos',
    description: 'O gerente pediu para você esticar 2 horas além do expediente todos os dias para bater a meta da semana, mas pediu para não registrar no ponto: "Depois compenso com folga ou considero na sua promoção".',
    options: [
      {
        label: 'Aceitar e Fazer as Horas Extras',
        description: 'Trabalha até tarde sem registro formal para agradar a chefia.',
        felicidade: -12,
        grana: 0,
        serasa: 0,
        efficiency: 15,
        narrative: 'Você cumpriu as horas extras sem registro. A liderança elogiou sua dedicação, mas o cansaço acumulou (-12 Felicidade, +15 Eficiência).'
      },
      {
        label: 'Recusar com Firmeza Exigindo o Ponto',
        description: 'Argumenta cordialmente que pelas regras trabalhistas todo horário deve ser registrado.',
        felicidade: 8,
        grana: 0,
        serasa: 10,
        efficiency: 0,
        narrative: 'Você defendeu seus direitos trabalhistas! O gerente aceitou registrar oficialmente as horas no sistema (+8 Felicidade, +10 Serasa).'
      },
      {
        label: 'Reportar ao Canal Confidencial de Compliance',
        description: 'Faz um relato seguro no canal anônimo de integridade da empresa.',
        felicidade: 15,
        grana: 0,
        serasa: 25,
        efficiency: 5,
        narrative: 'O comitê de compliance auditou o departamento e exigiu regularização de todo o banco de horas (+25 Serasa Score, +15 Felicidade).'
      }
    ]
  },
  {
    id: 'dilema_puxada_tapete',
    title: 'Apropriação de Projeto & Créditos 📑',
    category: 'Ética entre Colegas',
    description: 'Um colega da equipe enviou para a diretoria uma apresentação que você estruturou inteira sozinho, colocando apenas o nome dele como responsável pela ideia.',
    options: [
      {
        label: 'Enviar Histórico por E-mail à Diretoria',
        description: 'Encaminha a versão original com data, rascunhos e comprovando sua autoria com elegância.',
        felicidade: 18,
        grana: 300,
        serasa: 20,
        efficiency: 20,
        narrative: 'A diretoria reconheceu sua autoria genial e elogiou seu profissionalismo! Bônus de reconhecimento pago (+R$ 300, +20 Eficiência).'
      },
      {
        label: 'Conversar com o Colega e Dividir Apresentação',
        description: 'Chama para um café e propõe apresentarem juntos na reunião geral.',
        felicidade: 10,
        grana: 0,
        serasa: 5,
        efficiency: 10,
        narrative: 'Apresentação em dupla realizada com sucesso! O clima com o colega foi preservado (+10 Felicidade, +10 Eficiência).'
      },
      {
        label: 'Deixar Passar para Evitar Conflito',
        description: 'Não diz nada para não criar atrito no ambiente de trabalho.',
        felicidade: -15,
        grana: 0,
        serasa: -5,
        efficiency: -5,
        narrative: 'O colega levou todo o crédito perante os diretores. Você ficou com sentimento amargo de injustiça (-15 Felicidade).'
      }
    ]
  },
  {
    id: 'dilema_nota_fria',
    title: 'Irregularidade em Reembolso & Notas 🧾',
    category: 'Compliance Financeiro',
    description: 'Ao analisar a prestação de contas do setor, você notou recibos duplicados de almoços e despesas pessoais lançados como custos corporativos.',
    options: [
      {
        label: 'Acionar a Ouvidoria / Auditoria Interna',
        description: 'Comunica formalmente o departamento de controladoria com integridade.',
        felicidade: 12,
        grana: 0,
        serasa: 35,
        efficiency: 15,
        narrative: 'Auditoria confirmou a inconformidade e blindou a empresa de riscos legais. Seu compromisso ético foi elogiado (+35 Serasa, +12 Felicidade).'
      },
      {
        label: 'Orientar o Setor a Corrigir as Despesas',
        description: 'Alerta a equipe para retificar as notas antes do fechamento contábil.',
        felicidade: 8,
        grana: 0,
        serasa: 15,
        efficiency: 10,
        narrative: 'As notas foram retificadas amigavelmente sem necessidade de processos punitivos (+15 Serasa).'
      },
      {
        label: 'Fazer Vista Grossa',
        description: 'Finge que não viu para não se indispor com ninguém.',
        felicidade: -8,
        grana: 0,
        serasa: -15,
        efficiency: 0,
        narrative: 'A sensação de conivência pesou na consciência (-8 Felicidade, -15 Serasa Score).'
      }
    ]
  },
  {
    id: 'dilema_bico_cliente',
    title: 'Proposta de Serviço por Fora 💼',
    category: 'Conflito de Interesses',
    description: 'Um cliente importante da empresa te abordou no privado oferecendo R$ 2.500 no PIX para você prestar consultoria particular diretamente para ele, concorrendo com o serviço da sua empresa.',
    options: [
      {
        label: 'Recusar Pelo Código de Conduta',
        description: 'Explica a política de exclusividade e sugere fechar o serviço via empresa.',
        felicidade: 10,
        grana: 0,
        serasa: 30,
        efficiency: 15,
        narrative: 'Conduta exemplar! A empresa soube da postura e você ganhou ainda mais confiança da gerência (+30 Serasa, +15 Eficiência).'
      },
      {
        label: 'Aceitar o Bico Clandestino no PIX',
        description: 'Faz o serviço nos finais de semana escondido da firma.',
        felicidade: 5,
        grana: 2500,
        serasa: -20,
        efficiency: -10,
        narrative: 'Você recebeu R$ 2.500 no PIX! Porém o estresse de trabalhar escondido e o medo de justa causa pesaram (+R$ 2.500, -20 Serasa).'
      }
    ]
  }
];

export const SmartphoneModal: React.FC<SmartphoneModalProps> = ({
  isOpen,
  onClose,
  gameState,
  currentNews,
  onReactToNews,
  onCelebrate,
  onSocialPost,
  onApplyDilemmaConsequence,
  onTinderMatch
}) => {
  const [activeApp, setActiveApp] = useState<PhoneApp>('home');
  const [resolvedDilemmas, setResolvedDilemmas] = useState<Record<string, string>>({});
  const [dilemmaFeedback, setDilemmaFeedback] = useState<string | null>(null);

  // Settings & App States
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isAirplaneMode, setIsAirplaneMode] = useState(false);
  const [phoneTheme, setPhoneTheme] = useState<'tropical' | 'emerald' | 'blue' | 'rose' | 'dark'>('tropical');
  const [brightness, setBrightness] = useState(85);
  const [bankFeedback, setBankFeedback] = useState<string | null>(null);
  const [instaFeedback, setInstaFeedback] = useState<string | null>(null);
  const [instaTab, setInstaTab] = useState<'feed' | 'discover'>('feed');

  const playerName = gameState.character.name.split(' ')[0] || 'Lucas';

  // WhatsApp states
  const [whatsappView, setWhatsappView] = useState<'list' | 'chat'>('list');
  const [selectedChatContact, setSelectedChatContact] = useState<string>('Camila Duarte');
  const [searchContactText, setSearchContactText] = useState<string>('');
  const [activeZapTab, setActiveZapTab] = useState<'conversas' | 'status' | 'chamadas'>('conversas');
  const [dateChoiceConfirmed, setDateChoiceConfirmed] = useState<string | null>(null);

  // WhatsApp independent chats state per contact
  const partnerName = gameState.relationship?.partnerName || 'Patrícia Amor 💖';
  const [chats, setChats] = useState<Record<string, Array<{ sender: string; text: string; time: string; isMe?: boolean }>>>({
    'Camila Duarte': [
      { sender: 'Camila Duarte', text: `Oi ${playerName}! Adorei saber que você também é fã de Chihiro e frequenta a feirinha do Pacaembu aos domingos haha! Você costuma pedir pastel de palmito ou queijo? 🥟✨`, time: '10:14', isMe: false },
      { sender: 'Você', text: 'Pastel de queijo com muito vinagrete e caldo de cana com limão, sem discussão! 😂 E você, já foi naquele café com jardim botânico novo em Pinheiros?', time: '10:16', isMe: true },
      { sender: 'Camila Duarte', text: 'Mentira! Eu passo lá na frente daquele café todo dia a caminho do estúdio de arquitetura! Tô louca pra provar o bolo de cenoura deles faz semanas 🍰🌿', time: '10:18', isMe: false },
      { sender: 'Camila Duarte', text: 'Que tal a gente ir lá tomar um café nesse sábado? O que acha? ☕🍃', time: '10:19', isMe: false }
    ],
    'Mãe (Aline Silva) 🌸': [
      { sender: 'Mãe (Aline Silva) 🌸', text: 'Oi meu filho! Não esquece do casaco e do almoço de domingo na casa da vó!', time: '09:12', isMe: false }
    ],
    [partnerName]: [
      { sender: partnerName, text: 'Oi amor! Como está sendo seu dia? Te amo muito! ❤️', time: '09:30', isMe: false }
    ],
    'Família Silva 👨‍👩‍👧‍👦': [
      { sender: 'Mãe', text: 'Quem vem pro almoço de domingo?', time: '10:45', isMe: false },
      { sender: 'Tio Beto 🇧🇷', text: 'Bom dia grupo! Segue a foto do churrasco de ontem!', time: '09:25', isMe: false }
    ],
    'Seu Geraldo (Pai) 👴': [
      { sender: 'Seu Geraldo (Pai) 👴', text: 'Vi que a adega tá crescendo rápido, parabéns meu filho!', time: 'Ontem', isMe: false }
    ],
    'Breno Sommelier 🍷': [
      { sender: 'Breno Sommelier 🍷', text: 'O lote dos vinhos da Serra Gaúcha já saiu da transportadora.', time: 'Ontem', isMe: false }
    ],
    'Juliana (Bixiga) ✨': [
      { sender: 'Juliana (Bixiga) ✨', text: 'Oii! Vi seu perfil e mandei uma reação: ❤️', time: 'Há 2 dias', isMe: false }
    ]
  });
  const [replyText, setReplyText] = useState('');

  const activeChatList = chats[selectedChatContact] || [
    { sender: selectedChatContact, text: `Oi! Sou ${selectedChatContact}. Vamos conversando por aqui! 😊`, time: '10:00', isMe: false }
  ];

  // Tinder states
  const [tinderProfileIdx, setTinderProfileIdx] = useState<number>(0);
  const [tinderAgeFilter, setTinderAgeFilter] = useState<string>('18 a 35 anos');
  const [tinderPatrimonioFilter, setTinderPatrimonioFilter] = useState<string>('Qualquer');
  const [tinderGenderFilter, setTinderGenderFilter] = useState<string>('Qualquer');
  const [tinderTab, setTinderTab] = useState<'explorar' | 'matches' | 'chat'>('explorar');
  const [tinderCardAnim, setTinderCardAnim] = useState<string>('');
  const [tinderFeedback, setTinderFeedback] = useState<{ text: string; positive: boolean } | null>(null);
  const [tinderInstantMatch, setTinderInstantMatch] = useState<{
    name: string;
    age: number;
    job: string;
    avatar: string;
    bio: string;
  } | null>({
    name: 'Juliana (Bixiga)',
    age: 26,
    job: 'Designer & Murais Urbanos 🎨',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkENpP07FRV77CR9X3S6eq61h5lDuNqBzNCXexsFnm0da9-2SCvGQceRch4hD2Zqy9g2brNVqAox2ktsyXUEIfkdqK9r_0n8ZTXXvak8WOiqQPvQM442hWEvSd_QNVqKDycCF4_oix5ODAny8Ixdkb8y7gECWq8W_GQZ_ejqGDp4JZO88DDot0ibCKZd6EkHKmLzkm52Q7I_Q61NTdHYJH3LJB2datFza3jgScx_Pm',
    bio: 'Juliana também te curtiu de volta após ver suas fotos na feira do Pacaembu!'
  });

  const showTinderFeedback = (text: string, positive: boolean = true) => {
    setTinderFeedback({ text, positive });
    setTimeout(() => {
      setTinderFeedback(null);
    }, 2800);
  };

  const handleChooseDate = (option: 'A' | 'B' | 'C') => {
    playSuccessSound();
    confetti({ particleCount: 45, spread: 65, origin: { y: 0.6 } });

    if (option === 'A') {
      setDateChoiceConfirmed('A. Bistrô Jardim Secreto 🌿');
      setChats(prev => ({
        ...prev,
        'Camila Duarte': [
          ...(prev['Camila Duarte'] || []),
          { sender: 'Você', text: 'Fechado! Vamos no Bistrô Jardim Secreto nesse sábado às 15h 🌿☕', time: '10:20', isMe: true },
          { sender: 'Camila Duarte', text: 'Oba! Amei demais! Vou pedir o bolo de cenoura com calda quente e reservar uma mesinha perto das plantas! Até sábado 🥰✨', time: '10:21', isMe: false }
        ]
      }));
      if (onApplyDilemmaConsequence) {
        onApplyDilemmaConsequence({
          grana: -48,
          felicidade: 25,
          efficiency: 15,
          logTitle: 'Encontro com Camila: Bistrô Jardim Secreto 🌿',
          logDesc: 'Tarde encantadora com café colonial, bolo de cenoura e conexão romântica em Pinheiros! (+25 Química/Felicidade, +15 Intelecto, -R$ 48,00)'
        });
      }
    } else if (option === 'B') {
      setDateChoiceConfirmed('B. Domingão no Pacaembu 🥟');
      setChats(prev => ({
        ...prev,
        'Camila Duarte': [
          ...(prev['Camila Duarte'] || []),
          { sender: 'Você', text: 'Feira do Pacaembu domingo de manhã! Pastel de queijo com muito vinagrete e caldo de cana é sagrado 🥟😂', time: '10:20', isMe: true },
          { sender: 'Camila Duarte', text: 'Hahaha perfeito! Já tô salivando só de pensar! Te encontro perto da barraca principal às 11h! 🥳🇧🇷', time: '10:21', isMe: false }
        ]
      }));
      if (onApplyDilemmaConsequence) {
        onApplyDilemmaConsequence({
          grana: -32,
          felicidade: 30,
          logTitle: 'Encontro com Camila: Pastel no Pacaembu 🥟',
          logDesc: 'Muitas risadas, pastel crocante de feira e conexão espontânea na Praça Charles Miller! (+30 Conexão, +20 Felicidade, -R$ 32,00)'
        });
      }
    } else {
      setDateChoiceConfirmed('C. Paulista Cultural & MASP 🎨');
      setChats(prev => ({
        ...prev,
        'Camila Duarte': [
          ...(prev['Camila Duarte'] || []),
          { sender: 'Você', text: 'O que acha de darmos uma volta no MASP na Paulista e depois tomar um expresso no vão livre? 🎨', time: '10:20', isMe: true },
          { sender: 'Camila Duarte', text: 'Uau, programa cultural nota 10! Faz tempo que queria ver a exposição nova de arte modernista. Combinadíssimo! 🏛️❤️', time: '10:21', isMe: false }
        ]
      }));
      if (onApplyDilemmaConsequence) {
        onApplyDilemmaConsequence({
          grana: -60,
          felicidade: 20,
          efficiency: 25,
          logTitle: 'Encontro com Camila: MASP & Paulista Cultural 🎨',
          logDesc: 'Passeio incrível sob os cavaletes de cristal de Lina Bo Bardi e café refinado na Av. Paulista! (+20 Química, +25 Intelecto, -R$ 60,00)'
        });
      }
    }
  };

  const handleSendHeartReaction = () => {
    playSuccessSound();
    setChats(prev => ({
      ...prev,
      [selectedChatContact]: [
        ...(prev[selectedChatContact] || []),
        { sender: 'Você', text: '❤️', time: '10:22', isMe: true }
      ]
    }));
    setTimeout(() => {
      setChats(prev => ({
        ...prev,
        [selectedChatContact]: [
          ...(prev[selectedChatContact] || []),
          { sender: selectedChatContact, text: 'Aii que fofo! ❤️ Mandou um coração de volta 🥰✨', time: '10:23', isMe: false }
        ]
      }));
    }, 600);
  };

  if (!isOpen) return null;

  if (gameState.character.age < 18) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fade-in text-slate-900">
        <div className="bg-[#fffdf7] dark:bg-slate-900 border-2 border-amber-500 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative text-slate-900 dark:text-slate-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold p-1 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto shadow-md">
            <Smartphone className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-100 dark:bg-amber-900/50 px-2.5 py-0.5 rounded-full inline-block">
              🔞 Bloqueado por Idade
            </span>
            <h3 className="font-heading font-black text-lg text-slate-900 dark:text-white">
              Acesso ao Celular (18+ Anos)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
              Você tem atualmente <strong>{gameState.character.age} anos</strong>. O uso e acesso ao celular, redes sociais e aplicativos de relacionamento é liberado apenas a partir dos <strong>18 anos de idade</strong>!
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    );
  }

  const handleOpenApp = (app: PhoneApp) => {
    playClickSound();
    setActiveApp(app);
  };

  const handleBackToHome = () => {
    playClickSound();
    setActiveApp('home');
    setDilemmaFeedback(null);
  };

  const handleResolveDilemma = (dilemma: WorkplaceDilemmaItem, optionIndex: number) => {
    playClickSound();
    playSuccessSound();
    const opt = dilemma.options[optionIndex];
    setResolvedDilemmas(prev => ({ ...prev, [dilemma.id]: opt.label }));
    setDilemmaFeedback(opt.narrative);

    if (opt.felicidade > 0 || opt.grana > 0) {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    }

    if (onApplyDilemmaConsequence) {
      onApplyDilemmaConsequence({
        felicidade: opt.felicidade,
        grana: opt.grana,
        serasa: opt.serasa,
        efficiency: opt.efficiency,
        logTitle: `Dilema de Trabalho: ${dilemma.title}`,
        logDesc: opt.narrative
      });
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    playClickSound();
    const userMsg = replyText;
    setReplyText('');

    setChats(prev => ({
      ...prev,
      [selectedChatContact]: [
        ...(prev[selectedChatContact] || []),
        { sender: 'Você', text: userMsg, time: '10:24', isMe: true }
      ]
    }));

    setTimeout(() => {
      let reply = 'Tudo ótimo por aqui! Vamos nos falando. 😊';
      const lower = userMsg.toLowerCase();
      const friendMatch = gameState.family?.friends?.find(f => f.name === selectedChatContact);

      if (friendMatch?.type === 'ex') {
        if (lower.includes('oi') || lower.includes('tudo bem')) reply = 'Tudo indo... Estranho você me mandar oi depois de tudo que aconteceu entre nós.';
        else if (lower.includes('sair') || lower.includes('encontro')) reply = 'Olha, não sei se é boa ideia a gente se ver agora. Preciso de um tempo.';
        else reply = 'Prefiro que a gente mantenha a distância por enquanto.';
      } else if (friendMatch?.type === 'amante') {
        if (lower.includes('oi') || lower.includes('tudo bem')) reply = 'Oi gato(a)! Morrendo de saudades dos nossos momentos escondidos 🔥';
        else if (lower.includes('sair') || lower.includes('encontro')) reply = 'Sim! Vamos marcar naquele lugar discreto hoje à noite? 😈';
        else reply = 'Qualquer momento com você é incrível... me chama no privado!';
      } else if (selectedChatContact === partnerName || selectedChatContact.includes('Amor')) {
        if (lower.includes('oi') || lower.includes('amor')) reply = 'Oi meu amor! Te amo muito, você é o amor da minha vida! ❤️';
        else if (lower.includes('sair') || lower.includes('jantar')) reply = 'Amo a ideia! Vamos jantar naquele restaurante romântico! 💕';
        else reply = 'Tudo por você, meu bem! Te vejo em casa.';
      } else if (selectedChatContact.includes('Mãe')) {
        if (lower.includes('oi') || lower.includes('tudo bem')) reply = 'Tudo ótimo por aqui meu filho! Com Deus no coração sempre. 🙏✨';
        else reply = 'Coma direito e se agasalhe, hein! Beijos da mamãe.';
      } else if (selectedChatContact === 'Camila Duarte') {
        if (lower.includes('oi') || lower.includes('olá')) reply = 'Oi Lucas! Ansiosa pro nosso café no sábado! ☕🌿';
        else reply = 'Com certeza! Vamos nos falando sim! ✨';
      } else {
        if (lower.includes('oi') || lower.includes('olá')) reply = 'Oi! Que bom falar com você! Como estão as coisas? 😊';
        else if (lower.includes('sair') || lower.includes('encontro')) reply = 'Bora! Adoraria sair com você, me avisa quando tiver um tempo livre! ✨';
        else reply = 'Que bacana! Vamos nos falando por aqui.';
      }

      setChats(prev => ({
        ...prev,
        [selectedChatContact]: [
          ...(prev[selectedChatContact] || []),
          { sender: selectedChatContact, text: reply, time: '10:25', isMe: false }
        ]
      }));
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      {/* Smartphone Chassis Frame */}
      <div className="relative w-full max-w-[390px] h-[86vh] max-h-[750px] bg-slate-900 rounded-[3rem] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_8px_#1e293b,0_0_0_10px_#0f172a] flex flex-col overflow-hidden border border-slate-700/50">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-2.5 shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-blue-500/80"></span>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500/70 animate-pulse"></div>
        </div>

        {/* Smartphone Screen Container */}
        <div
          data-dark={isDarkMode || phoneTheme === 'dark' ? 'true' : 'false'}
          className={`relative flex-1 rounded-[2.5rem] overflow-hidden flex flex-col text-white ${
            phoneTheme === 'emerald'
              ? 'bg-gradient-to-b from-[#064e3b] via-[#022c22] to-[#021a14]'
              : phoneTheme === 'blue'
              ? 'bg-gradient-to-b from-[#1e3a8a] via-[#1e1b4b] to-[#0f172a]'
              : phoneTheme === 'rose'
              ? 'bg-gradient-to-b from-[#831843] via-[#500724] to-[#2a0413]'
              : phoneTheme === 'dark'
              ? 'bg-gradient-to-b from-[#0f172a] via-[#020617] to-[#000000]'
              : 'bg-gradient-to-b from-[#0f2e20] via-[#091b13] to-[#040d09]'
          }`}
        >
          
          {/* Status Bar */}
          <div className="pt-2.5 px-6 pb-2 flex items-center justify-between text-[11px] font-bold text-slate-200 z-30 select-none">
            <span>09:41</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-mono font-bold text-emerald-400">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">98%</span>
                <BatteryCharging className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* App Header (when not home) */}
          {activeApp !== 'home' ? (
            <div className="px-4 py-2 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between z-30">
              <button
                type="button"
                onClick={handleBackToHome}
                className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors py-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Início</span>
              </button>

              <span className="text-xs font-extrabold font-heading text-slate-100 uppercase tracking-wide truncate max-w-[190px]">
                {activeApp === 'noticias' && 'Notícias do Brasil'}
                {activeApp === 'dilemas' && 'Dilemas de Trabalho'}
                {activeApp === 'calendario' && 'Calendário de Eventos'}
                {activeApp === 'whatsapp' && (whatsappView === 'chat' ? `Zap • ${selectedChatContact}` : 'Zap Tropical • Conversas')}
                {activeApp === 'tinder' && 'Tinder Tropical BR'}
                {activeApp === 'banco' && 'Banco Digital & PIX'}
                {activeApp === 'redes' && 'InstaVida • Redes'}
                {activeApp === 'clt' && 'Carteira & Direitos'}
                {activeApp === 'config' && 'Configurações'}
              </span>

              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Fechar Celular"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Close button on home screen */
            <div className="absolute top-10 right-4 z-30">
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center border border-white/20 transition-all hover:scale-105 cursor-pointer shadow-lg"
                title="Guardar Celular"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Screen Content Body */}
          <div className={`flex-1 overflow-y-auto select-none ${
            activeApp === 'whatsapp' || activeApp === 'tinder' ? 'p-0 bg-[#f4fbf5]' : 'px-4 py-3'
          }`}>
            
            {/* 1. HOME SCREEN (Colunas e Linhas de Aplicativos) */}
            {activeApp === 'home' && (
              <div className="flex flex-col h-full justify-between pb-3">
                {/* Clock & Date Widget */}
                <div className="mt-6 mb-5 text-center">
                  <span className="text-4xl font-extrabold font-display tracking-tight text-white drop-shadow-md">
                    09:41
                  </span>
                  <p className="text-xs font-semibold text-emerald-200/90 mt-0.5">
                    Quarta-feira • Ano {gameState.character.year}
                  </p>
                  <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10.5px] font-bold text-emerald-300">
                    <span>📱 Smartphone • {gameState.character.name.split(' ')[0]}</span>
                  </div>
                </div>

                {/* Grid de Ícones de Apps (3 Colunas x Linhas) */}
                <div className="grid grid-cols-3 gap-y-4 gap-x-3 px-2">
                  
                  {/* --- PRIMEIRA LINHA DE COLUNAS --- */}
                  {/* 1. Notícias do Brasil */}
                  <button
                    type="button"
                    onClick={() => handleOpenApp('noticias')}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-900/40 border border-blue-400/40 group-hover:scale-105 transition-transform">
                      <Newspaper className="w-7 h-7 text-white" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-black flex items-center justify-center text-white border border-slate-900 animate-pulse">
                        !
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-white text-center leading-tight drop-shadow-sm">
                      Notícias Brasil
                    </span>
                  </button>

                  {/* 2. Dilemas de Trabalho (RH / Ética) */}
                  <button
                    type="button"
                    onClick={() => handleOpenApp('dilemas')}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-900/40 border border-amber-300/40 group-hover:scale-105 transition-transform">
                      <Briefcase className="w-7 h-7 text-slate-950" />
                      <span className="absolute -bottom-1 -right-1 px-1 rounded-md bg-emerald-500 text-[8.5px] font-black text-slate-950 shadow-xs uppercase">
                        RH
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-white text-center leading-tight drop-shadow-sm">
                      Dilemas Trabalho
                    </span>
                  </button>

                  {/* 3. Calendário de Eventos */}
                  <button
                    type="button"
                    onClick={() => handleOpenApp('calendario')}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/40 border border-emerald-300/40 group-hover:scale-105 transition-transform">
                      <Calendar className="w-7 h-7 text-white" />
                      <span className="absolute top-1 text-[8px] font-extrabold uppercase text-emerald-100">
                        ANO
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-white text-center leading-tight drop-shadow-sm">
                      Calendário
                    </span>
                  </button>

                  {/* --- SEGUNDA LINHA DE COLUNAS --- */}
                  {/* 4. WhatsApp / Mensagens da Família */}
                  <button
                    type="button"
                    onClick={() => handleOpenApp('whatsapp')}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-green-600 via-emerald-500 to-lime-400 flex items-center justify-center shadow-lg shadow-green-900/40 border border-green-300/40 group-hover:scale-105 transition-transform">
                      <MessageCircle className="w-7 h-7 text-white" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-black flex items-center justify-center text-white border border-slate-900">
                        3
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-white text-center leading-tight drop-shadow-sm">
                      WhatsApp
                    </span>
                  </button>

                  {/* 5. Banco Digital & PIX */}
                  <button
                    type="button"
                    onClick={() => handleOpenApp('banco')}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-violet-400 flex items-center justify-center shadow-lg shadow-purple-900/40 border border-purple-300/40 group-hover:scale-105 transition-transform">
                      <CreditCard className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-[11px] font-bold text-white text-center leading-tight drop-shadow-sm">
                      Banco &amp; PIX
                    </span>
                  </button>

                  {/* 6. Redes Sociais / InstaVida */}
                  <button
                    type="button"
                    onClick={() => handleOpenApp('redes')}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-400 flex items-center justify-center shadow-lg shadow-pink-900/40 border border-pink-300/40 group-hover:scale-105 transition-transform">
                      <Camera className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-[11px] font-bold text-white text-center leading-tight drop-shadow-sm">
                      InstaVida
                    </span>
                  </button>

                  {/* --- TERCEIRA LINHA DE COLUNAS --- */}
                  {/* 7. Direitos Trabalhistas & Carteira */}
                  <button
                    type="button"
                    onClick={() => handleOpenApp('clt')}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-700 via-blue-600 to-sky-400 flex items-center justify-center shadow-lg shadow-cyan-900/40 border border-cyan-300/40 group-hover:scale-105 transition-transform">
                      <Calculator className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-[11px] font-bold text-white text-center leading-tight drop-shadow-sm">
                      Calculadora CLT
                    </span>
                  </button>

                  {/* 8. Amor & Tinder */}
                  <button
                    type="button"
                    onClick={() => handleOpenApp('tinder')}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-orange-400 flex items-center justify-center shadow-lg shadow-rose-900/40 border border-rose-300/40 group-hover:scale-105 transition-transform">
                      <Heart className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-[11px] font-bold text-white text-center leading-tight drop-shadow-sm">
                      Tinder Amor
                    </span>
                  </button>

                  {/* 9. Ajustes do Aparelho */}
                  <button
                    type="button"
                    onClick={() => handleOpenApp('config')}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-700 via-slate-600 to-slate-500 flex items-center justify-center shadow-lg shadow-slate-900/40 border border-slate-400/40 group-hover:scale-105 transition-transform">
                      <Settings className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-[11px] font-bold text-white text-center leading-tight drop-shadow-sm">
                      Ajustes
                    </span>
                  </button>
                </div>

                {/* Bottom Dock Fixo (4 Apps) */}
                <div className="mt-6 p-2.5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-around shadow-xl">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-md cursor-pointer hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div
                    onClick={() => handleOpenApp('whatsapp')}
                    className="w-11 h-11 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-md cursor-pointer hover:scale-105 transition-transform"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div
                    onClick={() => handleOpenApp('noticias')}
                    className="w-11 h-11 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-md cursor-pointer hover:scale-105 transition-transform"
                  >
                    <Compass className="w-5 h-5" />
                  </div>
                  <div
                    onClick={() => handleOpenApp('redes')}
                    className="w-11 h-11 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-md cursor-pointer hover:scale-105 transition-transform"
                  >
                    <Camera className="w-5 h-5" />
                  </div>
                </div>
              </div>
            )}

            {/* 2. APP: NOTÍCIAS DO BRASIL (REMANEJADO DA ABA INÍCIO) */}
            {activeApp === 'noticias' && (
              <div className="space-y-3 pt-1 text-slate-800">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      <span className="text-xs font-black font-heading text-red-600 uppercase">
                        G1 Brasil • Plantão Ao Vivo
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {gameState.character.year}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-2">
                    Acompanhe as notícias de economia, política e cultura do Brasil direto pelo seu celular!
                  </p>

                  <BrazilNewsTicker
                    news={currentNews || gameState.currentNews}
                    currentYear={gameState.character.year}
                    timeAdvanceMode={gameState.timeAdvanceMode}
                    timeSubPeriod={gameState.timeSubPeriod}
                    onReactToNews={onReactToNews}
                  />
                </div>
              </div>
            )}

            {/* 3. APP: DILEMAS ÉTICOS DO TRABALHO (REMANEJADO DA ABA INÍCIO) */}
            {activeApp === 'dilemas' && (
              <div className="space-y-3 pt-1 text-slate-800">
                <div className="p-3.5 bg-white rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      ⚖️
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-xs text-slate-900 uppercase">
                        RH &amp; Dilemas Éticos Corporativos
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        {gameState.career.title} • {gameState.career.companyOrOrg}
                      </p>
                    </div>
                  </div>

                  {dilemmaFeedback && (
                    <div className="p-2.5 mb-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl animate-fade-in">
                      {dilemmaFeedback}
                    </div>
                  )}

                  <div className="space-y-3">
                    {WORKPLACE_ETHICAL_DILEMMAS.map((dilemma) => {
                      const isResolved = !!resolvedDilemmas[dilemma.id];

                      return (
                        <div
                          key={dilemma.id}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-heading font-bold text-xs text-slate-900">
                              {dilemma.title}
                            </h4>
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900">
                              {dilemma.category}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {dilemma.description}
                          </p>

                          {isResolved ? (
                            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Decisão: {resolvedDilemmas[dilemma.id]}</span>
                            </div>
                          ) : (
                            <div className="space-y-1.5 pt-1">
                              {dilemma.options.map((opt, oIdx) => (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => handleResolveDilemma(dilemma, oIdx)}
                                  className="w-full text-left p-2 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 transition-all text-xs cursor-pointer shadow-xs"
                                >
                                  <div className="font-bold text-slate-900 leading-snug">
                                    {opt.label}
                                  </div>
                                  <div className="text-[10px] text-slate-500 mt-0.5">
                                    {opt.description}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 4. APP: CALENDÁRIO DE EVENTOS (REMANEJADO DA ABA INÍCIO) */}
            {activeApp === 'calendario' && (
              <div className="space-y-3 pt-1 text-slate-800">
                <CalendarOfEvents
                  gameState={gameState}
                  onCelebrate={onCelebrate}
                />
              </div>
            )}

            {/* 5. APP: WHATSAPP DO CELULAR (ZAP TROPICAL COM ESTÉTICA DE CONVERSAS E CHAT DO ENCONTRO) */}
            {activeApp === 'whatsapp' && (
              <div className="flex flex-col h-full bg-[#f4fbf5] text-[#161d19]">
                {/* WHATSAPP VIEW A: LISTA DE CONVERSAS */}
                {whatsappView === 'list' && (
                  <div className="flex flex-col h-full overflow-y-auto pb-4 select-none">
                    {/* Top Header Zap Tropical */}
                    <div className="bg-[#006d41] text-white px-3.5 pt-3 pb-2.5 shadow-md sticky top-0 z-20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-5 h-5 text-[#7bfbb3] fill-[#7bfbb3]" />
                          <h2 className="font-heading font-black text-sm tracking-tight text-white">Zap Tropical</h2>
                        </div>
                        <div className="flex items-center gap-3 text-white/90">
                          <button
                            type="button"
                            onClick={() => playClickSound()}
                            className="p-1 rounded-full hover:bg-white/10 active:opacity-75 transition-colors cursor-pointer"
                            title="Câmera"
                          >
                            <Camera className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => playClickSound()}
                            className="p-1 rounded-full hover:bg-white/10 active:opacity-75 transition-colors cursor-pointer"
                            title="Pesquisar"
                          >
                            <Search className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => playClickSound()}
                            className="p-1 rounded-full hover:bg-white/10 active:opacity-75 transition-colors cursor-pointer"
                            title="Mais Opções"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Navegação de Abas Táteis */}
                      <nav className="flex items-center justify-between gap-1 mt-2.5 text-white">
                        <button
                          type="button"
                          onClick={() => { playClickSound(); setActiveZapTab('conversas'); }}
                          className={`flex-1 py-1 text-center font-bold text-xs relative flex items-center justify-center gap-1.5 transition-transform active:translate-y-0.5 cursor-pointer ${
                            activeZapTab === 'conversas' ? 'text-white' : 'text-emerald-200/80'
                          }`}
                        >
                          <span>Conversas</span>
                          <span className="bg-[#7bfbb3] text-[#002110] px-1.5 py-0.2 rounded-full text-[10px] font-extrabold shadow-xs">
                            4
                          </span>
                          {activeZapTab === 'conversas' && (
                            <div className="absolute -bottom-2.5 inset-x-2 h-1 bg-[#7bfbb3] rounded-t-full"></div>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => { playClickSound(); setActiveZapTab('status'); }}
                          className={`flex-1 py-1 text-center font-bold text-xs flex items-center justify-center gap-1 transition-transform active:translate-y-0.5 cursor-pointer ${
                            activeZapTab === 'status' ? 'text-white' : 'text-emerald-200/80 hover:text-white'
                          }`}
                        >
                          <span>Status</span>
                          <span className="w-2 h-2 rounded-full bg-[#dbe1ff] animate-pulse"></span>
                        </button>
                        <button
                          type="button"
                          onClick={() => { playClickSound(); setActiveZapTab('chamadas'); }}
                          className={`flex-1 py-1 text-center font-bold text-xs flex items-center justify-center gap-1 transition-transform active:translate-y-0.5 cursor-pointer ${
                            activeZapTab === 'chamadas' ? 'text-white' : 'text-emerald-200/80 hover:text-white'
                          }`}
                        >
                          <span>Chamadas</span>
                        </button>
                      </nav>
                    </div>

                    {/* Campo de Busca Tátil */}
                    <div className="px-3 mt-2.5 mb-1.5">
                      <div className="bg-[#eef5ef] rounded-xl px-2.5 py-1.5 flex items-center gap-2 shadow-xs border border-[#dde4de]">
                        <Search className="w-4 h-4 text-[#6d7a70]" />
                        <input
                          type="text"
                          value={searchContactText}
                          onChange={(e) => setSearchContactText(e.target.value)}
                          placeholder="Pesquisar conversas ou parentes..."
                          className="bg-transparent text-[#161d19] placeholder:text-[#6d7a70] text-xs w-full focus:outline-none font-medium"
                        />
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#6d7a70]" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 px-3">
                      {/* Seção: CONVERSAS FIXADAS */}
                      <section className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between px-0.5">
                          <div className="flex items-center gap-1 text-[#3d4a40] text-[11px] font-extrabold uppercase tracking-wide">
                            <Pin className="w-3.5 h-3.5 text-[#0051d5] fill-[#0051d5]" />
                            <span>CONVERSAS FIXADAS</span>
                          </div>
                          <span className="text-[10px] text-[#6d7a70] font-semibold">Prioridade Máxima</span>
                        </div>

                        {/* Card Fixado 1: Patrícia Amor / Cônjuge */}
                        <article
                          onClick={() => {
                            playClickSound();
                            const partnerName = gameState.relationship?.partnerName || 'Patrícia Amor 💖';
                            setSelectedChatContact(partnerName);
                            setWhatsappView('chat');
                          }}
                          className="bg-white rounded-xl p-2.5 flex flex-col gap-2 shadow-[0_2px_0_0_#dde4de] border border-[#dde4de] active:translate-y-0.5 transition-transform cursor-pointer"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-[#e8f0e9] border border-[#dde4de]">
                              <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ5sao_HHZBVDOmzYZgcqiYWKplKY9atGnH7R1Lw8JngeFP9csiB5_-wE4JYPBZ5VsGtyaGPUcM66zv6z4GeC4PKAeKtyRVFu1xfz6vjC8S0IQt7n-k4_Zp5P1IqLXuNjba_d2LYQJPHa_39KBfsCbyi64gXy6DILq9z6VmZooA2nef9cXcVOp87vvwR7Vqlr2jpn9iU9gmW6ZkGf7nDnn_rlWVHSsJJrfscuoGBcv"
                                alt="Patrícia Amor"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#0ca768] rounded-full flex items-center justify-center text-white">
                                <Heart className="w-2.5 h-2.5 fill-white" />
                              </div>
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 min-w-0">
                                  <h3 className="font-heading font-black text-xs text-[#161d19] truncate">
                                    {gameState.relationship?.partnerName || 'Patrícia Amor 💖'}
                                  </h3>
                                  <Pin className="w-3 h-3 text-[#0051d5] fill-[#0051d5] shrink-0" />
                                </div>
                                <span className="text-[10px] text-[#006d41] font-bold">11:27</span>
                              </div>
                              <p className="text-[11px] text-[#3d4a40] truncate mt-0.5">
                                Amor, lembra de comprar o açaí na volta...
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <span className="bg-[#0ca768] text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full shadow-xs">
                                2
                              </span>
                            </div>
                          </div>

                          {/* Gameplay HUD Bar: Afeto */}
                          <div className="flex items-center justify-between bg-[#eef5ef] px-2 py-1 rounded-lg">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-[#3d4a40]">💍 Em Alta / Afeto</span>
                              <div className="w-16 bg-[#dde4de] h-1.5 rounded-full overflow-hidden">
                                <div className="bg-[#0ca768] h-full w-full rounded-full"></div>
                              </div>
                              <span className="text-[10px] text-[#006d41] font-black">100%</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                playClickSound();
                                setSelectedChatContact(gameState.relationship?.partnerName || 'Patrícia Amor 💖');
                                setWhatsappView('chat');
                              }}
                              className="bg-[#316bf3] text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs active:translate-y-0.5 cursor-pointer"
                            >
                              <span>Conversar</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </article>

                        {/* Card Fixado 2: Família Silva */}
                        <article
                          onClick={() => {
                            playClickSound();
                            setSelectedChatContact('Família Silva 👨‍👩‍👧‍👦');
                            setWhatsappView('chat');
                          }}
                          className="bg-white rounded-xl p-2.5 flex flex-col gap-2 shadow-[0_2px_0_0_#dde4de] border border-[#dde4de] active:translate-y-0.5 transition-transform cursor-pointer"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-[#e8f0e9] border border-[#dde4de]">
                              <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmjqi1TkrHjsTK7vbUFngIkLnXuuZwlEmfYIDD2yyXt_hzcppuDqS_vZB3rSUgjRU0gdYP3hmnUNWxiOY-ENdryUWHqUVgBS0CXE2YzPiWld3LEqovAI0bNNimjkXdL9XrtNBcKF8AXq3DPaxhr6DRl1HxPWUoaDEjJh2U4XSIHEj_x_0Vm4iLhXltYro3J_Oi3qz30CkN20Dr6paal1oTNNDoK2KehJZLnk7XSHCi"
                                alt="Família Silva"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#0051d5] rounded-full flex items-center justify-center text-white">
                                <Users className="w-2.5 h-2.5" />
                              </div>
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 min-w-0">
                                  <h3 className="font-heading font-black text-xs text-[#161d19] truncate">
                                    Família Silva 👨‍👩‍👧‍👦
                                  </h3>
                                  <Pin className="w-3 h-3 text-[#0051d5] fill-[#0051d5] shrink-0" />
                                </div>
                                <span className="text-[10px] text-[#006d41] font-bold">10:45</span>
                              </div>
                              <p className="text-[11px] text-[#3d4a40] truncate mt-0.5">
                                <span className="font-bold text-[#161d19]">Mãe:</span> Quem vem pro almoço de domingo?
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <span className="bg-[#0ca768] text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full shadow-xs">
                                3
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between bg-[#eef5ef] px-2 py-1 rounded-lg">
                            <div className="flex items-center gap-1.5">
                              <span className="bg-[#dbe1ff] text-[#00174b] text-[9.5px] font-extrabold px-1.5 py-0.5 rounded">
                                Grupo da Família
                              </span>
                              <span className="text-[9.5px] text-[#6d7a70] font-semibold">Moral familiar +5</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                playClickSound();
                                setSelectedChatContact('Família Silva 👨‍👩‍👧‍👦');
                                setWhatsappView('chat');
                              }}
                              className="bg-[#e3eae4] text-[#161d19] text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs active:translate-y-0.5 cursor-pointer"
                            >
                              <span>Abrir Grupo</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </article>
                      </section>

                      {/* Seção: TODAS AS CONVERSAS */}
                      <section className="flex flex-col gap-1.5 mt-0.5">
                        <div className="flex items-center justify-between px-0.5">
                          <span className="text-[#3d4a40] text-[11px] font-extrabold tracking-wide uppercase">
                            TODAS AS CONVERSAS
                          </span>
                          <span className="text-[10px] text-[#6d7a70] font-semibold">Recentes</span>
                        </div>

                        {/* Conversa 1: Camila Duarte (Match do Tinder) */}
                        <article
                          onClick={() => {
                            playClickSound();
                            setSelectedChatContact('Camila Duarte');
                            setWhatsappView('chat');
                          }}
                          className="bg-white rounded-xl p-2.5 flex items-center gap-2.5 shadow-[0_2px_0_0_#dde4de] border border-[#dde4de] active:translate-y-0.5 transition-transform cursor-pointer"
                        >
                          <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 bg-[#e8f0e9]">
                            <img
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUK4VJkjeKJDgIU8l6M-XxjsXqaR3Z8vx34y_iAsvGiDtDWWRyYKZUIsFTUkA3kmHk55z5tE7bUox35Qzyw84MZ06s6oC6GsY6dPVHt7uuemm6cl-3lfNGD8Tp3hk8L0pJehdTvoW9wuE4Oa-I8OMoKHq6rh8BTMPgVzHsRD2qcX4YQOC1sSHnUkDmZ4LnfC9LnJ4RQZ_MVb2Kczd0Y-euAUsypb18RAbuw52tpAQw"
                              alt="Camila Duarte"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#5cde99] rounded-full border border-white"></div>
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-heading font-black text-xs text-[#161d19] truncate">Camila Duarte ☕</h3>
                              <span className="text-[10px] text-[#006d41] font-bold">10:19</span>
                            </div>
                            <p className="text-[11px] text-[#3d4a40] truncate mt-0.5">
                              Que tal a gente ir lá tomar um café nesse sábado? 🌿
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="bg-[#dbe1ff] text-[#00174b] text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                                Match Tinder
                              </span>
                              <span className="text-[9.5px] text-[#006d41] font-bold">Interesse 78%</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end justify-center shrink-0">
                            <span className="bg-[#0ca768] text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full shadow-xs">
                              1
                            </span>
                          </div>
                        </article>

                        {/* Conversa 2: Mãe (Aline Silva) */}
                        <article
                          onClick={() => {
                            playClickSound();
                            setSelectedChatContact('Mãe (Aline Silva) 🌸');
                            setWhatsappView('chat');
                          }}
                          className="bg-white rounded-xl p-2.5 flex items-center gap-2.5 shadow-[0_2px_0_0_#dde4de] border border-[#dde4de] active:translate-y-0.5 transition-transform cursor-pointer"
                        >
                          <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-[#e8f0e9]">
                            <img
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgHipZT6knfNo3pGCbvGI7WNdVtP6TzFPttci_nu5fI_khArX7IYFUb7R11Ps8KnLX_npG0IE-0AmpIT_tVG4_o9ARl7cFscN5Vp1e1g7x6ob1JgP2Bu4h4D7jp3cCl80wog_cgxS4B6a9fiueqyIoDPUpcMTHaqc2Zv28N5Kj_j6ybZGxnxlxs9I1T6cn-nP7yN3FE6j_tAWMzORKv6T_JVRTGadaLZEP1VtllP-B"
                              alt="Mãe"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-heading font-black text-xs text-[#161d19] truncate">Mãe (Aline Silva) 🌸</h3>
                              <span className="text-[10px] text-[#6d7a70]">09:12</span>
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <CheckCheck className="w-3 h-3 text-[#0051d5]" />
                              <p className="text-[11px] text-[#3d4a40] truncate">Meu filho, não esquece o casaco!</p>
                            </div>
                            <span className="text-[9.5px] text-[#6d7a70] mt-1 font-semibold">Carinho Materno Infinito</span>
                          </div>
                        </article>

                        {/* Conversa 3: Seu Geraldo (Pai) */}
                        <article
                          onClick={() => {
                            playClickSound();
                            setSelectedChatContact('Seu Geraldo (Pai) 👴');
                            setWhatsappView('chat');
                          }}
                          className="bg-white rounded-xl p-2.5 flex items-center gap-2.5 shadow-[0_2px_0_0_#dde4de] border border-[#dde4de] active:translate-y-0.5 transition-transform cursor-pointer"
                        >
                          <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-[#e8f0e9]">
                            <img
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBA67WUlOaFnFQMgihBK8TO9j_LI9f2GUr9nExxQZfhRpzQzypexru4zye8K-6Wxz12Gj4UORFJZwhH3LUjCEWfPR-seLkt8GLhY_y3ZF2lZ2YkNA58S8da5Y78YRRk7Vc6fSb86qfAfrA7yuh_bUf2W8AN2iVvw7_6S3Cvf3mNOolL1xH_fLW3D2ioiW4QLqwO8R5CzJ4ulKBl6AdC4Tp_7G-6P11l_4unrIn390dT"
                              alt="Seu Geraldo"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-heading font-black text-xs text-[#161d19] truncate">Seu Geraldo (Pai) 👴</h3>
                              <span className="text-[10px] text-[#6d7a70]">Ontem</span>
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <CheckCheck className="w-3 h-3 text-[#6d7a70]" />
                              <p className="text-[11px] text-[#3d4a40] truncate">Vi que a adega tá crescendo rápido, parabéns!</p>
                            </div>
                            <span className="text-[9.5px] text-[#006d41] font-bold mt-1">Orgulho da Família</span>
                          </div>
                        </article>

                        {/* Conversa 4: Breno Sommelier */}
                        <article
                          onClick={() => {
                            playClickSound();
                            setSelectedChatContact('Breno Sommelier 🍷');
                            setWhatsappView('chat');
                          }}
                          className="bg-white rounded-xl p-2.5 flex items-center gap-2.5 shadow-[0_2px_0_0_#dde4de] border border-[#dde4de] active:translate-y-0.5 transition-transform cursor-pointer"
                        >
                          <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-[#e8f0e9]">
                            <img
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVlsZ5cGN_yo8DVSXVT4RYwsO9gGpW0loUScVn-NFSCsijP1QmEo2o-Sbe4DQi6i_SrCHD7AqnN4-8Xe9_reyJralFPPGje_peiHsnSeRG25DFY-gBtpeYuQ59EapDPbn2-0FqoWmWEmxewYfbG_lfTi_9tCcePzLRW2nBvV8reInxeB4_e2qW7p-SHN86Vb92PrGfNkYrBnROtMmk4jz88Uf8tAyLlgBtchq6J-js"
                              alt="Breno Sommelier"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-heading font-black text-xs text-[#161d19] truncate">Breno Sommelier 🍷</h3>
                              <span className="text-[10px] text-[#6d7a70]">Ontem</span>
                            </div>
                            <p className="text-[11px] text-[#3d4a40] truncate mt-0.5">
                              O lote dos vinhos da Serra Gaúcha já saiu da transportadora.
                            </p>
                            <span className="text-[9.5px] text-[#3d4a40] mt-1 font-semibold">Fornecedor Adega</span>
                          </div>
                        </article>

                        {/* Conversa 5: Juliana (Bixiga) */}
                        <article
                          onClick={() => {
                            playClickSound();
                            setSelectedChatContact('Juliana (Bixiga) ✨');
                            setWhatsappView('chat');
                          }}
                          className="bg-white rounded-xl p-2.5 flex items-center gap-2.5 shadow-[0_2px_0_0_#dde4de] border border-[#dde4de] active:translate-y-0.5 transition-transform cursor-pointer"
                        >
                          <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-[#e8f0e9]">
                            <img
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkENpP07FRV77CR9X3S6eq61h5lDuNqBzNCXexsFnm0da9-2SCvGQceRch4hD2Zqy9g2brNVqAox2ktsyXUEIfkdqK9r_0n8ZTXXvak8WOiqQPvQM442hWEvSd_QNVqKDycCF4_oix5ODAny8Ixdkb8y7gECWq8W_GQZ_ejqGDp4JZO88DDot0ibCKZd6EkHKmLzkm52Q7I_Q61NTdHYJH3LJB2datFza3jgScx_Pm"
                              alt="Juliana Bixiga"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-heading font-black text-xs text-[#161d19] truncate">Juliana (Bixiga) ✨</h3>
                              <span className="text-[10px] text-[#6d7a70]">Há 2 dias</span>
                            </div>
                            <p className="text-[11px] text-[#3d4a40] truncate mt-0.5">Mandou uma reação: ❤️</p>
                            <span className="text-[9.5px] text-[#0051d5] font-bold mt-1">Novo Contato</span>
                          </div>
                        </article>

                        {/* Amigos Dinâmicos do Estado do Jogo */}
                        {gameState.family?.friends?.map((f) => {
                          const isEx = f.type === 'ex';
                          return (
                            <article
                              key={f.id}
                              onClick={() => {
                                playClickSound();
                                setSelectedChatContact(f.name);
                                setWhatsappView('chat');
                              }}
                              className={`bg-white rounded-xl p-2.5 flex items-center gap-2.5 shadow-[0_2px_0_0_#dde4de] border active:translate-y-0.5 transition-transform cursor-pointer ${
                                isEx ? 'border-amber-400 bg-amber-50/40' : 'border-[#dde4de]'
                              }`}
                            >
                              <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-[#e8f0e9] flex items-center justify-center text-lg">
                                {f.gender === 'F' ? '👩' : '👨'}
                              </div>
                              <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1 min-w-0">
                                    <h3 className="font-heading font-black text-xs text-[#161d19] truncate">{f.name}</h3>
                                    {isEx && (
                                      <span className="text-[9px] bg-amber-200 text-amber-900 font-extrabold px-1 py-0.2 rounded flex items-center gap-0.5">
                                        ⚠️ Ex
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-[#6d7a70]">Recente</span>
                                </div>
                                <p className="text-[11px] text-[#3d4a40] truncate mt-0.5">
                                  {isEx ? 'Oi... podemos conversar um minuto?' : 'Bora marcar de nos ver em breve!'}
                                </p>
                                <span className="text-[9.5px] text-[#006d41] font-bold mt-1">
                                  {f.type} • Afeto: {f.affection}%
                                </span>
                              </div>
                            </article>
                          );
                        })}
                      </section>

                      {/* Botão Tátil para Guardar Smartphone */}
                      <div className="mt-2 pt-1 pb-4">
                        <button
                          type="button"
                          onClick={handleBackToHome}
                          className="w-full bg-[#e3eae4] hover:bg-[#dde4de] text-[#161d19] py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-[0_2px_0_0_#dde4de] active:translate-y-0.5 transition-transform font-bold text-xs cursor-pointer"
                        >
                          <Smartphone className="w-4 h-4 text-[#0051d5]" />
                          <span>Guardar Smartphone &amp; Voltar ao Jogo 📲</span>
                        </button>
                      </div>
                    </div>

                    {/* Botão Flutuante (FAB) de Nova Conversa */}
                    <div className="fixed bottom-7 right-7 z-30">
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setSelectedChatContact('Camila Duarte');
                          setWhatsappView('chat');
                        }}
                        aria-label="Iniciar Nova Conversa"
                        className="w-12 h-12 rounded-full bg-[#0ca768] hover:bg-[#006d41] text-white flex items-center justify-center shadow-lg active:translate-y-1 transition-transform cursor-pointer border-2 border-white"
                        title="Nova Conversa"
                      >
                        <MessageSquare className="w-5 h-5 fill-white" />
                      </button>
                    </div>
                  </div>
                )}

                {/* WHATSAPP VIEW B: CHAT E ENCONTRO 1-ON-1 */}
                {whatsappView === 'chat' && (
                  <div className="flex flex-col h-full bg-[#f4fbf5] select-none">
                    {/* Header do Chat 1-on-1 */}
                    <div className="bg-[#f4fbf5]/95 backdrop-blur-md px-3 py-2 border-b border-[#dde4de] flex items-center justify-between gap-2 sticky top-0 z-20 shadow-xs">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => { playClickSound(); setWhatsappView('list'); }}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#eef5ef] text-[#006d41] hover:bg-[#e3eae4] active:translate-y-0.5 transition-transform cursor-pointer shadow-[0_1px_0_0_#dde4de]"
                          title="Voltar à lista de conversas"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div className="relative shrink-0">
                          <img
                            src={
                              selectedChatContact === 'Camila Duarte'
                                ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUK4VJkjeKJDgIU8l6M-XxjsXqaR3Z8vx34y_iAsvGiDtDWWRyYKZUIsFTUkA3kmHk55z5tE7bUox35Qzyw84MZ06s6oC6GsY6dPVHt7uuemm6cl-3lfNGD8Tp3hk8L0pJehdTvoW9wuE4Oa-I8OMoKHq6rh8BTMPgVzHsRD2qcX4YQOC1sSHnUkDmZ4LnfC9LnJ4RQZ_MVb2Kczd0Y-euAUsypb18RAbuw52tpAQw'
                                : selectedChatContact.includes('Mãe')
                                ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgHipZT6knfNo3pGCbvGI7WNdVtP6TzFPttci_nu5fI_khArX7IYFUb7R11Ps8KnLX_npG0IE-0AmpIT_tVG4_o9ARl7cFscN5Vp1e1g7x6ob1JgP2Bu4h4D7jp3cCl80wog_cgxS4B6a9fiueqyIoDPUpcMTHaqc2Zv28N5Kj_j6ybZGxnxlxs9I1T6cn-nP7yN3FE6j_tAWMzORKv6T_JVRTGadaLZEP1VtllP-B'
                                : 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ5sao_HHZBVDOmzYZgcqiYWKplKY9atGnH7R1Lw8JngeFP9csiB5_-wE4JYPBZ5VsGtyaGPUcM66zv6z4GeC4PKAeKtyRVFu1xfz6vjC8S0IQt7n-k4_Zp5P1IqLXuNjba_d2LYQJPHa_39KBfsCbyi64gXy6DILq9z6VmZooA2nef9cXcVOp87vvwR7Vqlr2jpn9iU9gmW6ZkGf7nDnn_rlWVHSsJJrfscuoGBcv'
                            }
                            alt={selectedChatContact}
                            className="w-9 h-9 rounded-xl object-cover shadow-[0_2px_0_0_#0ca768] border border-white"
                          />
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#006d41] rounded-full ring-2 ring-white"></span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1">
                            <h2 className="font-heading font-black text-xs text-[#161d19] truncate">
                              {selectedChatContact}
                            </h2>
                            <ShieldCheck className="w-3.5 h-3.5 text-[#006d41] shrink-0" />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0ca768] animate-pulse"></span>
                            <span className="text-[9.5px] text-[#3d4a40] truncate">Online • Bairro Tropical</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#ffddb8] text-[#855300] shadow-[0_1px_0_0_#cc8200]">
                          <Heart className="w-3 h-3 fill-[#855300]" />
                          <span className="font-heading font-bold text-[10px]">88%</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => playClickSound()}
                          className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#eef5ef] text-[#3d4a40] active:translate-y-0.5 transition-transform cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Conteúdo com rolagem do Chat */}
                    <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
                      {/* Card de Status do Match e Afinidade Tropical */}
                      {selectedChatContact === 'Camila Duarte' && (
                        <div className="bg-white p-3 rounded-xl shadow-[0_3px_0_0_#dde4de] border border-[#dde4de] flex flex-col gap-2 relative overflow-hidden">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <img
                                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUK4VJkjeKJDgIU8l6M-XxjsXqaR3Z8vx34y_iAsvGiDtDWWRyYKZUIsFTUkA3kmHk55z5tE7bUox35Qzyw84MZ06s6oC6GsY6dPVHt7uuemm6cl-3lfNGD8Tp3hk8L0pJehdTvoW9wuE4Oa-I8OMoKHq6rh8BTMPgVzHsRD2qcX4YQOC1sSHnUkDmZ4LnfC9LnJ4RQZ_MVb2Kczd0Y-euAUsypb18RAbuw52tpAQw"
                                  alt="Camila Duarte"
                                  className="w-10 h-10 rounded-xl object-cover shadow-[0_2px_0_0_#0ca768]"
                                />
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#006d41] rounded-full border-2 border-white"></span>
                              </div>
                              <div>
                                <div className="flex items-center gap-1">
                                  <span className="font-heading font-black text-xs text-[#161d19]">Camila Duarte</span>
                                  <span className="px-1 py-0.2 rounded bg-[#dbe1ff] text-[#00174b] text-[8.5px] font-extrabold flex items-center gap-0.5">
                                    <Check className="w-2.5 h-2.5" /> Gov.br
                                  </span>
                                </div>
                                <p className="text-[10px] text-[#3d4a40] flex items-center gap-0.5 mt-0.5">
                                  <MapPin className="w-3 h-3 text-[#006d41]" />
                                  <span>Pinheiros • 3 km de você</span>
                                </p>
                              </div>
                            </div>

                            {/* Medidor de Conexão */}
                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-0.5 bg-[#e8f0e9] px-2 py-0.5 rounded-lg shadow-[0_1px_0_0_#dde4de]">
                                <Zap className="w-3 h-3 text-[#006d41] fill-[#006d41]" />
                                <span className="font-heading font-black text-xs text-[#006d41]">94%</span>
                              </div>
                              <span className="text-[9px] text-[#3d4a40] mt-0.5 font-bold">Afinidade</span>
                            </div>
                          </div>

                          <div className="bg-[#eef5ef] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-[10.5px] text-[#3d4a40]">
                            <Heart className="w-3.5 h-3.5 text-[#855300] fill-[#855300] shrink-0" />
                            <p className="leading-tight">
                              Vocês deram Match ontem às 21:40! Camila amou seu freela de arte e seu gosto por samba.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Lista de Mensagens do Chat */}
                      <div className="space-y-2 pt-1">
                        {activeChatList.map((msg, i) => (
                          <div
                            key={i}
                            className={`flex flex-col max-w-[85%] rounded-2xl p-2.5 text-xs shadow-[0_2px_0_0_#dde4de] ${
                              msg.isMe
                                ? 'ml-auto bg-[#006d41] text-white rounded-br-xs'
                                : 'mr-auto bg-white text-[#161d19] border border-[#dde4de] rounded-bl-xs'
                            }`}
                          >
                            {!msg.isMe && (
                              <span className="text-[10px] font-extrabold text-[#006d41] mb-0.5">
                                {msg.sender}
                              </span>
                            )}
                            <p className="leading-snug">{msg.text}</p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <span className={`text-[9px] ${msg.isMe ? 'text-[#7bfbb3]' : 'text-[#6d7a70]'}`}>
                                {msg.time}
                              </span>
                              {msg.isMe && <CheckCheck className="w-3 h-3 text-[#7bfbb3]" />}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Painel Interativo de Dilemas / Destino do 1º Encontro */}
                      {selectedChatContact === 'Camila Duarte' && (
                        <div className="my-2 bg-white p-3 rounded-2xl shadow-[0_4px_0_0_#dde4de] border border-[#dde4de] flex flex-col gap-2.5">
                          {/* Cabeçalho do Card */}
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#0ca768] text-white flex items-center justify-center shadow-[0_2px_0_0_#005230]">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="font-heading font-black text-xs text-[#161d19]">
                                🎯 Escolha o Destino do 1º Encontro
                              </h3>
                              <p className="text-[10px] text-[#3d4a40]">
                                Sua resposta define o clima e os atributos do encontro
                              </p>
                            </div>
                          </div>

                          {/* Miniatura Ilustrada Estilo Ghibli */}
                          <div className="rounded-xl overflow-hidden relative shadow-[0_2px_0_0_#dde4de] border border-[#dde4de]">
                            <img
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBE9C1bY0iJzMslqWBsEZDAL2Cq1r68OZZ9aZ4_j4IHDbOLCKlUMzLmGUc1ie9L41s4VEQWtfVSCi3WigwrZjQUAhT3I0RYK0W9lvW5FJqcfLUbu7GTugZcNgF9YvYS81E7_GXsLCZjk00tK3Vb887d8RO5zgNHAVGgYf32K4R-N99aJhxKXl6TyiOM7af2WAjDCTZ9LYcxj3Y6l_-6dLAKC9bUyegpPLuLf6-SFP3Z"
                              alt="Miniatura Pinheiros"
                              className="w-full h-28 object-cover"
                            />
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-xs text-[#161d19] font-bold text-[10px] shadow-xs">
                              São Paulo • Dia Ensolarado 26°C
                            </div>
                          </div>

                          {dateChoiceConfirmed && (
                            <div className="p-2 bg-[#7bfbb3]/30 border border-[#0ca768] rounded-xl text-center text-xs font-black text-[#005230] animate-fade-in flex items-center justify-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-[#006d41]" />
                              <span>Encontro Confirmado: {dateChoiceConfirmed}</span>
                            </div>
                          )}

                          {/* Opção A: Bistrô Jardim Secreto */}
                          <div className="p-2.5 rounded-xl bg-[#eef5ef] border border-[#dde4de] flex flex-col gap-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-1">
                                  <span className="font-heading font-black text-xs text-[#161d19]">
                                    A. Bistrô Jardim Secreto
                                  </span>
                                  <span className="text-xs">🌿</span>
                                </div>
                                <p className="text-[10px] text-[#3d4a40]">
                                  Café colonial acolhedor e bolo de cenoura em Pinheiros
                                </p>
                              </div>
                              <span className="font-bold text-xs text-[#006d41] shrink-0">-R$ 48,00</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              <span className="px-1.5 py-0.5 rounded bg-[#7bfbb3] text-[#002110] text-[9.5px] font-extrabold shadow-xs">
                                +25 Química Romântica
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-[#e3eae4] text-[#161d19] text-[9.5px] font-bold">
                                +15 Intelecto
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleChooseDate('A')}
                              className="w-full mt-1 py-2 bg-[#0ca768] hover:bg-[#006d41] text-white font-bold text-xs rounded-xl shadow-[0_3px_0_0_#005230] active:translate-y-1 active:shadow-[0_0px_0_0_#005230] transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Confirmar no Jardim Secreto</span>
                            </button>
                          </div>

                          {/* Opção B: Feira do Pacaembu & Pastel */}
                          <div className="p-2.5 rounded-xl bg-[#eef5ef] border border-[#dde4de] flex flex-col gap-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-1">
                                  <span className="font-heading font-black text-xs text-[#161d19]">
                                    B. Domingão no Pacaembu
                                  </span>
                                  <span className="text-xs">🥟</span>
                                </div>
                                <p className="text-[10px] text-[#3d4a40]">
                                  Pastel crocante de feira, caldo de cana e risadas descontraídas
                                </p>
                              </div>
                              <span className="font-bold text-xs text-[#0051d5] shrink-0">-R$ 32,00</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              <span className="px-1.5 py-0.5 rounded bg-[#dbe1ff] text-[#00174b] text-[9.5px] font-extrabold shadow-xs">
                                +30 Conexão Espontânea
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-[#e3eae4] text-[#161d19] text-[9.5px] font-bold">
                                +20 Felicidade
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleChooseDate('B')}
                              className="w-full mt-1 py-2 bg-[#316bf3] hover:bg-[#0051d5] text-white font-bold text-xs rounded-xl shadow-[0_3px_0_0_#003ea8] active:translate-y-1 active:shadow-[0_0px_0_0_#003ea8] transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Coffee className="w-3.5 h-3.5" />
                              <span>Bora de Pastel no Pacaembu!</span>
                            </button>
                          </div>

                          {/* Opção C: Avenida Paulista & MASP */}
                          <div className="p-2.5 rounded-xl bg-[#eef5ef] border border-[#dde4de] flex flex-col gap-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-1">
                                  <span className="font-heading font-black text-xs text-[#161d19]">
                                    C. Paulista Cultural &amp; MASP
                                  </span>
                                  <span className="text-xs">🎨</span>
                                </div>
                                <p className="text-[10px] text-[#3d4a40]">
                                  Arquitetura de Lina Bo Bardi, exposições e café refinado
                                </p>
                              </div>
                              <span className="font-bold text-xs text-[#ba1a1a] shrink-0">-R$ 60,00</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              <span className="px-1.5 py-0.5 rounded bg-[#ffdad6] text-[#93000a] text-[9.5px] font-extrabold shadow-xs">
                                +20 Química
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-[#e3eae4] text-[#161d19] text-[9.5px] font-bold">
                                +25 Intelecto
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleChooseDate('C')}
                              className="w-full mt-1 py-2 bg-[#dde4de] hover:bg-[#bccabe] text-[#161d19] font-bold text-xs rounded-xl shadow-[0_3px_0_0_#bccabe] active:translate-y-1 active:shadow-[0_0px_0_0_#bccabe] transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Landmark className="w-3.5 h-3.5 text-[#161d19]" />
                              <span>Propor Tarde no MASP</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Barra Fixada de Digitação de Mensagem */}
                    <div className="bg-white/95 backdrop-blur-md px-3 py-2 border-t border-[#dde4de] flex flex-col gap-1.5 shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
                      <form
                        onSubmit={handleSendChat}
                        className="flex items-center gap-1.5"
                      >
                        {/* Botão de Coração / Reação Rápida */}
                        <button
                          type="button"
                          onClick={handleSendHeartReaction}
                          className="w-9 h-9 rounded-xl bg-white hover:bg-rose-50 text-[#006d41] flex items-center justify-center shadow-[0_2px_0_0_#dde4de] border border-[#dde4de] active:translate-y-1 transition-all shrink-0 cursor-pointer"
                          title="Enviar Coração ❤️"
                        >
                          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                        </button>

                        {/* Input de Texto Suave */}
                        <div className="flex-1 bg-[#eef5ef] rounded-xl px-3 py-1.5 flex items-center border border-[#dde4de] shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Escreva para ${selectedChatContact.split(' ')[0]}...`}
                            className="w-full bg-transparent outline-none text-xs text-[#161d19] placeholder:text-[#6d7a70]"
                          />
                        </div>

                        {/* Botão Enviar Tátil */}
                        <button
                          type="submit"
                          className="w-9 h-9 rounded-xl bg-[#0ca768] hover:bg-[#006d41] text-white flex items-center justify-center shadow-[0_3px_0_0_#005230] active:translate-y-1 active:shadow-[0_0px_0_0_#005230] transition-all shrink-0 cursor-pointer"
                          title="Enviar Mensagem"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>

                      {/* Botão de Saída para o Dia a Dia */}
                      <button
                        type="button"
                        onClick={handleBackToHome}
                        className="w-full py-1.5 rounded-xl bg-[#e3eae4] hover:bg-[#dde4de] text-[#3d4a40] font-bold text-[10px] flex items-center justify-center gap-1 shadow-[0_1px_0_0_#dde4de] active:translate-y-0.5 transition-all cursor-pointer"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-[#0051d5]" />
                        <span>Guardar Smartphone &amp; Voltar à Rotina de São Paulo</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TINDER TROPICAL BR (ESTÉTICA POLAROID, BOTOES 3D BRICK E INSTANT MATCH) */}
            {activeApp === 'tinder' && (() => {
              const TINDER_BRICK_PROFILES = REALTREE_NPCS.map((npc, idx) => ({
                id: npc.id,
                name: npc.name,
                age: npc.age,
                gender: npc.gender,
                job: npc.job,
                location: npc.location || 'São Paulo',
                verified: true,
                compatibility: 85 + (idx % 11),
                bio: npc.bio,
                tags: npc.tags || ['☕ Café', '🎶 Música', '✈️ Viagens'],
                photo: npc.photo || npc.avatar,
                avatar: npc.avatar,
                patrimonio: npc.patrimonio
              }));

              const prof = TINDER_BRICK_PROFILES[tinderProfileIdx % TINDER_BRICK_PROFILES.length];

              const handleAction = (type: 'pass' | 'super' | 'boost' | 'like') => {
                if (type === 'pass') {
                  playClickSound();
                  setTinderCardAnim('-translate-x-16 -rotate-6 opacity-30');
                  showTinderFeedback('Perfil dispensado!', false);
                  setTimeout(() => {
                    setTinderCardAnim('');
                    setTinderProfileIdx(prev => prev + 1);
                  }, 300);
                } else if (type === 'super') {
                  playSuccessSound();
                  confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
                  setTinderCardAnim('-translate-y-8 scale-105');
                  showTinderFeedback('Super Like Estelar enviado! (1★) ⭐', true);
                  if (onTinderMatch) {
                    onTinderMatch({
                      id: prof.id,
                      name: prof.name,
                      age: prof.age,
                      gender: prof.gender as 'M' | 'F',
                      type: 'ficante',
                      affection: 80,
                      intimacy: 65,
                      job: prof.job,
                      bio: prof.bio,
                      patrimonio: prof.patrimonio as any
                    });
                  }
                  setTimeout(() => {
                    setTinderCardAnim('');
                    setTinderProfileIdx(prev => prev + 1);
                  }, 350);
                } else if (type === 'boost') {
                  playCoinSound();
                  showTinderFeedback('Turbinar Perfil ativado por 30 minutos! ⚡', true);
                } else if (type === 'like') {
                  playSuccessSound();
                  confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
                  setTinderCardAnim('translate-x-16 rotate-6 opacity-30');
                  showTinderFeedback(`Você curtiu ${prof.name.split(' ')[0]}! +10 Afinidade 🔥`, true);
                  if (onTinderMatch) {
                    onTinderMatch({
                      id: prof.id,
                      name: prof.name,
                      age: prof.age,
                      gender: prof.gender as 'M' | 'F',
                      type: 'ficante',
                      affection: 75,
                      intimacy: 60,
                      job: prof.job,
                      bio: prof.bio,
                      patrimonio: prof.patrimonio as any
                    });
                  }
                  setTimeout(() => {
                    setTinderCardAnim('');
                    setTinderProfileIdx(prev => prev + 1);
                  }, 300);
                }
              };

              return (
                <div className="flex flex-col h-full overflow-y-auto p-3 gap-3 bg-[#f4fbf5] select-none text-[#161d19]">
                  {/* BARRA INTERNA TINDER TROPICAL */}
                  <section className="flex flex-col gap-2 bg-white rounded-xl p-2.5 shadow-[0_3px_0_0_#dde4de] border border-[#dde4de]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#ffdad6] text-[#ba1a1a] shadow-[0_2px_0_0_#ffdad6]">
                          <Flame className="w-5 h-5 fill-[#ba1a1a]" />
                          <span className="absolute -top-1 -right-1 text-[#0ca768] text-xs">🌿</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-heading font-black text-xs tracking-tight text-[#161d19] flex items-center gap-1">
                            Tinder Tropical
                            <span className="text-[9px] px-1 py-0.2 rounded-full bg-[#7bfbb3] text-[#002110] font-extrabold uppercase">
                              BR
                            </span>
                          </span>
                          <span className="text-[10px] text-[#3d4a40] flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-[#0051d5]" />
                            São Paulo • até 15 km
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1 bg-[#e3eae4] px-2 py-0.5 rounded-lg shadow-[0_1px_0_0_#dde4de]">
                          <Heart className="w-3 h-3 text-[#006d41] fill-[#006d41]" />
                          <span className="text-[10px] font-bold text-[#161d19]">18</span>
                        </div>
                        <div className="flex items-center gap-1 bg-[#dbe1ff] px-2 py-0.5 rounded-lg text-[#00174b] shadow-[0_1px_0_0_#b4c5ff]">
                          <Star className="w-3 h-3 text-[#0051d5] fill-[#0051d5]" />
                          <span className="text-[10px] font-black">2</span>
                        </div>
                      </div>
                    </div>

                    {/* ABAS TÁTEIS ESTILO TOY BRICK */}
                    <div className="grid grid-cols-3 gap-1 p-1 bg-[#e8f0e9] rounded-xl shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">
                      <button
                        type="button"
                        onClick={() => { playClickSound(); setTinderTab('explorar'); }}
                        className={`py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          tinderTab === 'explorar'
                            ? 'bg-white text-[#006d41] shadow-[0_2px_0_0_#dde4de]'
                            : 'text-[#3d4a40] hover:text-[#161d19]'
                        }`}
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Descoberta</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setActiveApp('whatsapp');
                          setWhatsappView('list');
                        }}
                        className="py-1.5 rounded-lg text-[#3d4a40] hover:text-[#161d19] font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>Matches</span>
                        <span className="bg-[#006d41] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                          4
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setActiveApp('whatsapp');
                          setWhatsappView('chat');
                          setSelectedChatContact('Camila Duarte');
                        }}
                        className="py-1.5 rounded-lg text-[#3d4a40] hover:text-[#161d19] font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>
                    </div>
                  </section>

                  {/* BANNER DE FEEDBACK DINÂMICO */}
                  {tinderFeedback && (
                    <div className={`flex items-center justify-between p-2 rounded-xl shadow-[0_2px_0_0_#5cde99] transition-all animate-fade-in ${
                      tinderFeedback.positive ? 'bg-[#7bfbb3] text-[#002110]' : 'bg-[#e3eae4] text-[#161d19]'
                    }`}>
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{tinderFeedback.text}</span>
                      </div>
                      <span className="text-[10px] bg-white text-[#006d41] px-2 py-0.5 rounded-md font-black">
                        +10 Afinidade
                      </span>
                    </div>
                  )}

                  {/* CARD PRINCIPAL: POLAROID COLECIONÁVEL GHIBLI / LEGO */}
                  <div
                    className={`relative flex flex-col bg-white rounded-2xl p-3 shadow-[0_4px_0_0_#dde4de] border border-[#dde4de] transition-all duration-300 ${tinderCardAnim}`}
                  >
                    {/* INDICADOR SUPERIOR DE AFINIDADE */}
                    <div className="flex items-center justify-between pb-2">
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#7bfbb3] text-[#002110] text-[10px] font-black shadow-xs">
                        <Sparkles className="w-3 h-3" />
                        <span>Compatibilidade com {playerName}: {prof.compatibility}%</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#3d4a40] text-[10px] font-bold">
                        <span className="w-2 h-2 rounded-full bg-[#0ca768] animate-pulse"></span>
                        <span>Online agora</span>
                      </div>
                    </div>

                    {/* MOLDURA DA FOTO ESTILO POLAROID/BRICK */}
                    <div className="relative w-full h-72 rounded-xl overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] bg-[#e3eae4] border border-[#dde4de]">
                      <img
                        src={prof.photo}
                        alt={prof.name}
                        className="w-full h-full object-cover select-none"
                      />

                      {/* BADGES FLUTUANTES SOBRE A FOTO */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <span className="px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-xs text-[#161d19] text-[10px] font-bold flex items-center gap-1 shadow-xs">
                          <CheckCircle2 className="w-3 h-3 text-[#006d41]" />
                          Verificada no Gov.br
                        </span>
                      </div>

                      {/* DEGRADÊ INFERIOR COM DADOS DO PERFIL */}
                      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end text-white">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-heading font-black text-lg tracking-tight text-white">{prof.name}</span>
                          <span className="font-heading font-bold text-sm text-white/90">{prof.age}</span>
                        </div>
                        <p className="font-bold text-xs text-white/95 flex items-center gap-1 mt-0.5">
                          <span>{prof.job}</span>
                        </p>
                        <p className="text-[10px] text-white/80 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#7bfbb3]" />
                          <span>{prof.location}</span>
                        </p>
                      </div>
                    </div>

                    {/* BIO BEM-HUMORADA */}
                    <div className="flex flex-col gap-1 mt-2.5 p-2.5 rounded-xl bg-[#eef5ef] border border-[#dde4de]">
                      <div className="flex items-center gap-1 text-[#855300] text-[9.5px] font-black uppercase tracking-wide">
                        <span>☀️ Sobre mim</span>
                      </div>
                      <p className="text-xs text-[#161d19] leading-snug font-medium">{prof.bio}</p>
                    </div>

                    {/* TAGS DE INTERESSE EM PÍLULAS TÁTEIS */}
                    <div className="flex flex-col gap-1 mt-2.5">
                      <span className="text-[10px] text-[#3d4a40] font-black uppercase tracking-wider">
                        Interesses em Comum
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {prof.tags.map((tag, tIdx) => (
                          <div
                            key={tIdx}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#e8f0e9] text-[#161d19] text-[10.5px] font-bold shadow-[0_1px_0_0_#dde4de]"
                          >
                            <span>{tag}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* BOTÕES TÁTEIS DE DECISÃO 3D ESTILO BRICK TOY */}
                  <div className="flex items-center justify-around px-2 pt-1">
                    {/* BOTÃO 1: DISPENSAR (X) */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleAction('pass')}
                        className="w-13 h-13 rounded-full bg-[#dde4de] hover:bg-[#bccabe] text-[#ba1a1a] flex items-center justify-center shadow-[0_4px_0_0_#bccabe] active:translate-y-1 active:shadow-[0_0px_0_0_#bccabe] transition-all cursor-pointer"
                        title="Dispensar"
                      >
                        <X className="w-6 h-6 stroke-[3]" />
                      </button>
                      <span className="text-[10px] text-[#3d4a40] font-bold">Passar</span>
                    </div>

                    {/* BOTÃO 2: SUPER LIKE (ESTRELA AZUL) */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleAction('super')}
                        className="w-11 h-11 rounded-full bg-[#0051d5] hover:bg-[#316bf3] text-white flex items-center justify-center shadow-[0_4px_0_0_#003ea8] active:translate-y-1 active:shadow-[0_0px_0_0_#003ea8] transition-all cursor-pointer"
                        title="Super Like"
                      >
                        <Star className="w-5 h-5 fill-white" />
                      </button>
                      <span className="text-[10px] text-[#0051d5] font-black">Super (1★)</span>
                    </div>

                    {/* BOTÃO 3: TURBINAR PERFIL */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleAction('boost')}
                        className="w-11 h-11 rounded-full bg-[#ffddb8] text-[#855300] hover:bg-[#ffb95f] flex items-center justify-center shadow-[0_4px_0_0_#cc8200] active:translate-y-1 active:shadow-[0_0px_0_0_#cc8200] transition-all cursor-pointer"
                        title="Turbinar"
                      >
                        <Zap className="w-5 h-5 fill-[#855300]" />
                      </button>
                      <span className="text-[10px] text-[#855300] font-bold">Turbinar</span>
                    </div>

                    {/* BOTÃO 4: MATCH / CORAÇÃO ESMERALDA 3D */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleAction('like')}
                        className="w-14 h-14 rounded-full bg-[#0ca768] hover:bg-[#006d41] text-white flex items-center justify-center shadow-[0_5px_0_0_#005230] active:translate-y-1 active:shadow-[0_1px_0_0_#005230] transition-all cursor-pointer"
                        title="Dar Match!"
                      >
                        <Heart className="w-7 h-7 fill-white" />
                      </button>
                      <span className="text-[10px] text-[#006d41] font-black">Curtir ❤️</span>
                    </div>
                  </div>

                  {/* NOTIFICAÇÃO TÁTIL DE MATCH EM TEMPO REAL */}
                  {tinderInstantMatch && (
                    <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white shadow-[0_3px_0_0_#dde4de] border border-[#dde4de]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-[#ffdad6] text-[#ba1a1a]">
                            <Flame className="w-4 h-4 fill-[#ba1a1a]" />
                          </div>
                          <span className="font-heading font-black text-xs text-[#161d19]">
                            Novo Match Instantâneo!
                          </span>
                        </div>
                        <span className="text-[9.5px] text-[#3d4a40]">Agora há pouco</span>
                      </div>
                      <p className="text-[11px] text-[#3d4a40] leading-snug">
                        {tinderInstantMatch.bio}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            playClickSound();
                            setActiveApp('whatsapp');
                            setWhatsappView('chat');
                            setSelectedChatContact('Camila Duarte');
                          }}
                          className="py-2 px-1 rounded-xl bg-[#dbe1ff] hover:bg-[#b4c5ff] text-[#00174b] font-bold text-xs flex items-center justify-center gap-1 shadow-[0_2px_0_0_#b4c5ff] active:translate-y-0.5 transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-[#00174b]" />
                          <span>Puxar Papo no Zap</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playCoinSound();
                            if (gameState.stats.grana >= 1) {
                              if (onApplyDilemmaConsequence) {
                                onApplyDilemmaConsequence({
                                  grana: -1,
                                  felicidade: 5,
                                  logTitle: 'PIX Elogio Enviado 💸',
                                  logDesc: 'Você mandou R$ 1 de PIX Elogio no Tinder Tropical e arrancou um sorriso sincero!'
                                });
                              }
                              showTinderFeedback('Mandar PIX Elogio (R$ 1) enviado com sucesso! 💖', true);
                            } else {
                              showTinderFeedback('Saldo insuficiente para PIX Elogio!', false);
                            }
                          }}
                          className="py-2 px-1 rounded-xl bg-[#7bfbb3] hover:bg-[#5cde99] text-[#002110] font-bold text-xs flex items-center justify-center gap-1 shadow-[0_2px_0_0_#5cde99] active:translate-y-0.5 transition-all cursor-pointer"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Mandar PIX (R$ 1)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* AÇÃO DE RODAPÉ: GUARDAR CELULAR */}
                  <div className="pt-1 pb-4 flex justify-center">
                    <button
                      type="button"
                      onClick={handleBackToHome}
                      className="w-full py-2.5 rounded-xl bg-[#e3eae4] hover:bg-[#dde4de] text-[#161d19] font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_2px_0_0_#dde4de] active:translate-y-0.5 transition-all cursor-pointer"
                    >
                      <Smartphone className="w-4 h-4 text-[#0051d5]" />
                      <span>Guardar Celular • Voltar ao Bairro em São Paulo</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* 6. APP: BANCO DIGITAL & PIX */}
            {activeApp === 'banco' && (
              <div className="space-y-3 pt-1 text-slate-800 text-left">
                {bankFeedback && (
                  <div className="p-2.5 bg-purple-100 border border-purple-300 text-purple-900 text-xs font-bold rounded-xl animate-fade-in">
                    {bankFeedback}
                  </div>
                )}
                <div className="p-4 bg-gradient-to-tr from-purple-900 to-indigo-700 text-white rounded-2xl shadow-md space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-purple-200">
                    Conta Corrente Digital
                  </span>
                  <div className="text-white font-black text-2xl font-heading">
                    R$ {gameState.stats.grana.toLocaleString('pt-BR')}
                  </div>
                  <p className="text-[11px] text-purple-200">
                    Saldo disponível para transferências PIX, caixinha e investimentos.
                  </p>
                </div>

                {/* Botões de Movimentação Bancária */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playCoinSound();
                      if (gameState.stats.grana >= 500) {
                        if (onApplyDilemmaConsequence) {
                          onApplyDilemmaConsequence({
                            grana: -500,
                            serasa: 15,
                            logTitle: 'Depósito na Caixinha 💰',
                            logDesc: 'Você depositou R$ 500,00 na Caixinha CDI com rendimento automático!'
                          });
                        }
                        setBankFeedback('Depósito de R$ 500,00 realizado na Caixinha com sucesso! 💰');
                      } else {
                        setBankFeedback('Saldo insuficiente para depositar R$ 500,00!');
                      }
                      setTimeout(() => setBankFeedback(null), 3000);
                    }}
                    className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold cursor-pointer transition-colors shadow-xs border border-purple-200"
                  >
                    📥 Guardar R$ 500 na Caixinha
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playCoinSound();
                      if (gameState.stats.grana >= 100) {
                        if (onApplyDilemmaConsequence) {
                          onApplyDilemmaConsequence({
                            grana: -100,
                            felicidade: 5,
                            logTitle: 'PIX Enviado 💸',
                            logDesc: 'Você realizou uma transferência PIX de R$ 100,00.'
                          });
                        }
                        setBankFeedback('PIX de R$ 100,00 enviado com sucesso! ⚡');
                      } else {
                        setBankFeedback('Saldo insuficiente para enviar PIX!');
                      }
                      setTimeout(() => setBankFeedback(null), 3000);
                    }}
                    className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold cursor-pointer transition-colors shadow-xs border border-indigo-200"
                  >
                    ⚡ Fazer PIX (R$ 100)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playCoinSound();
                      if (gameState.stats.grana >= 150) {
                        if (onApplyDilemmaConsequence) {
                          onApplyDilemmaConsequence({
                            grana: -150,
                            serasa: 20,
                            logTitle: 'Conta Paga 🧾',
                            logDesc: 'Você pagou um boleto/conta de consumo de R$ 150,00.'
                          });
                        }
                        setBankFeedback('Boleto pago com sucesso! Serasa Score +20 🧾');
                      } else {
                        setBankFeedback('Saldo insuficiente para pagar o boleto!');
                      }
                      setTimeout(() => setBankFeedback(null), 3000);
                    }}
                    className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold cursor-pointer transition-colors shadow-xs border border-emerald-200"
                  >
                    🧾 Pagar Conta (R$ 150)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playCoinSound();
                      if (gameState.stats.grana >= 1000) {
                        if (onApplyDilemmaConsequence) {
                          onApplyDilemmaConsequence({
                            grana: -1000,
                            serasa: 30,
                            logTitle: 'Investimento CDB 📈',
                            logDesc: 'Você investiu R$ 1.000,00 em CDB com 112% do CDI.'
                          });
                        }
                        setBankFeedback('Investimento em CDB de R$ 1.000 aplicado! 📈');
                      } else {
                        setBankFeedback('Saldo insuficiente para investir em CDB (mín. R$ 1.000)!');
                      }
                      setTimeout(() => setBankFeedback(null), 3000);
                    }}
                    className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold cursor-pointer transition-colors shadow-xs border border-blue-200"
                  >
                    📈 Investir em CDB (112%)
                  </button>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2 text-left">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Serasa Score:</span>
                    <span className="font-extrabold text-emerald-600">{gameState.serasa.score} pts</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Investimento CDI:</span>
                    <span className="font-extrabold text-indigo-600">R$ {gameState.finances?.cdiBalance?.toLocaleString('pt-BR') || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Cartão de Crédito:</span>
                    <span className="font-extrabold text-slate-800">{gameState.finances?.creditCard?.tier || 'Básico'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 7. APP: REDES SOCIAIS & INSTA */}
            {activeApp === 'redes' && (
              <div className="space-y-3 pt-1 text-slate-800 text-left">
                {instaFeedback && (
                  <div className="p-2.5 bg-pink-100 border border-pink-300 text-pink-900 text-xs font-bold rounded-xl animate-fade-in">
                    {instaFeedback}
                  </div>
                )}

                {/* Sub-navegação do InstaVida */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => { playClickSound(); setInstaTab('feed'); }}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      instaTab === 'feed'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Meu Feed &amp; Publis</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { playClickSound(); setInstaTab('discover'); }}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      instaTab === 'discover'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Pessoas p/ Seguir (15)</span>
                  </button>
                </div>

                {instaTab === 'feed' ? (
                  <div className="p-3 bg-white rounded-2xl shadow-xs border border-slate-200 text-center space-y-2">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 p-0.5 mx-auto">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xl">
                        📸
                      </div>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">
                      @{gameState.character.name.toLowerCase().replace(/\s+/g, '_')}
                    </h4>
                    <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-700">
                      <div>
                        <span className="block text-slate-900 text-sm font-extrabold">{gameState.influencer?.followers || 1420}</span>
                        <span className="text-[10px] text-slate-400 uppercase">Seguidores</span>
                      </div>
                      <div>
                        <span className="block text-slate-900 text-sm font-extrabold">{gameState.influencer?.postsCount || 5}</span>
                        <span className="text-[10px] text-slate-400 uppercase">Posts</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          playSuccessSound();
                          if (onSocialPost) {
                            const res = onSocialPost('photo');
                            setInstaFeedback(res.message);
                          } else {
                            setInstaFeedback('Foto postada no feed com sucesso! +120 seguidores 📸');
                          }
                          setTimeout(() => setInstaFeedback(null), 3500);
                        }}
                        className="p-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold cursor-pointer transition-colors shadow-xs border border-pink-200"
                      >
                        📸 Postar Foto
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          playSuccessSound();
                          if (onSocialPost) {
                            const res = onSocialPost('reel');
                            setInstaFeedback(res.message);
                          } else {
                            setInstaFeedback('Reels viralizou! +450 seguidores 🚀');
                          }
                          setTimeout(() => setInstaFeedback(null), 3500);
                        }}
                        className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold cursor-pointer transition-colors shadow-xs border border-purple-200"
                      >
                        🚀 Gravar Reels
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          playCoinSound();
                          if (onApplyDilemmaConsequence) {
                            onApplyDilemmaConsequence({
                              grana: 1200,
                              felicidade: 15,
                              logTitle: 'Publi no InstaVida 📢',
                              logDesc: 'Você fechou parceria comercial e faturou R$ 1.200,00!'
                            });
                          }
                          setInstaFeedback('Publi fechada! Faturou R$ 1.200,00 📢💸');
                          setTimeout(() => setInstaFeedback(null), 3500);
                        }}
                        className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold cursor-pointer transition-colors shadow-xs border border-amber-200"
                      >
                        📢 Fechar Publi (R$ 1.200)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          playSuccessSound();
                          if (onApplyDilemmaConsequence) {
                            onApplyDilemmaConsequence({
                              felicidade: 25,
                              logTitle: 'Live ao Vivo Realizada 🔴',
                              logDesc: 'Você fez uma live interagindo com os fãs no InstaVida!'
                            });
                          }
                          setInstaFeedback('Live realizada com sucesso! +1.200 seguidores 🔴✨');
                          setTimeout(() => setInstaFeedback(null), 3500);
                        }}
                        className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold cursor-pointer transition-colors shadow-xs border border-rose-200"
                      >
                        🔴 Fazer Live ao Vivo
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ABA DESCOBRIR / PESSOAS PARA SEGUIR (15 PROFILES) */
                  <div className="space-y-2">
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 font-medium">
                      💡 <strong>Sugestões de Amizade &amp; Contatos:</strong> Siga novos perfis para adicioná-los diretamente aos seus conhecidos e poder sair para um café!
                    </div>

                    <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                      {REALTREE_NPCS.map((npc) => {
                        const isAlreadyContact = (gameState.family?.friends || []).some(
                          (f) => f.name === npc.name || f.id === npc.id
                        );

                        return (
                          <div
                            key={npc.id}
                            className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 text-left"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={npc.avatar || npc.photo}
                                alt={npc.name}
                                className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <h4 className="font-bold text-xs text-slate-900 truncate">
                                    {npc.name}
                                  </h4>
                                  <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 font-bold shrink-0">
                                    {npc.age}a
                                  </span>
                                </div>
                                <p className="text-[10.5px] text-slate-500 truncate">
                                  {npc.job}
                                </p>
                                <p className="text-[9.5px] text-slate-400 line-clamp-1 italic">
                                  "{npc.bio.slice(0, 45)}..."
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              disabled={isAlreadyContact}
                              onClick={() => {
                                playSuccessSound();
                                confetti({ particleCount: 30, spread: 50 });
                                if (onTinderMatch) {
                                  onTinderMatch({
                                    id: npc.id,
                                    name: npc.name,
                                    gender: npc.gender as 'M' | 'F',
                                    age: npc.age,
                                    type: 'conhecido',
                                    affection: 45,
                                    intimacy: 30,
                                    job: npc.job,
                                    bio: npc.bio,
                                    patrimonio: npc.patrimonio as any
                                  });
                                }
                                setInstaFeedback(`Seguiu ${npc.name}! Adicionado(a) aos seus contatos 👤✨`);
                                setTimeout(() => setInstaFeedback(null), 3500);
                              }}
                              className={`shrink-0 px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer shadow-xs ${
                                isAlreadyContact
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/20'
                              }`}
                            >
                              {isAlreadyContact ? 'Seguindo ✔️' : '+ Seguir'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 9. APP: CONFIGURAÇÕES / AJUSTES DO CELULAR */}
            {activeApp === 'config' && (
              <div className="space-y-3 pt-1 text-slate-800 text-left">
                <div className="p-3.5 bg-white rounded-2xl shadow-xs border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold">
                      ⚙️
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 font-heading">Ajustes do Aparelho</h4>
                      <p className="text-[10px] text-slate-500">Conectividade, Tema, Brilho &amp; Modo Escuro</p>
                    </div>
                  </div>

                  {/* 1. Modo Avião */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">✈️ Modo Avião</span>
                      <span className="text-[10px] text-slate-500">Bloqueia notificações e novas mensagens</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setIsAirplaneMode(!isAirplaneMode);
                      }}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                        isAirplaneMode ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isAirplaneMode ? 'Ativado' : 'Desativado'}
                    </button>
                  </div>

                  {/* 2. Mudar Tema do Celular */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <span className="font-bold text-slate-900 block">🎨 Tema do Celular</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'tropical', name: 'Tropical 🌴' },
                        { id: 'emerald', name: 'Esmeralda 💚' },
                        { id: 'blue', name: 'Azul Céu 🌊' },
                        { id: 'rose', name: 'Rosa Ghibli 🌸' },
                        { id: 'dark', name: 'Noturno 🌙' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            playClickSound();
                            setPhoneTheme(t.id as any);
                          }}
                          className={`p-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            phoneTheme === t.id
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Brilho da Tela */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">☀️ Brilho da Tela</span>
                      <span className="font-bold text-emerald-700">{brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  {/* 4. Modo Sombrio (Dark Mode Global) */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>🌓 Modo Sombrio</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isDarkMode ? 'bg-indigo-900 text-indigo-200 border border-indigo-700' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                            {isDarkMode ? '🌙 Escuro' : '☀️ Claro'}
                          </span>
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Escurece tons pastéis e ajusta o contraste de toda a interface do jogo
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound();
                          toggleDarkMode();
                        }}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer shadow-xs ${
                          isDarkMode
                            ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                            : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                        }`}
                      >
                        {isDarkMode ? 'Modo Escuro 🌙' : 'Modo Claro ☀️'}
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-500 bg-white/70 p-1.5 rounded-lg border border-slate-200">
                      💡 <strong>Dica Noturna:</strong> Altera o jogo inteiro para tons noturnos suaves, ideal para jogar no escuro.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 8. APP: CALCULADORA CLT & DIREITOS */}
            {activeApp === 'clt' && (
              <div className="space-y-3 pt-1 text-slate-800 text-left">
                <div className="p-3.5 bg-white rounded-2xl shadow-xs border border-slate-200 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      📘
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">CTPS &amp; Direitos Trabalhistas</h4>
                      <p className="text-[10px] text-slate-500">{gameState.career.title}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-600">FGTS Acumulado:</span>
                      <span className="font-bold text-blue-700">R$ {gameState.career.fgtsAccumulated.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-600">Salário Registrado:</span>
                      <span className="font-bold text-slate-900">R$ {gameState.career.salaryMonthly.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-600">Carteira Assinada:</span>
                      <span className="font-bold text-emerald-600">{gameState.career.hasCarteiraAssinada ? 'Sim (CLT)' : 'Não'}</span>
                    </div>

                    {/* Férias Remuneradas */}
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-slate-900 space-y-1">
                      <div className="flex items-center justify-between font-bold text-emerald-800">
                        <span>🏖️ Férias Remuneradas (30 Dias)</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900">
                          {((gameState.career.monthsSinceVacation ?? 0) >= 12 || gameState.career.yearsInJob >= 1) ? 'Disponível ✨' : `${gameState.career.monthsSinceVacation ?? 0}/12 meses`}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-600 leading-snug">
                        Direito constitucional a 30 dias de descanso com bônus de 1/3 do salário (R$ {Math.round((gameState.career.salaryMonthly || 0) / 3).toLocaleString('pt-BR')}) e recuperação de 100% da Energia e Saúde Mental.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* iOS Bottom Home Indicator Bar */}
          <div className="pb-2 pt-1 flex justify-center z-30">
            <button
              type="button"
              onClick={handleBackToHome}
              className="w-32 h-1 bg-white/40 hover:bg-white rounded-full transition-colors cursor-pointer"
              title="Voltar ao início do smartphone"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
