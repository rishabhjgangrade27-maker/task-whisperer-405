import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bfxwexxbrzugldocpfbe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeHdleHhicnp1Z2xkb2NwZmJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDEzODUsImV4cCI6MjA4NDA3NzM4NX0.WBVRS6uRkkHTeUXvhKqKCXbM-xlo0MRQ2eeZ46KQ4n8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  estimated_duration_minutes: number;
}

export interface AIResponse {
  priority: { id: string; priority: string }[];
  summaries: { id: string; summary: string }[];
  breakdowns: { id: string; steps: string[] }[];
  deadlines: { id: string; suggested_deadline: string }[];
  estimations: { id: string; minutes: number }[];
  next_action: { id: string; reason: string };
}
