"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";

interface ProjectMarkerProps {
    project: {
        id: string;
        name: string;
        status: 'on_track' | 'at_risk' | 'delayed' | 'completed';
        description?: string | null;
    };
    location: {
        latitude: number;
        longitude: number;
    };
    hasCritical?: boolean;
}

const statusColors = {
    on_track: "#10b981", // Emerald
    at_risk: "#f59e0b",  // Amber
    delayed: "#ef4444",  // Red
    completed: "#3b82f6", // Blue
};

// Function to create a custom SVG-based marker pin
const createCustomIcon = (status: keyof typeof statusColors, hasCritical?: boolean) => {
    const color = statusColors[status];
    return L.divIcon({
        className: "custom-marker",
        html: `
            <div style="position: relative; width: 30px; height: 30px;">
                ${hasCritical ? `
                <div style="
                    position: absolute;
                    top: -5px;
                    left: -5px;
                    width: 40px;
                    height: 40px;
                    background: rgba(239, 68, 68, 0.4);
                    border-radius: 50%;
                    animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                "></div>
                <style>
                    @keyframes ping {
                        75%, 100% { transform: scale(2); opacity: 0; }
                    }
                </style>
                ` : ''}
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: relative; z-index: 10;">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${hasCritical ? '#ef4444' : color}" stroke="white" stroke-width="1.5"/>
                    <circle cx="12" cy="9" r="3" fill="white"/>
                </svg>
            </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });
};

export function ProjectMarker({ project, location, hasCritical }: ProjectMarkerProps) {
    const icon = createCustomIcon(project.status, hasCritical);

    return (
        <Marker position={[location.latitude, location.longitude]} icon={icon}>
            <Popup className="project-map-popup">
                <div className="p-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            project.status === 'on_track' ? 'bg-emerald-100 text-emerald-800' :
                            project.status === 'at_risk' ? 'bg-amber-100 text-amber-800' :
                            project.status === 'delayed' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                            {project.status.replace('_', ' ')}
                        </span>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm leading-tight text-foreground">{project.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {project.description || "No description available."}
                        </p>
                    </div>
                    <Link 
                        href={`/projects/${project.id}`}
                        className="block text-center text-xs font-bold uppercase tracking-wider bg-foreground text-card py-1.5 hover:bg-foreground/90 transition-colors"
                    >
                        View Details
                    </Link>
                </div>
            </Popup>
        </Marker>
    );
}
