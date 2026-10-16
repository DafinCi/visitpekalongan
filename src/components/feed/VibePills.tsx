import { SpotCategory } from "@/types/spot";
import { Clock } from "lucide-react";

interface VibePillsProps {
  categories: SpotCategory[];
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
  openNowOnly: boolean;
  onToggleOpenNow: (openNow: boolean) => void;
}

export function VibePills({
  categories,
  activeCategory,
  onSelectCategory,
  openNowOnly,
  onToggleOpenNow,
}: VibePillsProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max px-0.5">
        {/* Pil: Semua Kategori */}
        <button
          type="button"
          onClick={() => onSelectCategory("all")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-badge border transition-colors min-h-[44px] flex items-center focus-visible:outline-2 focus-visible:outline-border-focus ${
            activeCategory === "all"
              ? "bg-text-primary text-canvas border-text-primary"
              : "bg-surface text-text-muted hover:text-text-primary border-border hover:border-text-muted"
          }`}
        >
          <span>Semua Kategori</span>
        </button>

        {/* Pil Kategori Individual */}
        {categories.map((cat) => {
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-badge border transition-colors min-h-[44px] flex items-center focus-visible:outline-2 focus-visible:outline-border-focus ${
                isActive
                  ? "bg-text-primary text-canvas border-text-primary"
                  : "bg-surface text-text-muted hover:text-text-primary border-border hover:border-text-muted"
              }`}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}

        <div className="w-px h-6 bg-border mx-1" aria-hidden="true" />

        {/* Tombol Toggle Buka Sekarang */}
        <button
          type="button"
          onClick={() => onToggleOpenNow(!openNowOnly)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-badge border transition-colors min-h-[44px] flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-border-focus ${
            openNowOnly
              ? "bg-status-open-text text-white border-status-open-text"
              : "bg-surface text-text-muted hover:text-text-primary border-border"
          }`}
          aria-pressed={openNowOnly}
        >
          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Buka Sekarang</span>
        </button>
      </div>
    </div>
  );
}

