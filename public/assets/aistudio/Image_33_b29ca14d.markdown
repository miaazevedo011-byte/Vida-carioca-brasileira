---
name: Tropic Modernism Game UI
colors:
  surface: '#fbf9f3'
  surface-dim: '#dcdad4'
  surface-bright: '#fbf9f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ed'
  surface-container: '#f0eee8'
  surface-container-high: '#eae8e2'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c18'
  on-surface-variant: '#3e4940'
  inverse-surface: '#30312d'
  inverse-on-surface: '#f3f1eb'
  outline: '#6e7a70'
  outline-variant: '#becabe'
  surface-tint: '#006d3c'
  primary: '#006437'
  on-primary: '#ffffff'
  primary-container: '#087f48'
  on-primary-container: '#cbffd7'
  inverse-primary: '#77db9a'
  secondary: '#7b5800'
  on-secondary: '#ffffff'
  secondary-container: '#fdbb14'
  on-secondary-container: '#6c4d00'
  tertiary: '#0055a7'
  on-tertiary: '#ffffff'
  tertiary-container: '#1e6ecb'
  on-tertiary-container: '#eff2ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#93f7b4'
  primary-fixed-dim: '#77db9a'
  on-primary-fixed: '#00210e'
  on-primary-fixed-variant: '#00522c'
  secondary-fixed: '#ffdea4'
  secondary-fixed-dim: '#fdbb14'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4200'
  tertiary-fixed: '#d6e3ff'
  tertiary-fixed-dim: '#a9c7ff'
  on-tertiary-fixed: '#001b3d'
  on-tertiary-fixed-variant: '#00468b'
  background: '#fbf9f3'
  on-background: '#1b1c18'
  surface-variant: '#e4e2dd'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
  label-stat:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 16px
  numeric-stat:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '800'
    lineHeight: 24px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

The design system powers an immersive, mobile-first Brazilian life simulation text-and-stats experience. It reflects contemporary Brazilian life: resourceful, vibrant, humor-tinged, and warm, avoiding clichéd tourist visuals in favor of a polished, high-contrast digital craft.

### Persona & Tone
- **Vibrant yet Grounded:** Rooted in everyday Brazilian realities (bureaucracy, entrepreneurship, family ties, financial juggling) balanced by humor and ambition.
- **Punchy & Legible:** Interfaces are tactile and responsive. Micro-interactions mimic arcade satisfaction inside a sleek, modern fintech-grade layout.
- **Cultural Verve:** Emphasizes iconic social milestones and realities—from *Nome Limpo* badges to federal exams (*vestibular/concurso*), beach downtime, and career hustles.

### Visual Style
- **Modern Tropical Card-Stack:** Clean, tactile card layers suspended over a sunlit sand neutral.
- High-chroma accents (palm green, canarinho gold, atlantic azure, terracotta clay) embedded inside crisp, dark-mode-ready containers.
- Smooth radii, clean micro-borders, and tactile progress bars calibrated for dense statistical scans without visual fatigue.

## Colors

The palette balances athletic Brazilian national vibrancy with modern fintech product clarity.

### Functional Roles
- **Primary (`#087F48` - Verde Palmeira):** Core action buttons, positive metric shifts, high-status badges (e.g., *Nome Limpo*, high wellness, approval rates).
- **Secondary (`#F4B300` - Canarinho Gold):** Energy stats, attention highlights, coin/currency balances, critical choice callouts.
- **Tertiary (`#0B66C3` - Azul Atlântico):** Intellect, formal career/education milestones, legal & civic actions, secondary interactive chips.
- **Accent Terracotta (`#D9532F` - Terra Cozida):** Stress indicators, negative cash flow alerts, debt status (*Nome Sujo*), immediate physical risk.
- **Neutral Canvas (`#F6F4EE` - Areia Clara):** Soft, non-glare daytime canvas that highlights foreground cards.
- **Surface Elevation Cards (`#FFFFFF`):** High-contrast base for game events and card decks.
- **Typography Inks:**
  - Primary Content: `#141E18` (deep tropical blackened-green).
  - Muted Copy / Timestamps: `#566359`.
  - Border Strokes: `#E3E0D5`.

## Typography

The type system blends the energetic curves of **Plus Jakarta Sans** with the structural legibility of **Inter**.

- **Plus Jakarta Sans (Headings, Stats, Micro-badges):** Friendly, rounded terminals that preserve playfulness while rendering numbers and titles crisply.
- **Inter (Narrative Text, Event Dilemmas, Explanations):** Ensures rapid reading of decision dilemmas and multi-sentence outcomes during rapid tap cycles.
- **Hierarchical Balance:** Numbers and stat deltas (+10% Felicidade, -R$ 450) always prioritize heavy weights (`700`/`800`) to provide instant feedback loops.

## Layout & Spacing

