export function DetailSkeleton() {
  return (
    <main className="flex-1 pb-16 animate-pulse">
      {/* Hero Image Skeleton */}
      <div className="w-full h-[360px] sm:h-[440px] md:h-[500px] bg-border-subtle" />

      {/* Konten Detail Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-10">
        <div className="bg-canvas border border-border rounded-card p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Badge & Title */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="h-6 w-28 bg-border-subtle rounded-button" />
              <div className="h-6 w-20 bg-border-subtle rounded-button" />
            </div>
            <div className="h-9 sm:h-11 w-3/4 bg-border-subtle rounded-sm" />
            <div className="h-4 w-1/2 bg-border-subtle rounded-sm" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2 border-t border-border/60">
            <div className="h-11 flex-1 bg-border-subtle rounded-button" />
            <div className="h-11 w-32 bg-border-subtle rounded-button" />
          </div>

          {/* Story Narrative Skeleton */}
          <div className="space-y-3 pt-4 border-t border-border/60">
            <div className="h-5 w-40 bg-border-subtle rounded-sm" />
            <div className="h-4 w-full bg-border-subtle rounded-sm" />
            <div className="h-4 w-5/6 bg-border-subtle rounded-sm" />
            <div className="h-4 w-4/6 bg-border-subtle rounded-sm" />
          </div>

          {/* Schedule & Facilities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/60">
            <div className="h-40 bg-border-subtle rounded-button" />
            <div className="h-40 bg-border-subtle rounded-button" />
          </div>
        </div>
      </div>
    </main>
  );
}

