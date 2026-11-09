import { JobBenefit, Career, EducationSystemState } from '../types/game';

export interface JobListing {
  id: string;
  title: string;
  company: string;
  salaryMonthly: number;
  type: 'infantil' | 'jovem_aprendiz' | 'clt' | 'pj' | 'estagio' | 'bicos';
  category: 'TI & Comunicação' | 'Trabalho Externo & Transporte' | 'Serviços & Comércio' | 'Indústria & Construção' | 'Saúde & Cuidados' | 'Vendas Leves' | 'Serviços Pet';
  categoryIcon: string;
  minAge: number;
  maxAge?: number;
  minIntelecto: number;
  minEducation: 'Ensino Fundamental' | 'Ensino Médio' | 'Técnico' | 'Graduação' | 'Pós-Graduação';
  requiredMajor?: string; // Requisito rígido de faculdade específica (ex: 'Medicina', 'Engenharia', 'Direito')
  description: string;
  benefits?: JobBenefit[];
}

export interface ConcursoListing {
  id: string;
  organ: string;
  title: string;
  salaryMonthly: number;
  subscriptionFee: number;
  minAge: number;
  minIntelectoRequired: number;
  minEducationRequired: 'Ensino Fundamental' | 'Ensino Médio' | 'Ensino Superior';
  requiredMajor?: string; // Requisito rígido de diploma superior específico
  passProbabilityBonus: number;
  description: string;
  vacancies: string;
  benefits?: JobBenefit[];
}

export interface CollegeMajor {
  id: string;
  name: string;
  semesters: number;
  monthlyTuition: number; // 0 para pública
  isPublic: boolean;
  minIntelecto: number;
  intellectGainPerYear: number;
  salaryBoost: number;
  category: string;
  description?: string;
  unlockedRoles?: string[];
}

