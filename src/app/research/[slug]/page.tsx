import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownContent } from "@/components/site/MarkdownContent";
import { getRelatedByTags, getResearchBySlug, getResearchPosts } from "@/lib/content";
import { formatDate } from "@/lib/format";

interface ResearchDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const research = await getResearchPosts();
  return research.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: ResearchDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getResearchBySlug(slug);

  if (!post) {
    return { title: "Research not found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function ResearchDetailPage({ params }: ResearchDetailPageProps) {
  const { slug } = await params;
  const [post, allResearch] = await Promise.all([getResearchBySlug(slug), getResearchPosts()]);

  if (!post) {
    notFound();
  }

  const related = getRelatedByTags(allResearch, post.slug, 2);

  return (
    <div className="editorial-shell editorial-section">
      <Link href="/research" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to research
      </Link>

      <article className="mx-auto max-w-4xl">
        <header className="mb-8 border-b pb-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{formatDate(post.date)}</p>
          <h1 className="mt-3 text-4xl text-primary">{post.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{post.excerpt}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {post.type ? <Badge variant="outline">{post.type}</Badge> : null}
            {post.status ? <Badge variant="secondary">{post.status}</Badge> : null}
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mt-6 grid gap-3 rounded-lg border bg-muted/20 p-4 text-sm md:grid-cols-2">
            {post.timeline ? (
              <p>
                <span className="font-medium text-primary">Timeline:</span> {post.timeline}
              </p>
            ) : null}
          </div>
        </header>

        <MarkdownContent content={post.body} />

        {post.methods.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-2xl text-primary">Methods</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              {post.methods.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {post.impact.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-2xl text-primary">Progress and impact</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              {post.impact.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>

      {related.length > 0 ? (
        <section className="mx-auto mt-14 max-w-4xl">
          <h2 className="mb-4 text-2xl text-primary">Related research</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {related.map((item) => (
              <Card key={item.slug}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-sm text-muted-foreground">{item.excerpt}</p>
                  <Link href={`/research/${item.slug}`} className="text-sm text-secondary-dark">
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
