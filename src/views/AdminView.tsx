import React, { useState } from 'react';
import { CampusLocation, LocationCategory } from '../types/campus';
import {
  ShieldAlert,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  Download,
  Lock,
  Unlock,
  Building,
  CheckCircle2,
  Accessibility,
  Search,
  X,
  FileCode,
  Layers,
} from 'lucide-react';

interface AdminViewProps {
  locations: CampusLocation[];
  onAddLocation: (loc: CampusLocation) => void;
  onUpdateLocation: (loc: CampusLocation) => void;
  onDeleteLocation: (id: string) => void;
  onResetToDefault: () => void;
  onSelectLocation: (loc: CampusLocation) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  locations,
  onAddLocation,
  onUpdateLocation,
  onDeleteLocation,
  onResetToDefault,
  onSelectLocation,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal forms
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<CampusLocation | null>(null);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    code: '',
    category: 'classroom' as LocationCategory,
    block: 'Block A (Academic Core)',
    shortDescription: '',
    description: '',
    floorCount: 2,
    facilitiesString: 'Wi-Fi, Wheelchair Ramp, Restrooms, Drinking Water',
    openingWeekdays: '08:30 AM – 06:00 PM',
    inChargeName: '',
    inChargePhone: '+91 80 2345 6000',
    inChargeEmail: 'info@campus.edu.in',
    lat: 12.9730,
    lng: 77.5940,
    gridX: 500,
    gridY: 450,
    isAccessible: true,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase() === 'admin' || passcode === 'campus2026') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleOpenAdd = () => {
    const nextNum = locations.length + 1;
    setFormData({
      id: `loc-custom-${Date.now()}`,
      name: '',
      code: `BLD-0${nextNum}`,
      category: 'classroom',
      block: 'Block A (Academic Core)',
      shortDescription: '',
      description: '',
      floorCount: 2,
      facilitiesString: 'Wi-Fi, Wheelchair Ramp, Restrooms, Drinking Water',
      openingWeekdays: '08:30 AM – 06:00 PM',
      inChargeName: 'Prof. Campus Coordinator',
      inChargePhone: '+91 80 2345 6150',
      inChargeEmail: 'coordinator@campus.edu.in',
      lat: 12.9730,
      lng: 77.5940,
      gridX: 500,
      gridY: 450,
      isAccessible: true,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (loc: CampusLocation) => {
    setEditingLocation(loc);
    setFormData({
      id: loc.id,
      name: loc.name,
      code: loc.code,
      category: loc.category,
      block: loc.block,
      shortDescription: loc.shortDescription,
      description: loc.description,
      floorCount: loc.floorCount,
      facilitiesString: loc.facilities.join(', '),
      openingWeekdays: loc.openingHours.weekdays,
      inChargeName: loc.contact.inCharge,
      inChargePhone: loc.contact.phone,
      inChargeEmail: loc.contact.email,
      lat: loc.coordinates.lat,
      lng: loc.coordinates.lng,
      gridX: loc.gridPos.x,
      gridY: loc.gridPos.y,
      isAccessible: loc.isAccessible,
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    const facilitiesArray = formData.facilitiesString
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    const newOrUpdatedLocation: CampusLocation = {
      id: formData.id || `loc-${Date.now()}`,
      name: formData.name,
      code: formData.code.toUpperCase(),
      category: formData.category,
      block: formData.block,
      shortDescription: formData.shortDescription || `${formData.name} located in ${formData.block}.`,
      description: formData.description || `${formData.name} serving the academic community.`,
      floorCount: Number(formData.floorCount) || 1,
      floors: [
        {
          floorNumber: 0,
          floorName: 'Ground Floor',
          rooms: ['Main Lobby', 'Enquiry Office', 'Faculty Room 101'],
        },
      ],
      facilities: facilitiesArray.length > 0 ? facilitiesArray : ['General Facilities'],
      openingHours: {
        weekdays: formData.openingWeekdays || '09:00 AM – 05:00 PM',
        saturday: '09:00 AM – 01:00 PM',
        sunday: 'Closed',
      },
      contact: {
        inCharge: formData.inChargeName || 'Department In-Charge',
        designation: 'Officer in Charge',
        phone: formData.inChargePhone,
        email: formData.inChargeEmail,
        officeRoom: 'Room 101',
      },
      coordinates: {
        lat: Number(formData.lat) || 12.9730,
        lng: Number(formData.lng) || 77.5940,
      },
      gridPos: {
        x: Number(formData.gridX) || 500,
        y: Number(formData.gridY) || 450,
      },
      isAccessible: formData.isAccessible,
      hasElevator: formData.floorCount > 1,
    };

    if (editingLocation) {
      onUpdateLocation(newOrUpdatedLocation);
      setEditingLocation(null);
    } else {
      onAddLocation(newOrUpdatedLocation);
      setIsAddModalOpen(false);
    }
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(locations, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart_campus_locations_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportSQL = () => {
    let sql = `-- Smart Campus Navigation System - SQLite Database Dump\n`;
    sql += `CREATE TABLE IF NOT EXISTS locations (id TEXT PRIMARY KEY, name TEXT, code TEXT UNIQUE, category TEXT, block TEXT, description TEXT, floor_count INTEGER, facilities TEXT, lat REAL, lng REAL, is_accessible INTEGER);\n\n`;

    locations.forEach((l) => {
      const escName = l.name.replace(/'/g, "''");
      const escDesc = l.description.replace(/'/g, "''");
      const escFac = l.facilities.join(', ').replace(/'/g, "''");
      sql += `INSERT OR REPLACE INTO locations VALUES ('${l.id}', '${escName}', '${l.code}', '${l.category}', '${l.block}', '${escDesc}', ${l.floorCount}, '${escFac}', ${l.coordinates.lat}, ${l.coordinates.lng}, ${l.isAccessible ? 1 : 0});\n`;
    });

    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campus_locations_dump_${Date.now()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLocations = locations.filter((loc) => {
    const q = searchFilter.toLowerCase();
    const matchesSearch =
      !q ||
      loc.name.toLowerCase().includes(q) ||
      loc.code.toLowerCase().includes(q) ||
      loc.block.toLowerCase().includes(q);

    const matchesCategory = selectedCategory === 'all' || loc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // If not logged in, show lock screen with quick demo unlock
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Administrator Authentication
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access the institutional administrative portal to manage campus buildings, facilities, and records.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter passcode (e.g. admin or campus2026)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-2.5 text-center text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
            />
            {authError && (
              <span className="text-xs text-red-600 mt-1 block">
                Incorrect passcode. Try "admin" or "campus2026".
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            Authenticate & Proceed
          </button>

          <button
            type="button"
            onClick={() => {
              setPasscode('admin');
              setIsAuthenticated(true);
            }}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            One-Click Demo Unlock (Passcode: admin)
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Admin Dashboard Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Authorized Session Active
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Campus Master Database Administration
          </h1>
          <p className="text-xs text-slate-500">
            Create, update, audit, or export campus building locations, coordinates, and facilities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Location</span>
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            Lock Session
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Total Buildings</span>
          <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {locations.length}
          </span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Accessible Ramps</span>
          <span className="text-2xl font-extrabold text-emerald-600 tabular-nums">
            {locations.filter((l) => l.isAccessible).length}
          </span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Unique Zones</span>
          <span className="text-2xl font-extrabold text-blue-600 tabular-nums">
            {Array.from(new Set(locations.map((l) => l.block))).length}
          </span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Multi-Storey</span>
          <span className="text-2xl font-extrabold text-indigo-600 tabular-nums">
            {locations.filter((l) => l.floorCount > 1).length}
          </span>
        </div>
      </div>

      {/* Database Controls Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search table..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="library">Library</option>
            <option value="laboratory">Laboratory</option>
            <option value="classroom">Classroom</option>
            <option value="canteen">Canteen</option>
            <option value="administrative">Administrative</option>
            <option value="auditorium">Auditorium</option>
            <option value="sports">Sports</option>
            <option value="amenity">Amenity</option>
            <option value="entrance">Entrance</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handleExportSQL}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Export SQLite SQL</span>
          </button>
          <button
            onClick={() => {
              if (window.confirm('Reset entire campus location database back to original sample seeds?')) {
                onResetToDefault();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Sample Seeds</span>
          </button>
        </div>
      </div>

      {/* Locations Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-800 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Building Name</th>
                <th className="px-4 py-3">Zone / Block</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Coordinates (Lat, Lng)</th>
                <th className="px-4 py-3">Accessible</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLocations.map((loc) => (
                <tr key={loc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-blue-700">
                    {loc.code}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    <button
                      onClick={() => onSelectLocation(loc)}
                      className="hover:text-blue-600 text-left font-bold"
                    >
                      {loc.name}
                    </button>
                    <span className="block text-[11px] text-slate-400 font-normal">
                      {loc.contact.inCharge}
                    </span>
                  </td>
                  <td className="px-4 py-3">{loc.block}</td>
                  <td className="px-4 py-3 capitalize">{loc.category}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-500 tabular-nums">
                    {loc.coordinates.lat.toFixed(4)}, {loc.coordinates.lng.toFixed(4)}
                  </td>
                  <td className="px-4 py-3">
                    {loc.isAccessible ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ramp</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">Standard</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-1.5">
                    <button
                      onClick={() => handleOpenEdit(loc)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit Location"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteCandidateId(loc.id)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Location"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Confirm Location Removal
            </h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete this campus location? This action will remove it from the map and wayfinding directory.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteCandidateId(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteLocation(deleteCandidateId);
                  setDeleteCandidateId(null);
                }}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Delete Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Location Modal Form */}
      {(isAddModalOpen || editingLocation) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">
                {editingLocation ? 'Edit Campus Location' : 'Add New Campus Location'}
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingLocation(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Building / Facility Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chemical Engineering Annex"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Unique Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CHE-01"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 font-mono uppercase bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="classroom">Classroom / Lecture Hall</option>
                    <option value="laboratory">Laboratory / IT Hub</option>
                    <option value="library">Library & Reading Space</option>
                    <option value="canteen">Canteen & Cafeteria</option>
                    <option value="administrative">Administrative Office</option>
                    <option value="auditorium">Auditorium / Convention</option>
                    <option value="sports">Sports Complex</option>
                    <option value="amenity">Health & Residencies</option>
                    <option value="entrance">Campus Gate</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Campus Block / Zone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Block A (Academic Core)"
                    value={formData.block}
                    onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Brief Summary
                </label>
                <input
                  type="text"
                  placeholder="One sentence summary of primary function"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Detailed Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Comprehensive description of departments and functions..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Number of Floors
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.floorCount}
                    onChange={(e) => setFormData({ ...formData, floorCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Opening Hours
                  </label>
                  <input
                    type="text"
                    placeholder="08:30 AM – 06:00 PM"
                    value={formData.openingWeekdays}
                    onChange={(e) => setFormData({ ...formData, openingWeekdays: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Facilities (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Wi-Fi, Air Conditioning, Wheelchair Ramp, Restrooms"
                  value={formData.facilitiesString}
                  onChange={(e) => setFormData({ ...formData, facilitiesString: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: Number(e.target.value) })}
                    className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: Number(e.target.value) })}
                    className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.isAccessible}
                    onChange={(e) => setFormData({ ...formData, isAccessible: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Wheelchair Ramp & Elevator Available</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingLocation(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  {editingLocation ? 'Save Updates' : 'Add to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
