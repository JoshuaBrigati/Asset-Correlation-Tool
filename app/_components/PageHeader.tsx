export default function PageHeader() {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-fg leading-tight">Asset Correlations</h1>
          <p className="text-xs text-muted">Explore how assets move in relation to each other over time</p>
        </div>
      </div>
      <div className="text-xs text-muted hidden sm:block shrink-0">
        Created by <span className="font-medium text-subtle">Joshua Brigati</span>
      </div>
    </div>
  );
}