export const AVAILABLE_JOBS: JobListing[] = [
  // --- CARGOS NOVOS ESPECIALIZADOS (12 NOVAS VAGAS) ---
  {
    id: 'dev_fullstack_sr',
    title: 'Desenvolvedor Fullstack Senior & Tech Lead',
    company: 'Fintech DinDin S.A.',
    salaryMonthly: 14500,
    type: 'clt',
    category: 'TI & Comunicação',
    categoryIcon: '💻',
    minAge: 22,
    minIntelecto: 65,
    minEducation: 'Graduação',
    description: 'Liderar arquitetura de software, microserviços e gestão da equipe de engenharia da fintech.',
    benefits: [
      { name: 'Vale Refeição Premium', icon: '💳', valueDescription: 'R$ 1.600/mês' },
      { name: 'Stock Options', icon: '📈', valueDescription: 'Ações da empresa' }
    ]
  },
  {
    id: 'medico_cirurgiao',
    title: 'Médico Cirurgião Geral & Especialista',
    company: 'Hospital das Clínicas de SP',
    salaryMonthly: 22000,
    type: 'clt',
    category: 'Saúde & Cuidados',
    categoryIcon: '🩺',
    minAge: 26,
    minIntelecto: 75,
    minEducation: 'Graduação',
    description: 'Realizar cirurgias eletivas e de emergência, plantões em UTI e pareceres especializados.',
    benefits: [
      { name: 'Plano Hospitalar VIP', icon: '🏥', valueDescription: 'Sua família 100% coberta' }
    ]
  },
  {
    id: 'gerente_agro',
    title: 'Gerente de Operações do Agronegócio',
    company: 'Fazenda Terra Rica Agro',
    salaryMonthly: 16000,
    type: 'clt',
    category: 'Trabalho Externo & Transporte',
    categoryIcon: '🚜',
    minAge: 24,
    minIntelecto: 60,
    minEducation: 'Graduação',
    description: 'Gestão de plantio, colheita, frota de maquinários e negociação de contratos de sacas.',
    benefits: [
      { name: 'Participação na Safra', icon: '🌾', valueDescription: 'Bônus anual em sacas' }
    ]
  },
  {
    id: 'perito_criminal',
    title: 'Perito Técnico Criminal Forense',
    company: 'Secretaria de Segurança Pública',
    salaryMonthly: 12800,
    type: 'clt',
    category: 'Serviços & Comércio',
    categoryIcon: '🔬',
    minAge: 23,
    minIntelecto: 68,
    minEducation: 'Graduação',
    description: 'Perícia de cenas de crime, análise balística e laudos periciais judiciais.',
    benefits: [
      { name: 'Insalubridade', icon: '🛡️', valueDescription: '+R$ 1.800/mês' }
    ]
  },
  {
    id: 'sommelier_vinho',
    title: 'Sommelier & Gestor de Adegas',
    company: 'Restaurante Fasano Gastronomia',
    salaryMonthly: 7500,
    type: 'clt',
    category: 'Serviços & Comércio',
    categoryIcon: '🍷',
    minAge: 21,
    minIntelecto: 45,
    minEducation: 'Técnico',
    description: 'Harmonização de vinhos de alta gastronomia e curadoria de adegas internacionais.',
    benefits: [
      { name: 'Degustação Internacional', icon: '✈️', valueDescription: 'Viagens anuais' }
    ]
  },
  {
    id: 'corretor_cripto',
    title: 'Analista de Criptoativos & Investimentos',
    company: 'Mercado Bitcoin & DeFi',
    salaryMonthly: 11200,
    type: 'pj',
    category: 'TI & Comunicação',
    categoryIcon: '🪙',
    minAge: 20,
    minIntelecto: 58,
    minEducation: 'Ensino Médio',
    description: 'Análise de mercado cripto, gestão de liquidez em blockchain e consultoria de carteiras.',
    benefits: [
      { name: 'Bônus em Cripto', icon: '⚡', valueDescription: 'Performance trimestral' }
    ]
  },
  {
    id: 'engenheiro_energia',
    title: 'Engenheiro de Energia Solar & Renovável',
    company: 'SolPlus Energia Renovável',
    salaryMonthly: 13500,
    type: 'clt',
    category: 'Indústria & Construção',
    categoryIcon: '☀️',
    minAge: 23,
    minIntelecto: 62,
    minEducation: 'Graduação',
    description: 'Projetar usinas fotovoltaicas e gestão de projetos de transição energética.',
    benefits: [
      { name: 'Carro da Empresa', icon: '🚗', valueDescription: 'Veículo com combustível pago' }
    ]
  },
  {
    id: 'psicologo_hospitalar',
    title: 'Psicólogo Clínico Hospitalar',
    company: 'Hospital Albert Einstein',
    salaryMonthly: 6800,
    type: 'clt',
    category: 'Saúde & Cuidados',
    categoryIcon: '🧠',
    minAge: 23,
    minIntelecto: 50,
    minEducation: 'Graduação',
    description: 'Acompanhamento psicológico de pacientes internados e apoio a familiares.',
    benefits: [
      { name: 'Plano de Saúde', icon: '🏥', valueDescription: 'Integral sem co-participação' }
    ]
  },
  {
    id: 'mecanico_aviacao',
    title: 'Técnico Mecânico de Aviação',
    company: 'Embraer & Azul Linhas Aéreas',
    salaryMonthly: 9200,
    type: 'clt',
    category: 'Indústria & Construção',
    categoryIcon: '✈️',
    minAge: 21,
    minIntelecto: 52,
    minEducation: 'Técnico',
    description: 'Manutenção preventiva e corretiva de turbinas e sistemas de aeronaves comerciais.',
    benefits: [
      { name: 'Passagens Aéreas Grátis', icon: '🎟️', valueDescription: 'Voos livres pelo Brasil' }
    ]
  },
  {
    id: 'pesquisador_biotech',
    title: 'Pesquisador em Biotecnologia & Genômica',
    company: 'Instituto Butantan & Fiocruz',
    salaryMonthly: 10500,
    type: 'clt',
    category: 'Saúde & Cuidados',
    categoryIcon: '🧬',
    minAge: 24,
    minIntelecto: 70,
    minEducation: 'Pós-Graduação',
    description: 'Desenvolvimento de vacinas, sequenciamento genético e pesquisa científica avançada.',
    benefits: [
      { name: 'Bolsa FAPESP', icon: '📚', valueDescription: 'Apoio a publicações' }
    ]
  },
  {
    id: 'chef_patisserie',
    title: 'Chef Pâtissier de Confeitaria Fina',
    company: 'Boutique Le Petit Gateau',
    salaryMonthly: 8000,
    type: 'clt',
    category: 'Serviços & Comércio',
    categoryIcon: '🎂',
    minAge: 21,
    minIntelecto: 48,
    minEducation: 'Técnico',
    description: 'Criação de sobremesas autorais, tortas finas e chocolataria artesanal.',
    benefits: [
      { name: 'Curso na França', icon: '🥐', valueDescription: 'Especialização anual' }
    ]
  },
  {
    id: 'gerente_logistica',
    title: 'Gerente de Logística e Cadeia de Suprimentos',
    company: 'Mercado Livre Brasil',
    salaryMonthly: 9800,
    type: 'clt',
    category: 'Trabalho Externo & Transporte',
    categoryIcon: '📦',
    minAge: 23,
    minIntelecto: 55,
    minEducation: 'Graduação',
    description: 'Coordenar centros de distribuição, rotas de entrega e otimização de frotas.',
    benefits: [
      { name: 'Desconto em Compras', icon: '🏷️', valueDescription: '20% off na plataforma' }
    ]
  },
  // --- TRABALHOS LEVES INFANTIS / JUVENIS (10 A 15 ANOS) ---
  {
    id: 'limonada_rua',
    title: 'Vender Limonada e Geladinho Caseiro',
    company: 'Negócio Próprio na Calçada',
    salaryMonthly: 350,
    type: 'infantil',
    category: 'Vendas Leves',
    categoryIcon: '🥤',
    minAge: 10,
    maxAge: 15,
    minIntelecto: 5,
    minEducation: 'Ensino Fundamental',
    description: 'Trabalho leve e divertido no bairro: montar banca de limonada bem gelada e geladinho de morango no verão.',
    benefits: [
      { name: 'Dinheiro de Bolso', icon: '🪙', valueDescription: 'Lucro do dia no dinheirinho de papel' },
      { name: 'Aprendizado Comercial', icon: '💡', valueDescription: 'Primeira noção de troco e cliente' }
    ]
  },
  {
    id: 'capinha_celular',
    title: 'Vender Capinhas e Películas de Celular',
    company: 'Banca do Tio na Feira Livre',
    salaryMonthly: 480,
    type: 'infantil',
    category: 'Vendas Leves',
    categoryIcon: '📱',
    minAge: 12,
    maxAge: 15,
    minIntelecto: 10,
    minEducation: 'Ensino Fundamental',
    description: 'Ajudar a organizar e demonstrar capinhas coloridas e películas para celular nas manhãs de sábado.',
    benefits: [
      { name: 'Lanche na Feira', icon: '🥟', valueDescription: 'Pastel de queijo e caldo de cana grátis' }
    ]
  },
  {
    id: 'passear_cachorro_vizinho',
    title: 'Passeador de Pets do Bairro',
    company: 'Serviço Comunitário do Bairro',
    salaryMonthly: 420,
    type: 'infantil',
    category: 'Serviços Pet',
    categoryIcon: '🐕',
    minAge: 11,
    maxAge: 15,
    minIntelecto: 8,
    minEducation: 'Ensino Fundamental',
    description: 'Cuidar e passear com os cachorros dos vizinhos no parque duas vezes por semana no fim da tarde.',
    benefits: [
      { name: 'Exercício ao Ar Livre', icon: '🐕', valueDescription: 'Diversão garantida com os peludinhos' }
    ]
  },

  // --- JOVEM APRENDIZ E ESTÁGIO DE ENSINO MÉDIO (16 A 17 ANOS) ---
  {
    id: 'jovem_aprendiz_banco',
    title: 'Jovem Aprendiz de Atendimento Bancário',
    company: 'Itaú Unibanco S.A.',
    salaryMonthly: 980,
    type: 'jovem_aprendiz',
    category: 'Serviços & Comércio',
    categoryIcon: '💼',
    minAge: 16,
    maxAge: 17,
    minIntelecto: 20,
    minEducation: 'Ensino Médio',
    description: 'Auxiliar correntistas na fila de caixa eletrônico e triagem de documentos com carteira assinada de aprendiz.',
    benefits: [
      { name: 'Vale Refeição / Alimentação', icon: '🍱', valueDescription: 'R$ 650/mês' },
      { name: 'Vale Transporte 100%', icon: '🚌', valueDescription: 'Passe livre de ônibus/metrô' },
      { name: 'Curso Técnico Grátis', icon: '🎓', valueDescription: 'Capacitação teórica oferecida pelo Senac' }
    ]
  },
  {
    id: 'jovem_aprendiz_loja',
    title: 'Atendente Jovem Aprendiz',
    company: 'Lojas Americanas / Magazine Luiza',
    salaryMonthly: 920,
    type: 'jovem_aprendiz',
    category: 'Serviços & Comércio',
    categoryIcon: '💼',
    minAge: 16,
    maxAge: 17,
    minIntelecto: 15,
    minEducation: 'Ensino Médio',
    description: 'Organização de prateleiras, etiquetagem de ofertas e apoio ao cliente no setor de departamento.',
    benefits: [
      { name: 'Vale Transporte', icon: '🚌', valueDescription: 'Desconto em folha 6%' },
      { name: 'Desconto de Funcionário', icon: '🛍️', valueDescription: '15% de desconto nas compras da loja' }
    ]
  },

  // --- 💻 CATEGORIA: TI & COMUNICAÇÃO ---
  {
    id: 'suporte_ti',
    title: 'Técnico de Suporte N1 & Redes',
    company: 'InfraTech Soluções de TI',
    salaryMonthly: 2400,
    type: 'clt',
    category: 'TI & Comunicação',
    categoryIcon: '💻',
    minAge: 18,
    minIntelecto: 30,
    minEducation: 'Ensino Médio',
    description: 'Montagem de computadores, formatação, crimpagem de cabos de rede e atendimento telefônico a usuários.',
    benefits: [
      { name: 'Vale Refeição (VR)', icon: '🍔', valueDescription: 'R$ 30/dia trabalhado (R$ 660/mês)' },
      { name: 'Vale Transporte (VT)', icon: '🚌', valueDescription: 'Cobertura integral para o deslocamento' },
      { name: 'Plano Odontológico Amil', icon: '🦷', valueDescription: 'Sem custo mensal' }
    ]
  },
  {
    id: 'tecnico_informatica',
    title: 'Técnico de Manutenção de Computadores & Celulares',
    company: 'Assistência Técnica Bairro Soluções',
    salaryMonthly: 3200,
    type: 'clt',
    category: 'TI & Comunicação',
    categoryIcon: '💻',
    minAge: 18,
    minIntelecto: 35,
    minEducation: 'Técnico',
    description: 'Manutenção de placa-mãe, troca de tela de smartphone, limpeza preventiva e configuração de servidores locais.',
    benefits: [
      { name: 'Vale Alimentação (VA)', icon: '🛒', valueDescription: 'R$ 500/mês no cartão Ticket' },
      { name: 'Comissão sobre Peças', icon: '💵', valueDescription: 'Adicional por reparo concluído' }
    ]
  },
  {
    id: 'social_media',
    title: 'Gestor de Mídias Sociais & Social Media',
    company: 'Agência Criativa Pimenta Digital',
    salaryMonthly: 2900,
    type: 'pj',
    category: 'TI & Comunicação',
    categoryIcon: '💻',
    minAge: 18,
    minIntelecto: 32,
    minEducation: 'Ensino Médio',
    description: 'Criação de artes no Canva/Photoshop, edição de Reels/Shorts e agendamento de posts para marcas.',
    benefits: [
      { name: 'Home Office Híbrido', icon: '🏡', valueDescription: '3 dias por semana em casa' }
    ]
  },
  {
    id: 'dev_junior',
    title: 'Desenvolvedor Web Front-End Júnior',
    company: 'Fintech Tropical Soluções',
    salaryMonthly: 5500,
    type: 'clt',
    category: 'TI & Comunicação',
    categoryIcon: '💻',
    minAge: 18,
    minIntelecto: 50,
    minEducation: 'Graduação',
    description: 'Criação de aplicações React, TypeScript, APIs REST e integrações de banco de dados.',
    benefits: [
      { name: 'Plano de Saúde Bradesco Top', icon: '🏥', valueDescription: 'Sem coparticipação' },
      { name: 'VR / VA Flexível Caju', icon: '💳', valueDescription: 'R$ 1.400/mês' },
      { name: 'Gympass Black (Vale Academia)', icon: '🏋️', valueDescription: 'Acesso às melhores academias do país' },
      { name: 'Bônus PLR', icon: '💰', valueDescription: 'Até 2 salários anuais' }
    ]
  },
  {
    id: 'hacker_biosec',
    title: 'Hacker Ético & Analista de Bios Sec / Cibersegurança',
    company: 'CyberGuard Brasil Intelligence',
    salaryMonthly: 9800,
    type: 'clt',
    category: 'TI & Comunicação',
    categoryIcon: '💻',
    minAge: 20,
    minIntelecto: 72,
    minEducation: 'Graduação',
    description: 'PenTest (teste de invasão), auditoria de código, proteção contra ataques DDoS e análise de vulnerabilidades em servidores.',
    benefits: [
      { name: 'Plano de Saúde SulAmérica', icon: '🏥', valueDescription: 'Apartamento executivo extensivo' },
      { name: 'VR / VA Máximo', icon: '🍱', valueDescription: 'R$ 1.800/mês' },
      { name: 'Auxílio Equipamento / Setup', icon: '🖥️', valueDescription: 'R$ 4.000 para montar seu computador de trabalho' }
    ]
  },
  {
    id: 'jornalista_imprensa',
    title: 'Assessor de Comunicação & Jornalista',
    company: 'Rede de Notícias Diário Brasil',
    salaryMonthly: 4200,
    type: 'clt',
    category: 'TI & Comunicação',
    categoryIcon: '💻',
    minAge: 20,
    minIntelecto: 48,
    minEducation: 'Graduação',
    description: 'Redação de reportagens, apuração de fatos em campo, entrevistas e produção de pautas para portal de imprensa.',
    benefits: [
      { name: 'Vale Refeição', icon: '🍔', valueDescription: 'R$ 800/mês' },
      { name: 'Credencial de Imprensa', icon: '📰', valueDescription: 'Entrada franca em shows e eventos' }
    ]
  },

  // --- 🚛 CATEGORIA: TRABALHO EXTERNO & TRANSPORTE ---
  {
    id: 'gari_coletor',
    title: 'Gari / Coletor Ambiental de Resíduos',
    company: 'Companhia de Limpeza Urbana (EcoLIMP)',
    salaryMonthly: 2500,
    type: 'clt',
    category: 'Trabalho Externo & Transporte',
    categoryIcon: '🚛',
    minAge: 18,
    minIntelecto: 15,
    minEducation: 'Ensino Fundamental',
    description: 'Coleta domiciliar de resíduos sólidos nos caminhões compactadores com corrida e atividade física vigorosa.',
    benefits: [
      { name: 'Adicional de Insalubridade 40%', icon: '⚠️', valueDescription: '+R$ 560 mensais garantidos em lei' },
      { name: 'Vale Refeição Abastado', icon: '🍲', valueDescription: 'R$ 750/mês' },
      { name: 'Cesta Básica Física', icon: '🧺', valueDescription: '30kg de alimentos entregues em casa' }
    ]
  },
  {
    id: 'vendedor_externo',
    title: 'Vendedor Externo Porta a Porta',
    company: 'Distribuidora Alimentos & Bebidas',
    salaryMonthly: 2300,
    type: 'clt',
    category: 'Trabalho Externo & Transporte',
    categoryIcon: '🚛',
    minAge: 18,
    minIntelecto: 20,
    minEducation: 'Ensino Médio',
    description: 'Visita presencial a comércios, padarias e mercearias para captação de pedidos e vendas de produtos.',
    benefits: [
      { name: 'Comissão sem Teto', icon: '💵', valueDescription: 'Média de +R$ 1.200 por mês' },
      { name: 'Ajuda de Custo / Combustível', icon: '⛽', valueDescription: 'R$ 400/mês' }
    ]
  },
  {
    id: 'motorista_app',
    title: 'Motorista de Aplicativo / Uber',
    company: 'Autônomo (Frota Própria/Alugada)',
    salaryMonthly: 3600,
    type: 'bicos',
    category: 'Trabalho Externo & Transporte',
    categoryIcon: '🚛',
    minAge: 19,
    minIntelecto: 22,
    minEducation: 'Ensino Médio',
    description: 'Transporte passageiros em corridas urbanas pela cidade com horário 100% flexível e renda diária.',
    benefits: [
      { name: 'Horário Livre', icon: '⏰', valueDescription: 'Você é o seu próprio chefe' }
    ]
  },
  {
    id: 'entregador_moto',
    title: 'Entregador de Moto / App de Entregas',
    company: 'iFood / Rappi Entregas',
    salaryMonthly: 2800,
    type: 'bicos',
    category: 'Trabalho Externo & Transporte',
    categoryIcon: '🚛',
    minAge: 18,
    minIntelecto: 18,
    minEducation: 'Ensino Médio',
    description: 'Entrega rápida de marmitas, lanches e medicamentos utilizando motocicleta nas ruas da cidade.',
    benefits: [
      { name: 'Gorjetas pelo App', icon: '🪙', valueDescription: 'Repasse direto via PIX' }
    ]
  },
  {
    id: 'caminhoneiro',
    title: 'Caminhoneiro de Carga Pesada (Rodoviário)',
    company: 'Transportadora TransBrasil Logística',
    salaryMonthly: 7200,
    type: 'clt',
    category: 'Trabalho Externo & Transporte',
    categoryIcon: '🚛',
    minAge: 21,
    minIntelecto: 35,
    minEducation: 'Ensino Médio',
    description: 'Viagens estaduais e interestaduais transportando grãos, máquinas ou alimentos em carretas rodoviárias.',
    benefits: [
      { name: 'Diária de Viagem', icon: '🛏️', valueDescription: 'R$ 150/dia para alimentação e pernoite em postos' },
      { name: 'Seguro de Vida Especial', icon: '🛡️', valueDescription: 'Cobertura R$ 250 mil' }
    ]
  },
  {
    id: 'carteiro_correios',
    title: 'Carteiro Distribuidor dos Correios',
    company: 'Empresa Brasileira de Correios e Telégrafos (ECT)',
    salaryMonthly: 3100,
    type: 'clt',
    category: 'Trabalho Externo & Transporte',
    categoryIcon: '🚛',
    minAge: 18,
    minIntelecto: 25,
    minEducation: 'Ensino Médio',
    description: 'Entrega domiciliar de cartas, encomendas registradas e sedimentação de sedex nos distritos postais.',
    benefits: [
      { name: 'Vale Alimentação Correios', icon: '🛒', valueDescription: 'R$ 1.100/mês' },
      { name: 'Plano de Saúde Postal', icon: '🏥', valueDescription: 'Ambulatorial e hospitalar' }
    ]
  },

  // --- 💼 CATEGORIA: SERVIÇOS & COMÉRCIO ---
  {
    id: 'caixa_supermercado',
    title: 'Atendente de Caixa de Supermercado',
    company: 'Supermercados Pão de Açúcar / Carrefour',
    salaryMonthly: 1750,
    type: 'clt',
    category: 'Serviços & Comércio',
    categoryIcon: '💼',
    minAge: 18,
    minIntelecto: 18,
    minEducation: 'Ensino Médio',
    description: 'Registro de compras, recebimento em dinheiro/cartão/PIX e fechamento diário de caixa.',
    benefits: [
      { name: 'Quebra de Caixa', icon: '💰', valueDescription: 'Adicional de R$ 180 mensais' },
      { name: 'Vale Refeição', icon: '🍱', valueDescription: 'R$ 450/mês' }
    ]
  },
  {
    id: 'gerente_loja',
    title: 'Gerente de Loja de Shopping',
    company: 'Renner / Riachuelo Moda',
    salaryMonthly: 4900,
    type: 'clt',
    category: 'Serviços & Comércio',
    categoryIcon: '💼',
    minAge: 21,
    minIntelecto: 45,
    minEducation: 'Graduação',
    description: 'Liderança da equipe de vendas, escala de folga, metas mensais e gestão de estoque.',
    benefits: [
      { name: 'Comissão de Meta da Loja', icon: '🎯', valueDescription: 'Participação nas vendas da equipe' },
      { name: 'Vale Refeição (VR)', icon: '🍔', valueDescription: 'R$ 700/mês' }
    ]
  },

  // --- 🛠️ CATEGORIA: INDÚSTRIA & CONSTRUÇÃO ---
  {
    id: 'servente_pedreiro',
    title: 'Servente de Obras & Pedreiro',
    company: 'Construtora e Empreiteira Bairro',
    salaryMonthly: 2100,
    type: 'clt',
    category: 'Indústria & Construção',
    categoryIcon: '🛠️',
    minAge: 18,
    minIntelecto: 15,
    minEducation: 'Ensino Fundamental',
    description: 'Preparo de massa de cimento, assentamento de tijolos, transporte de blocos e auxílio ao pedreiro chefe.',
    benefits: [
      { name: 'Almoço no Canteiro', icon: '🍲', valueDescription: 'Marmita reforçada fornecida diariamente' }
    ]
  },
  {
    id: 'eletricista_predial',
    title: 'Eletricista Predial & Manutenção',
    company: 'Serviços Elétricos VoltTec',
    salaryMonthly: 3800,
    type: 'clt',
    category: 'Indústria & Construção',
    categoryIcon: '🛠️',
    minAge: 18,
    minIntelecto: 38,
    minEducation: 'Técnico',
    description: 'Instalação de quadros de força, fiação trifásica, disjuntores e manutenção elétrica predial.',
    benefits: [
      { name: 'Periculosidade 30%', icon: '⚡', valueDescription: '+R$ 1.140 mensais em folha' },
      { name: 'Plano Odontológico', icon: '🦷', valueDescription: 'Incluso' }
    ]
  },

  // --- 🏥 CATEGORIA: SAÚDE & CUIDADOS ---
  {
    id: 'cuidador_idosos',
    title: 'Cuidador(a) de Idosos Domiciliar',
    company: 'Home Care Bem-Estar',
    salaryMonthly: 2500,
    type: 'clt',
    category: 'Saúde & Cuidados',
    categoryIcon: '🏥',
    minAge: 18,
    minIntelecto: 25,
    minEducation: 'Ensino Médio',
    description: 'Acompanhamento de rotina, administração de medicamentos prescritos e auxílio na locomoção.',
    benefits: [
      { name: 'Alimentação no Local', icon: '🍲', valueDescription: 'Refeições inclusas no plantão' }
    ]
  },
  {
    id: 'tecnico_enfermagem',
    title: 'Técnico(a) de Enfermagem Hospitalar',
    company: 'Hospital São Luiz / Albert Einstein',
    salaryMonthly: 3900,
    type: 'clt',
    category: 'Saúde & Cuidados',
    categoryIcon: '🏥',
    minAge: 19,
    minIntelecto: 42,
    minEducation: 'Técnico',
    description: 'Medicação de pacientes, curativos avançados, triagem em pronto-socorro e verificação de sinais vitais.',
    benefits: [
      { name: 'Insalubridade Hospitalar', icon: '🩺', valueDescription: '+R$ 480/mês' },
      { name: 'Plano de Saúde Hospitalar', icon: '🏥', valueDescription: 'Cobertura médica total' },
      { name: 'Vale Refeição (VR)', icon: '🍱', valueDescription: 'R$ 750/mês para plantões' }
    ]
  },

  // --- 🩺 CARREIRAS DE GRADUAÇÃO SUPERIOR (MEDICINA, DIREITO, VETERINÁRIA, FARMÁCIA, PSICOLOGIA, PSICOPEDAGOGIA) ---
  {
    id: 'medico_clinico',
    title: 'Médico Clínico Geral & Plantonista',
    company: 'Hospital Samaritano & Rede D’Or',
    salaryMonthly: 18500,
    type: 'pj',
    category: 'Saúde & Cuidados',
    categoryIcon: '🩺',
    minAge: 22,
    minIntelecto: 65,
    minEducation: 'Graduação',
    description: 'Atendimento clínico geral, prescrição de tratamentos e plantões em emergência médica.',
    benefits: [
      { name: 'Plano de Saúde Executivo', icon: '🏥', valueDescription: 'Cobertura VIP nacional' },
      { name: 'Gympass TotalPass', icon: '🏋️', valueDescription: 'Acesso a academias premium' },
      { name: 'Vale Refeição (VR)', icon: '🍱', valueDescription: 'R$ 1.200/mês' }
    ]
  },
  {
    id: 'medico_cirurgiao',
    title: 'Médico Cirurgião Geral & Diretor Hospitalar',
    company: 'Complexo Hospitalar Sírio-Libanês',
    salaryMonthly: 34000,
    type: 'pj',
    category: 'Saúde & Cuidados',
    categoryIcon: '🏥',
    minAge: 25,
    minIntelecto: 80,
    minEducation: 'Graduação',
    description: 'Procedimentos cirúrgicos de alta complexidade e gestão de diretoria clínica hospitalar.',
    benefits: [
      { name: 'Plano de Saúde Black', icon: '💎', valueDescription: 'Atendimento médico internacional' },
      { name: 'Carro da Diretoria', icon: '🚘', valueDescription: 'Veículo executivo com motorista' }
    ]
  },
  {
    id: 'advogado_associado',
    title: 'Advogado Associado & Consultor Jurídico',
    company: 'Banca de Advocacia Pinheiro Neto',
    salaryMonthly: 9800,
    type: 'pj',
    category: 'Serviços & Comércio',
    categoryIcon: '⚖️',
    minAge: 22,
    minIntelecto: 48,
    minEducation: 'Graduação',
    description: 'Elaboração de peças processuais, defesas nos tribunais e consultoria de contratos empresariais.',
    benefits: [
      { name: 'Gympass Corporativo', icon: '💪', valueDescription: 'Rede SmartFit & BlueFit' },
      { name: 'Plano de Saúde OAB', icon: '🏥', valueDescription: 'Seguro saúde completo' }
    ]
  },
  {
    id: 'veterinario_clinico',
    title: 'Médico Veterinário de Clínica Pet',
    company: 'Hospital Veterinário Petz & VetCare',
    salaryMonthly: 8500,
    type: 'clt',
    category: 'Serviços Pet',
    categoryIcon: '🐾',
    minAge: 22,
    minIntelecto: 48,
    minEducation: 'Graduação',
    description: 'Consultas clínicas, exames laboratoriais, vacinação e pequenas cirurgias em animais domésticos.',
    benefits: [
      { name: 'Vale Alimentação (VA)', icon: '🛒', valueDescription: 'R$ 800/mês' },
      { name: 'Assistência Pet Familiar', icon: '🐕', valueDescription: 'Tratamento grátis para seus pets' }
    ]
  },
  {
    id: 'veterinario_perito_agro',
    title: 'Perito Veterinário Agropecuário',
    company: 'Cooperativa Agroindustrial & Fazendas Reunidas',
    salaryMonthly: 14200,
    type: 'pj',
    category: 'Serviços Pet',
    categoryIcon: '🐂',
    minAge: 23,
    minIntelecto: 55,
    minEducation: 'Graduação',
    description: 'Manejo reprodutivo de gado de elite, inspeção sanitária de rebanhos e perícia zootécnica de campo.',
    benefits: [
      { name: 'Caminhonete 4x4 da Empresa', icon: '🛻', valueDescription: 'Combustível livre para visitas rurais' }
    ]
  },
  {
    id: 'farmaceutico_bioquimico',
    title: 'Farmacêutico Bioquímico & Responsável Técnico',
    company: 'Rede RaiaDrogasil & Laboratório EMS',
    salaryMonthly: 7200,
    type: 'clt',
    category: 'Saúde & Cuidados',
    categoryIcon: '💊',
    minAge: 22,
    minIntelecto: 45,
    minEducation: 'Graduação',
    description: 'Responsabilidade técnica de drogaria, controle de psicotrópicos e análises clínicas de sangue.',
    benefits: [
      { name: 'Vale Refeição (VR)', icon: '🥪', valueDescription: 'R$ 750/mês' },
      { name: 'Desconto Farmácia 50%', icon: '💊', valueDescription: 'Desconto em medicamentos' }
    ]
  },
  {
    id: 'farmaceutico_industrial',
    title: 'Responsável Técnico da Indústria Farmacêutica',
    company: 'Multinacional Eurofarma / Pfizer',
    salaryMonthly: 13500,
    type: 'clt',
    category: 'Saúde & Cuidados',
    categoryIcon: '🧪',
    minAge: 24,
    minIntelecto: 60,
    minEducation: 'Graduação',
    description: 'Supervisão de controle de qualidade, boas práticas de fabricação (BPF) e validação de lotes.',
    benefits: [
      { name: 'Plano de Saúde Bradesco Top', icon: '🏥', valueDescription: 'Cobertura para titular e dependentes' },
      { name: 'Gympass TotalPass', icon: '🏃', valueDescription: 'Incluso' },
      { name: 'Participação nos Lucros (PLR)', icon: '💰', valueDescription: 'Até 3 salários anuais' }
    ]
  },
  {
    id: 'psicologo_clinico',
    title: 'Psicólogo(a) Clínico & Terapeuta',
    company: 'Consultório Integrado & Atendimento Particular',
    salaryMonthly: 7800,
    type: 'pj',
    category: 'Saúde & Cuidados',
    categoryIcon: '🧠',
    minAge: 22,
    minIntelecto: 45,
    minEducation: 'Graduação',
    description: 'Atendimento de psicoterapia individual e de casal, avaliação psicológica e acolhimento emocional.',
    benefits: [
      { name: 'Flexibilidade de Horários', icon: '⏰', valueDescription: 'Agenda personalizada' }
    ]
  },
  {
    id: 'psicologo_organizacional',
    title: 'Psicólogo(a) Organizacional & Head de RH',
    company: 'Tech Startup Unicórnio',
    salaryMonthly: 10500,
    type: 'clt',
    category: 'Serviços & Comércio',
    categoryIcon: '👥',
    minAge: 23,
    minIntelecto: 52,
    minEducation: 'Graduação',
    description: 'Recrutamento & Seleção estratégico, clima organizacional, mediação de conflitos e liderança.',
    benefits: [
      { name: 'Gympass', icon: '🏋️', valueDescription: 'Treino em qualquer academia' },
      { name: 'VR e VA Flexível', icon: '💳', valueDescription: 'R$ 1.400/mês cartão Caju/Flash' }
    ]
  },
  {
    id: 'psicopedagoga_escola',
    title: 'Psicopedagoga Escolar Institucional',
    company: 'Colégio Bandeirantes / Rede Positivo',
    salaryMonthly: 5800,
    type: 'clt',
    category: 'Serviços & Comércio',
    categoryIcon: '📚',
    minAge: 22,
    minIntelecto: 44,
    minEducation: 'Graduação',
    description: 'Orientação de alunos com dificuldades de aprendizagem (TDAH, dislexia) e apoio à equipe pedagógica.',
    benefits: [
      { name: 'Vale Alimentação (VA)', icon: '🛒', valueDescription: 'R$ 650/mês' },
      { name: 'Bolsa de Estudos 100%', icon: '🎓', valueDescription: 'Para pós-graduação' }
    ]
  },
  {
    id: 'psicopedagoga_clinica',
    title: 'Psicopedagoga Clínica & Atendimento Particular',
    company: 'Clínica Multidisciplinar NeuroSaber',
    salaryMonthly: 9200,
    type: 'pj',
    category: 'Saúde & Cuidados',
    categoryIcon: '🧩',
    minAge: 23,
    minIntelecto: 50,
    minEducation: 'Graduação',
    description: 'Diagnóstico psicopedagógico e intervenção em consultório particular com famílias e escolas.',
    benefits: [
      { name: 'Independência Profissional', icon: '✨', valueDescription: 'Faturamento por sessão particular' }
    ]
  }
];

