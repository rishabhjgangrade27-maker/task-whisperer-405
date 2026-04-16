import { useState } from 'react';
import { supabase, type Task } from '../utils/supabaseClient';

interface TaskFormProps {
  onTaskAdded: (task: Task) => void;
}

export default function TaskForm({ onTaskAdded }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setError('');

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      deadline: deadline || new Date().toISOString(),
      estimated_duration_minutes: parseInt(duration) || 30,
    };

    const { data, error: err } = await supabase
      .from('tasks')
      .insert(newTask)
      .select()
      .single();

    setSubmitting(false);

    if (err) {
      setError('Failed to add task. Please check your Supabase connection.');
      return;
    }

    if (data) {
      onTaskAdded(data as Task);
      setTitle('');
      setDescription('');
      setDeadline('');
      setDuration('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-5 space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Add New Task</h2>

      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
          rows={2}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Deadline</label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Duration (min)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="30"
            min="1"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={submitting || !title.trim()}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}
