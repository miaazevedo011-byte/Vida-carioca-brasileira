export interface ExamQuestion {
  id: string;
  category: 'portugues' | 'matematica' | 'conhecimentos_gerais' | 'legislacao_etica' | 'saude' | 'direito' | 'veterinaria' | 'farmacia' | 'psicologia' | 'psicopedagogia' | 'tecnologia' | 'engenharia' | 'concurso';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const EXAM_QUESTIONS_POOL: ExamQuestion[] = [
  // Português & Interpretação
  {
    id: 'port_1',
    category: 'portugues',
    question: 'Assinale a alternativa em que todas as palavras estão grafadas corretamente segundo o Acordo Ortográfico:',
    options: [
      'Autoescola, micro-ondas, ideia, paraquedas',
      'Auto-escola, microondas, idéia, pára-quedas',
      'Auto escola, micro-ondas, ideia, para-quedas',
      'Autoescola, microondas, idéia, paraquedas'
    ],
    correctIndex: 0,
    explanation: '"Autoescola" junta sem hífen (vogais diferentes), "micro-ondas" tem hífen (vogais iguais), "ideia" perdeu acento e "paraquedas" é aglutinado.'
  },
  {
    id: 'port_2',
    category: 'portugues',
    question: 'Na frase "Os alunos assistiram _____ palestra de abertura", a regência correta do verbo assistir (no sentido de presenciar) exige:',
    options: [
      'à (com crase)',
      'a (sem crase)',
      'na',
      'de'
    ],
    correctIndex: 0,
    explanation: 'O verbo assistir no sentido de ver/presenciar é transitivo indireto e rege a preposição "a", que se funde com o artigo feminino "a" -> "à".'
  },
  {
    id: 'port_3',
    category: 'portugues',
    question: 'Qual das opções apresenta a concordância nominal correta?',
    options: [
      'As candidatas estavam meio nervosas antes da prova.',
      'As candidatas estavam meias nervosas antes da prova.',
      'É proibido a entrada de pessoas sem identificação.',
      'Segue anexo as cópias dos documentos.'
    ],
    correctIndex: 0,
    explanation: '"Meio" com sentido de "um pouco" é advérbio e permanece invariável: "meio nervosas".'
  },
  {
    id: 'port_4',
    category: 'portugues',
    question: 'Identifique a frase com pontuação correta:',
    options: [
      'O Brasil, que é o maior país da América do Sul, possui rica biodiversidade.',
      'O Brasil que é, o maior país da América do Sul possui rica biodiversidade.',
      'O Brasil, possui rica biodiversidade em toda sua extensão.',
      'O Brasil que é o maior país, da América do Sul possui rica biodiversidade.'
    ],
    correctIndex: 0,
    explanation: 'A oração subordinada adjetiva explicativa deve ficar isolada entre vírgulas.'
  },

  // Matemática & Raciocínio Lógico
  {
    id: 'mat_1',
    category: 'matematica',
    question: 'Se um produto com preço original de R$ 200,00 tem um desconto de 15% e depois um acréscimo de 10%, qual seu valor final?',
    options: [
      'R$ 187,00',
      'R$ 190,00',
      'R$ 185,00',
      'R$ 195,00'
    ],
    correctIndex: 0,
    explanation: '200 - 15% (30) = 170. Depois, 170 + 10% (17) = R$ 187,00.'
  },
  {
    id: 'mat_2',
    category: 'matematica',
    question: 'Três máquinas produzem 600 peças em 4 horas. Quantas peças 5 máquinas iguais produzirão em 6 horas?',
    options: [
      '1.500 peças',
      '1.200 peças',
      '1.800 peças',
      '1.000 peças'
    ],
    correctIndex: 0,
    explanation: '1 máquina produz 50 peças/hora. Logo, 5 máquinas em 6 horas: 5 * 6 * 50 = 1.500 peças.'
  },
  {
    id: 'mat_3',
    category: 'matematica',
    question: 'Em uma sequência lógica: 2, 6, 12, 20, 30, ... qual é o próximo número?',
    options: [
      '42',
      '40',
      '36',
      '48'
    ],
    correctIndex: 0,
    explanation: 'As diferenças aumentam de 2 em 2 (+4, +6, +8, +10, +12). 30 + 12 = 42.'
  },

  // Conhecimentos Gerais & Atualidades
  {
    id: 'gerais_1',
    category: 'conhecimentos_gerais',
    question: 'A Constituição da República Federativa do Brasil vigente foi promulgada em qual ano histórico?',
    options: [
      '1988 (Constituição Cidadã)',
      '1964',
      '1934',
      '1992'
    ],
    correctIndex: 0,
    explanation: 'A atual Constituição Federal do Brasil foi promulgada em 5 de outubro de 1988 por Ulysses Guimarães.'
  },
  {
    id: 'gerais_2',
    category: 'conhecimentos_gerais',
    question: 'Qual é o maior bioma exclusivamente brasileiro, caracterizado por sua vegetação semiárida adaptada à seca?',
    options: [
      'Caatinga',
      'Cerrado',
      'Pantanal',
      'Mata Atlântica'
    ],
    correctIndex: 0,
    explanation: 'A Caatinga é o único bioma cujo patrimônio biológico é 100% exclusivo do território brasileiro.'
  },
  {
    id: 'gerais_3',
    category: 'conhecimentos_gerais',
    question: 'No sistema financeiro brasileiro, a taxa básica de juros da economia determinada pelo Copom é denominada:',
    options: [
      'Taxa Selic',
      'Taxa CDI',
      'Taxa TJLP',
      'Taxa IPCA'
    ],
    correctIndex: 0,
    explanation: 'A taxa Selic (Sistema Especial de Liquidação e Custódia) é a taxa básica de juros definida pelo Copom.'
  },

  // Legislação, Ética & Concursos Públicos
  {
    id: 'leg_1',
    category: 'legislacao_etica',
    question: 'De acordo com o artigo 37 da Constituição Federal, quais são os princípios fundamentais da Administração Pública (LIMPE)?',
    options: [
      'Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência',
      'Liberdade, Igualdade, Moralidade, Pessoalidade e Eficácia',
      'Legalidade, Interesse Público, Motivação, Probidade e Equidade',
      'Legitimidade, Impessoalidade, Mérito, Publicidade e Economia'
    ],
    correctIndex: 0,
    explanation: 'O mnemônico clássico LIMPE representa: Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência.'
  },
  {
    id: 'leg_2',
    category: 'legislacao_etica',
    question: 'Em Direito Administrativo, o ato de servidor público favorecer um parente direto em nomeação pública configura:',
    options: [
      'Nepotismo (vedado pela Súmula Vinculante nº 13 do STF)',
      'Prevaricação exclusivamente',
      'Ato lícito discricionário',
      'Prescrição administrativa'
    ],
    correctIndex: 0,
    explanation: 'A Súmula Vinculante 13 do STF veda o nepotismo na Administração Pública direta e indireta.'
  },

  // Específicas de Saúde & Medicina
  {
    id: 'med_1',
    category: 'saude',
    question: 'No atendimento de emergência segundo o suporte básico de vida, qual a frequência recomendada de compressões torácicas na RCP?',
    options: [
      '100 a 120 compressões por minuto',
      '60 a 80 compressões por minuto',
      '140 a 160 compressões por minuto',
      '50 compressões a cada 2 minutos'
    ],
    correctIndex: 0,
    explanation: 'As diretrizes da American Heart Association recomendam de 100 a 120 compressões por minuto a uma profundidade de 5 a 6 cm.'
  },
  {
    id: 'med_2',
    category: 'saude',
    question: 'O Sistema Único de Saúde (SUS) do Brasil tem como princípios doutrinários:',
    options: [
      'Universalidade, Integralidade e Equidade',
      'Centralização, Lucratividade e Seletividade',
      'Privatização, Descentralização e Coparticipação',
      'Exclusividade, Gratuidade Parcial e Segmentação'
    ],
    correctIndex: 0,
    explanation: 'Os três princípios doutrinários basilares do SUS são: Universalidade, Integralidade e Equidade.'
  },

  // Específicas de Direito
  {
    id: 'dir_1',
    category: 'direito',
    question: 'No Direito Processual Penal, o princípio da presunção de inocência estabelece que:',
    options: [
      'Ninguém será considerado culpado até o trânsito em julgado de sentença penal condenatória.',
      'O réu deve comprovar sua inocência perante o Ministério Público.',
      'A prisão em flagrante equivale à culpa presumida.',
      'A denúncia criminal anula os direitos civis do investigado.'
    ],
    correctIndex: 0,
    explanation: 'Art. 5º, LVII da CF/88: ninguém será considerado culpado até o trânsito em julgado da sentença condenatória.'
  },
  {
    id: 'dir_2',
    category: 'direito',
    question: 'Qual remédio constitucional é cabível para garantir o direito de locomoção contra ilegalidade ou abuso de poder?',
    options: [
      'Habeas Corpus',
      'Mandado de Segurança',
      'Habeas Data',
      'Ação Popular'
    ],
    correctIndex: 0,
    explanation: 'O Habeas Corpus protege a liberdade de locomoção quando ameaçada por ilegalidade ou abuso de poder.'
  },

  // Específicas de Medicina Veterinária
  {
    id: 'vet_1',
    category: 'veterinaria',
    question: 'A vacina antirrábica em cães e gatos é obrigatória por se tratar de uma:',
    options: [
      'Zoonose viral letal transmissível aos seres humanos',
      'Doença bacteriana intestinal não transmissível',
      'Condição genética hereditária',
      'Doença fúngica tratável apenas com vermífugos'
    ],
    correctIndex: 0,
    explanation: 'A raiva é uma grave zoonose viral com letalidade de quase 100% que pode ser transmitida aos humanos por mordeduras.'
  },
  {
    id: 'vet_2',
    category: 'veterinaria',
    question: 'Na nutrição de ruminantes (bovinos), qual compartimento estomacal é o principal responsável pela fermentação microbiana das fibras?',
    options: [
      'Rúmen',
      'Retículo',
      'Omaso',
      'Abomaso'
    ],
    correctIndex: 0,
    explanation: 'O rúmen abriga bilhões de microrganismos que fermentam celulose e amido em ácidos graxos voláteis.'
  },

  // Específicas de Farmácia
  {
    id: 'farm_1',
    category: 'farmacia',
    question: 'Medicamentos que apresentam uma tarja vermelha na embalagem indicam:',
    options: [
      'Venda sob prescrição médica (receituário)',
      'Venda livre sem nenhuma restrição ou indicação',
      'Produtos de uso hospitalar restrito e exclusivo',
      'Substâncias cosméticas não farmacêuticas'
    ],
    correctIndex: 0,
    explanation: 'Medicamentos de tarja vermelha necessitam de receita médica por apresentarem riscos de efeitos adversos.'
  },
  {
    id: 'farm_2',
    category: 'farmacia',
    question: 'Qual é o ramo da farmacologia que estuda o caminho do fármaco no organismo (absorção, distribuição, metabolismo e excreção)?',
    options: [
      'Farmacocinética',
      'Farmacodinâmica',
      'Farmacognosia',
      'Toxicologia Forense'
    ],
    correctIndex: 0,
    explanation: 'A farmacocinética estuda o movimento do fármaco no corpo: absorção, distribuição, biotransformação e excreção (ADME).'
  },

  // Específicas de Psicologia
  {
    id: 'psi_1',
    category: 'psicologia',
    question: 'Na teoria psicanalítica fundada por Sigmund Freud, as três instâncias do aparelho psíquico são:',
    options: [
      'Id, Ego e Superego',
      'Consciente, Inconsciente e Subconsciente apenas',
      'Condicionamento, Estímulo e Resposta',
      'Arquétipo, Persona e Sombra'
    ],
    correctIndex: 0,
    explanation: 'Freud estruturou a segunda tópica do aparelho psíquico em Id (pulsões), Ego (realidade) e Superego (moral e ideais).'
  },
  {
    id: 'psi_2',
    category: 'psicologia',
    question: 'A Terapia Cognitivo-Comportamental (TCC), desenvolvida por Aaron Beck, baseia-se na premissa de que:',
    options: [
      'Nossos pensamentos influenciam nossas emoções e comportamentos.',
      'O comportamento humano é 100% determinado por traumas pré-natais.',
      'O ambiente físico não tem relação com sintomas depressivos.',
      'Os transtornos mentais não respondem a técnicas de reestruturação cognitiva.'
    ],
    correctIndex: 0,
    explanation: 'A TCC demonstra que a forma como interpretamos situações (pensamentos automáticos) dita nossas reações emocionais.'
  },

  // Específicas de Psicopedagogia
  {
    id: 'psicoped_1',
    category: 'psicopedagogia',
    question: 'Qual é o foco primordial da intervenção psicopedagógica nas escolas e clínicas?',
    options: [
      'Investigar e intervir nos processos de aprendizagem e suas dificuldades cognitivo-afetivas.',
      'Aplicar testes médicos para prescrever medicamentos psiquiátricos.',
      'Disciplinar alunos punitivamente em sala de aula.',
      'Substituir o professor em todas as matérias curriculares.'
    ],
    correctIndex: 0,
    explanation: 'A psicopedagogia estuda como o ser humano aprende, diagnosticando e tratando barreiras cognitivas, emocionais e sociais.'
  },
  {
    id: 'psicoped_2',
    category: 'psicopedagogia',
    question: 'Segundo a teoria piagetiana do desenvolvimento cognitivo, a criança atinge o pensamento abstrato e dedutivo no estágio:',
    options: [
      'Operatório Formal (a partir dos 11-12 anos)',
      'Sensório-motor (0 a 2 anos)',
      'Pré-operatório (2 a 7 anos)',
      'Operatório Concreto (7 a 11 anos)'
    ],
    correctIndex: 0,
    explanation: 'No estágio das operações formais o adolescente passa a formular hipóteses lógicas e abstrações teóricas.'
  },
  // Engenharia & Projetos
  {
    id: 'eng_1',
    category: 'engenharia',
    question: 'No dimensionamento estrutural de concreto armado, o elemento linear submetido preponderantemente à flexão simples é denominado:',
    options: [
      'Viga',
      'Pilar',
      'Sapata',
      'Tirante'
    ],
    correctIndex: 0,
    explanation: 'As vigas são elementos estruturais lineares cuja função primária é resistir a esforços de flexão e cisalhamento.'
  },
  {
    id: 'eng_2',
    category: 'engenharia',
    question: 'No sistema de energia solar fotovoltaica, qual componente é responsável por converter corrente contínua (CC) em corrente alternada (CA)?',
    options: [
      'Inversor de frequência / Inversor solar',
      'Módulo fotovoltaico',
      'Transformador a óleo',
      'Disjuntor termomagnético'
    ],
    correctIndex: 0,
    explanation: 'O inversor solar converte a energia gerada em corrente contínua pelos painéis para corrente alternada utilizada nas residências e na rede elétrica.'
  },
  {
    id: 'eng_3',
    category: 'engenharia',
    question: 'No Brasil, a Anotação de Responsabilidade Técnica (ART) para projetos e obras é emitido perante qual conselho profissional?',
    options: [
      'CREA / Sistema CONFEA',
      'CAU',
      'CRM',
      'OAB'
    ],
    correctIndex: 0,
    explanation: 'A ART é o instrumento legal que define o responsável técnico de engenharia registrado perante o CREA/CONFEA.'
  }
];

export const getRandomExamQuestions = (count = 5, preferredCategory?: string): ExamQuestion[] => {
  let pool = [...EXAM_QUESTIONS_POOL];
  if (preferredCategory) {
    const matched = pool.filter(q => q.category === preferredCategory);
    if (matched.length >= 2) {
      // Pick some matched and some general
      const others = pool.filter(q => q.category !== preferredCategory);
      pool = [...matched.sort(() => 0.5 - Math.random()), ...others.sort(() => 0.5 - Math.random())];
    }
  } else {
    pool.sort(() => 0.5 - Math.random());
  }

  // Shuffle and slice
  const selected = pool.slice(0, count);
  // Ensure we have exactly count items (fallback to first ones if needed)
  if (selected.length < count) {
    return EXAM_QUESTIONS_POOL.slice(0, count);
  }
  return selected;
};
