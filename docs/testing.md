# Testing

This page records the current validation commands and the checks performed on 18 October 2026.

## Commands

```bash
npm test
node_modules/.bin/tsc --noEmit --incremental false
node_modules/.bin/eslint src
```

On Windows PowerShell, use the `.cmd` launchers if the shell blocks npm scripts:

```powershell
npm.cmd test
node_modules\.bin\tsc.cmd --noEmit --incremental false
node_modules\.bin\eslint.cmd src
```

## Current results

| Check | Result | Notes |
| --- | --- | --- |
| `npm.cmd test` | Pass | 54 tests passed across 6 test suites, 0 failed. |
| TypeScript | Pass | `tsc --noEmit --incremental false` exited with code 0. |
| Source lint | Pass | `eslint src` exited with code 0. |
| Repository lint | Pass | `npm.cmd run lint` exited with code 0 (global ignores cover `.agents/**` and `public/**`). |
| Production build | Pass | `next build` compiled cleanly with Turbopack (67/67 static and dynamic pages generated). |

## Test coverage

The test suites run via `node --experimental-strip-types --test` and cover:

- **Opening-hours calculations** (`src/lib/utils/__tests__/opening-hours.test.ts`):
  - WIB (UTC+7) timezone conversion;
  - lifecycle status overrides (`temporarily_closed` and `permanently_closed`);
  - standard daytime business windows (before open, open, after close);
  - cross-midnight / sliding window logic for night spots (e.g. Kopi Tahlil);
  - Friday prayer break logic (`friday_break` kind on Friday 11:15–13:00 WIB);
  - user-facing status copy and Google Maps navigation intent URLs.
- **Smart search & recommendations** (`src/lib/utils/__tests__/smart-search.test.ts`):
  - exact name and signature dish matches;
  - intent token expansion (e.g. "nugas/wfc", "curug/alam");
  - Indonesian conversational stopword filtering;
  - fuzzy Levenshtein distance matching;
  - multi-factor spot recommendations (category, distance, shared facilities, price).
- **Geolocation calculations** (`src/lib/utils/__tests__/geolocation.test.ts`):
  - Great-Circle Haversine distance and symmetry;
  - user-friendly distance formatting (meters `< 1 km` with 50m floor, decimals, whole kilometers);
  - Pekalongan 60 km bounding buffer verification.
- **Formatters** (`src/lib/utils/__tests__/formatters.test.ts`):
  - price range formatting;
  - regency naming (Kota vs Kabupaten Pekalongan);
  - district name formatting and dictionary mapping.
- **Portal intro state machine** (`src/lib/intro/__tests__/portal-intro-machine.test.ts`):
  - lifecycle transitions and watchdog timer;
  - reduced-motion mode;
  - logo geometry constants.
- **Scroll lock** (`src/lib/utils/__tests__/scroll-lock.test.ts`):
  - nested lock counting and restoration of original document overflow values.

The repository does not contain automated tests for:

- catalog UI components and React rendering;
- MapLibre GL map interactions;
- client-side `localStorage` hooks.

## Lint configuration

`eslint.config.mjs` defines global ignores for build output as well as:

- `public/**` (vendor worker bundle `maplibre-gl-worker.mjs`);
- `.agents/**` (agent skill scripts).

Repository-wide `npm run lint` executes cleanly with zero errors and zero warnings.

## Related documents

- [Getting started](getting-started.md)
- [Architecture](architecture.md)
- [Data model](data-model.md)
