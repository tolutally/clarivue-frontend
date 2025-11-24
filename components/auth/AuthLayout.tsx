import clsx from 'clsx';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  contentWidthClass?: string;
}

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  contentWidthClass = 'max-w-md',
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-slate-950 text-white">
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-slate-900 via-indigo-900 to-slate-900 p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-32 -left-24 w-64 h-64 bg-purple-500/30 blur-3xl" />
          <div className="absolute top-1/3 -right-12 w-72 h-72 bg-sky-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/30 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between w-full">
          <div>
            <div className="space-y-6 max-w-xl">
              <span className="inline-flex items-center px-4 py-1 rounded-full bg-white/10 text-sm font-medium backdrop-blur">
                AI-powered hiring that delights candidates
              </span>
              <h2 className="text-4xl font-semibold leading-snug">
                Interview smarter with Clarivue&apos;s modern hiring workflow.
              </h2>
              <p className="text-lg text-slate-200">
                Transform candidate conversations with intelligent scoring, automated insights, and collaborative decision making.
              </p>
            </div>
          </div>

          <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 backdrop-blur px-8 py-6 shadow-2xl max-w-lg">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300 mb-4">
              Hiring Workflow
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white text-slate-900 rounded-2xl p-4">
                <div>
                  <p className="text-sm text-slate-500">Next Step</p>
                  <p className="text-lg font-semibold">Confirm Candidate Fit</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                  87% fit
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Tech Skills', value: 'Strong' },
                  { label: 'Comms', value: 'Excellent' },
                  { label: 'Problem Solving', value: 'Outstanding' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/15 p-3 text-sm">
                    <p className="text-slate-400">{item.label}</p>
                    <p className="text-lg font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-linear-to-br from-white via-slate-50 to-sky-50 text-slate-900 px-6 py-8">
        <div className={clsx('w-full space-y-8', contentWidthClass)}>
          <div className="space-y-3">
            <img src="/clarivue-logo.png" alt="Clarivue" className="h-10" />
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
              <p className="text-slate-600">{subtitle}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.1)] p-8">
            {children}
          </div>

          {footer && (
            <div className="text-slate-500">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

