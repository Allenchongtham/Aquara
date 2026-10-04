import React, { useState } from 'react';
import { Home, FileText, Map as MapIcon, User } from 'lucide-react';
import AquaraMap from './AquaraMap';
import AuthorityDashboard from './Dashboard';
import ReportForm from './ReportForm';

export default function TabsLayout() {
  const [activeTab, setActiveTab] = useState('map');

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 border-x border-gray-200">
      {/* Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'home' && (
          <div className="p-6 flex items-center justify-center h-full text-gray-500">
            Home Dashboard
          </div>
        )}
        {activeTab === 'reports' && <ReportForm />}
        {activeTab === 'map' && <AquaraMap />}
        {activeTab === 'profile' && <AuthorityDashboard />}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="bg-white border-t border-gray-100 py-3 px-6 flex justify-between items-center z-20">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
            activeTab === 'home' ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          <Home size={20} />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
            activeTab === 'reports' ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          <FileText size={20} />
          <span>Reports</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
            activeTab === 'map' ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          <MapIcon size={20} />
          <span>Map</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
            activeTab === 'profile' ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          <User size={20} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}