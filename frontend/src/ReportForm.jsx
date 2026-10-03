import React, { useState } from 'react';
import axios from 'axios';
import { MapPin, Navigation, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ReportForm() {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [status, setStatus] = useState('idle'); // idle, locating, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);

  const handleGetLocation = () => {
    setStatus('locating');
    setErrorMessage('');

    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatus('idle');
      },
      (error) => {
        setStatus('error');
        setErrorMessage('Location access denied or unavailable. Please allow permissions.');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!location.latitude || !location.longitude) {
      setStatus('error');
      setErrorMessage('Please capture your location before submitting.');
      return;
    }
    
    if (!description.trim()) {
      setStatus('error');
      setErrorMessage('Please provide a description of the issue.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');
    setAiAnalysis(null);

    try {
      const response = await axios.post('http://localhost:8000/api/reports', {
        latitude: location.latitude,
        longitude: location.longitude,
        description: description.trim(),
      });

      setStatus('success');
      setAiAnalysis(response.data.ai_analysis);
      setDescription('');
      setLocation({ latitude: null, longitude: null });
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error.response?.data?.message || 'Failed to communicate with the server. Please try again.'
      );
    }
  };

  return (
    <div className="max-w-md mx-auto w-full bg-slate-50 min-h-screen sm:min-h-0 sm:rounded-2xl sm:shadow-sm sm:border border-slate-200 p-4 sm:p-6 sm:mt-10">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Report an Issue</h2>
        <p className="text-sm text-slate-500 mt-1">Help us identify water infrastructure problems.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Description Field */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">
            Add details
          </label>
          <textarea
            id="description"
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-shadow resize-none text-slate-900 text-sm"
            placeholder="e.g., Sector 4 pipe burst, street is flooded completely"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={status === 'submitting'}
          />
        </div>

        {/* Location Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Your location</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={status === 'locating' || status === 'submitting'}
              className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none disabled:opacity-50"
            >
              {status === 'locating' ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              ) : (
                <Navigation className="w-4 h-4 text-emerald-600" />
              )}
              Get My Location
            </button>
            <div className="flex-1 text-sm text-slate-500 overflow-hidden">
              {location.latitude ? (
                <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-md font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  Auto-detected
                </span>
              ) : (
                <span className="text-slate-400">Required</span>
              )}
            </div>
          </div>
        </div>

        {/* Status Messaging */}
        {status === 'error' && (
          <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-start gap-2 text-emerald-800 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <p>Report processed successfully.</p>
            </div>
            {aiAnalysis && (
              <div className="mt-2 pl-7 text-xs text-emerald-700/80 space-y-1">
                <p><span className="font-semibold">Detected Issue:</span> {aiAnalysis.issue_type}</p>
                <p><span className="font-semibold">Severity:</span> {aiAnalysis.severity}</p>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'submitting' || !location.latitude || status === 'locating'}
          className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium rounded-xl transition-colors focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Submit Report'
          )}
        </button>
      </form>
    </div>
  );
}