import getReadingTime from "reading-time";
import { createClient } from "@supabase/supabase-js";
import type { BlogPost, ExternalLinkItem, Project, ResearchPost } from "@/types/content";
import type { Database } from "@/types/supabase";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

const supabaseEnvReady =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseEnvReady
  ? createClient<Database>(getSupabasePublicEnv().url, getSupabasePublicEnv().anonKey)
  : null;

function getPublicClient() {
  if (!supabase) {
    return null;
  }
  return supabase;
}

// ============================================================================
// BLOG POSTS
// ============================================================================

export async function getBlogPostsFromSupabase() {
  const client = getPublicClient();
  if (!client) return [];

  const { data, error } = await client
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }

  const rows = (data || []) as Database["public"]["Tables"]["blog_posts"]["Row"][];

  return rows.map((post): BlogPost => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.published_at || post.created_at,
      featured: post.featured,
      tags: post.tags,
      coverImage: post.cover_image_url || undefined,
      body: post.body,
      readingTime: getReadingTime(post.body).text,
    }));
}

export async function getBlogPostBySlugFromSupabase(slug: string) {
  const client = getPublicClient();
  if (!client) return null;

  const { data, error } = await client
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`)
    .single();

  if (error || !data) {
    return null;
  }

  const post = data as Database["public"]["Tables"]["blog_posts"]["Row"];

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.published_at || post.created_at,
    featured: post.featured,
    tags: post.tags,
    coverImage: post.cover_image_url || undefined,
    body: post.body,
    readingTime: getReadingTime(post.body).text,
  } satisfies BlogPost;
}

// ============================================================================
// PROJECTS
// ============================================================================

export async function getProjectsFromSupabase() {
  const client = getPublicClient();
  if (!client) return [];

  const { data, error } = await client
    .from("projects")
    .select("*")
    .eq("status", "published")
    .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  const rows = (data || []) as Database["public"]["Tables"]["projects"]["Row"][];

  return rows.map((project): Project => ({
      slug: project.slug,
      title: project.title,
      excerpt: project.summary,
      date: project.published_at || project.created_at,
      featured: project.featured,
      tags: project.tags,
      coverImage: project.cover_image_url || undefined,
      body: project.body,
      timeline: project.timeline || undefined,
      role: project.role || undefined,
      tools: project.tools || [],
      impact: project.impact || [],
      externalLinks: Array.isArray(project.links)
        ? (project.links as Array<{ label: string; url: string }>)
        : [],
    }));
}

export async function getProjectBySlugFromSupabase(slug: string) {
  const client = getPublicClient();
  if (!client) return null;

  const { data, error } = await client
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`)
    .single();

  if (error || !data) {
    return null;
  }

  const project = data as Database["public"]["Tables"]["projects"]["Row"];

  return {
    slug: project.slug,
    title: project.title,
    excerpt: project.summary,
    date: project.published_at || project.created_at,
    featured: project.featured,
    tags: project.tags,
    coverImage: project.cover_image_url || undefined,
    body: project.body,
    timeline: project.timeline || undefined,
    role: project.role || undefined,
    tools: project.tools || [],
    impact: project.impact || [],
    externalLinks: Array.isArray(project.links)
      ? (project.links as Array<{ label: string; url: string }>)
      : [],
  } satisfies Project;
}

// ============================================================================
// RESEARCH POSTS
// ============================================================================

export async function getResearchPostsFromSupabase() {
  const client = getPublicClient();
  if (!client) return [];

  const { data, error } = await client
    .from("research_posts")
    .select("*")
    .eq("status", "published")
    .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching research posts:", error);
    return [];
  }

  const rows = (data || []) as Database["public"]["Tables"]["research_posts"]["Row"][];

  return rows.map((post): ResearchPost => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.abstract,
      date: post.published_at || post.created_at,
      featured: post.featured,
      tags: post.tags,
      coverImage: post.cover_image_url || undefined,
      body: post.body,
      type: post.publication_status || undefined,
      status: post.status,
      methods: [],
      timeline: undefined,
      impact: [],
    }));
}

export async function getResearchBySlugFromSupabase(slug: string) {
  const client = getPublicClient();
  if (!client) return null;

  const { data, error } = await client
    .from("research_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`)
    .single();

  if (error || !data) {
    return null;
  }

  const post = data as Database["public"]["Tables"]["research_posts"]["Row"];

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.abstract,
    date: post.published_at || post.created_at,
    featured: post.featured,
    tags: post.tags,
    coverImage: post.cover_image_url || undefined,
    body: post.body,
    type: post.publication_status || undefined,
    status: post.status,
    methods: [],
    timeline: undefined,
    impact: [],
  } satisfies ResearchPost;
}

// ============================================================================
// SELECTED LINKS
// ============================================================================

export async function getSelectedLinksFromSupabase() {
  const client = getPublicClient();
  if (!client) return [];

  const { data, error } = await client
    .from("selected_links")
    .select("*")
    .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching selected links:", error);
    return [];
  }

  const rows = (data || []) as Database["public"]["Tables"]["selected_links"]["Row"][];

  return rows.map((link): ExternalLinkItem => ({
      title: link.title,
      url: link.url,
      source: link.source,
      date: link.published_at || link.created_at,
      excerpt: link.excerpt || "",
      tags: link.tags,
      featured: link.featured,
    }));
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
