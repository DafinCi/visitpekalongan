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
| `npm.cmd test` | Pass | 12 tests passed, 0 failed. |
| TypeScript | Pass | `tsc --noEmit --incremental false` exited with code 0. |
| Source lint | Pass | `eslint src` exited with code 0. |
| Repository lint | Fails | `npm.cmd run lint` scans `.agents` and `public/maplibre-gl-worker.mjs` and reports errors outside `src`. |
| Production build | Not run in this pass | The documentation task did not write build artifacts. |

## Test coverage

The test script covers:

- the portal intro state machine;
- intro completion and watchdog behavior;
- reduced-motion behavior;
- scroll-lock counting and restoration;
- the logo geometry constants.

The repository does not contain automated tests for:

- opening-hours calculations;
- smart search;
- repository filtering;
- catalog state;
- MapLibre rendering;
- localStorage hooks.

## Manual check

The `calculateOpenStatus` utility was checked manually on 18 October 2026 with:

- a Monday evening shift that closes after midnight;
- a Wednesday early-morning access during the previous shift;
- the exact close time;
- a Friday schedule with a prayer break.

The function returned open, open, closed, and Friday-break states in the expected cases. These checks were not added to the test suite.

## Known lint issue

`eslint.config.mjs` defines global ignores for build output but not for:

- `.agents/**`;
- `public/maplibre-gl-worker.mjs`.

As a result, `npm run lint` examines skill scripts and a generated worker file. Use `eslint src` while the configuration remains unchanged.

## Before changing behavior

Add focused tests for any changed opening-hours, search, filter, or repository behavior. The current tests do not protect those paths.

## Related documents

- [Getting started](getting-started.md)
- [Architecture](architecture.md)
- [Data model](data-model.md)
