import React, { useState } from 'react';
import { useCampusLocations } from './hooks/useCampusLocations';
import { CampusLocation, RouteComputationResult, LocationCategory } from './types/campus';
import { Navbar } from './components/Navbar';
import { HomeView } from './views/HomeView';
import { MapView } from './views/MapView';
import { SearchView } from './views/SearchView';
import { NavigationView } from './views/NavigationView';
import { AboutView } from './views/AboutView';
import { AdminView } from './views/AdminView';
import { LocationDetailsModal } from './components/LocationDetailsModal';
import {
  X,
  Navigation,
  Compass,
  ArrowRight,
} from 'lucide-react';

export default function App() {
  const {
    locations,
    addLocation,
    updateLocation,
    deleteLocation,
    resetToDefault,
  } = useCampusLocations();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null);
  const [activeRoute, setActiveRoute] = useState<RouteComputationResult | null>(null);

  // Navigation page pre-fill states
  const [navSourceId, setNavSourceId] = useState<string>('gate-01');
  const [navDestId, setNavDestId] = useState<string>('lib-01');

  // Search view pre-fill states
  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');
  const [searchInitialCategory, setSearchInitialCategory] = useState<LocationCategory | 'all'>('all');

  // Quick Route Modal
  const [isQuickRouteModalOpen, setIsQuickRouteModalOpen] = useState(false);
  const [quickModalSource, setQuickModalSource] = useState('gate-01');
  const [quickModalDest, setQuickModalDest] = useState('lib-01');

  const handleNavigateTo = (targetLoc: CampusLocation) => {
    setNavDestId(targetLoc.id);
    setActiveTab('navigation');
  };

  const handleNavigateFrom = (startLoc: CampusLocation) => {
    setNavSourceId(startLoc.id);
    setActiveTab('navigation');
  };

  const handleNavigateBetween = (fromId: string, toId: string) => {
    setNavSourceId(fromId);
    setNavDestId(toId);
    setActiveTab('navigation');
  };

  const handleGoToSearch = (query: string = '', category: LocationCategory | 'all' = 'all') => {
    setSearchInitialQuery(query);
    setSearchInitialCategory(category);
    setActiveTab('search');
  };

  const handleGoToMap = (loc?: CampusLocation) => {
    if (loc) setSelectedLocation(loc);
    setActiveTab('map');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickRoute={() => setIsQuickRouteModalOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'home' && (
          <HomeView
            locations={locations}
            onSelectLocation={(loc) => setSelectedLocation(loc)}
            onNavigateTo={handleNavigateTo}
            onNavigateBetween={handleNavigateBetween}
            onGoToSearch={handleGoToSearch}
            onGoToMap={handleGoToMap}
            onGoToAbout={() => setActiveTab('about')}
          />
        )}

        {activeTab === 'map' && (
          <MapView
            locations={locations}
            selectedLocation={selectedLocation}
            onSelectLocation={(loc) => setSelectedLocation(loc)}
            onNavigateTo={handleNavigateTo}
            onNavigateFrom={handleNavigateFrom}
            activeRoute={activeRoute}
          />
        )}

        {activeTab === 'search' && (
          <SearchView
            locations={locations}
            initialQuery={searchInitialQuery}
            initialCategory={searchInitialCategory}
            onSelectLocation={(loc) => setSelectedLocation(loc)}
            onNavigateTo={handleNavigateTo}
            onNavigateFrom={handleNavigateFrom}
          />
        )}

        {activeTab === 'navigation' && (
          <NavigationView
            locations={locations}
            initialSourceId={navSourceId}
            initialDestinationId={navDestId}
            onSelectLocation={(loc) => setSelectedLocation(loc)}
            onActiveRouteChanged={(route) => setActiveRoute(route)}
          />
        )}

        {activeTab === 'about' && <AboutView />}

        {activeTab === 'admin' && (
          <AdminView
            locations={locations}
            onAddLocation={addLocation}
            onUpdateLocation={updateLocation}
            onDeleteLocation={deleteLocation}
            onResetToDefault={resetToDefault}
            onSelectLocation={(loc) => setSelectedLocation(loc)}
          />
        )}
      </main>

      {/* Campus Building Details Modal */}
      <LocationDetailsModal
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
        onNavigateTo={handleNavigateTo}
        onNavigateFrom={handleNavigateFrom}
        onViewOnMap={(loc) => {
          setSelectedLocation(loc);
          setActiveTab('map');
        }}
      />

      {/* Quick Route Modal Launcher */}
      {isQuickRouteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Quick Route Finder
                </h3>
              </div>
              <button
                onClick={() => setIsQuickRouteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Starting Point:
                </label>
                <select
                  value={quickModalSource}
                  onChange={(e) => setQuickModalSource(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Destination:
                </label>
                <select
                  value={quickModalDest}
                  onChange={(e) => setQuickModalDest(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.code})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  handleNavigateBetween(quickModalSource, quickModalDest);
                  setIsQuickRouteModalOpen(false);
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-xs cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Calculate Path & View Directions</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Academic Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-700">
            <Compass className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-900">Smart Campus Navigation System</span>
            <span aria-hidden="true">·</span>
            <span>Value Added Course (VAC) on Web Application Development</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Graph Dijkstra Algorithm</span>
            <span aria-hidden="true">·</span>
            <span>Leaflet & OpenStreetMap</span>
            <span aria-hidden="true">·</span>
            <span>Flask & SQLite</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
