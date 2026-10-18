interface BrandLogoProps {
  className?: string;
  size?: number;
  ariaLabel?: string;
}

/**
 * Logo Resmi VisitPekalongan: "The Heritage Compass"
 * Menggabungkan kompas penjelajahan dengan struktur geometris Batik Jlamprang khas Pekalongan.
 */
export function BrandLogo({
  className = "w-7 h-7 text-accent-terracotta",
  size,
  ariaLabel = "Logo VisitPekalongan",
}: BrandLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      {/* Lingkaran Luar Berbingkai Cap Tembaga Heritage */}
      <circle cx="24" cy="24" r="21.5" stroke="currentColor" strokeWidth="1.5" />
      <circle
        cx="24"
        cy="24"
        r="18.5"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeDasharray="1 2.5"
        opacity="0.6"
      />

      {/* 4 Arah Mata Angin Utama (Kardinal) dengan Facet Dua Nada */}
      {/* Utara (0 Derajat) */}
      <g transform="rotate(0 24 24)">
        <polygon points="24,3.5 24,20 21.2,20" fill="currentColor" />
        <polygon points="24,3.5 26.8,20 24,20" fill="currentColor" opacity="0.45" />
      </g>

      {/* Timur (90 Derajat) */}
      <g transform="rotate(90 24 24)">
        <polygon points="24,3.5 24,20 21.2,20" fill="currentColor" />
        <polygon points="24,3.5 26.8,20 24,20" fill="currentColor" opacity="0.45" />
      </g>

      {/* Selatan (180 Derajat) */}
      <g transform="rotate(180 24 24)">
        <polygon points="24,3.5 24,20 21.2,20" fill="currentColor" />
        <polygon points="24,3.5 26.8,20 24,20" fill="currentColor" opacity="0.45" />
      </g>

      {/* Barat (270 Derajat) */}
      <g transform="rotate(270 24 24)">
        <polygon points="24,3.5 24,20 21.2,20" fill="currentColor" />
        <polygon points="24,3.5 26.8,20 24,20" fill="currentColor" opacity="0.45" />
      </g>

      {/* 4 Arah Mata Angin Menengah (Diagonal Geometris Motif Jlamprang) */}
      {/* Timur Laut (45 Derajat) */}
      <g transform="rotate(45 24 24)">
        <polygon points="24,9.5 24,20.5 22,20.5" fill="currentColor" />
        <polygon points="24,9.5 26,20.5 24,20.5" fill="currentColor" opacity="0.45" />
      </g>

      {/* Tenggara (135 Derajat) */}
      <g transform="rotate(135 24 24)">
        <polygon points="24,9.5 24,20.5 22,20.5" fill="currentColor" />
        <polygon points="24,9.5 26,20.5 24,20.5" fill="currentColor" opacity="0.45" />
      </g>

      {/* Barat Daya (225 Derajat) */}
      <g transform="rotate(225 24 24)">
        <polygon points="24,9.5 24,20.5 22,20.5" fill="currentColor" />
        <polygon points="24,9.5 26,20.5 24,20.5" fill="currentColor" opacity="0.45" />
      </g>

      {/* Barat Laut (315 Derajat) */}
      <g transform="rotate(315 24 24)">
        <polygon points="24,9.5 24,20.5 22,20.5" fill="currentColor" />
        <polygon points="24,9.5 26,20.5 24,20.5" fill="currentColor" opacity="0.45" />
      </g>

      {/* Inti Cakra Pusat (Pusat Penjelajahan) */}
      <circle cx="24" cy="24" r="5" fill="#FBF9F5" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="24" cy="24" r="2.2" fill="currentColor" />
    </svg>
  );
}

