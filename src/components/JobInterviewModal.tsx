import React, { useState } from 'react';
import { JobListing } from '../data/careers';
import { JobBenefit, InterviewQuestion } from '../types/game';
import { Briefcase, CheckCircle2, XCircle, Award, Sparkles, UserCheck, MessageSquare, ArrowRight } from 'lucide-react';
import { playClickSound, playSuccessSound, playErrorSound, playCoinSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface JobInterviewModalProps {
  job: JobListing;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: {
    approved: boolean;
    finalSalary: number;
    extraBenefits: JobBenefit[];
    feedback: string;
  }) => void;
}

const GENERATE_QUESTIONS_FOR_JOB = (job: JobListing): InterviewQuestion[] => {
  if (job.category === 'TI & Comunicação') {
    return [
      {
        id: 'q1',
        question: 'Qual a sua abordagem quando um sistema em produção apresenta um bug crítico fora do horário comercial?',
        options: [
          {
            text: 'Analiso os logs imediatamente, comunico o time e aplico um hotfix seguro com testes.',
            score: 35,
            salaryModifier: 1.15,
            feedbackNarrative: 'O entrevistador ficou impressionado com sua postura proativa e senso de urgência!'
          },
          {
            text: 'Espero até a manhã do dia seguinte para discutir a solução na daily meeting.',
            score: 10,
            salaryModifier: 0.95,
            feedbackNarrative: 'A equipe achou um pouco passiva a atitude para ambiente crítico.'
          },
          {
            text: 'Culpo a equipe de infraestrutura e reencaminho o chamado no Jira sem averiguar.',
            score: 0,
            salaryModifier: 0.85,
            feedbackNarrative: 'Demonstrou pouca responsabilidade de equipe.'
          }
        ]
      },
      {
        id: 'q2',
        question: 'Como você lida com tecnologias legadas e código sem documentação?',
        options: [
          {
            text: 'Refatoro aos poucos com testes de regressão e documentação clara para o time.',
            score: 35,
            salaryModifier: 1.10,
            bonusBenefit: { name: 'Auxílio Certificação Tech', icon: '💻', valueDescription: 'Cursos & Provas 100% Pagos' },
            feedbackNarrative: 'Excelente mentalidade de arquitetura sustentável!'
          },
          {
            text: 'Reescrevo tudo do zero na linguagem da moda sem avisar o gestor.',
            score: 15,
            salaryModifier: 1.0,
            feedbackNarrative: 'Idealismo arriscado para prazos corporativos.'
          },
          {
            text: 'Prefiro não mexer para não quebrar nada e empurro com a barriga.',
            score: 5,
            salaryModifier: 0.9,
            feedbackNarrative: 'Demonstrou medo de desafios técnicos.'
          }
        ]
      },
      {
        id: 'q3',
        question: 'Por que você deseja trabalhar na nossa empresa?',
        options: [
          {
            text: 'Estudei a arquitetura e cultura da empresa e quero somar com meu aprendizado e dedicação.',
            score: 30,
            salaryModifier: 1.10,
            feedbackNarrative: 'Respostas sinceras e alinhadas aos valores da empresa!'
          },
          {
            text: 'Achei o salário bom e preciso pagar minhas contas do cartão.',
            score: 15,
            salaryModifier: 1.0,
            feedbackNarrative: 'Honesto, porém sem brilho nos olhos.'
          },
          {
            text: 'Só enviei o currículo porque estava na primeira página do LinkedIn.',
            score: 0,
            salaryModifier: 0.85,
            feedbackNarrative: 'Demonstrou desinteresse total.'
          }
        ]
      }
    ];
  }

  if (job.category === 'Serviços & Comércio' || job.category === 'Trabalho Externo & Transporte' || job.category === 'Vendas Leves') {
    return [
      {
        id: 'q1',
        question: 'Um cliente está indeciso e reclamando do preço alto. Qual seu argumento?',
        options: [
          {
            text: 'Mostro o valor e benefícios exclusivos do produto que compensam o investimento no longo prazo.',
            score: 35,
            salaryModifier: 1.20,
            bonusBenefit: { name: 'Comissão Premium Bônus', icon: '🏆', valueDescription: '+15% sobre Metas' },
            feedbackNarrative: 'Poder de persuasão e foco em valor incríveis!'
          },
          {
            text: 'Dou um desconto imediato do meu próprio bolso para não perder a venda.',
            score: 15,
            salaryModifier: 1.0,
            feedbackNarrative: 'Prejudica a margem de lucro da empresa.'
          },
          {
            text: 'Digo que se está achando caro ele pode procurar a concorrência.',
            score: 0,
            salaryModifier: 0.8,
            feedbackNarrative: 'Atitude inaceitável em atendimento.'
          }
        ]
      },
      {
        id: 'q2',
        question: 'Como você lida com metas agressivas de vendas no fim do mês?',
        options: [
          {
            text: 'Organizo meu funil de leads, aumento o ritmo de abordagens e foco nos clientes mais quentes.',
            score: 35,
            salaryModifier: 1.10,
            feedbackNarrative: 'Mentalidade focada em resultados e estratégia!'
          },
          {
            text: 'Trabalho normal e seja o que Deus quiser.',
            score: 15,
            salaryModifier: 0.95,
            feedbackNarrative: 'Falta de garra comercial.'
          },
          {
            text: 'Fico estressado e reclamo do gerente no grupo do WhatsApp.',
            score: 0,
            salaryModifier: 0.85,
            feedbackNarrative: 'Perfil tóxico para a equipe.'
          }
        ]
      },
      {
        id: 'q3',
        question: 'Qual sua maior virtude como profissional?',
        options: [
          {
            text: 'Empatia para entender a dor do cliente e persistência ética nas negociações.',
            score: 30,
            salaryModifier: 1.10,
            feedbackNarrative: 'Conexão genuína com o cliente.'
          },
          {
            text: 'Sei falar muito rápido sem deixar o cliente pensar.',
            score: 15,
            salaryModifier: 1.0,
            feedbackNarrative: 'Tática ultrapassada.'
          },
          {
            text: 'Nunca chego no horário mas compenso no carisma.',
            score: 5,
            salaryModifier: 0.9,
            feedbackNarrative: 'Falta de pontualidade é um ponto fraco.'
          }
        ]
      }
    ];
  }

  // General Questions
  return [
    {
      id: 'q1',
      question: `Como você reagiria se recebesse um feedback construtivo exigindo mudanças no seu trabalho na ${job.company}?`,
      options: [
        {
          text: 'Escuto com atenção, me coloco à disposição para aprender e ajusto minha rotina imediatamente.',
          score: 35,
          salaryModifier: 1.15,
          bonusBenefit: { name: 'Gympass & Wellhub VIP', icon: '🏋️', valueDescription: 'Acesso a Academias Premium' },
          feedbackNarrative: 'Alta maturidade profissional e inteligência emocional!'
        },
        {
          text: 'Concordo na hora, mas continuo fazendo do meu jeito no dia a dia.',
          score: 15,
          salaryModifier: 0.95,
          feedbackNarrative: 'Resistência velada a mudanças.'
        },
        {
          text: 'Fico chateado e levo para o lado pessoal.',
          score: 0,
          salaryModifier: 0.85,
          feedbackNarrative: 'Demonstrou imaturidade para trabalhar sob gestão.'
        }
      ]
    },
    {
      id: 'q2',
      question: 'Qual a sua postura em relação a trabalho em equipe e prazos apertados?',
      options: [
        {
          text: 'Priorizo as tarefas cruciais, ajudo colegas sobrecarregados e me comunico com transparência.',
          score: 35,
          salaryModifier: 1.10,
          feedbackNarrative: 'Espírito de liderança e colaboração!'
        },
        {
          text: 'Faço apenas a minha parte estrita e não me envolvo no trabalho dos outros.',
          score: 15,
          salaryModifier: 1.0,
          feedbackNarrative: 'Individualista.'
        },
        {
          text: 'Deixo as tarefas para a última hora e entro em pânico.',
          score: 5,
          salaryModifier: 0.9,
          feedbackNarrative: 'Gestão de tempo deficiente.'
        }
      ]
    },
    {
      id: 'q3',
      question: `Por que a ${job.company} deve contratar você entre tantos candidatos?`,
      options: [
        {
          text: 'Porque uno minha garra técnica com forte ética de trabalho para agregar valor real à equipe.',
          score: 30,
          salaryModifier: 1.15,
          feedbackNarrative: 'Excelente energia e alinhamento com a vaga!'
        },
        {
          text: 'Porque preciso do dinheiro para pagar minhas contas no final do mês.',
          score: 15,
          salaryModifier: 1.0,
          feedbackNarrative: 'Motivação puramente financeira.'
        },
        {
          text: 'Porque não achei opção melhor na cidade.',
          score: 0,
          salaryModifier: 0.8,
          feedbackNarrative: 'Resposta desqualificante.'
        }
      ]
    }
  ];
};

