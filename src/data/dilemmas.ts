import { Dilemma, GameState } from '../types/game';

export const BRAZILIAN_DILEMMAS: Dilemma[] = [
  {
    id: 'doacao_orgaos_reflexao',
    title: 'Campanha Nacional de Doação de Órgãos & Gesto de Vida 🫀',
    context: 'Ao renovar seus documentos ou refletir sobre o futuro, surge a oportunidade de se declarar oficialmente como Doador de Órgãos na carteira de identidade e avisar sua família.',
    badge: 'DILEMA CULTURAL & ÉTICO',
    minAge: 18,
    choices: [
      {
        id: 'c_doador_sim',
        text: 'Declara-se doador de órgãos com orgulho e conversa abertamente com a família 🫀✨',
        preview: { felicidade: 15, serasa: 30 },
        outcomeNarrative: 'Uma decisão madura e generosa! Sua família respeitou sua escolha consciente de salvar vidas no futuro. Seu gesto humanitário foi registrado e elevou seu conceito cívico (+30 Serasa Score, +15 Felicidade).',
        consequences: { felicidade: 15, serasa: 30 }
      },
      {
        id: 'c_doador_nao',
        text: 'Prefere não se declarar doador no momento por motivos pessoais',
        preview: { felicidade: 0 },
        outcomeNarrative: 'Você optou por manter suas convicções sem alterar seu registro oficial.',
        consequences: { felicidade: 0 }
      }
    ]
  },
  {
    id: 'caso_extraconjugal_descoberto',
    title: 'Descoberta do Caso Extraconjugal & Confronto do Par 💔',
    context: 'Seu par oficial encontrou notificações sigilosas e fotos no seu celular da sua amante! A discussão na sala de estar é tensa, com lágrimas e malas prontas.',
    badge: 'CONFLITO AMOROSO 💔',
    minAge: 18,
    condition: (state: GameState) => 
      state.relationship.hasLover === true && 
      (state.relationship.status === 'namorando' || state.relationship.status === 'casado'),
    choices: [
      {
        id: 'c_caso_perdao',
        text: 'Pedir perdão de joelhos, romper com a amante e prometer fidelidade absoluta',
        preview: { felicidade: -20, saude: -5 },
        outcomeNarrative: 'Seu par aceitou dar uma última chance, mas a confiança foi abalada (-20 Felicidade, relacionamento sob ultimato).',
        consequences: { felicidade: -20, saude: -5 }
      },
      {
        id: 'c_caso_divorcio',
        text: 'Assumir o término/divórcio e assumir publicamente o relacionamento com a amante',
        preview: { felicidade: 10, grana: -2000 },
        outcomeNarrative: 'O casamento chegou ao fim com divórcio e partilha de bens. Agora você assumiu abertamente sua antiga amante como parceira oficial.',
        consequences: { felicidade: 10, grana: -2000 }
      },
      {
        id: 'c_caso_negar',
        text: 'Negar veementemente e alegar que eram apenas conversas profissionais mal interpretadas',
        preview: { felicidade: -10 },
        outcomeNarrative: 'A poeira baixou temporariamente, mas a desconfiança paira no ar.',
        consequences: { felicidade: -10 }
      }
    ]
  },
  {
    id: 'gravidez_extraconjugal_amante',
    title: 'Gravidez Extraconjugal: O Teste da Amante Deu Positivo 👶🍼',
    context: 'Sua amante liga chorando e chocada: o exame de sangue deu positivo! Você será pai de um filho extraconjugal.',
    badge: 'GRAVIDEZ EXTRACONJUGAL 👶',
    minAge: 18,
    condition: (state: GameState) => state.relationship.hasLover === true,
    choices: [
      {
        id: 'c_gravidez_assumir',
        text: 'Assumir a paternidade do bebê, registrar no cartório e arcar com a pensão alimentícia',
        preview: { felicidade: 10, grana: -450 },
        outcomeNarrative: 'Você assumiu a criança com responsabilidade! O filho extraconjugal foi registrado com seu sobrenome e pensão fixada.',
        consequences: { felicidade: 10, grana: -450 }
      },
      {
        id: 'c_gravidez_segredo',
        text: 'Arcar com todo o pré-natal e custos do bebê em absoluto segredo da família oficial',
        preview: { grana: -800, felicidade: -10 },
        outcomeNarrative: 'Você deu todo o suporte financeiro à mãe do bebê, mantendo o segredo sob grande pressão emocional.',
        consequences: { grana: -800, felicidade: -10 }
      }
    ]
  },
  {
    id: 'assembleia_condominio_sindico',
    title: 'Assembleia de Condomínio: Votação do Síndico & Taxa Extra 🏢',
    context: 'A convocação da assembleia ordinária chegou debaixo da sua porta. O síndico quer aprovar uma taxa extra de R$ 350 para pintar a fachada e trocar os elevadores. Dona Cláudia do 402 reclama que é absurdo e quer impeachment.',
    badge: 'ASSEMBLEIA DE CONDOMÍNIO 🏢',
    minAge: 18,
    condition: (state: GameState) => 
      state.housing.name.toLowerCase().includes('apê') || 
      state.housing.name.toLowerCase().includes('apartamento') || 
      state.housing.name.toLowerCase().includes('studio') ||
      state.housing.id.includes('ape'),
    choices: [
      {
        id: 'c_condo_favor',
        text: 'Votar A FAVOR da taxa extra para valorizar a fachada e os elevadores',
        preview: { felicidade: 10, grana: -350 },
        outcomeNarrative: 'A aprovação passou por 3 votos! A fachada ficou linda, valorizando seu imóvel, porém o boleto da taxa extra cobrou R$ 350.',
        consequences: { felicidade: 10, grana: -350 }
      },
      {
        id: 'c_condo_contra',
        text: 'Votar CONTRA a taxa extra e criar barraco na reunião ao lado de Dona Cláudia',
        preview: { felicidade: -5, grana: 0 },
        outcomeNarrative: 'A reunião virou uma gritaria! A taxa extra foi derrubada e você economizou o dinheiro, mas o clima no elevador ficou péssimo.',
        consequences: { felicidade: -5, grana: 0 }
      },
      {
        id: 'c_condo_sindico',
        text: 'Candidatar-se a Síndico do prédio para assumir a gestão',
        preview: { grana: 500, intelecto: 15, felicidade: -10 },
        outcomeNarrative: 'Você foi eleito Síndico do condomínio! Ganhou R$ 500 de isenção na taxa de condomínio, mas agora seu WhatsApp não pára de tocar com reclamações de vizinhos!',
        consequences: { grana: 500, intelecto: 15, felicidade: -10 }
      }
    ]
  },
  {
    id: 'assembleia_condominio_barulho',
    title: 'Assembleia de Emergência: Som Alto no 301 & Regras de Convivência 🔊',
    context: 'O vizinho do 301 insiste em tocar sertanejo no som alto até às 2h da manhã de domingo. Na reunião do condomínio, ele alega que estava comemorando e se recusa a pagar a multa aplicada.',
    badge: 'ASSEMBLEIA DE CONDOMÍNIO 🏢',
    minAge: 18,
    condition: (state: GameState) => 
      state.housing.name.toLowerCase().includes('apê') || 
      state.housing.name.toLowerCase().includes('apartamento') || 
      state.housing.name.toLowerCase().includes('studio') ||
      state.housing.id.includes('ape'),
    choices: [
      {
        id: 'c_barulho_multa',
        text: 'Exigir aplicação rígida do regulamento interno com multa dobrada no boleto',
        preview: { felicidade: 15 },
        outcomeNarrative: 'A maioria dos moradores apoiou! A multa foi dobrada e a lei do silêncio voltou a imperar no prédio.',
        consequences: { felicidade: 15 }
      },
      {
        id: 'c_barulho_obras',
        text: 'Propor obra de isolamento acústico no salão de festas dividida entre todos',
        preview: { grana: -120, felicidade: 10 },
        outcomeNarrative: 'A obra de isolamento acústico foi aprovada por R$ 120 por morador. Agora as festas acontecem sem incomodar os apartamentos!',
        consequences: { grana: -120, felicidade: 10 }
      },
      {
        id: 'c_barulho_conversa',
        text: 'Convidar o vizinho para tomar uma cerveja e resolver na conversa de corredor',
        preview: { felicidade: 10, intelecto: 10 },
        outcomeNarrative: 'Uma boa conversa no corredor resolveu tudo! O vizinho pediu desculpas e prometeu respeitar o horário de silêncio.',
        consequences: { felicidade: 10, intelecto: 10 }
      }
    ]
  },
  {
    id: 'assembleia_condominio_vagas',
    title: 'Assembleia Extraordinária: Sorteio de Vagas & Manutenção da Laje 🚘',
    context: 'Discussão acalorada sobre o sorteio anual de vagas de garagem presas e uma infiltração na laje do subsolo que está pingando no carro do 102.',
    badge: 'ASSEMBLEIA DE CONDOMÍNIO 🏢',
    minAge: 18,
    condition: (state: GameState) => 
      state.housing.name.toLowerCase().includes('apê') || 
      state.housing.name.toLowerCase().includes('apartamento') || 
      state.housing.name.toLowerCase().includes('studio') ||
      state.housing.id.includes('ape'),
    choices: [
      {
        id: 'c_vagas_engenheiro',
        text: 'Aprovar laudo de engenharia com chamada de capital urgente para consertar a infiltração',
        preview: { grana: -200, saude: 5 },
        outcomeNarrative: 'A laje foi impermeabilizada com sucesso por R$ 200 de chamada de capital! O prédio está protegido e sem goteiras.',
        consequences: { grana: -200, saude: 5 }
      },
      {
        id: 'c_vagas_sorteio',
        text: 'Votar no sorteio de vagas rotativas e contratar serviço de manobrista no horário de pico',
        preview: { grana: -60, felicidade: 10 },
        outcomeNarrative: 'O sorteio foi realizado em clima de copa do mundo! Você pegou uma vaga ótima perto do elevador.',
        consequences: { grana: -60, felicidade: 10 }
      }
    ]
  },
  {
    id: 'nascimento_primeiros_meses',
    title: 'Primeiros Meses de Vida e o Choro das Cólicas',
    context: 'Você é um bebê recém-nascido no berço. A noite é fria e uma cólica na barriguinha faz você acordar os pais no meio da madrugada.',
    badge: 'PRIMEIRA INFÂNCIA',
    minAge: 0,
    maxAge: 1,
    choices: [
      {
        id: 'c1',
        text: 'Dar um sorriso banguelo e aceitar o colo quentinho dos pais',
        preview: { felicidade: 15, saude: 5 },
        outcomeNarrative: 'Seus pais ficaram emocionados com seu sorriso de bebê! Você dormiu tranquilo no peito.',
        consequences: { felicidade: 15, saude: 5 }
      },
      {
        id: 'c2',
        text: 'Chorar alto com pulmões de ouro até receber massagem na barriguinha',
        preview: { saude: 10, energia: -5 },
        outcomeNarrative: 'Seus pais fizeram a clássica bicicletinha com suas perninhas e o alívio foi imediato!',
        consequences: { saude: 10, energia: -5, felicidade: 5 }
      },
      {
        id: 'c3',
        text: 'Chuchar o bico da chupeta e adormecer ouvindo canção de ninar',
        preview: { felicidade: 10, energia: 10 },
        outcomeNarrative: 'O soninho dos anjos chegou enquanto tocava a música da caixinha de som.',
        consequences: { felicidade: 10, energia: 10 }
      }
    ]
  },
  {
    id: 'primeiros_passos_palavras',
    title: 'A Primeira Palavrinha e os Primeiros Passos',
    context: 'Seus pais estão ajoelhados no tapete da sala filmando tudo com o celular, torcendo para você soltar do sofá e andar.',
    badge: 'DESENVOLVIMENTO INFANTIL',
    minAge: 1,
    maxAge: 2,
    choices: [
      {
        id: 'c1',
        text: 'Soltar do sofá, dar 4 passos cambaleantes e cair na gargalhada',
        preview: { felicidade: 20, intelecto: 10, saude: 5 },
        outcomeNarrative: 'Você andou sozinho pela primeira vez! A família toda comemorou e mandou o vídeo no grupo do WhatsApp!',
        consequences: { felicidade: 20, intelecto: 10, saude: 5 }
      },
      {
        id: 'c2',
        text: 'Falar a primeira palavra em alto e bom som ("Mamãe" ou "Papai")',
        preview: { intelecto: 15, felicidade: 15 },
        outcomeNarrative: 'A palavra saiu clarinha! Os olhinhos da sua família brilharam de orgulho.',
        consequences: { intelecto: 15, felicidade: 15 }
      },
      {
        id: 'c3',
        text: 'Engatinhar super veloz e abrir o armário dos potes plásticos',
        preview: { energia: 10, felicidade: 10 },
        outcomeNarrative: 'Festa dos potes Tupperware no chão da cozinha! Pura diversão da infância.',
        consequences: { energia: 10, felicidade: 10 }
      }
    ]
  },
  {
    id: 'dia_da_vacina_ze_gotinha',
    title: 'Campanha de Vacinação do SUS e o Zé Gotinha',
    context: 'Chegou o sábado de vacinação na Unidade Básica de Saúde (UBS). O Zé Gotinha tá na entrada e a enfermeira prepara a imunização.',
    badge: 'SAÚDE PÚBLICA & SUS',
    minAge: 0,
    maxAge: 4,
    choices: [
      {
        id: 'c1',
        text: 'Tomar a vacina feito um guerreirinho sem derramar uma lágrima',
        preview: { saude: 20, felicidade: 10 },
        outcomeNarrative: 'Você tomou a vacina com coragem exemplar! Ganhou carimbo no cartão de vacinação e um balão do Zé Gotinha.',
        consequences: { saude: 20, felicidade: 10 }
      },
      {
        id: 'c2',
        text: 'Tomar as duas gotinhas doces na boca e dar risada',
        preview: { saude: 15, energia: 5 },
        outcomeNarrative: 'Imunizado com sucesso contra a pólio! O SUS protegeu seu futuro.',
        consequences: { saude: 15, energia: 5 }
      },
      {
        id: 'c3',
        text: 'Chorar um pouquinho na picadinha e se acalmar com colo da mãe',
        preview: { saude: 15, felicidade: 5 },
        outcomeNarrative: 'Depois de um abraço carinhoso da mãe, tudo voltou ao normal e a carteirinha tá 100% em dia.',
        consequences: { saude: 15, felicidade: 5 }
      }
    ]
  },
  {
    id: 'primeiro_dia_creche',
    title: 'O Primeiro Dia na Escolinha / Creche',
    context: 'Sua mãe te levou para o primeiro dia na creche com a lancheira nova. Outras crianças estão brincando de massinha e blocos de montar.',
    badge: 'EDUCAÇÃO BÁSICA',
    minAge: 3,
    maxAge: 5,
    choices: [
      {
        id: 'c1',
        text: 'Fazer amizade com os coleguinhas e montar castelos de blocos',
        preview: { felicidade: 20, intelecto: 10 },
        outcomeNarrative: 'Você se adaptou super bem! Fez amigos para brincar de pega-pega e colorir com giz de cera.',
        consequences: { felicidade: 20, intelecto: 10 }
      },
      {
        id: 'c2',
        text: 'Dividir o lanche e o biscoito de polvilho na rodinha',
        preview: { felicidade: 15, intelecto: 5 },
        outcomeNarrative: 'A tia da creche elogiou seu espírito de partilha e carinho com os colegas!',
        consequences: { felicidade: 15, intelecto: 5 }
      },
      {
        id: 'c3',
        text: 'Ficar no cantinho desenhando a família numa folha grande',
        preview: { intelecto: 12, felicidade: 8 },
        outcomeNarrative: 'Seu desenho virou o destaque do mural da escolinha!',
        consequences: { intelecto: 12, felicidade: 8 }
      }
    ]
  },
  {
    id: 'gincana_ensino_fundamental',
    title: 'Gincana e Prova de Tabuada no Ensino Fundamental',
    context: 'No Ensino Fundamental, a professora anunciou o desafio de tabuada e conhecimentos gerais valendo uma caixa de bombom Garoto!',
    badge: 'ENSINO FUNDAMENTAL',
    minAge: 6,
    maxAge: 11,
    choices: [
      {
        id: 'c1',
        text: 'Responder de cabeça sem hesitar e acertar tudo',
        preview: { intelecto: 20, felicidade: 15 },
        outcomeNarrative: 'Você acertou que 7 x 8 = 56 na lata! Ganhou a caixa de bombom e dividiu com os colegas.',
        consequences: { intelecto: 20, felicidade: 15 }
      },
      {
        id: 'c2',
        text: 'Ajudar os colegas do grupo a estudar na biblioteca escolar',
        preview: { intelecto: 15, felicidade: 10 },
        outcomeNarrative: 'Seu time escolar teve o melhor rendimento da turma!',
        consequences: { intelecto: 15, felicidade: 10 }
      },
      {
        id: 'c3',
        text: 'Focar na aula de Educação Física jogando queimada no recreio',
        preview: { saude: 15, energia: -5, felicidade: 15 },
        outcomeNarrative: 'Você foi o último a ser queimado na quadra! Esporte pura saúde.',
        consequences: { saude: 15, energia: -5, felicidade: 15 }
      }
    ]
  },
  {
    id: 'brincadeira_rua_tarde',
    title: 'Tarde de Pipa e Futebol no Asfalto',
    context: 'Fim de tarde ensolarado na vizinhança. A turma montou traves com dois pares de chinelos no asfalto da rua sem saída.',
    badge: 'INFÂNCIA BRASILEIRA',
    minAge: 8,
    maxAge: 13,
    choices: [
      {
        id: 'c1',
        text: 'Jogar bola no asfalto com a galera até o poste de luz acender',
        preview: { saude: 15, felicidade: 20, energia: -10 },
        outcomeNarrative: 'Futebol raiz, canela raspada e gol no último minuto! Momento de pura alegria de infância.',
        consequences: { saude: 15, felicidade: 20, energia: -10 }
      },
      {
        id: 'c2',
        text: 'Soltar pipa no campinho de terra e colocar rabiola estilosa',
        preview: { felicidade: 15, energia: 5 },
        outcomeNarrative: 'Sua pipa subiu alto no céu azul com o vento a favor!',
        consequences: { felicidade: 15, energia: 5 }
      },
      {
        id: 'c3',
        text: 'Montar clubinho com os vizinhos pra trocar figurinhas da Copa',
        preview: { felicidade: 15, intelecto: 5 },
        outcomeNarrative: 'Trocou as figurinhas repetidas e quase completou o álbum!',
        consequences: { felicidade: 15, intelecto: 5 }
      }
    ]
  },
  {
    id: 'dilema_ensino_medio_estudos',
    title: 'O Ensino Médio e os Trabalhos em Grupo',
    context: 'No Ensino Médio, a professora de Sociologia e História passou um seminário importante sobre cidadania e economia brasileira.',
    badge: 'ENSINO MÉDIO',
    minAge: 12,
    maxAge: 16,
    choices: [
      {
        id: 'c1',
        text: 'Pesquisar a fundo, montar apresentação moderna e liderar a fala',
        preview: { intelecto: 20, felicidade: 10 },
        outcomeNarrative: 'Nota 10 no seminário! O professor elogiou sua clareza e desenvoltura.',
        consequences: { intelecto: 20, felicidade: 10 }
      },
      {
        id: 'c2',
        text: 'Fazer a parte escrita do trabalho ouvindo música no quarto',
        preview: { intelecto: 12, energia: 5 },
        outcomeNarrative: 'Trabalho entregue com capricho e sem estresse!',
        consequences: { intelecto: 12, energia: 5 }
      },
      {
        id: 'c3',
        text: 'Participar do Grêmio Estudantil organizando campeonatos esportivos',
        preview: { felicidade: 20, intelecto: 10 },
        outcomeNarrative: 'Você aprendeu sobre liderança comunitária e virou referência na escola!',
        consequences: { felicidade: 20, intelecto: 10 }
      }
    ]
  },
  {
    id: 'pressao_futuro_ensino_medio',
    title: 'Conclusão do Ensino Médio: Qual Rumo Tomar?',
    context: 'Você está no último ano do Ensino Médio. Os professores cobram simulados e a família pergunta qual faculdade ou carreira você vai seguir.',
    badge: 'TRANSIÇÃO PARA VIDA ADULTA',
    minAge: 16,
    maxAge: 17,
    choices: [
      {
        id: 'c1',
        text: 'Fazer simulados semanais com foco em Medicina, Direito ou Concurso',
        preview: { intelecto: 25, energia: -10, felicidade: 5 },
        outcomeNarrative: 'Sua pontuação nos simulados disparou! Você está pronto para os processos seletivos e vestibulares.',
        consequences: { intelecto: 25, energia: -10, felicidade: 5 }
      },
      {
        id: 'c2',
        text: 'Fazer teste vocacional e pesquisar o mercado de trabalho brasileiro',
        preview: { intelecto: 15, felicidade: 15 },
        outcomeNarrative: 'Você descobriu sua verdadeira vocação e tem clareza de onde quer chegar!',
        consequences: { intelecto: 15, felicidade: 15 }
      },
      {
        id: 'c3',
        text: 'Celebrar a formatura do Ensino Médio com a galera da turma',
        preview: { felicidade: 25, energia: 5 },
        outcomeNarrative: 'Festa inesquecível de formatura com os amigos que você levará para a vida toda!',
        consequences: { felicidade: 25, energia: 5 }
      }
    ]
  },
  {
    id: 'vestibular_enem',
    title: 'O Domingo do ENEM e a Redação',
    context: 'Chegou o fim de semana mais temido pelos estudantes brasileiros: a temida prova do ENEM com tema surpresa na redação e 90 questões de exatas no domingo.',
    badge: 'EDUCAÇÃO & FUTURO',
    minAge: 18,
    maxAge: 20,
    choices: [
      {
        id: 'c1',
        text: 'Virar noites comendo coxinha e estudando repertório de redação',
        preview: { intelecto: 15, energia: -15, saude: -5 },
        outcomeNarrative: 'Você tirou 920 na redação citando Zygmunt Bauman e a Constituição de 1988! Conseguiu bolsa integral no ProUni.',
        consequences: { intelecto: 15, energia: -15, saude: -5, felicidade: 10 }
      },
      {
        id: 'c2',
        text: 'Fazer a prova relaxado, levando 3 barras de chocolate e água sem rótulo',
        preview: { intelecto: 5, felicidade: 5, energia: 5 },
        outcomeNarrative: 'Você fez a prova sem estresse, errou o chute em química, mas garantiu vaga num curso técnico disputado!',
        consequences: { intelecto: 5, felicidade: 5, energia: 5 }
      },
      {
        id: 'c3',
        text: 'Chegar atrasado no portão e virar meme nos telejornais',
        preview: { felicidade: -15, serasa: 0 },
        outcomeNarrative: 'O portão fechou às 13h00 em ponto na sua cara. Você deu entrevista pro repórter e decidiu focar em arrumar um trampo.',
        consequences: { felicidade: -15, energia: -10 }
      }
    ]
  },
  {
    id: 'emprestar_nome_tio',
    title: 'O Tio Pediu Seu Nome Emprestado',
    context: 'Seu tio Valdir chegou no churrasco de domingo com cara de preocupado: quer tirar uma moto financiada em 48x no seu nome limpo porque o dele tá no Serasa.',
    badge: 'TESTE DE FAMÍLIA & SERASA',
    minAge: 18,
    maxAge: 45,
    condition: (state: GameState) => state.serasa.score > 500,
    choices: [
      {
        id: 'c1',
        text: 'Negar com educação e dizer que o banco recusou',
        preview: { serasa: 15, felicidade: -5 },
        outcomeNarrative: 'O clima pesou no churrasco e o tio não te ofereceu mais picanha, mas seu nome continuou 100% limpo e protegido!',
        consequences: { serasa: 15, felicidade: -5 }
      },
      {
        id: 'c2',
        text: 'Ceder pela família e emprestar o CPF pro financiamento',
        preview: { serasa: -120, grana: -1200, felicidade: -10 },
        outcomeNarrative: 'Depois de 3 meses o tio atrasou a parcela da moto. Seu Serasa Score despencou e o banco começou a te ligar 18 vezes ao dia!',
        consequences: {
          serasa: -150,
          grana: -1500,
          felicidade: -15,
          addDebt: {
            id: 'debt_moto_tio',
            credor: 'Banco Pan Financiamentos',
            tipo: 'Financiamento Moto Tio',
            valorOriginal: 4800,
            valorNegociado: 1200,
            descontoPercent: 75
          }
        }
      },
      {
        id: 'c3',
        text: 'Propor que ele junte uma entrada e você ajuda com R$ 300 à vista',
        preview: { grana: -300, felicidade: 5 },
        outcomeNarrative: 'Você perdeu R$ 300 mas manteve a paz familiar e o seu nome intacto no Serasa!',
        consequences: { grana: -300, felicidade: 5, serasa: 10 }
      }
    ]
  },
  {
    id: 'resgate_caramelo',
    title: 'O Vira-Lata Caramelo da Chuva',
    context: 'Num dia de chuva torrencial voltando do metrô, um cachorro vira-lata caramelo com olhar simpático começou a te seguir até a porta de casa.',
    badge: 'COMPANHEIRISMO',
    minAge: 19,
    maxAge: 65,
    condition: (state: GameState) => !state.pet,
    choices: [
      {
        id: 'c1',
        text: 'Adotar o Caramelo, dar banho e comprar ração no pet shop',
        preview: { felicidade: 25, grana: -250, saude: 5 },
        outcomeNarrative: 'Parabéns! O Caramelo agora é seu melhor amigo, late com alegria quando você chega e faz festa todos os dias.',
        consequences: {
          felicidade: 25,
          grana: -250,
          saude: 5,
          gainPet: {
            name: 'Caramelo',
            type: 'Cachorro',
            breed: 'Vira-lata Caramelo Raiz',
            happinessBonus: 10,
            monthlyCost: 120,
            age: 1
          }
        }
      },
      {
        id: 'c2',
        text: 'Dar um pote de arroz com frango e deixar uma caixinha na calçada',
        preview: { felicidade: 8, grana: -30 },
        outcomeNarrative: 'Você alimentou o doguinho com carinho. Ele comeu feliz e virou o protetor oficial do seu quarteirão.',
        consequences: { felicidade: 8, grana: -30 }
      },
      {
        id: 'c3',
        text: 'Ignorar com dor no coração porque seu condomínio não permite',
        preview: { felicidade: -10 },
        outcomeNarrative: 'Você entrou e fechou a porta, mas ficou a noite toda pensando no olhar carente daquele cachorro.',
        consequences: { felicidade: -10 }
      }
    ]
  },
  {
    id: 'callcenter_vs_bicos',
    title: 'Dilema do Primeiro Emprego: 6x1 ou Bicos?',
    context: 'Chegou a hora de bancar os próprios boletos. Você recebeu uma proposta CLT no telemarketing com escala 6x1 e outra pra fazer bicos como garçom e entregador.',
    badge: 'MERCADO DE TRABALHO',
    minAge: 18,
    maxAge: 25,
    choices: [
      {
        id: 'c1',
        text: 'Aceitar o Telemarketing CLT (Salário fixo + VR + Carteira Assinada)',
        preview: { grana: 1650, energia: -20, felicidade: -10, serasa: 30 },
        outcomeNarrative: 'Carteira assinada! O trabalho no headset é exaustivo, mas você tem vale-refeição, FGTS e pode comprovar renda pro cartão de crédito.',
        consequences: {
          grana: 1650,
          energia: -20,
          felicidade: -10,
          serasa: 35,
          gainJob: {
            type: 'clt',
            title: 'Atendente de Relacionamento',
            category: 'Atendimento & Suporte',
            companyOrOrg: 'Atento Brasil Contax',
            salaryMonthly: 1650,
            hasCarteiraAssinada: true,
            yearsInJob: 0
          }
        }
      },
      {
        id: 'c2',
        text: 'Fazer bicos como garçom e entregador de app no fim de semana',
        preview: { grana: 1200, energia: -10, felicidade: 5 },
        outcomeNarrative: 'Você faz seus próprios horários! Tem liberdade na semana, embora precise correr muito atrás de gorjeta e frete.',
        consequences: {
          grana: 1200,
          energia: -10,
          felicidade: 5,
          gainJob: {
            type: 'bicos',
            title: 'Prestador Autônomo e Entregador',
            category: 'Serviços Gerais',
            companyOrOrg: 'Autônomo',
            salaryMonthly: 1300,
            hasCarteiraAssinada: false,
            yearsInJob: 0
          }
        }
      },
      {
        id: 'c3',
        text: 'Segurar as pontas com a família e focar 100% em estudar pra concurso',
        preview: { grana: -200, intelecto: 20, energia: -15 },
        outcomeNarrative: 'Sua rotina virou: café forte, apostilas em PDF e videoaulas do YouTube. Seu intelecto deu um salto enorme!',
        consequences: { grana: -200, intelecto: 20, energia: -15, felicidade: -5 }
      }
    ]
  },
  {
    id: 'proposta_pj',
    title: 'Proposta PJ Tentadora: R$ 5.500 sem Direitos',
    context: 'Uma empresa de tecnologia te chamou pra trabalhar como PJ: pagam R$ 5.500 líquidos por mês, mas sem 13º salário, férias remuneradas, FGTS nem plano de saúde.',
    badge: 'CLT x PJ',
    minAge: 21,
    maxAge: 40,
    condition: (state: GameState) => state.career.type === 'clt' || state.stats.intelecto > 40,
    choices: [
      {
        id: 'c1',
        text: 'Migrar pra PJ: abrir MEI, emitir nota e guardar a própria reserva',
        preview: { grana: 5500, serasa: 25, intelecto: 10, energia: -10 },
        outcomeNarrative: 'Você abriu o CNPJ MEI no portal gov.br! O dinheiro na conta aumentou bastante, mas a disciplina financeira agora é com você.',
        consequences: {
          grana: 3500,
          serasa: 30,
          intelecto: 10,
          gainJob: {
            type: 'pj',
            title: 'Consultor Especialista PJ',
            category: 'Tecnologia & Serviços',
            companyOrOrg: 'TechSolutions Brasil ME',
            salaryMonthly: 5500,
            hasCarteiraAssinada: false,
            yearsInJob: 0
          }
        }
      },
      {
        id: 'c2',
        text: 'Ficar na CLT: valorizar a estabilidade, férias de 30 dias e FGTS',
        preview: { felicidade: 10, energia: 10, saude: 5 },
        outcomeNarrative: 'Você preferiu a paz de espírito de saber que dia 5 o salário cai na conta e que tem descanso garantido no fim de ano.',
        consequences: { felicidade: 10, energia: 10, saude: 5 }
      }
    ]
  },
  {
    id: 'concurso_edital',
    title: 'Saiu o Edital do Concurso Público!',
    context: 'Foi publicado o edital do Concurso da Caixa Econômica / Banco do Brasil com salário inicial de R$ 4.200, vale-alimentação gordo e estabilidade pro resto da vida.',
    badge: 'SONHO DA ESTABILIDADE',
    minAge: 19,
    maxAge: 55,
    choices: [
      {
        id: 'c1',
        text: 'Comprar cursinho online, estudar direito constitucional e fazer simulados',
        preview: { grana: -450, intelecto: 25, energia: -20 },
        outcomeNarrative: 'Você estudou com afinco! Seu nome saiu na lista dos classificados no Diário Oficial. A posse do concurso mudou sua vida!',
        consequences: {
          grana: 1500,
          intelecto: 25,
          felicidade: 35,
          serasa: 70,
          gainJob: {
            type: 'concursado',
            title: 'Técnico Bancário Concursado',
            category: 'Setor Público',
            companyOrOrg: 'Caixa Econômica Federal',
            salaryMonthly: 4600,
            hasCarteiraAssinada: true,
            yearsInJob: 0
          }
        }
      },
      {
        id: 'c2',
        text: 'Fazer a prova apenas com o conhecimento da vida e rezar pro chute',
        preview: { grana: -80, felicidade: -5 },
        outcomeNarrative: 'Faltaram 4 pontos na parte de informática e raciocínio lógico. Fica de aprendizado para o próximo edital!',
        consequences: { grana: -80, intelecto: 5, felicidade: -5 }
      },
      {
        id: 'c3',
        text: 'Não tenho paciência com edital, prefiro o setor privado',
        preview: { energia: 5 },
        outcomeNarrative: 'Você economizou a taxa de inscrição e preferiu focar nas metas e comissões da sua profissão atual.',
        consequences: { energia: 5 }
      }
    ]
  },
  {
    id: 'comprar_celta',
    title: 'O Lendário Celta 2008 Prata',
    context: 'Seu vizinho mecânico está vendendo um Celta 1.0 Life prata, duas portas, vidros manuais, com 145.000 km rodados por R$ 14.000 à vista ou em 36x.',
    badge: 'PRIMEIRO CARRO',
    minAge: 20,
    maxAge: 60,
    condition: (state: GameState) => !state.vehicle && state.stats.grana >= 4000,
    choices: [
      {
        id: 'c1',
        text: 'Comprar à vista pechinchando por R$ 12.500 no Pix',
        preview: { grana: -12500, felicidade: 30, energia: 15 },
        outcomeNarrative: 'Negócio fechado! O ar condicionado é abrir a janela na Radial Leste, mas a sensação de independência e não pegar mais busão lotado não tem preço.',
        consequences: {
          grana: -12500,
          felicidade: 30,
          energia: 15,
          gainVehicle: {
            id: 'celta_2008',
            name: 'Celta 1.0 Prata Guerreiro',
            icon: '🚗',
            yearlyMaintenance: 1400,
            value: 13500
          }
        }
      },
      {
        id: 'c2',
        text: 'Continuar no transporte público e no cartão de metrô',
        preview: { grana: 500, saude: 5 },
        outcomeNarrative: 'Você economizou com IPVA, gasolina e seguro. Seu bolso agradeceu e você ouve podcasts no trajeto.',
        consequences: { grana: 500, saude: 5 }
      }
    ]
  },
  {
    id: 'carnaval_viagem',
    title: 'Feriado de Carnaval: Bloco ou Dormir?',
    context: 'A galera do grupo do WhatsApp está montando van pra passar o Carnaval em Salvador ou no litoral de São Paulo/Rio. É 5 dias de pura folia.',
    badge: 'CULTURA & LAZER',
    minAge: 18,
    maxAge: 40,
    choices: [
      {
        id: 'c1',
        text: 'Ir pra folia! Fantasia improvisada, glitter e trio elétrico',
        preview: { grana: -1200, felicidade: 35, energia: -30, saude: -10 },
        outcomeNarrative: 'Foi o melhor Carnaval da sua vida! Você cantou até ficar rouco, dançou axé e fez 15 amigos novos.',
        consequences: { grana: -1200, felicidade: 35, energia: -30, saude: -10 }
      },
      {
        id: 'c2',
        text: 'Ir só nos bloquinhos de rua gratuitos do seu bairro',
        preview: { grana: -150, felicidade: 20, energia: -10 },
        outcomeNarrative: 'Cerveja gelada do ambulante, marchinhas e samba de raiz. Voltou cedo e economizou uma grana violenta!',
        consequences: { grana: -150, felicidade: 20, energia: -10 }
      },
      {
        id: 'c3',
        text: 'Aproveitar a cidade vazia pra maratonar séries e descansar',
        preview: { energia: 35, saude: 15, felicidade: 10, grana: 0 },
        outcomeNarrative: 'Dormiu 10 horas por dia, comeu bem e voltou na quarta-feira de cinzas com as baterias 100% recarregadas!',
        consequences: { energia: 35, saude: 15, felicidade: 10 }
      }
    ]
  },
  {
    id: 'serasa_limpanome',
    title: 'Feirão Serasa Limpa Nome com 90% OFF',
    context: 'Seu celular tocou com notificação do aplicativo Serasa: aquela dívida antiga de cartão de R$ 3.800 pode ser quitada agora por apenas R$ 380 no Pix!',
    badge: 'NOME LIMPO & CRÉDITO',
    minAge: 20,
    maxAge: 70,
    condition: (state: GameState) => state.serasa.dividas.length > 0,
    choices: [
      {
        id: 'c1',
        text: 'Pagar os R$ 380 à vista no Pix e limpar o nome agora!',
        preview: { grana: -380, serasa: 220, felicidade: 30 },
        outcomeNarrative: 'Sensação indescritível! O Serasa atualizou em 24h, seu score subiu para as alturas e o selo NOME LIMPO voltou a brilhar!',
        consequences: {
          grana: -380,
          serasa: 250,
          felicidade: 30,
          customAction: 'clear_all_debts'
        }
      },
      {
        id: 'c2',
        text: 'Deixar prescrever em 5 anos, não tenho essa grana agora',
        preview: { serasa: -20, felicidade: -5 },
        outcomeNarrative: 'A dívida continua ativa no cadastro positivo e os bancos continuam bloqueando seu limite de crédito.',
        consequences: { serasa: -20, felicidade: -5 }
      }
    ]
  },
  {
    id: 'megasena_virada',
    title: 'Bolão da Mega-Sena da Virada',
    context: 'O prêmio da Mega-Sena acumulou em R$ 570 milhões. O pessoal da firma ou da família está organizando o famoso bolão de 10 cotas com volante de 8 números.',
    badge: 'SORTE & FEZINHA',
    minAge: 18,
    maxAge: 85,
    choices: [
      {
        id: 'c1',
        text: 'Entrar no bolão com R$ 50 e escolher suas dezenas da sorte',
        preview: { grana: -50, felicidade: 10 },
        outcomeNarrative: 'Vocês acertaram a quadra no bolão! Cada um levou R$ 850 de prêmio e a comemoração com churrasco foi lendária.',
        consequences: { grana: 800, felicidade: 25 }
      },
      {
        id: 'c2',
        text: 'Jogar um jogo simples de 6 números na lotérica por conta própria',
        preview: { grana: -5 },
        outcomeNarrative: 'Saiu 04, 18, 22... você acertou apenas 2 números (duque). Valeu pela emoção de sonhar acordado durante a virada!',
        consequences: { grana: -5, felicidade: 2 }
      },
      {
        id: 'c3',
        text: 'Não jogo em loteria, probabilidade matemática joga contra',
        preview: { intelecto: 2 },
        outcomeNarrative: 'Você guardou seus R$ 5 reais e colocou na caixinha rendendo 100% do CDI.',
        consequences: { intelecto: 2 }
      }
    ]
  },
  {
    id: 'ape_financiado',
    title: 'O Primeiro Apê Financiado na Caixa',
    context: 'Você foi pré-aprovado no programa Minha Casa Minha Vida para financiar um apê de 2 quartos com varanda na planta. Entrada subsidiada e parcelas de R$ 980.',
    badge: 'PATRIMÔNIO & MORADIA',
    minAge: 24,
    maxAge: 55,
    condition: (state: GameState) => state.housing.type !== 'proprio' && state.serasa.score > 600,
    choices: [
      {
        id: 'c1',
        text: 'Assinar o contrato com a Caixa e usar o FGTS na entrada',
        preview: { grana: -6000, felicidade: 35, serasa: 40 },
        outcomeNarrative: 'As chaves são suas! O cheiro de reboco e pintura fresca tem gosto de vitória. Você é oficialmente proprietário!',
        consequences: {
          grana: -6000,
          felicidade: 35,
          serasa: 50,
          gainHousing: {
            id: 'ape_caixa',
            name: 'Apartamento 2 Qts Financiado Caixa',
            type: 'proprio',
            monthlyCost: 980,
            propertyValue: 240000,
            icon: '🏢'
          }
        }
      },
      {
        id: 'c2',
        text: 'Continuar no aluguel com mais flexibilidade para mudar de cidade',
        preview: { felicidade: 5 },
        outcomeNarrative: 'Você preferiu não se amarrar a uma dívida de 30 anos e manter a liquidez do seu dinheiro investido.',
        consequences: { felicidade: 5 }
      }
    ]
  },
  {
    id: 'franquia_acai',
    title: 'Seu Primo Quer Abrir Franquia de Açaí',
    context: 'Seu primo Renan fez um curso de empreendedorismo de fim de semana e quer que você entre com R$ 8.000 como sócio-investidor num quiosque de açaí.',
    badge: 'EMPREENDEDORISMO',
    minAge: 22,
    maxAge: 50,
    condition: (state: GameState) => state.stats.grana >= 8000,
    choices: [
      {
        id: 'c1',
        text: 'Investir R$ 8.000 e ser sócio com 30% dos lucros',
        preview: { grana: -8000, felicidade: 10, intelecto: 10 },
        outcomeNarrative: 'O verão foi escaldante e o quiosque bombou! Em 1 ano você recuperou o investimento e começou a receber R$ 1.200 de pró-labore.',
        consequences: { grana: 3500, felicidade: 20, intelecto: 15 }
      },
      {
        id: 'c2',
        text: 'Agradecer e sugerir que ele comece com um carrinho menor',
        preview: { grana: 0, felicidade: 5 },
        outcomeNarrative: 'Você preservou seu capital e ainda ajudou o primo a fazer um plano de negócios mais realista.',
        consequences: { felicidade: 5, intelecto: 5 }
      }
    ]
  },
  {
    id: 'saude_checkup',
    title: 'Exame de Rotina: Pastel com Caldo de Cana ou Salada?',
    context: 'Seu médico ou a balança deram um aviso amigável: o colesterol e a pressão estão no limite. Chegou a hora de decidir como cuidar do corpo.',
    badge: 'SAÚDE & BEM-ESTAR',
    minAge: 25,
    maxAge: 75,
    choices: [
      {
        id: 'c1',
        text: 'Matricular na academia de bairro e começar a correr no parque',
        preview: { saude: 20, energia: 15, grana: -110 },
        outcomeNarrative: 'As primeiras semanas doeram até para subir escada, mas sua disposição diária dobrou e você dorme como um bebê!',
        consequences: { saude: 20, energia: 15, grana: -110, felicidade: 10 }
      },
      {
        id: 'c2',
        text: 'Manter a feira livre sagrada de domingo com pastel de carne seca',
        preview: { felicidade: 15, saude: -10, energia: -5 },
        outcomeNarrative: 'Aquele pastel sequinho com vinagrete e caldo de cana com limão cura qualquer tristeza, embora o coração reclame um pouco.',
        consequences: { felicidade: 15, saude: -10, energia: -5 }
      }
    ]
  },
  {
    id: 'relacionamento_tinder',
    title: 'Crush do App de Namoro',
    context: 'Você deu match com uma pessoa incrível no aplicativo de namoro: fã de MPB, adora coxinha com catupiry e tem cachorro também.',
    badge: 'AMOR & RELAÇÕES',
    minAge: 19,
    maxAge: 65,
    condition: (state: GameState) => state.relationship.status === 'solteiro',
    choices: [
      {
        id: 'c1',
        text: 'Marcar num barzinho descontraído com cerveja e petisco',
        preview: { grana: -120, felicidade: 25 },
        outcomeNarrative: 'A química foi instantânea! O papo durou 4 horas e vocês já engataram um namoro gostoso e companheiro.',
        consequences: {
          grana: -120,
          felicidade: 25,
          gainPartner: 'Camila/Gabriel'
        }
      },
      {
        id: 'c2',
        text: 'Conversar só pelo WhatsApp por mais 3 meses por timidez',
        preview: { felicidade: 5 },
        outcomeNarrative: 'A conversa esfriou aos poucos e virou só curtida nos stories do Instagram.',
        consequences: { felicidade: 5 }
      }
    ]
  },
  {
    id: 'dilema_hora_extra',
    title: 'O Chefe Pediu Hora Extra no Fim de Semana',
    context: 'Sexta-feira à tarde, o chefe convoca reunião de última hora pedindo para a equipe emendar o sábado e o domingo no escritório para entregar o projeto do cliente.',
    badge: 'DILEMA DE CARREIRA',
    minAge: 18,
    maxAge: 65,
    condition: (state: GameState) => state.career.type !== 'desempregado',
    choices: [
      {
        id: 'c1',
        text: 'Vestir a camisa da empresa, trabalhar todo o fim de semana e mostrar alta eficiência',
        preview: { energia: -20, felicidade: -15, saude: -5 },
        outcomeNarrative: 'Você entregou o projeto com excelência! O chefe elogiou seu comprometimento e sua eficiência no trabalho disparou.',
        consequences: { energia: -20, felicidade: -15, saude: -5 }
      },
      {
        id: 'c2',
        text: 'Negociar banco de horas e fazer apenas o horário contratado',
        preview: { felicidade: 5, energia: -5 },
        outcomeNarrative: 'Você manteve o equilíbrio entre vida pessoal e profissional sem se matar de trabalhar.',
        consequences: { felicidade: 5, energia: -5 }
      },
      {
        id: 'c3',
        text: 'Inventar uma desculpa familiar e curtir o fim de semana',
        preview: { felicidade: 15, energia: 10 },
        outcomeNarrative: 'Descanso garantido, embora o chefe tenha ficado com a pulga atrás da orelha sobre sua eficiência.',
        consequences: { felicidade: 15, energia: 10 }
      }
    ]
  },
  {
    id: 'dilema_meta_estressante',
    title: 'A Batalha pela Meta Trimestral de Vendas/Produção',
    context: 'A diretoria anunciou que quem bater 120% da meta trimestral receberá um bônus salarial generoso, mas a pressão está altíssima.',
    badge: 'PRODUTIVIDADE & BÔNUS',
    minAge: 18,
    maxAge: 65,
    condition: (state: GameState) => state.career.type !== 'desempregado',
    choices: [
      {
        id: 'c1',
        text: 'Focar 100% nas metas, fazer hora extra e buscar eficiência máxima',
        preview: { grana: 2500, energia: -25, felicidade: -10 },
        outcomeNarrative: 'Meta batida com folga! Você recebeu um bônus especial no contracheque e destaque na empresa.',
        consequences: { grana: 2500, energia: -25, felicidade: -10 }
      },
      {
        id: 'c2',
        text: 'Trabalhar no ritmo normal e entregar o esperado',
        preview: { grana: 400, felicidade: 5 },
        outcomeNarrative: 'Desempenho sólido e consistente, mantendo sua eficiência estável.',
        consequences: { grana: 400, felicidade: 5 }
      }
    ]
  },
  {
    id: 'aposentadoria_futuro',
    title: 'Planejamento para o Futuro e Previdência',
    context: 'Você viu uma reportagem sobre o déficit da previdência e começou a pensar em como vai ser sua vida daqui a alguns anos.',
    badge: 'VISÃO DE LONGO PRAZO',
    minAge: 30,
    maxAge: 65,
    choices: [
      {
        id: 'c1',
        text: 'Aportar mensalmente no Tesouro Direto IPCA+ e ações de dividendos',
        preview: { grana: -600, intelecto: 15, serasa: 30 },
        outcomeNarrative: 'A mágica dos juros compostos começou a agir! Seus rendimentos passivos aumentam a cada ano.',
        consequences: { grana: -600, intelecto: 15, serasa: 30, felicidade: 15 }
      },
      {
        id: 'c2',
        text: 'Viver o presente intensamente porque o amanhã a Deus pertence',
        preview: { felicidade: 15, grana: -300 },
        outcomeNarrative: 'Você viajou, aproveitou com os amigos e curtiu cada centavo hoje!',
        consequences: { felicidade: 15, grana: -300 }
      }
    ]
  },
  {
    id: 'dilema_propina_fornecedor',
    title: 'Proposta Indecorosa do Fornecedor',
    context: 'Um fornecedor da empresa se aproxima discretamente e oferece um PIX por fora de R$ 3.000 se você aprovar as notas fiscais com 15% de superfaturamento.',
    badge: 'DILEMA ÉTICO DE TRABALHO',
    minAge: 18,
    condition: (state: GameState) => state.career.type !== 'desempregado' && state.career.salaryMonthly > 0,
    choices: [
      {
        id: 'c1',
        text: 'Recusar categoricamente e denunciar ao canal de Compliance da empresa',
        preview: { serasa: 100, intelecto: 15 },
        outcomeNarrative: 'A diretoria elogiou sua postura ética impecável! Sua reputação na empresa subiu muito.',
        consequences: { serasa: 100, intelecto: 15, felicidade: 10 }
      },
      {
        id: 'c2',
        text: 'Aceitar a propina do fornecedor via PIX por fora',
        preview: { grana: 3000, serasa: -150 },
        outcomeNarrative: 'O dinheiro caiu na conta na hora, mas a culpa e o medo de auditoria tiram seu sono. Seu Serasa Score despencou.',
        consequences: { grana: 3000, serasa: -150, felicidade: -15 }
      },
      {
        id: 'c3',
        text: 'Exigir desconto real no contrato oficial para a empresa sem aceitar dinheiro pessoal',
        preview: { intelecto: 20, serasa: 50 },
        outcomeNarrative: 'Você usou a situação para negociar um desconto oficial para a firma! A chefia notou sua esperteza negociadora.',
        consequences: { intelecto: 20, serasa: 50, felicidade: 15 }
      }
    ]
  },
  {
    id: 'dilema_fraude_reembolso',
    title: 'Esquema de Reembolsos e Despesas Falsas',
    context: 'Colegas da sua equipe revelaram que costumam incluir notas de restaurante e Uber particulares nos relatórios de reembolso corporativo.',
    badge: 'DILEMA ÉTICO DE TRABALHO',
    minAge: 18,
    condition: (state: GameState) => state.career.type !== 'desempregado' && state.career.salaryMonthly > 0,
    choices: [
      {
        id: 'c1',
        text: 'Manter conduta íntegra e recusar participar do esquema de reembolsos',
        preview: { serasa: 60, intelecto: 10 },
        outcomeNarrative: 'Sua integridade permanece intacta. Você mantém sua consciência limpa e reputação preservada.',
        consequences: { serasa: 60, intelecto: 10, felicidade: 5 }
      },
      {
        id: 'c2',
        text: 'Lançar recibos e notas fiscais particulares como despesas de trabalho',
        preview: { grana: 1200, serasa: -110 },
        outcomeNarrative: 'O reembolso extra entrou no contracheque, mas o risco de ser pego pelo setor fiscal é constante.',
        consequences: { grana: 1200, serasa: -110, felicidade: -10 }
      },
      {
        id: 'c3',
        text: 'Alertar a diretoria de auditoria interna sobre a brecha no sistema de reembolso',
        preview: { serasa: 120, intelecto: 15 },
        outcomeNarrative: 'A empresa corrigiu a falha no sistema de notas fiscais e citou sua postura como exemplo de integridade.',
        consequences: { serasa: 120, intelecto: 15, felicidade: 20 }
      }
    ]
  },
  {
    id: 'dilema_credito_projeto',
    title: 'Apertão de Mão & Apropriação de Projeto',
    context: 'O diretor geral adorou a apresentação do novo plano operacional. Ele acha que a ideia foi 100% sua, embora um estagiário júnior tenha feito quase toda a pesquisa pesada.',
    badge: 'DILEMA ÉTICO DE TRABALHO',
    minAge: 18,
    condition: (state: GameState) => state.career.type !== 'desempregado' && state.career.salaryMonthly > 0,
    choices: [
      {
        id: 'c1',
        text: 'Reconhecer publicamente o trabalho do estagiário na reunião',
        preview: { serasa: 80, felicidade: 25 },
        outcomeNarrative: 'O estagiário quase chorou de gratidão e a diretoria admirou sua liderança generosa!',
        consequences: { serasa: 80, felicidade: 25, intelecto: 10 }
      },
      {
        id: 'c2',
        text: 'Assumir a autoria total do projeto e solicitar um aumento de salário',
        preview: { serasa: -130, felicidade: -10 },
        outcomeNarrative: 'Você ganhou moral com a diretoria, mas o clima com a equipe ficou péssimo e a desconfiança reina.',
        consequences: { serasa: -130, felicidade: -10 }
      }
    ]
  },
  {
    id: 'dilema_vazamento_dados',
    title: 'Sondagem do Concorrente e Dados Confidenciais',
    context: 'Um recrutador de uma empresa rival te ofereceu R$ 8.000 em dinheiro se você enviar a planilha sigilosa de clientes e custos da sua empresa atual.',
    badge: 'DILEMA ÉTICO DE TRABALHO',
    minAge: 18,
    condition: (state: GameState) => state.career.type !== 'desempregado' && state.career.salaryMonthly > 0,
    choices: [
      {
        id: 'c1',
        text: 'Recusar veementemente e acionar a Segurança da Informação da sua empresa',
        preview: { serasa: 140, intelecto: 25 },
        outcomeNarrative: 'A empresa abriu investigação contra o concorrente e te concedeu um bônus por lealdade profissional!',
        consequences: { serasa: 140, intelecto: 25, grana: 1500, felicidade: 20 }
      },
      {
        id: 'c2',
        text: 'Vender a planilha sigilosa ao concorrente via arquivo encriptado',
        preview: { grana: 8000, serasa: -220 },
        outcomeNarrative: 'O dinheiro gordo entrou na conta, mas o vazamento gerou escândalo no setor e o Cerco do Serasa apertou.',
        consequences: { grana: 8000, serasa: -220, felicidade: -20 }
      }
    ]
  },
  {
    id: 'dilema_falsificar_ponto',
    title: 'Favor Perigoso no Registro de Ponto',
    context: 'Seu colega de equipe chegou 2 horas atrasado e implora para você registrar o ponto por ele como se ele tivesse chegado no horário correto.',
    badge: 'DILEMA ÉTICO DE TRABALHO',
    minAge: 18,
    condition: (state: GameState) => state.career.type !== 'desempregado' && state.career.salaryMonthly > 0,
    choices: [
      {
        id: 'c1',
        text: 'Explicar amigavelmente que você não pode falsificar o ponto',
        preview: { serasa: 40, intelecto: 10 },
        outcomeNarrative: 'Ele ficou chateado no momento, mas depois entendeu que falsidade ideológica é justa causa.',
        consequences: { serasa: 40, intelecto: 10, felicidade: 5 }
      },
      {
        id: 'c2',
        text: 'Bater o ponto pelo colega para livrar a barra dele',
        preview: { serasa: -60, felicidade: 10 },
        outcomeNarrative: 'Você quebrou o galho dele, mas as câmeras de vigilância quase flagraram seu movimento no relógio de ponto.',
        consequences: { serasa: -60, felicidade: 10 }
      }
    ]
  },
  {
    id: 'aposentadoria_inss_tempo_idade',
    title: 'Aposentadoria: Requisitos de Idade & Tempo de Contribuição no INSS 🏦',
    context: 'Ao atingir a faixa etária requerida e somar anos de carteira assinada ou serviço público, a simulação no Meu INSS indica que seu benefício oficial foi deferido! Chegou a hora de decidir se você pendura as chuteiras ou continua na ativa.',
    badge: 'APOSENTADORIA OFICIAL 👴👵',
    minAge: 60,
    condition: (state: GameState) => !state.character.retired,
    choices: [
      {
        id: 'c_aposentar_inss',
        text: 'Requerer aposentadoria imediata no INSS e curtir a terceira idade com benefício mensal garantido',
        preview: { felicidade: 30, energia: 25 },
        outcomeNarrative: 'Requerimento Aprovado no INSS! Você se aposentou com benefício vitalício garantido todos os meses, muito mais tempo livre para descanso e viagens em família!',
        consequences: {
          felicidade: 30,
          energia: 25,
          customAction: 'aposentar_inss',
          retire: {
            retirementType: 'inss',
            pensionMonthly: 3850
          }
        }
      },
      {
        id: 'c_abono_permanencia',
        text: 'Continuar trabalhando para receber o Abono de Permanência e acumular mais patrimônio',
        preview: { grana: 4000, felicidade: -10, energia: -15 },
        outcomeNarrative: 'Você optou por seguir na ativa. Ganhou o abono com bônus financeiro substancial, mas a rotina de trabalho diária pesa no corpo.',
        consequences: { grana: 4000, felicidade: -10, energia: -15, serasa: 30 }
      }
    ]
  },
  {
    id: 'previdencia_privada_vs_inss',
    title: 'Dilema Previdenciário: Resgatar Previdência Privada vs. Renda Vitalícia 📈',
    context: 'Seu plano de Previdência Privada (PGBL/VGBL) atingiu a maturidade após anos de aportes. O gerente do banco solicita sua decisão entre transformar em renda mensal vitalícia ou resgatar o montante integral para reinvestir.',
    badge: 'PREVIDÊNCIA PRIVADA vs INSS 📊',
    minAge: 60,
    choices: [
      {
        id: 'c_renda_vitalicia_privada',
        text: 'Converter o saldo em Renda Mensal Vitalícia complementar (Pensão Privada + INSS)',
        preview: { felicidade: 25, serasa: 50 },
        outcomeNarrative: 'Segurança financeira máxima! Agora você conta com fluxo mensal duplo (INSS + Previdência Privada), imune às oscilações da bolsa de valores.',
        consequences: {
          felicidade: 25,
          serasa: 50,
          customAction: 'aposentar_misto',
          retire: {
            retirementType: 'misto',
            pensionMonthly: 6200
          }
        }
      },
      {
        id: 'c_resgate_total_privada',
        text: 'Resgatar o montante total acumulado (R$ 180.000) e alocar em imóveis e fundos de dividendos',
        preview: { grana: 180000, intelecto: 20 },
        outcomeNarrative: 'Uma bolada de R$ 180.000 entrou na conta! Você assumiu a gestão direta dos seus investimentos com autonomia e foco em proventos.',
        consequences: { grana: 180000, intelecto: 20, felicidade: 20 }
      },
      {
        id: 'c_depender_apenas_inss',
        text: 'Manter foco exclusivo no teto do INSS e direcionar o saldo privado para ajudar os filhos',
        preview: { felicidade: 15, grana: -15000 },
        outcomeNarrative: 'Você doou parte dos recursos para alavancar a vida dos filhos e viverá com a tranquilidade do benefício público do INSS.',
        consequences: { felicidade: 15, grana: -15000 }
      }
    ]
  },
  {
    id: 'planejamento_sucessorio_holding',
    title: 'Planejamento Sucessório Avançado: Holding Familiar & Doação em Vida 🏛️',
    context: 'Chegando à maturidade dos 60+, seu advogado patrimonial sugere estruturar um Planejamento Sucessório Avançado para evitar o doloroso e oneroso inventário judicial, que pode devorar até 20% do patrimônio com ITCMD e custas.',
    badge: 'SUCESSÃO & TESTAMENTO 📜',
    minAge: 60,
    choices: [
      {
        id: 'c_holding_familiar',
        text: 'Constituir Holding Familiar com cláusula de usufruto vitalício e blindagem patrimonial',
        preview: { grana: -4500, intelecto: 25, serasa: 80 },
        outcomeNarrative: 'Estruturação jurídica exemplar! O patrimônio foi integralizado na Holding Familiar com economia fiscal de ITCMD e proteção definitiva para herdeiros.',
        consequences: { grana: -4500, intelecto: 25, serasa: 80, felicidade: 25 }
      },
      {
        id: 'c_doacao_com_reserva',
        text: 'Fazer Doação em Vida com reserva de usufruto registrada em Cartório de Notas',
        preview: { grana: -2200, felicidade: 20 },
        outcomeNarrative: 'Você garantiu que cada herdeiro receba sua parte em paz sem brigas futuras, mantendo o controle total da posse até o fim da vida.',
        consequences: { grana: -2200, felicidade: 20, serasa: 40 }
      },
      {
        id: 'c_inventario_tradicional',
        text: 'Não intervir agora e deixar a divisão seguir as regras normais do Código Civil',
        preview: { felicidade: -5 },
        outcomeNarrative: 'Você preferiu não mexer em papéis jurídicos por enquanto. A partilha será conduzida futuramente conforme a lei civil.',
        consequences: { felicidade: -5 }
      }
    ]
  },
  {
    id: 'dilema_trabalho_pos_aposentadoria',
    title: 'Consultoria Pós-Aposentadoria: Convidado(a) para Retornar como PJ 💼',
    context: 'Depois de aposentado(a), uma empresa de renome te procura oferecendo um contrato de consultor sênior PJ: meio período, duas reuniões por semana e remuneração atrativa.',
    badge: 'DILEMA DE APOSENTADORIA 💼',
    minAge: 60,
    condition: (state: GameState) => state.character.retired === true,
    choices: [
      {
        id: 'c_consultor_pj',
        text: 'Aceitar a consultoria PJ para manter a mente afiada e faturar R$ 4.500 extras',
        preview: { grana: 4500, intelecto: 15, energia: -15 },
        outcomeNarrative: 'Sua vasta experiência foi valorizada no mercado! Você compartilha sabedoria com os mais novos e reforça sua renda.',
        consequences: { grana: 4500, intelecto: 15, energia: -15, felicidade: 15 }
      },
      {
        id: 'c_descanso_integral',
        text: 'Recusar educadamente: seu tempo agora pertence à pescaria, aos netos e ao descanso',
        preview: { felicidade: 25, energia: 20 },
        outcomeNarrative: 'Você priorizou sua paz de espírito! Seus dias são de total liberdade, viagens e momentos preciosos com a família.',
        consequences: { felicidade: 25, energia: 20 }
      }
    ]
  },
  {
    id: 'entrevista_pressao_burnout',
    title: 'Pressão Extrema em Entrevista de Emprego 😰',
    context: 'Durante a etapa final de seleção para uma grande vaga, os entrevistadores fazem perguntas intimidadoras sob um teste de estresse ao vivo. O clima na sala fica tenso.',
    badge: 'PRESSÃO SOCIAL & CARREIRA 💼',
    minAge: 18,
    choices: [
      {
        id: 'c_entrevista_assertiva',
        text: 'Manter a postura firme, respirar fundo e responder com inteligência emocional 🧠',
        preview: { intelecto: 15, felicidade: 15 },
        outcomeNarrative: 'Você dominou o teste de estresse com serenidade! Os entrevistadores admiraram seu autocontrole em situações de alta pressão (+15 Intelecto, +15 Saúde Mental).',
        consequences: { intelecto: 15, felicidade: 15, saudeMental: 15 }
      },
      {
        id: 'c_entrevista_panico',
        text: 'Ficar extremamente nervoso(a), gaguejar e sair trêmulo(a) da sala',
        preview: { felicidade: -15 },
        outcomeNarrative: 'A pressão excessiva causou um pico de ansiedade. Você precisou de um tempo para recuperar o equilíbrio emocional (-20 Saúde Mental, -15 Felicidade).',
        consequences: { felicidade: -15, saudeMental: -20 }
      }
    ]
  },
  {
    id: 'cobranca_social_familiar_casamento',
    title: 'Cobranças Sociais Intensas & Comparação Familiar 🗣️',
    context: 'No almoço de família de domingo, parentes começam a fazer perguntas indiscretas sobre casamento, conquistas financeiras e comparações com primos de sucesso.',
    badge: 'COBRANÇA FAMILIAR & MENTE 🧠',
    minAge: 18,
    choices: [
      {
        id: 'c_cobranca_limites',
        text: 'Impor limites educadamente e lembrar que cada pessoa tem seu próprio tempo 🌿',
        preview: { felicidade: 15 },
        outcomeNarrative: 'Você defendeu sua paz sem criar atrito! Sua postura firme aliviou a carga emocional e trouxe auto-respeito (+15 Saúde Mental, +15 Felicidade).',
        consequences: { felicidade: 15, saudeMental: 15 }
      },
      {
        id: 'c_cobranca_remoer',
        text: 'Absorver a cobrança calado(a) e passar a semana se comparando com os outros',
        preview: { felicidade: -15 },
        outcomeNarrative: 'A comparação constante gerou um sentimento amargo de inadequação e cansaço mental (-25 Saúde Mental, -15 Felicidade).',
        consequences: { felicidade: -15, saudeMental: -25 }
      }
    ]
  },
  {
    id: 'sobrecarga_burnout_trabalho',
    title: 'Sobrecarga de Trabalho & Síndrome de Burnout 🤯',
    context: 'Com o acúmulo de funções na empresa, você está trabalhando 12 horas por dia. O corpo apresenta sinais claros de exaustão, palpitações e insônia.',
    badge: 'ESTRESSE & SAÚDE MENTAL 🏥',
    minAge: 20,
    choices: [
      {
        id: 'c_burnout_licenca',
        text: 'Tirar licença/folga de emergência para cuidar da saúde mental e fazer terapia 🧘',
        preview: { saude: 15, felicidade: 20 },
        outcomeNarrative: 'Decisão vital! Você colocou sua saúde em primeiro lugar, descansou o corpo e restaurou a paz emocional (+30 Saúde Mental, +15 Saúde).',
        consequences: { saude: 15, felicidade: 20, saudeMental: 30 }
      },
      {
        id: 'c_burnout_insano',
        text: 'Ignorar os alertas do corpo e continuar no ritmo insano por causa da meta',
        preview: { grana: 600, felicidade: -20, saude: -15 },
        outcomeNarrative: 'O corpo colapsou com estresse severo e esgotamento físico. A produtividade caiu e a saúde mental despencou (-35 Saúde Mental, -15 Saúde).',
        consequences: { grana: 600, felicidade: -20, saude: -15, saudeMental: -35 }
      }
    ]
  },
  {
    id: 'comparacao_redes_sociais_ansiedade',
    title: 'Comparação no InstaVida & Ansiedade Digital 📱',
    context: 'Rolando o feed das redes sociais, você é bombardeado(a) por vidas "perfeitas", viagens de luxo e ostentação de conhecidos, gerando ansiedade.',
    badge: 'BEM-ESTAR DIGITAL 📱',
    minAge: 16,
    choices: [
      {
        id: 'c_redes_detox',
        text: 'Fazer um Detox Digital de 14 dias sem olhar redes sociais 🌿',
        preview: { felicidade: 20 },
        outcomeNarrative: 'O detox digital trouxe leveza instantânea! Você reconectou-se com o mundo real, descansou a mente e dormiu melhor (+25 Saúde Mental, +20 Felicidade).',
        consequences: { felicidade: 20, saudeMental: 25 }
      },
      {
        id: 'c_redes_ostentacao',
        text: 'Gastar grana que não tem comprando roupas de grife para tentar ostentar também',
        preview: { grana: -450, felicidade: -10 },
        outcomeNarrative: 'A tentativa de impressionar no virtual gerou uma fatura alta no cartão e mais cobrança interna (-15 Saúde Mental, -R$ 450).',
        consequences: { grana: -450, felicidade: -10, saudeMental: -15 }
      }
    ]
  },
  {
    id: 'engasgo_osso_carre',
    title: 'Engasgo Grave com Osso de Carré & Emergência 🦴🚨',
    context: 'Durante um almoço de domingo festivo, um pedaço de osso de carré travou na garganta! O ar falta e as pessoas ao redor entram em pânico.',
    badge: 'EMERGÊNCIA MÉDICA 🚨',
    minAge: 6,
    choices: [
      {
        id: 'c_engasgo_upa',
        text: 'Manobra de Heimlich imediata e socorro urgente no Pronto Socorro 🚑',
        preview: { saude: 15, felicidade: 10 },
        outcomeNarrative: 'A manobra rápida desobstruiu as vias aéreas a tempo! No hospital, você recebeu oxigênio e medicação antinflamatória. O susto passou com vida! (+15 Saúde, +10 Felicidade).',
        consequences: { saude: 15, felicidade: 10 }
      },
      {
        id: 'c_engasgo_sozinho',
        text: 'Tentar tomar água e tossir sozinho sem pedir socorro',
        preview: { saude: -35, saudeMental: -20 },
        outcomeNarrative: 'A tentativa agravou a sufocação, provocando falta de oxigênio e socorro de ambulância no último segundo (-35 Saúde, -20 Saúde Mental).',
        consequences: { saude: -35, saudeMental: -20 }
      }
    ]
  },
  {
    id: 'pet_queda_sacada',
    title: 'Acidente do Pet: Queda da Sacada / Janela 🐶🏥',
    context: 'Seu animal de estimação acabou saltando de uma altura considerável ao perseguir um pássaro e fraturou uma patinha! Ele gane de dor.',
    badge: 'ACIDENTE COM PET 🐕',
    minAge: 12,
    choices: [
      {
        id: 'c_pet_vet_emergencia',
        text: 'Correr imediatamente ao Hospital Veterinário 24h para cirurgia e ortopedia 🏥',
        preview: { grana: -750, felicidade: 15 },
        outcomeNarrative: 'A cirurgia veterinária colocou pino e gesso com perfeição! O pet recuperou-se sem sequelas e demonstrou gratidão imensa (-R$ 750, +15 Felicidade).',
        consequences: { grana: -750, felicidade: 15 }
      },
      {
        id: 'c_pet_improviso',
        text: 'Tentar fazer tala de madeira caseira em casa sem veterinário',
        preview: { felicidade: -25, saudeMental: -15 },
        outcomeNarrative: 'A fratura consolidou torta e o pet ficou manquinho, deixando a família triste por não ter buscado socorro especializado (-25 Felicidade, -15 Saúde Mental).',
        consequences: { felicidade: -25, saudeMental: -15 }
      }
    ]
  },
  {
    id: 'parente_internado_urgencia',
    title: 'Urgência Médica Familiar: Internação dos Pais 🏥❤️',
    context: 'Seu pai/mãe apresentou picos de pressão e falta de ar, exigindo internação e bateria de exames laboratoriais urgentes.',
    badge: 'SAÚDE DA FAMÍLIA 🏥',
    minAge: 18,
    choices: [
      {
        id: 'c_parente_particular',
        text: 'Pagar leito e exames particulares para agilizar a internação 💳',
        preview: { grana: -1600, felicidade: 20 },
        outcomeNarrative: 'O diagnóstico foi preciso e a medicação intravenosa controlou a crise rapidamente. Seu parente recebeu alta curado! (-R$ 1.600, +20 Felicidade).',
        consequences: { grana: -1600, felicidade: 20 }
      },
      {
        id: 'c_parente_sus_acompanhar',
        text: 'Acompanhar a internação na emergência do SUS dia e noite',
        preview: { energia: -25, felicidade: 10, saudeMental: -10 },
        outcomeNarrative: 'Foram noites mal dormidas na poltrona do hospital, mas você deu todo o suporte amoroso até a alta médica (-25 Energia, +10 Felicidade).',
        consequences: { energia: -25, felicidade: 10, saudeMental: -10 }
      }
    ]
  },
  {
    id: 'imprevisto_domestico_queda',
    title: 'Acidente Doméstico: Queda de Escada & Contusão 🤕💥',
    context: 'Ao tentar trocar uma lâmpada alta ou consertar o gesso da casa, a escada bambeou e você caiu de costas feio no chão.',
    badge: 'IMPREVISTO DOMÉSTICO 🤕',
    minAge: 14,
    choices: [
      {
        id: 'c_queda_pronto_socorro',
        text: 'Ir ao Pronto Socorro fazer raio-X e colocar gesso/tipóia',
        preview: { grana: -180, saude: 10 },
        outcomeNarrative: 'O raio-X constatou fissura no braço. A tipóia garantiu a cicatrização óssea correta em poucas semanas (-R$ 180, +10 Saúde).',
        consequences: { grana: -180, saude: 10 }
      },
      {
        id: 'c_queda_ignorar',
        text: 'Passar gelo, tomar analgésico por conta própria e ignorar a dor',
        preview: { saude: -30, felicidade: -20 },
        outcomeNarrative: 'A lesão não tratada inflamou as articulações, provocando dores crônicas severas durante meses (-30 Saúde, -20 Felicidade).',
        consequences: { saude: -30, felicidade: -20 }
      }
    ]
  },
  {
    id: 'baile_terceira_idade_convivencia',
    title: 'Baile da Terceira Idade & Centro de Convivência 💃🕺',
    context: 'O centro comunitário do bairro inaugurou o tradicional Baile da Saudade nas tardes de quinta-feira, com forró pé-de-serra, bolero, café com bolo e dezenas de aposentados animados.',
    badge: 'LAZER DA TERCEIRA IDADE 💃',
    minAge: 55,
    condition: (state: GameState) => Boolean(state.character.retired || state.character.age >= 60),
    choices: [
      {
        id: 'c_baile_dancar',
        text: 'Comprar sapato confortável e dançar forró até o fim da tarde (R$ 90) 👞',
        preview: { grana: -90, felicidade: 25, saudeMental: 15, saude: 5 },
        outcomeNarrative: 'Você dançou xote e bolero com energia contagiante! Fez novas amizades, exercitou o corpo e saiu revigorado (-R$ 90, +25 Felicidade, +15 Saúde Mental).',
        consequences: { grana: -90, felicidade: 25, saudeMental: 15, saude: 5 }
      },
      {
        id: 'c_baile_prosear',
        text: 'Ficar na mesa proseando, jogando conversa fora e provando quitutes (R$ 35) ☕',
        preview: { grana: -35, felicidade: 18, saudeMental: 10 },
        outcomeNarrative: 'Uma tarde deliciosa de muitas gargalhadas, causos antigos e café fresquinho com broa de milho (-R$ 35, +18 Felicidade).',
        consequences: { grana: -35, felicidade: 18, saudeMental: 10 }
      },
      {
        id: 'c_baile_ficar_em_casa',
        text: 'Achar que não tem mais pique e passar a tarde assistindo TV sozinho(a)',
        preview: { felicidade: -12, saudeMental: -8 },
        outcomeNarrative: 'A solidão da tarde pesou e você ficou com saudade dos velhos tempos (-12 Felicidade, -8 Saúde Mental).',
        consequences: { felicidade: -12, saudeMental: -8 }
      }
    ]
  },
  {
    id: 'checkup_anual_terceira_idade',
    title: 'Rotina Preventiva: Check-up Geriátrico & Exames Periódicos 🩺📋',
    context: 'Chegou o momento do check-up anual dos 60+: aferir pressão arterial, perfil lipídico, densitometria óssea e ajustar as receitas de remédios preventivos.',
    badge: 'SAÚDE RECORRENTE 🩺',
    minAge: 55,
    condition: (state: GameState) => Boolean(state.character.retired || state.character.age >= 60),
    choices: [
      {
        id: 'c_checkup_geriatra_completo',
        text: 'Fazer check-up completo com médico geriatra especialista (R$ 380) 🩺',
        preview: { grana: -380, saude: 20, saudeMental: 15, felicidade: 10 },
        outcomeNarrative: 'Exames detalhados garantiram prevenção nota dez e ajustes finos na medicação. Você tem a saúde e a tranquilidade de ferro! (-R$ 380, +20 Saúde, +15 Saúde Mental).',
        consequences: { grana: -380, saude: 20, saudeMental: 15, felicidade: 10 }
      },
      {
        id: 'c_checkup_sus_posto',
        text: 'Fazer bateria essencial de exames no posto de saúde da família',
        preview: { saude: 15, saudeMental: 10, energia: -15 },
        outcomeNarrative: 'Enfrentou um pouco de fila matinal no posto, mas colheu sangue e fez o eletrocardiograma certinho (+15 Saúde, -15 Energia).',
        consequences: { saude: 15, saudeMental: 10, energia: -15 }
      },
      {
        id: 'c_checkup_ignorar_medicos',
        text: 'Adiar exames dizendo que "quem procura acha" e tomar chás caseiros',
        preview: { saude: -25, saudeMental: -15, felicidade: -10 },
        outcomeNarrative: 'A pressão arterial desregulou silenciosamente, provocando tonturas frequentes e receio diário (-25 Saúde, -15 Saúde Mental).',
        consequences: { saude: -25, saudeMental: -15, felicidade: -10 }
      }
    ]
  },
  {
    id: 'excursao_melhor_idade_sesc',
    title: 'Excursão da Melhor Idade do SESC: Águas Termais & Relaxamento 🚌🌊',
    context: 'O grupo de veteranos do bairro convidou você para uma viagem de fim de semana para Poços de Caldas / Caldas Novas: banhos termais, passeios culturais e hotel com pensão completa.',
    badge: 'GESTÃO DO TEMPO LIVRE 🚌',
    minAge: 55,
    condition: (state: GameState) => Boolean(state.character.retired || state.character.age >= 60),
    choices: [
      {
        id: 'c_excursao_viajar_termas',
        text: 'Embarcar na caravana e desfrutar das piscinas termais relaxantes (R$ 650) 🌊',
        preview: { grana: -650, felicidade: 35, saudeMental: 20, saude: 10 },
        outcomeNarrative: 'Uma das melhores viagens da sua vida! As águas minerais aquecidas aliviaram as dores articulares e você voltou com a alma leve (-R$ 650, +35 Felicidade, +20 Saúde Mental).',
        consequences: { grana: -650, felicidade: 35, saudeMental: 20, saude: 10 }
      },
      {
        id: 'c_excursao_almoco_despedida',
        text: 'Participar apenas do almoço comemorativo de boas-vindas do grupo (R$ 80) 🍽️',
        preview: { grana: -80, felicidade: 15, saudeMental: 10 },
        outcomeNarrative: 'Ótima confraternização com churrasco e música ao vivo com velhos companheiros de jornada (-R$ 80, +15 Felicidade).',
        consequences: { grana: -80, felicidade: 15, saudeMental: 10 }
      },
      {
        id: 'c_excursao_recusar_fechar_casa',
        text: 'Recusar por comodismo de não querer arrumar mala e permanecer fechado(a)',
        preview: { felicidade: -15, saudeMental: -12 },
        outcomeNarrative: 'Vendo as fotos do pessoal se divertindo no grupo de WhatsApp, bateu aquele arrependimento de ter ficado em casa (-15 Felicidade, -12 Saúde Mental).',
        consequences: { felicidade: -15, saudeMental: -12 }
      }
    ]
  },
  {
    id: 'horta_comunitaria_bairro',
    title: 'Horta Orgânica & Jardinagem Matinal no Bairro 🌱🍅',
    context: 'Com as manhãs livres da aposentadoria, amigos e vizinhos propuseram transformar um terreno ensolarado da praça em uma horta comunitária de temperos, hortaliças e ervas medicinais.',
    badge: 'LAZER & NATUREZA 🌱',
    minAge: 55,
    condition: (state: GameState) => Boolean(state.character.retired || state.character.age >= 60),
    choices: [
      {
        id: 'c_horta_cultivar_investir',
        text: 'Adquirir mudas, terra adubada e regadores para liderar o plantio (R$ 120) 🥕',
        preview: { grana: -120, felicidade: 25, saudeMental: 20, saude: 10 },
        outcomeNarrative: 'Mexer na terra e ver brotar hortelã, alecrim e couve fresca trouxe paz profunda e propósito revigorante para sua rotina (-R$ 120, +25 Felicidade, +20 Saúde Mental).',
        consequences: { grana: -120, felicidade: 25, saudeMental: 20, saude: 10 }
      },
      {
        id: 'c_horta_colaborar_leve',
        text: 'Ajudar regando os canteiros e fazendo compostagem nas manhãs amenas',
        preview: { felicidade: 15, saudeMental: 12, saude: 8 },
        outcomeNarrative: 'O contato com o ar livre pela manhã regulou seu sono e você levou cheiro-verde fresco para casa (+15 Felicidade, +8 Saúde).',
        consequences: { felicidade: 15, saudeMental: 12, saude: 8 }
      },
      {
        id: 'c_horta_deixar_mato',
        text: 'Achar que cuidar de horta dá dor nas costas e ficar na frente das telas',
        preview: { felicidade: -10, saudeMental: -8 },
        outcomeNarrative: 'Passou a manhã rolando o feed de notícias ruins no celular, aumentando o desânimo (-10 Felicidade, -8 Saúde Mental).',
        consequences: { felicidade: -10, saudeMental: -8 }
      }
    ]
  },
  {
    id: 'campeonato_domino_praca',
    title: 'Torneio de Dominó & Carteado dos Mestres da Praça 🎲☕',
    context: 'Debaixo da amendoeira frondosa da praça central, veteranos aposentados organizaram o lendário Torneio de Dominó e Tranca de Fim de Tarde, com troféu simbólico e quitutes.',
    badge: 'SOCIALIZAÇÃO SÊNIOR 🎲',
    minAge: 55,
    condition: (state: GameState) => Boolean(state.character.retired || state.character.age >= 60),
    choices: [
      {
        id: 'c_domino_jogar_valendo',
        text: 'Inscrever-se na dupla, bolar estratégias e disputar o troféu (Taxa R$ 40) 🏆',
        preview: { grana: -40, felicidade: 28, intelecto: 15, saudeMental: 16 },
        outcomeNarrative: 'Bateu de ponta cruzada e conquistou o troféu de bronze com festa dos amigos! Raciocínio aguçado e muita alegria (-R$ 40, +28 Felicidade, +15 Intelecto, +16 Saúde Mental).',
        consequences: { grana: -40, felicidade: 28, intelecto: 15, saudeMental: 16 }
      },
      {
        id: 'c_domino_palpiteiro_pastel',
        text: 'Ficar na torcida como "palpiteiro de respeito", comendo pastel e café (R$ 20)',
        preview: { grana: -20, felicidade: 16, saudeMental: 10 },
        outcomeNarrative: 'Rendeu muitas risadas zoando as jogadas dos amigos enquanto saboreava um pastel crocante (-R$ 20, +16 Felicidade).',
        consequences: { grana: -20, felicidade: 16, saudeMental: 10 }
      },
      {
        id: 'c_domino_reclamar_barulho',
        text: 'Se incomodar com as batidas de pedra na mesa e reclamar da agitação',
        preview: { felicidade: -14, saudeMental: -10 },
        outcomeNarrative: 'O mau humor afastou conhecidos cordiais e você voltou para casa chateado(a) (-14 Felicidade, -10 Saúde Mental).',
        consequences: { felicidade: -14, saudeMental: -10 }
      }
    ]
  },
  {
    id: 'voluntariado_mentoria_sabedoria',
    title: 'Gestão do Tempo: Mentoria Comunitária & Sabedoria de Vida 🎓🤝',
    context: 'Uma biblioteca comunitária criou um projeto que conecta aposentados experientes a jovens aprendizes da periferia para oficinas de ofício, leitura e orientação profissional.',
    badge: 'GESTÃO DO TEMPO LIVRE 🎓',
    minAge: 55,
    condition: (state: GameState) => Boolean(state.character.retired || state.character.age >= 60),
    choices: [
      {
        id: 'c_mentoria_oferecer_oficina',
        text: 'Tornar-se mentor voluntário semanal e passar sua experiência adiante 🤝',
        preview: { felicidade: 30, saudeMental: 25, intelecto: 10 },
        outcomeNarrative: 'Ver os olhos dos jovens brilhando com seus conselhos trouxe um senso indescritível de legado e realização pessoal (+30 Felicidade, +25 Saúde Mental, +10 Intelecto).',
        consequences: { felicidade: 30, saudeMental: 25, intelecto: 10 }
      },
      {
        id: 'c_mentoria_doar_livros',
        text: 'Fazer uma boa doação de livros e materiais didáticos para o projeto (R$ 150) 📚',
        preview: { grana: -150, felicidade: 18, saudeMental: 12 },
        outcomeNarrative: 'Sua doação abasteceu a sala de estudos com novos clássicos e dicionários (-R$ 150, +18 Felicidade, +12 Saúde Mental).',
        consequences: { grana: -150, felicidade: 18, saudeMental: 12 }
      },
      {
        id: 'c_mentoria_desdenhar',
        text: 'Criticar os jovens dizendo que "na minha época não precisava disso" e se isolar',
        preview: { felicidade: -16, saudeMental: -14 },
        outcomeNarrative: 'O ressentimento geracional aumentou sua sensação de desconexão com o mundo atual (-16 Felicidade, -14 Saúde Mental).',
        consequences: { felicidade: -16, saudeMental: -14 }
      }
    ]
  }
];

