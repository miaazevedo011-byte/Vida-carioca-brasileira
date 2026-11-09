export type LifePhase = 
  | '🧸 Infância (0–10a)'
  | '🎒 Adolescência (11–17a)'
  | '📚 Juventude (18–24a)'
  | '💼 Início Vida Adulta (25–35a)'
  | '🏠 Vida Adulta (36–50a)'
  | '⚖️ Meia-idade (51–60a)'
  | '🪑 Terceira Idade (61–75a)'
  | '🌅 Fase Final (76+a)';

export interface TalentTrait {
  name: string;
  icon: string;
  description: string;
  bonusType: 'ti' | 'vendas' | 'saude' | 'intelecto' | 'arte';
}

export interface Character {
  id: string;
  name: string;
  gender: 'M' | 'F' | 'NB';
  sexualOrientation: 'Heterossexual' | 'Homossexual' | 'Bissexual' | 'Pansexual' | 'Assexual' | 'Demissexual' | 'Polissexual' | 'Queer' | 'Fluida' | string;
  legoAvatar: string; // Icon/Theme Lego/Toy
  avatarImageUrl?: string;
  personality: string;
  talent?: TalentTrait;
  countryOfBirth: string;
  familyClass: 'Baixa (Periferia)' | 'Média-Baixa' | 'Média-Alta' | 'Rica (Elite)';
  age: number;
  year: number;
  birthCity: string;
  birthState: string;
  currentCity: string;
  originTrait: string;
  originDescription: string;
  alive: boolean;
  retired: boolean;
  deathCause?: string;
  hairStyle?: string;
  hairColor?: string;
  styleLook?: string;
  nailStyle?: string;
  eyebrows?: string;
  transGenderHistory?: boolean;
  birthZone?: 'urbano' | 'campo';
  appearance?: number;
  intelligence?: number;
  social?: number;
  birthStory?: string;
  artStyle?: 'Geométrico' | 'Ilustrado';
  lifeStyle?: 'Humilde' | 'Tranquilo' | 'Luxo';
  isInfertile?: boolean;
  avatarSkinTone?: string;
  avatarOutfit?: string;
  avatarAccessory?: string;
  autoAgingEnabled?: boolean;
}

export interface Stats {
  saude: number; // 0 - 100
  felicidade: number; // 0 - 100
  grana: number; // Reais (R$)
  energia: number; // 0 - 100
  intelecto: number; // 0 - 100
  saudeMental?: number; // 0 - 100
}

export interface Debt {
  id: string;
  credor: string;
  tipo: string;
  valorOriginal: number;
  valorNegociado: number;
  descontoPercent: number;
}

export interface SerasaProfile {
  score: number; // 0 - 1000
  status: 'negativado' | 'regular' | 'bom' | 'excelente';
  dividas: Debt[];
}

export interface JobBenefit {
  name: string;
  icon: string;
  valueDescription: string;
}

export interface CTPSHistoryEntry {
  id: string;
  title: string;
  companyOrOrg: string;
  type: string;
  salaryMonthly: number;
  startYear: number;
  endYear: number | string;
  exitReason?: string;
}

export interface Career {
  type: 'desempregado' | 'infantil' | 'jovem_aprendiz' | 'estagio' | 'clt' | 'pj' | 'concursado' | 'empresario' | 'bicos';
  title: string;
  category: string;
  salaryMonthly: number;
  companyOrOrg: string;
  yearsInJob: number;
  educationLevel: 'Nenhum' | 'Ensino Fundamental' | 'Ensino Fundamental Completo' | 'Ensino Médio' | 'Ensino Médio Completo' | 'Técnico' | 'Graduação' | 'Pós-Graduação' | string;
  collegeMajor?: string;
  collegeStatus?: 'cursando' | 'trancado' | 'formado';
  collegeSemester?: number;
  collegeTuitionMonthly?: number; // 0 se pública
  hasCarteiraAssinada: boolean;
  fgtsAccumulated: number;
  benefits?: JobBenefit[];
  efficiency?: number; // 0-100 work efficiency score
  admissionYear?: number;
  ctpsHistory?: CTPSHistoryEntry[];
  totalYearsWorked?: number; // Total de anos contribuídos para o INSS / previdência
  pensionMonthly?: number; // Benefício mensal recebido da aposentadoria
  retirementType?: 'inss' | 'privada' | 'misto'; // Modalidade de aposentadoria
  privatePensionBalance?: number; // Saldo acumulado em Previdência Privada (PGBL/VGBL)
  monthsWorkedInJob?: number;
  monthsSinceVacation?: number;
  vacationAvailable?: boolean;
}

export interface Loan {
  id: string;
  title: string;
  totalRemaining: number;
  installmentsRemaining: number;
  installmentValue: number;
}

