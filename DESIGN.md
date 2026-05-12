---
name: Aurelian Reserve
colors:
  surface: '#f9f9f8'
  surface-dim: '#dadad9'
  surface-bright: '#f9f9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f3'
  surface-container: '#eeeeed'
  surface-container-high: '#e8e8e7'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#45474a'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1f0'
  outline: '#76777b'
  outline-variant: '#c6c6ca'
  surface-tint: '#5d5e62'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1a1c1f'
  on-primary-container: '#838487'
  inverse-primary: '#c6c6ca'
  secondary: '#755a26'
  on-secondary: '#ffffff'
  secondary-container: '#fdd897'
  on-secondary-container: '#785d28'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cba72f'
  on-tertiary-container: '#4e3d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e6'
  primary-fixed-dim: '#c6c6ca'
  on-primary-fixed: '#1a1c1f'
  on-primary-fixed-variant: '#45474a'
  secondary-fixed: '#ffdea7'
  secondary-fixed-dim: '#e5c283'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5b4310'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#f9f9f8'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  h1:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Noto Serif
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.01em
  h3:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
  data-point:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin: 40px
---

## Brand & Style

The design system is engineered to evoke the exclusivity of a high-end architectural firm and the precision of a private wealth management tool. It targets high-stakes real estate professionals who require a platform that mirrors the quality of the multi-million dollar assets they manage.

The aesthetic follows a **Minimalist-Executive** style. It prioritizes clarity and spatial harmony, utilizing generous whitespace to prevent information density from becoming overwhelming. The interface feels "architectural"—stable, structured, and permanent. Every interaction should feel intentional, moving away from "bouncy" consumer-grade animations toward smooth, dampened transitions that convey gravitas and reliability.

## Colors

This design system utilizes a palette rooted in prestige and stability. 

- **Deep Charcoal (#121417):** Used for primary text and high-contrast surfaces to provide a grounded, authoritative feel.
- **Antique Gold (#B39359):** A muted metallic used for primary actions, success states, and subtle accents. It is never used in excess, ensuring it remains a mark of quality.
- **Lustrous Bronze (#D4AF37):** Reserved for data highlights, focus states, and decorative borders.
- **Crisp Off-White (#F9F9F8):** The foundational canvas color, providing a softer, more premium experience than pure white.
- **Gilded Grey (#E5E5E0):** A secondary neutral for borders and inactive states, maintaining a warm, cohesive temperature across the UI.

## Typography

The typographic hierarchy balances editorial elegance with functional clarity. **Noto Serif** is used for headlines to establish a sense of history and "old money" prestige. For the functional UI and data-heavy segments, **Manrope** provides a balanced, highly legible sans-serif that remains neutral and professional.

Special attention is paid to the **Label-Caps** style, which is used for small headers and metadata to provide an organized, catalog-like feel. Numerical data should always utilize the tabular figures of Manrope to ensure vertical alignment in property lead tables.

Per i paragrafi estesi o i contenuti testuali nei landing builder, è raccomandato l'uso della classe `.text-hyphenated` (aggiunta in global CSS) che applica la sillabazione automatica, `text-align: justify` e `word-wrap: break-word` per mantenere un aspetto tipografico solido e ordinato simile alle pubblicazioni editoriali stampate.

## Layout & Spacing

This design system employs a **Fixed Grid** philosophy on desktop to maintain a composed, centered appearance, transitioning to a flexible container model on tablet. The rhythm is based on an 8px square grid, but with an emphasis on "Negative Space as Luxury"—using wider margins (48px+) to separate distinct content blocks.

Layouts should favor symmetry. Complex data views are organized into modular panes with significant internal padding (24px - 32px) to ensure that even high-density property information feels breathable.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layering** and **Ambient Shadows**. Surfaces do not "float" aggressively; instead, they appear slightly raised from the base off-white canvas.

Shadows are exceptionally soft, using a Deep Charcoal tint with very low opacity (3-5%). Borders are the primary method of separation, utilizing 1px solid lines in Gilded Grey (#E5E5E0). For interactive elements, a subtle "inner glow" or a 2px Antique Gold bottom-border is used to indicate focus, rather than heavy drop shadows. This maintains a flat, modern architectural aesthetic.

## Shapes

The shape language is **Soft (0.25rem)**. This slight rounding takes the edge off the "brutalist" sharp corners, making the software feel approachable while maintaining a crisp, professional structure. 

Large containers like property cards or lead dashboards use the `rounded-lg` (0.5rem) setting to create a distinct frame. Buttons and input fields strictly follow the base 4px (0.25rem) radius to ensure they feel like integrated parts of the grid rather than separate "bubbles."

## Components

### Buttons & Controls
Primary buttons use the Deep Charcoal background with Off-White text. Secondary buttons utilize a refined Antique Gold border with a transparent background. Hover states should be subtle—a slight shift in background luminance rather than a color change.

### Data Cards
Property cards are the centerpiece. They feature a 1px border and an "Image-First" layout. Text overlays on images must use a sophisticated gradient scrim to maintain legibility for Noto Serif headlines.

### Inputs & Fields
Inputs use a "floating label" style with a 1px bottom border that transitions to a 2px Antique Gold border on focus. This mimics high-end stationary or architectural drafts.

### Lead Chips
Lead status indicators (e.g., "Qualified," "Closing") use desaturated versions of the brand palette—never "neon" colors. For example, a "Success" state is a muted Sage or the brand Gold, never a bright green.

### Premium Additions
- **Property Timeline:** A vertical, minimalist thread showing lead interactions.
- **Metric Tiles:** Large-format Noto Serif numbers for "Portfolio Value" or "Conversion Rate," paired with small Manrope labels.
- **Asset Drawers:** Side-panels that slide in with a high-motion blur background to focus the user on specific unit details without losing context.