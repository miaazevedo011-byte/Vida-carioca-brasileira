import React, { useState } from 'react';
import { BrazilNews } from '../data/brazil_news';
import { Newspaper, TrendingUp, TrendingDown, Sparkles, Share2, ThumbsUp, AlertCircle, Radio } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface BrazilNewsTickerProps {
  news?: BrazilNews;
  currentYear: number;
  timeAdvanceMode?: 'anual' | 'semestral' | 'mensal';
  timeSubPeriod?: number;
  onReactToNews?: (news: BrazilNews) => void;
}

export const BrazilNewsTicker: React.FC<BrazilNewsTickerProps> = ({
  news,
  currentYear,
  timeAdvanceMode = 'anual',
  timeSubPeriod = 1,
  onReactToNews
}) => {
  const [reacted, setReacted] = useState(false);

  // Auto-reset tracking state whenever a new headline arrives
  React.useEffect(() => {
    setReacted(false);
  }, [news?.id, news?.headline]);

  if (!news) return null;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'economia':
        return 'bg-[#edf5fd] text-[#0B66C3] border-[#b8d6f5]';
      case 'politica':
        return 'bg-[#fef3eb] text-[#c25e10] border-[#fcd8bf]';
      case 'social':
        return 'bg-[#e6f5ed] text-[#006437] border-[#9fe0be]';
      case 'cultura':
        return 'bg-[#f5eeff] text-[#7828c8] border-[#dfcbf9]';
      case 'tecnologia':
        return 'bg-[#e6f9fd] text-[#00708f] border-[#b2e8f5]';
      default:
        return 'bg-[#f5f3ed] text-[#566359] border-[#e4e1d7]';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'economia':
        return 'ECONOMIA & MERCADO';
      case 'politica':
        return 'POLÍTICA & BRASÍLIA';
      case 'social':
        return 'SOCIEDADE & BRASIL';
      case 'cultura':
        return 'CULTURA & ESPORTE';
      case 'tecnologia':
        return 'TECNOLOGIA & INOVAÇÃO';
      default:
        return 'NOTÍCIAS';
    }
  };

  const handleReact = () => {
    if (reacted) return;
    playClickSound();
    playSuccessSound();
    setReacted(true);
    if (news.happinessDelta > 0) {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.3 } });
    }
    if (onReactToNews) {
      onReactToNews(news);
    }
  };

  return (
    <div className="bg-[#ffffff] rounded-2xl p-3.5 sm:p-4 border border-[#e4e1d7] shadow-xs relative overflow-hidden transition-all text-left">
      {/* Newspaper Top Bar */}
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#f0eee8]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#141E18] text-[#75E2A7] flex items-center justify-center text-sm shadow-xs">
            <Newspaper className="w-4 h-4 text-[#75E2A7]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-black text-xs text-[#141E18] tracking-wider uppercase">
                Notícias do Brasil
              </span>
              <span className="flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 text-[9px] font-extrabold uppercase font-heading animate-pulse">
                <Radio className="w-2.5 h-2.5" />
                {timeAdvanceMode === 'mensal'
                  ? `Mês ${timeSubPeriod} • ${currentYear}`
                  : timeAdvanceMode === 'semestral'
                  ? `${timeSubPeriod}º Semestre • ${currentYear}`
                  : `Edição ${news.year || currentYear}`}
              </span>
            </div>
            <p className="text-[10px] text-[#566359]">{news.source}</p>
          </div>
        </div>

        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border font-heading ${getCategoryColor(news.category)}`}>
          {getCategoryLabel(news.category)}
        </span>
      </div>

      {/* Headline & Body */}
      <div className="space-y-1.5">
        <h4 className="font-heading font-black text-sm sm:text-[15px] text-[#141E18] leading-snug flex items-start gap-1.5">
          <span className="text-base select-none">{news.icon}</span>
          <span>{news.headline}</span>
        </h4>
        <p className="text-xs text-[#566359] leading-relaxed">
          {news.summary}
        </p>

        {news.economicContext && (
          <p className="text-[11px] text-[#2c4033] bg-[#f7f5ed] px-2.5 py-1.5 rounded-xl border border-[#ece9df] font-medium">
            💡 <strong>Contexto do País:</strong> {news.economicContext}
          </p>
        )}
      </div>

      {/* Impact Indicators & Reaction Button */}
      <div className="mt-3 pt-2.5 border-t border-[#f0eee8] flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap text-[11px]">
          <span className="text-[10px] uppercase font-bold text-[#566359] font-heading">Impacto no Cidadão:</span>
          {news.happinessDelta !== 0 && (
            <span className={`px-2 py-0.5 rounded-md font-heading font-extrabold text-[10px] flex items-center gap-1 ${
              news.happinessDelta > 0 ? 'bg-[#e6f5ed] text-[#006437]' : 'bg-[#fff0f0] text-[#D9532F]'
            }`}>
              {news.happinessDelta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {news.happinessDelta > 0 ? `+${news.happinessDelta}` : news.happinessDelta} Felicidade
            </span>
          )}

          {news.serasaDelta !== 0 && (
            <span className={`px-2 py-0.5 rounded-md font-heading font-extrabold text-[10px] flex items-center gap-1 ${
              news.serasaDelta > 0 ? 'bg-[#edf5fd] text-[#0B66C3]' : 'bg-[#fff0f0] text-[#D9532F]'
            }`}>
              {news.serasaDelta > 0 ? '+' : ''}{news.serasaDelta} Serasa Score
            </span>
          )}
        </div>

        <button
          onClick={handleReact}
          disabled={reacted}
          className={`py-1 px-3 rounded-xl font-heading font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
            reacted
              ? 'bg-[#e6f5ed] text-[#006437] border border-[#a2e6bd] cursor-default'
              : 'bg-[#141E18] hover:bg-[#28382d] text-white shadow-xs'
          }`}
        >
          {reacted ? (
            <>
              <span>✓ Informado(a)</span>
            </>
          ) : (
            <>
              <ThumbsUp className="w-3 h-3 text-[#F4B300]" />
              <span>Acompanhar Notícia</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
