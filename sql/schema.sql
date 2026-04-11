-- ECO-GRID DASHBOARD SCHEMA
-- Source of Truth for Supabase instance

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY DEFAULT ('PROJ-' || subsegment(uuid_generate_v4()::text, 1, 8)),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'on_track' CHECK (status IN ('on_track', 'at_risk', 'delayed', 'completed')),
    type TEXT DEFAULT 'strategic' CHECK (type IN ('quick_win', 'strategic', 'exploratory', 'maintenance', 'long_term')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TASKS TABLE
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'in_review', 'done', 'backlog')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
    assignees TEXT[] DEFAULT '{}',
    points INTEGER DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    epic TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TAGS TABLE
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    color_scheme TEXT DEFAULT 'gray'
);

-- 4. TASK_TAGS (JUNCTION)
CREATE TABLE IF NOT EXISTS public.task_tags (
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, tag_id)
);

-- 5. TASK_DEPENDENCIES (RELATIONS)
CREATE TABLE IF NOT EXISTS public.task_dependencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    depends_on_task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'blocks' CHECK (type IN ('blocks', 'relates_to', 'duplicates')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. MEDIA_FILES TABLE
CREATE TABLE IF NOT EXISTS public.media_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    size BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. PROJECT_DOCUMENTS (JUNCTION)
-- Associates uploaded media files with specific projects
CREATE TABLE IF NOT EXISTS public.project_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    media_file_id UUID REFERENCES public.media_files(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(project_id, media_file_id)
);

-- 8. EXTRACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.extractions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    media_file_id UUID REFERENCES public.media_files(id) ON DELETE CASCADE,
    result JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. RLS POLICIES (Development "Allow All")
-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Anonymous/Authenticated access for Dev (Modify for Production!)
CREATE POLICY "Allow all access to projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to tags" ON public.tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to task_tags" ON public.task_tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to task_dependencies" ON public.task_dependencies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to media_files" ON public.media_files FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to project_documents" ON public.project_documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to extractions" ON public.extractions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

-- Utility function for custom ID segmenting (if needed for PROJ-xxx pattern)
CREATE OR REPLACE FUNCTION subsegment(text, integer, integer) RETURNS text AS $$
    SELECT substring($1 FROM $2 FOR $3);
$$ LANGUAGE sql IMMUTABLE;
