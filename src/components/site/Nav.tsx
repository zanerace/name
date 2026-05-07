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
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ease-out ${
        scrolled ? "bg-background border-b border-border" : ""
      }`}
    >
      <nav className="mx-auto max-w-[1440px] px-6 md:px-12 h-16 flex items-center justify-between">
        <a
          href="#top"
          className="font-ui text-[11px] uppercase text-foreground transition-colors duration-200 ease-out hover:text-accent"
        >
          Race Kipping
        </a>
        <ul className="font-ui flex items-center gap-8 text-[11px] uppercase text-muted-foreground">
          {items.map((it) => (
            <li key={it.href}>
              <a
                href={it.href}
                className="link-underline transition-colors duration-200 ease-out"
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
