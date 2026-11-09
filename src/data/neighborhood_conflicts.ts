export interface ConflictOption {
  id: string;
  label: string;
  icon: string;
  cost: number;
  happinessDelta: number;
  socialScoreDelta: number;
  outcomeNarrative: string;
}

export interface NeighborhoodConflict {
  id: string;
  title: string;
  icon: string;
  neighborName: string;
  description: string;
  options: ConflictOption[];
}

export const NEIGHBORHOOD_CONFLICTS: NeighborhoodConflict[] = [
  {
    id: 'som_alto_madrugada',
    title: 'Som Alto & Sertanejo de Madrugada',
    icon: '🔊',
    neighborName: 'Seu Osmar (Apto 42 / Vizinho de Muro)',
    description: 'Às 2h30 da manhã de domingo, o Seu Osmar ligou a caixa amplificada no volume máximo tocando modão de viola e funk.',
    options: [
      {
        id: 'conversar_na_boa',
        label: 'Conversar com Educação na Porta',
        icon: '🤝',
        cost: 0,
        happinessDelta: 8,
        socialScoreDelta: 15,
        outcomeNarrative: 'Seu Osmar pediu desculpas, abaixou o som e ainda te ofereceu um refrigerante gelado! Bom senso prevaleceu.'
      },
      {
        id: 'chamar_policia_190',
        label: 'Chamar a Polícia / PSIU (190)',
        icon: '🚓',
        cost: 0,
        happinessDelta: 12,
        socialScoreDelta: -8,
        outcomeNarrative: 'A viatura passou na rua e mandou desligar o som na hora. Silêncio restaurado, mas o vizinho ficou de cara feia.'
      },
      {
        id: 'juntar_festa',
        label: 'Juntar-se ao Rolê do Vizinho',
        icon: '🍻',
        cost: 30,
        happinessDelta: 25,
        socialScoreDelta: 20,
        outcomeNarrative: 'Você subiu lá com R$ 30 em petiscos e curtiu a madrugada inteira! Ganhou a amizade do Seu Osmar.'
      },
      {
        id: 'bater_boca',
        label: 'Gritar da Janela e Bater Boca',
        icon: '🤬',
        cost: 0,
        happinessDelta: -12,
        socialScoreDelta: -15,
        outcomeNarrative: 'Discussão calorosa no portão! Estresse alto e clima tenso no corredor pelas próximas semanas.'
      }
    ]
  },
  {
    id: 'garagem_trancada',
    title: 'Vaga de Garagem Trancada',
    icon: '🚘',
    neighborName: 'Cleiton (Vizinho da Garagem ao Lado)',
    description: 'O Cleiton estacionou o SUV na diagonal, invadiu metade da sua vaga de garagem e foi fazer churrasco.',
    options: [
      {
        id: 'mensagem_whats',
        label: 'Mandar Mensagem no Whats do Prédio',
        icon: '💬',
        cost: 0,
        happinessDelta: 10,
        socialScoreDelta: 12,
        outcomeNarrative: 'Cleiton respondeu na hora, pediu desculpas no grupo e manobrou o carro certinho.'
      },
      {
        id: 'bilhete_parabrisa',
        label: 'Deixar Bilhete Educado no Limpador',
        icon: '📝',
        cost: 0,
        happinessDelta: 5,
        socialScoreDelta: 8,
        outcomeNarrative: 'Você deixou o aviso diplomático no parabrisa. Ele leu e nunca mais repetiu a manobra errada.'
      },
      {
        id: 'chamar_guincho',
        label: 'Chamar o Síndico & Fiscalização',
        icon: '📢',
        cost: 0,
        happinessDelta: 15,
        socialScoreDelta: -10,
        outcomeNarrative: 'O síndico aplicou uma advertência formal no condomínio. A vaga foi liberada com clima meio pesado.'
      }
    ]
  },
  {
    id: 'fofoca_whatsapp',
    title: 'Fofocas & Boatos no Grupo do Prédio',
    icon: '🗣️',
    neighborName: 'Dona Neide (Síndica Consultiva)',
    description: 'Dona Neide espalhou boato no grupo do WhatsApp insinuando que você faz reuniões barulhentas durante a semana.',
    options: [
      {
        id: 'bolo_fofoca',
        label: 'Levar Bolo de Cenoura na Casa da Neide',
        icon: '🍰',
        cost: 25,
        happinessDelta: 18,
        socialScoreDelta: 30,
        outcomeNarrative: 'Dona Neide adorou o bolo! Desmentiu tudo no grupo, te elogiou e agora te defende para todos no bairro.'
      },
      {
        id: 'desmentir_memes',
        label: 'Desmentir no Grupo com Bom Humor',
        icon: '😂',
        cost: 0,
        happinessDelta: 12,
        socialScoreDelta: 15,
        outcomeNarrative: 'Sua resposta com meme e clareza fez todo mundo rir e os vizinhos ficaram do seu lado!'
      },
      {
        id: 'sair_grupo',
        label: 'Ignorar e Silenciar o Grupo',
        icon: '🔕',
        cost: 0,
        happinessDelta: 10,
        socialScoreDelta: 0,
        outcomeNarrative: 'Grupo silenciado com sucesso! Menos fofoca, zero estresse na sua rotina.'
      }
    ]
  },
  {
    id: 'cao_latindo',
    title: 'Cachorro Latindo na Madrugada',
    icon: '🐕',
    neighborName: 'Dra. Rebeca (Vizinha do 2º Andar)',
    description: 'O cachorrinho da Dra. Rebeca fica agitado na sacada e late sem parar nas noites de chuva.',
    options: [
      {
        id: 'dar_ossinho',
        label: 'Comprar Brinquedo / Ossinho pro Pet',
        icon: '🎁',
        cost: 20,
        happinessDelta: 15,
        socialScoreDelta: 20,
        outcomeNarrative: 'A vizinha ficou emocionada com a gentileza! O brinquedo distraiu o pet e a noite foi tranquila.'
      },
      {
        id: 'conversar_adestramento',
        label: 'Propor Dicas Amigáveis de Adestramento',
        icon: '🤝',
        cost: 0,
        happinessDelta: 10,
        socialScoreDelta: 12,
        outcomeNarrative: 'Conversa madura e respeitosa. Rebeca colocou o pet para dormir dentro de casa.'
      }
    ]
  },
  {
    id: 'goteira_teto',
    title: 'Infiltração no Teto do Banheiro',
    icon: '💧',
    neighborName: 'Marcio (Vizinho do Andar de Cima)',
    description: 'Apareceu uma mancha de infiltração no teto do seu banheiro por conta do rejunte do apartamento do Marcio.',
    options: [
      {
        id: 'resolver_amigavel',
        label: 'Chamar Marcio para Olhar e Combinar Reparador',
        icon: '🤝',
        cost: 0,
        happinessDelta: 12,
        socialScoreDelta: 15,
        outcomeNarrative: 'Marcio foi supersincero, chamou o encanador dele na mesma semana e refez a pintura do seu teto!'
      },
      {
        id: 'dividir_encanador',
        label: 'Contratar Encanador Rápido em Parceria',
        icon: '🛠️',
        cost: 80,
        happinessDelta: 20,
        socialScoreDelta: 25,
        outcomeNarrative: 'Encanamento consertado no mesmo dia com parceria dividida! Teto seco e vizinho grato pela agilidade.'
      }
    ]
  }
];
