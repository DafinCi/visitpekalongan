import { RotateCcw, SearchX, Bookmark } from "lucide-react";

interface EmptyStateProps {
  hasOpenNowFilter: boolean;
  onDisableOpenNow: () => void;
  hasRegencyFilter: boolean;
  onResetRegency: () => void;
  hasSearchQuery: boolean;
  onClearSearch: () => void;
  hasSavedFilter?: boolean;
  onDisableSaved?: () => void;
  onResetAll: () => void;
}

export function EmptyState({
  hasOpenNowFilter,
  onDisableOpenNow,
  hasRegencyFilter,
  onResetRegency,
  hasSearchQuery,
  onClearSearch,
  hasSavedFilter = false,
  onDisableSaved,
  onResetAll,
}: EmptyStateProps) {
  return (
    <div className="w-full py-16 px-4 text-center bg-surface border border-dashed border-border rounded-card my-6">
      <div className="max-w-md mx-auto space-y-4">
        <div className="w-12 h-12 rounded-card bg-canvas border border-border mx-auto flex items-center justify-center text-text-muted">
          {hasSavedFilter ? (
            <Bookmark className="w-6 h-6 text-accent-terracotta" aria-hidden="true" />
          ) : (
            <SearchX className="w-6 h-6 text-accent-terracotta" aria-hidden="true" />
          )}
        </div>

        <div className="space-y-1.5">
          <h3 className="font-serif text-xl sm:text-2xl text-text-primary tracking-tight">
            {hasSavedFilter
              ? "Belum ada tempat di daftar tersimpan"
              : "Belum ada tempat yang cocok"}
          </h3>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {hasSavedFilter
              ? "Tekan ikon pita simpan (Bookmark) pada kartu tempat favorit Anda agar mudah diakses kembali kapan saja, termasuk saat sinyal lemah di perjalanan."
              : "Kombinasi filter yang Anda pilih menghasilkan daftar kosong. Coba longgarkan pencarian dengan salah satu saran di bawah ini:"}
          </p>
        </div>

        {/* Tombol Relaksasi Filter Bertahap */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {hasSavedFilter && onDisableSaved && (
            <button
              type="button"
              onClick={onDisableSaved}
              className="px-3 py-1.5 text-xs font-medium bg-surface-pure hover:bg-canvas border border-border rounded-button text-text-primary transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-border-focus cursor-pointer"
            >
              Tampilkan semua tempat kurasi
            </button>
          )}

          {hasOpenNowFilter && (
            <button
              type="button"
              onClick={onDisableOpenNow}
              className="px-3 py-1.5 text-xs font-medium bg-surface-pure hover:bg-canvas border border-border rounded-button text-text-primary transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-border-focus cursor-pointer"
            >
              Matikan filter buka sekarang
            </button>
          )}

          {hasRegencyFilter && (
            <button
              type="button"
              onClick={onResetRegency}
              className="px-3 py-1.5 text-xs font-medium bg-surface-pure hover:bg-canvas border border-border rounded-button text-text-primary transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-border-focus cursor-pointer"
            >
              Cari di semua wilayah
            </button>
          )}

          {hasSearchQuery && (
            <button
              type="button"
              onClick={onClearSearch}
              className="px-3 py-1.5 text-xs font-medium bg-surface-pure hover:bg-canvas border border-border rounded-button text-text-primary transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-border-focus cursor-pointer"
            >
              Hapus kata kunci pencarian
            </button>
          )}

          <button
            type="button"
            onClick={onResetAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-text-primary text-canvas hover:bg-accent-terracotta rounded-button transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-border-focus cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset seluruh filter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
