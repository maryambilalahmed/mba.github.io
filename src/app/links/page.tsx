import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/site/SectionHeader";
import { getLinks } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Selected Links",
  description: "Curated external posts and LinkedIn writing.",
};

export default async function LinksPage() {
  const links = await getLinks();

  return (
    <div className="editorial-shell editorial-section">
      <SectionHeader
        kicker="Selected Posts"
        title="From LinkedIn and external writing"
        description="A curated list of selected public notes and posts. This is intentionally edited, not a live feed."
      />

      <div className="space-y-4">
        {links.map((item) => (
          <Card key={`${item.title}-${item.date}`}>
            <CardHeader>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {item.source} · {formatDate(item.date)}
                  </p>
                </div>
                {item.featured ? <Badge variant="outline">Featured</Badge> : null}
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">{item.excerpt}</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Link
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-secondary-dark"
              >
                Open external post <ExternalLink className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
