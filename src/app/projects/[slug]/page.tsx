import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownContent } from "@/components/site/MarkdownContent";
import { getProjectBySlug, getProjects, getRelatedByTags } from "@/lib/content";
import { formatDate } from "@/lib/format";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.title,
    description: project.excerpt,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([getProjectBySlug(slug), getProjects()]);

  if (!project) {
    notFound();
  }

  const related = getRelatedByTags(allProjects, project.slug, 2);

  return (
    <div className="editorial-shell editorial-section">
      <Link href="/projects" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to projects
      </Link>

      <article className="mx-auto max-w-4xl">
        <header className="mb-8 border-b pb-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{formatDate(project.date)}</p>
          <h1 className="mt-3 text-4xl text-primary">{project.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{project.excerpt}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mt-6 grid gap-3 rounded-lg border bg-muted/20 p-4 text-sm md:grid-cols-2">
            {project.role ? (
              <p>
                <span className="font-medium text-primary">Role:</span> {project.role}
              </p>
            ) : null}
            {project.timeline ? (
              <p>
                <span className="font-medium text-primary">Timeline:</span> {project.timeline}
              </p>
            ) : null}
          </div>
        </header>

        <MarkdownContent content={project.body} />

        {project.tools.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-2xl text-primary">Tools and approach</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tools.map((tool) => (
                <Badge key={tool} variant="outline">
                  {tool}
                </Badge>
              ))}
            </div>
          </section>
        ) : null}

        {project.impact.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-2xl text-primary">Impact</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              {project.impact.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {project.externalLinks.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-2xl text-primary">Related links</h2>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              {project.externalLinks.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-dark hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>

      {related.length > 0 ? (
        <section className="mx-auto mt-14 max-w-4xl">
          <h2 className="mb-4 text-2xl text-primary">Related projects</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {related.map((item) => (
              <Card key={item.slug}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-sm text-muted-foreground">{item.excerpt}</p>
                  <Link href={`/projects/${item.slug}`} className="text-sm text-secondary-dark">
                    Read more
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
