import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  estimated_duration_minutes: number;
}

export interface AIResponse {
  priority: string[];
  summaries: string[];
  breakdowns: string[];
  deadlines: string[];
  estimations: string[];
  next_action: string;
}
