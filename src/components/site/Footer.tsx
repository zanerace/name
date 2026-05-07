export function Footer() {
  return (
    <footer className="pt-16 md:pt-[96px] pb-10 w-full max-w-full overflow-x-hidden">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div aria-hidden className="ink-rule-heavy mb-6" />
      </div>
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 frame-panel p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 font-ui text-[12px] uppercase text-muted-foreground min-w-0">
        <span className="font-display normal-case text-foreground text-base tracking-tight meta-chip">
          RK
        </span>
        <span className="w-full md:w-auto text-left whitespace-normal break-words">© 2026 Race Kipping. All rights reserved.</span>
        <span className="w-full md:w-auto text-left whitespace-normal break-words">Built by Race Kipping, 2026.</span>
      </div>
    </footer>
  );
}
