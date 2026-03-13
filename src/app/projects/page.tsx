import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/site/SectionHeader";
import { getProjects } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected projects spanning research, leadership, and applied problem-solving.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="editorial-shell editorial-section">
      <SectionHeader
        kicker="Projects"
        title="Meaningful work with practical execution"
        description="A curated set of initiatives across social impact, robotics strategy, and student leadership."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.slug} className="h-full">
            <CardHeader>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {formatDate(project.date)}
              </p>
              <CardTitle className="text-xl">{project.title}</CardTitle>
              {project.timeline ? (
                <p className="text-sm text-secondary-dark">{project.timeline}</p>
              ) : null}
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">{project.excerpt}</p>
              <div className="mb-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Link href={`/projects/${project.slug}`} className="inline-flex items-center text-sm text-secondary-dark">
                View project detail <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
