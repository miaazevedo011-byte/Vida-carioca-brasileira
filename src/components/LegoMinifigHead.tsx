import React from 'react';
import avatarCurlyBrown from '../assets/images/avatar_curly_brown_1793891179905.jpg';
import avatarLongStraight from '../assets/images/avatar_long_straight_1793891180160.jpg';
import avatarBlackFade from '../assets/images/avatar_black_fade_1793891180679.jpg';

export interface LegoAvatarDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  avatarImageUrl?: string;
}

export const LEGO_AVATARS_LIST: LegoAvatarDef[] = [
  { id: 'lucas_ondulado', title: 'Lucas Ondulado 🇧🇷', description: 'Cabelo castanho ondulado com camiseta do Brasil', icon: '👦', avatarImageUrl: avatarCurlyBrown },
  { id: 'fade_estiloso', title: 'Fade Navalhado ✂️', description: 'Cabelo preto curto arrepiado estilo fade', icon: '💈', avatarImageUrl: avatarBlackFade },
  { id: 'preto_reto', title: 'Cabelo Reto 🖤', description: 'Cabelo preto liso e estiloso', icon: '🧑', avatarImageUrl: avatarLongStraight },
  { id: 'estudante', title: 'Estudante', description: 'Curioso e focado no vestibular', icon: '🧑‍🎓' },
  { id: 'profissional', title: 'Profissional', description: 'Elegante, focado no mundo corporativo', icon: '👩‍💼' },
  { id: 'jovem', title: 'Jovem', description: 'Cabelo arrepiado e cheio de energia', icon: '👦' },
  { id: 'casual', title: 'Casual', description: 'Barba alinhada e visual descontraído', icon: '🧔' },
  { id: 'esportista', title: 'Esportista', description: 'Bandana atlética e fôlego de maratona', icon: '🏃' },
  { id: 'artistico', title: 'Artístico', description: 'Boina francesa, bigode fino e criatividade', icon: '👨‍🎨' },
  { id: 'cientista', title: 'Cientista', description: 'Óculos de proteção e ideias inovadoras', icon: '👩‍🔬' },
  { id: 'executivo', title: 'Executivo', description: 'Penteado clássico e óculos aro fino', icon: '👨‍💼' },
  { id: 'aposentado', title: 'Aposentado', description: 'Vovô com stud visível e bigode fofo', icon: '👴' },
  { id: 'criativo', title: 'Criativo', description: 'Boné streetwear e espírito inovador', icon: '🧢' }
];

interface LegoMinifigHeadProps {
  avatarId?: string;
  avatarImageUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero';
  showGlasses?: boolean;
  className?: string;
}

