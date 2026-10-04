import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function AquaraMap({ reports = [] }) {
  const mapRef = useRef(null);

  const crisisCount = reports.filter(
    (r) => r.ai_analysis?.severity === 'CRITICAL' || r.ai_analysis?.severity === 'HIGH'
  ).length;

  const emergingCount = reports.filter(
    (r) => r.ai_analysis?.severity === 'MEDIUM'
  ).length;

  const normalCount = reports.filter(
    (r) => r.ai_analysis?.severity === 'LOW' || !r.ai_analysis?.severity
  ).length;

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
    }).setView([24.8170, 93.9368], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    reports.forEach((r) => {
      if (r.latitude && r.longitude) {
        L.marker([r.latitude, r.longitude])
          .addTo(map)
          .bindPopup(`<b>${r.ai_analysis?.issue_type || 'Report'}</b><br/>${r.description || ''}`);
      }
    });

    return () => {
      map.remove();
    };
  }, [reports]);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] md:h-full flex flex-col bg-slate-50">
      {/* Top Floating Branding Card - Visible ONLY on Mobile */}
      <div className="absolute top-4 left-4 right-4 z-20 md:hidden bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-md border border-slate-100/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#20403B] flex items-center justify-center text-white font-extrabold text-lg shadow-sm flex-shrink-0">
          A
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-800 leading-tight">Aquara</h1>
          <p className="text-xs text-slate-500">Water Observability Platform</p>
        </div>
      </div>

      <div ref={mapRef} className="w-full h-full z-10" />

      {/* Floating Status Legend Card */}
      <div className="absolute left-5 right-5 bottom-6 md:left-8 md:right-auto md:w-80 md:bottom-8 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-slate-100/80 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Crisis</span>
          </div>
          <span className="text-slate-500 font-bold">{crisisCount}</span>
        </div>

        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Emerging</span>
          </div>
          <span className="text-slate-500 font-bold">{emergingCount}</span>
        </div>

        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Normal</span>
          </div>
          <span className="text-slate-500 font-bold">{normalCount}</span>
        </div>
      </div>
    </div>
  );
}