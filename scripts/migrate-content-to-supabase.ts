import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/types/supabase";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const CONTENT_ROOT = path.join(process.cwd(), "content");

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set",
  );
  process.exit(1);
}

const supabase = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY);

const MODE = process.argv.includes("--verify")
  ? "verify"
  : process.argv.includes("--import")
    ? "import"
    : "import-and-verify";

function toSlug(fileName: string, frontmatter: Record<string, unknown>) {
  const raw =
    (frontmatter.slug as string | undefined) ??
    (frontmatter.id as string | undefined) ??
    fileName.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.json$/, "");

  return raw
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function normalizeIsoDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function parseStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

function parseLinkArray(value: unknown): Array<{ label: string; url: string }> | null {
  if (!Array.isArray(value)) return null;

  const links = value
    .filter(
      (item): item is { label: string; url: string } =>
        !!item &&
        typeof item === "object" &&
        typeof (item as { label?: unknown }).label === "string" &&
        typeof (item as { url?: unknown }).url === "string",
    )
    .map((item) => ({ label: item.label, url: item.url }));

  return links.length > 0 ? links : null;
}

// ============================================================================
// 1. BLOG POSTS MIGRATION
// ============================================================================

async function migrateBlogPosts() {
  console.log("\n📝 Migrating blog posts...");

  const blogDir = path.join(CONTENT_ROOT, "blog");
  const files = await fs.readdir(blogDir);
  const mdFiles = files.filter((f) => f.endsWith(".md"));

  for (const file of mdFiles) {
    const content = await fs.readFile(path.join(blogDir, file), "utf8");
    const { data, content: body } = matter(content);

    const slug = toSlug(file, data);

    const insertData: Database["public"]["Tables"]["blog_posts"]["Insert"] = {
      slug,
      title: (data.title as string) || "Untitled",
      excerpt: (data.excerpt as string) || "",
      body: body.trim(),
      cover_image_url: (data.coverImage as string) || null,
      tags: parseStringArray(data.tags),
      published_at: normalizeIsoDate(data.date),
      status: "published",
      featured: Boolean(data.featured),
      seo_title: (data.seo_title as string) || null,
      seo_description: (data.seo_description as string) || null,
    };

    // Upsert (insert if not exists, update if exists)
    const { error } = await supabase.from("blog_posts").upsert(insertData, { onConflict: "slug" });

    if (error) {
      console.error(`❌ Error importing blog post ${slug}:`, error.message);
    } else {
      console.log(`✓ Imported blog post: ${slug}`);
    }
  }

  // Report
  const { data: allPosts } = await supabase.from("blog_posts").select("id");
  console.log(`✅ Blog posts: ${allPosts?.length || 0} total`);
}

// ============================================================================
// 2. PROJECTS MIGRATION
// ============================================================================

async function migrateProjects() {
  console.log("\n🎨 Migrating projects...");

  const projectsDir = path.join(CONTENT_ROOT, "projects");
  const files = await fs.readdir(projectsDir);
  const mdFiles = files.filter((f) => f.endsWith(".md"));

  for (const file of mdFiles) {
    const content = await fs.readFile(path.join(projectsDir, file), "utf8");
    const { data, content: body } = matter(content);

    const slug = toSlug(file, data);

    const insertData: Database["public"]["Tables"]["projects"]["Insert"] = {
      slug,
      title: (data.title as string) || "Untitled",
      summary: (data.excerpt as string) || "",
      body: body.trim(),
      role: (data.role as string) || null,
      timeline: (data.timeline as string) || null,
      tools: parseStringArray(data.tools),
      impact: parseStringArray(data.impact),
      links: parseLinkArray(data.externalLinks),
      gallery_images: null,
      cover_image_url: (data.coverImage as string) || null,
      tags: parseStringArray(data.tags),
      published_at: normalizeIsoDate(data.date),
      status: "published",
      featured: Boolean(data.featured),
      seo_title: (data.seo_title as string) || null,
      seo_description: (data.seo_description as string) || null,
    };

    const { error } = await supabase.from("projects").upsert(insertData, { onConflict: "slug" });

    if (error) {
      console.error(`❌ Error importing project ${slug}:`, error.message);
    } else {
      console.log(`✓ Imported project: ${slug}`);
    }
  }

  const { data: allProjects } = await supabase.from("projects").select("id");
  console.log(`✅ Projects: ${allProjects?.length || 0} total`);
}

// ============================================================================
// 3. RESEARCH POSTS MIGRATION
// ============================================================================

