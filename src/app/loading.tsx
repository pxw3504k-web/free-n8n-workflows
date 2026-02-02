export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 pb-16 pt-24">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar skeleton */}
            <div className="w-full lg:w-64">
              <div className="h-8 bg-[#1a1a2e] rounded-lg animate-pulse mb-4" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 bg-[#1a1a2e] rounded-lg animate-pulse" />
                ))}
              </div>
            </div>

            {/* Content skeleton */}
            <div className="flex-1 min-w-0">
              <div className="mb-6 flex items-center justify-between">
                <div className="h-7 w-48 bg-[#1a1a2e] rounded animate-pulse" />
                <div className="h-5 w-32 bg-[#1a1a2e] rounded animate-pulse" />
              </div>

              {/* Grid skeleton */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-white/10 bg-[#1a1a2e] overflow-hidden animate-pulse"
                  >
                    <div className="aspect-video w-full bg-[#0a0a1e]" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-[#0a0a1e] rounded w-3/4" />
                      <div className="h-4 bg-[#0a0a1e] rounded w-full" />
                      <div className="h-4 bg-[#0a0a1e] rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

