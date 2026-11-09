import React, { useState } from 'react';
import { ExamQuestion, getRandomExamQuestions } from '../data/examQuestions';
import { Award, CheckCircle2, XCircle, AlertCircle, HelpCircle, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { playClickSound, playSuccessSound, playErrorSound, playCoinSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface SelectionExamModalProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  examType: 'emprego' | 'concurso' | 'faculdade';
  categoryHint?: string;
  onPass: () => void;
  onFail: (message: string) => void;
  onClose: () => void;
}

export const SelectionExamModal: React.FC<SelectionExamModalProps> = ({
  isOpen,
  title,
  subtitle,
  examType,
  categoryHint,
  onPass,
  onFail,
  onClose
}) => {
  const [questions, setQuestions] = useState<ExamQuestion[]>(() => getRandomExamQuestions(5, categoryHint));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isPassed, setIsPassed] = useState(false);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswerConfirmed) return;
    playClickSound();
    setSelectedOption(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null || isAnswerConfirmed) return;
    setIsAnswerConfirmed(true);

    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      playSuccessSound();
      setCorrectCount(prev => prev + 1);
    } else {
      playErrorSound();
      const newWrong = wrongCount + 1;
      setWrongCount(newWrong);

      // Check if already reached 3 errors (instant failure condition)
      if (newWrong >= 3) {
        // Failed immediately!
        setTimeout(() => {
          setIsFinished(true);
          setIsPassed(false);
        }, 1400);
        return;
      }
    }
  };

  const handleNextQuestion = () => {
    playClickSound();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerConfirmed(false);
    } else {
      // Finished all 5 questions
      const finalPassed = wrongCount < 3; // Passed if fewer than 3 errors
      setIsFinished(true);
      setIsPassed(finalPassed);
      if (finalPassed) {
        playCoinSound();
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  const handleFinishAndProceed = () => {
    playClickSound();
    if (isPassed) {
      onPass();
    } else {
      onFail(`Reprovado no processo seletivo (${wrongCount} erro(s)). Errou 3 ou mais questões.`);
    }
  };

  const handleRetry = () => {
    playClickSound();
    setQuestions(getRandomExamQuestions(5, categoryHint));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerConfirmed(false);
    setCorrectCount(0);
    setWrongCount(0);
    setIsFinished(false);
    setIsPassed(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in text-left">
      <div className="bg-[#ffffff] rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-[#ece9df] space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f0eee8] pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl font-bold ${
              examType === 'concurso' ? 'bg-[#fff9e6] text-[#b07d00]' : examType === 'faculdade' ? 'bg-[#edf5fd] text-[#0B66C3]' : 'bg-[#e6f5ed] text-[#087F48]'
            }`}>
              {examType === 'concurso' ? '🏛️' : examType === 'faculdade' ? '🎓' : '📝'}
            </div>
            <div>
              <span className="text-[10px] font-heading font-black uppercase tracking-wider text-[#566359] bg-[#f5f3ed] px-2 py-0.5 rounded-full">
                Simulação de Prova Oficial • 5 Questões
              </span>
              <h3 className="font-heading font-black text-sm sm:text-base text-[#141E18] leading-tight">
                {title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#f0eee8] text-[#141E18] font-bold text-xs flex items-center justify-center hover:bg-[#e4e1d7] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Score and Rules Bar */}
        <div className="bg-[#fbf9f3] rounded-2xl p-3 border border-[#ece9df] flex items-center justify-between text-xs font-heading">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-bold text-[#087F48]">
              <CheckCircle2 className="w-4 h-4" /> Acertos: {correctCount}
            </span>
            <span className="flex items-center gap-1 font-bold text-[#D9532F]">
              <XCircle className="w-4 h-4" /> Erros: {wrongCount}/3
            </span>
          </div>

          <span className="text-[11px] font-extrabold text-[#566359] bg-white px-2.5 py-1 rounded-lg border border-[#e4e1d7]">
            Questão {currentIndex + 1} de 5
          </span>
        </div>

        {/* FINISHED SCREEN */}
        {isFinished ? (
          <div className="text-center py-6 space-y-4 animate-fade-in">
            <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-inner ${
              isPassed ? 'bg-[#e6f5ed] text-[#087F48] border-2 border-[#a2e6bd]' : 'bg-[#fff0f0] text-[#D9532F] border-2 border-[#f9d7d7]'
            }`}>
              {isPassed ? '🎉' : '❌'}
            </div>

            <div>
              <span className={`text-xs font-black uppercase px-3 py-1 rounded-full font-heading inline-block mb-1 ${
                isPassed ? 'bg-[#e6f5ed] text-[#006437]' : 'bg-[#fff0f0] text-[#D9532F]'
              }`}>
                {isPassed ? 'APROVADO COM SUCESSO!' : 'REPROVADO NA PROVA'}
              </span>
              <h4 className="font-heading font-black text-xl text-[#141E18]">
                {isPassed ? 'Parabéns! Você passou na prova!' : 'Não foi dessa vez! Errou 3 ou mais questões.'}
              </h4>
              <p className="text-xs text-[#566359] mt-1 max-w-sm mx-auto">
                {isPassed
                  ? `Você teve ${correctCount} acerto(s) e apenas ${wrongCount} erro(s). Critério de aprovação cumprido!`
                  : `Regra da banca: Se errar 3 questões, o candidato é reprovado. Você acumulou ${wrongCount} erros.`}
              </p>
            </div>

            <div className="pt-3 flex gap-2">
              {isPassed ? (
                <button
                  onClick={handleFinishAndProceed}
                  className="w-full py-3 rounded-2xl bg-[#087F48] hover:bg-[#006437] text-white font-heading font-black text-sm transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Garantir Vaga / Matrícula
                </button>
              ) : (
                <div className="w-full flex gap-2">
                  <button
                    onClick={handleRetry}
                    className="flex-1 py-3 rounded-2xl bg-[#0B66C3] hover:bg-[#084e96] text-white font-heading font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Tentar Novamente
                  </button>
                  <button
                    onClick={() => onFail('Reprovado no processo seletivo.')}
                    className="py-3 px-4 rounded-2xl bg-[#f0eee8] hover:bg-[#e4e1d7] text-[#141E18] font-heading font-bold text-xs transition-all cursor-pointer"
                  >
                    Desistir
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ACTIVE QUESTION SCREEN */
          <div className="space-y-4">
            {/* Question Text */}
            <div className="bg-[#fcfbf7] p-4 rounded-2xl border border-[#ece9df]">
              <span className="text-[10px] font-bold text-[#0B66C3] uppercase tracking-wider block mb-1">
                Matéria: {currentQ.category.toUpperCase().replace('_', ' ')}
              </span>
              <p className="font-heading font-bold text-sm text-[#141E18] leading-relaxed">
                {currentQ.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                let optStyle = 'border-[#ece9df] bg-white hover:border-[#087F48] text-[#141E18]';

                if (isAnswerConfirmed) {
                  if (idx === currentQ.correctIndex) {
                    optStyle = 'border-[#087F48] bg-[#e6f5ed] text-[#006437] font-bold ring-2 ring-[#087F48]/30';
                  } else if (isSelected) {
                    optStyle = 'border-[#D9532F] bg-[#fff0f0] text-[#D9532F] font-bold';
                  } else {
                    optStyle = 'border-[#ece9df] bg-white/60 opacity-60 text-[#566359]';
                  }
                } else if (isSelected) {
                  optStyle = 'border-[#087F48] bg-[#f0fdf4] text-[#006437] ring-2 ring-[#087F48]/20 font-bold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerConfirmed}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-start gap-2.5 ${optStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-[#f0eee8] flex items-center justify-center text-[10px] font-bold font-mono flex-shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug flex-1">{opt}</span>
                    {isAnswerConfirmed && idx === currentQ.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 text-[#087F48] flex-shrink-0" />
                    )}
                    {isAnswerConfirmed && isSelected && idx !== currentQ.correctIndex && (
                      <XCircle className="w-4 h-4 text-[#D9532F] flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after confirmation */}
            {isAnswerConfirmed && (
              <div className={`p-3 rounded-xl border text-xs animate-fade-in ${
                selectedOption === currentQ.correctIndex
                  ? 'bg-[#e6f5ed] border-[#a2e6bd] text-[#006437]'
                  : 'bg-[#fff0f0] border-[#f9d7d7] text-[#D9532F]'
              }`}>
                <div className="flex items-center gap-1.5 font-heading font-black mb-1">
                  {selectedOption === currentQ.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Resposta Correta!
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" /> Resposta Incorreta!
                    </>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed text-[#3e4940]">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Action button */}
            <div className="pt-2">
              {!isAnswerConfirmed ? (
                <button
                  onClick={handleConfirmAnswer}
                  disabled={selectedOption === null}
                  className="w-full py-2.5 rounded-xl bg-[#087F48] hover:bg-[#006437] text-white font-heading font-bold text-xs transition-all cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Confirmar Resposta
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="w-full py-2.5 rounded-xl bg-[#0B66C3] hover:bg-[#084e96] text-white font-heading font-bold text-xs transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>{currentIndex + 1 < questions.length ? 'Próxima Questão' : 'Ver Resultado Final'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