A mobile-centric portrait orientation layout.

### Grid & Form Factors
- **Mobile (Base, 360px - 480px):** Single-column fixed flow with `1rem` outer canvas padding. Action bars are docked to the thumb-zone at the bottom.
- **Tablet & Desktop Shell (481px+):** Centers mobile interface inside an ergonomic 460px mobile device wrapper, flanked by atmospheric game status summaries or ambient Brazilian cityscapes.

### Spacing Rhythm
- **8pt Base Cadence:** Structural elements rely on multiples of `0.5rem` (`8px`).
- **Dense Stack Optimization:** Core life attributes (Saúde, Felicidade, Grana, Intelecto) occupy compact horizontal ribbons with `space-xs` padding between tracks to keep the main narrative card front and center.

## Elevation & Depth

Visual hierarchy combines warm ambient diffuse shadows with physical tactile separation.

### Surface Tiers
- **Tier 0 (Background Canvas):** Solid Areia Clara (`#F6F4EE`). Zero shadow.
- **Tier 1 (Base Life Cards & Attribute Shelves):** Solid Pure White (`#FFFFFF`), border `1px solid #E4E1D7`, soft ambient ground shadow (`0px 4px 12px rgba(20, 30, 24, 0.04)`).
- **Tier 2 (Interactive Event Dialogues & Dilemmas):** Raised focal cards featuring `0px 10px 24px rgba(20, 30, 24, 0.08)`.
- **Tier 3 (Floating HUD / Decision Sheets):** Fixed bottom sheets and toasts with `0px -8px 28px rgba(20, 30, 24, 0.12)`.

### Tactile Edge Detail
Instead of stark black borders, components use tone-on-tone hairline borders (`#E4E1D7`) paired with inset micro-highlights (`box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8)`) to give buttons and modules a subtle 3D pop.

## Shapes

The system relies on a consistent level 2 roundedness profile (`0.5rem` / `8px` base, scaling to `1rem` / `16px` for primary interactive surfaces).

- **Cards & Event Panels:** `1rem` (`rounded-lg`) corner radius for an inviting pocket-sized aesthetic.
- **Life Attribute Progress Bars & Badges:** Full circular caps (`9999px`) for a friendly arcade feel.
- **Interactive Buttons:** `0.75rem` to `1rem` radii with matching active state scale transforms (`scale(0.98)`).

## Components

### 1. Attribute Progress Bars (Status Vitais)
- **Container:** Track height `10px`, background `#ECE9DF`, radius `9999px`, inset shadow for depth.
- **Fill Strips:** Solid high-energy fills with smooth CSS transitions (`cubic-bezier(0.34, 1.56, 0.64, 1)`):
  - **Saúde (Health):** `#087F48` (Verde)
  - **Felicidade (Happiness):** `#F4B300` (Amarelo)
  - **Grana (Wealth):** `#0B66C3` (Azul)
  - **Aparência / Energia (Energy):** `#D9532F` (Terracotta)
- **Header:** Accompanied by mini icons and numeric trackers (e.g., `85%`) styled in `label-stat`.

### 2. Badges & Game Statuses
- **Nome Limpo / Serasa Score Badge:** Capsule badge, border-radius `9999px`, padding `4px 10px`. 
  - *Positive:* Tinted `#E6F5ED` with `#087F48` text and a green seal icon.
  - *Negativado / Nome Sujo:* Tinted `#FCEBE6` with `#D9532F` text and an alert icon.
- **Class / Career Tag:** `label-caps`, uppercase letter-spaced font with soft tint background.

### 3. Action Buttons & Choices
- **Primary ("Avançar Ano / Próximo Mês"):** Solid `#087F48`, text `#FFFFFF`, height `52px`, `title-sm`, subtle bottom border offset (`box-shadow: 0 4px 0 #055932`) for physical click depression.
- **Dilemma Choice Buttons:** Full-width white surface card, border `1.5px solid #E4E1D7`, text `#141E18`, with contextual mini stat preview indicators (e.g., `+ R$ 200`, `-15 Felicidade`). Hover/Focus shifts border to `#087F48` or `#0B66C3`.

### 4. Story & Event Cards
- Elevated card (`rounded-lg`), padded with `space-md` or `space-lg`.
- Top header carries year/age context (e.g., *Idade: 19 anos • São Paulo, SP*).
- Center showcases dynamic character portrait or scenario illustration placeholder.
- Narrative copy set in `body-lg` with `1.5` line height for comfortable storytelling.

### 5. Input Fields & Form Controls
- For character creation, custom salary bids, or lottery inputs.
- Clean white inputs with `1.5px` border in `#E3E0D5`.
- Focus ring highlights in Azul Atlântico (`#0B66C3`) with a soft translucent glow (`0 0 0 3px rgba(11, 102, 195, 0.15)`).