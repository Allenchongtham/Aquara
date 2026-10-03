import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle, Clock, MapPin } from 'lucide-react';

// Tailwind-styled custom HTML markers to avoid loading external image assets
const createCustomIcon = (severity) => {
  let bgColor = 'bg-blue-500';
  let ringColor = 'ring-blue-100';
  let borderColor = 'border-blue-600';

  if (severity === 'HIGH' || severity === 'CRITICAL') {
    bgColor = 'bg-red-500';
    ringColor = 'ring-red-100';
    borderColor = 'border-red-600';
  } else if (severity === 'MEDIUM') {
    bgColor = 'bg-amber-500';
    ringColor = 'ring-amber-100';
    borderColor = 'border-amber-600';
  }

  return L.divIcon({
    className: 'custom-leaflet-icon bg-transparent border-none',
    html: `<div class="w-4 h-4 rounded-full ${bgColor} ring-4 ${ringColor} shadow-md border-2 ${borderColor}"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10],
  });
};

export default function AquaraMap({ reports = [] }) {
  // Defaulting to the coordinates provided in your API payload example (Imphal)
  const defaultCenter = [24.8170, 93.9368];
  
  // Calculate map center based on first report if available
  const centerPosition = reports.length > 0 
    ? [reports[0].latitude, reports[0].longitude] 
    : defaultCenter;

  return (
    <div className="w-full h-full min-h-[500px] rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50 relative z-0">
      <MapContainer 
        center={centerPosition} 
        zoom={13} 
        className="w-full h-full z-0"
        zoomControl={false} // Disable default to keep UI clean, can add custom positioned ones later
      >
        {/* CartoDB Voyager tiles for a clean, muted, SaaS-friendly look */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.latitude, report.longitude]}
            icon={createCustomIcon(report.ai_analysis?.severity)}
          >
            {/* Clicking a pin opens these details[cite: 14] */}
            <Popup className="custom-popup rounded-xl">
              <div className="p-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1 rounded-md ${
                    report.ai_analysis?.severity === 'HIGH' ? 'bg-red-100 text-red-700' :
                    report.ai_analysis?.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm capitalize">
                    {report.ai_analysis?.issue_type?.replace(/_/g, ' ') || 'Reported Issue'}
                  </h3>
                </div>
                
                <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed">
                  "{report.description}"
                </p>
                
                <div className="space-y-1.5 border-t border-slate-100 pt-3 mt-1">
                  <div className="flex items-center text-xs text-slate-500 gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-500 gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Just now</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}