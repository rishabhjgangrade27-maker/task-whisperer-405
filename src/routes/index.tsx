import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { supabase, type Task, type AIResponse } from '../utils/supabaseClient';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import AIResults from '../components/AIResults';

export const Route = createFileRoute('/')({
  component: Dashboard,
});

const N8N_ENDPOINT = 'https://futureproofedge.app.n8n.cloud/webhook/atpos';

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [aiResults, setAiResults] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error: err } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (err) {
      setError('Failed to load tasks from database.');
      return;
    }
    setTasks((data as Task[]) || []);
  };

  const handleTaskAdded = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
  };

  const handleTaskDeleted = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const processWithAI = async () => {
    setLoading(true);
    setError('');
    setAiResults(null);

    try {
      const res = await fetch(N8N_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { tasks } }),
      });

      if (!res.ok) throw new Error('n8n request failed');

      const data = await res.json();

      if (!data || typeof data !== 'object') {
        throw new Error('Invalid AI response');
      }

      setAiResults({
        priority: data.priority || [],
        summaries: data.summaries || [],
        breakdowns: data.breakdowns || [],
        deadlines: data.deadlines || [],
        estimations: data.estimations || [],
        next_action: data.next_action || { id: '', reason: '' },
      });
    } catch {
      setError('AI processing failed. Please check your n8n webhook endpoint and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-5">
          <h1 className="text-xl font-bold text-foreground tracking-tight">ATPOS</h1>
          <p className="text-sm text-muted-foreground mt-0.5">AI Task Prioritization & Optimization System</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        <TaskForm onTaskAdded={handleTaskAdded} />

        <TaskList tasks={tasks} onTaskDeleted={handleTaskDeleted} />

        <button
          onClick={processWithAI}
          disabled={loading || tasks.length === 0}
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? 'Processing...' : 'Process Tasks with AI'}
        </button>

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <AIResults results={aiResults} tasks={tasks} />
      </main>
    </div>
  );
}
