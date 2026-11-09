export interface NPCProfile {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'NB';
  job: string;
  location: string;
  verified: boolean;
  compatibility: number;
  bio: string;
  tags: string[];
  photo: string;
  avatar: string;
  patrimonio: 'Baixa (Periferia)' | 'Média-Baixa' | 'Média-Alta' | 'Rica (Elite)';
  type?: 'amigo' | 'melhor_amigo' | 'amante' | 'ficante' | 'ex' | 'conhecido';
}

export const REALTREE_NPCS: NPCProfile[] = [
  {
    id: 'camila_duarte',
    name: 'Camila Duarte',
    age: 26,
    gender: 'F',
    job: 'Arquiteta & Urbanista ☕',
    location: 'Pinheiros, SP • a 3 km de você',
    verified: true,
    compatibility: 94,
    bio: '“Fascinada por cafés artesanais em Pinheiros, feirinha de vinil no Pacaembu e maquetes de arquitetura. Vamos tomar um café?”',
    tags: ['☕ Cafés Especiais', '🏛️ Arquitetura', '🌱 Plantas', '📸 Fotografia', '🍷 Vinhos'],
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUK4VJkjeKJDgIU8l6M-XxjsXqaR3Z8vx34y_iAsvGiDtDWWRyYKZUIsFTUkA3kmHk55z5tE7bUox35Qzyw84MZ06s6oC6GsY6dPVHt7uuemm6cl-3lfNGD8Tp3hk8L0pJehdTvoW9wuE4Oa-I8OMoKHq6rh8BTMPgVzHsRD2qcX4YQOC1sSHnUkDmZ4LnfC9LnJ4RQZ_MVb2Kczd0Y-euAUsypb18RAbuw52tpAQw',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUK4VJkjeKJDgIU8l6M-XxjsXqaR3Z8vx34y_iAsvGiDtDWWRyYKZUIsFTUkA3kmHk55z5tE7bUox35Qzyw84MZ06s6oC6GsY6dPVHt7uuemm6cl-3lfNGD8Tp3hk8L0pJehdTvoW9wuE4Oa-I8OMoKHq6rh8BTMPgVzHsRD2qcX4YQOC1sSHnUkDmZ4LnfC9LnJ4RQZ_MVb2Kczd0Y-euAUsypb18RAbuw52tpAQw',
    patrimonio: 'Média-Alta'
  },
  {
    id: 'gabriel_santos',
    name: 'Gabriel Santos',
    age: 28,
    gender: 'M',
    job: 'Engenheiro de Software & Tech Lead 💻',
    location: 'Vila Madalena, SP • a 4 km de você',
    verified: true,
    compatibility: 89,
    bio: '“Desenvolvedor nas horas vagas e maratonista de séries no fim de semana. Procuro alguém bacana para dividir sushi e conversar de tudo.”',
    tags: ['💻 Tech', '🍣 Sushi', '🎮 Games', '🚴‍♂️ Ciclismo', '🎧 Podcasts'],
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVlsZ5cGN_yo8DVSXVT4RYwsO9gGpW0loUScVn-NFSCsijP1QmEo2o-Sbe4DQi6i_SrCHD7AqnN4-8Xe9_reyJralFPPGje_peiHsnSeRG25DFY-gBtpeYuQ59EapDPbn2-0FqoWmWEmxewYfbG_lfTi_9tCcePzLRW2nBvV8reInxeB4_e2qW7p-SHN86Vb92PrGfNkYrBnROtMmk4jz88Uf8tAyLlgBtchq6J-js',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVlsZ5cGN_yo8DVSXVT4RYwsO9gGpW0loUScVn-NFSCsijP1QmEo2o-Sbe4DQi6i_SrCHD7AqnN4-8Xe9_reyJralFPPGje_peiHsnSeRG25DFY-gBtpeYuQ59EapDPbn2-0FqoWmWEmxewYfbG_lfTi_9tCcePzLRW2nBvV8reInxeB4_e2qW7p-SHN86Vb92PrGfNkYrBnROtMmk4jz88Uf8tAyLlgBtchq6J-js',
    patrimonio: 'Rica (Elite)'
  },
  {
    id: 'juliana_bixiga',
    name: 'Juliana Paiva (Bixiga)',
    age: 26,
    gender: 'F',
    job: 'Designer & Murais Urbanos 🎨',
    location: 'Bixiga, SP • a 2 km de você',
    verified: true,
    compatibility: 91,
    bio: '“Amante de cantinas italianas do Bixiga, feiras de vinil e fotos analógicas. Se você curte trocar ideias sobre arte, vida e boas risadas, vem de match!”',
    tags: ['🎨 Arte Urbana', '🍝 Cantinas', '📸 Fotografia', '🌿 Plantas', '☕ Café'],
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkENpP07FRV77CR9X3S6eq61h5lDuNqBzNCXexsFnm0da9-2SCvGQceRch4hD2Zqy9g2brNVqAox2ktsyXUEIfkdqK9r_0n8ZTXXvak8WOiqQPvQM442hWEvSd_QNVqKDycCF4_oix5ODAny8Ixdkb8y7gECWq8W_GQZ_ejqGDp4JZO88DDot0ibCKZd6EkHKmLzkm52Q7I_Q61NTdHYJH3LJB2datFza3jgScx_Pm',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkENpP07FRV77CR9X3S6eq61h5lDuNqBzNCXexsFnm0da9-2SCvGQceRch4hD2Zqy9g2brNVqAox2ktsyXUEIfkdqK9r_0n8ZTXXvak8WOiqQPvQM442hWEvSd_QNVqKDycCF4_oix5ODAny8Ixdkb8y7gECWq8W_GQZ_ejqGDp4JZO88DDot0ibCKZd6EkHKmLzkm52Q7I_Q61NTdHYJH3LJB2datFza3jgScx_Pm',
    patrimonio: 'Rica (Elite)'
  },
  {
    id: 'beatriz_martins',
    name: 'Beatriz Martins',
    age: 31,
    gender: 'F',
    job: 'Advogada & Sommelier Amadora 🍷',
    location: 'Jardins, SP • a 4 km de você',
    verified: true,
    compatibility: 89,
    bio: '“Vinhos da Serra Gaúcha, livros na praça, MPB em vinil e debates enriquecedores. Gosto de pessoas com boa conversa e que apreciem um bom jantar.”',
    tags: ['🍷 Vinhos', '📚 Leitura', '🎷 Jazz & MPB', '⚖️ Direito', '✈️ Viagens'],
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ5sao_HHZBVDOmzYZgcqiYWKplKY9atGnH7R1Lw8JngeFP9csiB5_-wE4JYPBZ5VsGtyaGPUcM66zv6z4GeC4PKAeKtyRVFu1xfz6vjC8S0IQt7n-k4_Zp5P1IqLXuNjba_d2LYQJPHa_39KBfsCbyi64gXy6DILq9z6VmZooA2nef9cXcVOp87vvwR7Vqlr2jpn9iU9gmW6ZkGf7nDnn_rlWVHSsJJrfscuoGBcv',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ5sao_HHZBVDOmzYZgcqiYWKplKY9atGnH7R1Lw8JngeFP9csiB5_-wE4JYPBZ5VsGtyaGPUcM66zv6z4GeC4PKAeKtyRVFu1xfz6vjC8S0IQt7n-k4_Zp5P1IqLXuNjba_d2LYQJPHa_39KBfsCbyi64gXy6DILq9z6VmZooA2nef9cXcVOp87vvwR7Vqlr2jpn9iU9gmW6ZkGf7nDnn_rlWVHSsJJrfscuoGBcv',
    patrimonio: 'Rica (Elite)'
  },
  {
    id: 'lucas_mendes',
    name: 'Dr. Lucas Mendes',
    age: 29,
    gender: 'M',
    job: 'Médico Residente em Cardiologia 🩺',
    location: 'Moema, SP • a 5 km de você',
    verified: true,
    compatibility: 92,
    bio: '“Plantonista com coração grande. Adoro caminhar no Parque do Ibirapuera no nascer do sol e tomar açaí reforçado.”',
    tags: ['🩺 Medicina', '🏃‍♂️ Corrida', '🥑 Saúde', '🐶 Cães', '☕ Café'],
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    patrimonio: 'Média-Alta'
  },
  {
    id: 'amanda_souza',
    name: 'Amanda Souza',
    age: 24,
    gender: 'F',
    job: 'Fisioterapeuta & Instrutora de Pilates 🧘‍♀️',
    location: 'Itaim Bibi, SP • a 3 km de você',
    verified: true,
    compatibility: 88,
    bio: '“Praia nos feriados, postura alinhada e sucos naturais. Procuro boas energias, sorrisos leves e conversas profundas.”',
    tags: ['🧘‍♀️ Pilates', '🏖️ Praia', '🥗 Vida Fit', '🎶 Pop', '✈️ Natureza'],
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    patrimonio: 'Média-Alta'
  },
  {
    id: 'diego_oliveira',
    name: 'Diego Oliveira',
    age: 33,
    gender: 'M',
    job: 'Chef Executivo & Gastronomia Parrilla 🥩',
    location: 'Santana, SP • a 6 km de você',
    verified: true,
    compatibility: 86,
    bio: '“Cozinho com alma e coração. Risotos de cogumelos e cortes nobres na brasa. Quem aceita um jantar especial com vinho?”',
    tags: ['🥩 Parrilla', '🍷 Gastronomia', '🍺 Cerveja Artesanal', '🎸 Rock', '🚗 Carros'],
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    patrimonio: 'Média-Alta'
  },
  {
    id: 'vanessa_ribeiro',
    name: 'Vanessa Ribeiro',
    age: 25,
    gender: 'F',
    job: 'Jornalista & Apresentadora de Podcast 🎙️',
    location: 'Perdizes, SP • a 2 km de você',
    verified: true,
    compatibility: 93,
    bio: '“Investigando boas histórias pela capital paulista. Fã inconformada de cinema cult, cafeterias com wifi rápido e bate-papo sem fim.”',
    tags: ['🎙️ Podcast', '🎬 Cinema', '☕ Café', '📰 Notícias', '🎭 Teatro'],
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    patrimonio: 'Média-Baixa'
  },
  {
    id: 'thiago_barbosa',
    name: 'Thiago Barbosa',
    age: 30,
    gender: 'M',
    job: 'Analista de Mercado Financeiro & Gestor 📈',
    location: 'Faria Lima, SP • a 4 km de você',
    verified: true,
    compatibility: 85,
    bio: '“Faria Limer consciente! Jogo tênis nos fins de semana, estudo cripto e invisto em viagens inesquecíveis pelo Nordeste.”',
    tags: ['📈 Mercado', '🎾 Tênis', '✈️ Nordeste', '☕ Expresso', '👔 Business'],
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    patrimonio: 'Rica (Elite)'
  },
  {
    id: 'larissa_alves',
    name: 'Larissa Alves',
    age: 23,
    gender: 'F',
    job: 'Estudante de Psicologia & Voluntária 🧠',
    location: 'Butantã, SP • a 5 km de você',
    verified: true,
    compatibility: 90,
    bio: '“Leitora voraz de psicanálise, apaixonada por gatos e acolhimento humano. Vamos trocar ideias sob a sombra das árvores da USP!”',
    tags: ['🧠 Psicologia', '🐱 Gatos', '📚 Filosofia', '🌱 Voluntariado', '🍵 Chá'],
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    patrimonio: 'Baixa (Periferia)'
  },
  {
    id: 'rodrigo_rocha',
    name: 'Rodrigo Rocha',
    age: 34,
    gender: 'M',
    job: 'Fotógrafo Documentarista de Expedições 📷',
    location: 'Serra da Cantareira, SP • a 10 km de você',
    verified: true,
    compatibility: 87,
    bio: '“Capturando paisagens selvagens pelo mundo. Adoro acampamentos, fogueira nas montanhas e café de coador fresco.”',
    tags: ['📷 Fotografia', '⛺ Acampamento', '🌲 Natureza', '🚵‍♂️ MTB', '🐕 Cães'],
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    patrimonio: 'Média-Alta'
  },
  {
    id: 'fernanda_lima',
    name: 'Fernanda Lima',
    age: 28,
    gender: 'F',
    job: 'Diretora de Criação Publicitária 🚀',
    location: 'Vila Olímpia, SP • a 3 km de você',
    verified: true,
    compatibility: 91,
    bio: '“Criativa em tempo integral. Adoro festas de MPB, botecos tradicionais de esquina e conversas sem filtro.”',
    tags: ['🚀 Marketing', '🍺 Boteco', '🎶 MPB', '🎨 Design', '🍷 Vinho'],
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    patrimonio: 'Média-Alta'
  },
  {
    id: 'felipe_castro',
    name: 'Felipe Castro',
    age: 27,
    gender: 'M',
    job: 'Baixista de Banda & Produtor Musical 🎸',
    location: 'Lapa, SP • a 4 km de você',
    verified: true,
    compatibility: 88,
    bio: '“Ritmo e groove na veia. Encontros com cerveja gelada, rodadas de pagode e noites de estúdio.”',
    tags: ['🎸 Música', '🥁 Bateria', '🍻 Pagode', '🎧 Produção', '🍕 Pizza'],
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    patrimonio: 'Média-Baixa'
  },
  {
    id: 'mariana_ferreira',
    name: 'Mariana Ferreira',
    age: 30,
    gender: 'F',
    job: 'Bióloga & Especialista em Jardinagem 🌿',
    location: 'Tatuapé, SP • a 6 km de você',
    verified: true,
    compatibility: 89,
    bio: '“Transformando apartamentos em florestas tropicais. Adoro trilhas ecológicas, chás medicinais e animais resgatados.”',
    tags: ['🌿 Botânica', '🦫 Meio Ambiente', '🍵 Chá', '📚 Ciência', '🐾 Resgate'],
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    patrimonio: 'Média-Alta'
  },
  {
    id: 'marcelo_almeida',
    name: 'Marcelo Almeida',
    age: 35,
    gender: 'M',
    job: 'Professor Universitário de História 📚',
    location: 'Higienópolis, SP • a 3 km de você',
    verified: true,
    compatibility: 93,
    bio: '“Apaixonado por história do Brasil, arquitetura colonial paulista e bibliotecas antigas. Conversas ricas com café coado.”',
    tags: ['📚 História', '☕ Café Coado', '🏛️ Museus', '🎻 Música Clássica', '🍷 Vinho'],
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    patrimonio: 'Média-Alta'
  }
];
