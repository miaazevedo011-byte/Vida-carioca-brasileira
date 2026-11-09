import React, { useState } from 'react';
import { Character, Career, EducationSystemState, Stats } from '../types/game';
import { AVAILABLE_JOBS, JobListing, getRequiredMajorForJob, checkPlayerHasRequiredMajor } from '../data/careers';
import { X, Briefcase, CheckCircle2, AlertCircle, Send, Award, FileText, ChevronRight, Lock, GraduationCap } from 'lucide-react';
import { playClickSound, playSuccessSound, playErrorSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface JobVacanciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  career: Career;
  stats?: Stats;
  educationSystem?: EducationSystemState;
  onApplyJob: (job: JobListing) => { success: boolean; message: string };
}

export const JobVacanciesModal: React.FC<JobVacanciesModalProps> = ({
  isOpen,
  onClose,
  character,
  career,
  stats,
  educationSystem,
  onApplyJob
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedJobForTest, setSelectedJobForTest] = useState<JobListing | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['Todas', 'Vendas Leves', 'Serviços Pet', 'TI & Comunicação', 'Trabalho Externo & Transporte', 'Serviços & Comércio', 'Indústria & Construção', 'Saúde & Cuidados'];

  // Filter jobs by selected category and age restrictions
  const filteredJobs = AVAILABLE_JOBS.filter((job) => {
    if (selectedCategory !== 'Todas' && job.category !== selectedCategory) return false;
    return true;
  });

  const handleStartTest = (job: JobListing) => {
    playClickSound();
    // Enforce Age Restrictions before proceeding to test
    if (character.age < job.minAge) {
      playErrorSound();
      setFeedback(`🚨 Restrição de Idade! Esta vaga requer idade mínima de ${job.minAge} anos. Seu personagem tem ${character.age} anos.`);
      return;
    }
    if (job.maxAge && character.age > job.maxAge) {
      playErrorSound();
      setFeedback(`🚨 Faixa Etária Excedida! Esta vaga é restrita até ${job.maxAge} anos.`);
      return;
    }

    // Enforce Strict College Degree Requirement
    const reqMajor = getRequiredMajorForJob(job);
    if (reqMajor) {
      const check = checkPlayerHasRequiredMajor(reqMajor, career, educationSystem);
      if (!check.hasDegree) {
        playErrorSound();
        setFeedback(`🚨 Requisito Rígido de Faculdade! A vaga de "${job.title}" exige obrigatoriamente diploma de graduação em ${reqMajor}. Você não pode prestar a prova sem ter se formado nessa área!`);
        return;
      }
    } else if (job.minEducation === 'Graduação' || job.minEducation === 'Pós-Graduação') {
      const hasAnyDegree = (educationSystem?.graduatedCourses && educationSystem.graduatedCourses.length > 0) || career.collegeStatus === 'formado' || (career.educationLevel && career.educationLevel.toLowerCase().includes('graduado'));
      if (!hasAnyDegree) {
        playErrorSound();
        setFeedback(`🚨 Requisito Rígido! A vaga de "${job.title}" exige diploma de Ensino Superior (Graduação). Conclua a faculdade antes de prestar a prova!`);
        return;
      }
    }

    // Enforce Intellect
    const playerIntelecto = stats?.intelecto ?? 50;
    if (playerIntelecto < job.minIntelecto) {
      playErrorSound();
      setFeedback(`🚨 Intelecto Insuficiente! A vaga de "${job.title}" exige ao menos ${job.minIntelecto} pontos de intelecto (você tem ${playerIntelecto} pts). Estude mais!`);
      return;
    }

    setSelectedJobForTest(job);
    setQuizAnswers([]);
    setFeedback(null);
  };

  const handleAnswerQuiz = (optionIdx: number) => {
    playClickSound();
    const newAnswers = [...quizAnswers, optionIdx];
    setQuizAnswers(newAnswers);

    // Test completed (3 questions)
    if (newAnswers.length >= 3) {
      const res = onApplyJob(selectedJobForTest!);
      if (res.success) {
        playSuccessSound();
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        setFeedback(`🎉 Parabéns! Currículo aprovado e prova concluída com sucesso! Você foi contratado(a) como ${selectedJobForTest!.title}!`);
        setTimeout(() => {
          setSelectedJobForTest(null);
          onClose();
        }, 3000);
      } else {
        playErrorSound();
        setFeedback(res.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="app-viewport w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col relative text-left">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-600 p-4 sm:p-5 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-bold border border-white/20">
              💼
            </div>
            <div>
              <h2 className="font-heading font-black text-lg sm:text-xl leading-tight">
                Mural de Vagas de Emprego (+30 Cargos)
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                Envie seu currículo, responda o teste de aptidão e conquiste sua vaga!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className="p-3 mx-4 mt-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold rounded-2xl flex items-center justify-between shadow-xs animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{feedback}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-amber-700 hover:text-amber-950 font-bold ml-2">✕</button>
          </div>
        )}

        {/* Modal Body */}
        {!selectedJobForTest ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { playClickSound(); setSelectedCategory(cat); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Current Job Status Banner */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 font-medium">Sua Ocupação Atual:</span>
                <span className="font-extrabold text-slate-900 block font-heading">{career.title} ({career.companyOrOrg})</span>
              </div>
              <span className="text-emerald-700 font-black bg-emerald-100 px-2.5 py-1 rounded-full text-[11px]">
                {career.salaryMonthly > 0 ? `R$ ${career.salaryMonthly.toLocaleString('pt-BR')}/mês` : 'Sem Salário CLT'}
              </span>
            </div>

            {/* List of Jobs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredJobs.map((job) => {
                const isAgeLocked = character.age < job.minAge || (job.maxAge !== undefined && character.age > job.maxAge);
                const reqMajor = getRequiredMajorForJob(job);
                const majorCheck = reqMajor ? checkPlayerHasRequiredMajor(reqMajor, career, educationSystem) : { hasDegree: true };
                const isDegreeLocked = reqMajor ? !majorCheck.hasDegree : false;
                const isCurrent = career.title === job.title;

                return (
                  <div
                    key={job.id}
                    className={`rounded-2xl p-4 border transition-all flex flex-col justify-between space-y-3 ${
                      isCurrent
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                        : isDegreeLocked || isAgeLocked
                        ? 'border-slate-200 bg-slate-50/80 opacity-90'
                        : 'border-slate-200 bg-white hover:border-emerald-400 shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Job Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{job.categoryIcon || '💼'}</span>
                          <div>
                            <h3 className="font-heading font-black text-xs text-slate-900 leading-tight">
                              {job.title}
                            </h3>
                            <span className="text-[10px] text-slate-500 font-medium">{job.company}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold shrink-0 uppercase">
                          {job.type.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                        {job.description}
                      </p>

                      {/* Requirements */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] space-y-1">
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Requisito de Idade:</span>
                          <span className={`font-bold ${isAgeLocked ? 'text-rose-600' : 'text-slate-900'}`}>
                            {job.minAge}a+ {job.maxAge ? `até ${job.maxAge}a` : ''}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Escolaridade Mínima:</span>
                          <span className="font-bold text-slate-900">{job.minEducation}</span>
                        </div>
                        {reqMajor && (
                          <div className="flex items-center justify-between text-slate-600 bg-amber-50/80 px-1.5 py-0.5 rounded-md border border-amber-200">
                            <span className="font-bold text-amber-900 flex items-center gap-1">
                              <GraduationCap className="w-3 h-3 text-amber-700" /> Diploma Exigido:
                            </span>
                            <span className={`font-black ${isDegreeLocked ? 'text-rose-600' : 'text-emerald-700'}`}>
                              {reqMajor} {isDegreeLocked ? '❌ Não Possui' : '✅ Formado'}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Intelecto Mínimo:</span>
                          <span className="font-bold text-slate-900">{job.minIntelecto} pts</span>
                        </div>
                      </div>

                      {/* Benefits */}
                      {job.benefits && job.benefits.length > 0 && (
                        <div className="mt-2 flex items-center gap-1 flex-wrap">
                          {job.benefits.map((b, bIdx) => (
                            <span key={bIdx} className="bg-emerald-100/80 text-emerald-900 text-[9.5px] font-bold px-2 py-0.5 rounded-md">
                              {b.icon} {b.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Salary and Action Button */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-heading uppercase font-bold">Salário</span>
                        <span className="font-heading font-black text-sm text-emerald-700">
                          R$ {job.salaryMonthly.toLocaleString('pt-BR')}<span className="text-[10px] font-normal text-slate-500">/mês</span>
                        </span>
                      </div>

                      {isCurrent ? (
                        <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Seu Emprego
                        </span>
                      ) : isDegreeLocked ? (
                        <button
                          type="button"
                          onClick={() => handleStartTest(job)}
                          className="py-1.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-black border border-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                          title="Exige graduação específica"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-700" /> Exige {reqMajor}
                        </button>
                      ) : isAgeLocked ? (
                        <button
                          type="button"
                          onClick={() => handleStartTest(job)}
                          className="py-1.5 px-3 rounded-xl bg-slate-200 text-slate-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5" /> Bloqueado ({job.minAge}a)
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartTest(job)}
                          className="py-1.5 px-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-extrabold text-xs shadow-xs active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>Enviar Currículo & Prova</span>
                          <span className="text-sm font-black">+</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* QUIZ / INTERVIEW TEST VIEW */
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                  Processo Seletivo • Prova de Aptidão ({quizAnswers.length + 1}/3)
                </span>
                <h3 className="font-heading font-black text-sm text-slate-900">
                  {selectedJobForTest.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJobForTest(null)}
                className="text-xs text-slate-600 font-bold hover:text-slate-900 bg-white px-3 py-1 rounded-xl border border-slate-200"
              >
                Voltar
              </button>
            </div>

            {/* Quiz Questions */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Questão {quizAnswers.length + 1}: Como você procederia diante da exigência desta vaga em {selectedJobForTest.company}?
              </h4>

              <div className="space-y-2">
                {[
                  { label: 'A) Manter foco na qualidade, ética e cumprir os procedimentos padrão do setor.', correct: true },
                  { label: 'B) Improvisar rapidamente sem consultar os manuais e relatórios técnicos.', correct: false },
                  { label: 'C) Priorizar o trabalho em equipe, comunicação transparente e prazos.', correct: true },
                  { label: 'D) Adiar tarefas complexas para o final do turno de trabalho.', correct: false }
                ].map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAnswerQuiz(idx)}
                    className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/60 font-medium text-xs text-slate-800 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <span>{opt.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
