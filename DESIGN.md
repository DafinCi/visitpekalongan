# VisitPekalongan Design System

This document describes the visual system in the current implementation. It covers tokens, typography, component patterns, and accessibility rules. Product behavior is documented in [Current features](docs/FEATURES.md).

## 1. Identity

The visual direction is warm, tactile, and editorial. It draws on raw mori cloth, clay, terracotta, and the geometry of local craft. The interface uses a light canvas, dark charcoal text, restrained terracotta accents, and thin borders.

The goal is a curated local guide with a recognizable character. The current palette and type choices are part of the interface, not decoration added to a generic template.

## 2. Token architecture

Tokens have three layers:

1. Primitive values such as hex colors and radius sizes.
2. Semantic roles such as canvas, surface, text, border, and status.
3. Component conventions such as cards, buttons, badges, and the map preview.

The source of truth is `src/app/globals.css`.

## 3. Primitive tokens

```css
:root {
  --primitive-mori-50: #fcfaf7;
  --primitive-mori-100: #f7f5f0;
  --primitive-clay-50: #faf8f5;
  --primitive-clay-100: #f2efeb;
  --primitive-grout-200: #e8e3da;
  --primitive-grout-300: #ddd6ca;
  --primitive-grout-400: #c5beb2;

  --primitive-charcoal-900: #242220;
  --primitive-driftwood-600: #6e6963;
  --primitive-driftwood-400: #9b948c;

  --primitive-terracotta-600: #a8472b;
  --primitive-terracotta-raw: #c86446;
  --primitive-terracotta-subtle: #f5eae6;
  --primitive-sage-700: #48584a;
  --primitive-sage-600: #5a6b5c;
  --primitive-sage-subtle: #ecf0ec;
  --primitive-roast-700: #73472c;
  --primitive-roast-600: #8c5a3c;

  --primitive-moss-700: #3e6d4b;
  --primitive-moss-subtle: #ebf2ed;
  --primitive-brick-700: #9e5345;
  --primitive-brick-subtle: #f7ece9;

  --primitive-radius-xs: 2px;
  --primitive-radius-sm: 4px;
  --primitive-radius-md: 6px;
  --primitive-radius-lg: 8px;
  --primitive-radius-xl: 12px;
}
```

## 4. Semantic tokens

```css
@theme {
  --color-canvas: var(--primitive-mori-100);
  --color-surface: var(--primitive-clay-50);
  --color-surface-elevated: var(--primitive-mori-50);
  --color-surface-pure: #ffffff;

  --color-border: var(--primitive-grout-300);
  --color-border-subtle: var(--primitive-grout-200);
  --color-border-focus: var(--primitive-terracotta-600);

  --color-charcoal: var(--primitive-charcoal-900);
  --color-text-primary: var(--primitive-charcoal-900);
  --color-text-muted: var(--primitive-driftwood-600);
  --color-text-subtle: var(--primitive-driftwood-400);

  --color-accent-terracotta: var(--primitive-terracotta-600);
  --color-accent-terracotta-raw: var(--primitive-terracotta-raw);
  --color-accent-sage: var(--primitive-sage-600);
  --color-accent-roast: var(--primitive-roast-600);

  --color-status-open-text: var(--primitive-moss-700);
  --color-status-open-bg: var(--primitive-moss-subtle);
  --color-status-closed-text: var(--primitive-brick-700);
  --color-status-closed-bg: var(--primitive-brick-subtle);

  --radius-card: 8px;
  --radius-button: 6px;
  --radius-badge: 4px;
  --radius-drawer: 12px;
}
```

## 5. Typography

| Role | Family | Use |
| --- | --- | --- |
| Display and editorial headings | Instrument Serif | Page titles, place names, and story headings |
| Interface and body text | Plus Jakarta Sans | Search, labels, schedules, cards, and actions |

The root layout loads both families through `next/font/google` and exposes them as `--font-instrument-serif` and `--font-plus-jakarta-sans`.

The current type scale:

| Level | Size | Use |
| --- | --- | --- |
| Display | 36px to 48px | Home and editorial headings |
| Heading 1 | 28px | Place detail title |
| Heading 2 | 20px | Card and section titles |
| Subhead | 14px | Supporting labels |
| Body UI | 13px | Descriptions and metadata |
| Caption | 11px | Badges and compact status labels |

The code uses responsive utility classes rather than a single fixed size for every heading.

## 6. Component patterns

### Catalog cards

Catalog cards use:

- `bg-surface`;
- `border-border`;
- `rounded-card`;
- `shadow-xs` at rest and `shadow-sm` on hover;
- a 4:3 image area;
- a terracotta hover border on the title and card edge.

The grid card shows the image, status badge, category, name, signature dish, district, price range, route action, and bookmark action.

### List cards

List cards use a compact horizontal layout with a square thumbnail. Mobile keeps the route and bookmark actions in a narrow side rail. Desktop adds route, share, and bookmark actions.

### Buttons and controls

Buttons use `rounded-button` and a minimum target height of 44px. Primary actions use the terracotta token with canvas text. Secondary actions use the surface color, a thin border, and primary text.

Icon-only controls keep at least a 44px touch area. The filter trigger and view selector use the same utility-button language.

### Badges

Badges use `rounded-badge` rather than a pill shape. Status badges use the open or closed token pair. Category labels use muted text with a terracotta accent where hierarchy needs it.

### Map preview

The current map preview is a card over the map, not a bottom drawer. It uses:

- `bg-canvas`;
- `border-border`;
- `rounded-card`;
- `shadow-lg`;
- a compact image;
- status, price, region, and optional distance;
- route and detail actions.

The `--radius-drawer` token is reserved but not used by the current preview.

### Focus and motion

Interactive elements use `focus-visible:outline-2` with `outline-border-focus`. Motion is limited to short fades, slides, scale changes, and the intro reveal. The intro overlay respects `prefers-reduced-motion`.

## 7. Accessibility

The current system follows these rules:

- normal text should meet WCAG AA contrast against its background;
- interactive controls should have a visible focus indicator;
- touch targets should be at least 44px;
- status should not rely on color alone;
- the intro overlay releases scroll and inert state when it completes;
- the map markers are keyboard reachable through their rendered button elements.

Measured contrast against the canvas `#f7f5f0`:

| Pair | Ratio |
| --- | --- |
| Primary text `#242220` | 14.55:1 |
| Muted text `#6e6963` | 4.99:1 |
| Terracotta `#a8472b` | 5.35:1 |
| Open status `#3e6d4b` | 5.52:1 |
| Closed status `#9e5345` | 5.10:1 |

## 8. Current scope notes

- The interface has a light theme. It does not ship a theme toggle.
- The footer component exists but no current page imports it.
- The `VibePills` component exists but no current route uses it.
- The design system describes visual rules. It does not make an unused component part of the product.

## Related documents

- [Current features](docs/FEATURES.md)
- [Architecture](docs/architecture.md)
- [Routes and SEO](docs/routes-and-seo.md)
