import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/site/SectionHeader";
import { getResearchPosts } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Research",
  description: "Research portfolio including fieldwork, essays, and economics preparation.",
};

export default async function ResearchPage() {
  const research = await getResearchPosts();

  return (
    <div className="editorial-shell editorial-section">
      <SectionHeader
        kicker="Research"
        title="Field-informed economics work"
        description="Primary research, academic essays, and competition preparation documented as serious intellectual work."
      />

      <div className="space-y-5">
        {research.map((item) => (
          <Card key={item.slug}>
            <CardHeader>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{formatDate(item.date)}</p>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.type ? <Badge variant="outline">{item.type}</Badge> : null}
                  {item.status ? <Badge variant="secondary">{item.status}</Badge> : null}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">{item.excerpt}</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Link href={`/research/${item.slug}`} className="inline-flex items-center text-sm text-secondary-dark">
                Read research detail <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
