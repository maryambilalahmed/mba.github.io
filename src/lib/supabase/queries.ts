/**
 * Data access layer for editorial content from Supabase.
 * These functions replace file-based reading for blog, projects, research, links.
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// ============================================================================
// BLOG POSTS
// ============================================================================

export async function getBlogPostsFromSupabase() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?.map((post: any) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.published_at || post.created_at,
      featured: post.featured,
      tags: post.tags,
      coverImage: post.cover_image_url,
      body: post.body,
      readingTime: `${Math.ceil(post.body.split(/\s+/).length / 200)} min read`,
    })) || []
  );
}

export async function getBlogPostBySlugFromSupabase(slug: string) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const post = data as any;
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.published_at || post.created_at,
    featured: post.featured,
    tags: post.tags,
    coverImage: post.cover_image_url,
    body: post.body,
    readingTime: `${Math.ceil(post.body.split(/\s+/).length / 200)} min read`,
  };
}

// ============================================================================
// PROJECTS
// ============================================================================

export async function getProjectsFromSupabase() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?.map((project: any) => ({
      slug: project.slug,
      title: project.title,
      excerpt: project.summary,
      date: project.published_at || project.created_at,
      featured: project.featured,
      tags: project.tags,
      coverImage: project.cover_image_url,
      body: project.body,
      timeline: project.timeline,
      role: project.role,
      tools: project.tools || [],
      impact: project.impact || [],
      externalLinks: (project.links as Array<{ label: string; url: string }>) || [],
    })) || []
  );
}

export async function getProjectBySlugFromSupabase(slug: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const project = data as any;
  return {
    slug: project.slug,
    title: project.title,
    excerpt: project.summary,
    date: project.published_at || project.created_at,
    featured: project.featured,
    tags: project.tags,
    coverImage: project.cover_image_url,
    body: project.body,
    timeline: project.timeline,
    role: project.role,
    tools: project.tools || [],
    impact: project.impact || [],
    externalLinks: (project.links as Array<{ label: string; url: string }>) || [],
  };
}

// ============================================================================
// RESEARCH POSTS
// ============================================================================

export async function getResearchPostsFromSupabase() {
  const { data, error } = await supabase
    .from("research_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching research posts:", error);
    return [];
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?.map((post: any) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.abstract,
      date: post.published_at || post.created_at,
      featured: post.featured,
      tags: post.tags,
      coverImage: post.cover_image_url,
      body: post.body,
      type: post.publication_status,
      status: post.status,
      methods: [],
      timeline: null,
      impact: [],
    })) || []
  );
}

export async function getResearchBySlugFromSupabase(slug: string) {
  const { data, error } = await supabase
    .from("research_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const post = data as any;
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.abstract,
    date: post.published_at || post.created_at,
    featured: post.featured,
    tags: post.tags,
    coverImage: post.cover_image_url,
    body: post.body,
    type: post.publication_status,
    status: post.status,
    methods: [],
    timeline: null,
    impact: [],
  };
}

// ============================================================================
// SELECTED LINKS
// ============================================================================

export async function getSelectedLinksFromSupabase() {
  const { data, error } = await supabase
    .from("selected_links")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching selected links:", error);
    return [];
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?.map((link: any) => ({
      title: link.title,
      url: link.url,
      source: link.source,
      date: link.published_at || link.created_at,
      excerpt: link.excerpt,
      tags: link.tags,
      featured: link.featured,
    })) || []
  );
}

// ============================================================================
// UTILITY: Related posts by tags
// ============================================================================

export function getRelatedByTags<T extends { slug: string; tags: string[] }>(
  items: T[],
  currentSlug: string,
  count = 2,
) {
  const current = items.find((item) => item.slug === currentSlug);
  if (!current) return [];

  return items
    .filter((item) => item.slug !== currentSlug)
    .map((item) => {
      const overlap = item.tags.filter((tag) =>
        current.tags.includes(tag),
      ).length;
      return { item, overlap };
    })
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, count)
    .map(({ item }) => item);
}
