import Link from "next/link";
import { Mail, Linkedin } from "lucide-react";
import { getSiteSettings } from "@/lib/content";

export async function SiteFooter() {
  const site = await getSiteSettings();

  return (
    <footer className="mt-16 border-t bg-muted/40">
      <div className="editorial-shell flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">{site.name}</p>
          <p className="text-sm text-muted-foreground">{site.tagline}</p>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <Link href={`mailto:${site.email}`} aria-label="Email" className="hover:text-primary">
            <Mail className="h-5 w-5" />
          </Link>
          <Link
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-primary"
          >
            <Linkedin className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