export const CONCURSOS_PUBLICOS: ConcursoListing[] = [
  // --- ENSINO FUNDAMENTAL ---
  {
    id: 'concurso_gari',
    organ: 'Companhia Municipal de Limpeza Urbana (COMLURB)',
    title: 'Gari da Limpeza Urbana',
    salaryMonthly: 2800,
    subscriptionFee: 45,
    minAge: 18,
    minIntelectoRequired: 15,
    minEducationRequired: 'Ensino Fundamental',
    passProbabilityBonus: 0.8,
    description: 'Varrição, capina e conservação das vias públicas municipais com estabilidade de servidor estatutário.',
    vacancies: '1.500 vagas imediatas',
    benefits: [
      { name: 'Insalubridade 40%', icon: '⚠️', valueDescription: '+R$ 600 mensais no contracheque' },
      { name: 'Estabilidade Estatutária', icon: '🏛️', valueDescription: 'Garantia de emprego vitalícia' },
      { name: 'Vale Alimentação', icon: '🛒', valueDescription: 'R$ 850/mês' }
    ]
  },
  {
    id: 'concurso_agente_limpeza',
    organ: 'Prefeitura Municipal - Divisão de Obras',
    title: 'Agente de Serviços Gerais e Limpeza',
    salaryMonthly: 2450,
    subscriptionFee: 40,
    minAge: 18,
    minIntelectoRequired: 15,
    minEducationRequired: 'Ensino Fundamental',
    passProbabilityBonus: 0.82,
    description: 'Manutenção e higienização de prédios públicos municipais, escolas e postos de saúde.',
    vacancies: '800 vagas municipais',
    benefits: [
      { name: 'Cesta Básica Servidor', icon: '🧺', valueDescription: 'Entregue mensalmente' }
    ]
  },

  // --- ENSINO MÉDIO ---
  {
    id: 'concurso_pm',
    organ: 'Polícia Militar do Estado',
    title: 'Soldado da Polícia Militar',
    salaryMonthly: 4850,
    subscriptionFee: 75,
    minAge: 18,
    minIntelectoRequired: 35,
    minEducationRequired: 'Ensino Médio',
    passProbabilityBonus: 0.7,
    description: 'Patrulhamento ostensivo, segurança pública e proteção comunitária estatutária.',
    vacancies: '2.700 vagas estaduais',
    benefits: [
      { name: 'Hospital da Polícia Militar', icon: '🏥', valueDescription: 'Atendimento médico gratuito para a família' },
      { name: 'Previdência Militar Especial', icon: '🛡️', valueDescription: 'Aposentadoria com proventos integrais' }
    ]
  },
  {
    id: 'concurso_inss',
    organ: 'INSS - Instituto Nacional do Seguro Social',
    title: 'Técnico do Seguro Social',
    salaryMonthly: 6200,
    subscriptionFee: 85,
    minAge: 18,
    minIntelectoRequired: 48,
    minEducationRequired: 'Ensino Médio',
    passProbabilityBonus: 0.6,
    description: 'Atendimento previdenciário e análise de concessão de aposentadorias e auxílios pelo Governo Federal.',
    vacancies: '1.000 vagas federais',
    benefits: [
      { name: 'Auxílio-Alimentação Federal', icon: '🍱', valueDescription: 'R$ 1.000/mês' },
      { name: 'Estabilidade Federal', icon: '🏛️', valueDescription: 'Cargo estatutário inafastável' }
    ]
  },
  {
    id: 'concurso_caixa',
    organ: 'Caixa Econômica Federal',
    title: 'Técnico Bancário da Caixa',
    salaryMonthly: 5800,
    subscriptionFee: 90,
    minAge: 18,
    minIntelectoRequired: 45,
    minEducationRequired: 'Ensino Médio',
    passProbabilityBonus: 0.62,
    description: 'Atendimento ao público, concessão de FGTS, PIS e financiamento habitacional Minha Casa Minha Vida.',
    vacancies: '4.000 vagas em todo o Brasil',
    benefits: [
      { name: 'VR / VA Caixa', icon: '💳', valueDescription: 'R$ 1.820/mês' },
      { name: 'Saúde Caixa', icon: '🏥', valueDescription: 'Excelente convênio médico' },
      { name: 'PLR Semestral', icon: '💰', valueDescription: 'Participação nos lucros substancial' }
    ]
  },

  // --- ENSINO SUPERIOR ---
  {
    id: 'concurso_pf',
    organ: 'Polícia Federal (DPF)',
    title: 'Agente / Escrivão da Polícia Federal',
    salaryMonthly: 14500,
    subscriptionFee: 180,
    minAge: 21,
    minIntelectoRequired: 70,
    minEducationRequired: 'Ensino Superior',
    passProbabilityBonus: 0.4,
    description: 'Investigação de crimes federais, combate à corrupção e segurança de fronteiras nacionais.',
    vacancies: '500 vagas federais',
    benefits: [
      { name: 'Porte de Arma Nacional', icon: '🛡️', valueDescription: 'Porte livre em todo o país' },
      { name: 'Adicional de Fronteira', icon: '🗺️', valueDescription: '+R$ 2.000/mês se alocado em fronteiras' }
    ]
  },
  {
    id: 'concurso_receita',
    organ: 'Receita Federal do Brasil (RFB)',
    title: 'Auditor-Fiscal da Receita Federal',
    salaryMonthly: 22900,
    subscriptionFee: 210,
    minAge: 21,
    minIntelectoRequired: 80,
    minEducationRequired: 'Ensino Superior',
    passProbabilityBonus: 0.3,
    description: 'Fiscalização tributária nacional, combate ao sonecimento e alfândega de aeroportos e portos.',
    vacancies: '230 vagas exclusivas',
    benefits: [
      { name: 'Bônus de Eficiência Tributária', icon: '💰', valueDescription: 'Adicional de até R$ 3.000/mês' },
      { name: 'Estabilidade de Elite', icon: '🏛️', valueDescription: 'Carreira típica de Estado' }
    ]
  },
  {
    id: 'concurso_delegado',
    organ: 'Polícia Civil do Estado',
    title: 'Delegado de Polícia Civil',
    salaryMonthly: 21500,
    subscriptionFee: 220,
    minAge: 23,
    minIntelectoRequired: 75,
    minEducationRequired: 'Ensino Superior',
    passProbabilityBonus: 0.35,
    description: 'Direção de delegacia, presidência de inquéritos policiais e combate ao crime organizado.',
    vacancies: '150 vagas estaduais',
    benefits: [
      { name: 'Porte de Arma Livre', icon: '🛡️', valueDescription: 'Porte nacional' },
      { name: 'Viatura Descaracterizada', icon: '🚓', valueDescription: 'Veículo funcional' }
    ]
  },
  {
    id: 'concurso_juiz',
    organ: 'Tribunal de Justiça do Estado (TJ)',
    title: 'Juiz de Direito Substituto (Magistratura)',
    salaryMonthly: 35800,
    subscriptionFee: 320,
    minAge: 25,
    minIntelectoRequired: 90,
    minEducationRequired: 'Ensino Superior',
    passProbabilityBonus: 0.25,
    description: 'Julgamento de ações cíveis e criminais, aplicação da lei e liderança de comarca judiciária.',
    vacancies: '45 vagas de magistratura',
    benefits: [
      { name: 'Vitaliceidade & Inamovibilidade', icon: '⚖️', valueDescription: 'Garantias constitucionais' },
      { name: 'Auxílio Moradia & Livro', icon: '📚', valueDescription: '+R$ 4.300/mês' }
    ]
  },
  {
    id: 'concurso_medico_legista',
    organ: 'Instituto Médico Legal (IML) / Polícia Técnico-Científica',
    title: 'Médico Legista & Perito Criminal',
    salaryMonthly: 19800,
    subscriptionFee: 190,
    minAge: 24,
    minIntelectoRequired: 72,
    minEducationRequired: 'Ensino Superior',
    passProbabilityBonus: 0.4,
    description: 'Necrópsias forenses, exames de corpo de delito e laudos periciais para investigações criminais.',
    vacancies: '80 vagas',
    benefits: [
      { name: 'Insalubridade Máxima', icon: '🩺', valueDescription: '+R$ 1.500/mês' },
      { name: 'Plano de Saúde Especial', icon: '🏥', valueDescription: 'Integral' }
    ]
  }
];

