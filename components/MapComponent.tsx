"use client";

import React, { useEffect, useState } from "react";
import { PartnerCenter } from "@/lib/api";

interface MapComponentProps {
  partners: PartnerCenter[];
  selectedPartnerId?: string;
  onSelectPartner?: (partner: PartnerCenter) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  partners,
  selectedPartnerId,
  onSelectPartner,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[400px] bg-surface-container-low rounded-2xl flex items-center justify-center text-xs text-on-surface-variant">
        Initializing Leaflet OpenStreetMap...
      </div>
    );
  }

  // Dynamic import for Leaflet elements inside client component
  const { MapContainer, TileLayer, Marker, Popup, useMap } = require("react-leaflet");
  const L = require("leaflet");

  // Fix default icon issues in Leaflet under Webpack/Next.js
  const customIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const activePartner = partners.find(p => p.id === selectedPartnerId) || partners[0];
  const centerLat = activePartner?.lat || 19.0657;
  const centerLng = activePartner?.lng || 72.8686;

  const MapUpdater = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();
    useEffect(() => {
      if (lat && lng) {
        map.flyTo([lat, lng], 13, { animate: true });
      }
    }, [lat, lng, map]);
    return null;
  };

  return (
    <div className="w-full h-full min-h-[450px] rounded-2xl overflow-hidden shadow-inner border border-outline-variant/60 relative z-0">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={12}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%", minHeight: "450px" }}
      >
        <MapUpdater lat={centerLat} lng={centerLng} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {partners.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => onSelectPartner?.(p),
            }}
          >
            <Popup>
              <div className="p-1 space-y-1 font-sans">
                <span className="text-[10px] font-bold text-primary uppercase block">{p.type}</span>
                <h4 className="font-bold text-xs text-on-surface leading-tight">{p.name}</h4>
                <p className="text-[11px] text-text-secondary">{p.address}</p>
                <p className="text-[11px] font-bold text-tertiary">{p.phone}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
