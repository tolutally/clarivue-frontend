export function ReportsPageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--surface-hover)]">
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-2">
            <div className="h-9 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-5 w-96 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        <div className="px-6">
          <div className="flex gap-1 border-b border-gray-200">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-40 bg-gray-200 rounded-t animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-64 bg-gray-200 rounded animate-pulse" />
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div className="h-6 w-56 bg-gray-200 rounded animate-pulse" />
              <div className="h-80 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
