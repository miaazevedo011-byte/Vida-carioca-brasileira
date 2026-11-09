import React, { useState } from 'react';
import { AgroState, Stats } from '../../types/game';
import { CROP_TYPES, MACHINERY_CATALOG, LIVESTOCK_OPTIONS, INVESTMENT_LEVELS, MID_CROP_DILEMMAS, CropType, MachineryItem, LivestockOption } from '../../data/agro';
import { Tractor, Sprout, TrendingUp, DollarSign, Award, CheckCircle2, AlertCircle, Sparkles, Building2, ShieldCheck, ArrowRight, Wheat, Compass, AlertTriangle, ShieldAlert, Landmark, RefreshCw } from 'lucide-react';
import { playClickSound, playSuccessSound, playCoinSound, playErrorSound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface AgroTabProps {
  stats: Stats;
  agro?: AgroState;
  onPlant: (cropId: string, investPerHa: number, hectaresCount: number) => { success: boolean; message: string };
  onArrendarTerra: (hectares: number) => { success: boolean; message: string };
  onResolveMidCropDilemma?: (choice: 'aplicar' | 'economizar') => { success: boolean; message: string };
  onHarvestCrop?: () => { success: boolean; message: string; payout?: number; isProfit?: boolean };
  onBuyMachinery?: (machinery: MachineryItem) => { success: boolean; message: string };
  onBuyLivestock?: (livestock: LivestockOption) => { success: boolean; message: string };
  onVaccinateCattle?: () => { success: boolean; message: string };
  onSellCattleLot?: (headsCount: number) => { success: boolean; message: string; payout?: number };
  onDepositCDI?: (amount: number) => void;
}

export const AgroTab: React.FC<AgroTabProps> = ({
  stats,
  agro = {
    hasLand: false,
    isArrendado: false,
    hectares: 0,
    cultivo: null,
    investimentoPerHa: 2800,
    custoTotalSafra: 0,
    cash: 0,
    debt: 0,
    nextHarvestYear: 2026,
    cattleCount: 0
  },
  onPlant,
  onArrendarTerra,
  onResolveMidCropDilemma,
  onHarvestCrop,
  onBuyMachinery,
  onBuyLivestock,
  onVaccinateCattle,
  onSellCattleLot,
  onDepositCDI
}) => {
  const [subTab, setSubTab] = useState<'safra' | 'pecuaria' | 'maquinas'>('safra');
  const [selectedInvestKey, setSelectedInvestKey] = useState<'economico' | 'padrao' | 'completo'>('padrao');
  const [selectedCropId, setSelectedCropId] = useState<string>('soja');
  const [arrendarHaChoice, setArrendarHaChoice] = useState<number>(50);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showMsg = (res: { success: boolean; message: string; payout?: number; isProfit?: boolean }) => {
    setFeedback(res.message);
    if (res.success) {
      playSuccessSound();
      if (res.payout && res.payout > 0) {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.5 } });
      }
    } else {
      playErrorSound();
    }
    setTimeout(() => setFeedback(null), 4500);
  };

  const selectedCrop = CROP_TYPES.find((c) => c.id === selectedCropId) || CROP_TYPES[0];
  const investConfig = INVESTMENT_LEVELS[selectedInvestKey];
  const totalCostEstimate = (agro.hectares || arrendarHaChoice) * investConfig.costPerHa;

  return (
    <div className="space-y-4 animate-fade-in pb-8 text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#006437] via-[#087F48] to-[#15803d] rounded-2xl p-4 sm:p-5 text-white shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner">
              🚜
            </div>
            <div>
              <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#F4B300] bg-black/20 px-2.5 py-0.5 rounded-full inline-block">
                AGRONEGÓCIO & FAZENDA BRASILEIRA
              </span>
              <h2 className="font-heading font-black text-base sm:text-lg text-white mt-0.5">
                Central Agropecuária & Produção
              </h2>
              <p className="text-xs text-[#d0f0dd]">
                Arrende terras, plante culturas de alta rentabilidade e maneje gado de corte e leite
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-[#d0f0dd] block">Área Produtiva</span>
            <span className="font-heading font-black text-sm text-white bg-black/20 px-2.5 py-1 rounded-lg inline-block">
              {agro.hasLand ? `${agro.hectares} ha ${agro.isArrendado ? '(Arrendada 🌾)' : '(Própria 🏡)'}` : 'Sem Terra ❌'}
            </span>
          </div>
        </div>

        {/* Rapid Financial Status Bar */}
        <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#d0f0dd]">Saldo em Conta:</span>
            <span className="font-heading font-black text-[#F4B300]">
              R$ {stats.grana.toLocaleString('pt-BR')}
            </span>
          </div>
          {agro.cattleCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-[#d0f0dd]">
              <span>🐂</span>
              <span>Rebanho: <strong>{agro.cattleCount} cabeças</strong></span>
              {agro.vaccinatedAftosa ? (
                <span className="text-[10px] text-[#93f7b4] bg-white/10 px-1.5 py-0.2 rounded font-bold">✓ Aftosa OK</span>
              ) : (
                <span className="text-[10px] text-amber-300 bg-amber-900/40 px-1.5 py-0.2 rounded font-bold">⚠️ Vacinar</span>
              )}
            </div>
          )}
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-[#E6F5ED] border border-[#087F48] text-[#006437] text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs animate-fade-in">
          <Sparkles className="w-4 h-4 flex-shrink-0 text-[#087F48]" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Sub-Tabs Switcher */}
      <div className="p-1 bg-[#ffffff] rounded-xl border border-[#ece9df] flex items-center justify-between gap-1 shadow-sm">
        <button
          onClick={() => { playClickSound(); setSubTab('safra'); }}
          className={`flex-1 py-2 px-2 text-[11px] font-heading font-extrabold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            subTab === 'safra' ? 'bg-[#087F48] text-white shadow-sm' : 'text-[#566359] hover:bg-[#f5f3ed]'
          }`}
        >
          <Sprout className="w-3.5 h-3.5" />
          <span>Produção Agrícola</span>
        </button>

        <button
          onClick={() => { playClickSound(); setSubTab('pecuaria'); }}
          className={`flex-1 py-2 px-2 text-[11px] font-heading font-extrabold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            subTab === 'pecuaria' ? 'bg-[#087F48] text-white shadow-sm' : 'text-[#566359] hover:bg-[#f5f3ed]'
          }`}
        >
          <span>🐂</span>
          <span>Pecuária & Gado</span>
        </button>

        <button
          onClick={() => { playClickSound(); setSubTab('maquinas'); }}
          className={`flex-1 py-2 px-2 text-[11px] font-heading font-extrabold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            subTab === 'maquinas' ? 'bg-[#087F48] text-white shadow-sm' : 'text-[#566359] hover:bg-[#f5f3ed]'
          }`}
        >
          <Tractor className="w-3.5 h-3.5" />
          <span>Maquinários & Silos</span>
        </button>
      </div>

      {/* SUBTAB 1: PRODUÇÃO AGRÍCOLA (ARRENDAMENTO, 6 CULTURAS, DILEMA DA SAFRA & COLHEITA) */}
      {subTab === 'safra' && (
        <div className="space-y-4">
          {/* If Player Has No Land Yet: Arrendamento Screen */}
          {!agro.hasLand ? (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#ece9df] text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-3xl bg-[#e6f5ed] border border-[#a2e6bd] text-[#087F48] flex items-center justify-center mx-auto text-3xl shadow-inner">
                🌾
              </div>
              <div>
                <h3 className="font-heading font-black text-base text-[#141E18]">
                  Arrendamento de Terras Agrícolas
                </h3>
                <p className="text-xs text-[#566359] max-w-sm mx-auto mt-1 leading-relaxed">
                  Para iniciar seu império no campo, arrende hectares férteis. Você poderá escolher entre <strong>seis culturas nobres</strong>, gerenciar o investimento e colher com cotação de mercado.
                </p>
              </div>

              {/* Hectares Choice Selector */}
              <div className="max-w-md mx-auto space-y-2 text-left">
                <label className="text-[10px] font-heading font-extrabold text-[#566359] uppercase block">
                  Escolha o Tamanho da Terra para Arrendar:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { ha: 25, label: '25 ha (Iniciante)', cost: 7500 },
                    { ha: 50, label: '50 ha (Médio)', cost: 14000 },
                    { ha: 100, label: '100 ha (Grande)', cost: 26000 },
                    { ha: 250, label: '250 ha (Fazendão)', cost: 60000 }
                  ].map((item) => (
                    <button
                      key={item.ha}
                      type="button"
                      onClick={() => setArrendarHaChoice(item.ha)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        arrendarHaChoice === item.ha
                          ? 'bg-[#e6f5ed] border-[#087F48] shadow-xs'
                          : 'bg-[#fbf9f3] border-[#ece9df] hover:border-[#becabe]'
                      }`}
                    >
                      <span className="font-heading font-bold text-xs text-[#141E18] block">{item.ha} ha</span>
                      <span className="text-[10px] text-[#087F48] font-bold block">R$ {item.cost.toLocaleString('pt-BR')}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  showMsg(onArrendarTerra(arrendarHaChoice));
                }}
                className="py-3 px-6 rounded-2xl bg-[#087F48] hover:bg-[#006437] text-white font-heading font-extrabold text-xs transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <span>Assinar Contrato de Arrendamento ({arrendarHaChoice} Hectares)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Active Farm & Harvest Status Card */}
              <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#ece9df] shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#f0eee8] pb-2.5">
                  <div>
                    <span className="text-[10px] font-heading font-bold text-[#566359] uppercase block">
                      Talhões em Produção
                    </span>
                    <h4 className="font-heading font-black text-sm text-[#087F48] flex items-center gap-1.5">
                      <span>{agro.cropIcon || '🌾'}</span>
                      <span>{agro.cropName || (agro.cultivo ? agro.cultivo.toUpperCase() : 'Solo Preparado (Pronto para Plantio)')}</span>
                    </h4>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-[#566359] block">Área & Sistema</span>
                    <span className="text-xs font-heading font-black text-[#141E18]">
                      {agro.hectares} ha {agro.isArrendado ? 'Arrendados' : 'Próprios'}
                    </span>
                  </div>
                </div>

                {/* If Safra is planted: Show Progress & Harvest Action */}
                {agro.cultivo ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <div className="bg-[#fbf9f3] p-2.5 rounded-xl border border-[#ece9df]">
                        <span className="text-[10px] text-[#566359] uppercase block font-heading">Investimento / ha</span>
                        <span className="font-heading font-bold text-[#141E18]">
                          R$ {agro.investimentoPerHa.toLocaleString('pt-BR')}
                        </span>
                      </div>

                      <div className="bg-[#fbf9f3] p-2.5 rounded-xl border border-[#ece9df]">
                        <span className="text-[10px] text-[#566359] uppercase block font-heading">Custo Total Safra</span>
                        <span className="font-heading font-bold text-[#D9532F]">
                          R$ {agro.custoTotalSafra.toLocaleString('pt-BR')}
                        </span>
                      </div>

                      <div className="bg-[#fbf9f3] p-2.5 rounded-xl border border-[#ece9df] col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-[#566359] uppercase block font-heading">Preço Saca no Mercado</span>
                        <span className="font-heading font-bold text-[#087F48]">
                          R$ {agro.marketPriceSacaCurrent || 140}/saca
                          {agro.marketPriceVariationPercent !== undefined && (
                            <span className={`text-[10px] ml-1 font-bold ${agro.marketPriceVariationPercent >= 0 ? 'text-[#087F48]' : 'text-[#D9532F]'}`}>
                              ({agro.marketPriceVariationPercent >= 0 ? '+' : ''}{agro.marketPriceVariationPercent}%)
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* A SAFRA TE FAZ PERGUNTAS: MID-CROP DILEMMA */}
                    {agro.meioSafraDilemma && !agro.meioSafraDilemma.choiceMade && (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#fff9e6] to-[#fef3eb] border-2 border-[#f59e0b] shadow-xs space-y-3 animate-fade-in">
                        <div className="flex items-center gap-2 text-[#b45309]">
                          <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-bounce" />
                          <div>
                            <span className="text-[10px] font-heading font-black uppercase tracking-wider bg-[#fef3c7] text-[#92400e] px-2 py-0.5 rounded-full">
                              🌾 A Safra Te Faz Perguntas
                            </span>
                            <h4 className="font-heading font-black text-sm text-[#141E18] mt-0.5">
                              {agro.meioSafraDilemma.title}
                            </h4>
                          </div>
                        </div>

                        <p className="text-xs text-[#78350f] leading-relaxed">
                          <em>"No meio da safra a lavoura pergunta: aplicar e gastar, ou economizar e torcer? A conta fecha na colheita."</em>
                        </p>

                        <div className="p-2.5 bg-white/80 rounded-xl border border-[#fde68a] text-[11px] text-[#92400e]">
                          <strong>Ameaça nos Talhões:</strong> {agro.meioSafraDilemma.threat}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              playClickSound();
                              if (onResolveMidCropDilemma) {
                                showMsg(onResolveMidCropDilemma('aplicar'));
                              }
                            }}
                            className="p-3 rounded-xl bg-[#087F48] hover:bg-[#006437] text-white font-heading font-bold text-xs text-left transition-colors cursor-pointer shadow-xs space-y-0.5"
                          >
                            <div className="flex items-center justify-between">
                              <span>🛡️ Aplicar & Gastar</span>
                              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono">
                                R$ {(agro.meioSafraDilemma.investCost || 12000).toLocaleString('pt-BR')}
                              </span>
                            </div>
                            <p className="text-[10px] text-[#d0f0dd] font-normal leading-tight">
                              Pulverizar defensivo de choque. Protege 100% da produtividade até a colheita.
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              playClickSound();
                              if (onResolveMidCropDilemma) {
                                showMsg(onResolveMidCropDilemma('economizar'));
                              }
                            }}
                            className="p-3 rounded-xl bg-[#ffffff] hover:bg-[#fff0f0] border border-[#f6c2b4] text-[#D9532F] font-heading font-bold text-xs text-left transition-colors cursor-pointer shadow-xs space-y-0.5"
                          >
                            <div className="flex items-center justify-between">
                              <span>🎲 Economizar & Torcer</span>
                              <span className="text-[10px] bg-[#fdeee9] px-1.5 py-0.2 rounded font-mono">
                                Custo R$ 0
                              </span>
                            </div>
                            <p className="text-[10px] text-[#9c2e17] font-normal leading-tight">
                              Poupa dinheiro agora, mas corre risco de quebra de 25% a 40% nas sacas.
                            </p>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Harvest Now Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound();
                          if (onHarvestCrop) {
                            showMsg(onHarvestCrop());
                          }
                        }}
                        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#087F48] to-[#006437] hover:brightness-105 text-white font-heading font-black text-sm transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                      >
                        <Wheat className="w-5 h-5 text-[#F4B300]" />
                        <span>Realizar Colheita & Vender Safra no Mercado</span>
                      </button>
                      <p className="text-[10px] text-[#566359] text-center mt-1">
                        O lucro ou prejuízo é calculado diretamente no momento da colheita conforme a oscilação da saca!
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#566359]">
                    Seus talhões estão livres e adubados. Escolha uma das <strong>seis culturas abaixo</strong> e defina o valor investido por hectare para semear!
                  </p>
                )}
              </div>

              {/* Last Harvest Financial Report if available */}
              {agro.lastHarvestResult && (
                <div className={`p-4 rounded-2xl border shadow-xs space-y-2 text-xs ${
                  agro.lastHarvestResult.netProfit >= 0
                    ? 'bg-[#E6F5ED] border-[#a2e6bd] text-[#006437]'
                    : 'bg-[#fff0f0] border-[#f6c2b4] text-[#D9532F]'
                }`}>
                  <div className="flex items-center justify-between border-b border-black/10 pb-1.5">
                    <span className="font-heading font-extrabold uppercase text-[10px]">
                      📊 Fechamento da Safra • Ano {agro.lastHarvestResult.year}
                    </span>
                    <span className="font-heading font-black text-xs">
                      {agro.lastHarvestResult.netProfit >= 0 ? 'LUCRO LÍQUIDO 🟢' : 'PREJUÍZO REGISTRADO 🔴'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] opacity-75 block">Cultura Colhida:</span>
                      <strong className="font-heading">{agro.lastHarvestResult.cropName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] opacity-75 block">Produção Total:</span>
                      <strong>{agro.lastHarvestResult.sacasTotal.toLocaleString('pt-BR')} sacas</strong>
                    </div>
                    <div>
                      <span className="text-[10px] opacity-75 block">Cotação na Venda:</span>
                      <strong>R$ {agro.lastHarvestResult.pricePerSaca}/saca ({agro.lastHarvestResult.variationPercent >= 0 ? '+' : ''}{agro.lastHarvestResult.variationPercent}%)</strong>
                    </div>
                    <div>
                      <span className="text-[10px] opacity-75 block">Resultado Final:</span>
                      <strong className="text-sm font-heading">
                        {agro.lastHarvestResult.netProfit >= 0 ? '+' : ''}R$ {agro.lastHarvestResult.netProfit.toLocaleString('pt-BR')}
                      </strong>
                    </div>
                  </div>

                  {/* Dynamic Progression Actions */}
                  {agro.lastHarvestResult.netProfit > 0 && onDepositCDI && (
                    <div className="pt-2 border-t border-black/10 flex items-center justify-between">
                      <span className="text-[10px] font-medium">
                        💰 Aproveite a liquidez do Agro para expandir seu patrimônio:
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound();
                          onDepositCDI(Math.round(agro.lastHarvestResult!.netProfit * 0.5));
                          showMsg({ success: true, message: `R$ ${(Math.round(agro.lastHarvestResult!.netProfit * 0.5)).toLocaleString('pt-BR')} guardados na Caixinha DinDin (100% CDI)!` });
                        }}
                        className="py-1 px-2.5 rounded-lg bg-[#087F48] hover:bg-[#006437] text-white font-heading font-extrabold text-[10px] cursor-pointer shadow-xs"
                      >
                        Guardar 50% no DinDin CDI
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* SEIS TIPOS DE CULTURAS RURAIS DIFERENTES */}
              {!agro.cultivo && (
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#ece9df] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-black text-xs text-[#141E18] flex items-center gap-1.5">
                        <Wheat className="w-4 h-4 text-[#087F48]" />
                        <span>Escolha Entre as 6 Culturas Agrícolas</span>
                      </h4>
                      <p className="text-[11px] text-[#566359]">
                        Selecione a commodity que deseja cultivar em seus {agro.hectares} hectares
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {CROP_TYPES.map((crop) => {
                      const isSelected = selectedCropId === crop.id;
                      return (
                        <div
                          key={crop.id}
                          onClick={() => setSelectedCropId(crop.id)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#e6f5ed] border-[#087F48] ring-2 ring-[#087F48]/20 shadow-xs'
                              : 'bg-[#fbf9f3] border-[#ece9df] hover:border-[#becabe]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-2xl">{crop.icon}</span>
                              <span className="text-[11px] font-heading font-black text-[#087F48]">
                                R$ {crop.marketPriceBase}/{crop.unitLabel.slice(0, 4)}
                              </span>
                            </div>
                            <h5 className="font-heading font-extrabold text-xs text-[#141E18]">{crop.name}</h5>
                            <p className="text-[10px] text-[#566359] mt-0.5 leading-snug">{crop.description}</p>
                            <div className="mt-2 text-[10px] text-[#141E18] font-mono flex justify-between">
                              <span>Prod. Média:</span>
                              <strong>{crop.baseYieldSacasPerHa} {crop.unitLabel}/ha</strong>
                            </div>
                          </div>

                          <div className="mt-3 pt-2 border-t border-[#ece9df] flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-[#087F48]">
                              {isSelected ? '✓ Selecionada' : 'Selecionar'}
                            </span>
                            <span className="text-[9px] text-[#566359]">Base: R$ {crop.costToPlantBasePerHa}/ha</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Gerenciar o Valor Investido por Hectare */}
                  <div className="p-4 rounded-2xl bg-[#fbf9f3] border border-[#ece9df] space-y-3">
                    <div>
                      <label className="font-heading font-extrabold text-xs text-[#141E18] block">
                        ⚙️ Gerenciar Valor Investido por Hectare
                      </label>
                      <p className="text-[11px] text-[#566359]">
                        Quanto mais você investe em adubação, defensivos e tecnologia, maior a produtividade de sacas:
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {(Object.keys(INVESTMENT_LEVELS) as Array<keyof typeof INVESTMENT_LEVELS>).map((key) => {
                        const lvl = INVESTMENT_LEVELS[key];
                        const isLvlSelected = selectedInvestKey === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setSelectedInvestKey(key)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              isLvlSelected
                                ? 'bg-[#087F48] text-white shadow-xs border-[#087F48]'
                                : 'bg-white text-[#141E18] border-[#ece9df] hover:border-[#becabe]'
                            }`}
                          >
                            <span className="font-heading font-bold text-xs block">{lvl.label}</span>
                            <span className={`text-xs font-black block my-0.5 ${isLvlSelected ? 'text-[#F4B300]' : 'text-[#087F48]'}`}>
                              R$ {lvl.costPerHa.toLocaleString('pt-BR')} / ha
                            </span>
                            <span className={`text-[10px] block leading-tight ${isLvlSelected ? 'text-white/80' : 'text-[#566359]'}`}>
                              {lvl.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Budget Summary & Plant Action */}
                    <div className="pt-2 border-t border-[#ece9df] flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#566359] block">
                          Custo Total Estimado da Safra ({agro.hectares} ha):
                        </span>
                        <span className="font-heading font-black text-base text-[#141E18]">
                          R$ {totalCostEstimate.toLocaleString('pt-BR')}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          playClickSound();
                          showMsg(onPlant(selectedCropId, investConfig.costPerHa, agro.hectares));
                        }}
                        className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-[#087F48] hover:bg-[#006437] text-white font-heading font-extrabold text-xs transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                      >
                        <Sprout className="w-4 h-4 text-[#93f7b4]" />
                        <span>Semear Talhões de {selectedCrop.name.split(' ')[0]}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: PECUÁRIA & MANEJO DE ANIMAIS */}
      {subTab === 'pecuaria' && (
        <div className="space-y-4">
          {/* Overview Banner */}
          <div className="bg-[#ffffff] p-4 rounded-2xl border border-[#ece9df] shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#f0eee8] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🐂</span>
                <div>
                  <h4 className="font-heading font-extrabold text-sm text-[#141E18]">
                    Manejo de Gado & Confinamento Rural
                  </h4>
                  <p className="text-[11px] text-[#566359]">
                    Criação de gado de corte e vacas leiteiras com receita recorrente e venda na cotação da arroba (@)
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[#566359] block">Cotação da @ (Boi Gordo)</span>
                <span className="text-xs font-heading font-black text-[#087F48]">
                  R$ {agro.arrobaMarketPrice || 285} / @
                </span>
              </div>
            </div>

            {/* Current Cattle Status */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-[#fbf9f3] p-2.5 rounded-xl border border-[#ece9df]">
                <span className="text-[10px] text-[#566359] uppercase block font-heading">Rebanho Atual</span>
                <span className="font-heading font-bold text-[#141E18]">
                  {agro.cattleCount} cabeças de gado
                </span>
              </div>

              <div className="bg-[#fbf9f3] p-2.5 rounded-xl border border-[#ece9df]">
                <span className="text-[10px] text-[#566359] uppercase block font-heading">Sanidade Animal</span>
                <span className={`font-heading font-bold ${agro.vaccinatedAftosa ? 'text-[#087F48]' : 'text-amber-600'}`}>
                  {agro.vaccinatedAftosa ? '✓ Livre de Aftosa' : '⚠️ Pendente Vacina'}
                </span>
              </div>

              <div className="bg-[#fbf9f3] p-2.5 rounded-xl border border-[#ece9df] col-span-2 sm:col-span-1">
                <span className="text-[10px] text-[#566359] uppercase block font-heading">Manejo Ativo</span>
                <span className="font-heading font-bold text-[#0B66C3] capitalize">
                  {agro.cattleSystem || 'Pasto Tropical Rotacionado'}
                </span>
              </div>
            </div>

            {/* Quick Management Actions */}
            {agro.cattleCount > 0 && (
              <div className="pt-2 border-t border-[#f0eee8] flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    if (onVaccinateCattle) showMsg(onVaccinateCattle());
                  }}
                  className="py-2 px-3 rounded-xl bg-[#e6f5ed] hover:bg-[#d0f0dd] text-[#006437] font-heading font-bold text-xs border border-[#a2e6bd] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>💉</span>
                  <span>Campanha Vacinação Febre Aftosa (R$ 800)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    if (onSellCattleLot) showMsg(onSellCattleLot(Math.min(25, agro.cattleCount)));
                  }}
                  className="py-2 px-3 rounded-xl bg-[#087F48] hover:bg-[#006437] text-white font-heading font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span>⚖️</span>
                  <span>Vender Lote na Cotação da @ (Boi Gordo)</span>
                </button>
              </div>
            )}
          </div>

          {/* Cattle Catalog */}
          <div className="space-y-3">
            <h4 className="font-heading font-black text-xs text-[#141E18]">
              Adquirir Novos Lotes de Gado para a Fazenda:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LIVESTOCK_OPTIONS.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white border border-[#ece9df] hover:border-[#087F48] transition-all space-y-2.5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-3xl">{item.icon}</span>
                      <span className="text-[10px] font-heading font-bold uppercase text-[#087F48] bg-[#e6f5ed] px-2 py-0.5 rounded-full">
                        Receita Est.: +R$ {item.yearlyRevenue.toLocaleString('pt-BR')}/ano
                      </span>
                    </div>
                    <h5 className="font-heading font-extrabold text-sm text-[#141E18]">{item.name}</h5>
                    <p className="text-xs text-[#566359] leading-snug">{item.description}</p>
                    <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-[#f0eee8]">
                      <span className="text-[#566359]">Lote: <strong>{item.headsCount} animais</strong></span>
                      <span className="font-mono font-bold text-[#141E18]">
                        R$ {item.buyCost.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      if (onBuyLivestock) showMsg(onBuyLivestock(item));
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#087F48] hover:bg-[#006437] text-white font-heading font-bold text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1"
                  >
                    <span>Comprar Lote de {item.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: MAQUINÁRIOS E SILOS */}
      {subTab === 'maquinas' && (
        <div className="space-y-3">
          <div className="bg-[#fbf9f3] p-3 rounded-xl border border-[#ece9df]">
            <h4 className="font-heading font-black text-xs text-[#141E18] flex items-center gap-1.5">
              <Tractor className="w-4 h-4 text-[#087F48]" />
              <span>Frota de Maquinários Pesados & Silos</span>
            </h4>
            <p className="text-[11px] text-[#566359] mt-0.5">
              Modernize seus talhões com tratores de alta potência e silos secadores para estocar grãos no pico da alta da saca.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MACHINERY_CATALOG.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white border border-[#ece9df] hover:border-[#087F48] transition-all space-y-2.5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-3xl">{item.icon}</span>
                    <span className="text-[10px] font-heading font-bold uppercase text-[#0B66C3] bg-[#edf5fd] px-2 py-0.5 rounded-full">
                      +{item.yieldBonusPercent}% Produtividade
                    </span>
                  </div>
                  <h5 className="font-heading font-extrabold text-sm text-[#141E18]">{item.name}</h5>
                  <p className="text-xs text-[#566359] leading-snug">{item.description}</p>
                  <p className="text-xs font-mono font-bold text-[#141E18] mt-1">
                    Valor: R$ {item.price.toLocaleString('pt-BR')} • Manut.: R$ {item.maintenanceAnnual.toLocaleString('pt-BR')}/ano
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    if (onBuyMachinery) showMsg(onBuyMachinery(item));
                  }}
                  className="w-full py-2 rounded-xl bg-[#141E18] hover:bg-[#28382d] text-white font-heading font-bold text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1"
                >
                  <span>Adquirir Maquinário</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
