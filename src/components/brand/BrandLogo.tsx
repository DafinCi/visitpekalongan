import { BRAND_LOGO_GEOMETRY } from "./logo-geometry";

export { BRAND_LOGO_GEOMETRY };

export interface BrandLogoProps {
  className?: string;
  size?: number;
  ariaLabel?: string;
  monochrome?: boolean;
}

/**
 * Logo Resmi VisitPekalongan: Gapura Heritage Pesisir
 * Mengadaptasi siluet lengkung arsitektur heritage Pekalongan dengan aksen wajik terakota.
 */
export function BrandLogo({
  className = "w-7 h-7",
  size,
  ariaLabel = "Logo VisitPekalongan",
  monochrome = false,
}: BrandLogoProps) {
  const strokeColor = monochrome
    ? "currentColor"
    : "var(--primitive-roast-700, #73472c)";
  const diamondColor = monochrome
    ? "currentColor"
    : "var(--primitive-terracotta-raw, #c86446)";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={BRAND_LOGO_GEOMETRY.viewBox}
      fill="none"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      {/* Lengkung Luar Berundak (Gapura Heritage) */}
      <path
        d={BRAND_LOGO_GEOMETRY.outerArch.d}
        stroke={strokeColor}
        strokeWidth={BRAND_LOGO_GEOMETRY.outerArch.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Lengkung Tengah */}
      <path
        d={BRAND_LOGO_GEOMETRY.middleArch.d}
        stroke={strokeColor}
        strokeWidth={BRAND_LOGO_GEOMETRY.middleArch.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Lengkung Dalam Berujung Lancip (Ogee Arch) */}
      <path
        d={BRAND_LOGO_GEOMETRY.innerArch.d}
        stroke={strokeColor}
        strokeWidth={BRAND_LOGO_GEOMETRY.innerArch.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Garis Pijakan Dasar Kiri & Kanan */}
      <line
        x1={BRAND_LOGO_GEOMETRY.leftBase.x2}
        y1={BRAND_LOGO_GEOMETRY.leftBase.y1}
        x2={BRAND_LOGO_GEOMETRY.leftBase.x1}
        y2={BRAND_LOGO_GEOMETRY.leftBase.y2}
        stroke={strokeColor}
        strokeWidth={BRAND_LOGO_GEOMETRY.leftBase.strokeWidth}
        strokeLinecap="round"
      />
      <line
        x1={BRAND_LOGO_GEOMETRY.rightBase.x1}
        y1={BRAND_LOGO_GEOMETRY.rightBase.y1}
        x2={BRAND_LOGO_GEOMETRY.rightBase.x2}
        y2={BRAND_LOGO_GEOMETRY.rightBase.y2}
        stroke={strokeColor}
        strokeWidth={BRAND_LOGO_GEOMETRY.rightBase.strokeWidth}
        strokeLinecap="round"
      />

      {/* Tiang Pancang Tengah */}
      <line
        x1={BRAND_LOGO_GEOMETRY.centerStem.x1}
        y1={BRAND_LOGO_GEOMETRY.centerStem.y2}
        x2={BRAND_LOGO_GEOMETRY.centerStem.x2}
        y2={BRAND_LOGO_GEOMETRY.centerStem.y1}
        stroke={strokeColor}
        strokeWidth={BRAND_LOGO_GEOMETRY.centerStem.strokeWidth}
        strokeLinecap="butt"
      />

      {/* Aksen Wajik Terakota Pusat */}
      <polygon
        points={BRAND_LOGO_GEOMETRY.diamond.points}
        fill={diamondColor}
      />
    </svg>
  );
}
