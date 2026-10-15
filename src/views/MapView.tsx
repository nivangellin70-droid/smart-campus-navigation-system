import React, { useState } from 'react';
import { CampusLocation, RouteComputationResult, LocationCategory } from '../types/campus';
import { CampusBlueprintMap } from '../components/CampusBlueprintMap';
import { LeafletCampusMap } from '../components/LeafletCampusMap';
import {
  Map,
  Compass,
  Layers,
  Search,
  Navigation,
  Info,
  Building,
  CheckCircle2,
  Accessibility,
} from 'lucide-react';

interface MapViewProps {
  locations: CampusLocation[];
  selectedLocation: CampusLocation | null;
  onSelectLocation: (loc: CampusLocation) => void;
  onNavigateTo: (loc: CampusLocation) => void;
  onNavigateFrom: (loc: CampusLocation) => void;
  activeRoute: RouteComputationResult | null;
}

export const MapView: React.FC<MapViewProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  onNavigateTo,
  onNavigateFrom,
  activeRoute,
}) => {
  const [mapEngine, setMapEngine] = useState<'blueprint' | 'leaflet'>('blueprint');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LocationCategory | 'all'>('all');

  const filteredLocations = locations.filter((loc) => {
    const matchesSearch =
      loc.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      loc.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
      loc.block.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || loc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Map Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600" />
            Interactive Campus Cartography
          </h1>
          <p className="text-xs text-slate-500">
            Switch between the architectural SVG blueprint and real-world OpenStreetMap GIS view.
          </p>
        </div>

        {/* Dual Engine Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0 self-start sm:self-center">
          <button
            onClick={() => setMapEngine('blueprint')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mapEngine === 'blueprint'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Campus Blueprint (Vector)</span>
          </button>
          <button
            onClick={() => setMapEngine('leaflet')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mapEngine === 'leaflet'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>OpenStreetMap (Leaflet)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Map (8 cols) + Directory Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Viewport Area (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {mapEngine === 'blueprint' ? (
            <CampusBlueprintMap
              locations={locations}
              selectedLocation={selectedLocation}
              onSelectLocation={onSelectLocation}
              activeRoute={activeRoute}
            />
          ) : (
            <LeafletCampusMap
              locations={locations}
              selectedLocation={selectedLocation}
              onSelectLocation={onSelectLocation}
              onNavigateTo={onNavigateTo}
              activeRoute={activeRoute}
            />
          )}

          {/* Map Info Bar / Active Route Indicator */}
          {activeRoute && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-blue-900">
                  Active Route: {activeRoute.fromLocation.name} → {activeRoute.toLocation.name}
                </span>
                <span className="text-slate-600">
                  ({activeRoute.totalDistanceMeters}m · ~{activeRoute.estimatedMinutes} min walk)
                </span>
              </div>
              <button
                onClick={() => onNavigateTo(activeRoute.toLocation)}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Open Full Wayfinding
              </button>
            </div>
          )}
        </div>

        {/* Directory Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-blue-600" />
                Campus Buildings Directory
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">
                {filteredLocations.length} results
              </span>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter by building or code..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category Filter dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="library">Libraries & Reading Halls</option>
              <option value="laboratory">Laboratories & Computing</option>
              <option value="classroom">Classrooms & Theatres</option>
              <option value="canteen">Canteen & Cafeterias</option>
              <option value="administrative">Administrative Offices</option>
              <option value="auditorium">Auditoriums & Conventions</option>
              <option value="sports">Sports Complex</option>
              <option value="amenity">Health & Residencies</option>
              <option value="entrance">Campus Entrance Gates</option>
            </select>

            {/* Scrollable Location List */}
            <div className="max-h-[380px] overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100">
              {filteredLocations.map((loc) => {
                const isSelected = selectedLocation?.id === loc.id;
                return (
                  <div
                    key={loc.id}
                    onClick={() => onSelectLocation(loc)}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer text-xs space-y-1 ${
                      isSelected
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate">
                        {loc.name}
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold ml-2 shrink-0">
                        {loc.code}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>{loc.block}</span>
                      <span className="capitalize">{loc.category}</span>
                    </div>

                    {isSelected && (
                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-blue-100 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateFrom(loc);
                          }}
                          className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-100 font-semibold"
                        >
                          From Here
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateTo(loc);
                          }}
                          className="px-2.5 py-1 bg-blue-600 rounded text-white hover:bg-blue-700 font-semibold flex items-center gap-1"
                        >
                          <Navigation className="w-2.5 h-2.5" />
                          <span>Route</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
