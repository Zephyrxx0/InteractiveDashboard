"use client";

import { useState } from "react";
import { OutputTracker } from "@/components/features/output-tracker";
import { OutcomeCard } from "@/components/features/outcome-card";
import { AddCard } from "@/components/ui/add-card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProjectOutputsPage() {
    const [showOutputModal, setShowOutputModal] = useState(false);
    const [showOutcomeModal, setShowOutcomeModal] = useState(false);

    return (
        <div className="p-6 grid-bg min-h-full">
            <div className="max-w-[1200px] mx-auto space-y-8">

                <section>
                    <div className="mb-4">
                        <h3 className="font-display text-xl font-bold">Tangible Outputs</h3>
                        <p className="text-sm text-muted-foreground">Direct products or services delivered by the project.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <OutputTracker
                            title="Water Filtration Systems Installed"
                            unit="systems"
                            current={42}
                            target={100}
                            colorClass="bg-primary"
                        />
                        <OutputTracker
                            title="Community Members Trained"
                            unit="people"
                            current={150}
                            target={500}
                            colorClass="bg-warning"
                        />
                        <OutputTracker
                            title="Sensors Deployed in Field"
                            unit="units"
                            current={80}
                            target={80}
                            colorClass="bg-success"
                        />
                        <AddCard
                            label="Add Output"
                            description="Track a new tangible output"
                            onClick={() => setShowOutputModal(true)}
                            minHeight="100px"
                        />
                    </div>
                </section>

                <section>
                    <div className="mb-4">
                        <h3 className="font-display text-xl font-bold">Key Outcomes</h3>
                        <p className="text-sm text-muted-foreground">Medium to long-term effects resulting from the outputs.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <OutcomeCard
                            title="Decrease in Waterborne Illness"
                            metric="Incidents per 1k / month"
                            baseline="45"
                            current="12"
                            target="< 5"
                            status="on-track"
                        />
                        <OutcomeCard
                            title="Access to Safe Drinking Water"
                            metric="% of target population"
                            baseline="15%"
                            current="42%"
                            target="100%"
                            status="at-risk"
                        />
                        <OutcomeCard
                            title="Local Maintenance Independence"
                            metric="% repairs handled locally"
                            baseline="0%"
                            current="85%"
                            target="90%"
                            status="on-track"
                        />
                        <AddCard
                            label="Add Outcome"
                            description="Define a new key outcome"
                            onClick={() => setShowOutcomeModal(true)}
                            minHeight="140px"
                        />
                    </div>
                </section>

            </div>

            {/* Add Output Modal */}
            <Dialog open={showOutputModal} onOpenChange={setShowOutputModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Tangible Output</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                                Output Title
                            </label>
                            <Input placeholder="e.g., Solar Panels Installed" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                                    Unit
                                </label>
                                <Input placeholder="e.g., units, people" />
                            </div>
                            <div className="space-y-2">
                                <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                                    Target
                                </label>
                                <Input type="number" placeholder="e.g., 100" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowOutputModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => setShowOutputModal(false)}>
                            Add Output
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Outcome Modal */}
            <Dialog open={showOutcomeModal} onOpenChange={setShowOutcomeModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Key Outcome</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                                Outcome Title
                            </label>
                            <Input placeholder="e.g., Reduced Carbon Emissions" />
                        </div>
                        <div className="space-y-2">
                            <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                                Metric Description
                            </label>
                            <Input placeholder="e.g., Tons CO2 / year" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                                    Baseline
                                </label>
                                <Input placeholder="e.g., 500" />
                            </div>
                            <div className="space-y-2">
                                <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                                    Current
                                </label>
                                <Input placeholder="e.g., 350" />
                            </div>
                            <div className="space-y-2">
                                <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                                    Target
                                </label>
                                <Input placeholder="e.g., 100" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowOutcomeModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => setShowOutcomeModal(false)}>
                            Add Outcome
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
