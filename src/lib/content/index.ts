import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type {
  EducationItem,
  ExperienceItem,
  HomeContent,
  HonorItem,
  SiteSettings,
} from "@/types/content";
import {
  getBlogPostBySlugFromSupabase,
  getBlogPostsFromSupabase,
  getProjectsFromSupabase,
  getProjectBySlugFromSupabase,
  getResearchPostsFromSupabase,
  getResearchBySlugFromSupabase,
  getSelectedLinksFromSupabase,
} from "@/lib/supabase/queries";

const CONTENT_ROOT = path.join(process.cwd(), "content");

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
  return getSelectedLinksFromSupabase();
}

export async function getBlogPosts() {
  return getBlogPostsFromSupabase();
}

export async function getProjects() {
  return getProjectsFromSupabase();
}

export async function getResearchPosts() {
  return getResearchPostsFromSupabase();
}

export async function getBlogPostBySlug(slug: string) {
  return getBlogPostBySlugFromSupabase(slug);
}

export async function getProjectBySlug(slug: string) {
  return getProjectBySlugFromSupabase(slug);
}

export async function getResearchBySlug(slug: string) {
  return getResearchBySlugFromSupabase(slug);
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
