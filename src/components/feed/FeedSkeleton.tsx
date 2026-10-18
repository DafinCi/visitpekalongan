export function FeedSkeleton() {
  return (
    <div className="min-h-screen md:h-full flex flex-col w-full md:overflow-hidden">
      {/* Skeleton Header Sticky */}
      <div className="sticky top-0 md:flex-none z-40 w-full bg-canvas/95 backdrop-blur-sm border-b border-border h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 lg:px-8 gap-2 sm:gap-4">
        <div className="font-serif text-lg sm:text-2xl text-text-primary shrink-0">
          VisitPekalongan
        </div>
        <div className="flex-1 max-w-sm sm:max-w-md mx-1 sm:mx-3 h-11 sm:h-10 bg-surface-pure border border-border rounded-button animate-pulse" />
        <div className="w-10 sm:w-28 h-11 bg-surface border border-border rounded-button animate-pulse shrink-0" />
      </div>

      <div className="app-scroll-container flex-1 md:overflow-y-auto md:overflow-x-hidden md:min-h-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-surface border border-border rounded-card overflow-hidden animate-pulse flex flex-col"
              >
                <div className="aspect-4/3 w-full bg-border-subtle" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-1/3 bg-border-subtle rounded-sm" />
                  <div className="h-6 w-3/4 bg-border-subtle rounded-sm" />
                  <div className="h-4 w-1/2 bg-border-subtle rounded-sm" />
                  <div className="pt-3 border-t border-border-subtle flex justify-between">
                    <div className="h-8 w-20 bg-border-subtle rounded-sm" />
                    <div className="h-8 w-16 bg-border-subtle rounded-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