export const LegoMinifigHead: React.FC<LegoMinifigHeadProps> = ({
  avatarId = 'lucas_ondulado',
  avatarImageUrl,
  size = 'md',
  showGlasses = false,
  className = ''
}) => {
  const normId = (avatarId || '').toLowerCase();

  const itemDef = LEGO_AVATARS_LIST.find((item) =>
    item.id.toLowerCase() === normId ||
    normId.includes(item.id.toLowerCase()) ||
    (item.title && normId.includes(item.title.toLowerCase()))
  );

  const effectiveImgUrl = avatarImageUrl || itemDef?.avatarImageUrl || (avatarId && (avatarId.startsWith('/') || avatarId.startsWith('http') || avatarId.endsWith('.jpg') || avatarId.endsWith('.png')) ? avatarId : undefined);

  if (effectiveImgUrl) {
    return (
      <div className={`relative flex items-center justify-center select-none overflow-hidden rounded-2xl border-2 border-amber-400/80 shadow-xs bg-amber-50 ${className}`}>
        <img
          src={effectiveImgUrl}
          alt="Avatar Personagem"
          className="w-full h-full object-cover rounded-2xl"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Dimensões do Viewbox
  // Para hero/lg usamos proporção 100x115
  // Para md/sm usamos proporção 60x70
  const isHero = size === 'hero' || size === 'lg';

  if (isHero) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <svg
          viewBox="0 0 100 115"
          className="w-full h-full drop-shadow-md overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Pino de Encaixe LEGO Superior (Stud) */}
          <rect x="36" y="4" width="28" height="12" rx="4" fill="#FFC90E" stroke="#D39800" strokeWidth="2.5" />
          <ellipse cx="50" cy="7" rx="10" ry="3" fill="#FFE570" />

          {/* Cabeça Cilíndrica Minifig */}
          <rect x="18" y="14" width="64" height="66" rx="20" fill="#FFD12E" stroke="#D39800" strokeWidth="2.5" />

          {/* Brilho Plástico Superior */}
          <path d="M26 24C26 20 34 18 50 18C66 18 74 20 74 24" stroke="#FFF7A6" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="32" cy="28" rx="8" ry="4" fill="#FFFFFF" fillOpacity="0.55" transform="rotate(-15 32 28)" />

          {/* Cabelo e Acessórios por Avatar */}
          {normId.includes('profissional') ? (
            <>
              {/* Cabelo Feminino Executivo com coque */}
              <ellipse cx="50" cy="10" rx="14" ry="7" fill="#935116" />
              <path d="M18 36C18 20 28 14 50 14C72 14 82 20 82 36C76 36 72 46 72 52C72 40 62 34 50 34C38 34 28 40 28 52C28 46 24 36 18 36Z" fill="#935116" />
              {/* Olhos com Cílios */}
              <circle cx="37" cy="50" r="4.2" fill="#1E1E1E" />
              <circle cx="35.5" cy="48.5" r="1.5" fill="#FFFFFF" />
              <path d="M31 46L27 43" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" />
              <circle cx="63" cy="50" r="4.2" fill="#1E1E1E" />
              <circle cx="61.5" cy="48.5" r="1.5" fill="#FFFFFF" />
              <path d="M69 46L73 43" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" />
              {/* Sorriso Batom */}
              <path d="M41 59C44 65 56 65 59 59" stroke="#B83838" strokeWidth="3.2" strokeLinecap="round" />
            </>
          ) : normId.includes('jovem') ? (
            <>
              {/* Cabelo Arrepiado Loiro */}
              <path d="M19 32L30 14L42 20L51 10L64 20L79 16L79 32C71 32 65 38 61 35C55 38 45 35 39 38C32 35 25 38 19 32Z" fill="#C2873E" stroke="#9A6520" strokeWidth="2" />
              <circle cx="37" cy="51" r="4.2" fill="#1E1E1E" />
              <circle cx="35.5" cy="49.5" r="1.5" fill="#FFFFFF" />
              <circle cx="63" cy="51" r="4.2" fill="#1E1E1E" />
              <circle cx="61.5" cy="49.5" r="1.5" fill="#FFFFFF" />
              {/* Sorriso Malandro */}
              <path d="M42 61C47 65 57 63 60 58" stroke="#7A3E08" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : normId.includes('casual') ? (
            <>
              {/* Cabelo e Barba Castanha */}
              <path d="M20 28C20 16 32 14 50 14C68 14 80 16 80 28C80 38 77 40 70 35C64 38 54 36 50 36C44 36 34 38 30 35C24 40 20 38 20 28Z" fill="#4B2E1E" stroke="#2D1A10" strokeWidth="2" />
              <circle cx="37" cy="47" r="4.2" fill="#1E1E1E" />
              <circle cx="63" cy="47" r="4.2" fill="#1E1E1E" />
              {/* Barba Minifig */}
              <path d="M28 58C28 73 38 79 50 79C62 79 72 73 72 58C68 60 64 62 58 62C54 63 46 63 42 62C36 62 32 60 28 58Z" fill="#4B2E1E" />
              <path d="M43 56C46 59 54 59 57 56" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : normId.includes('esportista') ? (
            <>
              <path d="M20 26C20 16 32 14 50 14C68 14 80 16 80 26C77 32 74 42 74 52C64 42 58 42 50 42C44 42 36 42 26 52C26 42 23 32 20 26Z" fill="#D35400" />
              {/* Faixa Vermelha */}
              <rect x="18" y="32" width="64" height="12" rx="3" fill="#E74C3C" stroke="#C0392B" strokeWidth="2" />
              <line x1="46" y1="34" x2="54" y2="34" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="37" cy="54" r="4.2" fill="#1E1E1E" />
              <circle cx="63" cy="54" r="4.2" fill="#1E1E1E" />
              <path d="M42 63C45 68 55 68 58 63" stroke="#7A3E08" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : normId.includes('artistico') ? (
            <>
              {/* Boina Francesa Azul Petróleo */}
              <path d="M14 32C10 22 30 10 60 10C80 10 90 20 86 30C80 40 64 38 50 38C30 38 20 40 14 32Z" fill="#2C3E50" stroke="#1A252F" strokeWidth="2" />
              <circle cx="60" cy="8" r="4" fill="#2C3E50" />
              <circle cx="37" cy="50" r="4.2" fill="#1E1E1E" />
              <circle cx="63" cy="50" r="4.2" fill="#1E1E1E" />
              {/* Bigode Artístico Fino */}
              <path d="M38 60C41 58 47 58 50 61C53 58 59 58 62 60C66 63 67 65 69 62" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Manchas de Tinta */}
              <circle cx="27" cy="62" r="3.5" fill="#3498DB" />
              <circle cx="72" cy="44" r="2.8" fill="#E67E22" />
            </>
          ) : normId.includes('cientista') ? (
            <>
              {/* Cabelo Maluco */}
              <path d="M18 32L10 22L24 19L20 10L36 14L42 6L56 11L66 6L69 16L82 13L75 26L85 32C79 32 72 42 69 35C62 40 52 37 50 37C44 37 34 40 30 35C24 42 20 32 18 32Z" fill="#BDC3C7" stroke="#95A5A6" strokeWidth="1.5" />
              {/* Óculos de Laboratório */}
              <circle cx="36" cy="50" r="9" fill="#A9CCE3" stroke="#2C3E50" strokeWidth="3" />
              <circle cx="64" cy="50" r="9" fill="#A9CCE3" stroke="#2C3E50" strokeWidth="3" />
              <line x1="45" y1="50" x2="55" y2="50" stroke="#2C3E50" strokeWidth="3" />
              <circle cx="36" cy="50" r="3" fill="#1B2631" />
              <circle cx="64" cy="50" r="3" fill="#1B2631" />
              <path d="M42 64C45 69 55 69 58 64" stroke="#7A3E08" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : normId.includes('executivo') ? (
            <>
              {/* Cabelo Repartido */}
              <path d="M20 28C20 16 32 14 50 14C68 14 80 16 80 28C80 34 76 34 70 28C64 28 56 32 50 32C40 32 30 25 20 28Z" fill="#1A1A1A" />
              {/* Óculos Fino */}
              <rect x="26" y="44" width="18" height="13" rx="3" stroke="#1A1A1A" strokeWidth="2.5" fill="none" />
              <rect x="56" y="44" width="18" height="13" rx="3" stroke="#1A1A1A" strokeWidth="2.5" fill="none" />
              <line x1="44" y1="50" x2="56" y2="50" stroke="#1A1A1A" strokeWidth="2.5" />
              <circle cx="35" cy="50" r="3" fill="#1A1A1A" />
              <circle cx="65" cy="50" r="3" fill="#1A1A1A" />
              <path d="M42 63C45 67 55 67 58 63" stroke="#7A3E08" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : normId.includes('aposentado') ? (
            <>
              {/* Cabelo Lateral Branco */}
              <path d="M18 38C18 32 24 28 27 28C27 41 24 48 18 51Z" fill="#D5D8DC" />
              <path d="M82 38C82 32 76 28 73 28C73 41 76 48 82 51Z" fill="#D5D8DC" />
              {/* Rugas na testa */}
              <path d="M38 26C42 24 56 24 60 26" stroke="#C98B00" strokeWidth="2" strokeLinecap="round" />
              <path d="M42 31C45 29 53 29 56 31" stroke="#C98B00" strokeWidth="2" strokeLinecap="round" />
              {/* Olhos e Bigodão */}
              <circle cx="36" cy="44" r="3.8" fill="#1E1E1E" />
              <circle cx="64" cy="44" r="3.8" fill="#1E1E1E" />
              <path d="M32 58C38 53 46 56 50 60C54 56 62 53 68 58C64 64 57 66 50 64C43 66 36 64 32 58Z" fill="#EAEDED" stroke="#BDC3C7" strokeWidth="2" />
            </>
          ) : normId.includes('criativo') ? (
            <>
              {/* Boné Roxo Streetwear virado para trás */}
              <path d="M18 34C18 19 30 14 50 14C70 14 82 20 82 36C76 36 70 39 64 37C54 37 46 37 36 37C30 39 24 36 18 34Z" fill="#9B59B6" stroke="#8E44AD" strokeWidth="2" />
              <rect x="40" y="34" width="20" height="7" rx="3.5" fill="#8E44AD" />
              {/* Olho normal e outro piscando */}
              <circle cx="36" cy="51" r="4.2" fill="#1E1E1E" />
              <circle cx="34.5" cy="49.5" r="1.5" fill="#FFFFFF" />
              <path d="M57 51C60 48 67 48 69 53" stroke="#1E1E1E" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M42 62C45 68 55 68 58 62" stroke="#7A3E08" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Padrão: Estudante */}
              <path d="M22 28C22 18 30 14 50 14C70 14 78 18 78 28C78 30 74 34 70 30C66 26 62 26 58 32C52 28 46 28 42 32C38 26 34 26 30 30C26 34 22 30 22 28Z" fill="#5A3825" stroke="#3D2416" strokeWidth="2" />
              <path d="M23 29C23 35 27 40 28 44C29 39 31 35 30 31" fill="#5A3825" />
              <path d="M77 29C77 35 73 40 72 44C71 39 69 35 70 31" fill="#5A3825" />
              {/* Sobrancelhas & Olhos */}
              <path d="M30 42C33 39 40 40 42 43" stroke="#5A3825" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="37" cy="50" r="4.2" fill="#1E1E1E" />
              <circle cx="35.5" cy="48.5" r="1.5" fill="#FFFFFF" />
              <path d="M58 43C60 40 67 39 70 42" stroke="#5A3825" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="63" cy="50" r="4.2" fill="#1E1E1E" />
              <circle cx="61.5" cy="48.5" r="1.5" fill="#FFFFFF" />
              {/* Bochechas */}
              <ellipse cx="28" cy="55" rx="4" ry="2" fill="#FF8D6B" fillOpacity="0.4" />
              <ellipse cx="72" cy="55" rx="4" ry="2" fill="#FF8D6B" fillOpacity="0.4" />
              {/* Sorriso */}
              <path d="M41 58C44 65 56 65 59 58" stroke="#7A3E08" strokeWidth="3" strokeLinecap="round" />
            </>
          )}

          {/* Óculos de estudante estilizado em acrílico azul (se solicitado) */}
          {showGlasses && (
            <g opacity="0.85">
              <rect x="26" y="42" width="18" height="15" rx="4" stroke="#0077B6" strokeWidth="2.5" fill="#CDE5FF" fillOpacity="0.4" />
              <rect x="56" y="42" width="18" height="15" rx="4" stroke="#0077B6" strokeWidth="2.5" fill="#CDE5FF" fillOpacity="0.4" />
              <line x1="44" y1="48" x2="56" y2="48" stroke="#0077B6" strokeWidth="2.5" />
            </g>
          )}

          {/* Pescoço de Encaixe LEGO Inferior */}
          <rect x="36" y="80" width="28" height="8" rx="2" fill="#E5A600" stroke="#BD8200" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  // Versão Compacta (60x70) para thumbnail e botões
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 60 70" className="w-full h-full drop-shadow-sm overflow-visible">
        {/* Stud */}
        <rect x="22" y="3" width="16" height="7" rx="2" fill="#FFC90E" stroke="#C98B00" strokeWidth="1.5" />
        {/* Cabeça */}
        <rect x="10" y="9" width="40" height="42" rx="12" fill="#FFD12E" stroke="#C98B00" strokeWidth="1.5" />

        {normId.includes('profissional') ? (
          <>
            <path d="M10 22C10 10 20 8 30 8C40 8 50 10 50 22C46 22 44 28 44 32C44 24 38 20 30 20C22 20 16 24 16 32C16 28 14 22 10 22Z" fill="#935116" />
            <ellipse cx="30" cy="5" rx="8" ry="4" fill="#935116" />
            <circle cx="22" cy="30" r="2.8" fill="#222" />
            <path d="M19 28L17 26" stroke="#222" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="38" cy="30" r="2.8" fill="#222" />
            <path d="M41 28L43 26" stroke="#222" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M25 36C27 40 33 40 35 36" fill="none" stroke="#B83838" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : normId.includes('jovem') ? (
          <>
            <path d="M11 20L18 8L26 12L32 6L40 12L49 10L49 20C44 20 40 24 38 22C34 24 28 22 24 24C20 22 15 24 11 20Z" fill="#C2873E" />
            <circle cx="22" cy="31" r="2.8" fill="#222" />
            <circle cx="38" cy="31" r="2.8" fill="#222" />
            <path d="M26 38C29 40 35 39 37 36" fill="none" stroke="#8A4A0A" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : normId.includes('casual') ? (
          <>
            <path d="M12 18C12 10 20 8 30 8C40 8 48 10 48 18C48 24 46 25 42 22C38 24 32 23 30 23C26 23 20 24 18 22C14 25 12 24 12 18Z" fill="#4B2E1E" />
            <circle cx="22" cy="29" r="2.8" fill="#222" />
            <circle cx="38" cy="29" r="2.8" fill="#222" />
            <path d="M18 36C18 45 24 49 30 49C36 49 42 45 42 36C40 37 38 38 35 38C33 39 27 39 25 38C22 38 20 37 18 36Z" fill="#4B2E1E" />
            <path d="M26 35C28 37 32 37 34 35" fill="none" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
          </>
        ) : normId.includes('esportista') ? (
          <>
            <path d="M12 16C12 10 20 8 30 8C40 8 48 10 48 16C46 20 44 26 44 32C38 26 34 26 30 26C26 26 22 26 16 32C16 26 14 20 12 16Z" fill="#D35400" />
            <rect x="10" y="20" width="40" height="7" rx="1.5" fill="#E74C3C" />
            <line x1="28" y1="21" x2="32" y2="21" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="22" cy="33" r="2.8" fill="#222" />
            <circle cx="38" cy="33" r="2.8" fill="#222" />
            <path d="M26 39C28 42 32 42 34 39" fill="none" stroke="#8A4A0A" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : normId.includes('artistico') ? (
          <>
            <path d="M8 20C6 14 18 6 36 6C48 6 54 12 52 18C48 24 38 23 30 23C18 23 12 24 8 20Z" fill="#2C3E50" />
            <circle cx="36" cy="5" r="2.5" fill="#2C3E50" />
            <circle cx="22" cy="30" r="2.8" fill="#222" />
            <circle cx="38" cy="30" r="2.8" fill="#222" />
            <path d="M24 36C26 35 29 35 30 37C31 35 34 35 36 36C38 38 39 39 40 37" fill="none" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" />
            <circle cx="16" cy="38" r="2" fill="#3498DB" />
            <circle cx="43" cy="27" r="1.5" fill="#E67E22" />
          </>
        ) : normId.includes('cientista') ? (
          <>
            <path d="M10 20L6 14L14 12L12 6L22 9L26 4L34 7L40 4L42 10L50 8L46 16L52 20C48 20 44 26 42 22C38 25 32 23 30 23C26 23 20 25 18 22C14 26 12 20 10 20Z" fill="#BDC3C7" />
            <circle cx="22" cy="30" r="5.5" fill="#A9CCE3" stroke="#2C3E50" strokeWidth="2" />
            <circle cx="38" cy="30" r="5.5" fill="#A9CCE3" stroke="#2C3E50" strokeWidth="2" />
            <line x1="27.5" y1="30" x2="32.5" y2="30" stroke="#2C3E50" strokeWidth="2" />
            <circle cx="22" cy="30" r="1.8" fill="#1B2631" />
            <circle cx="38" cy="30" r="1.8" fill="#1B2631" />
            <path d="M26 39C28 42 32 42 34 39" fill="none" stroke="#8A4A0A" strokeWidth="1.8" strokeLinecap="round" />
          </>
        ) : normId.includes('executivo') ? (
          <>
            <path d="M12 18C12 10 20 8 30 8C40 8 48 10 48 18C48 22 46 22 42 18C38 18 34 20 30 20C24 20 18 16 12 18Z" fill="#1A1A1A" />
            <rect x="16" y="26" width="11" height="8" rx="2" stroke="#222" strokeWidth="1.5" fill="none" />
            <rect x="33" y="26" width="11" height="8" rx="2" stroke="#222" strokeWidth="1.5" fill="none" />
            <line x1="27" y1="30" x2="33" y2="30" stroke="#222" strokeWidth="1.5" />
            <circle cx="21" cy="30" r="1.8" fill="#222" />
            <circle cx="39" cy="30" r="1.8" fill="#222" />
            <path d="M26 38C28 40 32 40 34 38" fill="none" stroke="#8A4A0A" strokeWidth="1.8" strokeLinecap="round" />
          </>
        ) : normId.includes('aposentado') ? (
          <>
            <path d="M10 24C10 20 14 18 16 18C16 26 14 30 10 32Z" fill="#D5D8DC" />
            <path d="M50 24C50 20 46 18 44 18C44 26 46 30 50 32Z" fill="#D5D8DC" />
            <path d="M24 16C26 15 34 15 36 16" stroke="#C98B00" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M26 19C28 18 32 18 34 19" stroke="#C98B00" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="22" cy="27" r="2.4" fill="#222" />
            <circle cx="38" cy="27" r="2.4" fill="#222" />
            <path d="M20 36C24 33 28 35 30 37C32 35 36 33 40 36C38 39 34 40 30 39C26 40 22 39 20 36Z" fill="#EAEDED" stroke="#BDC3C7" strokeWidth="1" />
          </>
        ) : normId.includes('criativo') ? (
          <>
            <path d="M10 22C10 12 18 8 30 8C42 8 50 12 50 22C46 22 42 24 38 23C32 23 28 23 22 23C18 24 14 22 10 22Z" fill="#9B59B6" />
            <rect x="24" y="22" width="12" height="4" rx="2" fill="#8E44AD" />
            <circle cx="22" cy="31" r="2.8" fill="#222" />
            <path d="M35 31C37 29 41 29 42 32" stroke="#222" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M26 38C28 42 34 42 36 38" fill="none" stroke="#8A4A0A" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* Estudante */}
            <path d="M12 18C12 10 20 8 30 8C40 8 48 10 48 18C48 21 44 23 40 20C35 22 25 22 20 20C16 23 12 21 12 18Z" fill="#5A3825" />
            <circle cx="22" cy="30" r="2.8" fill="#222" />
            <circle cx="21" cy="29" r="0.9" fill="#FFF" />
            <circle cx="38" cy="30" r="2.8" fill="#222" />
            <circle cx="37" cy="29" r="0.9" fill="#FFF" />
            <path d="M25 36C27 40 33 40 35 36" fill="none" stroke="#8A4A0A" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {/* Óculos se solicitado */}
        {showGlasses && (
          <g opacity="0.85">
            <rect x="16" y="25" width="11" height="9" rx="2" stroke="#0077B6" strokeWidth="1.5" fill="#CDE5FF" fillOpacity="0.4" />
            <rect x="33" y="25" width="11" height="9" rx="2" stroke="#0077B6" strokeWidth="1.5" fill="#CDE5FF" fillOpacity="0.4" />
            <line x1="27" y1="29" x2="33" y2="29" stroke="#0077B6" strokeWidth="1.5" />
          </g>
        )}

        {/* Pescoço */}
        <rect x="22" y="51" width="16" height="5" fill="#E5A600" />
      </svg>
    </div>
  );
};
