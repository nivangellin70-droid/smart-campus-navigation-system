import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { CampusLocation, RouteComputationResult } from '../types/campus';

interface LeafletCampusMapProps {
  locations: CampusLocation[];
  selectedLocation: CampusLocation | null;
  onSelectLocation: (loc: CampusLocation) => void;
  onNavigateTo: (loc: CampusLocation) => void;
  activeRoute: RouteComputationResult | null;
}

export const LeafletCampusMap: React.FC<LeafletCampusMapProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  onNavigateTo,
  activeRoute,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center map around university campus coordinates
    const defaultCenter: [number, number] = [12.9734, 77.5946];
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 16,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    markersLayerRef.current = markersGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    locations.forEach((loc) => {
      const isSelected = selectedLocation?.id === loc.id;
      const isDestination = activeRoute?.toLocation.id === loc.id;
      const isSource = activeRoute?.fromLocation.id === loc.id;

      let badgeColor = '#2563eb';
      if (isDestination) badgeColor = '#dc2626';
      else if (isSource) badgeColor = '#16a34a';
      else if (isSelected) badgeColor = '#4f46e5';

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%);">
            <div style="background-color: ${badgeColor}; color: white; padding: 4px 8px; border-radius: 6px; font-weight: 700; font-size: 11px; font-family: monospace; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2px solid white; white-space: nowrap;">
              ${loc.code}
            </div>
            <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid ${badgeColor}; margin-top: -1px;"></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng], {
        icon: customIcon,
      });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 text-slate-800';
      popupContent.innerHTML = `
        <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600;">${loc.block}</div>
        <div style="font-size: 14px; font-weight: bold; margin-bottom: 4px; color: #0f172a;">${loc.name}</div>
        <div style="font-size: 12px; color: #475569; margin-bottom: 8px;">${loc.shortDescription}</div>
        <div style="display: flex; gap: 6px;">
          <button id="btn-inspect-${loc.id}" style="background-color: #f1f5f9; color: #1e293b; border: 1px solid #cbd5e1; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">
            Details
          </button>
          <button id="btn-route-${loc.id}" style="background-color: #2563eb; color: white; border: none; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">
            Route Here
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btnInspect = document.getElementById(`btn-inspect-${loc.id}`);
        const btnRoute = document.getElementById(`btn-route-${loc.id}`);
        if (btnInspect) {
          btnInspect.onclick = () => onSelectLocation(loc);
        }
        if (btnRoute) {
          btnRoute.onclick = () => onNavigateTo(loc);
        }
      });

      marker.on('click', () => {
        onSelectLocation(loc);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [locations, selectedLocation, activeRoute, onSelectLocation, onNavigateTo]);

  // Update Route Polyline
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (routePolylineRef.current) {
      mapInstanceRef.current.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    if (activeRoute && activeRoute.pathNodes.length > 1) {
      const latlngs: [number, number][] = activeRoute.pathNodes.map((n) => [n.lat, n.lng]);
      const polyline = L.polyline(latlngs, {
        color: '#2563eb',
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 8',
      }).addTo(mapInstanceRef.current);

      routePolylineRef.current = polyline;
      mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    }
  }, [activeRoute]);

  // Pan to selected location
  useEffect(() => {
    if (mapInstanceRef.current && selectedLocation) {
      mapInstanceRef.current.flyTo(
        [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng],
        17,
        { duration: 1.2 }
      );
    }
  }, [selectedLocation]);

  return (
    <div className="relative w-full h-[580px] sm:h-[640px] rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
