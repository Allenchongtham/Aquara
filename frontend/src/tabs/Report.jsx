import React, { useState } from 'react';

export default function Report({ onSubmitReport }) {
  const [selectedIssue, setSelectedIssue] = useState('no_water');
  const [details, setDetails] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const issueOptions = [
    {
      id: 'no_water',
      title: 'No irrigation water',
      subtitle: 'Water flow is completely stopped',
    },
    {
      id: 'canal_dry',
      title: 'Canal dry',
      subtitle: 'Canal bed has no water running',
    },
    {
      id: 'damaged_infra',
      title: 'Damaged infrastructure',
      subtitle: 'Broken pipes, gates, or pumps',
    },
    {
      id: 'other',
      title: 'Other',
      subtitle: 'General or unlisted water issue',
    },
  ];

  const handleAutoGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLatitude(pos.coords.latitude.toFixed(4));
        setLongitude(pos.coords.longitude.toFixed(4));
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitReport) {
      const issueObj = issueOptions.find((i) => i.id === selectedIssue);
      onSubmitReport({
        description: details || issueObj?.title,
        latitude: latitude ? parseFloat(latitude) : 24.8170,
        longitude: longitude ? parseFloat(longitude) : 93.9368,
        ai_analysis: {
          issue_type: issueObj?.title,
          severity: 'HIGH',
        },
      });
    }
    setDetails('');
    setLatitude('');
    setLongitude('');
  };

  return (
    <div className="w-full h-[calc(100dvh-64px)] md:h-[calc(100vh-64px)] bg-slate-50/60 p-4 sm:p-6 md:p-8 flex flex-col space-y-3 md:space-y-4 overflow-hidden justify-between">
      {/* Aquara Top Branding Card - Mobile Only */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3 flex-shrink-0 md:hidden">
        <div className="w-10 h-10 rounded-2xl bg-[#20403B] flex items-center justify-center text-white font-extrabold text-lg shadow-sm flex-shrink-0">
          A
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">Aquara</h1>
          <p className="text-xs text-slate-500">Water Observability Platform</p>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 p-3.5 md:p-8 shadow-sm flex-1 flex flex-col w-full min-h-0 overflow-hidden">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between min-h-0 space-y-2 md:space-y-5">
          {/* Header */}
          <div className="border-b border-slate-100 pb-1.5 md:pb-3.5 flex-shrink-0">
            <h2 className="text-sm md:text-xl font-extrabold text-slate-800 leading-tight">Report an Issue</h2>
            <p className="text-[11px] md:text-sm text-slate-500">Submit water observability alerts directly to system operators</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8 flex-1 min-h-0 items-stretch overflow-hidden">
            {/* Issue Selection */}
            <div className="flex flex-col space-y-1 md:space-y-3 min-h-0">
              <label className="text-[11px] md:text-sm font-bold text-slate-700 flex-shrink-0">What's the issue?</label>
              <div className="grid grid-cols-1 gap-1.5 md:gap-3 flex-1 min-h-0">
                {issueOptions.map((opt) => {
                  const isSelected = selectedIssue === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedIssue(opt.id)}
                      className={`p-2 md:p-4 rounded-xl md:rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-[#20403B] bg-slate-50/60 ring-1 ring-[#20403B]'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="leading-tight">
                        <h3 className="text-[11px] md:text-sm font-bold text-slate-800">{opt.title}</h3>
                        <p className="text-[10px] md:text-xs text-slate-400 font-medium">{opt.subtitle}</p>
                      </div>
                      <div
                        className={`w-3.5 h-3.5 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'border-[#20403B]' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full bg-[#20403B]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Details, Location & Submit */}
            <div className="flex flex-col justify-between space-y-2 md:space-y-4 min-h-0">
              {/* Additional details */}
              <div className="space-y-1 md:space-y-2 flex-1 flex flex-col min-h-0">
                <label className="text-[11px] md:text-sm font-bold text-slate-700 flex-shrink-0">Add details</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Water has not reached my field since morning."
                  className="w-full flex-1 min-h-[30px] md:min-h-[90px] p-2 md:p-4 bg-slate-50/50 border border-slate-200 rounded-xl md:rounded-2xl text-[11px] md:text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#20403B] resize-none"
                />
              </div>

              {/* Location details */}
              <div className="space-y-1 md:space-y-2.5 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] md:text-sm font-bold text-slate-700">Your location</label>
                  <button
                    type="button"
                    onClick={handleAutoGPS}
                    className="text-[11px] md:text-sm font-bold text-[#20403B] hover:underline"
                  >
                    Use Auto GPS
                  </button>
                </div>

                <div className="p-2 md:p-4 bg-slate-50/50 rounded-xl md:rounded-2xl border border-slate-100 space-y-1 md:space-y-2">
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    <div>
                      <label className="text-[9px] md:text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Latitude</label>
                      <input
                        type="text"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        placeholder="24.8170"
                        className="w-full p-1.5 md:p-2.5 bg-white border border-slate-200 rounded-lg md:rounded-xl text-[11px] md:text-sm text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:border-[#20403B]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] md:text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Longitude</label>
                      <input
                        type="text"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        placeholder="93.9368"
                        className="w-full p-1.5 md:p-2.5 bg-white border border-slate-200 rounded-lg md:rounded-xl text-[11px] md:text-sm text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:border-[#20403B]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 md:py-3.5 bg-[#20403B] hover:bg-[#18322e] text-white font-bold text-xs md:text-sm rounded-xl md:rounded-2xl shadow-sm transition flex-shrink-0"
              >
                Submit Report
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}