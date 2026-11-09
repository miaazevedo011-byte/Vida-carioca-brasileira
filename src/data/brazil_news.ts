export interface BrazilNews {
  id: string;
  year: number;
  category: 'politica' | 'economia' | 'social' | 'cultura' | 'tecnologia';
  headline: string;
  source: string;
  summary: string;
  happinessDelta: number;
  serasaDelta: number;
  economicContext?: string;
  icon: string;
}

export const BRAZIL_NEWS_DATABASE: Omit<BrazilNews, 'id' | 'year'>[] = [
  // Política
  {
    category: 'politica',
    headline: 'Congresso aprova Reforma Tributária que simplifica impostos e impulsiona o consumo',
    source: 'G1 Notícias • Brasília',
    summary: 'A nova legislação unifica tributos sobre consumo, trazendo otimismo para pequenas e médias empresas e estimulando o crédito nacional.',
    happinessDelta: 8,
    serasaDelta: 25,
    economicContext: 'Queda prevista no custo de vida a médio prazo.',
    icon: '🏛️'
  },
  {
    category: 'politica',
    headline: 'Governo lança novo programa de moradia popular com taxas de juros reduzidas na Caixa',
    source: 'Folha de S.Paulo • Política',
    summary: 'Linhas de crédito facilitadas ampliam o sonho da casa própria para milhões de famílias de baixa e média renda.',
    happinessDelta: 10,
    serasaDelta: 20,
    economicContext: 'Subsídios habitacionais aumentados em até 30%.',
    icon: '🏠'
  },
  {
    category: 'politica',
    headline: 'Disputa acirrada nas eleições municipais movimenta capitais e divide opiniões nas redes',
    source: 'O Globo • Brasil',
    summary: 'Debates calorosos e propostas para transporte público e segurança mobilizam eleitores de todas as gerações.',
    happinessDelta: -3,
    serasaDelta: 0,
    economicContext: 'Incerteza eleitoral gera oscilações pontuais no mercado.',
    icon: '🗳️'
  },
  {
    category: 'politica',
    headline: 'Polícia Federal desarticula megaprocesso de desvio de verbas em contratos públicos',
    source: 'Metrópoles • Política',
    summary: 'Operação anticorrupção recupera mais de R$ 500 milhões para os cofres públicos e reforça a transparência governamental.',
    happinessDelta: 6,
    serasaDelta: 15,
    economicContext: 'Combate à corrupção eleva confiança de investidores internacionais.',
    icon: '⚖️'
  },

  // Economia
  {
    category: 'economia',
    headline: 'Banco Central reduz Taxa Selic; crédito imobiliário e financiamento de veículos ficam mais baratos',
    source: 'Valor Econômico • Mercados',
    summary: 'Com a queda da taxa básica de juros, bancos privados anunciam corte no spread bancário e facilitam empréstimos.',
    happinessDelta: 9,
    serasaDelta: 30,
    economicContext: 'Selic em trajetória de queda estimula investimento produtivo.',
    icon: '📉'
  },
  {
    category: 'economia',
    headline: 'Safra recorde de soja, milho e café faz PIB brasileiro superar expectativas mundiais',
    source: 'Canal Rural • Agronegócio',
    summary: 'O agronegócio nacional registra produtividade histórica nos campos do Centro-Oeste e Sul, batendo recorde de exportações.',
    happinessDelta: 7,
    serasaDelta: 20,
    economicContext: 'Superávit comercial histórico de US$ 80 bilhões.',
    icon: '🌾'
  },
  {
    category: 'economia',
    headline: 'Inflação oficial (IPCA) surpreende e fecha o ano dentro da meta estipulada',
    source: 'Exame • Finanças',
    summary: 'Alívio nos preços de alimentos essenciais e energia elétrica melhora o poder de compra da população.',
    happinessDelta: 8,
    serasaDelta: 15,
    economicContext: 'Cesta básica com estabilidade de preços.',
    icon: '🛒'
  },
  {
    category: 'economia',
    headline: 'Dólar registra forte volatilidade devido a tensões geopolíticas no exterior',
    source: 'InfoMoney • Câmbio',
    summary: 'A alta da moeda americana encarece eletrônicos importados e passagens aéreas internacionais.',
    happinessDelta: -5,
    serasaDelta: -10,
    economicContext: 'Bens de tecnologia e viagens para o exterior mais custosos.',
    icon: '💵'
  },
  {
    category: 'economia',
    headline: 'Serasa realiza megafeirão com até 90% de desconto para renegociação de dívidas no país',
    source: 'UOL Economia • Finanças Pessoais',
    summary: 'Milhões de brasileiros conseguem limpar o nome e recuperar poder de compra através do mutirão nacional.',
    happinessDelta: 12,
    serasaDelta: 40,
    economicContext: 'Crédito ao consumidor restabelecido.',
    icon: '💳'
  },

  // Social
  {
    category: 'social',
    headline: 'Campanha Nacional de Vacinação do SUS atinge 95% de cobertura e erradica surtos',
    source: 'Ministério da Saúde • Notícias',
    summary: 'A mobilização nacional nos postinhos de saúde recebe elogios da OMS pela eficiência do sistema público.',
    happinessDelta: 10,
    serasaDelta: 0,
    economicContext: 'Fortalecimento da rede básica de saúde.',
    icon: '💉'
  },
  {
    category: 'social',
    headline: 'Brasil bate recorde histórico de formalização de empregos com carteira assinada (CLT)',
    source: 'Agência Brasil • Trabalho',
    summary: 'Criação de novos postos nos setores de serviços, tecnologia e construção civil reduz taxa de desemprego.',
    happinessDelta: 11,
    serasaDelta: 25,
    economicContext: 'Mercado de trabalho aquecido para jovens e adultos.',
    icon: '💼'
  },
  {
    category: 'social',
    headline: 'Onda de calor atípica atinge várias regiões do Brasil; consumo de energia dispara',
    source: 'Climatempo • Brasil',
    summary: 'Termômetros passam dos 40°C nas capitais, lotando praias e aumentando a procura por ar-condicionado e sorvetes.',
    happinessDelta: -4,
    serasaDelta: -5,
    economicContext: 'Conta de luz pode sofrer bandeira tarifária amarela.',
    icon: '☀️'
  },
  {
    category: 'social',
    headline: 'Festival de Música e Cultura no Brasil atrai mais de 700 mil pessoas e gera euforia',
    source: 'Multishow • Entretenimento',
    summary: 'Grandes shows nacionais e internacionais transformam o final de semana em celebração inesquecível para a juventude.',
    happinessDelta: 14,
    serasaDelta: 0,
    economicContext: 'Comércio de lazer e hotelaria 100% ocupados.',
    icon: '🎸'
  },

  // Cultura & Esporte
  {
    category: 'cultura',
    headline: 'Brasil conquista título emocionante no futebol e torcida faz carnaval nas ruas',
    source: 'Globo Esporte • Futebol',
    summary: 'Comemoração histórica com bandeiras nas janelas, churrasco com amigos e fogos de artifício em todo o país!',
    happinessDelta: 15,
    serasaDelta: 0,
    economicContext: 'Venda de camisas e artigos esportivos em alta.',
    icon: '⚽'
  },
  {
    category: 'cultura',
    headline: 'Cinema brasileiro ganha premiação máxima em festival internacional de prestígio',
    source: 'AdoroCinema • Cultura',
    summary: 'Produção independente filmada no Nordeste emociona júri mundial e coloca a arte brasileira em destaque global.',
    happinessDelta: 8,
    serasaDelta: 5,
    economicContext: 'Indústria audiovisual brasileira valorizada.',
    icon: '🎬'
  },

  // Tecnologia
  {
    category: 'tecnologia',
    headline: 'Pix bate recorde com mais de 200 milhões de transações em um único dia útil',
    source: 'TecMundo • FinTech',
    summary: 'Sistema de pagamentos instantâneos do Brasil consolida-se como referência tecnológica internacional de inclusão financeira.',
    happinessDelta: 6,
    serasaDelta: 15,
    economicContext: 'Facilidade nas compras e transações diárias.',
    icon: '⚡'
  },
  {
    category: 'tecnologia',
    headline: 'Expansão da rede 5G chega a 100% das cidades brasileiras com ultravelocidade',
    source: 'Olhar Digital • Inovação',
    summary: 'Trabalho remoto, telemedicina e games online ganham salto de velocidade e estabilidade em todo o território nacional.',
    happinessDelta: 7,
    serasaDelta: 10,
    economicContext: 'Ecossistema de tecnologia e startups fortalecido.',
    icon: '📡'
  }
];

export function getRandomBrazilNews(year: number): BrazilNews {
  const index = Math.floor(Math.random() * BRAZIL_NEWS_DATABASE.length);
  const template = BRAZIL_NEWS_DATABASE[index];
  return {
    ...template,
    id: `news_${year}_${Date.now()}`,
    year
  };
}
