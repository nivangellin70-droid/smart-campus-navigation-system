import React, { useState } from 'react';
import { CampusLocation, LocationCategory } from '../types/campus';
import {
  Search,
  Route as RouteIcon,
  Compass,
  Building,
  GraduationCap,
  Layers,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  Navigation,
  Accessibility,
  Flame,
  Footprints,
} from 'lucide-react';

interface HomeViewProps {
  locations: CampusLocation[];
  onSelectLocation: (loc: CampusLocation) => void;
  onNavigateTo: (loc: CampusLocation) => void;
  onNavigateBetween: (fromLocId: string, toLocId: string) => void;
  onGoToSearch: (query?: string, category?: LocationCategory) => void;
  onGoToMap: (loc?: CampusLocation) => void;
  onGoToAbout: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  locations,
  onSelectLocation,
  onNavigateTo,
  onNavigateBetween,
  onGoToSearch,
  onGoToMap,
  onGoToAbout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [quickSource, setQuickSource] = useState('gate-01');
  const [quickDestination, setQuickDestination] = useState('lib-01');

  // Quick categories
  const categories: { label: string; cat: LocationCategory; count: number }[] = [
    { label: 'Libraries & Study', cat: 'library', count: locations.filter((l) => l.category === 'library').length },
    { label: 'Laboratories & IT', cat: 'laboratory', count: locations.filter((l) => l.category === 'laboratory').length },
    { label: 'Classrooms & Theatres', cat: 'classroom', count: locations.filter((l) => l.category === 'classroom').length },
    { label: 'Food & Cafeterias', cat: 'canteen', count: locations.filter((l) => l.category === 'canteen').length },
    { label: 'Administrative Offices', cat: 'administrative', count: locations.filter((l) => l.category === 'administrative').length },
    { label: 'Auditorium & Halls', cat: 'auditorium', count: locations.filter((l) => l.category === 'auditorium').length },
  ];

  // Filtered preview for quick search
  const filteredQuickLocations = searchQuery.trim()
    ? locations.filter(
        (l) =>
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.facilities.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleQuickRouteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSource && quickDestination) {
      onNavigateBetween(quickSource, quickDestination);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/campus_aerial_quad_1792055414937.jpg"
            alt="Collegiate University Campus Quad"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-14 sm:py-20 text-center space-y-6">
          {/* Editorial Title */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white text-balance">
              Smart Campus Navigation & Interactive Wayfinding
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Find classrooms, computing centers, research laboratories, libraries, dining halls, and administrative offices with step-by-step walking routes.
            </p>
          </div>

          {/* Prominent Live Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 text-slate-900">
              <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
              <input
                type="text"
                placeholder="Search by building name, room, department, or facility (e.g. Library, AI Lab, ATM)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    onGoToSearch(searchQuery.trim());
                  }
                }}
                className="w-full px-4 py-3.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                onClick={() => onGoToSearch(searchQuery)}
                className="mr-1.5 px-4 sm:px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0"
              >
                Search
              </button>
            </div>

            {/* Quick Live Autocomplete Results */}
            {filteredQuickLocations.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 z-30 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-left divide-y divide-slate-100">
                {filteredQuickLocations.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => onSelectLocation(loc)}
                    className="p-3 hover:bg-blue-50 transition-colors cursor-pointer flex items-center justify-between gap-3 text-slate-900"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{loc.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                          {loc.code}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">{loc.block} · {loc.shortDescription}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Navigation CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onGoToMap()}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Interactive Campus Map</span>
            </button>
            <button
              onClick={() => onGoToAbout()}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-medium transition-colors cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>View VAC Project Deliverables</span>
            </button>
          </div>
        </div>
      </section>

      {/* Quick Category Browsing Tabs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Browse by Campus Zone & Facility
          </h2>
          <button
            onClick={() => onGoToSearch()}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({locations.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((catItem) => (
            <button
              key={catItem.cat}
              onClick={() => onGoToSearch('', catItem.cat)}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                {catItem.label}
              </span>
              <span className="text-[11px] text-slate-400 mt-2">
                {catItem.count} {catItem.count === 1 ? 'Location' : 'Locations'}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 2-Column Split: Key Campus Destinations & Quick Route Calculator */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Popular Locations Grid (8 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Key Campus Destinations
            </h2>
            <span className="text-xs text-slate-500">Quick wayfinding access</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {locations.slice(0, 6).map((loc) => (
              <div
                key={loc.id}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded border border-blue-100">
                      {loc.code}
                    </span>
                    <span className="text-[11px] text-slate-500 uppercase font-medium">
                      {loc.block}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectLocation(loc)}
                    className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer text-sm leading-snug"
                  >
                    {loc.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {loc.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectLocation(loc)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onNavigateTo(loc)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Navigate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Instant Wayfinding Widget (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-blue-800/50 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
              <RouteIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Instant Wayfinding</h3>
              <p className="text-xs text-blue-200">Calculate walking path & ETA</p>
            </div>
          </div>

          <form onSubmit={handleQuickRouteSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-blue-200 mb-1">
                Starting Location:
              </label>
              <select
                value={quickSource}
                onChange={(e) => setQuickSource(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-400"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id} className="bg-slate-900 text-white">
                    {loc.name} ({loc.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-blue-200 mb-1">
                Destination:
              </label>
              <select
                value={quickDestination}
                onChange={(e) => setQuickDestination(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-400"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id} className="bg-slate-900 text-white">
                    {loc.name} ({loc.code})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Turn-by-Turn Directions</span>
            </button>
          </form>

          {/* Quick Metrics Guarantee */}
          <div className="pt-3 border-t border-blue-800/60 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-800/60 p-2 rounded-lg">
              <Footprints className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <span className="text-slate-400 block text-[10px]">Shortest Path</span>
              <span className="font-bold text-white">Dijkstra A*</span>
            </div>
            <div className="bg-slate-800/60 p-2 rounded-lg">
              <Accessibility className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span className="text-slate-400 block text-[10px]">Accessible</span>
              <span className="font-bold text-white">Step-Free</span>
            </div>
            <div className="bg-slate-800/60 p-2 rounded-lg">
              <Clock className="w-4 h-4 text-sky-400 mx-auto mb-1" />
              <span className="text-slate-400 block text-[10px]">Pace Speed</span>
              <span className="font-bold text-white">~75 m/min</span>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Emergency & Helpdesk Quick Strip */}
      <section className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold">
            SOS
          </div>
          <div>
            <span className="font-bold text-slate-900 block">Campus Emergency & First Aid Helpline</span>
            <span className="text-slate-600">Health Centre Ambulance: +91 80 2345 6800 · Main Security Post: Ext. 6001</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectLocation(locations.find((l) => l.id === 'med-01') || locations[0])}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-800 rounded-lg font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Health Centre
          </button>
          <button
            onClick={() => onSelectLocation(locations.find((l) => l.id === 'gate-01') || locations[0])}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Security Post
          </button>
        </div>
      </section>
    </div>
  );
};