export const COLLEGE_MAJORS: CollegeMajor[] = [
  {
    id: 'medicina',
    name: 'Medicina (Graduação em Saúde)',
    semesters: 8,
    monthlyTuition: 4800,
    isPublic: false,
    minIntelecto: 65,
    intellectGainPerYear: 30,
    salaryBoost: 12000,
    category: 'Saúde',
    description: '4 anos de estudo superior. Habilita ocupar cargos da saúde: Médico Residente, Clínico Geral, Cirurgião Geral e Diretor Hospitalar.',
    unlockedRoles: ['Médico Clínico Geral', 'Médico Cirurgião', 'Diretor Hospitalar']
  },
  {
    id: 'direito',
    name: 'Direito (Ciências Jurídicas)',
    semesters: 8,
    monthlyTuition: 850,
    isPublic: false,
    minIntelecto: 40,
    intellectGainPerYear: 22,
    salaryBoost: 5500,
    category: 'Jurídico',
    description: '4 anos de formação jurídica. Habilita ocupar cargos de Advogado Associado, Delegado de Polícia, Promotor e Juiz de Direito.',
    unlockedRoles: ['Advogado Associado', 'Delegado de Polícia Civil', 'Juiz de Direito']
  },
  {
    id: 'veterinaria',
    name: 'Medicina Veterinária',
    semesters: 8,
    monthlyTuition: 1200,
    isPublic: false,
    minIntelecto: 45,
    intellectGainPerYear: 20,
    salaryBoost: 4800,
    category: 'Biológicas',
    description: '4 anos de estudo em saúde animal. Habilita atuar como Veterinário Clínico Pet, Cirurgião Veterinário e Perito Agropecuário.',
    unlockedRoles: ['Veterinário Clínico', 'Cirurgião Veterinário', 'Perito Agropecuário']
  },
  {
    id: 'farmacia',
    name: 'Farmácia & Bioquímica',
    semesters: 8,
    monthlyTuition: 950,
    isPublic: false,
    minIntelecto: 42,
    intellectGainPerYear: 18,
    salaryBoost: 4500,
    category: 'Saúde',
    description: '4 anos de ciências farmacêuticas. Habilita Farmacêutico Responsável, Bioquímico de Laboratório e Responsável Técnico Industrial.',
    unlockedRoles: ['Farmacêutico Drogaria', 'Bioquímico de Análises', 'Responsável Técnico Farma']
  },
  {
    id: 'psicologia',
    name: 'Psicologia (Bacharelado & Clínica)',
    semesters: 8,
    monthlyTuition: 780,
    isPublic: false,
    minIntelecto: 38,
    intellectGainPerYear: 19,
    salaryBoost: 4200,
    category: 'Humanas',
    description: '4 anos de formação em psicologia. Habilita Psicólogo Clínico, Terapeuta e Psicólogo Organizacional / Gestão de Pessoas.',
    unlockedRoles: ['Psicólogo Clínico', 'Psicólogo Organizacional RH']
  },
  {
    id: 'psicopedagogia',
    name: 'Psicopedagogia (Clínica & Institucional)',
    semesters: 8,
    monthlyTuition: 690,
    isPublic: false,
    minIntelecto: 35,
    intellectGainPerYear: 18,
    salaryBoost: 3800,
    category: 'Educação',
    description: '4 anos de formação psicopedagógica. Habilita atuação especializada em Escolas, Clínicas Multidisciplinares e Atendimento Particular.',
    unlockedRoles: ['Psicopedagoga Escolar', 'Psicopedagoga Clínica', 'Atendimento Particular']
  },
  {
    id: 'ads_tecnologia',
    name: 'Ciência da Computação & ADS',
    semesters: 8,
    monthlyTuition: 0,
    isPublic: true,
    minIntelecto: 50,
    intellectGainPerYear: 24,
    salaryBoost: 6000,
    category: 'Tecnologia',
    description: '4 anos de computação, inteligência artificial e engenharia de software.',
    unlockedRoles: ['Desenvolvedor Fullstack Sr', 'Tech Lead', 'Engenheiro de Software']
  },
  {
    id: 'engenharia',
    name: 'Engenharia (Civil, Elétrica & Produção)',
    semesters: 8,
    monthlyTuition: 1250,
    isPublic: false,
    minIntelecto: 50,
    intellectGainPerYear: 26,
    salaryBoost: 7500,
    category: 'Exatas',
    description: '4 anos de formação em cálculo estrutural, gestão de obras, energias renováveis e projetos industriais.',
    unlockedRoles: ['Engenheiro de Energia Solar', 'Engenheiro Civil de Obras', 'Engenheiro de Produção']
  },
  {
    id: 'enfermagem',
    name: 'Enfermagem & Saúde Coletiva',
    semesters: 8,
    monthlyTuition: 780,
    isPublic: false,
    minIntelecto: 38,
    intellectGainPerYear: 20,
    salaryBoost: 4200,
    category: 'Saúde',
    description: '4 anos em assistência de enfermagem, triagem em pronto-socorro, UTI e atenção primária.',
    unlockedRoles: ['Enfermeiro(a) Hospitalar', 'Coordenador de Enfermagem', 'Supervisor de Saúde']
  },
  {
    id: 'odontologia',
    name: 'Odontologia & Saúde Bucal',
    semesters: 8,
    monthlyTuition: 2200,
    isPublic: false,
    minIntelecto: 55,
    intellectGainPerYear: 25,
    salaryBoost: 8200,
    category: 'Saúde',
    description: '4 anos de procedimentos odontológicos, cirurgias de bucomaxilo, harmonização e clínica geral.',
    unlockedRoles: ['Cirurgião Dentista', 'Ortodontista', 'Perito Odontolegista']
  },
  {
    id: 'biomedicina',
    name: 'Biomedicina & Genômica',
    semesters: 8,
    monthlyTuition: 920,
    isPublic: false,
    minIntelecto: 48,
    intellectGainPerYear: 22,
    salaryBoost: 5200,
    category: 'Saúde',
    description: '4 anos em análises clínicas, biologia molecular, diagnóstico por imagem e pesquisas genéticas.',
    unlockedRoles: ['Biomédico Pesquisador', 'Analista de Genômica', 'Perito de Laboratório']
  },
  {
    id: 'administracao',
    name: 'Administração & Gestão de Empresas',
    semesters: 8,
    monthlyTuition: 720,
    isPublic: false,
    minIntelecto: 36,
    intellectGainPerYear: 18,
    salaryBoost: 4500,
    category: 'Humanas',
    description: '4 anos de gestão corporativa, finanças empresariais, marketing estratégico e liderança.',
    unlockedRoles: ['Gerente de Loja', 'Gerente de Logística', 'Consultor Empresarial']
  },
  {
    id: 'arquitetura',
    name: 'Arquitetura & Urbanismo',
    semesters: 8,
    monthlyTuition: 1150,
    isPublic: false,
    minIntelecto: 48,
    intellectGainPerYear: 22,
    salaryBoost: 6800,
    category: 'Exatas',
    description: '4 anos de projetos arquitetônicos, planejamento urbano, paisagismo e design de interiores.',
    unlockedRoles: ['Arquiteto Urbanista', 'Projetista de Interiores', 'Planejador Urbano']
  },
  {
    id: 'pedagogia',
    name: 'Pedagogia & Licenciatura',
    semesters: 8,
    monthlyTuition: 520,
    isPublic: false,
    minIntelecto: 32,
    intellectGainPerYear: 17,
    salaryBoost: 3400,
    category: 'Educação',
    description: '4 anos em teorias de aprendizagem, docência da educação infantil e gestão educacional.',
    unlockedRoles: ['Professor de Educação Infantil', 'Diretor de Escola', 'Coordenador Pedagógico']
  },
  {
    id: 'contabilidade',
    name: 'Ciências Contábeis & Auditoria',
    semesters: 8,
    monthlyTuition: 680,
    isPublic: false,
    minIntelecto: 40,
    intellectGainPerYear: 20,
    salaryBoost: 5000,
    category: 'Humanas',
    description: '4 anos em auditoria fiscal, balanços patrimoniais, perícia contábil e controladoria.',
    unlockedRoles: ['Contador Responsável', 'Auditor Fiscal', 'Perito Contábil']
  },
  {
    id: 'design_grafico',
    name: 'Design Gráfico & UI/UX',
    semesters: 8,
    monthlyTuition: 760,
    isPublic: false,
    minIntelecto: 38,
    intellectGainPerYear: 19,
    salaryBoost: 4800,
    category: 'Tecnologia',
    description: '4 anos de criação visual, produtos digitais, experiência do usuário e direção de arte.',
    unlockedRoles: ['UI/UX Designer', 'Diretor de Arte', 'Designer Gráfico Sênior']
  },
  {
    id: 'agronomia',
    name: 'Agronomia & Eng. Agrícola',
    semesters: 8,
    monthlyTuition: 1100,
    isPublic: false,
    minIntelecto: 45,
    intellectGainPerYear: 21,
    salaryBoost: 7200,
    category: 'Biológicas',
    description: '4 anos em produção agrícola de grande porte, solos, irrigação e gestão do agronegócio.',
    unlockedRoles: ['Engenheiro Agrônomo', 'Gerente de Safra', 'Consultor Agrícola']
  },
  {
    id: 'jornalismo',
    name: 'Jornalismo & Comunicação Social',
    semesters: 8,
    monthlyTuition: 790,
    isPublic: false,
    minIntelecto: 42,
    intellectGainPerYear: 19,
    salaryBoost: 4200,
    category: 'Humanas',
    description: '4 anos em imprensa, redação de reportagens, rádio, TV e jornalismo digital.',
    unlockedRoles: ['Jornalista de Notícias', 'Assessor de Imprensa', 'Âncora de Mídia']
  },
  {
    id: 'nutricao',
    name: 'Nutrição & Dietética',
    semesters: 8,
    monthlyTuition: 740,
    isPublic: false,
    minIntelecto: 40,
    intellectGainPerYear: 18,
    salaryBoost: 4100,
    category: 'Saúde',
    description: '4 anos em prescrição dietética, nutrição esportiva, clínica hospitalar e qualidade alimentar.',
    unlockedRoles: ['Nutricionista Clínico', 'Consultor de Nutrição Esportiva']
  },
  {
    id: 'fisioterapia',
    name: 'Fisioterapia & Reabilitação',
    semesters: 8,
    monthlyTuition: 830,
    isPublic: false,
    minIntelecto: 42,
    intellectGainPerYear: 19,
    salaryBoost: 4400,
    category: 'Saúde',
    description: '4 anos em reabilitação motora, ortopedia, fisioterapia respiratória de UTI e esportiva.',
    unlockedRoles: ['Fisioterapeuta Hospitalar', 'Fisioterapeuta Esportivo']
  }
];

