import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown } from 'lucide-react';
import type { ExportFormat } from '../utils/exportTheme';

interface ExportMenuProps {
  onExport: (format: ExportFormat) => void;
}

const FORMATS: { id: ExportFormat; label: string }[] = [
  { id: 'css', label: 'CSS Variables' },
  { id: 'json', label: 'JSON Tokens' },
  { id: 'tailwind', label: 'Tailwind Theme' },
];

export function ExportMenu({ onExport }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="btn btn-secondary flex items-center gap-2 text-xs"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Download className="w-3.5 h-3.5" /> Export
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-44 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg py-1 z-50"
        >
          {FORMATS.map(({ id, label }) => (
            <button
              key={id}
              role="menuitem"
              onClick={() => {
                onExport(id);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--surface-2)] transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}