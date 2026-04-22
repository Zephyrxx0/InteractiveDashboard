-- INCIDENTS MANAGEMENT TABLE
-- Tracks field issues, equipment failures, and blockers

CREATE TABLE IF NOT EXISTS public.incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'acknowledged', 'investigating', 'resolved', 'closed')),
    reporter_id TEXT, -- Future: Link to profiles
    assignee_id TEXT, -- Future: Link to profiles
    location_id UUID REFERENCES public.project_locations(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Development policy (Allow all)
CREATE POLICY "Allow all access to incidents" ON public.incidents FOR ALL USING (true) WITH CHECK (true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at_incidents()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER incidents_updated_at
    BEFORE UPDATE ON public.incidents
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at_incidents();
