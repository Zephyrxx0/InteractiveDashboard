"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TabbedTableView } from "./TabbedTableView";
import { DocumentRenderer } from "./DocumentRenderer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocumentViewerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    document: {
        name: string;
        type: string;
        content?: any;
    } | null;
}

export function DocumentViewerModal({ open, onOpenChange, document }: DocumentViewerModalProps) {
    if (!document) return null;

    const renderContent = () => {
        if (document.type === 'xlsx' || document.type === 'csv') {
            return (
                <TabbedTableView 
                    data={document.content || {
                        "Data Preview": [
                          ["Header 1", "Header 2", "Header 3"],
                          ["Sample Data A", "120", "Active"],
                          ["Sample Data B", "85", "Pending"],
                          ["Sample Data C", "210", "Completed"]
                        ]
                    }} 
                />
            );
        }

        if (document.type === 'docx') {
            return (
                <DocumentRenderer 
                    html={document.content || `
                        <h1>${document.name}</h1>
                        <p>This document has been processed and formatted using the Eco-Grid Document Standard v2.4.</p>
                        <p>The content here is a representational preview of the file data, optimized for readability in the dashboard integrated viewer.</p>
                        <h3>Key takeaways</h3>
                        <ul>
                            <li>Metric normalization complete</li>
                            <li>Stakeholder review pending implementation</li>
                            <li>Resource allocation optimized for SE Asia region</li>
                        </ul>
                    `} 
                />
            );
        }

        return (
            <div className="p-8 border border-border bg-muted/20 font-mono text-sm">
                No preview available for this file type.
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] p-0 gap-0 border-border overflow-hidden bg-background">
                <DialogHeader className="p-6 border-b border-border bg-card">
                    <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined text-2xl ${
                            document.type === 'xlsx' ? 'text-green-500' : 
                            document.type === 'docx' ? 'text-blue-500' : 'text-orange-500'
                        }`}>
                            {document.type === 'xlsx' ? 'table_chart' : 
                             document.type === 'docx' ? 'description' : 'analytics'}
                        </span>
                        <div>
                            <DialogTitle className="font-display text-xl">{document.name}</DialogTitle>
                            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">
                                Eco-Grid Document Standard v2.4 • Confidential
                            </p>
                        </div>
                    </div>
                </DialogHeader>
                <div className="p-6 bg-grid-small-white/[0.03]">
                    {renderContent()}
                </div>
            </DialogContent>
        </Dialog>
    );
}
