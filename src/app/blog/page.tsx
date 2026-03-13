import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ContentMeta } from "@/components/site/ContentMeta";
import { getBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing on economics, fieldwork, and student perspective.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="editorial-shell editorial-section">
      <SectionHeader
        kicker="Blog"
        title="Essays and reflections"
        description="Writing that connects economic ideas, field observations, and practical questions about work and wellbeing."
      />

      <div className="space-y-5">
        {posts.map((post) => (
          <Card key={post.slug}>
            <CardHeader>
              <CardTitle className="text-2xl">{post.title}</CardTitle>
              <ContentMeta date={post.date} tags={post.tags} readingTime={post.readingTime} />
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-sm text-secondary-dark">
                Read article <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
