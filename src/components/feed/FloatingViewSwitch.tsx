import { LayoutGrid, Map } from "lucide-react";

interface FloatingViewSwitchProps {
  currentView: "list" | "map";
  onViewChange: (view: "list" | "map") => void;
}

export function FloatingViewSwitch({
  currentView,
  onViewChange,
}: FloatingViewSwitchProps) {
  return (
    <aside
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30"
      aria-label="Peralihan Tampilan"
    >
      <div className="flex items-center p-1 bg-surface-pure/95 backdrop-blur-md border border-border shadow-md rounded-button transition-all">
        <button
          type="button"
          onClick={() => onViewChange("list")}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-badge transition-all min-h-[44px] focus-visible:outline-2 focus-visible:outline-border-focus ${
            currentView === "list"
              ? "bg-text-primary text-canvas shadow-xs"
              : "text-text-muted hover:text-text-primary"
          }`}
          aria-pressed={currentView === "list"}
        >
          <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Daftar</span>
        </button>

        <button
          type="button"
          onClick={() => onViewChange("map")}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-badge transition-all min-h-[44px] focus-visible:outline-2 focus-visible:outline-border-focus ${
            currentView === "map"
              ? "bg-text-primary text-canvas shadow-xs"
              : "text-text-muted hover:text-text-primary"
          }`}
          aria-pressed={currentView === "map"}
        >
          <Map className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Peta</span>
        </button>
      </div>
    </aside>
  );
}