export interface HomeItem {
  id: string;
  name: string;
  category: 'eletro' | 'movel' | 'lazer';
  icon: string;
  price: number;
  happinessBonus: number;
}

export interface HomeRenovation {
  id: string;
  name: string;
  icon: string;
  price: number;
  happinessBonus: number;
}

export interface Housing {
  id: string;
  name: string;
  type: 'pais' | 'aluguel' | 'proprio';
  monthlyCost: number;
  propertyValue: number;
  icon: string;
  itemsPurchased?: string[];
  renovationsCompleted?: string[];
}

export interface Vehicle {
  id: string;
  name: string;
  icon: string;
  yearlyMaintenance: number;
  value: number;
  customizations?: string[];
}

export interface Pet {
  name: string;
  type: string;
  breed: string;
  happinessBonus: number;
  monthlyCost: number;
  age: number;
}

export interface Relationship {
  status: 'solteiro' | 'ficando' | 'namorando' | 'casado';
  partnerName?: string;
  partnerAge?: number;
  partnerJob?: string;
  partnerBio?: string;
  affection: number; // 0-100
  yearsTogether: number;
  isEngaged?: boolean;
  unprotectedSexCount?: number;
  hasLover?: boolean;
  loverName?: string;
  loverAffection?: number;
  betrayalDiscoveriesCount?: number;
}

export interface CaixinhaTransaction {
  id: string;
  date: string;
  year?: number;
  type: 'deposito' | 'resgate' | 'rendimento';
  amount: number;
  balanceAfter?: number;
  description: string;
}

export interface CreditCardAccount {
  hasCard: boolean;
  tier: 'Nenhum' | 'Básico' | 'Gold' | 'Black';
  limit: number;
  used: number;
}

export interface CdbInvestment {
  id: string;
  title: string;
  amount: number;
  yieldRate: number; // e.g. 1.12 for 112% CDI
  lockYears: number; // 1, 2, or 3
  startYear: number;
  maturityYear: number;
}

export interface Finances {
  checkingBalance: number;
  cdiBalance: number;
  stocksBalance: number;
  creditCard: CreditCardAccount;
  creditCardLimit: number;
  creditCardUsed: number;
  loans: Loan[];
  hasPrivateHealthPlan?: boolean;
  caixinhaTransactions?: CaixinhaTransaction[];
  cdbInvestments?: CdbInvestment[];
  rentDepositPaid?: number;
}

export interface LogEntry {
  id: string;
  year: number;
  age: number;
  title: string;
  description: string;
  type: 'milestone' | 'financial' | 'career' | 'health' | 'love' | 'fun' | 'serasa';
  statDeltas?: {
    saude?: number;
    felicidade?: number;
    grana?: number;
    intelecto?: number;
    energia?: number;
    serasa?: number;
    saudeMental?: number;
    netWorth?: number;
  };
}

export interface Choice {
  id: string;
  text: string;
  preview: {
    saude?: number;
    felicidade?: number;
    grana?: number;
    intelecto?: number;
    energia?: number;
    serasa?: number;
    saudeMental?: number;
  };
  outcomeNarrative: string;
  consequences: {
    saude?: number;
    felicidade?: number;
    grana?: number;
    intelecto?: number;
    energia?: number;
    serasa?: number;
    saudeMental?: number;
    addDebt?: Debt;
    clearDebtId?: string;
    gainJob?: Partial<Career>;
    gainHousing?: Housing;
    gainVehicle?: Vehicle;
    gainPet?: Pet;
    gainPartner?: string;
    customAction?: string;
    retire?: {
      retirementType: 'inss' | 'privada' | 'misto';
      pensionMonthly: number;
    };
  };
}

