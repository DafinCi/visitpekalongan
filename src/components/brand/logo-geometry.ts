export const BRAND_LOGO_GEOMETRY = {
  viewBox: "0 0 48 48",
  outerArch: {
    d: "M 8.5 43 L 8.5 19.5 L 10.6 18.6 L 10.6 15.6 L 12.6 14.8 C 13.4 9.6 22.2 8.4 24 4.5 C 25.8 8.4 34.6 9.6 35.4 14.8 L 37.4 15.6 L 37.4 18.6 L 39.5 19.5 L 39.5 43",
    strokeWidth: 2.3,
  },
  middleArch: {
    d: "M 12.8 43 L 12.8 21.5 C 12.8 14.8 17.8 10.5 24 10.5 C 30.2 10.5 35.2 14.8 35.2 21.5 L 35.2 43",
    strokeWidth: 2.2,
  },
  innerArch: {
    d: "M 16.8 43 L 16.8 23.5 C 16.8 18.5 22.3 17.2 24 15.2 C 25.7 17.2 31.2 18.5 31.2 23.5 L 31.2 43",
    strokeWidth: 2.2,
  },
  leftBase: {
    x1: 19.2,
    y1: 43,
    x2: 6,
    y2: 43,
    strokeWidth: 2.4,
  },
  rightBase: {
    x1: 28.8,
    y1: 43,
    x2: 42,
    y2: 43,
    strokeWidth: 2.4,
  },
  centerStem: {
    x1: 24,
    y1: 31.2,
    x2: 24,
    y2: 43,
    strokeWidth: 2.3,
  },
  diamond: {
    points: "24,20.5 28,25 24,29.5 20,25",
    centerX: 24,
    centerY: 25,
  },
  /**
   * Separate portal doorway silhouette used exclusively by the intro reveal mask
   * so the canonical logo strokes above never stretch or morph.
   */
  portalCutoutPath:
    "M 43 58 L 43 44 C 43 39 48.2 37.8 50 36 C 51.8 37.8 57 39 57 44 L 57 58 Z",
} as const;

