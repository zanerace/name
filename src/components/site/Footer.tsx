export function Footer() {
  return (
    <footer className="pt-14 md:pt-20 pb-10 w-full max-w-full overflow-x-hidden">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div aria-hidden className="h-px w-full bg-[color:var(--border)] mb-8" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 font-ui text-[13px] md:text-[14px] uppercase text-[color:var(--text-soft)] min-w-0">
          <span className="font-display normal-case text-foreground text-base tracking-tight">
            Race Kipping
          </span>
          <span className="w-full md:w-auto text-left whitespace-normal break-words">
            © 2026 — All rights reserved.
          </span>
          <span className="w-full md:w-auto text-left whitespace-normal break-words">
            Built by Race Kipping, 2026.
          </span>
        </div>
      </div>
    </footer>
  );
}
