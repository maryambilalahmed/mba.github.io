import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/site/SectionHeader";
import {
  getBlogPosts,
  getHomeContent,
  getLinks,
  getProjects,
  getResearchPosts,
  getSiteSettings,
} from "@/lib/content";

export default async function HomePage() {
  const [site, home, projects, research, blog, links] = await Promise.all([
    getSiteSettings(),
    getHomeContent(),
    getProjects(),
    getResearchPosts(),
    getBlogPosts(),
    getLinks(),
  ]);

  const featuredProjects = projects.filter((item) => item.featured).slice(0, 3);
  const featuredResearch = research.filter((item) => item.featured).slice(0, 3);
  const featuredBlog = blog.slice(0, 3);
  const featuredLinks = links.filter((item) => item.featured).slice(0, 3);

  return (
    <>
      <section className="editorial-section border-b bg-muted/30">
        <div className="editorial-shell">
          <p className="kicker mb-4">Maryam Bilal Ahmed</p>
          <h1 className="max-w-4xl text-4xl font-semibold text-primary md:text-6xl">
            {home.heroTitle}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            {home.heroSubtitle}
          </p>
          <p className="mt-4 max-w-3xl text-foreground/90">{home.positioning}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={home.ctaPrimary.href}>{home.ctaPrimary.label}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={home.ctaSecondary.href}>{home.ctaSecondary.label}</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/about">About Maryam</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="editorial-shell grid gap-4 md:grid-cols-4">
          {home.highlights.map((highlight) => (
            <Card key={highlight.label}>
              <CardHeader className="pb-2">
                <p className="text-sm text-muted-foreground">{highlight.label}</p>
                <CardTitle className="text-2xl text-primary">{highlight.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="editorial-shell">
          <SectionHeader
            kicker="Current Focus"
            title="What I am working on now"
            description="A concise view of active intellectual and project priorities."
          />
          <ul className="space-y-3">
            {home.currentFocus.map((focus) => (
              <li key={focus} className="rounded-lg border bg-card p-4 text-card-foreground">
                {focus}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="editorial-section border-t">
        <div className="editorial-shell">
          <SectionHeader
            kicker="Projects"
            title="Selected project work"
            description="Leadership and execution across social impact, robotics, and student initiatives."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {featuredProjects.map((project) => (
              <Card key={project.slug}>
                <CardHeader>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">{project.excerpt}</p>
                  <Button asChild variant="ghost" className="px-0">
                    <Link href={`/projects/${project.slug}`}>
                      Read case study <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section border-t bg-muted/20">
        <div className="editorial-shell">
          <SectionHeader
            kicker="Research"
            title="Research as a first-class body of work"
            description="Fieldwork, essays, and structured academic preparation in economics."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {featuredResearch.map((item) => (
              <Card key={item.slug}>
                <CardHeader>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">{item.excerpt}</p>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {item.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button asChild variant="ghost" className="px-0">
                    <Link href={`/research/${item.slug}`}>View research note</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section border-t">
        <div className="editorial-shell grid gap-10 md:grid-cols-2">
          <div>
            <SectionHeader kicker="Writing" title="Recent writing" />
            <div className="space-y-4">
              {featuredBlog.map((post) => (
                <Card key={post.slug}>
                  <CardContent className="p-5">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{post.date}</p>
                    <h3 className="mt-2 text-lg font-semibold text-primary">{post.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="mt-3 inline-block text-sm text-secondary-dark">
                      Read article
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader kicker="Selected External Posts" title="From LinkedIn and beyond" />
            <div className="space-y-4">
              {featuredLinks.map((item) => (
                <Card key={item.title}>
                  <CardContent className="p-5">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.source}</p>
                    <h3 className="mt-2 text-lg font-semibold text-primary">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.excerpt}</p>
                    <Link href={item.url} className="mt-3 inline-block text-sm text-secondary-dark" target="_blank">
                      Open post
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section border-t bg-primary text-primary-foreground">
        <div className="editorial-shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="kicker text-primary-foreground/80">Contact</p>
            <h2 className="text-3xl">Open to thoughtful collaborations and conversations</h2>
            <p className="mt-2 max-w-2xl text-primary-foreground/90">
              Reach out for research dialogue, writing opportunities, or student-led project partnerships.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="secondary">
              <Link href="/contact">Contact</Link>
            </Button>
            <Button asChild variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href={`mailto:${site.email}`}>Email</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
