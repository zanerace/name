/**
 * Full-screen gate while the homepage preloads assets off the interaction path.
 * Progress reflects real milestones from `warmHomeScrollAssets`.
 */
export function HomeReadyGate({ progress }: { progress: number }) {
  const pct = Math.round(progress * 100);
  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-background px-8 text-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        Perfection loading
      </p>
      <div className="h-px w-full max-w-[280px] overflow-hidden bg-[color:var(--border-strong)]">
        <div
          className="h-full bg-[color:var(--color-accent)] transition-[width] duration-150 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="font-ui text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{pct}%</p>
    </div>
  );
}
