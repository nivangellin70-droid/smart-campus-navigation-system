import React, { useState } from 'react';
import { CampusLocation } from '../types/campus';
import {
  X,
  MapPin,
  Clock,
  Phone,
  Mail,
  User,
  CheckCircle2,
  Navigation,
  Layers,
  Sparkles,
  Accessibility,
  Building,
} from 'lucide-react';

interface LocationDetailsModalProps {
  location: CampusLocation | null;
  onClose: () => void;
  onNavigateTo: (loc: CampusLocation) => void;
  onNavigateFrom: (loc: CampusLocation) => void;
  onViewOnMap: (loc: CampusLocation) => void;
}

export const LocationDetailsModal: React.FC<LocationDetailsModalProps> = ({
  location,
  onClose,
  onNavigateTo,
  onNavigateFrom,
  onViewOnMap,
}) => {
  const [activeFloorIndex, setActiveFloorIndex] = useState(0);

  if (!location) return null;

  const currentFloor = location.floors[activeFloorIndex] || location.floors[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-semibold tracking-wide uppercase px-2 py-0.5 bg-blue-800/80 rounded border border-blue-400/30">
                  {location.code}
                </span>
                <span className="text-xs text-blue-200 uppercase font-medium">
                  {location.block}
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                {location.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Overview & Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-600" />
              Building Overview
            </h3>
            <p className="leading-relaxed text-slate-700">
              {location.description}
            </p>
          </div>

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 block">Category</span>
              <span className="font-semibold text-slate-900 capitalize">
                {location.category}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Floors</span>
              <span className="font-semibold text-slate-900 tabular-nums">
                {location.floorCount} {location.floorCount > 1 ? 'Storeys' : 'Storey'}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Accessibility</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1">
                {location.isAccessible ? (
                  <>
                    <Accessibility className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Wheelchair Ready</span>
                  </>
                ) : (
                  <span>Standard Access</span>
                )}
              </span>
            </div>
          </div>

          {/* Operating Hours */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Operational Timings
            </h3>
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-600">Monday – Friday</span>
                <span className="font-semibold text-slate-900">{location.openingHours.weekdays}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-t border-slate-200/60">
                <span className="text-slate-600">Saturday</span>
                <span className="font-semibold text-slate-900">{location.openingHours.saturday}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-t border-slate-200/60">
                <span className="text-slate-600">Sunday / Holidays</span>
                <span className="font-semibold text-slate-900">{location.openingHours.sunday}</span>
              </div>
            </div>
          </div>

          {/* Floor Directory Tabs */}
          {location.floors && location.floors.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                Indoor Floor Directory & Rooms
              </h3>

              {/* Floor switcher buttons */}
              <div className="flex flex-wrap gap-1.5 mb-3 p-1 bg-slate-100 rounded-lg">
                {location.floors.map((floor, idx) => (
                  <button
                    key={floor.floorNumber}
                    onClick={() => setActiveFloorIndex(idx)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      activeFloorIndex === idx
                        ? 'bg-white text-blue-700 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {floor.floorName}
                  </button>
                ))}
              </div>

              {/* Rooms list on selected floor */}
              {currentFloor && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-700 block mb-2">
                    Housed in {currentFloor.floorName}:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentFloor.rooms.map((room, rIdx) => (
                      <div
                        key={rIdx}
                        className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 text-xs text-slate-800"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        <span className="font-medium truncate">{room}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Facilities & Amenities */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Available Facilities
            </h3>
            <div className="flex flex-wrap gap-2">
              {location.facilities.map((facility, fIdx) => (
                <div
                  key={fIdx}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50/80 border border-blue-200 rounded-lg text-xs font-medium text-blue-900"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{facility}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Department Contact / In-Charge */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              Contact & In-Charge Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Officer In-Charge</span>
                <span className="font-semibold text-slate-900">{location.contact.inCharge}</span>
                <span className="text-slate-500 block text-[11px]">{location.contact.designation}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{location.contact.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{location.contact.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onViewOnMap(location);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Show on Map</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onNavigateFrom(location);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <span>Depart From Here</span>
            </button>
            <button
              onClick={() => {
                onNavigateTo(location);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs transition-colors cursor-pointer active:scale-95"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Navigate Here</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
