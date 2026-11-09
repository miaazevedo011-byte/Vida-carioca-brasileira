export interface Activity {
  id: string;
  name: string;
  category: 'lazer' | 'saude' | 'social' | 'educacao' | 'banco';
  icon: string;
  cost: number;
  description: string;
  effects: {
    saude?: number;
    felicidade?: number;
    energia?: number;
    intelecto?: number;
    serasa?: number;
    grana?: number;
    saudeMental?: number;
  };
}

export const ACTIVITIES: Activity[] = [
  {
    id: 'churrasco_domingo',
    name: 'Churrasco de Domingo com Pagode',
    category: 'lazer',
    icon: '🥩',
    cost: 85,
    description: 'Picanha fatiada, vinagrete da mãe, pão de alho crocante e roda de pagode na laje.',
    effects: { felicidade: 15, energia: -5, saude: -2 }
  },
  {
    id: 'praia_coco',
    name: 'Dia de Praia com Água de Coco & Biscoito Globo',
    category: 'lazer',
    icon: '🏖️',
    cost: 50,
    description: 'Mergulho no mar, brisa litorânea, mate bem gelado e sol para renovar o bronze.',
    effects: { felicidade: 18, saude: 8, energia: 10 }
  },
  {
    id: 'rodizio_pizza',
    name: 'Rodízio de Pizza com Amigos do Bairro',
    category: 'lazer',
    icon: '🍕',
    cost: 75,
    description: 'Pizza de calabresa, quatro queijos, frango com catupiry e rodízio doce de brigadeiro.',
    effects: { felicidade: 16, saude: -3, energia: 5 }
  },
  {
    id: 'festival_musica',
    name: 'Festival de Música / Lollapalooza',
    category: 'lazer',
    icon: '🎸',
    cost: 450,
    description: 'Shows das bandas favoritas ao vivo, luzes de LED, food trucks e energia lá no alto.',
    effects: { felicidade: 35, energia: -25, saude: -5 }
  },
  {
    id: 'cinema_pipoca',
    name: 'Sessão de Cinema 3D com Pipoca Grande',
    category: 'lazer',
    icon: '🍿',
    cost: 60,
    description: 'Filme lançamento na tela gigante com pipoca na manteiga e refrigerante gelado.',
    effects: { felicidade: 12, energia: 5 }
  },
  {
    id: 'viagem_ilhabela',
    name: 'Viagem de Fim de Semana para Ilhabela',
    category: 'lazer',
    icon: '🚗',
    cost: 380,
    description: 'Estrada com os amigos, pousada charmosa no litoral, cachoeiras e pôr do sol inesquecível.',
    effects: { felicidade: 30, saude: 12, energia: 15 }
  },
  {
    id: 'videogame_ps5',
    name: 'Noite de Videogame & Campeonato de Futebol',
    category: 'social',
    icon: '🎮',
    cost: 30,
    description: 'Partida disputada no PS5 com salgadinho e refrigerante, zombando do amigo que perdeu.',
    effects: { felicidade: 14, energia: 5 }
  },
  {
    id: 'academia_raiz',
    name: 'Treino Intenso na Academia',
    category: 'saude',
    icon: '🏋️',
    cost: 90,
    description: 'Sessão de musculação e esteira para fortalecer o coração e liberar endorfina pura.',
    effects: { saude: 14, energia: 8, felicidade: 6 }
  },
  {
    id: 'feira_pastel',
    name: 'Feira Livre: Pastel de Queijo + Caldo de Cana',
    category: 'lazer',
    icon: '🥟',
    cost: 25,
    description: 'O ritual sagrado das manhãs brasileiras. Pastel frito na hora com cana moída bem gelada.',
    effects: { felicidade: 12, saude: -2 }
  },
  {
    id: 'futebol_quarta',
    name: 'Futebol Society com a Galera de Quarta',
    category: 'social',
    icon: '⚽',
    cost: 35,
    description: 'Pelada com os amigos da firma ou do bairro, resenha e aquela rivalidade saudável.',
    effects: { felicidade: 12, saude: 10, energia: -12 }
  },
  {
    id: 'meditacao_mindfulness',
    name: 'Meditação Mindfulness & Respiração Guiada',
    category: 'saude',
    icon: '🧘',
    cost: 0,
    description: 'Pausa para respirar fundo, acalmar a mente, diminuir a ansiedade e restaurar a paz interior.',
    effects: { saudeMental: 20, felicidade: 12, energia: 8 }
  },
  {
    id: 'terapia_online',
    name: 'Sessão de Terapia com Psicólogo',
    category: 'saude',
    icon: '🧠',
    cost: 140,
    description: 'Cuidar da saúde mental, tratar traumas do passado, aliviar estresse e organizar os pensamentos.',
    effects: { saudeMental: 35, felicidade: 22, saude: 8, intelecto: 6 }
  },
  {
    id: 'retiro_espiritual',
    name: 'Retiro de Bem-Estar & Silêncio',
    category: 'saude',
    icon: '🌿',
    cost: 280,
    description: 'Imersão na natureza com ioga, banho de floresta e desconexão digital total para reestruturar o equilíbrio emocional.',
    effects: { saudeMental: 45, felicidade: 30, saude: 15, energia: 20 }
  },
  {
    id: 'curso_online',
    name: 'Curso Rápido de Especialização Online',
    category: 'educacao',
    icon: '💻',
    cost: 150,
    description: 'Videoaulas e exercícios práticos em áreas valorizadas no mercado de trabalho.',
    effects: { intelecto: 14, energia: -8, felicidade: 4 }
  },
  {
    id: 'passear_caramelo',
    name: 'Passeio no Parque com o Caramelo',
    category: 'social',
    icon: '🐕',
    cost: 0,
    description: 'Caminhada gostosa com seu fiel vira-lata pela praça do bairro com ar puro.',
    effects: { felicidade: 14, saude: 6, energia: 4, saudeMental: 15 }
  }
];
