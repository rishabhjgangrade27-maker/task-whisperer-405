import { useState } from 'react';
import type { AIResponse } from '../utils/supabaseClient';

interface AIResultsProps {
  results: AIResponse | null;
}

interface AccordionItemProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

function AccordionItem({ title, icon, children }: AccordionItemProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handleToggle = () => {
    if (!open && !revealed) {
      setLoading(true);
      setOpen(true);
      setTimeout(() => {
        setLoading(false);
        setRevealed(true);
      }, 1000);
    } else {
      setOpen(!open);
    }
  };

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors text-left"
      >
        <span>{icon} {title}</span>
        <svg
          className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Loading...
            </div>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
}

export default function AIResults({ results }: AIResultsProps) {
  if (!results) return null;

  const renderList = (items: string[] | undefined) => {
    if (!items || items.length === 0) return <p className="text-sm text-muted-foreground">No data available.</p>;
    return (
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-foreground">{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="px-5 py-3 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">AI Results</h2>
      </div>
      <AccordionItem title="Priority" icon="🎯">
        {renderList(results.priority)}
      </AccordionItem>
      <AccordionItem title="Summaries" icon="📝">
        {renderList(results.summaries)}
      </AccordionItem>
      <AccordionItem title="Breakdown" icon="🔍">
        {renderList(results.breakdowns)}
      </AccordionItem>
      <AccordionItem title="Deadlines" icon="📅">
        {renderList(results.deadlines)}
      </AccordionItem>
      <AccordionItem title="Estimations" icon="⏱">
        {renderList(results.estimations)}
      </AccordionItem>
      <AccordionItem title="Next Action" icon="🚀">
        <p className="text-sm text-foreground">{results.next_action || 'No recommendation.'}</p>
      </AccordionItem>
    </div>
  );
}
