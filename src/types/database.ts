export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            projects: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    status: 'on_track' | 'at_risk' | 'delayed' | 'completed'
                    type: 'quick_win' | 'strategic' | 'exploratory' | 'maintenance' | 'long_term'
                    progress: number
                    end_date: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    status?: 'on_track' | 'at_risk' | 'delayed' | 'completed'
                    type?: 'quick_win' | 'strategic' | 'exploratory' | 'maintenance' | 'long_term'
                    progress?: number
                    end_date?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    status?: 'on_track' | 'at_risk' | 'delayed' | 'completed'
                    type?: 'quick_win' | 'strategic' | 'exploratory' | 'maintenance' | 'long_term'
                    progress?: number
                    end_date?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            tasks: {
                Row: {
                    id: string
                    project_id: string | null
                    title: string
                    description: string | null
                    status: 'todo' | 'in_progress' | 'in_review' | 'done' | 'backlog'
                    priority: 'urgent' | 'high' | 'medium' | 'low'
                    assignees: string[] | null
                    points: number | null
                    start_date: string | null
                    due_date: string | null
                    epic: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    project_id?: string | null
                    title: string
                    description?: string | null
                    status?: 'todo' | 'in_progress' | 'in_review' | 'done' | 'backlog'
                    priority?: 'urgent' | 'high' | 'medium' | 'low'
                    assignees?: string[] | null
                    points?: number | null
                    start_date?: string | null
                    due_date?: string | null
                    epic?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    project_id?: string | null
                    title?: string
                    description?: string | null
                    status?: 'todo' | 'in_progress' | 'in_review' | 'done' | 'backlog'
                    priority?: 'urgent' | 'high' | 'medium' | 'low'
                    assignees?: string[] | null
                    points?: number | null
                    start_date?: string | null
                    due_date?: string | null
                    epic?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            tags: {
                Row: {
                    id: string
                    name: string
                    color_scheme: string
                }
                Insert: {
                    id?: string
                    name: string
                    color_scheme?: string
                }
                Update: {
                    id?: string
                    name?: string
                    color_scheme?: string
                }
            }
            task_tags: {
                Row: {
                    task_id: string
                    tag_id: string
                }
                Insert: {
                    task_id: string
                    tag_id: string
                }
                Update: {
                    task_id?: string
                    tag_id?: string
                }
            }
            task_dependencies: {
                Row: {
                    id: string
                    task_id: string | null
                    depends_on_task_id: string | null
                    type: 'blocks' | 'relates_to' | 'duplicates'
                    created_at: string
                }
                Insert: {
                    id?: string
                    task_id?: string | null
                    depends_on_task_id?: string | null
                    type?: 'blocks' | 'relates_to' | 'duplicates'
                    created_at?: string
                }
                Update: {
                    id?: string
                    task_id?: string | null
                    depends_on_task_id?: string | null
                    type?: 'blocks' | 'relates_to' | 'duplicates'
                    created_at?: string
                }
            }
            media_files: {
                Row: {
                    id: string
                    name: string
                    type: string
                    url: string
                    storage_path: string
                    size: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    type: string
                    url: string
                    storage_path: string
                    size?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    type?: string
                    url?: string
                    storage_path?: string
                    size?: number | null
                    created_at?: string
                }
            }
            project_documents: {
                Row: {
                    id: string
                    project_id: string | null
                    media_file_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    project_id?: string | null
                    media_file_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    project_id?: string | null
                    media_file_id?: string | null
                    created_at?: string
                }
            }
            extractions: {
                Row: {
                    id: string
                    media_file_id: string | null
                    result: Json
                    status: 'pending' | 'processing' | 'completed' | 'failed'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    media_file_id?: string | null
                    result: Json
                    status?: 'pending' | 'processing' | 'completed' | 'failed'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    media_file_id?: string | null
                    result?: Json
                    status?: 'pending' | 'processing' | 'completed' | 'failed'
                    created_at?: string
                    updated_at?: string
                }
            }
            notifications: {
                Row: {
                    id: string
                    title: string
                    message: string
                    type: 'info' | 'success' | 'warning' | 'error'
                    read: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    message: string
                    type?: 'info' | 'success' | 'warning' | 'error'
                    read?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    message?: string
                    type?: 'info' | 'success' | 'warning' | 'error'
                    read?: boolean
                    created_at?: string
                }
            }
            project_locations: {
                Row: {
                    id: string
                    project_id: string
                    latitude: number
                    longitude: number
                    pincode: string | null
                    address: string | null
                    city: string | null
                    state: string | null
                    country: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    project_id: string
                    latitude: number
                    longitude: number
                    pincode?: string | null
                    address?: string | null
                    city?: string | null
                    state?: string | null
                    country?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    project_id?: string
                    latitude?: number
                    longitude?: number
                    pincode?: string | null
                    address?: string | null
                    city?: string | null
                    state?: string | null
                    country?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            incidents: {
                Row: {
                    id: string
                    project_id: string | null
                    title: string
                    description: string | null
                    priority: 'low' | 'medium' | 'high' | 'critical'
                    status: 'reported' | 'acknowledged' | 'investigating' | 'resolved' | 'closed'
                    reporter_id: string | null
                    assignee_id: string | null
                    location_id: string | null
                    resolved_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    project_id?: string | null
                    title: string
                    description?: string | null
                    priority?: 'low' | 'medium' | 'high' | 'critical'
                    status?: 'reported' | 'acknowledged' | 'investigating' | 'resolved' | 'closed'
                    reporter_id?: string | null
                    assignee_id?: string | null
                    location_id?: string | null
                    resolved_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    project_id?: string | null
                    title?: string
                    description?: string | null
                    priority?: 'low' | 'medium' | 'high' | 'critical'
                    status?: 'reported' | 'acknowledged' | 'investigating' | 'resolved' | 'closed'
                    reporter_id?: string | null
                    assignee_id?: string | null
                    location_id?: string | null
                    resolved_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    email: string | null
                    avatar_url: string | null
                    role: 'admin' | 'member'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    email?: string | null
                    avatar_url?: string | null
                    role?: 'admin' | 'member'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    email?: string | null
                    avatar_url?: string | null
                    role?: 'admin' | 'member'
                    created_at?: string
                    updated_at?: string
                }
            }
            project_members: {
                Row: {
                    id: string
                    project_id: string | null
                    profile_id: string | null
                    role: 'lead' | 'member'
                    created_at: string
                }
                Insert: {
                    id?: string
                    project_id?: string | null
                    profile_id?: string | null
                    role?: 'lead' | 'member'
                    created_at?: string
                }
                Update: {
                    id?: string
                    project_id?: string | null
                    profile_id?: string | null
                    role?: 'lead' | 'member'
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