async function migrateResearchPosts() {
  console.log("\n🔬 Migrating research posts...");

  const researchDir = path.join(CONTENT_ROOT, "research");
  const files = await fs.readdir(researchDir);
  const mdFiles = files.filter((f) => f.endsWith(".md"));

  for (const file of mdFiles) {
    const content = await fs.readFile(path.join(researchDir, file), "utf8");
    const { data, content: body } = matter(content);

    const slug = toSlug(file, data);

    const insertData: Database["public"]["Tables"]["research_posts"]["Insert"] =
      {
        slug,
        title: (data.title as string) || "Untitled",
        abstract: (data.excerpt as string) || "",
        body: body.trim(),
        collaborators: (data.collaborators as string) || null,
        topic_tags: parseStringArray(data.topic_tags ?? data.tags),
        publication_status: (data.status as string) || null,
        related_links: parseLinkArray(data.relatedLinks),
        cover_image_url: (data.coverImage as string) || null,
        tags: parseStringArray(data.tags),
        published_at: normalizeIsoDate(data.date),
        status: "published",
        featured: Boolean(data.featured),
        seo_title: (data.seo_title as string) || null,
        seo_description: (data.seo_description as string) || null,
      };

    const { error } = await supabase.from("research_posts").upsert(insertData, { onConflict: "slug" });

    if (error) {
      console.error(
        `❌ Error importing research post ${slug}:`,
        error.message,
      );
    } else {
      console.log(`✓ Imported research post: ${slug}`);
    }
  }

  const { data: allResearch } = await supabase
    .from("research_posts")
    .select("id");
  console.log(`✅ Research posts: ${allResearch?.length || 0} total`);
}

// ============================================================================
// 4. SELECTED LINKS MIGRATION
// ============================================================================

async function migrateSelectedLinks() {
  console.log("\n🔗 Migrating selected links...");

  const linksDir = path.join(CONTENT_ROOT, "links");
  const files = await fs.readdir(linksDir);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  for (const file of jsonFiles) {
    const content = await fs.readFile(path.join(linksDir, file), "utf8");
    const data = JSON.parse(content) as {
      title: string;
      url: string;
      source: string;
      date: string;
      excerpt?: string;
      tags?: string[];
      featured?: boolean;
    };

    const slug = toSlug(file, {});

    const insertData: Database["public"]["Tables"]["selected_links"]["Insert"] =
      {
        slug,
        title: data.title,
        url: data.url,
        source: data.source,
        excerpt: data.excerpt || null,
        tags: data.tags || [],
        published_at: normalizeIsoDate(data.date),
        featured: data.featured || false,
      };

    const { error } = await supabase.from("selected_links").upsert(insertData, { onConflict: "slug" });

    if (error) {
      console.error(
        `❌ Error importing selected link ${slug}:`,
        error.message,
      );
    } else {
      console.log(`✓ Imported selected link: ${slug}`);
    }
  }

  const { data: allLinks } = await supabase.from("selected_links").select("id");
  console.log(`✅ Selected links: ${allLinks?.length || 0} total`);
}

async function verifySourceAndDatabaseCounts() {
  console.log("\n🔎 Verifying imported records against source files...");

  const [
    sourceBlog,
    sourceProjects,
    sourceResearch,
    sourceLinks,
    dbBlog,
    dbProjects,
    dbResearch,
    dbLinks,
  ] = await Promise.all([
    fs.readdir(path.join(CONTENT_ROOT, "blog")),
    fs.readdir(path.join(CONTENT_ROOT, "projects")),
    fs.readdir(path.join(CONTENT_ROOT, "research")),
    fs.readdir(path.join(CONTENT_ROOT, "links")),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("research_posts").select("id", { count: "exact", head: true }),
    supabase.from("selected_links").select("id", { count: "exact", head: true }),
  ]);

  const sourceCounts = {
    blog: sourceBlog.filter((file) => file.endsWith(".md")).length,
    projects: sourceProjects.filter((file) => file.endsWith(".md")).length,
    research: sourceResearch.filter((file) => file.endsWith(".md")).length,
    links: sourceLinks.filter((file) => file.endsWith(".json")).length,
  };

  const dbCounts = {
    blog: dbBlog.count || 0,
    projects: dbProjects.count || 0,
    research: dbResearch.count || 0,
    links: dbLinks.count || 0,
  };

  const checks = [
    ["blog_posts", sourceCounts.blog, dbCounts.blog],
    ["projects", sourceCounts.projects, dbCounts.projects],
    ["research_posts", sourceCounts.research, dbCounts.research],
    ["selected_links", sourceCounts.links, dbCounts.links],
  ] as const;

  let allPassed = true;

  for (const [table, sourceCount, dbCount] of checks) {
    const passed = dbCount >= sourceCount;
    allPassed = allPassed && passed;
    const prefix = passed ? "✅" : "⚠️";
    console.log(`${prefix} ${table}: source=${sourceCount}, database=${dbCount}`);
  }

  if (!allPassed) {
    console.log("\n⚠️ Verification found mismatches. Review data before switching public pages.");
  } else {
    console.log("\n✅ Verification passed. Supabase has all expected editorial records.");
  }
}

// ============================================================================
// 5. MAIN ENTRY POINT
// ============================================================================

async function main() {
  console.log(`🚀 Starting Supabase content utility in mode: ${MODE}\n`);

  try {
    if (MODE === "import" || MODE === "import-and-verify") {
      await migrateBlogPosts();
      await migrateProjects();
      await migrateResearchPosts();
      await migrateSelectedLinks();
    }

    if (MODE === "verify" || MODE === "import-and-verify") {
      await verifySourceAndDatabaseCounts();
    }

    console.log("\n✨ Supabase content utility completed.\n");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

main();
