import React, { useState } from 'react';
import { CompanyState, CompanyEmployee } from '../types/game';
import { Building2, Users, TrendingUp, DollarSign, Award, Plus, Trash2, ArrowUpRight, Store, Globe, PieChart, Sparkles, AlertTriangle, ShieldCheck, CheckCircle2, Package, Megaphone, ShoppingBag, Rocket, Download, CheckCircle, Lightbulb, PlusCircle, Verified } from 'lucide-react';
import { playClickSound, playSuccessSound, playCoinSound, playErrorSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface BusinessModuleProps {
  company?: CompanyState;
  userCash: number;
  characterName?: string;
  characterAge?: number;
  serasaScore?: number;
  stats?: { saude: number; felicidade: number; intelecto: number; energia: number };
  onCreateCompany: (companyData: { name: string; sector: CompanyState['sector']; legalType: CompanyState['legalType'] }) => { success: boolean; message: string };
  onHireEmployee: (candidate: { name: string; role: string; salaryMonthly: number; skillLevel: number }) => { success: boolean; message: string };
  onPromoteEmployee: (empId: string) => { success: boolean; message: string };
  onFireEmployee: (empId: string) => { success: boolean; message: string };
  onExpandBranch: () => { success: boolean; message: string };
  onFranchiseCompany: () => { success: boolean; message: string };
  onLaunchIPO: () => { success: boolean; message: string };
  onSellCompany: () => { success: boolean; message: string; payout?: number };
}

const CANDIDATES_POOL = [
  { name: 'Gabriel Santos', role: 'Gerente de Vendas', salaryMonthly: 3800, skillLevel: 82 },
  { name: 'Fernanda Lima', role: 'Desenvolvedora Full-Stack', salaryMonthly: 5500, skillLevel: 90 },
  { name: 'Rodrigo Souza', role: 'Atendente Operacional', salaryMonthly: 1800, skillLevel: 65 },
  { name: 'Beatriz Costa', role: 'Especialista em Marketing', salaryMonthly: 4200, skillLevel: 85 },
  { name: 'Marcelo Oliveira', role: 'Técnico de Suporte', salaryMonthly: 2400, skillLevel: 72 }
];

export const BusinessModule: React.FC<BusinessModuleProps> = ({
  company,
  userCash,
  characterName = 'Lucas Silva',
  characterAge = 29,
  serasaScore = 1000,
  stats = { saude: 93, felicidade: 100, intelecto: 100, energia: 80 },
  onCreateCompany,
  onHireEmployee,
  onPromoteEmployee,
  onFireEmployee,
  onExpandBranch,
  onFranchiseCompany,
  onLaunchIPO,
  onSellCompany
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'geral' | 'equipe' | 'expansao'>('geral');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [companyNameInput, setCompanyNameInput] = useState('');
  const [companySector, setCompanySector] = useState<CompanyState['sector']>('Tecnologia');
  const [companyLegalType, setCompanyLegalType] = useState<CompanyState['legalType']>('MEI');
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [dilemmaResolved, setDilemmaResolved] = useState<string | null>(null);

  const showFeedback = (text: string, isError: boolean = false) => {
    setMsg({ text, isError });
    setTimeout(() => setMsg(null), 4000);
  };

  if (!company) {
    return (
      <div className="bg-[#ffffff] rounded-3xl p-6 border border-[#e4e1d7] shadow-[0_4px_0_0_#dde4de] text-center space-y-4 text-left">
        <div className="w-16 h-16 rounded-2xl bg-[#ecfdf5] border-2 border-[#a7f3d0] text-[#087F48] flex items-center justify-center mx-auto text-3xl shadow-sm">
          🏬
        </div>

        <div className="text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#087F48] bg-[#ecfdf5] px-3 py-1 rounded-full font-heading inline-block mb-1 border border-[#a7f3d0]">
            EMPREENDEDORISMO & CNPJ BRASIL
          </span>
          <h3 className="font-heading font-black text-lg text-slate-900">
            Fundar Sua Própria Empresa
          </h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed mt-1">
            Abra seu MEI, LTDA ou S/A, contrate colaboradores CLT, invista em estoque e marketing, abra filiais e lance IPO na B3!
          </p>
        </div>

        <button
          onClick={() => {
            playClickSound();
            setShowCreateModal(true);
          }}
          className="w-full py-3.5 px-4 rounded-xl bg-[#0ca768] text-white font-heading font-black text-xs hover:bg-[#087F48] shadow-[0_4px_0_0_#00321c] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Empresa & Registrar CNPJ</span>
        </button>

        {/* Modal Fundar Empresa */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in text-left">
            <div className="bg-[#ffffff] rounded-3xl border border-[#e4e1d7] shadow-[0px_20px_50px_rgba(20,30,24,0.2)] max-w-md w-full p-5 space-y-4">
              <h3 className="font-heading font-black text-base text-[#141E18]">
                Registro de Nova Empresa
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-[#566359] block mb-1">Nome da Empresa</label>
                  <input
                    type="text"
                    placeholder="Ex: Adega & Empório Silva LTDA"
                    value={companyNameInput}
                    onChange={(e) => setCompanyNameInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#fbf9f3] border border-[#ece9df] font-heading font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-[#566359] block mb-1">Setor de Atuação</label>
                  <select
                    value={companySector}
                    onChange={(e: any) => setCompanySector(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#fbf9f3] border border-[#ece9df] font-heading font-bold text-xs"
                  >
                    <option value="Tecnologia">Tecnologia & Software</option>
                    <option value="Alimentação">Alimentação & Vinhos</option>
                    <option value="Varejo">Varejo & E-commerce</option>
                    <option value="Serviços">Serviços Profissionais</option>
                    <option value="Moda">Moda & Vestuário</option>
                    <option value="Indústria">Indústria & Manufatura</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-[#566359] block mb-1">Tipo Jurídico & Capital Inicial Exigido</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCompanyLegalType('MEI')}
                      className={`p-2 rounded-xl border text-center transition-all ${companyLegalType === 'MEI' ? 'bg-[#e6f5ed] border-[#087F48] font-bold' : 'bg-[#fbf9f3] border-[#ece9df]'}`}
                    >
                      <span className="text-xs block font-heading font-black">MEI</span>
                      <span className="text-[9px] text-[#087F48] font-bold">R$ 500</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCompanyLegalType('LTDA')}
                      className={`p-2 rounded-xl border text-center transition-all ${companyLegalType === 'LTDA' ? 'bg-[#e6f5ed] border-[#087F48] font-bold' : 'bg-[#fbf9f3] border-[#ece9df]'}`}
                    >
                      <span className="text-xs block font-heading font-black">LTDA</span>
                      <span className="text-[9px] text-[#087F48] font-bold">R$ 5.000</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCompanyLegalType('S/A')}
                      className={`p-2 rounded-xl border text-center transition-all ${companyLegalType === 'S/A' ? 'bg-[#e6f5ed] border-[#087F48] font-bold' : 'bg-[#fbf9f3] border-[#ece9df]'}`}
                    >
                      <span className="text-xs block font-heading font-black">S/A</span>
                      <span className="text-[9px] text-[#087F48] font-bold">R$ 50.000</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    if (!companyNameInput.trim()) {
                      showFeedback('Digite o nome da empresa!', true);
                      return;
                    }
                    const res = onCreateCompany({
                      name: companyNameInput,
                      sector: companySector,
                      legalType: companyLegalType
                    });
                    if (res.success) {
                      setShowCreateModal(false);
                      showFeedback(res.message);
                    } else {
                      showFeedback(res.message, true);
                    }
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#0ca768] text-white font-heading font-black text-xs hover:bg-[#087F48] transition-colors cursor-pointer shadow-[0_3px_0_0_#00321c]"
                >
                  Registrar CNPJ
                </button>

                <button
                  onClick={() => setShowCreateModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-[#f5f3ed] text-[#566359] font-heading font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const totalPayroll = company.employees.reduce((acc, emp) => acc + emp.salaryMonthly, 0);
  const netProfit = Math.max(0, company.monthlyRevenue - totalPayroll);

  return (
    <div className="flex flex-col gap-4 animate-fade-in text-left font-sans text-slate-900">
      
      {/* 1. TOY PROFILE HUD */}
      <div className="w-full bg-[#ffffff] rounded-2xl p-3.5 shadow-[0_4px_0_0_#dde4de] border border-[#e8f0e9] flex flex-col gap-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Minifig Head Container */}
            <div className="relative w-12 h-12 rounded-xl bg-[#ffddb8] flex items-center justify-center shadow-[0_3px_0_0_#cc8200] shrink-0 border border-[#cc8200]/30">
              <div className="absolute -top-1.5 w-4 h-2 rounded-t-sm bg-[#cc8200] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"></div>
              <div className="relative flex flex-col items-center">
                <div className="flex gap-2">
                  <div className="w-1.5 h-2 rounded-full bg-[#402500]"></div>
                  <div className="w-1.5 h-2 rounded-full bg-[#402500]"></div>
                </div>
                <div className="flex gap-3 -mt-1">
                  <div className="w-1.5 h-1 rounded-full bg-rose-500/40"></div>
                  <div className="w-1.5 h-1 rounded-full bg-rose-500/40"></div>
                </div>
                <div className="w-3 h-1 border-b-2 border-[#402500] rounded-full mt-0.5"></div>
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-slate-900 truncate">{characterName}</span>
                <span className="font-bold text-[10px] px-1.5 py-0.5 bg-[#e8f0e9] rounded text-slate-600">{characterAge} anos</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006d41]" />
                <span className="text-[11px] font-extrabold text-[#006d41]">Score Serasa: {serasaScore}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#eef5ef] px-3 py-1.5 rounded-xl shadow-[0_2px_0_0_#bccabe] flex flex-col items-end border border-[#bccabe]">
            <span className="text-[9px] text-slate-500 font-bold uppercase">Saldo Pessoal</span>
            <span className="font-black text-xs text-[#006d41]">R$ {userCash.toLocaleString('pt-BR')}</span>
          </div>
        </div>

        {/* 4 Gauge Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#eef5ef] p-2 rounded-xl shadow-[0_2px_0_0_#dde4de] flex flex-col gap-1 border border-[#dde4de]">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-700 flex items-center gap-1">💚 Saúde</span>
              <span className="text-[#006d41] font-black">{stats.saude}%</span>
            </div>
            <div className="h-2 w-full bg-[#e8f0e9] rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-[#006d41] rounded-full" style={{ width: `${stats.saude}%` }}></div>
            </div>
          </div>

          <div className="bg-[#eef5ef] p-2 rounded-xl shadow-[0_2px_0_0_#dde4de] flex flex-col gap-1 border border-[#dde4de]">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-700 flex items-center gap-1">☀️ Felicidade</span>
              <span className="text-[#cc8200] font-black">{stats.felicidade}%</span>
            </div>
            <div className="h-2 w-full bg-[#e8f0e9] rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-[#cc8200] rounded-full" style={{ width: `${stats.felicidade}%` }}></div>
            </div>
          </div>

          <div className="bg-[#eef5ef] p-2 rounded-xl shadow-[0_2px_0_0_#dde4de] flex flex-col gap-1 border border-[#dde4de]">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-700 flex items-center gap-1">💡 Intelecto</span>
              <span className="text-[#0051d5] font-black">{stats.intelecto}%</span>
            </div>
            <div className="h-2 w-full bg-[#e8f0e9] rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-[#0051d5] rounded-full" style={{ width: `${stats.intelecto}%` }}></div>
            </div>
          </div>

          <div className="bg-[#eef5ef] p-2 rounded-xl shadow-[0_2px_0_0_#dde4de] flex flex-col gap-1 border border-[#dde4de]">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-700 flex items-center gap-1">⚡ Energia</span>
              <span className="text-[#316bf3] font-black">{stats.energia}%</span>
            </div>
            <div className="h-2 w-full bg-[#e8f0e9] rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-[#316bf3] rounded-full" style={{ width: `${stats.energia}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {msg && (
        <div className={`p-3 rounded-xl text-xs font-bold animate-fade-in ${msg.isError ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
          {msg.text}
        </div>
      )}

      {/* 2. COMPANY DIORAMA BANNER */}
      <div className="w-full bg-[#ffffff] rounded-2xl shadow-[0_4px_0_0_#dde4de] border border-[#e8f0e9] overflow-hidden flex flex-col">
        <div className="relative w-full h-36">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCitH-rrS0AhZ3Hxbsb8M_adKsqZ6euUvts2j2pCeUFDTrMSX3byNyabvvT_R3HKGvEzwilH8d9bw6RhfkVi7HIgdadNo-JHg_P1pPyDGFwxyo1shtq1PqKBA4JTz89pgwFmVt3L4VVEdbR-r4D09nSc8sROTwmVBZ7ylThjYg8FwWxBJbNE2YoPQ5elgXGlfKDxYF9Yc6a3dgQh21yj_bt1vTnAZDfs0F3VeoiXsB8"
            alt="Empresa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent"></div>
          
          <div className="absolute top-2.5 right-2.5 bg-[#006d41] text-white font-extrabold text-[10px] px-3 py-1 rounded-full shadow-[0_2px_0_0_#00321c] flex items-center gap-1 uppercase">
            <TrendingUp className="w-3.5 h-3.5" /> Nível {company.branchesCount} • Em Expansão
          </div>

          <div className="absolute bottom-2.5 left-3 right-3 text-white">
            <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block">
              {company.legalType} • {company.sector}
            </span>
            <h2 className="text-base font-black text-white truncate">{company.name}</h2>
          </div>
        </div>

        {/* Company KPI Bricks */}
        <div className="p-3.5 bg-[#eef5ef] flex flex-col gap-2 border-t border-[#dde4de]">
          <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Store className="w-4 h-4 text-[#006d41]" />
            <span>Comércio de Bebidas e Vinhos Artesanais Paulistanos</span>
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-white p-2.5 rounded-xl shadow-[0_2px_0_0_#dde4de] border border-[#dde4de]">
              <span className="text-[10px] text-slate-500 font-bold block">Faturamento Bruto</span>
              <div className="text-sm font-black text-slate-900">R$ {company.monthlyRevenue.toLocaleString('pt-BR')} <span className="text-[10px] text-slate-500 font-normal">/mês</span></div>
            </div>

            <div className="bg-white p-2.5 rounded-xl shadow-[0_2px_0_0_#dde4de] border border-[#dde4de]">
              <span className="text-[10px] text-[#006d41] font-bold block">Lucro Líquido Real</span>
              <div className="text-sm font-black text-[#006d41]">+R$ {netProfit.toLocaleString('pt-BR')} <span className="text-[10px] text-slate-500 font-normal">/mês</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. STRATEGIC ACTIONS LIST */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#006d41]" />
            <span>Decisões & Gestão Tática</span>
          </h3>
          <span className="text-[11px] font-bold text-slate-500">Valuation: R$ {company.valuation.toLocaleString('pt-BR')}</span>
        </div>

        {/* Action Tile 1: Estoque */}
        <div className="bg-white p-3.5 rounded-2xl shadow-[0_4px_0_0_#dde4de] border border-[#e8f0e9] flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#e8f0e9] text-[#006d41] flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                📦
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Estoque de Rótulos Finos</h4>
                <p className="text-[11px] text-slate-500">Comprar barris de carvalho & vinhos da Serra Gaúcha</p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 bg-[#7bfbb3] text-[#002110] font-black rounded-full shrink-0">+25% Vendas</span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <span className="text-xs font-black text-slate-800">Custo: R$ 4.500</span>
            <button
              onClick={() => {
                playClickSound();
                showFeedback('Estoque abastecido com sucesso! Vendas turbinadas.');
              }}
              className="py-1.5 px-3 bg-[#0ca768] text-white rounded-xl font-bold text-xs shadow-[0_3px_0_0_#00321c] active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Comprar Lote</span>
            </button>
          </div>
        </div>

        {/* Action Tile 2: Quadro de Funcionários */}
        <div className="bg-white p-3.5 rounded-2xl shadow-[0_4px_0_0_#dde4de] border border-[#e8f0e9] flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#dbe1ff] text-[#0051d5] flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                👥
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900">Quadro de Funcionários</h4>
                  <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-700 font-bold rounded">{company.employees.length} CLT</span>
                </div>
                <p className="text-[11px] text-slate-500">Contratar Sommelier e equipe de vendas</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <span className="text-xs font-black text-slate-800">Folha: R$ {totalPayroll.toLocaleString('pt-BR')}/mês</span>
            <button
              onClick={() => {
                playClickSound();
                setActiveSubTab('equipe');
              }}
              className="py-1.5 px-3 bg-[#0051d5] text-white rounded-xl font-bold text-xs shadow-[0_3px_0_0_#00174b] active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Gerenciar Equipe</span>
            </button>
          </div>
        </div>

        {/* Action Tile 3: Tráfego Pago */}
        <div className="bg-white p-3.5 rounded-2xl shadow-[0_4px_0_0_#dde4de] border border-[#e8f0e9] flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#ffddb8] text-[#855300] flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                🚀
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Tráfego Pago & WhatsApp</h4>
                <p className="text-[11px] text-slate-500">Anúncio geolocalizado nos bairros Pinheiros e Vila Madalena</p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 bg-[#7bfbb3] text-[#002110] font-black rounded-full shrink-0">+15% Clientes</span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <span className="text-xs font-black text-slate-800">Investimento: R$ 600</span>
            <button
              onClick={() => {
                playClickSound();
                showFeedback('Campanha de tráfego iniciada no Instagram e WhatsApp!');
              }}
              className="py-1.5 px-3 bg-[#cc8200] text-white rounded-xl font-bold text-xs shadow-[0_3px_0_0_#402500] active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Impulsionar</span>
            </button>
          </div>
        </div>

        {/* Action Tile 4: Crédito PRONAMPE */}
        <div className="bg-white p-3.5 rounded-2xl shadow-[0_4px_0_0_#dde4de] border border-[#e8f0e9] flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#0051d5] flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                🏛️
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h4 className="text-xs font-bold text-slate-900">Crédito PRONAMPE / BNDES</h4>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#7bfbb3] text-[#002110] font-black">Pré-Aprovado</span>
                </div>
                <p className="text-[11px] text-slate-500">Linha subsidiada de R$ 50.000 a taxa de 1,2% a.m.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <span className="text-xs font-black text-slate-800">Limite: R$ 50.000</span>
            <button
              onClick={() => {
                playClickSound();
                showFeedback('Crédito de R$ 50.000 transferido para a conta PJ!');
              }}
              className="py-1.5 px-3 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-xl font-bold text-xs shadow-[0_2px_0_0_#bccabe] active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Tomar Crédito</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. BUSINESS DILEMMA CARD */}
      <div className="w-full bg-[#eef5ef] rounded-2xl p-4 shadow-[0_4px_0_0_#bccabe] border-l-4 border-l-[#316bf3] flex flex-col gap-2 border border-[#bccabe]">
        <div className="flex items-center gap-1.5">
          <Lightbulb className="w-5 h-5 text-[#0051d5]" />
          <h3 className="font-black text-xs text-slate-900 uppercase tracking-wide">Dilema Empresarial da Rodada</h3>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          Um renomado bistrô contemporâneo dos Jardins ofereceu parceria de exclusividade total para a safra do seu Empório. Qual estratégia você adotará?
        </p>

        <div className="grid grid-cols-1 gap-2 pt-1">
          <button
            onClick={() => {
              playClickSound();
              setDilemmaResolved('exclusividade');
              showFeedback('Contrato de Exclusividade firmado! +R$ 15.000 injetados no caixa.');
            }}
            disabled={!!dilemmaResolved}
            className={`p-3 rounded-xl border text-left active:translate-y-0.5 transition-all cursor-pointer flex flex-col ${dilemmaResolved === 'exclusividade' ? 'bg-[#7bfbb3] border-[#006d41] text-[#002110]' : 'bg-white border-[#dde4de] shadow-[0_3px_0_0_#dde4de]'}`}
          >
            <span className="font-bold text-xs text-slate-900">✍️ Assinar Exclusividade</span>
            <span className="text-[10px] text-[#006d41] font-bold mt-0.5">+ R$ 15.000 adiantados • Vendas do balcão limitadas</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setDilemmaResolved('varejo');
              showFeedback('Varejo mantido com sucesso! Margens de lucro preservadas.');
            }}
            disabled={!!dilemmaResolved}
            className={`p-3 rounded-xl border text-left active:translate-y-0.5 transition-all cursor-pointer flex flex-col ${dilemmaResolved === 'varejo' ? 'bg-[#7bfbb3] border-[#006d41] text-[#002110]' : 'bg-white border-[#dde4de] shadow-[0_3px_0_0_#dde4de]'}`}
          >
            <span className="font-bold text-xs text-slate-900">🍷 Continuar Varejo Aberto</span>
            <span className="text-[10px] text-[#0051d5] font-bold mt-0.5">Margem de lucro livre • Fortalece a marca local do empório</span>
          </button>
        </div>
      </div>

      {/* 5. EXPANSION GOAL BLOCK */}
      <div className="w-full bg-[#ffffff] rounded-2xl p-4 shadow-[0_4px_0_0_#dde4de] border border-[#e8f0e9] flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#006d41]" />
            <div>
              <h4 className="font-black text-xs text-slate-900">Nova Filial: Bairro Pinheiros</h4>
              <span className="text-[10px] text-slate-500">Próximo passo na jornada de expansão</span>
            </div>
          </div>
          <span className="font-black text-xs text-[#006d41]">54%</span>
        </div>

        <div className="h-3 w-full bg-[#e8f0e9] rounded-full overflow-hidden p-0.5 shadow-inner">
          <div className="h-full bg-[#0ca768] rounded-full" style={{ width: '54%' }}></div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-600 font-bold">
          <span>Investimento: R$ 43.200 acumulados</span>
          <span className="text-slate-900">Meta: R$ 80.000</span>
        </div>

        <button
          onClick={() => {
            playClickSound();
            const res = onExpandBranch();
            showFeedback(res.message, !res.success);
          }}
          className="w-full py-3 bg-[#006d41] text-white rounded-xl font-black text-xs shadow-[0_4px_0_0_#00321c] active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Investir na Nova Filial (R$ 10.000)</span>
        </button>
      </div>

      {/* Sub-Tabs: Equipe & Expansão Modals */}
      {activeSubTab === 'equipe' && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-black text-xs text-slate-900">Equipe de Funcionários ({company.employees.length})</h4>
            <button onClick={() => setActiveSubTab('geral')} className="text-xs text-slate-500 hover:text-slate-800 font-bold">✕ Voltar</button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {company.employees.map((emp) => (
              <div key={emp.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <h5 className="font-bold text-slate-900">{emp.name}</h5>
                  <p className="text-[10px] text-slate-500">{emp.role} • R$ {emp.salaryMonthly.toLocaleString('pt-BR')}/mês</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => showFeedback(onPromoteEmployee(emp.id).message)} className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Promover</button>
                  <button onClick={() => showFeedback(onFireEmployee(emp.id).message)} className="px-2 py-1 bg-rose-100 text-rose-800 rounded font-bold text-[10px]">Demitir</button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs font-extrabold text-slate-700 block mb-1.5">Candidatos Disponíveis:</span>
            <div className="space-y-1.5">
              {CANDIDATES_POOL.map((cand, i) => (
                <div key={i} className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{cand.name}</span>
                    <span className="text-[10px] text-slate-500">{cand.role} • R$ {cand.salaryMonthly.toLocaleString('pt-BR')}</span>
                  </div>
                  <button onClick={() => showFeedback(onHireEmployee(cand).message)} className="px-2.5 py-1 bg-[#0ca768] text-white rounded font-bold text-[10px]">Contratar</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

