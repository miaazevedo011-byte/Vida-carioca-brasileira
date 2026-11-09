import React, { useState } from 'react';
import { Career, JobBenefit, Stats, Character, EducationSystemState } from '../../types/game';
import { AVAILABLE_JOBS, CONCURSOS_PUBLICOS, JobListing, ConcursoListing, CollegeMajor, getRequiredMajorForJob, checkPlayerHasRequiredMajor } from '../../data/careers';
import { Briefcase, Building, GraduationCap, Award, CheckCircle2, FileText, ArrowRight, TrendingUp, Shield, Zap, Sparkles, Send, Lock } from 'lucide-react';
import { SelectionExamModal } from '../SelectionExamModal';
import { EducationModule } from '../EducationModule';
import { playClickSound, playSuccessSound, playCoinSound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { LegoMinifigHead } from '../LegoMinifigHead';

interface CareerTabProps {
  character: Character;
  career: Career;
  stats: Stats;
  educationSystem?: EducationSystemState;
  onApplyJob: (job: JobListing) => { success: boolean; message: string };
  onTakeConcurso: (concurso: ConcursoListing) => { success: boolean; message: string };
  onEnrollCollege: (major: CollegeMajor) => { success: boolean; message: string };
  onRequestPromotion: () => { success: boolean; message: string; salaryRaise?: number };
  onAdvanceSchoolYear: (level: 'fundamental' | 'medio') => { success: boolean; message: string; graduated?: boolean };
  onStudyDaily: (level: 'fundamental' | 'medio' | 'superior') => { success: boolean; message: string };
  onAdvanceCollegeYear: () => { success: boolean; message: string; graduated?: boolean };
  onUseBenefitAction?: (benefitName: string) => { success: boolean; message: string };
  onTriggerWorkplaceDilemma?: () => { success: boolean; message: string };
  onRetire?: (type: 'inss' | 'privada' | 'misto') => { success: boolean; message: string };
  onDoWorkAction?: (type: string) => { success: boolean; message: string };
  onOpenJobVacanciesModal?: () => void;
  onDoSideJob?: (jobType: 'vender_suco' | 'bala_sinal' | 'limpar_carro' | 'passear_animais') => { success: boolean; message: string };
  onTakeVacation?: () => { success: boolean; message: string };
}

export const CareerTab: React.FC<CareerTabProps> = ({
  character,
  career,
  stats,
  educationSystem = {
    currentStage: 'fundamental',
    fundamentalYearsDone: 0,
    medioYearsDone: 0,
    superiorYearsDone: 0,
    graduatedCourses: []
  },
  onApplyJob,
  onTakeConcurso,
  onEnrollCollege,
  onRequestPromotion,
  onAdvanceSchoolYear,
  onStudyDaily,
  onAdvanceCollegeYear,
  onUseBenefitAction,
  onTriggerWorkplaceDilemma,
  onRetire,
  onDoWorkAction,
  onOpenJobVacanciesModal,
  onDoSideJob,
  onTakeVacation
}) => {
  const [activeCategory, setActiveCategory] = useState<'empregos' | 'concursos' | 'ensino'>('empregos');
  const [selectedJobCategory, setSelectedJobCategory] = useState<string>('TODAS');
  const [selectedConcursoEdu, setSelectedConcursoEdu] = useState<string>('TODOS');
  const [onlyEligible, setOnlyEligible] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedBenefitsModal, setSelectedBenefitsModal] = useState<{ title: string; benefits?: JobBenefit[] } | null>(null);
  const [isCtpsModalOpen, setIsCtpsModalOpen] = useState(false);
  const [dilemmaChosen, setDilemmaChosen] = useState<'clt' | 'pj' | null>(null);

  // 5-Question Selection Exam Modal State
  const [examModal, setExamModal] = useState<{
    isOpen: boolean;
    type: 'emprego' | 'concurso' | 'faculdade';
    title: string;
    subtitle: string;
    categoryHint?: string;
    targetJob?: JobListing;
    targetConcurso?: ConcursoListing;
    targetMajor?: CollegeMajor;
  } | null>(null);

  const showMsg = (res: { success: boolean; message: string }) => {
    setFeedback(res.message);
    if (res.success) {
      playSuccessSound();
      confetti({ particleCount: 30, spread: 60 });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleApplyJobClick = (job: JobListing) => {
    playClickSound();

    // Requisito Rígido de Faculdade
    const reqMajor = getRequiredMajorForJob(job);
    if (reqMajor) {
      const check = checkPlayerHasRequiredMajor(reqMajor, career, educationSystem);
      if (!check.hasDegree) {
        playClickSound();
        showMsg({
          success: false,
          message: `🚨 Requisito Rígido! A vaga de "${job.title}" exige diploma de graduação em ${reqMajor}. Você só pode prestar a prova se tiver feito essa faculdade!`
        });
        return;
      }
    } else if (job.minEducation.includes('Graduação') || job.minEducation.includes('Pós')) {
      const hasAnyDegree = (educationSystem?.graduatedCourses && educationSystem.graduatedCourses.length > 0) || career.collegeStatus === 'formado' || (career.educationLevel && career.educationLevel.toLowerCase().includes('graduado'));
      if (!hasAnyDegree) {
        showMsg({
          success: false,
          message: `🚨 Requisito Rígido! A vaga de "${job.title}" exige Ensino Superior (Graduação). Forme-se na faculdade antes de prestar a prova!`
        });
        return;
      }
    }

    setExamModal({
      isOpen: true,
      type: 'emprego',
      title: `Processo Seletivo: ${job.title}`,
      subtitle: `Avaliação de 5 perguntas para admissão na ${job.company}`,
      categoryHint: reqMajor === 'Medicina' ? 'saude' : reqMajor === 'Engenharia' ? 'engenharia' : reqMajor === 'Direito' ? 'direito' : job.category === 'TI & Comunicação' ? 'tecnologia' : job.category === 'Saúde & Cuidados' ? 'saude' : undefined,
      targetJob: job
    });
  };

  const handleTakeConcursoClick = (conc: ConcursoListing) => {
    playClickSound();
    if (stats.grana < conc.subscriptionFee) {
      showMsg({ success: false, message: `Saldo insuficiente para pagar a taxa de inscrição de R$ ${conc.subscriptionFee}.` });
      return;
    }

    // Requisito Rígido de Concurso
    const reqMajor = getRequiredMajorForJob(conc);
    if (reqMajor) {
      const check = checkPlayerHasRequiredMajor(reqMajor, career, educationSystem);
      if (!check.hasDegree) {
        showMsg({
          success: false,
          message: `🚨 Requisito Rígido! O concurso de "${conc.title}" exige diploma de Ensino Superior em ${reqMajor}. Forme-se na faculdade para poder prestar a prova!`
        });
        return;
      }
    } else if (conc.minEducationRequired === 'Ensino Superior') {
      const hasAnyDegree = (educationSystem?.graduatedCourses && educationSystem.graduatedCourses.length > 0) || career.collegeStatus === 'formado' || (career.educationLevel && career.educationLevel.toLowerCase().includes('graduado'));
      if (!hasAnyDegree) {
        showMsg({
          success: false,
          message: `🚨 Requisito Rígido! Este concurso exige diploma de Ensino Superior. Conclua a graduação antes de prestar o concurso!`
        });
        return;
      }
    }

    setExamModal({
      isOpen: true,
      type: 'concurso',
      title: `Concurso Público: ${conc.title}`,
      subtitle: `Prova Oficial da banca para ${conc.organ} • 5 Questões`,
      categoryHint: conc.title.includes('Delegado') || conc.title.includes('Juiz') ? 'direito' : conc.title.includes('Médico') ? 'saude' : reqMajor === 'Engenharia' ? 'engenharia' : 'legislacao_etica',
      targetConcurso: conc
    });
  };

  const handleStartCollegeClick = (major: CollegeMajor) => {
    playClickSound();
    if (character.age < 18) {
      showMsg({
        success: false,
        message: '🚨 Requisito de Idade: Menores de 18 anos não podem cursar Ensino Superior! Complete 18 anos para prestar o vestibular.'
      });
      return;
    }
    setExamModal({
      isOpen: true,
      type: 'faculdade',
      title: `Vestibular de Ingresso: ${major.name}`,
      subtitle: `Processo Seletivo para o Ensino Superior (4 anos) • 5 Questões`,
      categoryHint: (
        major.id === 'medicina' || major.category === 'Saúde' ? 'saude' :
        major.id === 'direito' ? 'direito' :
        major.id === 'veterinaria' ? 'veterinaria' :
        major.id === 'farmacia' ? 'farmacia' :
        major.id === 'psicologia' ? 'psicologia' :
        major.id === 'psicopedagogia' || major.category === 'Educação' ? 'psicopedagogia' :
        major.category === 'Exatas' ? 'engenharia' :
        major.category === 'Tecnologia' ? 'tecnologia' :
        'conhecimentos_gerais'
      ) as any,
      targetMajor: major
    });
  };

  const handleExamPass = () => {
    if (!examModal) return;
    if (examModal.type === 'emprego' && examModal.targetJob) {
      const res = onApplyJob(examModal.targetJob);
      showMsg(res);
    } else if (examModal.type === 'concurso' && examModal.targetConcurso) {
      const res = onTakeConcurso(examModal.targetConcurso);
      showMsg(res);
    } else if (examModal.type === 'faculdade' && examModal.targetMajor) {
      const res = onEnrollCollege(examModal.targetMajor);
      showMsg(res);
    }
    setExamModal(null);
  };

  const handleExamFail = (msg: string) => {
    showMsg({ success: false, message: msg });
    setExamModal(null);
  };

  const handleUseBenefit = (benefitName: string) => {
    playClickSound();
    if (onUseBenefitAction) {
      const res = onUseBenefitAction(benefitName);
      showMsg(res);
    } else {
      showMsg({ success: true, message: `Benefício "${benefitName}" utilizado com sucesso!` });
    }
  };

  const handleInternalWorkAction = (type: string) => {
    playClickSound();
    if (onDoWorkAction) {
      const res = onDoWorkAction(type);
      showMsg(res);
      return;
    }

    if (type === 'hora_extra') {
      playCoinSound();
      showMsg({ success: true, message: 'Hora extra realizada! +R$ 220 na conta e +4% de desempenho!' });
    } else if (type === 'papo_chefe') {
      showMsg({ success: true, message: 'Boa conversa com a chefia! Relação laboral fortalecida (+Carisma)!' });
    } else if (type === 'ideia') {
      showMsg({ success: true, message: 'Apresentou nova ideia de otimização para a equipe! Reconhecimento ganho!' });
    } else if (type === 'bico_brigadeiro') {
      playCoinSound();
      showMsg({ success: true, message: 'Vendeu todos os brigadeiros no ponto de ônibus! +R$ 65 no bolso!' });
    } else if (type === 'bico_pc') {
      playCoinSound();
      showMsg({ success: true, message: 'Montou o PC Gamer com sucesso! +R$ 150 de renda extra!' });
    }
  };

  const isJobEligible = (job: JobListing) => {
    const ageOk = character.age >= job.minAge && (!job.maxAge || character.age <= job.maxAge);
    if (!ageOk) return false;
    const fundamentalDone = (educationSystem.fundamentalYearsDone || 0) >= 6;
    const medioDone = (educationSystem.medioYearsDone || 0) >= 3;
    const hasSuperior = (educationSystem.graduatedCourses || []).length > 0 || career.collegeStatus === 'formado';

    const reqMajor = getRequiredMajorForJob(job);
    if (reqMajor) {
      const check = checkPlayerHasRequiredMajor(reqMajor, career, educationSystem);
      if (!check.hasDegree) return false;
    }

    if ((job.minEducation.includes('Graduação') || job.minEducation.includes('Pós')) && !hasSuperior) return false;
    if (job.minEducation.includes('Médio') && !medioDone) return false;
    if (job.minEducation.includes('Fundamental') && !fundamentalDone) return false;
    return true;
  };

  const filteredJobs = AVAILABLE_JOBS.filter((job) => {
    const ageOk = character.age >= job.minAge && (!job.maxAge || character.age <= job.maxAge);
    const categoryOk = selectedJobCategory === 'TODAS' || job.category === selectedJobCategory;
    const eligibleOk = !onlyEligible || isJobEligible(job);
    return ageOk && categoryOk && eligibleOk;
  });

  const filteredConcursos = CONCURSOS_PUBLICOS.filter((c) => {
    const eduOk = selectedConcursoEdu === 'TODOS' || c.minEducationRequired === selectedConcursoEdu;
    return character.age >= c.minAge && eduOk;
  });

  const efficiency = career.efficiency || 82;
  const reputation = Math.min(100, Math.round(efficiency * 0.55));
  const estresse = Math.max(10, Math.min(95, 100 - stats.energia));

  return (
    <div className="flex flex-col w-full gap-4 pb-8 text-left animate-fade-in">
      {/* Sub-header de Status / Mini-Card de Perfil Modular (conforme mockup carreira_empregos_com_cabe_a_lego) */}
      <section className="bg-white rounded-2xl p-4 shadow-[0_4px_16px_rgba(22,29,24,0.06)] relative overflow-hidden border border-[#bdcabf]">
        {/* Top Stud Deco (LEGO studs ambientais sutis) */}
        <div className="absolute -top-3 right-6 flex gap-2 opacity-25 pointer-events-none">
          <div className="w-6 h-6 rounded-full bg-[#bdcabf] shadow-[0_2px_0_0_#6e7a71]" />
          <div className="w-6 h-6 rounded-full bg-[#bdcabf] shadow-[0_2px_0_0_#6e7a71]" />
          <div className="w-6 h-6 rounded-full bg-[#bdcabf] shadow-[0_2px_0_0_#6e7a71]" />
        </div>

        <div className="flex items-center gap-3.5">
          {/* Minifigure Avatar Box */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-[#fdbb2d] flex flex-col items-center justify-center shadow-[0_4px_0_0_#6d4d00] relative pt-1 p-1">
              <LegoMinifigHead avatarId={character.legoAvatar || 'lucas_ondulado'} avatarImageUrl={character.avatarImageUrl} size="md" className="w-full h-full" />
              {/* Crachá miniatura preso ao peito */}
              <Award className="w-3.5 h-3.5 text-[#0077b6] absolute bottom-1 right-1" />
            </div>
          </div>

          {/* Info Pessoal & Salário */}
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-heading font-black text-base sm:text-lg text-[#161d18] truncate">{character.name}</span>
              <span className="text-[10px] bg-[#e3eae1] text-[#3e4941] px-2 py-0.5 rounded-full font-heading font-bold">
                {character.age} anos
              </span>
            </div>
            <p className="text-xs text-[#006740] font-heading font-bold truncate">
              {career.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-[#e9f0e7] text-[#161d18] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                <span>💰</span>
                {career.salaryMonthly > 0 ? `R$ ${career.salaryMonthly.toLocaleString('pt-BR')}/mês` : 'R$ 0/mês'}
              </span>
              <span className="text-[10px] text-[#0d8253] font-extrabold uppercase">Líquido</span>
            </div>
          </div>
        </div>

        {/* Barra de Desempenho no Emprego Atual */}
        {character.age >= 18 && career.type !== 'desempregado' ? (
          <div className="mt-3.5 pt-2 bg-[#eef6ec] p-3 rounded-xl border border-[#dde4db]">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#006740]" />
                <span className="font-heading font-bold text-xs text-[#161d18]">Desempenho no Trabalho • {career.companyOrOrg || 'Empresa'}</span>
              </div>
              <span className="font-heading font-black text-xs text-[#006740]">{efficiency}%</span>
            </div>

            {/* Barra de progresso modular segmentada (Estilo tijolos Lego) */}
            <div className="w-full h-3 bg-[#dde4db] rounded-full overflow-hidden p-0.5 flex items-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
              <div className="h-full bg-[#0d8253] rounded-full relative transition-all duration-500" style={{ width: `${efficiency}%` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              </div>
            </div>

            <div className="flex items-center justify-between mt-1.5 text-xs">
              <span className="text-[10px] text-[#3e4941] font-heading">Próxima meta:</span>
              <span className="text-[10px] text-[#004a74] font-heading font-bold flex items-center gap-1">
                <Award className="w-3 h-3 text-[#005e91]" /> Promoção de Carreira
              </span>
            </div>

            {/* Indicadores Rápidos: Reputação e Estresse */}
            <div className="grid grid-cols-2 gap-2 mt-2.5">
              <div className="bg-white rounded-xl p-2 flex items-center justify-between border border-[#dde4db]">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-md bg-[#cde5ff] flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5 text-[#005e91]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#3e4941] font-heading font-bold">Reputação</span>
                    <span className="text-xs font-heading font-bold text-[#161d18]">{reputation}%</span>
                  </div>
                </div>
                <div className="w-8 h-1.5 bg-[#dde4db] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0077b6] rounded-full" style={{ width: `${reputation}%` }} />
                </div>
              </div>

              <div className="bg-white rounded-xl p-2 flex items-center justify-between border border-[#dde4db]">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-md bg-[#ffdad6] flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-[#ba1a1a]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#3e4941] font-heading font-bold">Estresse</span>
                    <span className="text-xs font-heading font-bold text-[#ba1a1a]">{estresse}%</span>
                  </div>
                </div>
                <div className="w-8 h-1.5 bg-[#dde4db] rounded-full overflow-hidden">
                  <div className="h-full bg-[#ba1a1a] rounded-full" style={{ width: `${estresse}%` }} />
                </div>
              </div>
            </div>
          </div>
        ) : character.age < 18 ? (
          <div className="mt-3.5 p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2 text-xs text-amber-900">
            <span className="text-base">🎓</span>
            <div>
              <span className="font-bold block text-amber-950">Fase Escolar ({character.age} anos)</span>
              <span className="text-[11px] text-amber-800">Você é estudante. Acompanhe suas notas e progresso escolar na sub-aba Área de Estudo.</span>
            </div>
          </div>
        ) : (
          <div className="mt-3.5 p-3 bg-[#eef6ec] rounded-xl border border-[#dde4db] flex items-center gap-2 text-xs text-[#161d18]">
            <span className="text-base">🔍</span>
            <div>
              <span className="font-bold block text-[#006740]">Atualmente sem Vínculo de Trabalho</span>
              <span className="text-[11px] text-[#3e4941]">Candidate-se a vagas de emprego ou concursos no quadro abaixo para ingressar no mercado de trabalho.</span>
            </div>
          </div>
        )}
      </section>

      {/* FEEDBACK BANNER */}
      {feedback && (
        <div className="p-3 bg-[#e2ffe9] border border-[#006740] text-[#005232] text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs animate-fade-in">
          <Sparkles className="w-4 h-4 flex-shrink-0 text-[#006740]" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 1. MEU EMPREGO ATUAL (Crachá LEGO) */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-heading font-black text-sm sm:text-base text-[#161d18] flex items-center gap-1.5">
            <span className="text-lg">💼</span>
            Meu Emprego Atual
          </h2>
          <span className="text-[10px] font-heading font-bold bg-[#93f7be] text-[#005232] px-2.5 py-0.5 rounded-full">
            {character.age < 18 ? 'Estudante (Menor de Idade)' : career.type === 'desempregado' ? 'Sem Vínculo' : `${career.type.toUpperCase()} Ativa`}
          </span>
        </div>

        {character.age < 18 ? (
          <div className="bg-white rounded-2xl p-4 shadow-sm relative border-t-4 border-t-amber-500 border border-[#dde4db] space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl shrink-0">🎓</div>
              <div>
                <h3 className="font-heading font-black text-sm text-[#161d18]">Menor Aprendiz / Estudante</h3>
                <p className="text-xs text-slate-500">Você tem {character.age} anos. Carreiras formais e empregos em regime CLT só podem ser assumidos ao completar 18 anos.</p>
              </div>
            </div>
          </div>
        ) : career.type === 'desempregado' ? (
          <div className="bg-white rounded-2xl p-4 shadow-sm relative border-t-4 border-t-blue-500 border border-[#dde4db] space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl shrink-0">🔍</div>
              <div>
                <h3 className="font-heading font-black text-sm text-[#161d18]">Disponível para o Mercado</h3>
                <p className="text-xs text-slate-500">Você tem 18+ anos e está pronto para trabalhar. Escolha uma vaga de emprego ou concurso público para se candidatar.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4 shadow-sm relative border-t-4 border-t-[#0d8253] border border-[#dde4db]">
            <div className="flex items-start justify-between pb-3 mb-3 bg-[#eef6ec]/60 -mx-4 -mt-4 px-4 pt-4 rounded-t-xl border-b border-[#dde4db]">
              <div>
                <span className="text-[10px] font-heading font-bold text-[#3e4941] uppercase tracking-wider">Empresa Contratante</span>
                <h3 className="font-heading font-black text-sm sm:text-base text-[#161d18] flex items-center gap-1">
                  {career.companyOrOrg || 'Varejo Express SP'}
                  <CheckCircle2 className="w-4 h-4 text-[#006740]" />
                </h3>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#e3eae1] flex items-center justify-center shadow-[0_2px_0_0_#bdcabf]">
                <span className="text-sm">🏢</span>
              </div>
            </div>

            {/* Detalhes do Contrato */}
            <div className="grid grid-cols-2 gap-2 text-[#161d18] mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">⏱️</span>
                <div>
                  <p className="text-[10px] text-[#3e4941] font-heading">Jornada</p>
                  <p className="font-heading font-bold text-xs">30h sem. (6h/dia)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">🍽️</span>
                <div>
                  <p className="text-[10px] text-[#3e4941] font-heading">Benefícios</p>
                  <p className="font-heading font-bold text-xs">{career.benefits?.length ? `${career.benefits.length} benefícios ativos` : 'VT + VR'}</p>
                </div>
              </div>
            </div>

            {/* Grade de Ações no Emprego Atual (Botões Táteis) */}
            <div className="grid grid-cols-2 gap-2">
              {/* Ação 1: Hora Extra */}
              <button
                type="button"
                onClick={() => handleInternalWorkAction('hora_extra')}
                className="text-left bg-[#eef6ec] hover:bg-[#e3eae1] rounded-xl p-2.5 shadow-[0_3px_0_0_#bdcabf] active:translate-y-0.5 active:shadow-none transition-all flex flex-col justify-between cursor-pointer border border-[#dde4db]"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-base">⏳</span>
                  <span className="text-[10px] font-heading font-black text-[#006740]">+R$ 220</span>
                </div>
                <span className="font-heading font-bold text-xs text-[#161d18]">Fazer Hora Extra</span>
                <span className="text-[9px] text-[#ba1a1a] mt-0.5 flex items-center gap-0.5 font-bold">
                  ▲ +Estresse
                </span>
              </button>

              {/* Ação 2: Conversa com Chefe */}
              <button
                type="button"
                onClick={() => handleInternalWorkAction('papo_chefe')}
                className="text-left bg-[#eef6ec] hover:bg-[#e3eae1] rounded-xl p-2.5 shadow-[0_3px_0_0_#bdcabf] active:translate-y-0.5 active:shadow-none transition-all flex flex-col justify-between cursor-pointer border border-[#dde4db]"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-base">💬</span>
                  <span className="text-[10px] font-heading font-black text-[#005e91]">+Carisma</span>
                </div>
                <span className="font-heading font-bold text-xs text-[#161d18]">Puxar Papo c/ Chefe</span>
                <span className="text-[9px] text-[#3e4941] mt-0.5 font-medium">+Relação laboral</span>
              </button>

              {/* Ação 3: Apresentar Nova Ideia */}
              <button
                type="button"
                onClick={() => handleInternalWorkAction('ideia')}
                className="text-left bg-[#eef6ec] hover:bg-[#e3eae1] rounded-xl p-2.5 shadow-[0_3px_0_0_#bdcabf] active:translate-y-0.5 active:shadow-none transition-all flex flex-col justify-between cursor-pointer border border-[#dde4db]"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-base">💡</span>
                  <span className="text-[10px] font-heading font-black text-[#7c5800]">Risco 50%</span>
                </div>
                <span className="font-heading font-bold text-xs text-[#161d18]">Apresentar Nova Ideia</span>
                <span className="text-[9px] text-[#3e4941] mt-0.5 font-medium">Promoção ou Bronca</span>
              </button>

              {/* Ação 4: Pedir Aumento */}
              <button
                type="button"
                onClick={() => showMsg(onRequestPromotion())}
                className="text-left bg-[#eef6ec] hover:bg-[#e3eae1] rounded-xl p-2.5 shadow-[0_3px_0_0_#bdcabf] active:translate-y-0.5 active:shadow-none transition-all flex flex-col justify-between cursor-pointer border border-[#dde4db]"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-base">📈</span>
                  <span className="text-[10px] font-heading font-black text-[#006740]">Min: 85% Des.</span>
                </div>
                <span className="font-heading font-bold text-xs text-[#161d18]">Pedir Aumento</span>
                <span className="text-[9px] text-[#3e4941] mt-0.5 font-medium">Requer aprovação</span>
              </button>
            </div>

            {/* FÉRIAS REMUNERADAS (30 Dias + 1/3 do Salário + 100% Energia & Saúde Mental) */}
            {(['clt', 'concursado', 'estagio', 'jovem_aprendiz'].includes(career.type) || career.hasCarteiraAssinada) && (
              <div className="mt-3 p-3 rounded-xl bg-[#e2ffe9] border border-[#006740] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">🏖️</span>
                    <div>
                      <h4 className="font-heading font-black text-xs text-[#005232]">Férias Remuneradas (30 Dias)</h4>
                      <p className="text-[10px] text-[#006740] font-medium leading-snug">
                        Direito constitucional a 30 dias de descanso com 1/3 de bônus (R$ {Math.round((career.salaryMonthly || 0) / 3).toLocaleString('pt-BR')}) e recuperação de 100% da Energia e Saúde Mental.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white text-[#006740] shrink-0 border border-[#006740]/30 shadow-xs">
                    {(career.monthsSinceVacation || 0) >= 12 || (career.yearsInJob || 0) >= 1 || career.vacationAvailable ? 'Disponível ✨' : `${career.monthsSinceVacation || 0}/12 meses`}
                  </span>
                </div>

                {(career.monthsSinceVacation || 0) >= 12 || (career.yearsInJob || 0) >= 1 || career.vacationAvailable ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (onTakeVacation) {
                        const res = onTakeVacation();
                        showMsg(res);
                      }
                    }}
                    className="w-full py-2 bg-[#006740] hover:bg-[#0d8253] text-white font-heading font-black text-xs rounded-xl shadow-[0_3px_0_0_#005232] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>🏖️ Tirar 30 Dias de Férias Remuneradas (+R$ {Math.round((career.salaryMonthly || 0) / 3).toLocaleString('pt-BR')})</span>
                  </button>
                ) : (
                  <div className="w-full bg-white/80 p-2 rounded-lg border border-[#006740]/20 flex items-center justify-between text-[10px] text-[#005232]">
                    <span className="font-bold">⏳ Em acúmulo de período aquisitivo</span>
                    <span className="font-mono font-bold">{career.monthsSinceVacation || 0}/12 meses trabalhados</span>
                  </div>
                )}
              </div>
            )}

            {/* Quick Access to CTPS and Benefits */}
            <div className="pt-3 mt-3 border-t border-[#dde4db] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => { playClickSound(); setIsCtpsModalOpen(true); }}
                className="py-1.5 px-3 rounded-xl bg-[#e9f0e7] hover:bg-[#dde4db] text-[#161d18] font-heading font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-[#bdcabf]"
              >
                <FileText className="w-3.5 h-3.5 text-[#006740]" />
                <span>CTPS Digital 📘</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBenefitsModal({ title: career.title, benefits: career.benefits })}
                className="py-1.5 px-3 rounded-xl bg-[#fdbb2d] hover:bg-[#ffdea8] text-[#271900] font-heading font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Award className="w-3.5 h-3.5 text-[#7c5800]" />
                <span>Benefícios ({career.benefits?.length || 0}) ✨</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 4. DILEMA PROFISSIONAL DO MÊS (Apenas quando empregado) */}
      {character.age >= 18 && career.type !== 'desempregado' && (
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 px-1">
            <span className="text-lg">⚖️</span>
            <h2 className="font-heading font-black text-sm sm:text-base text-[#161d18]">Dilema Profissional</h2>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dde4db]">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ffdea8] text-[#5e4200] font-heading font-black text-[10px] mb-2">
              <span>🧠</span> Decisão Crítica em {career.companyOrOrg || 'Sua Empresa'}
            </div>
            <h3 className="font-heading font-black text-sm text-[#161d18] mb-1">A Proposta de Transição</h3>
            <p className="text-xs text-[#3e4941] mb-3 leading-relaxed">
              Sua equipe em <strong className="text-[#161d18]">{career.companyOrOrg || 'sua empresa'}</strong> está passando por uma reestruturação. Um antigo colega te convidou para uma posição <strong className="text-[#161d18]">PJ com +30% de remuneração</strong>, mas sem carteira, férias remuneradas ou estabilidade. Como você reage?
            </p>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                disabled={dilemmaChosen !== null}
                onClick={() => {
                  setDilemmaChosen('clt');
                  showMsg({ success: true, message: `Você optou por continuar na CLT em ${career.companyOrOrg || 'sua empresa'} com férias e FGTS garantidos!` });
                }}
                className={`w-full py-2.5 px-3 rounded-xl font-heading font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                  dilemmaChosen === 'clt'
                    ? 'bg-[#e2ffe9] border-2 border-[#006740] text-[#005232]'
                    : 'bg-[#006740] hover:bg-[#0d8253] text-white shadow-[0_3px_0_0_#005232] active:translate-y-0.5 active:shadow-none'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Manter a CLT em {career.companyOrOrg || 'Empresa'}
                </span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">+Estabilidade</span>
              </button>

              <button
                type="button"
                disabled={dilemmaChosen !== null}
                onClick={() => {
                  setDilemmaChosen('pj');
                  showMsg({ success: true, message: 'Considerando proposta de maior rendimento PJ no mercado!' });
                }}
                className={`w-full py-2.5 px-3 rounded-xl font-heading font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                  dilemmaChosen === 'pj'
                    ? 'bg-[#ffdea8] border-2 border-[#7c5800] text-[#271900]'
                    : 'bg-[#fdbb2d] hover:bg-[#ffdea8] text-[#271900] shadow-[0_3px_0_0_#6d4d00] active:translate-y-0.5 active:shadow-none'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span>🚀</span> Avaliar Proposta Externa (+30%)
                </span>
                <span className="text-[10px] bg-black/10 px-2 py-0.5 rounded-full font-bold">+Risco</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* SUB-TABS INTERNAS: VAGAS, CONCURSOS E ENSINO */}
      <div className="p-1 bg-white rounded-2xl border border-[#dde4db] flex items-center justify-between gap-1 shadow-xs">
        <button
          type="button"
          onClick={() => { playClickSound(); setActiveCategory('empregos'); }}
          className={`flex-1 py-2 px-2 text-[11px] font-heading font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeCategory === 'empregos'
              ? 'bg-[#006740] text-white shadow-xs'
              : 'text-[#3e4941] hover:bg-[#eef6ec]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Vagas de Emprego</span>
        </button>

        <button
          type="button"
          onClick={() => { playClickSound(); setActiveCategory('concursos'); }}
          className={`flex-1 py-2 px-2 text-[11px] font-heading font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeCategory === 'concursos'
              ? 'bg-[#006740] text-white shadow-xs'
              : 'text-[#3e4941] hover:bg-[#eef6ec]'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Concursos</span>
        </button>

        <button
          type="button"
          onClick={() => { playClickSound(); setActiveCategory('ensino'); }}
          className={`flex-1 py-2 px-2 text-[11px] font-heading font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeCategory === 'ensino'
              ? 'bg-[#006740] text-white shadow-xs'
              : 'text-[#3e4941] hover:bg-[#eef6ec]'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Área de Estudo</span>
        </button>
      </div>

      {/* --- SUB-TAB 1: VAGAS DE EMPREGO & BICOS --- */}
      {activeCategory === 'empregos' && (
        <div className="space-y-3">
          {character.age < 18 ? (
            <div className="space-y-4">
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-center space-y-2">
                <span className="text-3xl block">🛡️</span>
                <h3 className="font-heading font-black text-sm text-amber-950">Vagas de Emprego e Concursos - 18+</h3>
                <p className="text-xs text-amber-900 max-w-sm mx-auto leading-relaxed">
                  Quadro de vagas formais, CLT e concursos públicos são liberados apenas após completar 18 anos.
                </p>
              </div>

              {/* BICOS A PARTIR DOS 10 ANOS */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dde4db] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-black text-sm text-[#161d18] flex items-center gap-1.5">
                    <span>⚡</span>
                    Bicos & Trabalhos Informais (A partir dos 10 anos)
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {character.age >= 10 ? 'Liberado ✅' : 'Exige 10 anos'}
                  </span>
                </div>

                {character.age < 10 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    Você tem {character.age} anos. Faça 10 anos para poder realizar bicos e juntar sua graninha!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { id: 'vender_suco', title: '🧃 Vender Suco na Praça', earn: 'R$ 25 - R$ 50', energy: 10, desc: 'Suco geladinho no calor da praça!' },
                      { id: 'bala_sinal', title: '🍬 Vender Balas no Semáforo', earn: 'R$ 20 - R$ 40', energy: 10, desc: 'Abordar motoristas no sinal vermelho' },
                      { id: 'limpar_carro', title: '🧽 Limpar Carros / Parabrisas', earn: 'R$ 35 - R$ 70', energy: 15, desc: 'Esponja e rodo no estacionamento' },
                      { id: 'passear_animais', title: '🐕 Passear com Cães', earn: 'R$ 40 - R$ 80', energy: 15, desc: 'Levar os cães dos vizinhos para passear' }
                    ].map((bico) => (
                      <div key={bico.id} className="p-3 bg-[#eef6ec] rounded-xl border border-[#dde4db] flex flex-col justify-between gap-2">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-heading font-bold text-xs text-[#161d18]">{bico.title}</span>
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">{bico.earn}</span>
                          </div>
                          <p className="text-[11px] text-[#3e4941] mt-1">{bico.desc}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-[#dde4db]">
                          <span className="text-[10px] text-rose-700 font-bold">-{bico.energy}% Energia</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (onDoSideJob) {
                                const res = onDoSideJob(bico.id as any);
                                showMsg(res);
                              }
                            }}
                            className="py-1.5 px-3 rounded-lg bg-[#006740] hover:bg-[#0d8253] text-white text-xs font-heading font-bold shadow-xs transition-all cursor-pointer active:scale-95"
                          >
                            Trabalhar ⚡
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
          {/* Header do Quadro com Filtros */}
          <div className="flex items-center justify-between px-1">
            <h2 className="font-heading font-black text-sm sm:text-base text-[#161d18] flex items-center gap-1.5">
              <span>🎯</span>
              Quadro de Vagas & Oportunidades
            </h2>
            <span className="text-[10px] text-[#3e4941] font-heading font-bold">
              {filteredJobs.length} disponíveis
            </span>
          </div>

          {/* Toggle de Apenas Elegíveis */}
          <div className="p-3 bg-[#eef6ec] rounded-2xl border border-[#dde4db] flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">📋</span>
              <div>
                <h4 className="font-heading font-extrabold text-xs text-[#161d18]">Filtro de Requisitos</h4>
                <p className="text-[10px] text-[#3e4941]">Exibir apenas vagas compatíveis com sua escolaridade</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { playClickSound(); setOnlyEligible(!onlyEligible); }}
              className={`py-1.5 px-3 rounded-xl text-xs font-heading font-extrabold transition-all cursor-pointer shadow-xs ${
                onlyEligible
                  ? 'bg-[#006740] text-white'
                  : 'bg-white border border-[#dde4db] text-[#3e4941] hover:bg-[#eef6ec]'
              }`}
            >
              {onlyEligible ? '✅ Elegíveis' : 'Todas'}
            </button>
          </div>

          {/* Vaga 1: Destaque Loja LEGO */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dde4db] flex flex-col gap-2.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#fdbb2d] flex items-center justify-center shadow-[0_2px_0_0_#6d4d00]">
                  <span className="text-xl">🧸</span>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xs sm:text-sm text-[#161d18]">Atendente de Loja LEGO</h3>
                  <span className="text-[11px] text-[#3e4941]">Shopping Morumbi SP</span>
                </div>
              </div>
              <span className="font-heading font-black text-sm text-[#006740]">
                R$ 1.650<span className="text-[10px] text-[#3e4941] font-normal">/mês</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 py-0.5">
              <span className="text-[10px] bg-[#eef6ec] px-2 py-0.5 rounded-md text-[#3e4941]">Ensino Médio Completo</span>
              <span className="text-[10px] bg-[#ffdea8] text-[#5e4200] px-2 py-0.5 rounded-md font-bold">+ Desconto em Sets LEGO</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const sampleJob = AVAILABLE_JOBS.find(j => j.title.toLowerCase().includes('lego') || j.category === 'Serviços & Comércio') || AVAILABLE_JOBS[0];
                handleApplyJobClick(sampleJob);
              }}
              className="w-full bg-[#005e91] hover:bg-[#0077b6] text-white py-2 rounded-xl font-heading font-bold text-xs shadow-[0_3px_0_0_#004a74] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar Currículo & Prova</span>
            </button>
          </div>

          {/* Vaga 2: Suporte de TI Jr */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dde4db] flex flex-col gap-2.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#0077b6] text-white flex items-center justify-center shadow-[0_2px_0_0_#004a74]">
                  <span className="text-xl">💻</span>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xs sm:text-sm text-[#161d18]">Suporte de TI Júnior</h3>
                  <span className="text-[11px] text-[#3e4941]">Tech Soluções Paulista</span>
                </div>
              </div>
              <span className="font-heading font-black text-sm text-[#006740]">
                R$ 2.200<span className="text-[10px] text-[#3e4941] font-normal">/mês</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 py-0.5">
              <span className="text-[10px] bg-[#eef6ec] px-2 py-0.5 rounded-md text-[#3e4941]">Lógica de Programação</span>
              <span className="text-[10px] bg-[#eef6ec] px-2 py-0.5 rounded-md text-[#3e4941]">Híbrido 4x1</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const sampleJob = AVAILABLE_JOBS.find(j => j.title.toLowerCase().includes('ti') || j.category === 'TI & Comunicação') || AVAILABLE_JOBS[0];
                handleApplyJobClick(sampleJob);
              }}
              className="w-full bg-[#005e91] hover:bg-[#0077b6] text-white py-2 rounded-xl font-heading font-bold text-xs shadow-[0_3px_0_0_#004a74] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar Currículo & Prova</span>
            </button>
          </div>

          {/* Vagas Regulares Filtradas */}
          <div className="space-y-2.5 pt-1">
            {filteredJobs.slice(0, 5).map((job) => {
              const eligible = isJobEligible(job);
              return (
                <div key={job.id} className="bg-white rounded-2xl p-4 border border-[#dde4db] shadow-xs space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span className="text-2xl p-2 rounded-xl bg-[#eef6ec] border border-[#dde4db] shrink-0">
                        {job.categoryIcon}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                          <span className="text-[9px] font-heading font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#eef6ec] text-[#3e4941]">
                            {job.category}
                          </span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            eligible ? 'bg-[#e2ffe9] text-[#005232]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                          }`}>
                            {eligible ? 'Elegível ✅' : 'Requisitos 🔒'}
                          </span>
                          {getRequiredMajorForJob(job) && (
                            <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                              🎓 Exige: {getRequiredMajorForJob(job)}
                            </span>
                          )}
                        </div>
                        <h4 className="font-heading font-extrabold text-xs sm:text-sm text-[#161d18]">{job.title}</h4>
                        <p className="text-[11px] text-[#3e4941]">{job.company}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-heading font-black text-xs sm:text-sm text-[#006740] block">
                        R$ {job.salaryMonthly.toLocaleString('pt-BR')}/mês
                      </span>
                      <span className="text-[10px] text-[#3e4941]">{job.type.toUpperCase()}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#3e4941] leading-relaxed">{job.description}</p>

                  <div className="pt-2 border-t border-[#eef6ec]">
                    <button
                      type="button"
                      onClick={() => handleApplyJobClick(job)}
                      className={`w-full py-2 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        eligible
                          ? 'bg-[#005e91] hover:bg-[#0077b6] text-white shadow-[0_3px_0_0_#004a74] active:translate-y-0.5 active:shadow-none'
                          : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {eligible ? (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Enviar Currículo & Prova</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-amber-700" />
                          <span>{getRequiredMajorForJob(job) ? `Bloqueado (Exige ${getRequiredMajorForJob(job)})` : 'Ver Requisitos'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. BICOS & EMPREENDIMENTOS PARALELOS (SIDE HUSTLES) */}
          <section className="flex flex-col gap-2.5 pt-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-heading font-black text-sm sm:text-base text-[#161d18] flex items-center gap-1.5">
                <span>🏪</span>
                Bicos & Side Hustles
              </h2>
              <span className="text-[10px] font-heading font-bold text-[#006740] bg-[#e2ffe9] px-2 py-0.5 rounded-full">
                Fim de Semana
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Bico 1: Brigadeiro Gourmet */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dde4db] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#ffdea8] flex items-center justify-center shadow-[0_3px_0_0_#5e4200] shrink-0">
                    <span className="text-2xl">🍫</span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-heading font-bold text-xs sm:text-sm text-[#161d18]">Brigadeiro no Ponto</h3>
                    <p className="text-xs text-[#3e4941]">Ponto de Ônibus / Estação</p>
                    <span className="text-xs font-heading font-black text-[#7c5800] mt-0.5">R$ 40 a R$ 90 / dia</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleInternalWorkAction('bico_brigadeiro')}
                  className="bg-[#eef6ec] hover:bg-[#e3eae1] text-[#161d18] px-3.5 py-2 rounded-xl font-heading font-bold text-xs shadow-[0_3px_0_0_#bdcabf] active:translate-y-0.5 active:shadow-none flex flex-col items-center cursor-pointer transition-all shrink-0 border border-[#dde4db]"
                >
                  <span className="text-sm">▶️</span>
                  <span>Fazer Bico</span>
                </button>
              </div>

              {/* Bico 2: Montador de PC */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dde4db] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#cde5ff] flex items-center justify-center shadow-[0_3px_0_0_#004a74] shrink-0">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-heading font-bold text-xs sm:text-sm text-[#161d18]">Montador de PC Gamer</h3>
                    <p className="text-xs text-[#3e4941]">Freelancer de Bairro</p>
                    <span className="text-xs font-heading font-black text-[#006740] mt-0.5">R$ 150 / serviço</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleInternalWorkAction('bico_pc')}
                  className="bg-[#eef6ec] hover:bg-[#e3eae1] text-[#161d18] px-3.5 py-2 rounded-xl font-heading font-bold text-xs shadow-[0_3px_0_0_#bdcabf] active:translate-y-0.5 active:shadow-none flex flex-col items-center cursor-pointer transition-all shrink-0 border border-[#dde4db]"
                >
                  <span className="text-sm">▶️</span>
                  <span>Aceitar</span>
                </button>
              </div>
            </div>
          </section>
            </>
          )}
        </div>
      )}

      {/* --- SUB-TAB 2: CONCURSOS PÚBLICOS --- */}
      {activeCategory === 'concursos' && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'TODOS', label: 'Todos Níveis', icon: '🏛️' },
              { id: 'Ensino Fundamental', label: 'Fundamental', icon: '🧹' },
              { id: 'Ensino Médio', label: 'Médio', icon: '📜' },
              { id: 'Ensino Superior', label: 'Superior (Juiz/Delegado)', icon: '⚖️' },
            ].map((edu) => (
              <button
                key={edu.id}
                type="button"
                onClick={() => setSelectedConcursoEdu(edu.id)}
                className={`py-1.5 px-3 rounded-full text-xs font-heading font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedConcursoEdu === edu.id
                    ? 'bg-[#006740] text-white shadow-xs'
                    : 'bg-white border border-[#dde4db] text-[#3e4941] hover:bg-[#eef6ec]'
                }`}
              >
                <span>{edu.icon}</span>
                <span>{edu.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {filteredConcursos.map((conc) => (
              <div key={conc.id} className="bg-white rounded-2xl p-4 border border-[#dde4db] shadow-xs space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 bg-[#ffdea8] text-[#5e4200] font-heading font-bold text-[10px] rounded-md">
                      EXIGE: {conc.minEducationRequired}
                    </span>
                    <h4 className="font-heading font-extrabold text-xs sm:text-sm text-[#161d18] mt-1">{conc.title}</h4>
                    <p className="text-[11px] text-[#3e4941]">{conc.organ} • {conc.vacancies}</p>
                  </div>

                  <div className="text-right">
                    <span className="font-heading font-black text-xs sm:text-sm text-[#006740] block">
                      R$ {conc.salaryMonthly.toLocaleString('pt-BR')}/mês
                    </span>
                    <span className="text-[10px] text-[#3e4941]">Taxa: R$ {conc.subscriptionFee}</span>
                  </div>
                </div>

                <p className="text-xs text-[#3e4941] leading-relaxed">{conc.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-[#eef6ec] gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBenefitsModal({ title: conc.title, benefits: conc.benefits })}
                    className="text-[10px] font-bold text-[#005e91] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Award className="w-3 h-3" />
                    <span>Benefícios Estatutários</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTakeConcursoClick(conc)}
                    className="py-1.5 px-3 rounded-xl bg-[#005e91] text-white font-heading font-bold text-xs hover:bg-[#0077b6] transition-colors cursor-pointer shadow-xs flex items-center gap-1"
                  >
                    <span>Fazer Prova (R$ {conc.subscriptionFee})</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SUB-TAB 3: ÁREA DE ESTUDO (EDUCAÇÃO & VESTIBULAR COM CABEÇA LEGO) --- */}
      {activeCategory === 'ensino' && (
        <EducationModule
          character={character}
          stats={stats}
          career={career}
          educationSystem={educationSystem}
          onAdvanceSchoolYear={onAdvanceSchoolYear}
          onStudyDaily={onStudyDaily}
          onStartCollegeEnrollment={handleStartCollegeClick}
          onAdvanceCollegeYear={onAdvanceCollegeYear}
          onOpenJobVacanciesModal={onOpenJobVacanciesModal}
        />
      )}

      {/* MINI-GAME DE PROVA (5 PERGUNTAS • SE ERRAR 3 REPROVA) */}
      {examModal && examModal.isOpen && (
        <SelectionExamModal
          isOpen={examModal.isOpen}
          title={examModal.title}
          subtitle={examModal.subtitle}
          examType={examModal.type}
          categoryHint={examModal.categoryHint}
          onPass={handleExamPass}
          onFail={handleExamFail}
          onClose={() => setExamModal(null)}
        />
      )}

      {/* MODAL INTERATIVO DE BENEFÍCIOS */}
      {selectedBenefitsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-[#dde4db] space-y-4">
            <div className="flex items-center justify-between border-b border-[#eef6ec] pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#fdbb2d]" />
                <div>
                  <h3 className="font-heading font-black text-sm text-[#161d18]">Pacote de Benefícios</h3>
                  <p className="text-[10px] text-[#3e4941]">{selectedBenefitsModal.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBenefitsModal(null)}
                className="w-7 h-7 rounded-full bg-[#eef6ec] text-[#161d18] font-bold text-xs flex items-center justify-center hover:bg-[#dde4db] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {selectedBenefitsModal.benefits && selectedBenefitsModal.benefits.length > 0 ? (
                selectedBenefitsModal.benefits.map((b, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-[#eef6ec] border border-[#dde4db] flex items-center justify-between gap-2.5 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{b.icon}</span>
                      <div>
                        <h5 className="font-heading font-extrabold text-xs text-[#161d18]">{b.name}</h5>
                        <p className="text-[10px] text-[#3e4941]">{b.valueDescription}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUseBenefit(b.name)}
                      className="py-1.5 px-2.5 rounded-xl bg-[#006740] hover:bg-[#0d8253] text-white font-heading font-extrabold text-[10px] whitespace-nowrap transition-all cursor-pointer shadow-xs"
                    >
                      Usar ✨
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-[#ffdea8]/30 border border-[#ffdea8] text-center">
                  <p className="text-xs text-[#5e4200] font-bold">⚠️ Este cargo não oferece benefícios adicionais.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL CARTEIRA DE TRABALHO DIGITAL (CTPS) */}
      {isCtpsModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-[#dde4db] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#eef6ec] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#006740] text-white flex items-center justify-center text-lg font-bold">
                  📘
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm text-[#161d18]">Carteira de Trabalho Digital</h3>
                  <p className="text-[10px] text-[#3e4941]">Ministério do Trabalho & Emprego • CTPS #049281</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCtpsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#eef6ec] text-[#161d18] font-bold text-xs flex items-center justify-center hover:bg-[#dde4db] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Current Active Job Contract */}
            <div className="p-4 rounded-2xl bg-[#eef6ec] border border-[#006740]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-[#005232] bg-white px-2 py-0.5 rounded font-heading border border-[#006740]/20">
                  Contrato Ativo • {career.type.toUpperCase()}
                </span>
                <span className="text-[10px] text-[#006740] font-bold">Admissão: {career.admissionYear || 2026}</span>
              </div>
              <h4 className="font-heading font-black text-base text-[#161d18]">{career.title}</h4>
              <p className="text-xs text-[#3e4941]">Empregador: <strong>{career.companyOrOrg}</strong></p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#006740]/15 text-xs">
                <div>
                  <span className="text-[10px] text-[#3e4941] block">Salário Mensal Registrado</span>
                  <span className="font-heading font-bold text-[#006740]">R$ {career.salaryMonthly.toLocaleString('pt-BR')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#3e4941] block">FGTS Acumulado</span>
                  <span className="font-heading font-bold text-[#006740]">R$ {career.fgtsAccumulated.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>

            {/* SEUS DIREITOS (CLT & SERVIDOR) */}
            <div className="p-3.5 bg-[#f4fbf2] border border-[#dde4db] rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#dde4db] pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📄</span>
                  <div>
                    <h4 className="font-heading font-extrabold text-xs text-[#161d18]">
                      Seus Direitos (CLT & Servidor)
                    </h4>
                    <p className="text-[10px] text-[#3e4941]">Rescisão, Seguro-Desemprego e Licenças</p>
                  </div>
                </div>
                <span className="text-[9px] font-extrabold uppercase text-[#005232] bg-[#93f7be] px-2 py-0.5 rounded font-heading">
                  CLT Garantido
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-white border border-[#dde4db] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏦</span>
                    <div>
                      <h5 className="font-heading font-bold text-xs text-[#161d18]">Seguro-Desemprego</h5>
                      <p className="text-[10px] text-[#3e4941]">3 a 5 parcelas de R$ 1.412/mês se desempregado</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (career.type !== 'desempregado') {
                        showMsg({ success: false, message: 'O seguro-desemprego é exclusivo para quem foi desligado!' });
                        return;
                      }
                      showMsg({ success: true, message: 'Seguro-Desemprego APROVADO! Parcela de R$ 1.412 creditada na conta!' });
                      confetti({ particleCount: 50, spread: 60 });
                    }}
                    className="py-1 px-2 rounded-lg bg-[#006740] text-white font-heading font-bold text-[10px] whitespace-nowrap cursor-pointer hover:bg-[#0d8253]"
                  >
                    Acionar 🏦
                  </button>
                </div>

                <div className="p-2 rounded-xl bg-white border border-[#dde4db] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">👶</span>
                    <div>
                      <h5 className="font-heading font-bold text-xs text-[#161d18]">Licença Maternidade / Paternidade</h5>
                      <p className="text-[10px] text-[#3e4941]">Afastamento de 120 a 180 dias com 100% do salário mantido</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (career.salaryMonthly <= 0) {
                        showMsg({ success: false, message: 'Exige estar trabalhando para licença remunerada!' });
                        return;
                      }
                      showMsg({ success: true, message: 'Licença APROVADA! 120 dias de afastamento remunerado com salário mantido!' });
                      confetti({ particleCount: 50, spread: 60 });
                    }}
                    className="py-1 px-2 rounded-lg bg-[#006740] text-white font-heading font-bold text-[10px] whitespace-nowrap cursor-pointer hover:bg-[#0d8253]"
                  >
                    Solicitar 👶
                  </button>
                </div>

                {/* Aposentadoria */}
                <div className="p-2.5 rounded-xl bg-[#eef6ec] border border-[#93f7be] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-[#005232]">
                      👴 Aposentadoria & Previdência (INSS)
                    </span>
                    <span className="text-[9px] font-bold text-[#006740]">
                      {character.age >= 60 ? 'Elegível' : `Faltam ${Math.max(0, 60 - character.age)} anos`}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#3e4941]">Tempo de contribuição: {career.totalYearsWorked || 0} anos de trabalho</p>
                  {character.age >= 60 && !character.retired && onRetire && (
                    <button
                      type="button"
                      onClick={() => {
                        const res = onRetire('inss');
                        showMsg(res);
                      }}
                      className="w-full py-1.5 bg-[#006740] text-white font-heading font-bold text-[10px] rounded-lg mt-1"
                    >
                      Requerer Aposentadoria Oficial 🏛️
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
