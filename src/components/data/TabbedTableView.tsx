"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TabbedTableViewProps {
    data: Record<string, any[][]>;
    className?: string;
}

export function TabbedTableView({ data, className }: TabbedTableViewProps) {
    const sheetNames = Object.keys(data);
    if (sheetNames.length === 0) return <div>No data found</div>;

    return (
        <div className={className}>
            <Tabs defaultValue={sheetNames[0]} className="w-full">
                <div className="flex items-center justify-between mb-4 px-2">
                    <TabsList className="bg-muted/50 border border-border rounded-none h-10 p-0.5">
                        {sheetNames.map((name) => (
                            <TabsTrigger
                                key={name}
                                value={name}
                                className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-mono text-xs px-4"
                            >
                                {name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                        {sheetNames.length} Sheets Detected
                    </div>
                </div>

                {sheetNames.map((name) => {
                    const rows = data[name];
                    const headers = rows[0] || [];
                    const body = rows.slice(1);

                    return (
                        <TabsContent key={name} value={name} className="mt-0 focus-visible:outline-none">
                            <div className="border border-border bg-card shadow-brutal overflow-hidden">
                                <ScrollArea className="h-[400px] w-full">
                                    <Table>
                                        <TableHeader className="bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
                                            <TableRow className="border-b-border hover:bg-transparent">
                                                {headers.map((h, i) => (
                                                    <TableHead 
                                                        key={i} 
                                                        className="font-mono text-[10px] uppercase tracking-tighter text-muted-foreground py-2 h-10"
                                                    >
                                                        {String(h || `Col ${i + 1}`)}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {body.map((row, rowIndex) => (
                                                <TableRow key={rowIndex} className="border-b-border/50 hover:bg-accent/5">
                                                    {headers.map((_, colIndex) => (
                                                        <TableCell 
                                                            key={colIndex} 
                                                            className="font-sans text-sm py-2 px-4 whitespace-nowrap"
                                                        >
                                                            {String(row[colIndex] ?? "")}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </div>
                        </TabsContent>
                    );
                })}
            </Tabs>
        </div>
    );
}
