export function Footer() {
  return (
    <footer className="pt-24 md:pt-[132px] pb-10">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div aria-hidden className="ink-rule-heavy mb-6" />
      </div>
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 frame-panel p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 font-ui text-[10px] uppercase text-muted-foreground">
        <span className="font-display normal-case text-foreground text-sm tracking-tight meta-chip">
          RK
        </span>
        <span className="meta-chip">© 2026 Race Kipping. All rights reserved.</span>
        <span className="meta-chip">Built by Race Kipping, 2026.</span>
      </div>
    </footer>
  );
}
