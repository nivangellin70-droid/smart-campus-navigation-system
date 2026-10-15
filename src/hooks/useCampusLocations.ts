import { useState, useEffect } from 'react';
import { CampusLocation } from '../types/campus';
import { INITIAL_CAMPUS_LOCATIONS } from '../data/campusData';

const STORAGE_KEY = 'smart_campus_locations_db_v1';

export function useCampusLocations() {
  const [locations, setLocations] = useState<CampusLocation[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore storage error, fallback to initial
    }
    return INITIAL_CAMPUS_LOCATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
    } catch {
      // storage quota or private browsing
    }
  }, [locations]);

  const addLocation = (newLoc: CampusLocation) => {
    setLocations((prev) => [newLoc, ...prev]);
  };

  const updateLocation = (updatedLoc: CampusLocation) => {
    setLocations((prev) =>
      prev.map((loc) => (loc.id === updatedLoc.id ? updatedLoc : loc))
    );
  };

  const deleteLocation = (id: string) => {
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
  };

  const resetToDefault = () => {
    setLocations(INITIAL_CAMPUS_LOCATIONS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    locations,
    addLocation,
    updateLocation,
    deleteLocation,
    resetToDefault,
  };
}
