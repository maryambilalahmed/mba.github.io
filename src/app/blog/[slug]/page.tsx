import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownContent } from "@/components/site/MarkdownContent";
import { ContentMeta } from "@/components/site/ContentMeta";
import { getBlogPostBySlug, getBlogPosts, getRelatedByTags } from "@/lib/content";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Article not found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getBlogPostBySlug(slug), getBlogPosts()]);

  if (!post) {
    notFound();
  }

  const related = getRelatedByTags(allPosts, post.slug, 2);

  return (
    <div className="editorial-shell editorial-section">
      <Link href="/blog" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to blog
      </Link>

      <article className="mx-auto max-w-3xl">
        <header className="mb-8 border-b pb-6">
          <h1 className="text-4xl text-primary">{post.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{post.excerpt}</p>
          <div className="mt-4">
            <ContentMeta date={post.date} tags={post.tags} readingTime={post.readingTime} />
          </div>
        </header>

        <MarkdownContent content={post.body} />
      </article>

      {related.length > 0 ? (
        <section className="mx-auto mt-14 max-w-3xl">
          <h2 className="mb-4 text-2xl text-primary">Related writing</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {related.map((item) => (
              <Card key={item.slug}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-sm text-muted-foreground">{item.excerpt}</p>
                  <Link href={`/blog/${item.slug}`} className="text-sm text-secondary-dark">
                    Read article
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
