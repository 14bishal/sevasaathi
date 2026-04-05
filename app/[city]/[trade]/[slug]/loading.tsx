export default function WorkerProfileLoading() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--color-warm-bg)' }}
    >
      {/* Nav skeleton */}
      <div className="border-b" style={{ borderColor: '#e8e4df', backgroundColor: 'white' }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="shimmer h-6 w-24 rounded-md" />
          <div className="shimmer h-8 w-32 rounded-lg" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile header */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex items-start gap-4">
                <div className="shimmer w-20 h-20 rounded-2xl flex-shrink-0" />
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="shimmer h-6 w-48 rounded-md" />
                  <div className="flex gap-2">
                    <div className="shimmer h-6 w-24 rounded-full" />
                    <div className="shimmer h-6 w-20 rounded-full" />
                  </div>
                  <div className="shimmer h-4 w-36 rounded-md" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="shimmer h-4 w-full rounded-md" />
                <div className="shimmer h-4 w-5/6 rounded-md" />
                <div className="shimmer h-4 w-4/6 rounded-md" />
              </div>
            </div>

            {/* Reviews skeleton */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <div className="shimmer h-5 w-32 rounded-md mb-4" />
              {[1, 2].map((i) => (
                <div key={i} className="py-4 border-t first:border-t-0" style={{ borderColor: '#e8e4df' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="shimmer w-8 h-8 rounded-full" />
                    <div className="shimmer h-4 w-28 rounded-md" />
                  </div>
                  <div className="shimmer h-3 w-16 rounded-md mb-2" />
                  <div className="shimmer h-4 w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-card space-y-3">
              <div className="shimmer h-12 w-full rounded-xl" />
              <div className="shimmer h-12 w-full rounded-xl" />
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-card space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="shimmer w-8 h-8 rounded-lg" />
                  <div className="shimmer h-4 w-32 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
