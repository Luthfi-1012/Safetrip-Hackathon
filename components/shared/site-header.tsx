import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { Logo } from "./logo";

const links = [
  { href: "/plan", label: "Plan a trip" },
  { href: "/trips", label: "My trips" },
  { href: "/transparency", label: "How AI works" },
];

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  return (
    <header className={`site-header${overlay ? " site-header--overlay" : ""}`}>
      <div className="site-header__inner">
        <Logo inverse={overlay} />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
        <Link className="header-action" href="/plan">
          Start planning <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
        <details className="mobile-nav">
          <summary aria-label="Open navigation"><Menu size={22} aria-hidden="true" /></summary>
          <nav aria-label="Mobile navigation">
            {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          </nav>
        </details>
      </div>
    </header>
  );
}
