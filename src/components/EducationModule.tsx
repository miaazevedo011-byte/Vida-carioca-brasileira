import React, { useState } from 'react';
import { Character, Stats, Career, EducationSystemState } from '../types/game';
import { COLLEGE_MAJORS, CollegeMajor } from '../data/careers';
import { GraduationCap, BookOpen, Award, CheckCircle2, School, TrendingUp, Lock, ArrowRight, ShieldCheck, Zap, Users, Brain, BookMarked, Coffee } from 'lucide-react';
import { playClickSound, playSuccessSound, playCoinSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { LegoMinifigHead } from './LegoMinifigHead';

interface EducationModuleProps {
  character: Character;
  stats: Stats;
  career: Career;
  educationSystem: EducationSystemState;
  onAdvanceSchoolYear: (level: 'fundamental' | 'medio') => { success: boolean; message: string; graduated?: boolean };
  onStudyDaily: (level: 'fundamental' | 'medio' | 'superior') => { success: boolean; message: string };
  onStartCollegeEnrollment: (major: CollegeMajor) => void;
  onAdvanceCollegeYear: () => { success: boolean; message: string; graduated?: boolean };
  onOpenJobVacanciesModal?: () => void;
}

export const EducationModule: React.FC<EducationModuleProps> = ({
  character,
  stats,
  career,
  educationSystem,
  onAdvanceSchoolYear,
  onStudyDaily,
  onStartCollegeEnrollment,
  onAdvanceCollegeYear,
  onOpenJobVacanciesModal
}) => {
  const [activeTier, setActiveTier] = useState<'geral' | 'fundamental' | 'medio' | 'superior' | 'pos_doutorado' | 'turma'>('geral');
  const [selectedTarget, setSelectedTarget] = useState<'usp' | 'fatec' | 'prouni'>('fatec');
  const [simuladosDone, setSimuladosDone] = useState(4);
  const [simuladosAvg, setSimuladosAvg] = useState(685.4);
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  const [dilemmaResolved, setDilemmaResolved] = useState<string | null>(null);
  const [selectedMajorCategory, setSelectedMajorCategory] = useState<string>('TODAS');

  const [classmates] = useState(educationSystem.classmates || [
    { id: 'c1', name: 'Lucas Gamer 🎮', age: character.age || 17, relationshipScore: 70, avatar: '👦', personality: 'Criativo' },
    { id: 'c2', name: 'Camila CDF 📚', age: character.age || 17, relationshipScore: 85, avatar: '👧', personality: 'Focada' },
    { id: 'c3', name: 'Gabriel Atleta ⚽', age: character.age || 17, relationshipScore: 60, avatar: '🧒', personality: 'Extrovertido' },
    { id: 'c4', name: 'Beatriz Engraçada 🎭', age: character.age || 17, relationshipScore: 75, avatar: '👩', personality: 'Zueira' }
  ]);

  const [feedback, setFeedback] = useState<string | null>(null);

  const showMsg = (res: { success: boolean; message: string; graduated?: boolean }) => {
    setFeedback(res.message);
    if (res.graduated || res.success) {
      playSuccessSound();
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const isFundamentalCompleted = educationSystem.fundamentalYearsDone >= 6;
  const isMedioCompleted = educationSystem.medioYearsDone >= 6;
  const isCollegeEnrolled = career.collegeStatus === 'cursando';
  const isCollegeCompleted = (educationSystem.graduatedCourses && educationSystem.graduatedCourses.length > 0) || career.collegeStatus === 'formado';

  // Handler para Cursos Rápidos
  const handleEnrollShortCourse = (courseId: string, courseName: string, cost: number, intellectBonus: number) => {
    playClickSound();
    if (completedCourses.includes(courseId)) {
      showMsg({ success: false, message: `Você já concluiu o curso de ${courseName}!` });
      return;
    }
    if (cost > 0 && stats.grana < cost) {
      showMsg({ success: false, message: `Saldo insuficiente para a matrícula (R$ ${cost}).` });
      return;
    }
    setCompletedCourses((prev) => [...prev, courseId]);
    playCoinSound();
    showMsg({ success: true, message: `Parabéns! Você se matriculou em ${courseName} (+${intellectBonus}% Intelecto)!` });
  };

  // Handler para Rotina de Hábitos
  const handleDailyHabit = (type: 'flashcards' | 'biblioteca' | 'madrugar') => {
    playClickSound();
    if (type === 'flashcards') {
      showMsg({ success: true, message: 'Revisou flashcards por 1h! (+3% Intelecto, -5 Energia)' });
    } else if (type === 'biblioteca') {
      showMsg({ success: true, message: 'Estudou com a galera na biblioteca pública! (+4% Intelecto, +Relações)' });
    } else if (type === 'madrugar') {
      showMsg({ success: true, message: 'Virou a noite no café! (+8% Intelecto, mas seu corpo sentiu o cansaço)' });
    }
  };

  // Handler para o Dilema Acadêmico
  const handleAcademicDilemmaChoice = (choice: 'simulado' | 'pelada') => {
    playClickSound();
    if (choice === 'simulado') {
      setDilemmaResolved('simulado');
      setSimuladosDone((prev) => Math.min(8, prev + 1));
      setSimuladosAvg((prev) => Number((prev + 12.5).toFixed(1)));
      showMsg({ success: true, message: 'Foco total no Simulado de 90 questões! Média TRI subiu para ' + (simuladosAvg + 12.5) + ' pts!' });
    } else {
      setDilemmaResolved('pelada');
      showMsg({ success: true, message: 'Pelada inesquecível no campinho e pastel com a turma! Felicidade nas alturas!' });
    }
  };

  const getFaseTitle = () => {
    if (isCollegeCompleted) return 'Formado(a) no Ensino Superior';
    if (isCollegeEnrolled) return `Graduando em ${career.collegeMajor || 'Faculdade'}`;
    if (isMedioCompleted) return 'Vestibulando & Preparação';
    if (isFundamentalCompleted) return 'Ensino Médio';
    return 'Ensino Fundamental';
  };

  return (
    <div className="space-y-4 text-left animate-fade-in pb-10">
      {/* ============================================================== */}
      {/* 1. MINI-CARD PERFIL MODULAR (CABEÇA ESTILO MINI-BONECO DE BLOCO) */}
      {/* ============================================================== */}
      <div className="w-full bg-[#e9f0e7] rounded-2xl p-4 sm:p-5 shadow-[0_4px_16px_rgba(22,29,24,0.06)] flex flex-col gap-3 relative overflow-hidden border border-[#bdcabf]">
        {/* Efeito luminoso de topo suave */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#006740] via-[#fdbb2d] to-[#0077b6] opacity-90" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Ícone de dados do estudante */}
            <div className="w-10 h-10 rounded-xl bg-[#006740] text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
              🎓
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-heading font-black text-lg text-[#161d18] tracking-tight leading-none truncate">
                  {character.name}
                </h2>
                <span className="bg-[#dde4db] text-[#3e4941] font-heading font-bold text-[11px] px-2 py-0.5 rounded-full">
                  {character.age} anos
                </span>
              </div>
              <p className="text-xs text-[#3e4941] mt-1 font-medium truncate">
                {isCollegeEnrolled ? `Cursando ${career.collegeMajor}` : 'Vestibulando & Futuro Profissional'}
              </p>
            </div>
          </div>

          {/* Badge de Fase Modular */}
          <div className="flex flex-col items-end shrink-0">
            <span className="text-[10px] text-[#005e91] font-heading font-black tracking-wider uppercase">Fase Atual</span>
            <div className="bg-[#cde5ff] text-[#001d32] font-heading font-black text-xs px-2.5 py-1 rounded-xl shadow-[0_2px_0_0_#004a74] mt-0.5 flex items-center gap-1">
              <School className="w-3.5 h-3.5 text-[#005e91]" />
              <span className="truncate max-w-[120px]">{isCollegeCompleted ? 'Graduado' : isCollegeEnrolled ? 'Faculdade' : 'Vestibulando'}</span>
            </div>
          </div>
        </div>

        {/* Indicador de Bolsa Estudantil / Renda Acadêmica */}
        <div className="flex items-center justify-between bg-white px-3.5 py-2 rounded-xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] border border-[#dde4db]">
          <div className="flex items-center gap-1.5 text-xs text-[#3e4941]">
            <span className="text-base">💳</span>
            <span className="font-medium">Bolsa Jovem Aprendiz / Auxílio:</span>
          </div>
          <span className="font-heading font-black text-sm text-[#006740]">
            R$ 820,00<span className="text-[10px] text-[#3e4941] font-normal">/mês</span>
          </span>
        </div>

        {/* Botão de Mais (+) para Primeira Vaga de Emprego (+30 Cargos) */}
        {onOpenJobVacanciesModal && (
          <button
            type="button"
            onClick={() => { playClickSound(); onOpenJobVacanciesModal(); }}
            className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#006740] via-[#0d8253] to-[#005e91] text-white font-heading font-black text-xs shadow-md active:translate-y-0.5 transition-all flex items-center justify-between cursor-pointer border border-[#005232]"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white text-[#006740] flex items-center justify-center font-black text-xs">
                +
              </span>
              <span>Buscar Primeira Vaga de Emprego (+30 Cargos)</span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
              Ver Vagas 💼
            </span>
          </button>
        )}

        {/* Nível de Escolaridade em Bloco Tátil com barra modular divisores LEGO */}
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#161d18] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#006740]" />
              {isMedioCompleted ? 'Ensino Médio Concluído' : isFundamentalCompleted ? 'Ensino Fundamental Concluído' : 'Cursando Educação Básica'}
            </span>
            <span className="text-[#005e91] font-bold text-[11px] font-heading">
              {isCollegeCompleted ? 'Graduação Completa 🎓' : isCollegeEnrolled ? 'No Ensino Superior' : 'Rumo ao Ensino Superior'}
            </span>
          </div>

          {/* Barra Modular com Divisores de Encaixe LEGO */}
          <div className="w-full h-3.5 bg-[#dde4db] rounded-full overflow-hidden p-0.5 relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] flex items-center">
            <div
              className="h-full bg-[#006740] rounded-full transition-all duration-500 shadow-[0_1px_0_0_#005232] relative"
              style={{ width: `${isCollegeCompleted ? 100 : isCollegeEnrolled ? 80 : isMedioCompleted ? 65 : 35}%` }}
            >
              <div className="w-full h-full bg-gradient-to-t from-transparent via-white/20 to-white/40" />
            </div>
          </div>
        </div>

        {/* Gauges de Intelecto & Energia de Estudo */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Intelecto */}
          <div className="bg-white p-2.5 rounded-xl flex flex-col gap-1 shadow-xs border border-[#dde4db]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-[#cde5ff] flex items-center justify-center">
                  <Brain className="w-3 h-3 text-[#005e91]" />
                </div>
                <span className="text-[11px] font-heading font-bold text-[#161d18]">Intelecto</span>
              </div>
              <span className="text-xs font-heading font-black text-[#005e91]">{stats.intelecto}%</span>
            </div>
            <div className="w-full h-2 bg-[#e3eae1] rounded-full overflow-hidden">
              <div className="h-full bg-[#0077b6] rounded-full shadow-[0_1px_0_0_#004a74]" style={{ width: `${stats.intelecto}%` }} />
            </div>
          </div>

          {/* Foco Mental / Energia */}
          <div className="bg-white p-2.5 rounded-xl flex flex-col gap-1 shadow-xs border border-[#dde4db]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-[#ffdea8] flex items-center justify-center">
                  <Zap className="w-3 h-3 text-[#7c5800]" />
                </div>
                <span className="text-[11px] font-heading font-bold text-[#161d18]">Foco Mental</span>
              </div>
              <span className="text-xs font-heading font-black text-[#7c5800]">{stats.energia}%</span>
            </div>
            <div className="w-full h-2 bg-[#e3eae1] rounded-full overflow-hidden">
              <div className="h-full bg-[#fdbb2d] rounded-full shadow-[0_1px_0_0_#9a6b00]" style={{ width: `${stats.energia}%` }} />
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-[#e2ffe9] border border-[#006740] text-[#005232] text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#006740]" />
          <span>{feedback}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* SEÇÃO 1: FOCO ACADÊMICO ATUAL (DIORAMA / CURSINHO / PROVAS) */}
      {/* ============================================================== */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xl">📚</span>
            <h3 className="font-heading font-black text-sm text-[#161d18] tracking-tight">Foco Acadêmico Atual</h3>
          </div>
          <span className="text-[10px] font-heading font-bold text-[#3e4941] bg-[#e3eae1] px-2.5 py-0.5 rounded-full">
            Ano Letivo {character.year}
          </span>
        </div>

        {/* Card Principal: Cursinho Noturno / Preparatório ENEM */}
        <div className="bg-[#e9f0e7] rounded-2xl p-4 shadow-xs flex flex-col gap-3 border border-[#bdcabf]">
          <div className="flex items-start justify-between gap-2">
            <div className="flex gap-2.5">
              <div className="w-11 h-11 rounded-xl bg-[#005e91] flex items-center justify-center text-white shadow-[0_3px_0_0_#004a74] shrink-0">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h4 className="font-heading font-bold text-sm text-[#161d18] leading-tight">
                  Preparatório ENEM (Cursinho Popular)
                </h4>
                <p className="text-xs text-[#3e4941]">Turma Noturna • 19h às 22h30 • Sala 4B</p>
              </div>
            </div>
            <span className="bg-[#93f7be] text-[#005232] text-[10px] font-heading font-black px-2 py-0.5 rounded-full shrink-0">
              Ativo
            </span>
          </div>

          {/* Barra de Preparação do Vestibular */}
          <div className="bg-white p-3 rounded-xl flex flex-col gap-1.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] border border-[#dde4db]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#161d18] font-medium flex items-center gap-1 font-heading">
                <span className="text-sm">🎯</span>
                Prontidão para Prova (Simulados TRI)
              </span>
              <span className="text-[#006740] font-heading font-bold">{Math.round((simuladosDone / 8) * 100)}% Concluído</span>
            </div>
            <div className="w-full h-3 bg-[#e3eae1] rounded-full overflow-hidden flex">
              <div
                className="h-full bg-[#0d8253] rounded-full shadow-[0_1px_0_0_#005232] transition-all"
                style={{ width: `${Math.round((simuladosDone / 8) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#3e4941] pt-0.5 font-medium">
              <span>{simuladosDone} de 8 Simulados Realizados</span>
              <span className="text-[#005e91] font-bold">Média: {simuladosAvg} pts</span>
            </div>
          </div>

          {/* Alvos de Vestibular / Metas de Inscrição */}
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-[10px] font-heading font-bold text-[#3e4941] uppercase tracking-wider">
              Metas & Inscrições Desejadas
            </span>
            <div className="grid grid-cols-3 gap-2">
              {/* USP / Estadual */}
              <button
                type="button"
                onClick={() => { playClickSound(); setSelectedTarget('usp'); }}
                className={`bg-white p-2.5 rounded-xl text-left flex flex-col justify-between transition-all cursor-pointer ${
                  selectedTarget === 'usp'
                    ? 'ring-2 ring-[#ba1a1a] shadow-[0_2px_0_0_#ba1a1a]'
                    : 'shadow-[0_2px_0_0_#bdcabf] border border-[#dde4db]'
                }`}
              >
                <span className="font-heading font-bold text-xs text-[#ba1a1a]">USP / Estadual</span>
                <span className="text-[11px] text-[#3e4941] leading-tight mt-1">Eng. Computação</span>
                <span className="text-[9px] font-bold mt-1.5 bg-[#ffdad6] text-[#93000a] px-1 py-0.5 rounded text-center">
                  Alta 8.4/10
                </span>
              </button>

              {/* FATEC */}
              <button
                type="button"
                onClick={() => { playClickSound(); setSelectedTarget('fatec'); }}
                className={`bg-white p-2.5 rounded-xl text-left flex flex-col justify-between transition-all cursor-pointer ${
                  selectedTarget === 'fatec'
                    ? 'ring-2 ring-[#006740] shadow-[0_2px_0_0_#006740]'
                    : 'shadow-[0_2px_0_0_#bdcabf] border border-[#dde4db]'
                }`}
              >
                <span className="font-heading font-bold text-xs text-[#006740]">FATEC Pública</span>
                <span className="text-[11px] text-[#3e4941] leading-tight mt-1">Análise Sistemas</span>
                <span className="text-[9px] font-bold mt-1.5 bg-[#93f7be] text-[#002111] px-1 py-0.5 rounded text-center">
                  Favorita 92%
                </span>
              </button>

              {/* PROUNI */}
              <button
                type="button"
                onClick={() => { playClickSound(); setSelectedTarget('prouni'); }}
                className={`bg-white p-2.5 rounded-xl text-left flex flex-col justify-between transition-all cursor-pointer ${
                  selectedTarget === 'prouni'
                    ? 'ring-2 ring-[#005e91] shadow-[0_2px_0_0_#005e91]'
                    : 'shadow-[0_2px_0_0_#bdcabf] border border-[#dde4db]'
                }`}
              >
                <span className="font-heading font-bold text-xs text-[#005e91]">Bolsa Prouni</span>
                <span className="text-[11px] text-[#3e4941] leading-tight mt-1">Privada 100%</span>
                <span className="text-[9px] font-bold mt-1.5 bg-[#cde5ff] text-[#001d32] px-1 py-0.5 rounded text-center">
                  Corte: 710 pts
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SEÇÃO 2: CURSOS RÁPIDOS & CERTIFICAÇÕES (UPGRADES TÁTEIS) */}
      {/* ============================================================== */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xl">🎖️</span>
            <h3 className="font-heading font-black text-sm text-[#161d18] tracking-tight">Cursos & Certificações</h3>
          </div>
          <span className="text-[10px] font-heading font-bold text-[#006740] bg-[#e2ffe9] px-2 py-0.5 rounded-full">
            +Carreira
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Curso 1: Lógica SENAI (Gratuito) */}
          <div className="bg-[#e9f0e7] rounded-2xl p-4 shadow-xs flex flex-col gap-2.5 border border-[#bdcabf]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#0d8253] text-white flex items-center justify-center shadow-[0_3px_0_0_#005232]">
                  <span className="text-lg">💻</span>
                </div>
                <div className="flex flex-col">
                  <h4 className="font-heading font-bold text-sm text-[#161d18]">Lógica de Programação & Web</h4>
                  <span className="text-xs text-[#3e4941]">SENAI Tech • 60 Horas • Online</span>
                </div>
              </div>
              <span className="text-[10px] font-heading font-bold bg-[#93f7be] text-[#002111] px-2.5 py-0.5 rounded-full">
                GRÁTIS
              </span>
            </div>

            <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl text-xs border border-[#dde4db]">
              <span className="text-[#005e91] font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#005e91]" />
                +15% Intelecto
              </span>
              <span className="text-[#006740] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006740]" />
                Destrava Vaga Jr.
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleEnrollShortCourse('logica_senai', 'Lógica de Programação SENAI', 0, 15)}
              className="w-full bg-[#006740] hover:bg-[#0d8253] text-white font-heading font-bold text-xs py-2.5 rounded-xl shadow-[0_3px_0_0_#005232] active:translate-y-0.5 active:shadow-[0_1px_0_0_#005232] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{completedCourses.includes('logica_senai') ? '✅ Concluído' : 'Inscrever-se Gratuitamente'}</span>
            </button>
          </div>

          {/* Curso 2: Inglês Instrumental */}
          <div className="bg-[#e9f0e7] rounded-2xl p-4 shadow-xs flex flex-col gap-2.5 border border-[#bdcabf]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#0077b6] text-white flex items-center justify-center shadow-[0_3px_0_0_#004a74]">
                  <span className="text-lg">🗣️</span>
                </div>
                <div className="flex flex-col">
                  <h4 className="font-heading font-bold text-sm text-[#161d18]">Inglês Instrumental para TI</h4>
                  <span className="text-xs text-[#3e4941]">Aulas Gravadas + Exercícios Práticos</span>
                </div>
              </div>
              <span className="text-xs font-heading font-bold text-[#7c5800]">
                R$ 180<span className="text-[10px] text-[#3e4941] font-normal">/mês</span>
              </span>
            </div>

            <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl text-xs border border-[#dde4db]">
              <span className="text-[#005e91] font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#005e91]" />
                +12% Intelecto
              </span>
              <span className="text-[#7c5800] font-bold flex items-center gap-1">
                💳 Custo no Orçamento
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleEnrollShortCourse('ingles_ti', 'Inglês Instrumental', 180, 12)}
              className="w-full bg-[#dde4db] hover:bg-[#d5dcd3] text-[#161d18] font-heading font-bold text-xs py-2.5 rounded-xl shadow-[0_3px_0_0_#bdcabf] active:translate-y-0.5 active:shadow-[0_1px_0_0_#bdcabf] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{completedCourses.includes('ingles_ti') ? '✅ Matriculado' : 'Matricular (R$ 180)'}</span>
            </button>
          </div>

          {/* Curso 3: Gestão Financeira Pessoal */}
          <div className="bg-[#e9f0e7] rounded-2xl p-4 shadow-xs flex flex-col gap-2.5 border border-[#bdcabf]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#fdbb2d] text-[#271900] flex items-center justify-center shadow-[0_3px_0_0_#9a6b00]">
                  <span className="text-lg">💰</span>
                </div>
                <div className="flex flex-col">
                  <h4 className="font-heading font-bold text-sm text-[#161d18]">Gestão Financeira & Investimentos</h4>
                  <span className="text-xs text-[#3e4941]">Livros Digitais + Podcasts Semanais</span>
                </div>
              </div>
              <span className="text-[10px] font-heading font-bold bg-[#ffdea8] text-[#271900] px-2.5 py-0.5 rounded-full">
                LIVRE
              </span>
            </div>

            <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl text-xs border border-[#dde4db]">
              <span className="text-[#005e91] font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#005e91]" />
                +8% Intelecto
              </span>
              <span className="text-[#006740] font-bold flex items-center gap-1">
                🛡️ Economia Consciente
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleEnrollShortCourse('gestao_fin', 'Gestão Financeira', 0, 8)}
              className="w-full bg-[#dde4db] hover:bg-[#d5dcd3] text-[#161d18] font-heading font-bold text-xs py-2.5 rounded-xl shadow-[0_3px_0_0_#bdcabf] active:translate-y-0.5 active:shadow-[0_1px_0_0_#bdcabf] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{completedCourses.includes('gestao_fin') ? '✅ Lendo' : 'Ler Materiais'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SEÇÃO 3: ROTINA & HÁBITOS DE ESTUDO (AÇÕES DIÁRIAS) */}
      {/* ============================================================== */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xl">🔄</span>
            <h3 className="font-heading font-black text-sm text-[#161d18] tracking-tight">Rotina & Hábitos de Estudo</h3>
          </div>
          <span className="text-[10px] text-[#3e4941] font-heading font-bold">Ações do Dia</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {/* Ação 1: Flashcards */}
          <div className="bg-[#e9f0e7] p-3 rounded-2xl flex items-center justify-between gap-3 shadow-[0_2px_0_0_#bdcabf] border border-[#dde4db]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#006740] shadow-[0_2px_0_0_#bdcabf]">
                <BookMarked className="w-5 h-5 text-[#006740]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-xs text-[#161d18]">Revisão com Flashcards</span>
                <div className="flex items-center gap-2 text-[10px] font-heading font-bold mt-0.5">
                  <span className="text-[#005e91]">+3% Intelecto</span>
                  <span className="text-[#ba1a1a]">-5 Energia</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleDailyHabit('flashcards')}
              className="bg-[#006740] hover:bg-[#0d8253] text-white font-heading font-bold text-xs px-3.5 py-2 rounded-xl shadow-[0_3px_0_0_#005232] active:translate-y-0.5 active:shadow-[0_1px_0_0_#005232] transition-all shrink-0 cursor-pointer"
            >
              Estudar (1h)
            </button>
          </div>

          {/* Ação 2: Grupo na Biblioteca */}
          <div className="bg-[#e9f0e7] p-3 rounded-2xl flex items-center justify-between gap-3 shadow-[0_2px_0_0_#bdcabf] border border-[#dde4db]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#005e91] shadow-[0_2px_0_0_#bdcabf]">
                <Users className="w-5 h-5 text-[#005e91]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-xs text-[#161d18]">Grupo na Biblioteca Pública</span>
                <div className="flex items-center gap-2 text-[10px] font-heading font-bold mt-0.5">
                  <span className="text-[#005e91]">+4% Intelecto</span>
                  <span className="text-[#006740]">+Relações</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleDailyHabit('biblioteca')}
              className="bg-[#005e91] hover:bg-[#0077b6] text-white font-heading font-bold text-xs px-3.5 py-2 rounded-xl shadow-[0_3px_0_0_#004a74] active:translate-y-0.5 active:shadow-[0_1px_0_0_#004a74] transition-all shrink-0 cursor-pointer"
            >
              Reunir (2h)
            </button>
          </div>

          {/* Ação 3: Virar a Noite Estudando */}
          <div className="bg-[#e9f0e7] p-3 rounded-2xl flex items-center justify-between gap-3 shadow-[0_2px_0_0_#bdcabf] border border-[#dde4db]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#ba1a1a] shadow-[0_2px_0_0_#bdcabf]">
                <Coffee className="w-5 h-5 text-[#ba1a1a]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-xs text-[#161d18]">Virar a Noite no Café (Cramming)</span>
                <div className="flex items-center gap-2 text-[10px] font-heading font-bold mt-0.5">
                  <span className="text-[#005e91]">+8% Intelecto</span>
                  <span className="text-[#ba1a1a]">-Saúde / Estresse</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleDailyHabit('madrugar')}
              className="bg-[#dde4db] hover:bg-[#ffdad6] text-[#ba1a1a] font-heading font-bold text-xs px-3.5 py-2 rounded-xl shadow-[0_3px_0_0_#bdcabf] active:translate-y-0.5 active:shadow-[0_1px_0_0_#bdcabf] transition-all shrink-0 cursor-pointer"
            >
              Madrugar
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SEÇÃO 4: DILEMA ACADÊMICO DO SEMESTRE (STORY CARD TÁTIL) */}
      {/* ============================================================== */}
      <div className="bg-[#e9f0e7] rounded-2xl p-4 shadow-sm flex flex-col gap-3 relative overflow-hidden border border-[#bdcabf]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fdbb2d] animate-pulse" />
            <span className="text-[10px] font-heading font-black text-[#7c5800] uppercase tracking-wider">
              Dilema do Fim de Semana
            </span>
          </div>
          <span className="text-[10px] text-[#3e4941] font-heading font-bold">Decisão Crítica</span>
        </div>

        {/* Ilustração / Cabeçalho do Card de Evento */}
        <div className="w-full h-32 rounded-xl overflow-hidden relative shadow-[0_2px_6px_rgba(0,0,0,0.08)] bg-gradient-to-tr from-[#005232] via-[#0d8253] to-[#7c5800] flex items-end p-3">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
          <div className="relative z-10 flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold">Dilema Clássico</span>
            <span className="font-heading font-black text-sm text-white drop-shadow-md">
              O Grande Simulado vs. Pelada de Domingo ⚽
            </span>
          </div>
        </div>

        <p className="text-xs text-[#161d18] leading-relaxed">
          A galera do bairro marcou aquela pelada clássica de domingo à tarde no campinho, seguida de pastel na feira. Porém, faltam 4 meses para a prova e domingo tem simulado online de 90 questões com ranking estadual. O que priorizar?
        </p>

        {/* Botões de Escolha Modular Táteis com Custo e Recompensa */}
        <div className="flex flex-col gap-2 pt-1">
          {/* Opção A: Fazer o Simulado */}
          <button
            type="button"
            disabled={dilemmaResolved !== null}
            onClick={() => handleAcademicDilemmaChoice('simulado')}
            className={`w-full p-3 rounded-xl text-left transition-all flex flex-col gap-1 cursor-pointer ${
              dilemmaResolved === 'simulado'
                ? 'bg-[#e2ffe9] border-2 border-[#006740]'
                : 'bg-white hover:bg-[#f4fbf2] shadow-[0_3px_0_0_#bdcabf] active:translate-y-0.5 active:shadow-[0_1px_0_0_#bdcabf] border border-[#dde4db]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-xs text-[#006740] flex items-center gap-1.5">
                <span>📝</span> Focar no Simulado (90 Questões)
              </span>
              <span className="text-[10px] font-heading font-black text-[#006740]">+10% Foco no ENEM</span>
            </div>
            <span className="text-[11px] text-[#3e4941]">
              Melhora notas de corte • Custa 15 de Energia Mental e -5 Felicidade
            </span>
          </button>

          {/* Opção B: Ir à Pelada */}
          <button
            type="button"
            disabled={dilemmaResolved !== null}
            onClick={() => handleAcademicDilemmaChoice('pelada')}
            className={`w-full p-3 rounded-xl text-left transition-all flex flex-col gap-1 cursor-pointer ${
              dilemmaResolved === 'pelada'
                ? 'bg-[#ffdea8]/50 border-2 border-[#7c5800]'
                : 'bg-white hover:bg-[#f4fbf2] shadow-[0_3px_0_0_#bdcabf] active:translate-y-0.5 active:shadow-[0_1px_0_0_#bdcabf] border border-[#dde4db]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-xs text-[#7c5800] flex items-center gap-1.5">
                <span>⚽</span> Ir na Pelada & Descontrair
              </span>
              <span className="text-[10px] font-heading font-black text-[#7c5800]">+15 Felicidade / Saúde</span>
            </div>
            <span className="text-[11px] text-[#3e4941]">
              Fortalece amizades no bairro • Nenhum avanço no simulado deste mês
            </span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SEÇÃO 5: GESTÃO DAS ETAPAS ESCOLARES & GRADUAÇÃO (SELETOR) */}
      {/* ============================================================== */}
      <div className="pt-2">
        <h4 className="font-heading font-black text-xs text-[#161d18] uppercase tracking-wider mb-2">
          Etapas Oficiais de Formação & Matrícula
        </h4>

        {/* Tier Selector Chips */}
        <div className="p-1 bg-white rounded-2xl border border-[#dde4db] flex flex-wrap items-center justify-between gap-1 shadow-xs">
          <button
            type="button"
            onClick={() => { playClickSound(); setActiveTier('fundamental'); }}
            className={`flex-1 min-w-[100px] py-2 px-2 text-[10px] font-heading font-extrabold rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTier === 'fundamental'
                ? 'bg-[#006740] text-white shadow-xs'
                : 'text-[#3e4941] hover:bg-[#f4fbf2]'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            <span>Fundamental ({educationSystem.fundamentalYearsDone}/6)</span>
            {isFundamentalCompleted && <CheckCircle2 className="w-3 h-3 text-[#93f7be]" />}
          </button>

          <button
            type="button"
            onClick={() => { playClickSound(); setActiveTier('medio'); }}
            className={`flex-1 min-w-[100px] py-2 px-2 text-[10px] font-heading font-extrabold rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTier === 'medio'
                ? 'bg-[#006740] text-white shadow-xs'
                : 'text-[#3e4941] hover:bg-[#f4fbf2]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Médio ({educationSystem.medioYearsDone}/6)</span>
            {isMedioCompleted && <CheckCircle2 className="w-3 h-3 text-[#93f7be]" />}
          </button>

          <button
            type="button"
            onClick={() => { playClickSound(); setActiveTier('superior'); }}
            className={`flex-1 min-w-[100px] py-2 px-2 text-[10px] font-heading font-extrabold rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTier === 'superior'
                ? 'bg-[#006740] text-white shadow-xs'
                : 'text-[#3e4941] hover:bg-[#f4fbf2]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Graduação</span>
            {isCollegeCompleted && <CheckCircle2 className="w-3 h-3 text-[#93f7be]" />}
          </button>

          <button
            type="button"
            onClick={() => { playClickSound(); setActiveTier('turma'); }}
            className={`flex-1 min-w-[90px] py-2 px-2 text-[10px] font-heading font-extrabold rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTier === 'turma'
                ? 'bg-[#7c5800] text-white shadow-xs'
                : 'text-[#3e4941] hover:bg-[#f4fbf2]'
            }`}
          >
            <span>🏫 Turma</span>
          </button>
        </div>
      </div>

      {/* --- ETAPA: ENSINO FUNDAMENTAL --- */}
      {activeTier === 'fundamental' && (
        <div className="bg-white rounded-2xl p-4 border border-[#dde4db] shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#e3eae1] pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏫</span>
              <div>
                <h4 className="font-heading font-black text-sm text-[#161d18]">Ensino Fundamental</h4>
                <p className="text-[10px] text-[#3e4941]">6 anos de formação básica</p>
              </div>
            </div>
            <span className="text-xs font-heading font-bold text-[#006740] bg-[#e2ffe9] px-2.5 py-1 rounded-xl">
              {isFundamentalCompleted ? 'CONCLUÍDO 🎓' : `Ano ${educationSystem.fundamentalYearsDone + 1} de 6`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => showMsg(onStudyDaily('fundamental'))}
              className="p-3 rounded-xl bg-[#f4fbf2] hover:bg-[#e2ffe9] border border-[#bdcabf] text-left transition-all cursor-pointer"
            >
              <h5 className="font-heading font-bold text-xs text-[#161d18] mb-0.5">Estudar Lição</h5>
              <p className="text-[10px] text-[#3e4941]">+10 Intelecto e foco</p>
            </button>
            <button
              type="button"
              disabled={isFundamentalCompleted}
              onClick={() => showMsg(onAdvanceSchoolYear('fundamental'))}
              className="p-3 rounded-xl bg-[#006740] text-white text-left transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <h5 className="font-heading font-bold text-xs mb-0.5">Fazer Prova Final</h5>
              <p className="text-[10px] text-[#93f7be]">Avançar de ano 🚀</p>
            </button>
          </div>
        </div>
      )}

      {/* --- ETAPA: ENSINO MÉDIO --- */}
      {activeTier === 'medio' && (
        <div className="bg-white rounded-2xl p-4 border border-[#dde4db] shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#e3eae1] pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎒</span>
              <div>
                <h4 className="font-heading font-black text-sm text-[#161d18]">Ensino Médio</h4>
                <p className="text-[10px] text-[#3e4941]">Preparação pré-vestibular e técnico</p>
              </div>
            </div>
            <span className="text-xs font-heading font-bold text-[#006740] bg-[#e2ffe9] px-2.5 py-1 rounded-xl">
              {isMedioCompleted ? 'CONCLUÍDO 🎓' : `Ano ${educationSystem.medioYearsDone + 1} de 6`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => showMsg(onStudyDaily('medio'))}
              className="p-3 rounded-xl bg-[#f4fbf2] hover:bg-[#e2ffe9] border border-[#bdcabf] text-left transition-all cursor-pointer"
            >
              <h5 className="font-heading font-bold text-xs text-[#161d18] mb-0.5">Estudar para ENEM</h5>
              <p className="text-[10px] text-[#3e4941]">+15 Intelecto</p>
            </button>
            <button
              type="button"
              disabled={isMedioCompleted}
              onClick={() => showMsg(onAdvanceSchoolYear('medio'))}
              className="p-3 rounded-xl bg-[#006740] text-white text-left transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <h5 className="font-heading font-bold text-xs mb-0.5">Avançar Ano</h5>
              <p className="text-[10px] text-[#93f7be]">Passar de ano escolar</p>
            </button>
          </div>
        </div>
      )}

      {/* --- ETAPA: GRADUAÇÃO & VESTIBULARES --- */}
      {activeTier === 'superior' && (
        <div className="bg-white rounded-2xl p-4 border border-[#dde4db] shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#e3eae1] pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              <div>
                <h4 className="font-heading font-black text-sm text-[#161d18]">Ensino Superior (Graduação)</h4>
                <p className="text-[10px] text-[#3e4941]">Preste o vestibular para ingressar na universidade</p>
              </div>
            </div>
          </div>

          {isCollegeEnrolled ? (
            <div className="p-3 rounded-xl bg-[#e2ffe9] border border-[#93f7be] flex items-center justify-between">
              <div>
                <h5 className="font-heading font-black text-xs text-[#005232]">
                  Cursando: {career.collegeMajor}
                </h5>
                <p className="text-[11px] text-[#006740]">Semestre {career.collegeSemester || 1} de 8 cursado</p>
              </div>
              <button
                type="button"
                onClick={() => showMsg(onAdvanceCollegeYear())}
                className="py-1.5 px-3 bg-[#006740] text-white text-xs font-heading font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Avançar Semestre 🚀
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#3e4941] font-bold">Cursos de Graduação ({COLLEGE_MAJORS.length} disponíveis):</p>
                <span className="text-[10px] text-[#006740] font-bold">Vestibular 5 Perguntas</span>
              </div>

              {/* Filtros por Área */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10.5px]">
                {['TODAS', 'Saúde', 'Jurídico', 'Tecnologia', 'Exatas', 'Humanas', 'Educação', 'Biológicas'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedMajorCategory(cat)}
                    aria-pressed={selectedMajorCategory === cat}
                    className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all cursor-pointer ${
                      selectedMajorCategory === cat
                        ? 'bg-[#006740] text-white shadow-xs'
                        : 'bg-[#eef6ec] text-[#3e4941] hover:bg-[#e3eae1]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1">
                {COLLEGE_MAJORS.filter(m => selectedMajorCategory === 'TODAS' || m.category.includes(selectedMajorCategory)).map((m) => (
                  <div key={m.id} className="p-3 rounded-xl border border-[#dde4db] bg-[#f4fbf2] flex flex-col justify-between gap-2 shadow-xs hover:border-[#006740] transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <h6 className="font-heading font-black text-xs text-[#161d18]">{m.name}</h6>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#e3eae1] text-[#005232]">{m.category}</span>
                      </div>
                      <p className="text-[10px] text-[#3e4941] leading-snug">{m.description}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[#3e4941]">
                        <span className="font-bold text-[#006740]">{m.isPublic ? 'USP / FATEC (Gratuito)' : `Mensalidade: R$ ${m.monthlyTuition}/mês`}</span>
                        <span>• Intelecto mín: {m.minIntelecto} pts</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-[#dde4db]/60 flex items-center justify-between">
                      <span className="text-[9.5px] text-[#004a74] font-bold truncate max-w-[170px]">
                        🔓 Desbloqueia: {m.unlockedRoles?.slice(0, 2).join(', ') || 'Cargos Específicos'}
                      </span>
                      <button
                        type="button"
                        onClick={() => onStartCollegeEnrollment(m)}
                        className="py-1 px-3 bg-[#005e91] hover:bg-[#0077b6] text-white font-heading font-bold text-[11px] rounded-lg cursor-pointer shadow-xs transition-all shrink-0 active:scale-95"
                      >
                        Vestibular 📝
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- ETAPA: MINHA TURMA --- */}
      {activeTier === 'turma' && (
        <div className="bg-white rounded-2xl p-4 border border-[#dde4db] shadow-xs space-y-3">
          <h4 className="font-heading font-black text-sm text-[#161d18]">Minha Turma de Sala de Aula</h4>
          <div className="grid grid-cols-2 gap-2">
            {classmates.map((col) => (
              <div key={col.id} className="p-2.5 rounded-xl bg-[#f4fbf2] border border-[#dde4db] flex items-center gap-2">
                <span className="text-2xl">{col.avatar}</span>
                <div>
                  <h6 className="font-heading font-bold text-xs text-[#161d18]">{col.name}</h6>
                  <span className="text-[10px] text-[#3e4941]">Afinidade: {col.relationshipScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
