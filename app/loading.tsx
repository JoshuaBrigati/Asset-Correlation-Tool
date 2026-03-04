export default function Loading() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
        {/* Page header */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl skeleton" />
          <div className="space-y-1.5">
            <div className="h-5 w-40 rounded-md skeleton" />
            <div className="h-3 w-72 rounded-md skeleton" />
          </div>
        </div>
        {/* Controls card */}
        <div className="h-28 rounded-xl skeleton" />
        {/* Empty state area */}
        <div className="flex flex-col items-center py-16 gap-4">
          <div className="w-14 h-14 rounded-2xl skeleton" />
          <div className="h-5 w-48 rounded-md skeleton" />
          <div className="h-4 w-80 rounded-md skeleton" />
        </div>
      </div>
    </main>
  );
}
