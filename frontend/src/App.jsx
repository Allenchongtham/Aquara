import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './tabs/Dashboard';
import AquaraMap from './tabs/AquaraMap';
import Report from './tabs/Report';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/reports');
      setReports(response.data);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleReportSuccess = () => {
    fetchReports();
    setActiveTab('dashboard');
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 font-sans overflow-hidden">
      {/* Desktop Header */}
      <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm h-16 flex-shrink-0">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-9 h-9 rounded-xl bg-[#20403B] flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">Aquara</h1>
            <p className="text-xs text-slate-500">Water Observability Platform</p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'dashboard' ? 'bg-[#20403B] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'map' ? 'bg-[#20403B] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Irrigation Map
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'report' ? 'bg-[#20403B] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Report Issue
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-y-auto pb-16 md:pb-0 relative">
        {activeTab === 'dashboard' && (
          <Dashboard reports={reports} onNavigateToReport={() => setActiveTab('report')} />
        )}
        {activeTab === 'map' && <AquaraMap reports={reports} />}
        {activeTab === 'report' && (
          <Report onClose={() => setActiveTab('dashboard')} onSuccess={handleReportSuccess} />
        )}
      </main>

      {/* Fixed Uniform Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 grid grid-cols-3 z-50 shadow-lg">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'dashboard' ? 'text-[#20403B] font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
          </svg>
          <span className="text-[11px] mt-0.5">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'map' ? 'text-[#20403B] font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503-12.485l-4.5 1.95a1.5 1.5 0 01-1.006 0l-4.5-1.95A1.5 1.5 0 002.25 5.25v12.214a1.5 1.5 0 002.003 1.385l4.5-1.95a1.5 1.5 0 011.006 0l4.5 1.95a1.5 1.5 0 002.003-1.385V5.25a1.5 1.5 0 00-1.756-1.485z" />
          </svg>
          <span className="text-[11px] mt-0.5">Map</span>
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'report' ? 'text-[#20403B] font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[11px] mt-0.5">Report</span>
        </button>
      </nav>
    </div>
  );
}