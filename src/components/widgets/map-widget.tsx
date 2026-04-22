"use client";

import dynamic from "next/dynamic";
import { useProjects } from "@/hooks/use-projects";
import { useLocations } from "@/hooks/use-locations";
import { useIncidents } from "@/hooks/use-incidents";

// Dynamic import for Leaflet-based map to avoid SSR issues
const MapContainer = dynamic(() => import("@/components/ui/map-container"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center font-mono text-xs text-muted-foreground uppercase">
            Initialising Geo-Engine...
        </div>
    )
});

const ProjectMarker = dynamic(() => import("@/components/features/map/project-marker").then(mod => mod.ProjectMarker), {
    ssr: false
});

export function MapWidget() {
    const { data: projects, isLoading: projectsLoading } = useProjects();
    const { data: locations, isLoading: locationsLoading } = useLocations();
    const { data: incidents, isLoading: incidentsLoading } = useIncidents();

    const isLoading = projectsLoading || locationsLoading || incidentsLoading;

    // Join projects with locations and check for critical incidents
    const markers = projects?.map(project => {
        const location = locations?.find(loc => loc.project_id === project.id);
        if (!location) return null;
        
        const projectIncidents = incidents?.filter(i => i.project_id === project.id);
        const hasCritical = projectIncidents?.some(i => i.priority === 'critical' && i.status !== 'resolved' && i.status !== 'closed');
        
        return { project, location, hasCritical };
    }).filter(Boolean) || [];

    return (
        <div className="bg-card border border-border p-0 flex flex-col group hover:border-primary transition-colors relative overflow-hidden h-full">
            {/* Overlay Header */}
            <div className="absolute top-0 left-0 w-full p-6 z-[1000] pointer-events-none">
                <div className="flex justify-between items-start">
                    <div className="bg-card/80 backdrop-blur border border-border p-3 pointer-events-auto">
                        <h3 className="font-display text-lg font-bold text-foreground leading-tight">
                            Project Deployment Map
                        </h3>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-1">
                            {isLoading ? "Fetching coordinates..." : `${markers.length} Active Sites Synchronized`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 w-full h-full bg-background relative min-h-[400px]">
                <MapContainer center={[-15.78, -47.93]} zoom={4}>
                    {markers.map((m: any) => (
                        <ProjectMarker 
                            key={m.project.id} 
                            project={m.project} 
                            location={m.location} 
                            hasCritical={m.hasCritical}
                        />
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}
