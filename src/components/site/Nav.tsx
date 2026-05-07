import { useEffect, useState } from "react";

const items = [
  { href: "#work", label: "Work" },
  { href: "#motion", label: "Motion" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-background/85 backdrop-blur-sm border-b border-[var(--rule)]" : ""
      }`}
    >
      <nav className="mx-auto max-w-[1440px] px-6 md:px-12 h-16 flex items-center justify-between">
        <a href="#top" className="font-display text-sm tracking-tight hover:text-accent transition-colors">
          Race Kipping
        </a>
        <ul className="font-ui flex items-center gap-8 text-[13px] tracking-wide uppercase">
          {items.map((it) => (
            <li key={it.href}>
              <a href={it.href} className="text-muted-foreground hover:text-foreground transition-colors">
                {it.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
