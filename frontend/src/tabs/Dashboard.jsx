import React from 'react';

export default function Dashboard({ reports = [] }) {
  const totalReports = reports.length;
  const criticalCount = reports.filter(
    (r) => r.ai_analysis?.severity === 'CRITICAL' || r.ai_analysis?.severity === 'HIGH'
  ).length;

  return (
    <div className="w-full min-h-full bg-slate-50/60 p-4 sm:p-6 md:p-8 flex flex-col space-y-4 md:space-y-5">
      {/* Aquara Top Branding Card - Visible ONLY on Mobile */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3 flex-shrink-0 md:hidden">
        <div className="w-10 h-10 rounded-2xl bg-[#20403B] flex items-center justify-center text-white font-extrabold text-lg shadow-sm flex-shrink-0">
          A
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">Aquara</h1>
          <p className="text-xs text-slate-500">Water Observability Platform</p>
        </div>
      </div>

      {/* Metric KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 flex-shrink-0">
        {/* Total Reports */}
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">Total Reports</span>
            <p className="text-xl md:text-3xl font-extrabold text-slate-800 mt-0.5">{totalReports}</p>
            <span className="text-[10px] md:text-[11px] text-slate-400 font-medium">Logged field alerts</span>
          </div>
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
            <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">Critical Alerts</span>
            <p className="text-xl md:text-3xl font-extrabold text-rose-600 mt-0.5">{criticalCount}</p>
            <span className="text-[10px] md:text-[11px] text-rose-500 font-medium">Requires action</span>
          </div>
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 flex-shrink-0">
            <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">System Status</span>
            <p className="text-xl md:text-3xl font-extrabold text-emerald-700 mt-0.5">Normal</p>
            <span className="text-[10px] md:text-[11px] text-emerald-600 font-medium">Network operational</span>
          </div>
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Canal Flow Rate */}
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">Canal Flow Rate</span>
            <p className="text-xl md:text-3xl font-extrabold text-slate-800 mt-0.5">98.4%</p>
            <span className="text-[10px] md:text-[11px] text-slate-400 font-medium">Optimal distribution</span>
          </div>
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
            <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
            </svg>
          </div>
        </div>
      </div>

      {/* Incident Feed */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 md:p-6 shadow-sm flex-1 flex flex-col min-h-[260px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm md:text-base font-bold text-slate-800">Recent Incident Reports</h2>
            <p className="text-xs text-slate-500">Live feed of user-reported issues across regions</p>
          </div>
          <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600">
            {reports.length} Total
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-800">All Clear! No Active Incidents</p>
            <p className="text-xs text-slate-500 max-w-sm">
              No water issues or canal dryouts have been reported yet.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pt-3 space-y-2.5 pr-1">
            {reports.map((report, idx) => (
              <div
                key={report.id || idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      {report.ai_analysis?.issue_type || 'Reported Incident'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-amber-100 text-amber-800">
                      {report.ai_analysis?.severity || 'MEDIUM'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">{report.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}