"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { fetchPartnerCenters, PartnerCenter, MOCK_PARTNERS } from "@/lib/api";
import { Sparkles, MapPin, Phone, Building2, Search, Navigation, ExternalLink, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

// Dynamically import MapComponent to avoid SSR window/leaflet issues
const MapComponent = dynamic(
  () => import("@/components/MapComponent").then((mod) => mod.MapComponent),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[450px] bg-surface-container-low rounded-2xl flex items-center justify-center text-xs text-on-surface-variant font-bold">
        Loading Interactive OpenStreetMap...
      </div>
    ),
  }
);

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Math.round(d * 10) / 10;
}

function generateMockPartners(lat: number, lng: number, city: string, state: string): PartnerCenter[] {
  return [
    {
      id: "gen-1",
      name: `District Industries Centre (DIC) - ${city}`,
      type: "Facilitation Center",
      address: `Main Administrative Block, ${city}`,
      city: city,
      state: state,
      lat: lat + 0.02,
      lng: lng + 0.015,
      phone: "+91 800 123 4567",
    },
    {
      id: "gen-2",
      name: `State Bank of India MSME Branch - ${city}`,
      type: "Bank Branch",
      address: `Commercial District, ${city}`,
      city: city,
      state: state,
      lat: lat - 0.015,
      lng: lng + 0.005,
      phone: "+91 800 234 5678",
    },
    {
      id: "gen-3",
      name: `PM Vishwakarma CSC Service Point - ${city}`,
      type: "CSC Center",
      address: `City Market Area, ${city}`,
      city: city,
      state: state,
      lat: lat + 0.005,
      lng: lng - 0.012,
      phone: "+91 800 345 6789",
    },
    {
      id: "gen-4",
      name: `SIDBI MSME Facilitation Cell - ${city}`,
      type: "Facilitation Center",
      address: `Industrial Estate, ${city}`,
      city: city,
      state: state,
      lat: lat - 0.025,
      lng: lng - 0.018,
      phone: "+91 800 456 7890",
    }
  ];
}

export default function PartnersPage() {
  const { user } = useAuth();
  const [partners, setPartners] = useState<PartnerCenter[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<PartnerCenter | null>(null);
  const [pincodeSearch, setPincodeSearch] = useState(user?.pincode || "");
  const [loadingCoords, setLoadingCoords] = useState(false);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    async function loadDataAndSort() {
      let currentPartners = [...MOCK_PARTNERS];

      if (pincodeSearch.length === 6 && /^\d+$/.test(pincodeSearch)) {
        setLoadingCoords(true);
        setSearchError("");
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${pincodeSearch}&country=india&format=json&addressdetails=1`);
          const data = await res.json();
          if (data && data.length > 0) {
            const userLat = parseFloat(data[0].lat);
            const userLng = parseFloat(data[0].lon);
            
            const address = data[0].address || {};
            const city = address.city || address.town || address.county || address.state_district || "Local City";
            const state = address.state || "India";

            // Generate dynamic partners around the user's location
            currentPartners = generateMockPartners(userLat, userLng, city, state);

            // Update distances and sort
            currentPartners = currentPartners.map((p) => ({
              ...p,
              distanceKm: getDistance(userLat, userLng, p.lat, p.lng)
            })).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
          } else {
            setSearchError("We couldn't find any facilitation centers for this specific pincode. Please try a nearby pincode.");
            currentPartners = [];
          }
        } catch (e) {
          console.error("Failed to geocode pincode", e);
          setSearchError("Service temporarily unavailable. Please try again later.");
          currentPartners = [];
        } finally {
          setLoadingCoords(false);
        }
      }

      setPartners(currentPartners);
      if (currentPartners.length > 0) {
        setSelectedPartner(currentPartners[0]);
      }
    }
    
    // debounce slightly to avoid spamming the geocoding API
    const timeout = setTimeout(() => {
      loadDataAndSort();
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [pincodeSearch]);

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-outline-variant bg-surface-container-low text-secondary font-sans text-xs font-semibold">
          <MapPin className="w-4 h-4 text-secondary" />
          <span>Institutional Facilitation Network</span>
        </div>
        <h1 className="font-headline font-bold text-3xl sm:text-4xl text-on-surface">
          Government Partner &amp; Facilitation Center Locator
        </h1>
        <p className="text-xs text-on-surface-variant">
          Locate nearest District Industries Centres (DIC), SIDBI MSME offices, and authorized commercial bank branches for application submission.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Facilitation Hub List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface-card border border-outline-variant rounded-xl p-3 flex items-center gap-2 shadow-sm relative">
            <Search className="w-4 h-4 text-text-secondary ml-2 shrink-0" />
            <input
              type="text"
              maxLength={6}
              value={pincodeSearch}
              onChange={(e) => setPincodeSearch(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6-digit Pincode to sort by distance (e.g. 400051)"
              className="w-full bg-transparent border-none text-xs text-on-surface focus:outline-none"
            />
            {loadingCoords && <Loader2 className="w-4 h-4 text-primary animate-spin absolute right-4" />}
          </div>

          {searchError && (
            <div className="bg-error/10 border border-error/20 text-error text-xs font-bold p-3 rounded-xl">
              {searchError}
            </div>
          )}

          {partners.length === 0 && !loadingCoords && !searchError && (
            <div className="text-center p-6 text-on-surface-variant text-xs font-bold border border-outline-variant/60 rounded-xl bg-surface-container-low/50">
              No facilitation centers found.
            </div>
          )}

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {partners.map((p) => {
              const isSelected = selectedPartner?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPartner(p)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? "bg-surface-card border-primary shadow-md card-glow"
                      : "bg-surface-card/60 border-outline-variant hover:bg-surface-card"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full uppercase">
                      {p.type}
                    </span>
                    {p.distanceKm !== undefined && (
                      <span className="text-[11px] font-bold text-text-secondary flex items-center gap-0.5">
                        <Navigation className="w-3 h-3 text-tertiary" /> {p.distanceKm} km away
                      </span>
                    )}
                  </div>

                  <h3 className="font-headline font-bold text-base text-on-surface leading-tight">{p.name}</h3>

                  <div className="space-y-1 text-xs text-on-surface-variant">
                    <p className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{p.address}, {p.city}, {p.state}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-tertiary shrink-0" />
                      <span className="font-bold text-on-surface">{p.phone}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Leaflet Map */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-surface-card border border-outline-variant rounded-2xl p-4 shadow-sm h-[520px]">
            <MapComponent
              partners={partners}
              selectedPartnerId={selectedPartner?.id}
              onSelectPartner={(p) => setSelectedPartner(p)}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