export function getRequiredMajorForJob(job: JobListing | ConcursoListing | { title: string; minEducation?: string; minEducationRequired?: string }): string | null {
  // If explicitly defined on the listing
  if ('requiredMajor' in job && job.requiredMajor) {
    return job.requiredMajor;
  }

  const title = job.title.toLowerCase();
  
  if (title.includes('médic') || title.includes('clinico geral') || title.includes('cirurgião') || title.includes('medico legista')) {
    if (!title.includes('veterin')) {
      return 'Medicina';
    }
  }
  if (title.includes('engenheir') || title.includes('engenharia')) {
    if (title.includes('agrônomo') || title.includes('agricola') || title.includes('agronomia')) return 'Agronomia';
    return 'Engenharia';
  }
  if (title.includes('agrônomo') || title.includes('agronomia')) {
    return 'Agronomia';
  }
  if (title.includes('veterinár') || title.includes('veterinario')) {
    return 'Veterinária';
  }
  if (title.includes('advogad') || title.includes('jurídic') || title.includes('juiz') || title.includes('delegad') || title.includes('promotor')) {
    return 'Direito';
  }
  if (title.includes('farmacêut') || title.includes('farmaceutico') || title.includes('farma')) {
    return 'Farmácia';
  }
  if (title.includes('psicólog') || title.includes('psicologo') || title.includes('terapeuta')) {
    return 'Psicologia';
  }
  if (title.includes('psicopedagog')) {
    return 'Psicopedagogia';
  }
  if (title.includes('dentista') || title.includes('odontolog')) {
    return 'Odontologia';
  }
  if (title.includes('enfermeir')) {
    return 'Enfermagem';
  }
  if (title.includes('biomédic') || title.includes('biomedico')) {
    return 'Biomedicina';
  }
  if (title.includes('contador') || title.includes('contábil') || title.includes('auditor')) {
    return 'Ciências Contábeis';
  }
  if (title.includes('arquiteto') || title.includes('arquitetura')) {
    return 'Arquitetura';
  }
  if (title.includes('desenvolvedor') || title.includes('software') || title.includes('pentester') || title.includes('tech lead')) {
    const minEdu = ('minEducation' in job ? job.minEducation : '') || ('minEducationRequired' in job ? job.minEducationRequired : '');
    if (minEdu && (minEdu.includes('Graduação') || minEdu.includes('Superior') || minEdu.includes('Pós'))) {
      return 'Computação';
    }
  }
  return null;
}