export const JobInterviewModal: React.FC<JobInterviewModalProps> = ({
  job,
  isOpen,
  onClose,
  onComplete
}) => {
  const [questions] = useState<InterviewQuestion[]>(() => GENERATE_QUESTIONS_FOR_JOB(job));
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [salaryMod, setSalaryMod] = useState<number>(1.0);
  const [extraBenefits, setExtraBenefits] = useState<JobBenefit[]>([]);
  const [feedbacks, setFeedbacks] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (opt: any) => {
    playClickSound();
    const newScore = totalScore + opt.score;
    const newMod = salaryMod * opt.salaryModifier;
    const newFeedbacks = [...feedbacks, opt.feedbackNarrative];
    let newBenefits = [...extraBenefits];

    if (opt.bonusBenefit) {
      newBenefits.push(opt.bonusBenefit);
    }

    setTotalScore(newScore);
    setSalaryMod(newMod);
    setFeedbacks(newFeedbacks);
    setExtraBenefits(newBenefits);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Finished all questions
      setIsFinished(true);
      const isApproved = newScore >= 50;
      const calculatedSalary = Math.round(job.salaryMonthly * newMod);

      if (isApproved) {
        confetti({ particleCount: 70, spread: 70 });
        playSuccessSound();
      } else {
        playErrorSound();
      }

      setTimeout(() => {
        onComplete({
          approved: isApproved,
          finalSalary: calculatedSalary,
          extraBenefits: newBenefits,
          feedback: newFeedbacks.join(' ')
        });
      }, 2500);
    }
  };

  const isApproved = totalScore >= 50;
  const finalCalculatedSalary = Math.round(job.salaryMonthly * salaryMod);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#ffffff] rounded-3xl border border-[#e4e1d7] shadow-[0px_20px_50px_rgba(20,30,24,0.2)] max-w-lg w-full p-5 sm:p-6 text-left relative overflow-hidden space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#f0eee8] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#e6f5ed] border border-[#a2e6bd] text-[#087F48] flex items-center justify-center text-xl font-heading font-black">
              👔
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#087F48] bg-[#e6f5ed] px-2 py-0.5 rounded font-heading">
                ENTREVISTA DE EMPREGO
              </span>
              <h3 className="font-heading font-extrabold text-base text-[#141E18]">
                {job.title}
              </h3>
              <p className="text-xs text-[#566359]">{job.company} • Vaga {job.category}</p>
            </div>
          </div>
        </div>

        {!isFinished ? (
          <div className="space-y-4">
            {/* Question Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-heading font-extrabold text-[#566359]">
                <span>PERGUNTA {currentIndex + 1} DE {questions.length}</span>
                <span>DESEMPENHO: {Math.round((totalScore / 100) * 100)}%</span>
              </div>
              <div className="w-full bg-[#f0eee8] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#087F48] h-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="p-4 rounded-2xl bg-[#fbf9f3] border border-[#ece9df] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B66C3]">
                <MessageSquare className="w-4 h-4" />
                <span>Pergunta do Recrutador HR:</span>
              </div>
              <p className="font-heading font-bold text-sm sm:text-base text-[#141E18]">
                "{currentQ.question}"
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  className="w-full p-3.5 rounded-2xl bg-[#ffffff] hover:bg-[#e6f5ed] border border-[#ece9df] hover:border-[#087F48] transition-all text-left group cursor-pointer shadow-xs flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-[#f0eee8] group-hover:bg-[#087F48] group-hover:text-white font-heading font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-[#141E18] group-hover:text-[#006437] leading-relaxed">
                    {opt.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Result Summary Screen */
          <div className="text-center space-y-4 py-2 animate-fade-in">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-inner ${isApproved ? 'bg-[#e6f5ed] border border-[#a2e6bd] text-[#087F48]' : 'bg-[#fff0f0] border border-[#f9d7d7] text-[#D9532F]'}`}>
              {isApproved ? '🎉' : '❌'}
            </div>

            <div>
              <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full font-heading inline-block mb-1 ${isApproved ? 'bg-[#e6f5ed] text-[#087F48]' : 'bg-[#fff0f0] text-[#D9532F]'}`}>
                {isApproved ? 'APROVADO NA ENTREVISTA!' : 'REPROVADO NO PROCESSO SELETIVO'}
              </span>
              <h2 className="text-xl font-black font-heading text-[#141E18]">
                {isApproved ? 'Parabéns pela Contratação!' : 'Vaga Encerrada'}
              </h2>
              <p className="text-xs text-[#566359] mt-1 max-w-sm mx-auto">
                {isApproved
                  ? `Sua performance agradou aos recrutadores da ${job.company}! Salário final negociado: R$ ${finalCalculatedSalary.toLocaleString('pt-BR')}/mês.`
                  : `Infelizmente suas respostas não atingiram a pontuação necessária para a vaga da ${job.company}.`}
              </p>
            </div>

            {isApproved && (
              <div className="p-3.5 rounded-2xl bg-[#fbf9f3] border border-[#ece9df] text-left space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#566359] block font-heading">
                  Pacote de Benefícios Oferecido:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(job.benefits || []).concat(extraBenefits).map((b, i) => (
                    <span key={i} className="text-[10px] font-bold bg-[#e6f5ed] text-[#006437] px-2 py-1 rounded-lg border border-[#a2e6bd] flex items-center gap-1 font-heading">
                      <span>{b.icon}</span>
                      <span>{b.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
