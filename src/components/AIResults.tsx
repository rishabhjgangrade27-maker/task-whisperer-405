import { useState } from 'react';
import type { Task, AIResponse } from '../utils/supabaseClient';

interface AIResultsProps {
  results: AIResponse | null;
  tasks: Task[];
}

const priorityOrder: Record<string, number> = { High: 1, Medium: 2, Low: 3 };

function priorityColor(p: string) {
  switch (p) {
    case 'High': return 'bg-red-100 text-red-700 border-red-200';
    case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    default: return 'bg-gray-100 text-gray-600 border-gray-200';
  }
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function Collapsible({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted/50 transition-colors text-left"
      >
        <span>{icon} {title}</span>
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-4 pb-3 text-sm text-foreground">{children}</div>}
    </div>
  );
}

export default function AIResults({ results, tasks }: AIResultsProps) {
  if (!results) return null;

  const nextTask = tasks.find(t => t.id === results?.next_action?.id);

  const sortedTasks = [...tasks].sort((a, b) => {
    const pa = results?.priority?.find(x => x.id === a.id)?.priority || 'Low';
    const pb = results?.priority?.find(x => x.id === b.id)?.priority || 'Low';
    return (priorityOrder[pa] ?? 3) - (priorityOrder[pb] ?? 3);
  });

  return (
    <div className="space-y-5">
      {/* Next Action Card */}
      {nextTask && (
        <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🚀</span>
            <div>
              <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">Next Action</p>
              <p className="text-lg font-semibold text-foreground">{nextTask.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{results.next_action?.reason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Task Cards */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">AI Analysis ({sortedTasks.length})</h2>
        {sortedTasks.map(task => {
          const p = results?.priority?.find(x => x.id === task.id);
          const s = results?.summaries?.find(x => x.id === task.id);
          const b = results?.breakdowns?.find(x => x.id === task.id);
          const d = results?.deadlines?.find(x => x.id === task.id);
          const e = results?.estimations?.find(x => x.id === task.id);

          return (
            <div key={task.id} className="rounded-lg border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between px-4 py-3">
                <p className="font-medium text-foreground text-sm">{task.title}</p>
                {p && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${priorityColor(p.priority)}`}>
                    {p.priority}
                  </span>
                )}
              </div>

              <Collapsible title="Summary" icon="📝">
                <p>{s?.summary || 'No summary available.'}</p>
              </Collapsible>

              <Collapsible title="Breakdown" icon="🔍">
                {b?.steps?.length ? (
                  <ul className="list-disc list-inside space-y-1">
                    {b.steps.map((step, i) => <li key={i}>{step}</li>)}
                  </ul>
                ) : <p>No breakdown available.</p>}
              </Collapsible>

              <Collapsible title="Deadline" icon="📅">
                <p>{d?.suggested_deadline ? formatDate(d.suggested_deadline) : 'No deadline suggestion.'}</p>
              </Collapsible>

              <Collapsible title="Estimation" icon="⏱">
                <p>{e ? `${e.minutes} minutes` : 'No estimation available.'}</p>
              </Collapsible>
            </div>
          );
        })}
      </div>
    </div>
  );
}