export function checkPlayerHasRequiredMajor(
  requiredMajor: string,
  career: Career,
  educationSystem?: EducationSystemState
): { hasDegree: boolean; reason?: string } {
  const gradCourses = educationSystem?.graduatedCourses || [];
  const careerMajor = career.collegeStatus === 'formado' ? (career.collegeMajor || '') : '';
  const educationLevel = career.educationLevel || '';

  const allQualifications = [
    ...gradCourses,
    careerMajor,
    educationLevel
  ].map((s) => s.toLowerCase());

  const isFormed =
    (educationSystem?.graduatedCourses && educationSystem.graduatedCourses.length > 0) ||
    career.collegeStatus === 'formado' ||
    educationLevel.toLowerCase().includes('graduado');

  if (!isFormed) {
    return {
      hasDegree: false,
      reason: `Você ainda não possui diploma universitário! É obrigatório ter se formado em ${requiredMajor}.`
    };
  }

  const req = requiredMajor.toLowerCase();
  let matches = false;

  if (req === 'medicina') {
    matches = allQualifications.some((q) => q.includes('medicina') && !q.includes('veterin'));
  } else if (req === 'engenharia') {
    matches = allQualifications.some((q) => q.includes('engenharia'));
  } else if (req === 'direito') {
    matches = allQualifications.some((q) => q.includes('direito') || q.includes('jurídic'));
  } else if (req === 'veterinária' || req === 'veterinaria') {
    matches = allQualifications.some((q) => q.includes('veterinár') || q.includes('veterinario'));
  } else if (req === 'farmácia' || req === 'farmacia') {
    matches = allQualifications.some((q) => q.includes('farmác') || q.includes('farmac') || q.includes('bioquímic'));
  } else if (req === 'psicologia') {
    matches = allQualifications.some((q) => q.includes('psicolog'));
  } else if (req === 'psicopedagogia') {
    matches = allQualifications.some((q) => q.includes('psicopedagog') || q.includes('psicolog'));
  } else if (req === 'enfermagem') {
    matches = allQualifications.some((q) => q.includes('enferma'));
  } else if (req === 'odontologia') {
    matches = allQualifications.some((q) => q.includes('odontolog') || q.includes('dentista'));
  } else if (req === 'biomedicina') {
    matches = allQualifications.some((q) => q.includes('biomedic'));
  } else if (req === 'arquitetura') {
    matches = allQualifications.some((q) => q.includes('arquitet'));
  } else if (req === 'agronomia') {
    matches = allQualifications.some((q) => q.includes('agronom') || q.includes('agrícol'));
  } else if (req === 'ciências contábeis' || req === 'contabilidade') {
    matches = allQualifications.some((q) => q.includes('contábi') || q.includes('contabilid'));
  } else if (req === 'administração' || req === 'administracao') {
    matches = allQualifications.some((q) => q.includes('administra') || q.includes('gestão'));
  } else if (req === 'pedagogia') {
    matches = allQualifications.some((q) => q.includes('pedagog'));
  } else if (req === 'jornalismo') {
    matches = allQualifications.some((q) => q.includes('jornalis') || q.includes('comunicação'));
  } else if (req === 'design') {
    matches = allQualifications.some((q) => q.includes('design'));
  } else if (req === 'computação' || req === 'computacao') {
    matches = allQualifications.some((q) =>
      q.includes('comput') || q.includes('ads') || q.includes('tecnolog') || q.includes('software') || q.includes('sistemas')
    );
  } else {
    matches = allQualifications.some((q) => q.includes(req));
  }

  if (!matches) {
    return {
      hasDegree: false,
      reason: `Você possui graduação em outra área, mas esta vaga exige rigorosamente diploma em ${requiredMajor}!`
    };
  }

  return { hasDegree: true };
}