export const BRAZILIAN_CITIES = [
  { name: 'São Paulo', state: 'SP', region: 'Sudeste', costMultiplier: 1.25, perk: 'Mais vagas no mercado financeiro e corporativo' },
  { name: 'Rio de Janeiro', state: 'RJ', region: 'Sudeste', costMultiplier: 1.15, perk: 'Praia, estilo de vida ao ar livre e cultura carioca' },
  { name: 'Belo Horizonte', state: 'MG', region: 'Sudeste', costMultiplier: 1.0, perk: 'Comida boa, botecos lendários e custo equilibrado' },
  { name: 'Salvador', state: 'BA', region: 'Nordeste', costMultiplier: 0.95, perk: 'Música, axé, calor humano e carnaval inigualável' },
  { name: 'Curitiba', state: 'PR', region: 'Sul', costMultiplier: 1.05, perk: 'Parques organizados, frio de inverno e transporte estruturado' },
  { name: 'Recife', state: 'PE', region: 'Nordeste', costMultiplier: 0.95, perk: 'Polo tecnológico (Porto Digital) e frevo contagiante' },
  { name: 'Brasília', state: 'DF', region: 'Centro-Oeste', costMultiplier: 1.2, perk: 'Meca dos concursos públicos e estabilidade governamental' },
  { name: 'Florianópolis', state: 'SC', region: 'Sul', costMultiplier: 1.15, perk: 'Qualidade de vida, startups de tecnologia e praias limpas' },
  { name: 'Fortaleza', state: 'CE', region: 'Nordeste', costMultiplier: 0.9, perk: 'Culinária litorânea, ventos fortes e povo acolhedor' },
  { name: 'Goiânia', state: 'GO', region: 'Centro-Oeste', costMultiplier: 0.95, perk: 'Sertanejo, agro forte e empadão goiano' }
];

