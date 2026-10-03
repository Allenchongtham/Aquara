import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, MapPin, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ReportForm() {
  const [issueType, setIssueType] = useState('NO_WATER');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState(24.8170); // Default placeholder (Imphal/Loktak region)
  const [longitude, setLongitude] = useState(93.9368);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');

  // Auto-detect browser location on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (err) => {
          console.warn("Geolocation permission denied or error, using default coordinates.");
        }
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide a description of the issue.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Formulate description including the selected issue type context
      const fullDescription = `[Issue Type: ${issueType}] ${description}`;
      
      const response = await axios.post('http://localhost:8000/api/reports', {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        description: fullDescription
      });

      setSuccessData(response.data);
      setDescription('');
    } catch (err) {
      console.error(err);
      setError('Failed to connect to Aquara backend. Is Uvicorn running?');
    } finally {
      setLoading(false);
    }
  };

  const issueOptions = [
    { id: 'NO_WATER', label: 'No irrigation water', icon: '💧' },
    { id: 'DRY_CANAL', label: 'Canal dry', icon: '🏜️' },
    { id: 'DAMAGED_INFRASTRUCTURE', label: 'Damaged infrastructure', icon: '🏗️' },
    { id: 'OTHER', label: 'Other issue', icon: '📋' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <button className="text-slate-500 hover:text-slate-800"><ArrowLeft size={20} /></button>
          <h1 className="font-semibold text-slate-800 text-lg">Report an Issue</h1>
          <div className="w-5"></div>
        </div>

        {successData ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={36} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Report Submitted!</h2>
            <p className="text-sm text-slate-500">Your report has been logged and analyzed by Gemini AI.</p>
            
            <div className="bg-slate-50 p-4 rounded-xl text-left text-xs space-y-1 border border-slate-200">
              <p><strong>Database ID:</strong> {successData.id}</p>
              <p><strong>AI Classification:</strong> {successData.ai_analysis.issue_type}</p>
              <p><strong>Severity:</strong> <span className="text-red-500 font-bold">{successData.ai_analysis.severity}</span></p>
            </div>

            <button 
              onClick={() => setSuccessData(null)}
              className="w-full py-3 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-medium transition"
            >
              Submit Another Report
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {/* Issue Type Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                What's the issue?
              </label>
              <div className="space-y-2">
                {issueOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setIssueType(opt.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition ${
                      issueType === opt.id 
                        ? 'border-teal-700 bg-teal-50/50 text-teal-900 font-medium' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{opt.icon}</span>
                      <span className="text-sm">{opt.label}</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      issueType === opt.id ? 'border-teal-700 bg-teal-700' : 'border-slate-300'
                    }`}>
                      {issueType === opt.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Add details
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you are experiencing on the ground..."
                className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-teal-700 text-sm text-slate-700 resize-none"
                maxLength={500}
              />
              <div className="text-right text-xs text-slate-400 mt-1">{description.length}/500</div>
            </div>

            {/* Location Pill */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-teal-700" />
                <span>Lat: {latitude.toFixed(4)}, Lon: {longitude.toFixed(4)}</span>
              </div>
              <span className="text-teal-700 font-medium bg-teal-50 px-2 py-1 rounded-lg">Auto-detected</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#1B3B36] hover:bg-[#122824] text-white rounded-2xl font-medium shadow-lg transition flex items-center justify-center gap-2"
            >
              {loading ? 'Analyzing with Gemini AI...' : 'Submit Report'}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}