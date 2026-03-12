import Link from "next/link";
import { getSiteSettings } from "@/lib/content";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/blog", label: "Blog" },
  { href: "/links", label: "Links" },
  { href: "/contact", label: "Contact" },
];

export async function SiteHeader() {
  const site = await getSiteSettings();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="editorial-shell flex h-16 items-center justify-between">
        <Link href="/" className="text-sm font-semibold tracking-wide text-primary md:text-base">
          {site.name}
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
