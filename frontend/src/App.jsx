import React, { useState } from 'react';
import ReportForm from './ReportForm';
import AuthorityDashboard from './AuthorityDashboard';

// Mock initial reports so the map renders immediately
const INITIAL_REPORTS = [
  {
    id: "64d3b001",
    latitude: 24.8170,
    longitude: 93.9368,
    description: "Sector 4 pipe burst, street is flooded completely",
    ai_analysis: {
      issue_type: "PIPE_BURST",
      severity: "HIGH",
      language: "English",
      summary: "Major pipe burst causing severe street flooding in Sector 4. Field team dispatch recommended."
    }
  },
  {
    id: "64d3b002",
    latitude: 24.8210,
    longitude: 93.9420,
    description: "Low water pressure in Sector 2 residential area",
    ai_analysis: {
      issue_type: "LOW_PRESSURE",
      severity: "LOW",
      language: "English",
      summary: "Minor pressure drop reported across multiple households."
    }
  }
];

export default function App() {
  const [view, setView] = useState('authority'); // 'farmer' or 'authority'
  const [reports, setReports] = useState(INITIAL_REPORTS);

  const fetchReports = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/reports');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setReports(data);
      }
    } catch (e) {
      console.log("Backend offline, keeping current state.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* View Switcher Top Bar */}
      <header className="bg-slate-900 border-b border-slate-800 text-white px-4 py-2.5 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-emerald-400 tracking-wide">Aquara</span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">MVP</span>
        </div>
        
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setView('farmer')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              view === 'farmer' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Farmer View (Report)
          </button>
          <button
            onClick={() => setView('authority')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              view === 'authority' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Authority Dashboard
          </button>
        </div>
      </header>

      {/* View Container */}
      <main className="flex-1 overflow-hidden">
        {view === 'farmer' ? (
          <div className="py-8 px-4">
            <ReportForm />
          </div>
        ) : (
          <AuthorityDashboard reports={reports} onRefresh={fetchReports} />
        )}
      </main>
    </div>
  );
}