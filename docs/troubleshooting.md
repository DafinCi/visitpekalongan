# Troubleshooting

This page covers common local and runtime problems. It does not replace the setup steps in [Getting started](getting-started.md).

## PowerShell blocks npm

Use `npm.cmd` instead of `npm`. The PowerShell execution policy can block `npm.ps1` even when npm is installed correctly.

```powershell
npm.cmd install
npm.cmd run dev
```

## The lint command reports files outside src

`npm run lint` currently scans `.agents` and `public/maplibre-gl-worker.mjs` because the repository ignore list only covers generated build folders. Run the source-only check while this issue remains:

```powershell
node_modules\.bin\eslint.cmd src
```

The source-only check passed on 18 October 2026. The repository-wide command did not.

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
