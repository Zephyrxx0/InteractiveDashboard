-- Create project_locations table
CREATE TABLE IF NOT EXISTS public.project_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    pincode TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for searching locations by project
CREATE INDEX IF NOT EXISTS idx_project_locations_project_id ON public.project_locations(project_id);

-- Enable RLS
ALTER TABLE public.project_locations ENABLE ROW LEVEL SECURITY;

-- Simple RLS policies (adjust as needed for your specific auth logic)
CREATE POLICY "Enable read access for all users" ON public.project_locations
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.project_locations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for project leads" ON public.project_locations
    FOR UPDATE USING (auth.role() = 'authenticated');
