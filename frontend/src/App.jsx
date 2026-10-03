import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('report');
  
  const [issueType, setIssueType] = useState('NO_WATER');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState(24.8170);
  const [longitude, setLongitude] = useState(93.9368);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');

  const [reports, setReports] = useState([]);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        () => console.warn("Using default coordinates.")
      );
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'map') {
      fetchReports();
    }
  }, [activeTab]);

  const fetchReports = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/reports');
      if (res.data && res.data.data) {
        setReports(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch reports for map", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'map') {
      const timer = setTimeout(() => {
        if (mapRef.current) {
          if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current).setView([latitude, longitude], 12);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapInstanceRef.current);
          } else {
            mapInstanceRef.current.setView([latitude, longitude], 12);
            mapInstanceRef.current.invalidateSize();
          }

          mapInstanceRef.current.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
              mapInstanceRef.current.removeLayer(layer);
            }
          });

          reports.forEach((r) => {
            if (r.latitude && r.longitude) {
              const marker = L.marker([r.latitude, r.longitude]).addTo(mapInstanceRef.current);
              marker.bindPopup(`
                <div style="font-size: 12px; font-family: sans-serif;">
                  <strong>${r.ai_analysis?.issue_type || "Report"}</strong><br/>
                  ${r.original_text}<br/>
                  <span style="color: red; font-weight: bold;">Severity: ${r.ai_analysis?.severity}</span>
                </div>
              `);
            }
          });
        }
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [activeTab, reports, latitude, longitude]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide a description.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/reports', {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        description: `[Issue Type: ${issueType}] ${description}`
      });
      setSuccessData(response.data);
      setDescription('');
    } catch (err) {
      console.error(err);
      setError('Failed to connect to backend at http://localhost:8000');
    } finally {
      setLoading(false);
    }
  };

  const issueOptions = [
    { id: 'NO_WATER', label: 'No irrigation water' },
    { id: 'DRY_CANAL', label: 'Canal dry' },
    { id: 'DAMAGED_INFRASTRUCTURE', label: 'Damaged infrastructure' },
    { id: 'OTHER', label: 'Other issue' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow-md z-50">
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl tracking-wide text-teal-400">Aquara</span>
          <span className="text-xs bg-slate-800 px-3 py-1 rounded text-slate-300 border border-slate-700">Desktop Web Platform</span>
        </div>
        <nav className="flex gap-4">
          <button 
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'report' ? 'bg-teal-700 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            Submit Report
          </button>
          <button 
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'map' ? 'bg-teal-700 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            Live Map View
          </button>
        </nav>
      </header>

      <main className="flex-1 flex flex-col relative w-full p-6">
        {activeTab === 'report' ? (
          <div className="max-w-xl mx-auto my-12 w-full p-6 bg-white rounded-2xl shadow-xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Submit Ground-Truth Report</h2>
            <p className="text-xs text-slate-500 mb-6">Reports are automatically analyzed by Gemini AI and stored in MongoDB.</p>

            {successData ? (
              <div className="p-8 text-center space-y-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  OK
                </div>
                <h3 className="text-lg font-bold text-slate-800">Report Successfully Processed</h3>
                <div className="bg-white p-4 rounded-lg text-left text-xs space-y-1 border border-slate-200 font-mono">
                  <p><strong>Database ID:</strong> {successData.id}</p>
                  <p><strong>Classified Issue:</strong> {successData.ai_analysis.issue_type}</p>
                  <p><strong>Severity:</strong> <span className="text-red-600 font-bold">{successData.ai_analysis.severity}</span></p>
                </div>
                <button 
                  onClick={() => setSuccessData(null)}
                  className="w-full py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg font-medium transition shadow"
                >
                  Submit Another Report
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">{error}</div>}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Select Issue Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {issueOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => setIssueType(opt.id)}
                        className={`p-3 rounded-xl border cursor-pointer text-sm transition flex items-center justify-between ${
                          issueType === opt.id 
                            ? 'border-teal-700 bg-teal-50 text-slate-900 font-semibold' 
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{opt.label}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          issueType === opt.id ? 'border-teal-700 bg-teal-700' : 'border-slate-300'
                        }`}>
                          {issueType === opt.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Description & Observations
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter detailed notes from the field..."
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-700 text-sm text-slate-700 resize-none bg-slate-50"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                  <span>GPS Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded">GPS Active</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-medium shadow-lg transition"
                >
                  {loading ? 'Analyzing with Gemini AI...' : 'Submit Report'}
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="w-full max-w-7xl mx-auto flex flex-col flex-1">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-800">Live Observation Map</h2>
              <p className="text-xs text-slate-500">Real-time ground-truth reports from the community.</p>
            </div>
            {/* Explicit fixed height on container guarantees map tiles load */}
            <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden" style={{ height: '650px' }}>
              <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}