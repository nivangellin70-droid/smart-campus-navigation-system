import React, { useState } from 'react';
import { CampusLocation, LocationCategory } from '../types/campus';
import {
  Search,
  X,
  Filter,
  Layers,
  LayoutGrid,
  List,
  Navigation,
  Accessibility,
  Clock,
  Sparkles,
  Building,
  RotateCcw,
} from 'lucide-react';

interface SearchViewProps {
  locations: CampusLocation[];
  initialQuery?: string;
  initialCategory?: LocationCategory | 'all';
  onSelectLocation: (loc: CampusLocation) => void;
  onNavigateTo: (loc: CampusLocation) => void;
  onNavigateFrom: (loc: CampusLocation) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  locations,
  initialQuery = '',
  initialCategory = 'all',
  onSelectLocation,
  onNavigateTo,
  onNavigateFrom,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<LocationCategory | 'all'>(initialCategory);
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Unique blocks
  const allBlocks = Array.from(new Set(locations.map((l) => l.block)));

  // Filtered results
  const filtered = locations.filter((loc) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      loc.name.toLowerCase().includes(q) ||
      loc.code.toLowerCase().includes(q) ||
      loc.description.toLowerCase().includes(q) ||
      loc.facilities.some((f) => f.toLowerCase().includes(q)) ||
      loc.floors.some((fl) => fl.rooms.some((r) => r.toLowerCase().includes(q)));

    const matchesCategory = selectedCategory === 'all' || loc.category === selectedCategory;
    const matchesAccessible = !accessibleOnly || loc.isAccessible;
    const matchesBlock = selectedBlock === 'all' || loc.block === selectedBlock;

    return matchesQuery && matchesCategory && matchesAccessible && matchesBlock;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setAccessibleOnly(false);
    setSelectedBlock('all');
  };

  const categories: { label: string; cat: LocationCategory | 'all' }[] = [
    { label: 'All', cat: 'all' },
    { label: 'Libraries', cat: 'library' },
    { label: 'Laboratories', cat: 'laboratory' },
    { label: 'Classrooms', cat: 'classroom' },
    { label: 'Canteens', cat: 'canteen' },
    { label: 'Administration', cat: 'administrative' },
    { label: 'Auditoriums', cat: 'auditorium' },
    { label: 'Sports', cat: 'sports' },
    { label: 'Amenities', cat: 'amenity' },
    { label: 'Gates', cat: 'entrance' },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Search Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Campus Directory & Facility Search
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Locate academic lecture halls, departmental offices, research labs, dining hubs, and restrooms across campus.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by building name, code, room number (e.g. CS-101), department, or facility..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Interactive Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.cat}
              onClick={() => setSelectedCategory(c.cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                selectedCategory === c.cat
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Secondary Filter Row: Accessibility, Block, View Mode */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Accessible checkbox */}
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-slate-900 select-none">
              <input
                type="checkbox"
                checked={accessibleOnly}
                onChange={(e) => setAccessibleOnly(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <Accessibility className="w-3.5 h-3.5 text-emerald-600" />
              <span>Wheelchair Accessible Only</span>
            </label>

            {/* Block filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Campus Zone:</span>
              <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
              >
                <option value="all">All Zones</option>
                {allBlocks.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count & Reset */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1">
        <span>
          Showing <strong className="text-slate-900">{filtered.length}</strong> matching locations
        </span>
        {(searchQuery || selectedCategory !== 'all' || accessibleOnly || selectedBlock !== 'all') && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Zero State */}
      {filtered.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No matching campus locations found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              We couldn't find any location matching "{searchQuery}". Try searching for broader terms like "Library", "Computer", "Lab", "Hostel", or clear active filters.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between p-5 space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100">
                    {loc.code}
                  </span>
                  <span className="text-[11px] text-slate-500 uppercase font-medium">
                    {loc.block}
                  </span>
                </div>

                <h3
                  onClick={() => onSelectLocation(loc)}
                  className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {loc.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {loc.shortDescription}
                </p>

                {/* Facilities Mini Strip */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {loc.facilities.slice(0, 3).map((fac, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md border border-slate-100"
                    >
                      {fac}
                    </span>
                  ))}
                  {loc.facilities.length > 3 && (
                    <span className="text-[10px] text-slate-400 self-center">
                      +{loc.facilities.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => onSelectLocation(loc)}
                  className="font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  View Details & Rooms
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onNavigateTo(loc)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Route</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Detailed List / Table View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-800 font-bold uppercase tracking-wider border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Building Name</th>
                  <th className="px-4 py-3">Zone / Block</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Storeys</th>
                  <th className="px-4 py-3">Ramp Access</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((loc) => (
                  <tr key={loc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-blue-700">
                      {loc.code}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      <button
                        onClick={() => onSelectLocation(loc)}
                        className="hover:text-blue-600 transition-colors text-left font-bold"
                      >
                        {loc.name}
                      </button>
                      <span className="block text-[11px] text-slate-500 font-normal truncate max-w-xs">
                        {loc.shortDescription}
                      </span>
                    </td>
                    <td className="px-4 py-3">{loc.block}</td>
                    <td className="px-4 py-3 capitalize">{loc.category}</td>
                    <td className="px-4 py-3 tabular-nums">{loc.floorCount}</td>
                    <td className="px-4 py-3">
                      {loc.isAccessible ? (
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <Accessibility className="w-3.5 h-3.5" />
                          <span>Yes</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Standard</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => onSelectLocation(loc)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onNavigateTo(loc)}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold inline-flex items-center gap-1"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Route</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
