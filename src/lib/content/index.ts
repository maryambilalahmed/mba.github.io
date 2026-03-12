import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import getReadingTime from "reading-time";
import type {
  BlogPost,
  EducationItem,
  ExperienceItem,
  ExternalLinkItem,
  HomeContent,
  HonorItem,
  Project,
  ResearchPost,
  SiteSettings,
} from "@/types/content";

const CONTENT_ROOT = path.join(process.cwd(), "content");

const sortByDateDesc = <T extends { date: string }>(items: T[]) => {
  return [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};

const toSlug = (fileName: string, frontmatter: Record<string, unknown>) => {
  const raw =
    (frontmatter.slug as string | undefined) ??
    (frontmatter.id as string | undefined) ??
    fileName.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");

  return raw
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

async function readJson<T>(relativePath: string): Promise<T> {
  const file = await fs.readFile(path.join(CONTENT_ROOT, relativePath), "utf8");
  return JSON.parse(file) as T;
}

async function readJsonCollection<T>(relativeDir: string): Promise<T[]> {
  const dirPath = path.join(CONTENT_ROOT, relativeDir);
  const files = (await fs.readdir(dirPath)).filter((file) => file.endsWith(".json"));
  const items = await Promise.all(
    files.map(async (file) => readJson<T>(path.join(relativeDir, file))),
  );
  return items;
}

async function readMarkdownCollection<T>(
  relativeDir: string,
  mapFn: (props: {
    slug: string;
    data: Record<string, unknown>;
    body: string;
  }) => T,
): Promise<T[]> {
  const dirPath = path.join(CONTENT_ROOT, relativeDir);
  const files = (await fs.readdir(dirPath)).filter((file) => file.endsWith(".md"));

  const items = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(dirPath, file), "utf8");
      const { data, content } = matter(raw);
      const slug = toSlug(file, data);
      return mapFn({ slug, data, body: content.trim() });
    }),
  );

  return items;
}

export async function getSiteSettings() {
  return readJson<SiteSettings>("settings/site.json");
}

export async function getHomeContent() {
  return readJson<HomeContent>("home/home.json");
}

export async function getAboutProfile() {
  const raw = await fs.readFile(path.join(CONTENT_ROOT, "about/profile.md"), "utf8");
  const { content } = matter(raw);
  return content.trim();
}

export async function getEducation() {
  return readJsonCollection<EducationItem>("education");
}

export async function getHonors() {
  return readJsonCollection<HonorItem>("honors");
}

export async function getExperiences() {
  const data = await readJsonCollection<ExperienceItem>("experiences");
  return data.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export async function getLinks() {
  const links = await readJsonCollection<ExternalLinkItem>("links");
  return sortByDateDesc(links);
}

export async function getBlogPosts() {
  const posts = await readMarkdownCollection<BlogPost>("blog", ({ slug, data, body }) => ({
    slug,
    title: (data.title as string) ?? "Untitled",
    excerpt: (data.excerpt as string) ?? "",
    date: String(data.date ?? new Date().toISOString()),
    featured: Boolean(data.featured ?? false),
    tags: (data.tags as string[] | undefined) ?? [],
    coverImage: data.coverImage as string | undefined,
    body,
    readingTime: getReadingTime(body).text,
  }));

  return sortByDateDesc(posts);
}

export async function getProjects() {
  const projects = await readMarkdownCollection<Project>(
    "projects",
    ({ slug, data, body }) => ({
      slug,
      title: (data.title as string) ?? "Untitled",
      excerpt: (data.excerpt as string) ?? "",
      date: String(data.date ?? new Date().toISOString()),
      featured: Boolean(data.featured ?? false),
      tags: (data.tags as string[] | undefined) ?? [],
      coverImage: data.coverImage as string | undefined,
      body,
      timeline: data.timeline as string | undefined,
      role: data.role as string | undefined,
      tools: (data.tools as string[] | undefined) ?? [],
      impact: (data.impact as string[] | undefined) ?? [],
      externalLinks:
        (data.externalLinks as Array<{ label: string; url: string }> | undefined) ?? [],
    }),
  );

  return sortByDateDesc(projects);
}

export async function getResearchPosts() {
  const posts = await readMarkdownCollection<ResearchPost>(
    "research",
    ({ slug, data, body }) => ({
      slug,
      title: (data.title as string) ?? "Untitled",
      excerpt: (data.excerpt as string) ?? "",
      date: String(data.date ?? new Date().toISOString()),
      featured: Boolean(data.featured ?? false),
      tags: (data.tags as string[] | undefined) ?? [],
      coverImage: data.coverImage as string | undefined,
      body,
      type: data.type as string | undefined,
      status: data.status as string | undefined,
      methods: (data.methods as string[] | undefined) ?? [],
      timeline: data.timeline as string | undefined,
      impact: (data.impact as string[] | undefined) ?? [],
    }),
  );

  return sortByDateDesc(posts);
}

export async function getBlogPostBySlug(slug: string) {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getProjectBySlug(slug: string) {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getResearchBySlug(slug: string) {
  const posts = await getResearchPosts();
  return posts.find((post) => post.slug === slug);
}

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
      const overlap = item.tags.filter((tag) => current.tags.includes(tag)).length;
      return { item, overlap };
    })
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, count)
    .map(({ item }) => item);
}
