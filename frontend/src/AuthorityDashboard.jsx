import React, { useState } from 'react';
import AquaraMap from './AquaraMap';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Sparkles, 
  Filter, 
  RefreshCw,
  Search,
  Shield
} from 'lucide-react';

export default function AuthorityDashboard({ reports = [], onRefresh }) {
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  // Filter reports by severity if needed
  const filteredReports = reports.filter((report) => {
    if (filterSeverity === 'ALL') return true;
    return report.ai_analysis?.severity === filterSeverity;
  });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'HIGH':
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-900 overflow-hidden">
      {/* Top Header Bar */}
      <header className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight leading-none">Aquara</h1>
            <p className="text-xs text-slate-400 mt-1">Water Infrastructure Observability Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            System Live
          </div>
          <button 
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Data
          </button>
        </div>
      </header>

      {/* Main Split-View Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4">
        
        {/* Left Pane: Interactive Map */}
        <div className="w-full md:w-3/5 lg:w-2/3 h-1/2 md:h-full flex flex-col rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-500" /> Live Spatial Incident Map
            </span>
            <span className="text-xs text-slate-500">{filteredReports.length} Active Pins</span>
          </div>
          <div className="flex-1 relative">
            <AquaraMap reports={filteredReports} />
          </div>
        </div>

        {/* Right Pane: Scrollable Incoming Reports List */}
        <div className="w-full md:w-2/5 lg:w-1/3 h-1/2 md:h-full flex flex-col rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          
          {/* List Header & Filters */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Incoming Reports</h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {filteredReports.length} Reports
              </span>
            </div>

            {/* Severity Filter Tabs */}
            <div className="flex gap-1.5 pt-1">
              {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                    filterSeverity === sev
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y-0">
            {filteredReports.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-sm">No reports matching current filter.</p>
              </div>
            ) : (
              filteredReports.map((report) => {
                const isSelected = selectedReportId === report.id;
                const analysis = report.ai_analysis || {};

                return (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReportId(report.id)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
                    }`}
                  >
                    {/* Item Top Line: Type + Severity Badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-slate-900 capitalize leading-tight">
                        {analysis.issue_type?.replace(/_/g, ' ') || 'Unclassified Water Issue'}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase flex-shrink-0 ${getSeverityBadge(
                          analysis.severity
                        )}`}
                      >
                        {analysis.severity || 'UNKNOWN'}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed">
                      "{report.description}"
                    </p>

                    {/* AI Summary Placeholder */}
                    <div className="bg-slate-100/80 rounded-md p-2.5 mb-3 border border-slate-200/60">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        AI Triage Summary
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {analysis.summary || 
                          `Reported ${analysis.issue_type || 'issue'} detected in high-density segment. Requires field inspection.`}
                      </p>
                    </div>

                    {/* Item Footer Meta */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>
                          {report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>ID: #{report.id?.slice(-5) || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}