export interface Dilemma {
  id: string;
  title: string;
  context: string;
  badge: string;
  minAge: number;
  maxAge?: number;
  condition?: (state: GameState) => boolean;
  choices: Choice[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAtAge?: number;
}

export interface ParentMember {
  name: string;
  role: 'Pai' | 'Mãe';
  age: number;
  job: string;
  affection: number;
  alive: boolean;
  health?: number; // 0-100 saúde
  maritalStatus?: 'casados' | 'viuvo' | 'recasado';
  newSpouseName?: string;
  newSpouseNickname?: 'Padrasto' | 'Madrasta' | 'Pai' | 'Mãe' | 'Moço' | 'Moça' | 'Tio' | 'Tia' | string;
  remarriedYear?: number;
  lastIllness?: string;
}

export interface SiblingMember {
  id: string;
  name: string;
  gender: 'M' | 'F';
  age: number;
  affection: number;
}

export interface ChildMember {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  isAdopted: boolean;
  isExtramarital?: boolean;
  isFromEx?: boolean;
  isUnplanned?: boolean;
  otherParentName?: string;
  affection: number;
}

export interface FriendInteraction {
  id: string;
  action: string;
  description: string;
  deltaAffection: number;
  date: string;
  timestamp: number;
}

export interface FriendMember {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'NB';
  type: 'amigo' | 'melhor_amigo' | 'amante' | 'ficante' | 'ex' | 'conhecido';
  affection: number; // 0-100
  intimacy: number; // 0-100
  job?: string;
  bio?: string;
  avatar?: string;
  metAt?: string;
  patrimonio?: string;
  hadAcceptedRecaida?: boolean;
  lastRecaidaYear?: number;
  interactionHistory?: FriendInteraction[];
}

export interface FamilyState {
  parents: ParentMember[];
  siblings: SiblingMember[];
  children?: ChildMember[];
  friends?: FriendMember[];
}

export interface SocialInfluencerState {
  followers: number;
  postsCount: number;
  totalEarningsFromPublis: number;
  fameLevel?: number; // 0-100
}

export interface FertilityState {
  hasVasectomy?: boolean;
  isUsingContraceptive?: boolean;
  hasEggDonated?: boolean;
}

export interface SuccessionShare {
  targetId: string;
  targetName: string;
  targetRelation: 'Cônjuge' | 'Filho(a)' | 'Pai' | 'Mãe' | 'Irmão(ã)' | 'Pet' | 'Caridade' | 'Outro';
  investmentsPercent: number; // 0 to 100
  propertyPercent: number; // 0 to 100
  companyPercent: number; // 0 to 100
  notes?: string;
}

export interface AdvancedWillState {
  isRegisteredInCartorio: boolean;
  cartorioName?: string;
  lastUpdatedYear: number;
  petCareFundAmount: number; // Montante em R$ reservado com exclusividade para o Pet
  petGuardianName?: string; // Nome do tutor legal que cuidará do Pet
  shares: SuccessionShare[];
  executorName?: string;
  charityPercent: number;
  legacyMessage?: string;
  beneficiary?: 'Filhos' | 'Cônjuge' | 'Pais' | 'Caridade' | 'Divisão Personalizada';
  percentageToCharity?: number;
}

export interface WillState {
  beneficiary: 'Filhos' | 'Cônjuge' | 'Pais' | 'Caridade' | 'Divisão Personalizada';
  percentageToCharity: number;
  advancedWill?: AdvancedWillState;
}

export interface SavedLifeSlot {
  id: string;
  slotName: string;
  characterName: string;
  avatarIcon: string;
  age: number;
  year: number;
  jobTitle: string;
  netWorth: number;
  savedAt: string;
  state: GameState;
}

export interface CompanyEmployee {
  id: string;
  name: string;
  role: string;
  salaryMonthly: number;
  morale: number; // 0-100
  skillLevel: number; // 0-100
  hiredAtYear: number;
}

export interface CompanyState {
  id: string;
  name: string;
  sector: 'Tecnologia' | 'Alimentação' | 'Varejo' | 'Serviços' | 'Moda' | 'Indústria';
  legalType: 'MEI' | 'LTDA' | 'S/A' | 'Franquia Nacional';
  valuation: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  employees: CompanyEmployee[];
  branchesCount: number;
  isFranchised: boolean;
  isPubliclyTraded: boolean;
  sharesOwnedPercent: number;
  reputation: number;
}

export interface InterviewOption {
  text: string;
  score: number;
  salaryModifier: number;
  bonusBenefit?: JobBenefit;
  feedbackNarrative: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  options: InterviewOption[];
}

export interface CreatorModeConfig {
  avatarIcon?: string;
  stickerStyle?: 'lego' | 'emoji' | 'cartoon' | 'anime';
  customJobTitle?: string;
  customSalary?: number;
}

export interface AgroState {
  hasLand: boolean;
  isArrendado: boolean;
  hectares: number; // Hectares arrendados ou próprios
  arrendamentoAnualPerHa?: number; // Custo do arrendamento anual por hectare
  cultivo: string | null; // ID da cultura ou null
  cropName?: string;
  cropIcon?: string;
  investimentoPerHa: number; // Investimento em tecnologia e insumos por hectare (R$)
  custoTotalSafra: number;
  marketPriceSacaCurrent?: number; // Preço atual da saca no mercado
  marketPriceVariationPercent?: number; // Variação de mercado (%)
  harvestCycleStage?: 'vazio' | 'plantado' | 'meio_safra' | 'pronto_colheita';
  meioSafraDilemma?: {
    id: string;
    title: string;
    description: string;
    threat: string;
    investCost: number;
    choiceMade?: 'aplicar' | 'economizar';
  } | null;
  cash: number;
  debt: number;
  nextHarvestYear: number;
  // Pecuária & Manejo de Animais
  cattleCount: number; // Cabeças de gado
  cattleBreed?: string; // Nelore, Angus, Girolando
  cattleSystem?: 'pasto' | 'confinamento';
  vaccinatedAftosa?: boolean;
  arrobaMarketPrice?: number; // Preço da @ do boi no mercado
  lastHarvestResult?: {
    cropName: string;
    sacasTotal: number;
    pricePerSaca: number;
    grossRevenue: number;
    totalCosts: number;
    netProfit: number;
    variationPercent: number;
    year: number;
  };
}

export interface InternationalState {
  isAbroad: boolean;
  currentCity: string;
  currency: string;
  visaStatus: 'turista' | 'temporario' | 'residente' | 'cidadão';
  daysInCountry: number;
}

export interface Classmate {
  id: string;
  name: string;
  age: number;
  relationshipScore: number;
  avatar: string;
  personality: string;
}

export interface DiagnosedDisease {
  id: string;
  name: string;
  stage: string;
  treatment: string;
  isIST: boolean;
  blocksUnprotectedSex: boolean;
}

export interface SeasonalEventState {
  name: string;
  icon: string;
  dailyClaimed: boolean;
  missionText: string;
  missionCompleted: boolean;
  rewardDescription: string;
}

export interface SubmundoBico {
  id: string;
  title: string;
  description: string;
  riskPercent: number;
  potentialEarnings: number;
  icon: string;
}

export interface EducationSystemState {
  currentStage: 'nenhum' | 'fundamental' | 'medio' | 'superior';
  fundamentalYearsDone: number; // 0 a 6
  medioYearsDone: number; // 0 a 6
  superiorYearsDone: number; // 0 a 4
  selectedCollegeCourse?: string; // 'medicina' | 'direito' | 'veterinaria' | 'farmacia' | 'psicologia' | 'psicopedagogia'
  graduatedCourses: string[];
  enemScore?: number;
  cursinhoEnem?: boolean;
  ejaEnemAvailable?: boolean;
  posGraduationDone?: boolean;
  doutoradoDone?: boolean;
  classmates?: Classmate[];
}

export interface EducationHistory {
  level: 'Fundamental' | 'Médio' | 'Superior';
  institution: string;
  hasEnem: boolean;
  hasFies: boolean;
  debt: number;
}

export interface DriverLicenseState {
  hasCategoryA: boolean; // Moto
  hasCategoryB: boolean; // Carro
  issuedAtAge?: number;
}

export interface WeeklyScheduleItem {
  id: 'estudos' | 'terapia' | 'trabalho_extra';
  name: string;
  icon: string;
  enabled: boolean;
  dayOfWeek: 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado' | 'Domingo';
  shift: 'Manhã' | 'Tarde' | 'Noite';
  cost: number;
  earnings: number;
  effectsDescription: string;
}

export interface WeeklyScheduleState {
  items: WeeklyScheduleItem[];
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  category: 'consumavel' | 'colecionavel' | 'saude';
  quantity: number;
  description: string;
  effects: {
    energia?: number;
    felicidade?: number;
    saude?: number;
    saudeMental?: number;
  };
}

export interface GameState {
  slotId?: string;
  character: Character;
  stats: Stats;
  serasa: SerasaProfile;
  career: Career;
  finances: Finances;
  housing: Housing;
  vehicle?: Vehicle;
  pet?: Pet;
  relationship: Relationship;
  family?: FamilyState;
  influencer?: SocialInfluencerState;
  fertility?: FertilityState;
  will?: WillState;
  company?: CompanyState;
  agro?: AgroState;
  international?: InternationalState;
  driverLicense?: DriverLicenseState;
  education?: EducationHistory;
  educationSystem?: EducationSystemState;
  resolvedConflicts?: string[];
  logs: LogEntry[];
  currentDilemma: Dilemma | null;
  achievements: Achievement[];
  selectedTab: 'historia' | 'carreira' | 'financas' | 'patrimonio' | 'familia' | 'mais' | 'roles' | 'agro' | 'exterior';
  soundEnabled?: boolean;
  timeRewindsLeft?: number;
  creatorModeEnabled?: boolean;
  timeAdvanceMode?: 'anual' | 'semestral' | 'mensal';
  timeSubPeriod?: number; // Para semestral: 1 ou 2. Para mensal: 1 a 12
  currentNews?: any; // BrazilNews
  diseases?: DiagnosedDisease[];
  seasonalEvent?: SeasonalEventState;
  courageScore?: number;
  hauntedHousesOwned?: boolean;
  isGhostAfterDeath?: boolean;
  weeklySchedule?: WeeklyScheduleState;
  inventory?: InventoryItem[];
}
