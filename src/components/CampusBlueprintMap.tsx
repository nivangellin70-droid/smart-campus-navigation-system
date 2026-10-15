import React, { useState } from 'react';
import {
  CampusLocation,
  RouteComputationResult,
} from '../types/campus';
import {
  CAMPUS_WALKWAY_NODES,
  CAMPUS_WALKWAY_EDGES,
} from '../data/campusData';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Wifi,
  Accessibility,
  Droplets,
  Layers,
  MapPin,
  Compass,
} from 'lucide-react';

interface CampusBlueprintMapProps {
  locations: CampusLocation[];
  selectedLocation: CampusLocation | null;
  onSelectLocation: (loc: CampusLocation) => void;
  activeRoute: RouteComputationResult | null;
  activeStepIndex?: number;
  simulatedProgressRatio?: number; // 0 to 1
}

export const CampusBlueprintMap: React.FC<CampusBlueprintMapProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  activeRoute,
  simulatedProgressRatio = 0,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showWalkways, setShowWalkways] = useState(true);
  const [showRamps, setShowRamps] = useState(true);
  const [showWifi, setShowWifi] = useState(false);
  const [showWater, setShowWater] = useState(false);
  const [hoveredLocation, setHoveredLocation] = useState<CampusLocation | null>(null);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(2.0, Math.max(0.7, prev + delta)));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Helper to generate route polyline points
  const routePointsString = activeRoute
    ? activeRoute.pathNodes.map((n) => `${n.x},${n.y}`).join(' ')
    : '';

  // Calculate simulated walker position along path
  let walkerPos = { x: 500, y: 640 };
  if (activeRoute && activeRoute.pathNodes.length > 0) {
    if (activeRoute.pathNodes.length === 1) {
      walkerPos = { x: activeRoute.pathNodes[0].x, y: activeRoute.pathNodes[0].y };
    } else {
      const totalSegments = activeRoute.pathNodes.length - 1;
      const progressScaled = simulatedProgressRatio * totalSegments;
      const currentSegment = Math.min(totalSegments - 1, Math.floor(progressScaled));
      const segmentT = progressScaled - currentSegment;

      const p1 = activeRoute.pathNodes[currentSegment];
      const p2 = activeRoute.pathNodes[currentSegment + 1];

      walkerPos = {
        x: p1.x + (p2.x - p1.x) * segmentT,
        y: p1.y + (p2.y - p1.y) * segmentT,
      };
    }
  }

  return (
    <div className="relative w-full h-[580px] sm:h-[640px] bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-800 select-none flex flex-col">
      {/* Top Map Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Layer Filters (pointer-events-auto) */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-lg text-xs">
          <button
            onClick={() => setShowWalkways(!showWalkways)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              showWalkways ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Walkway Paths"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Walkways</span>
          </button>
          <button
            onClick={() => setShowRamps(!showRamps)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              showRamps ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Accessibility Ramps"
          >
            <Accessibility className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ramps</span>
          </button>
          <button
            onClick={() => setShowWifi(!showWifi)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              showWifi ? 'bg-sky-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Wi-Fi Hotspot Zones"
          >
            <Wifi className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Wi-Fi</span>
          </button>
          <button
            onClick={() => setShowWater(!showWater)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              showWater ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Purified Water Points"
          >
            <Droplets className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Water</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-lg text-slate-300">
          <button
            onClick={() => handleZoom(0.15)}
            className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.15)}
            className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Reset Zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="w-full h-full overflow-hidden flex items-center justify-center p-2">
        <svg
          viewBox="0 0 1000 720"
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Ground Grass Pattern */}
            <linearGradient id="lawnGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Quad Grass Green */}
            <radialGradient id="quadLawn" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#064e3b" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#022c22" stopOpacity="0.65" />
            </radialGradient>

            {/* Fountain Water Radial */}
            <radialGradient id="fountainGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </radialGradient>

            {/* Glowing route stroke filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Building 3D drop shadow */}
            <filter id="buildingShadow" x="-10%" y="-10%" width="125%" height="125%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Campus Grounds Background */}
          <rect width="1000" height="720" fill="url(#lawnGradient)" />

          {/* Campus Border Perimeter */}
          <rect
            x="40"
            y="40"
            width="920"
            height="640"
            rx="24"
            fill="none"
            stroke="#334155"
            strokeWidth="2"
            strokeDasharray="6 4"
          />

          {/* Manicured Quad Lawns */}
          {/* Central Oval Lawn */}
          <ellipse cx="500" cy="470" rx="140" ry="85" fill="url(#quadLawn)" stroke="#065f46" strokeWidth="1.5" />
          {/* North Residence Green */}
          <rect x="360" y="70" width="280" height="60" rx="16" fill="url(#quadLawn)" stroke="#065f46" strokeWidth="1" />
          {/* West Library Lawn */}
          <rect x="180" y="310" width="160" height="180" rx="14" fill="url(#quadLawn)" stroke="#065f46" strokeWidth="1" />
          {/* East Tech Lawn */}
          <rect x="660" y="290" width="160" height="180" rx="14" fill="url(#quadLawn)" stroke="#065f46" strokeWidth="1" />

          {/* Trees decorative dots */}
          {[
            [350, 480], [370, 520], [630, 480], [650, 520],
            [480, 260], [520, 260], [220, 240], [780, 240],
            [160, 450], [840, 450], [420, 620], [580, 620]
          ].map(([tx, ty], tIdx) => (
            <g key={tIdx}>
              <circle cx={tx} cy={ty} r="7" fill="#047857" opacity="0.8" />
              <circle cx={tx} cy={ty} r="4" fill="#10b981" opacity="0.9" />
            </g>
          ))}

          {/* Walkway Network Graph Lines */}
          {showWalkways && (
            <g stroke="#475569" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.75">
              {CAMPUS_WALKWAY_EDGES.map((edge, idx) => {
                const n1 = CAMPUS_WALKWAY_NODES.find((n) => n.id === edge.fromNodeId);
                const n2 = CAMPUS_WALKWAY_NODES.find((n) => n.id === edge.toNodeId);
                if (!n1 || !n2) return null;
                return (
                  <line
                    key={idx}
                    x1={n1.x}
                    y1={n1.y}
                    x2={n2.x}
                    y2={n2.y}
                    strokeDasharray={edge.type === 'garden_path' ? '4 3' : undefined}
                  />
                );
              })}
            </g>
          )}

          {/* Central Fountain with water ripples */}
          <g>
            <circle cx="500" cy="470" r="24" fill="url(#fountainGrad)" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="500" cy="470" r="16" fill="none" stroke="#e0f2fe" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="500" cy="470" r="6" fill="#ffffff" />
          </g>

          {/* Wi-Fi Hotspot Bubbles (if enabled) */}
          {showWifi && (
            <g opacity="0.35">
              {locations.map((loc) => (
                <circle
                  key={`wifi-${loc.id}`}
                  cx={loc.gridPos.x}
                  cy={loc.gridPos.y}
                  r="65"
                  fill="#0284c7"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
              ))}
            </g>
          )}

          {/* Active Wayfinding Route Line */}
          {activeRoute && activeRoute.pathNodes.length > 1 && (
            <g>
              {/* Outer Glow */}
              <polyline
                points={routePointsString}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.5"
                filter="url(#glow)"
              />
              {/* Pulsing Core Route */}
              <polyline
                points={routePointsString}
                fill="none"
                stroke="#2563eb"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Animated Dashes */}
              <polyline
                points={routePointsString}
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeDasharray="8 6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
              />
            </g>
          )}

          {/* Accessibility Ramps Icons */}
          {showRamps && (
            <g>
              {locations.filter((l) => l.isAccessible).map((loc) => (
                <g key={`ramp-${loc.id}`} transform={`translate(${loc.gridPos.x - 22}, ${loc.gridPos.y + 18})`}>
                  <rect width="14" height="14" rx="3" fill="#059669" />
                  <path d="M4 10 L8 5 L10 5" stroke="#fff" strokeWidth="1.2" fill="none" />
                  <circle cx="10" cy="3.5" r="1.2" fill="#fff" />
                </g>
              ))}
            </g>
          )}

          {/* Water Refill Points */}
          {showWater && (
            <g>
              {locations.slice(0, 7).map((loc) => (
                <g key={`water-${loc.id}`} transform={`translate(${loc.gridPos.x + 12}, ${loc.gridPos.y + 18})`}>
                  <circle cx="7" cy="7" r="7" fill="#0891b2" />
                  <circle cx="7" cy="7" r="2.5" fill="#fff" />
                </g>
              ))}
            </g>
          )}

          {/* Campus Buildings Footprints & Markers */}
          {locations.map((loc) => {
            const isSelected = selectedLocation?.id === loc.id;
            const isHovered = hoveredLocation?.id === loc.id;
            const isSource = activeRoute?.fromLocation.id === loc.id;
            const isDest = activeRoute?.toLocation.id === loc.id;

            return (
              <g
                key={loc.id}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelectLocation(loc)}
                onMouseEnter={() => setHoveredLocation(loc)}
                onMouseLeave={() => setHoveredLocation(null)}
              >
                {/* Destination pulse ring */}
                {isDest && (
                  <circle
                    cx={loc.gridPos.x}
                    cy={loc.gridPos.y}
                    r="40"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    className="map-pin-pulse"
                  />
                )}

                {/* Building Footprint Box */}
                <rect
                  x={loc.gridPos.x - 42}
                  y={loc.gridPos.y - 24}
                  width="84"
                  height="48"
                  rx="10"
                  fill={
                    isSelected
                      ? '#2563eb'
                      : isDest
                      ? '#dc2626'
                      : isSource
                      ? '#16a34a'
                      : isHovered
                      ? '#334155'
                      : '#1e293b'
                  }
                  stroke={
                    isSelected
                      ? '#93c5fd'
                      : isDest
                      ? '#fca5a5'
                      : isSource
                      ? '#86efac'
                      : '#475569'
                  }
                  strokeWidth={isSelected || isDest || isSource ? '2.5' : '1.5'}
                  filter="url(#buildingShadow)"
                />

                {/* Building Code Badge */}
                <text
                  x={loc.gridPos.x}
                  y={loc.gridPos.y - 5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  fontWeight="bold"
                >
                  {loc.code}
                </text>

                {/* Building Short Name */}
                <text
                  x={loc.gridPos.x}
                  y={loc.gridPos.y + 12}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="8"
                  fontWeight="600"
                >
                  {loc.name.length > 14 ? loc.name.substring(0, 12) + '...' : loc.name}
                </text>
              </g>
            );
          })}

          {/* Animated Walker Pin (when route is computed or simulation runs) */}
          {activeRoute && (
            <g transform={`translate(${walkerPos.x}, ${walkerPos.y})`}>
              <circle r="12" fill="#38bdf8" opacity="0.3" className="animate-ping" />
              <circle r="9" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
              <circle r="3" fill="#ffffff" />
            </g>
          )}

          {/* Compass Rose */}
          <g transform="translate(920, 80)">
            <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <polygon points="0,-16 5,0 -5,0" fill="#ef4444" />
            <polygon points="0,16 5,0 -5,0" fill="#94a3b8" />
            <text x="0" y="-19" textAnchor="middle" fill="#f87171" fontSize="9" fontWeight="bold">N</text>
            <text x="0" y="27" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">S</text>
            <text x="26" y="3" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">E</text>
            <text x="-26" y="3" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">W</text>
          </g>
        </svg>
      </div>

      {/* Bottom Status / Selection Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-lg text-xs">
        <div className="flex items-center gap-2 truncate">
          <Compass className="w-4 h-4 text-blue-400 shrink-0" />
          {selectedLocation ? (
            <div className="truncate">
              <span className="text-white font-bold">{selectedLocation.name}</span>
              <span className="text-slate-400 ml-2">({selectedLocation.code}) · {selectedLocation.block}</span>
            </div>
          ) : (
            <span className="text-slate-400">
              Click any campus building to inspect floor plans and view facilities
            </span>
          )}
        </div>

        {selectedLocation && (
          <button
            onClick={() => onSelectLocation(selectedLocation)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors cursor-pointer shrink-0"
          >
            Open Details
          </button>
        )}
      </div>
    </div>
  );
};
