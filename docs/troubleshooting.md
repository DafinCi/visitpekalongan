# Troubleshooting

This page covers common local and runtime problems. It does not replace the setup steps in [Getting started](getting-started.md).

## PowerShell blocks npm

Use `npm.cmd` instead of `npm`. The PowerShell execution policy can block `npm.ps1` even when npm is installed correctly.

```powershell
npm.cmd install
npm.cmd run dev
```

## Linting vendor or agent scripts

`eslint.config.mjs` defines `globalIgnores` for `.agents/**` and `public/**` (which contains the MapLibre GL worker bundle). Both `npm run lint` and `npm.cmd run lint` now run cleanly repository-wide across all source files.

If you add new vendor worker bundles to `public/` or agent helper scripts to `.agents/`, ensure they remain covered under `globalIgnores` in `eslint.config.mjs`.

## The map is blank

Check that the browser can reach:

```text
https://basemaps.cartocdn.com
```

The map is not bundled as an offline tile set. If the network request fails, the current UI does not provide a dedicated map error or retry state.

## Images do not load

The sample records use remote Unsplash image URLs. Check:

- the browser network panel;
- the `images.remotePatterns` entry in `next.config.ts`;
- whether the current network allows requests to `images.unsplash.com`.

## The report form says the recommendation was received

The form stores the submission in `vp_spot_submissions` in the current browser. It does not send the recommendation to a server.

Inspect the stored value in the browser developer tools:

```js
localStorage.getItem("vp_spot_submissions")
```

## Saved places disappear

Saved places use `vp_bookmarked_spots` in `localStorage`. Clearing site data, using a private window, or changing browsers removes access to the saved list. There is no account or cross-device sync.

## The open-now filter feels delayed

The browser calculates opening status after the client clock is available. Before that point, the feed shows a checking message. The calculation uses the `Asia/Jakarta` timezone.

## Related documents

- [Getting started](getting-started.md)
- [Testing](testing.md)
- [Data model](data-model.md)
