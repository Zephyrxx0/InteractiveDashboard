"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  center?: [number, number];
  zoom?: number;
  children?: React.ReactNode;
  className?: string;
}

// Helper to update map view when center/zoom changes externally
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function LeafletMap({
  center = [-15.7801, -47.9292], // Default to Brasilia for the mockup feel
  zoom = 4,
  children,
  className = "h-full w-full",
}: MapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className={className}
      style={{ isolation: 'isolate' }} // Ensure it doesn't overlap UI elements incorrectly
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController center={center} zoom={zoom} />
      {children}
    </MapContainer>
  );
}