export const INITIAL_ACHIEVEMENTS = [
  { id: 'primeiro_trampo', title: 'Carteira Assinada', description: 'Conquistou o primeiro emprego formal CLT no Brasil', icon: '📝', unlocked: false },
  { id: 'nome_limpo_ouro', title: 'Serasa Ouro', description: 'Alcançou Score acima de 800 no Serasa', icon: '🛡️', unlocked: false },
  { id: 'caramelo_friend', title: 'Pai de Pet Raiz', description: 'Adotou e cuidou do lendário vira-lata caramelo', icon: '🐕', unlocked: false },
  { id: 'celta_prata', title: 'Motorista Brasileiro', description: 'Comprou seu primeiro carro (ou Celta guerreiro)', icon: '🚗', unlocked: false },
  { id: 'concursado_ouro', title: 'Estabilidade Concursada', description: 'Foi aprovado e empossado em concurso público', icon: '🏛️', unlocked: false },
  { id: 'primeiro_ape', title: 'Dono do Próprio Apê', description: 'Conquistou a casa própria ou apartamento na Caixa', icon: '🔑', unlocked: false },
  { id: 'cem_k', title: 'Cem Mil na Conta', description: 'Acumulou mais de R$ 100.000 em patrimônio líquido', icon: '💰', unlocked: false },
  { id: 'vovo_saudavel', title: 'Terceira Idade Ativa', description: 'Completou 70 anos com saúde acima de 60%', icon: '🌴', unlocked: false },
  { id: 'sobrenatural_sus', title: 'Atendido no SUS', description: 'Cuidou da saúde na Unidade Básica de Saúde', icon: '🏥', unlocked: false },
  { id: 'influencer_viral', title: 'Influencer do Povo', description: 'Alcançou mais de 10.000 seguidores nas redes sociais', icon: '📱', unlocked: false },
  { id: 'tigrinho_sorte', title: 'Forrada no Tigrinho', description: 'Faturou uma grande aposta nos jogos de sorte', icon: '🐯', unlocked: false },
  { id: 'formatura_diploma', title: 'Diploma no Quadro', description: 'Concluiu a graduação e pegou o diploma de ensino superior', icon: '🎓', unlocked: false },
  { id: 'viagem_mundo', title: 'Passaporte Carimbado', description: 'Realizou uma viagem internacional inesquecível', icon: '✈️', unlocked: false },
  { id: 'casamento_ouro', title: 'Viveram Felizes', description: 'Casou-se em uma grande cerimônia com seu amor', icon: '💍', unlocked: false },
  { id: 'vida_longa', title: 'Lenda Viva (80+ Anos)', description: 'Chegou à fase final da vida com sabedoria acumulada', icon: '🌅', unlocked: false }
];
