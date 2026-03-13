import type { MetadataRoute } from "next";
import { getBlogPosts, getProjects, getResearchPosts } from "@/lib/content";

const baseUrl = "https://maryambilalahmed.github.io";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blog, projects, research] = await Promise.all([
    getBlogPosts(),
    getProjects(),
    getResearchPosts(),
  ]);

  const staticRoutes = ["", "/about", "/projects", "/research", "/blog", "/links", "/contact", "/resume"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
    })),
    ...blog.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    })),
    ...projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(project.date),
    })),
    ...research.map((item) => ({
      url: `${baseUrl}/research/${item.slug}`,
      lastModified: new Date(item.date),
    })),
  ];
}
