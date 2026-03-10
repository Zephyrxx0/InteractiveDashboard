import { OutputTracker } from "@/components/features/output-tracker";
import { OutcomeCard } from "@/components/features/outcome-card";

export default function ProjectOutputsPage() {
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
                    </div>
                </section>

            </div>
        </div>
    );
}
