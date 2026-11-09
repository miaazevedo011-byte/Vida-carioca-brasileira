import React, { useMemo } from 'react';
import { Newspaper } from 'lucide-react';

const HEADLINES = [
  "Preço da soja dispara no mercado externo após seca no Centro-Oeste.",
  "Cooperativas locais relatam praga de cigarrinha nas lavouras de milho.",
  "Exportações de café batem recorde este trimestre.",
  "Dólar alto favorece produtores de soja e algodão.",
  "Previsão de geada deve reduzir a produtividade do café na região sul.",
  "Nova tecnologia de irrigação reduz custos em 15% para grandes fazendas.",
];

export const HarvestBulletin: React.FC = () => {
  const headline = useMemo(() => HEADLINES[Math.floor(Math.random() * HEADLINES.length)], []);

  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
      <div className="flex items-center gap-2 text-amber-800">
        <Newspaper className="w-5 h-5" />
        <h3 className="font-bold text-sm">Boletim de Safra</h3>
      </div>
      <p className="text-sm text-amber-900">{headline}</p>
    </div>
  );
};
