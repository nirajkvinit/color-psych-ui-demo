const SECTIONS = [
  { id: 'lab', label: 'Color Lab' },
  { id: 'palettes', label: 'Palettes' },
  { id: 'insights', label: 'Scores' },
  { id: 'chart', label: 'Chart' },
  { id: 'contribute', label: 'Contribute' },
] as const;

export function SectionNav() {
  return (
    <nav
      aria-label="Page sections"
      className="sticky top-20 z-40 glass border-b border-[var(--border)]"
    >
      <div className="max-w-7xl mx-auto px-6">
        <ul className="flex gap-1 overflow-x-auto scrollbar-none py-2.5 -mx-1">
          {SECTIONS.map(({ id, label }) => (
            <li key={id} className="shrink-0">
              <a
                href={`#${id}`}
                className="block px-3.5 py-1.5 rounded-full text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors whitespace-nowrap"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}