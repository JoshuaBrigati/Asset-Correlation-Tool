"use client";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-base font-semibold text-fg mb-2">Something went wrong</h2>
        <p className="text-sm text-muted mb-6 leading-relaxed">{error.message}</p>
        <button
          onClick={reset}
          className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-accent text-white hover:bg-accent-hover transition-all"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
