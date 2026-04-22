"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useProjectLocation, useUpsertLocation } from "@/hooks/use-locations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MapContainer = dynamic(() => import("@/components/ui/map-container"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-muted flex items-center justify-center font-mono text-[10px] uppercase">Loading Radar...</div>
});

const ProjectMarker = dynamic(() => import("@/components/features/map/project-marker").then(mod => mod.ProjectMarker), {
    ssr: false
});

interface LocationCardProps {
    projectId: string;
    projectName: string;
    projectStatus: any;
}

export function LocationCard({ projectId, projectName, projectStatus }: LocationCardProps) {
    const { data: location, isLoading } = useProjectLocation(projectId);
    const { mutate: upsertLocation, isPending } = useUpsertLocation();
    const [isEditing, setIsEditing] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        latitude: location?.latitude || 0,
        longitude: location?.longitude || 0,
        pincode: location?.pincode || "",
    });

    // Reset form when location data changes
    useState(() => {
        if (location) {
            setFormData({
                latitude: location.latitude,
                longitude: location.longitude,
                pincode: location.pincode || "",
            });
        }
    });

    const handleSave = () => {
        upsertLocation({
            project_id: projectId,
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
            pincode: formData.pincode,
        }, {
            onSuccess: () => setIsEditing(false)
        });
    };

    if (isLoading) return <div className="h-[200px] bg-card border border-border animate-pulse" />;

    const currentCoords: [number, number] = [location?.latitude || formData.latitude, location?.longitude || formData.longitude];

    return (
        <div className="bg-card border border-border shadow-brutal overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/5">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                    Site Location
                </h3>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-[10px] font-mono uppercase"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? "Cancel" : "Edit Position"}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Mini Map */}
                <div className="h-[250px] bg-background border-r border-border relative z-0">
                    <MapContainer center={currentCoords} zoom={location ? 12 : 2}>
                        {location && (
                            <ProjectMarker 
                                project={{ id: projectId, name: projectName, status: projectStatus }}
                                location={location}
                            />
                        )}
                    </MapContainer>
                </div>

                {/* Info / Edit Panel */}
                <div className="p-6 flex flex-col justify-center space-y-4">
                    {isEditing ? (
                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] font-mono text-muted-foreground uppercase font-bold block mb-1">Latitude</label>
                                <Input 
                                    type="number" 
                                    value={formData.latitude} 
                                    onChange={e => setFormData(prev => ({ ...prev, latitude: Number(e.target.value) }))}
                                    className="h-8 text-xs font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-mono text-muted-foreground uppercase font-bold block mb-1">Longitude</label>
                                <Input 
                                    type="number" 
                                    value={formData.longitude} 
                                    onChange={e => setFormData(prev => ({ ...prev, longitude: Number(e.target.value) }))}
                                    className="h-8 text-xs font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-mono text-muted-foreground uppercase font-bold block mb-1">Pincode</label>
                                <Input 
                                    value={formData.pincode} 
                                    onChange={e => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                                    className="h-8 text-xs font-mono"
                                />
                            </div>
                            <Button 
                                className="w-full h-8 text-[10px] font-mono uppercase shadow-brutal"
                                onClick={handleSave}
                                disabled={isPending}
                            >
                                {isPending ? "Updating..." : "Save Coordinates"}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-mono text-muted-foreground uppercase">Lat</p>
                                    <p className="font-mono text-sm leading-none">{location?.latitude.toFixed(6) || "---"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-mono text-muted-foreground uppercase">Long</p>
                                    <p className="font-mono text-sm leading-none">{location?.longitude.toFixed(6) || "---"}</p>
                                </div>
                            </div>
                            <div className="space-y-1 pt-2 border-t border-border/50">
                                <p className="text-[10px] font-mono text-muted-foreground uppercase">Pincode</p>
                                <p className="font-medium text-sm">{location?.pincode || "---"}</p>
                            </div>
                            {!location && (
                                <p className="text-[10px] text-warning font-mono uppercase bg-warning/10 p-2 border border-warning/20">
                                    No geographic data synchronized for this project.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
