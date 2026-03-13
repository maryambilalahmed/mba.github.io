/**
 * Migration script: Import file-based content to Supabase
 * 
 * Usage:
 *   npx tsx scripts/migrate-content-to-supabase.ts
 * 
 * This script:
 *  1. Reads blog posts, projects, research, and links from /content
 *  2. Transforms them to Supabase table format
 *  3. Inserts into the corresponding tables
 *  4. Verifies counts
 * 
 * ⚠️ IDEMPOTENT: Safe to run multiple times (updates existing, inserts new)
 * ⚠️ Requires SUPABASE_SERVICE_ROLE_KEY in environment
 */

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

    const slug =
      (data.slug as string) ||
      (data.id as string) ||
      file
        .replace(/\.md$/, "")
        .replace(/^\d{4}-\d{2}-\d{2}-/, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    const insertData: Database["public"]["Tables"]["blog_posts"]["Insert"] = {
      slug,
      title: (data.title as string) || "Untitled",
      excerpt: (data.excerpt as string) || "",
      body: body.trim(),
      cover_image_url: (data.coverImage as string) || null,
      tags: (Array.isArray(data.tags) ? data.tags : []) as string[],
      published_at: new Date(data.date as string).toISOString(),
      status: "published",
      featured: Boolean(data.featured),
      seo_title: (data.seo_title as string) || null,
      seo_description: (data.seo_description as string) || null,
    };

    // Upsert (insert if not exists, update if exists)
    const { error } = await supabase
      .from("blog_posts")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert(insertData as any, { onConflict: "slug" });

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

    const slug = file
      .replace(/\.md$/, "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const insertData: Database["public"]["Tables"]["projects"]["Insert"] = {
      slug,
      title: (data.title as string) || "Untitled",
      summary: (data.excerpt as string) || "",
      body: body.trim(),
      role: (data.role as string) || null,
      timeline: (data.timeline as string) || null,
      tools: (Array.isArray(data.tools) ? data.tools : []) as string[],
      impact: (Array.isArray(data.impact) ? data.impact : []) as string[],
      links:
        (Array.isArray(data.externalLinks) ? data.externalLinks : null) || null,
      gallery_images: null,
      cover_image_url: (data.coverImage as string) || null,
      tags: (Array.isArray(data.tags) ? data.tags : []) as string[],
      published_at: new Date(data.date as string).toISOString(),
      status: "published",
      featured: Boolean(data.featured),
      seo_title: (data.seo_title as string) || null,
      seo_description: (data.seo_description as string) || null,
    };

    const { error } = await supabase
      .from("projects")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert(insertData as any, { onConflict: "slug" });

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

    const slug = file
      .replace(/\.md$/, "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const insertData: Database["public"]["Tables"]["research_posts"]["Insert"] =
      {
        slug,
        title: (data.title as string) || "Untitled",
        abstract: (data.excerpt as string) || "",
        body: body.trim(),
        collaborators: (data.collaborators as string) || null,
        topic_tags: (Array.isArray(data.tags) ? data.tags : []) as string[],
        publication_status: (data.status as string) || null,
        related_links: null,
        cover_image_url: (data.coverImage as string) || null,
        tags: (Array.isArray(data.tags) ? data.tags : []) as string[],
        published_at: new Date(data.date as string).toISOString(),
        status: "published",
        featured: Boolean(data.featured),
        seo_title: (data.seo_title as string) || null,
        seo_description: (data.seo_description as string) || null,
      };

    const { error } = await supabase
      .from("research_posts")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert(insertData as any, { onConflict: "slug" });

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

    const slug = file
      .replace(/\.json$/, "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const insertData: Database["public"]["Tables"]["selected_links"]["Insert"] =
      {
        slug,
        title: data.title,
        url: data.url,
        source: data.source,
        excerpt: data.excerpt || null,
        tags: data.tags || [],
        published_at: new Date(data.date).toISOString(),
        featured: data.featured || false,
      };

    const { error } = await supabase
      .from("selected_links")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert(insertData as any, { onConflict: "slug" });

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

// ============================================================================
// 5. MAIN ENTRY POINT
// ============================================================================

async function main() {
  console.log("🚀 Starting content migration to Supabase...\n");

  try {
    await migrateBlogPosts();
    await migrateProjects();
    await migrateResearchPosts();
    await migrateSelectedLinks();

    console.log("\n✨ Migration complete!\n");
    console.log("📊 Summary:");
    console.log("   - Blog posts migrated");
    console.log("   - Projects migrated");
    console.log("   - Research posts migrated");
    console.log("   - Selected links migrated");
    console.log("\n📝 Next steps:");
    console.log("   1. Verify data in Supabase dashboard");
    console.log("   2. Update public routes to read from Supabase");
    console.log("   3. Test all pages render correctly");
    console.log("   4. Deploy to production");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

main();
