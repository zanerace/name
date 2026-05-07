export function Footer() {
  return (
    <footer className="border-t border-[var(--rule)] py-10">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-ui text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
        <span className="font-display text-foreground text-sm normal-case tracking-tight">RK</span>
        <span>© 2026 Race Kipping. All rights reserved.</span>
        <span>Built by Race Kipping, 2026.</span>
      </div>
    </footer>
  );
}
