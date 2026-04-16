import { supabase, type Task } from '../utils/supabaseClient';

interface TaskListProps {
  tasks: Task[];
  onTaskDeleted: (id: string) => void;
}

export default function TaskList({ tasks, onTaskDeleted }: TaskListProps) {
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      alert('Failed to delete task.');
      return;
    }
    onTaskDeleted(id);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground text-sm">No tasks yet. Add one above.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card divide-y divide-border">
      <div className="px-5 py-3">
        <h2 className="text-lg font-semibold text-foreground">Tasks ({tasks.length})</h2>
      </div>
      {tasks.map((task) => (
        <div key={task.id} className="px-5 py-3 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground text-sm truncate">{task.title}</p>
            <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
              <span>📅 {formatDate(task.deadline)}</span>
              <span>⏱ {task.estimated_duration_minutes} min</span>
            </div>
          </div>
          <button
            onClick={() => handleDelete(task.id)}
            className="shrink-0 rounded-md px-2 py-1 text-xs text-destructive hover:bg-destructive/10 transition-colors"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
