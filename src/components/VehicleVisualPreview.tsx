import React from 'react';

interface VehicleVisualPreviewProps {
  vehicleId: string;
  name?: string;
  category?: string;
  color?: string;
  wheelType?: 'original' | 'aro20';
  hasInsulfilm?: boolean;
}

export const VehicleVisualPreview: React.FC<VehicleVisualPreviewProps> = ({
  vehicleId,
  name = '',
  category = 'populares',
  color = '#0077b6',
  wheelType = 'original',
  hasInsulfilm = true
}) => {
  const normalizedId = vehicleId.toLowerCase();
  const windowColor = hasInsulfilm ? '#1c242b' : '#a8c5d9';
  const windowOpacity = hasInsulfilm ? '0.92' : '0.65';
  const rimColor = wheelType === 'aro20' ? '#e2e8f0' : '#94a3b8';
  const rimDetails = wheelType === 'aro20' ? '#38bdf8' : '#64748b';

  // 1. VW FUSCA CLÁSSICO
  if (normalizedId.includes('fusca') || normalizedId === 'vw_fusca') {
    return (
      <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-md select-none">
        <defs>
          <radialGradient id="fuscaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.2" />
          </radialGradient>
          <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>

        {/* Chão e Sombra */}
        <ellipse cx="200" cy="172" rx="160" ry="12" fill="#000000" opacity="0.18" />

        {/* Para-lamas Traseiro Curvo */}
        <path d="M 60 148 C 60 115 88 108 120 128 L 115 155 L 60 155 Z" fill={color} filter="brightness(0.85)" />

        {/* Para-lamas Dianteiro Curvo */}
        <path d="M 270 130 C 295 110 338 116 348 148 L 340 155 L 270 155 Z" fill={color} filter="brightness(0.9)" />

        {/* Carroceria Curvada Icônica do Fusca (Beetle Dome) */}
        <path
          d="M 68 150 
             C 65 130, 80 110, 110 102 
             C 140 70, 190 52, 245 68 
             C 275 78, 305 105, 335 125 
             C 350 132, 355 142, 352 152 
             L 68 152 Z"
          fill={color}
          stroke="#000000"
          strokeWidth="1.5"
          strokeOpacity="0.15"
        />

        {/* Linha de reflexo / brilho na cúpula */}
        <path
          d="M 125 98 C 150 68 190 58 240 72"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Janela Traseira Bipartida / Oval */}
        <path
          d="M 118 104 C 135 80 170 75 178 75 L 178 110 L 125 112 Z"
          fill={windowColor}
          opacity={windowOpacity}
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />

        {/* Janela Dianteira Curva com Quebra-vento */}
        <path
          d="M 188 75 C 225 75 250 86 265 108 L 188 110 Z"
          fill={windowColor}
          opacity={windowOpacity}
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />
        {/* Quebra-Vento Cromado */}
        <line x1="245" y1="92" x2="245" y2="110" stroke="url(#chromeGrad)" strokeWidth="1.5" />

        {/* Estribo Lateral Preto com Friso Cromado */}
        <rect x="115" y="150" width="160" height="5" rx="1.5" fill="#1e293b" />
        <rect x="115" y="150" width="160" height="1.5" fill="url(#chromeGrad)" />

        {/* Maçaneta Cromada Fusca */}
        <rect x="175" y="118" width="14" height="3" rx="1.5" fill="url(#chromeGrad)" stroke="#475569" strokeWidth="0.5" />

        {/* Farol Dianteiro Redondo Cromado com Lente Vidro */}
        <circle cx="340" cy="132" r="10" fill="url(#chromeGrad)" stroke="#64748b" strokeWidth="1" />
        <circle cx="340" cy="132" r="7.5" fill="#fef08a" opacity="0.9" />
        <path d="M 338 128 L 342 136 M 336 132 L 344 132" stroke="#ca8a04" strokeWidth="0.75" />

        {/* Lanterna Traseira Fafá / Gota */}
        <path d="M 64 138 C 64 134 68 134 70 138 L 70 146 L 64 146 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="0.5" />

        {/* Para-choque Dianteiro Curvo Cromado com Batentes */}
        <path d="M 330 153 C 352 153 362 148 365 142" fill="none" stroke="url(#chromeGrad)" strokeWidth="4.5" strokeLinecap="round" />
        <rect x="345" y="138" width="4" height="18" rx="1" fill="url(#chromeGrad)" />

        {/* Para-choque Traseiro Cromado */}
        <path d="M 75 153 C 58 153 50 148 48 142" fill="none" stroke="url(#chromeGrad)" strokeWidth="4.5" strokeLinecap="round" />
        <rect x="58" y="138" width="4" height="18" rx="1" fill="url(#chromeGrad)" />

        {/* Roda Traseira */}
        <g transform="translate(105, 150)">
          <circle cx="0" cy="0" r="22" fill="#1e293b" />
          <circle cx="0" cy="0" r="16" fill="#334155" />
          <circle cx="0" cy="0" r="12" fill="url(#chromeGrad)" stroke="#64748b" strokeWidth="1" />
          <circle cx="0" cy="0" r="5" fill="#475569" />
          <circle cx="0" cy="0" r="2" fill="#f1f5f9" />
        </g>

        {/* Roda Dianteira */}
        <g transform="translate(295, 150)">
          <circle cx="0" cy="0" r="22" fill="#1e293b" />
          <circle cx="0" cy="0" r="16" fill="#334155" />
          <circle cx="0" cy="0" r="12" fill="url(#chromeGrad)" stroke="#64748b" strokeWidth="1" />
          <circle cx="0" cy="0" r="5" fill="#475569" />
          <circle cx="0" cy="0" r="2" fill="#f1f5f9" />
        </g>

        {/* Logo / Badge Clássico */}
        <text x="200" y="192" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="900" letterSpacing="2">
          VOLKSWAGEN FUSCA 1300L
        </text>
      </svg>
    );
  }

  // 2. FIAT SIENA SEDAN
  if (normalizedId.includes('siena') || normalizedId === 'fiat_siena') {
    return (
      <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-md select-none">
        <defs>
          <linearGradient id="sienaShine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Sombra */}
        <ellipse cx="200" cy="172" rx="165" ry="11" fill="#000000" opacity="0.18" />

        {/* Carroceria Notchback / 3 Volumes do Siena (Porta-malas destacado) */}
        <path
          d="M 52 148 
             L 50 128 
             C 50 122, 58 118, 70 118 
             L 105 118 
             L 145 80 
             L 245 80 
             L 290 118 
             L 345 124 
             C 356 126, 360 134, 358 148 
             L 52 148 Z"
          fill={color}
          stroke="#000000"
          strokeWidth="1.5"
          strokeOpacity="0.15"
        />
        {/* Camada de Gradiente */}
        <path
          d="M 52 148 L 50 128 C 50 122, 58 118, 70 118 L 105 118 L 145 80 L 245 80 L 290 118 L 345 124 C 356 126, 360 134, 358 148 Z"
          fill="url(#sienaShine)"
        />

        {/* Porta-malas Alto e Espaçoso do Siena */}
        <path d="M 68 118 L 105 118 L 105 148" fill="none" stroke="#000000" strokeWidth="1" opacity="0.3" />

        {/* Janelas Sedan (4 Portas com Coluna B Central) */}
        {/* Janela Traseira com vigia */}
        <path
          d="M 115 114 L 145 85 L 188 85 L 188 114 Z"
          fill={windowColor}
          opacity={windowOpacity}
          stroke="#475569"
          strokeWidth="1.2"
        />
        {/* Janela Dianteira */}
        <path
          d="M 194 85 L 240 85 L 278 114 L 194 114 Z"
          fill={windowColor}
          opacity={windowOpacity}
          stroke="#475569"
          strokeWidth="1.2"
        />

        {/* Friso Lateral de Proteção das Portas */}
        <rect x="95" y="132" width="215" height="4" rx="2" fill="#1e293b" opacity="0.75" />

        {/* Maçanetas das Portas */}
        <rect x="155" y="122" width="12" height="3" rx="1.5" fill="#334155" />
        <rect x="220" y="122" width="12" height="3" rx="1.5" fill="#334155" />

        {/* Grade Dianteira Horizontal Fiat com Emblema Vermelho */}
        <path d="M 345 130 L 358 132 L 356 142 L 342 140 Z" fill="#1e293b" />
        <circle cx="352" cy="136" r="3.5" fill="#dc2626" stroke="#ffffff" strokeWidth="0.75" />

        {/* Farol Dianteiro Polifocal Siena */}
        <path d="M 325 122 L 354 125 L 346 134 L 322 130 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="340" cy="128" r="3" fill="#38bdf8" opacity="0.8" />

        {/* Lanterna Traseira Bipartida Siena */}
        <path d="M 52 124 L 68 122 L 68 138 L 52 138 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="0.75" />
        <rect x="58" y="130" width="8" height="4" fill="#ffffff" opacity="0.8" />

        {/* Roda Traseira */}
        <g transform="translate(98, 150)">
          <circle cx="0" cy="0" r="22" fill="#1e293b" />
          <circle cx="0" cy="0" r="15" fill={rimColor} />
          {/* Aros / Raios da Roda */}
          <circle cx="0" cy="0" r="5" fill="#475569" />
          <line x1="-12" y1="0" x2="12" y2="0" stroke={rimDetails} strokeWidth="2.5" />
          <line x1="0" y1="-12" x2="0" y2="12" stroke={rimDetails} strokeWidth="2.5" />
        </g>

        {/* Roda Dianteira */}
        <g transform="translate(305, 150)">
          <circle cx="0" cy="0" r="22" fill="#1e293b" />
          <circle cx="0" cy="0" r="15" fill={rimColor} />
          <circle cx="0" cy="0" r="5" fill="#475569" />
          <line x1="-12" y1="0" x2="12" y2="0" stroke={rimDetails} strokeWidth="2.5" />
          <line x1="0" y1="-12" x2="0" y2="12" stroke={rimDetails} strokeWidth="2.5" />
        </g>

        <text x="200" y="192" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="900" letterSpacing="2">
          FIAT SIENA 1.4 FIRE SEDAN
        </text>
      </svg>
    );
  }

  // 3. SUZUKI GSX MOTO ESPORTIVA
  if (normalizedId.includes('suzuki') || normalizedId === 'suzuki_gsx') {
    return (
      <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-md select-none">
        {/* Sombra */}
        <ellipse cx="200" cy="172" rx="140" ry="10" fill="#000000" opacity="0.2" />

        {/* Quadro Dupla Trave de Alumínio Prata */}
        <path d="M 140 135 L 205 110 L 260 120 L 210 145 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />

        {/* Bloco do Motor 750cc 4 Cilindros */}
        <rect x="180" y="125" width="45" height="30" rx="4" fill="#334155" stroke="#1e293b" strokeWidth="1" />
        <line x1="185" y1="132" x2="220" y2="132" stroke="#64748b" strokeWidth="1.5" />
        <line x1="185" y1="140" x2="220" y2="140" stroke="#64748b" strokeWidth="1.5" />

        {/* Escapamento Esportivo em Inox / Titânio */}
        <path d="M 195 150 L 150 152 L 115 138 L 85 132" fill="none" stroke="#64748b" strokeWidth="4.5" strokeLinecap="round" />
        <rect x="80" y="126" width="35" height="10" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1" transform="rotate(-10 80 126)" />

        {/* Tanque de Combustível Musculoso e Carenagem Frontal Suzuki */}
        <path
          d="M 175 110 
             C 180 92, 220 88, 250 95 
             L 285 85 
             L 305 105 
             L 275 125 
             L 230 115 Z"
          fill={color}
          stroke="#000000"
          strokeWidth="1.2"
        />

        {/* Bolha / Para-brisa Fumê */}
        <path d="M 275 88 L 295 72 L 310 95 Z" fill="#0284c7" opacity="0.6" stroke="#38bdf8" strokeWidth="1" />

        {/* Guidão Esportivo Clip-on e Manetes */}
        <circle cx="270" cy="90" r="3" fill="#1e293b" />
        <line x1="268" y1="88" x2="258" y2="85" stroke="#000000" strokeWidth="2.5" />

        {/* Rabeta Agressiva com Assento Biposto */}
        <path d="M 175 110 L 130 95 L 98 108 L 140 122 Z" fill={color} stroke="#000000" strokeWidth="1" />
        <path d="M 170 110 C 158 105, 148 106, 142 112 Z" fill="#0f172a" />
        <path d="M 125 98 L 112 102" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />

        {/* Suspensão Dianteira Invertida Dourada (USD Forks) */}
        <line x1="285" y1="95" x2="310" y2="152" stroke="#eab308" strokeWidth="5" strokeLinecap="round" />

        {/* Balança Traseira */}
        <path d="M 185 145 L 105 152" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />

        {/* Roda Traseira Larga 180mm */}
        <g transform="translate(105, 150)">
          <circle cx="0" cy="0" r="26" fill="#0f172a" />
          <circle cx="0" cy="0" r="18" fill="#1e293b" stroke={color} strokeWidth="1.5" />
          <circle cx="0" cy="0" r="10" fill="#94a3b8" />
          <circle cx="0" cy="0" r="4" fill="#000" />
        </g>

        {/* Roda Dianteira Esportiva com Disco Duplo Wave */}
        <g transform="translate(310, 150)">
          <circle cx="0" cy="0" r="26" fill="#0f172a" />
          <circle cx="0" cy="0" r="18" fill="#1e293b" stroke={color} strokeWidth="1.5" />
          <circle cx="0" cy="0" r="12" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 2" />
          <circle cx="0" cy="0" r="4" fill="#000" />
        </g>

        {/* Farol Agressivo LED */}
        <polygon points="305,102 315,108 308,114" fill="#38bdf8" />

        <text x="200" y="192" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="900" letterSpacing="2">
          SUZUKI GSX-S 750CC RACING
        </text>
      </svg>
    );
  }

  // 4. LAMBRETA / VESPA RETRÔ
  if (normalizedId.includes('lambreta') || normalizedId.includes('vespa') || normalizedId === 'lambreta_classica') {
    return (
      <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-md select-none">
        <defs>
          <linearGradient id="chromeLambreta" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>

        {/* Sombra */}
        <ellipse cx="200" cy="172" rx="135" ry="10" fill="#000000" opacity="0.18" />

        {/* Escudo Frontal Clássico da Lambreta (Leg Shield Curvo) */}
        <path
          d="M 260 85 
             C 275 95, 290 125, 285 152 
             L 260 152 
             C 265 125, 255 105, 245 85 Z"
          fill={color}
          stroke="#000000"
          strokeWidth="1.2"
        />
        {/* Friso Cromado do Escudo */}
        <path d="M 260 85 C 275 95, 290 125, 285 152" fill="none" stroke="url(#chromeLambreta)" strokeWidth="2.5" />

        {/* Assoalho / Plataforma Reta com Frisos de Borracha */}
        <rect x="180" y="150" width="85" height="5" rx="1.5" fill="#334155" />
        <line x1="185" y1="151" x2="260" y2="151" stroke="url(#chromeLambreta)" strokeWidth="1" />

        {/* Carenagem Traseira Bojuda / Formato Gota Lambreta */}
        <path
          d="M 120 152 
             C 95 150, 90 120, 115 110 
             C 135 102, 185 112, 195 152 Z"
          fill={color}
          stroke="#000000"
          strokeWidth="1.2"
        />

        {/* Grade de Ventilação Cromada na Lateral */}
        <line x1="125" y1="128" x2="155" y2="128" stroke="url(#chromeLambreta)" strokeWidth="2" strokeLinecap="round" />
        <line x1="128" y1="134" x2="158" y2="134" stroke="url(#chromeLambreta)" strokeWidth="2" strokeLinecap="round" />

        {/* Assento Duplo Vintage em Couro Caramelo / Marrom */}
        <path
          d="M 130 110 
             C 130 102, 150 98, 175 100 
             C 195 102, 205 106, 205 115 
             L 130 115 Z"
          fill="#b45309"
          stroke="#78350f"
          strokeWidth="1.5"
        />

        {/* Estepe / Pneu Sobressalente na Traseira */}
        <ellipse cx="92" cy="125" rx="10" ry="18" fill="#1e293b" stroke="url(#chromeLambreta)" strokeWidth="1.5" />
        <ellipse cx="92" cy="125" rx="4" ry="10" fill="#cbd5e1" />

        {/* Guidão e Farol Redondo Cromado Vintage */}
        <rect x="250" y="80" width="10" height="28" rx="2" fill="url(#chromeLambreta)" transform="rotate(-15 250 80)" />
        <circle cx="258" cy="74" r="8" fill="url(#chromeLambreta)" stroke="#475569" strokeWidth="1" />
        <circle cx="260" cy="74" r="5.5" fill="#fef08a" />

        {/* Manoplas e Espelho Redondo */}
        <line x1="250" y1="74" x2="238" y2="76" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
        <line x1="255" y1="70" x2="245" y2="55" stroke="url(#chromeLambreta)" strokeWidth="1.5" />
        <circle cx="245" cy="55" r="4" fill="url(#chromeLambreta)" />

        {/* Escapamento Rabo de Peixe Cromado */}
        <path d="M 140 155 L 90 156" stroke="url(#chromeLambreta)" strokeWidth="3.5" strokeLinecap="round" />

        {/* Roda Traseira Pequena 10 Polegadas */}
        <g transform="translate(135, 152)">
          <circle cx="0" cy="0" r="18" fill="#1e293b" />
          <circle cx="0" cy="0" r="11" fill="url(#chromeLambreta)" stroke="#475569" strokeWidth="1" />
          <circle cx="0" cy="0" r="4" fill="#334155" />
        </g>

        {/* Roda Dianteira Lambreta com Para-lama Envolvente */}
        <path d="M 285 130 C 295 130, 310 138, 305 152 L 280 152 Z" fill={color} />
        <g transform="translate(290, 152)">
          <circle cx="0" cy="0" r="18" fill="#1e293b" />
          <circle cx="0" cy="0" r="11" fill="url(#chromeLambreta)" stroke="#475569" strokeWidth="1" />
          <circle cx="0" cy="0" r="4" fill="#334155" />
        </g>

        <text x="200" y="192" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="900" letterSpacing="2">
          LAMBRETA / VESPA 150 RETRÔ
        </text>
      </svg>
    );
  }

  // 5. BYD SONG PLUS HÍBRIDO (Design Futurista Dragon Face)
  if (normalizedId.includes('byd') || normalizedId === 'byd_song') {
    return (
      <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-md select-none">
        <defs>
          <linearGradient id="bydLightbar" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <linearGradient id="bydGlass" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>

        {/* Sombra */}
        <ellipse cx="200" cy="172" rx="165" ry="11" fill="#000000" opacity="0.2" />

        {/* Teto Flutuante Black Piano */}
        <path d="M 120 72 L 255 72 L 295 105 L 100 105 Z" fill="#090d16" />

        {/* Carroceria SUV Aerodinâmica BYD Dragon Face */}
        <path
          d="M 50 148 
             L 48 118 
             C 50 105, 75 98, 105 95 
             L 145 72 
             L 260 72 
             L 315 102 
             L 355 110 
             C 365 115, 368 128, 365 148 
             L 50 148 Z"
          fill={color}
          stroke="#000000"
          strokeWidth="1.5"
          strokeOpacity="0.2"
        />

        {/* Molduras Plásticas Negras SUV nas Caixas de Roda */}
        <path d="M 75 148 C 75 125, 125 125, 125 148" fill="none" stroke="#0f172a" strokeWidth="6" />
        <path d="M 285 148 C 285 125, 335 125, 335 148" fill="none" stroke="#0f172a" strokeWidth="6" />

        {/* Janelas com Linha de Cintura Ascendente e Teto Flutuante */}
        <path
          d="M 120 102 L 150 76 L 205 76 L 205 102 Z"
          fill={windowColor}
          opacity={windowOpacity}
          stroke="#38bdf8"
          strokeWidth="0.8"
        />
        <path
          d="M 210 76 L 255 76 L 298 102 L 210 102 Z"
          fill={windowColor}
          opacity={windowOpacity}
          stroke="#38bdf8"
          strokeWidth="0.8"
        />

        {/* Friso Cromado do Teto que desce na Coluna D */}
        <path d="M 140 72 L 260 72 L 295 95 L 305 105" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />

        {/* Barra de LED Frontal Conectada (Dragon Face Signature) */}
        <path d="M 320 108 L 365 114 L 360 120 L 325 116 Z" fill="url(#bydLightbar)" />
        <line x1="335" y1="112" x2="365" y2="116" stroke="#ffffff" strokeWidth="2" filter="drop-shadow(0 0 4px #38bdf8)" />

        {/* Grade Hexagonal Moderna Texturizada com Losangos */}
        <path d="M 345 122 L 365 124 L 360 140 L 340 138 Z" fill="#0f172a" />
        <line x1="344" y1="126" x2="362" y2="128" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
        <line x1="342" y1="132" x2="360" y2="134" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />

        {/* Lanterna Traseira LED Vermelha Conectada */}
        <path d="M 48 114 L 68 112 L 68 122 L 48 122 Z" fill="#ef4444" filter="drop-shadow(0 0 3px #ef4444)" />

        {/* Roda Traseira Aero Turbine 19" */}
        <g transform="translate(100, 148)">
          <circle cx="0" cy="0" r="24" fill="#0f172a" />
          <circle cx="0" cy="0" r="17" fill="#1e293b" />
          <circle cx="0" cy="0" r="14" fill={rimColor} />
          {/* Lâminas da Turbina Elétrica */}
          <polygon points="0,-14 6,-8 0,0" fill="#38bdf8" />
          <polygon points="14,0 8,6 0,0" fill="#38bdf8" />
          <polygon points="0,14 -6,8 0,0" fill="#38bdf8" />
          <polygon points="-14,0 -8,-6 0,0" fill="#38bdf8" />
          <circle cx="0" cy="0" r="5" fill="#0f172a" />
        </g>

        {/* Roda Dianteira Aero Turbine 19" */}
        <g transform="translate(310, 148)">
          <circle cx="0" cy="0" r="24" fill="#0f172a" />
          <circle cx="0" cy="0" r="17" fill="#1e293b" />
          <circle cx="0" cy="0" r="14" fill={rimColor} />
          <polygon points="0,-14 6,-8 0,0" fill="#38bdf8" />
          <polygon points="14,0 8,6 0,0" fill="#38bdf8" />
          <polygon points="0,14 -6,8 0,0" fill="#38bdf8" />
          <polygon points="-14,0 -8,-6 0,0" fill="#38bdf8" />
          <circle cx="0" cy="0" r="5" fill="#0f172a" />
        </g>

        <text x="200" y="192" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="900" letterSpacing="2">
          BYD SONG PLUS DM-i HÍBRIDO
        </text>
      </svg>
    );
  }

  // 6. JEEP COMPASS (Icônica Grade 7 Fendas e Caixas de Roda Quadradas)
  if (normalizedId.includes('jeep') || normalizedId === 'jeep_compass') {
    return (
      <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-md select-none">
        {/* Sombra */}
        <ellipse cx="200" cy="172" rx="165" ry="11" fill="#000000" opacity="0.2" />

        {/* Longarinas de Teto (Roof Rails) */}
        <line x1="125" y1="62" x2="260" y2="62" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
        <rect x="135" y="62" width="6" height="5" fill="#1e293b" />
        <rect x="250" y="62" width="6" height="5" fill="#1e293b" />

        {/* Teto Preto Bicolor Estilo Jeep */}
        <path d="M 115 67 L 265 67 L 275 95 L 105 95 Z" fill="#090d16" />

        {/* Carroceria Robusta do Jeep Compass */}
        <path
          d="M 52 148 
             L 50 110 
             C 50 102, 60 98, 85 96 
             L 125 67 
             L 265 67 
             L 290 98 
             L 348 102 
             C 358 105, 362 118, 360 148 
             L 52 148 Z"
          fill={color}
          stroke="#000000"
          strokeWidth="1.5"
          strokeOpacity="0.2"
        />

        {/* Caixas de Rodas Trapezoidais Icônicas Jeep com Moldura Preta */}
        <polygon points="70,148 80,122 120,122 130,148" fill="none" stroke="#1e293b" strokeWidth="6" strokeLinejoin="miter" />
        <polygon points="280,148 290,122 330,122 340,148" fill="none" stroke="#1e293b" strokeWidth="6" strokeLinejoin="miter" />

        {/* Janelas Estilo Jeep */}
        <path
          d="M 120 95 L 140 72 L 195 72 L 195 95 Z"
          fill={windowColor}
          opacity={windowOpacity}
          stroke="#475569"
          strokeWidth="1"
        />
        <path
          d="M 200 72 L 255 72 L 275 95 L 200 95 Z"
          fill={windowColor}
          opacity={windowOpacity}
          stroke="#475569"
          strokeWidth="1"
        />

        {/* Grade Dianteira 7 Fendas Jeep */}
        <g transform="translate(335, 110)">
          <rect x="0" y="0" width="22" height="15" fill="#0f172a" rx="2" />
          <line x1="3" y1="2" x2="3" y2="13" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="6" y1="2" x2="6" y2="13" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="9" y1="2" x2="9" y2="13" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="12" y1="2" x2="12" y2="13" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="15" y1="2" x2="15" y2="13" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="18" y1="2" x2="18" y2="13" stroke="#cbd5e1" strokeWidth="1.5" />
        </g>

        {/* Farol Bi-LED Jeep Compass */}
        <rect x="315" y="102" width="22" height="8" rx="2" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
        <circle cx="322" cy="106" r="3" fill="#38bdf8" />

        {/* Peito de Aço / Skidplate Prateado */}
        <rect x="335" y="138" width="22" height="6" rx="2" fill="#94a3b8" />

        {/* Roda Traseira Robusta 18" */}
        <g transform="translate(100, 148)">
          <circle cx="0" cy="0" r="24" fill="#0f172a" />
          <circle cx="0" cy="0" r="16" fill={rimColor} />
          <circle cx="0" cy="0" r="6" fill="#1e293b" />
          <line x1="-12" y1="-6" x2="12" y2="6" stroke="#334155" strokeWidth="3" />
          <line x1="-6" y1="12" x2="6" y2="-12" stroke="#334155" strokeWidth="3" />
        </g>

        {/* Roda Dianteira Robusta 18" */}
        <g transform="translate(310, 148)">
          <circle cx="0" cy="0" r="24" fill="#0f172a" />
          <circle cx="0" cy="0" r="16" fill={rimColor} />
          <circle cx="0" cy="0" r="6" fill="#1e293b" />
          <line x1="-12" y1="-6" x2="12" y2="6" stroke="#334155" strokeWidth="3" />
          <line x1="-6" y1="12" x2="6" y2="-12" stroke="#334155" strokeWidth="3" />
        </g>

        <text x="200" y="192" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="900" letterSpacing="2">
          JEEP COMPASS LONGITUDE 4X2 TURBO
        </text>
      </svg>
    );
  }

  // 7. TOYOTA COROLLA CROSS HYBRID
  if (normalizedId.includes('corolla') || normalizedId.includes('toyota') || normalizedId === 'corolla_cross') {
    return (
      <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-md select-none">
        {/* Sombra */}
        <ellipse cx="200" cy="172" rx="165" ry="11" fill="#000000" opacity="0.2" />

        {/* Carroceria Crossover Muscular Corolla Cross */}
        <path
          d="M 50 148 
             L 48 114 
             C 48 104, 65 96, 95 95 
             L 140 70 
             L 250 70 
             L 300 98 
             L 352 108 
             C 362 114, 365 125, 362 148 
             L 50 148 Z"
          fill={color}
          stroke="#000000"
          strokeWidth="1.5"
          strokeOpacity="0.2"
        />

        {/* Molduras Plásticas Suaves da Caixa de Roda */}
        <path d="M 72 148 C 72 122, 126 122, 126 148" fill="none" stroke="#334155" strokeWidth="5.5" />
        <path d="M 282 148 C 282 122, 336 122, 336 148" fill="none" stroke="#334155" strokeWidth="5.5" />

        {/* Janelas com Moldura Cromada Superior */}
        <path
          d="M 120 96 L 146 75 L 200 75 L 200 96 Z"
          fill={windowColor}
          opacity={windowOpacity}
          stroke="#475569"
          strokeWidth="1"
        />
        <path
          d="M 205 75 L 246 75 L 285 96 L 205 96 Z"
          fill={windowColor}
          opacity={windowOpacity}
          stroke="#475569"
          strokeWidth="1"
        />
        {/* Friso Cromado */}
        <path d="M 135 72 L 250 72 L 290 95" fill="none" stroke="#cbd5e1" strokeWidth="2" />

        {/* Grade Frontal Trapezoidal Marcante Toyota */}
        <polygon points="335,114 360,116 355,138 330,136" fill="#0f172a" />
        {/* Emblema Toyota com Aura Azul Híbrido */}
        <ellipse cx="346" cy="122" rx="5" ry="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="0.8" />

        {/* Faróis Afilados LED com DRL Azulado */}
        <path d="M 312 104 L 348 110 L 338 118 L 310 114 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
        <line x1="318" y1="108" x2="345" y2="112" stroke="#38bdf8" strokeWidth="2" />

        {/* Roda Traseira Híbrida 18" */}
        <g transform="translate(100, 148)">
          <circle cx="0" cy="0" r="24" fill="#0f172a" />
          <circle cx="0" cy="0" r="17" fill={rimColor} />
          <circle cx="0" cy="0" r="6" fill="#334155" />
          <circle cx="0" cy="0" r="2.5" fill="#38bdf8" />
        </g>

        {/* Roda Dianteira Híbrida 18" */}
        <g transform="translate(310, 148)">
          <circle cx="0" cy="0" r="24" fill="#0f172a" />
          <circle cx="0" cy="0" r="17" fill={rimColor} />
          <circle cx="0" cy="0" r="6" fill="#334155" />
          <circle cx="0" cy="0" r="2.5" fill="#38bdf8" />
        </g>

        <text x="200" y="192" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="900" letterSpacing="2">
          TOYOTA COROLLA CROSS HYBRID
        </text>
      </svg>
    );
  }

  // 8. FORD MUSTANG GT V8
  if (normalizedId.includes('mustang') || normalizedId === 'mustang_gt') {
    return (
      <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-md select-none">
        {/* Sombra */}
        <ellipse cx="200" cy="172" rx="165" ry="11" fill="#000000" opacity="0.22" />

        {/* Silhueta Agressiva Fastback Muscle Car */}
        <path
          d="M 45 148 
             L 45 120 
             L 75 116 
             L 145 88 
             L 245 88 
             L 285 110 
             L 365 116 
             C 372 122, 372 136, 368 148 
             L 45 148 Z"
          fill={color}
          stroke="#000000"
          strokeWidth="1.5"
          strokeOpacity="0.2"
        />

        {/* Faixas Esportivas Racing Stripes */}
        <line x1="145" y1="88" x2="365" y2="116" stroke="#ffffff" strokeWidth="4" opacity="0.4" />
        <line x1="152" y1="88" x2="368" y2="116" stroke="#ffffff" strokeWidth="4" opacity="0.4" />

        {/* Capô Longo com Entradas de Ar do V8 */}
        <ellipse cx="320" cy="112" rx="12" ry="2.5" fill="#0f172a" />

        {/* Janelas Fastback */}
        <path
          d="M 125 110 L 150 92 L 235 92 L 275 110 Z"
          fill={windowColor}
          opacity={windowOpacity}
          stroke="#334155"
          strokeWidth="1.2"
        />

        {/* Grade Dianteira Sharknose com Cavalo Mustang */}
        <polygon points="350,118 368,122 365,136 345,134" fill="#0f172a" />
        <rect x="355" y="124" width="4" height="2.5" fill="#e2e8f0" />

        {/* Lanterna Traseira Tri-Bar Mustang */}
        <rect x="44" y="122" width="3" height="12" fill="#ef4444" />
        <rect x="50" y="122" width="3" height="12" fill="#ef4444" />
        <rect x="56" y="122" width="3" height="12" fill="#ef4444" />

        {/* Rodas Esportivas Escuras 20" */}
        <g transform="translate(95, 148)">
          <circle cx="0" cy="0" r="24" fill="#0f172a" />
          <circle cx="0" cy="0" r="18" fill="#1e293b" />
          <circle cx="0" cy="0" r="14" fill="#000000" stroke="#dc2626" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="5" fill="#cbd5e1" />
        </g>
        <g transform="translate(315, 148)">
          <circle cx="0" cy="0" r="24" fill="#0f172a" />
          <circle cx="0" cy="0" r="18" fill="#1e293b" />
          <circle cx="0" cy="0" r="14" fill="#000000" stroke="#dc2626" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="5" fill="#cbd5e1" />
        </g>

        <text x="200" y="192" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="900" letterSpacing="2">
          FORD MUSTANG GT 5.0 V8 488CV
        </text>
      </svg>
    );
  }

  // 9. VEÍCULO PADRÃO (Hatch / Popular / Outros)
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-md select-none">
      <ellipse cx="200" cy="172" rx="160" ry="11" fill="#000000" opacity="0.18" />

      {/* Silhueta Hatch / Compacto Moderno */}
      <path
        d="M 55 148 
           L 55 124 
           C 58 114, 75 106, 105 104 
           L 155 78 
           L 245 78 
           L 290 108 
           L 345 116 
           C 355 120, 358 132, 355 148 
           L 55 148 Z"
        fill={color}
        stroke="#000000"
        strokeWidth="1.5"
        strokeOpacity="0.2"
      />

      {/* Janelas */}
      <path
        d="M 120 104 L 155 82 L 200 82 L 200 104 Z"
        fill={windowColor}
        opacity={windowOpacity}
        stroke="#475569"
        strokeWidth="1"
      />
      <path
        d="M 205 82 L 240 82 L 278 104 L 205 104 Z"
        fill={windowColor}
        opacity={windowOpacity}
        stroke="#475569"
        strokeWidth="1"
      />

      {/* Grade Frontal & Farol */}
      <polygon points="332,118 355,120 350,135 328,133" fill="#0f172a" />
      <path d="M 315 110 L 348 114 L 338 122 L 312 118 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />

      {/* Rodas */}
      <g transform="translate(100, 148)">
        <circle cx="0" cy="0" r="22" fill="#0f172a" />
        <circle cx="0" cy="0" r="15" fill={rimColor} />
        <circle cx="0" cy="0" r="5" fill="#334155" />
      </g>
      <g transform="translate(305, 148)">
        <circle cx="0" cy="0" r="22" fill="#0f172a" />
        <circle cx="0" cy="0" r="15" fill={rimColor} />
        <circle cx="0" cy="0" r="5" fill="#334155" />
      </g>

      <text x="200" y="192" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="900" letterSpacing="2">
        {name.toUpperCase() || 'VEÍCULO TROPICAL BRASIL'}
      </text>
    </svg>
  );
};
