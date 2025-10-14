export function AdvisorsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-9 w-48 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-6 w-96 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-9 w-20 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-5 w-36 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-100">
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
