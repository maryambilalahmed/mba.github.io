"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProjectFormProps {
  postId?: string;
  params?: { id: string };
}

function parseJsonLinks(input: string): Array<{ label: string; url: string }> {
  if (!input.trim()) return [];
  try {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) {
      return parsed
        .filter(
          (item): item is { label: string; url: string } =>
            !!item && typeof item.label === "string" && typeof item.url === "string",
        )
        .map((item) => ({ label: item.label, url: item.url }));
    }
    return [];
  } catch {
    return [];
  }
}

export default function ProjectFormPage({ postId, params }: ProjectFormProps) {
  const currentPostId = postId ?? params?.id;
  const [loading, setLoading] = useState(!!currentPostId);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    summary: "",
    body: "",
    role: "",
    timeline: "",
    tools: [] as string[],
    impact: [] as string[],
    linksText: "",
    cover_image_url: "",
    tags: [] as string[],
    status: "draft" as "draft" | "published",
    featured: false,
    seo_title: "",
    seo_description: "",
  });

  async function loadProject() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", currentPostId!)
        .single();

      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const project = data as any;
      if (project) {
        setFormData({
          slug: project.slug,
          title: project.title,
          summary: project.summary,
          body: project.body,
          role: project.role || "",
          timeline: project.timeline || "",
          tools: project.tools || [],
          impact: project.impact || [],
          linksText: JSON.stringify(project.links || [], null, 2),
          cover_image_url: project.cover_image_url || "",
          tags: project.tags || [],
          status: project.status,
          featured: project.featured || false,
          seo_title: project.seo_title || "",
          seo_description: project.seo_description || "",
        });
      }
    } catch (err) {
      console.error("Error loading project:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currentPostId) {
      void loadProject();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPostId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const supabase = createClient();

      const payload = {
        slug: formData.slug,
        title: formData.title,
        summary: formData.summary,
        body: formData.body,
        role: formData.role || null,
        timeline: formData.timeline || null,
        tools: formData.tools,
        impact: formData.impact,
        links: parseJsonLinks(formData.linksText),
        cover_image_url: formData.cover_image_url || null,
        tags: formData.tags,
        status: formData.status,
        featured: formData.featured,
        seo_title: formData.seo_title || null,
        seo_description: formData.seo_description || null,
        published_at:
          formData.status === "published" ? new Date().toISOString() : null,
      };

      if (currentPostId) {
        const { error } = await supabase
          .from("projects")
          // @ts-expect-error - Supabase types issue
          .update(payload)
          .eq("id", currentPostId);
        if (error) throw error;
      } else {
        // @ts-expect-error - Supabase types issue
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      console.error("Error saving project:", err);
      alert("Error saving project. Check console for details.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/projects">
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{currentPostId ? "Edit Project" : "Create Project"}</CardTitle>
            <CardDescription>
              {currentPostId ? "Update your project" : "Add a new portfolio project"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL-friendly)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="my-project"
                required
              />
              <p className="text-xs text-muted-foreground">Used in URL: /projects/{formData.slug}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Project title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Brief project summary"
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Content (Markdown)</Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder="# Project details"
                rows={12}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Founder, Researcher, Developer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  placeholder="Jun 2024 - Aug 2024"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tools">Tools (comma-separated)</Label>
              <Input
                id="tools"
                value={formData.tools.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tools: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  })
                }
                placeholder="Python, Figma, SQL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="impact">Impact Points (comma-separated)</Label>
              <Input
                id="impact"
                value={formData.impact.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    impact: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  })
                }
                placeholder="Built MVP, Tested with 20 users"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linksText">External Links JSON (optional)</Label>
              <Textarea
                id="linksText"
                value={formData.linksText}
                onChange={(e) => setFormData({ ...formData, linksText: e.target.value })}
                placeholder={'[{"label":"Live Demo","url":"https://example.com"}]'}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_image_url">Cover Image URL</Label>
              <Input
                id="cover_image_url"
                value={formData.cover_image_url}
                onChange={(e) =>
                  setFormData({ ...formData, cover_image_url: e.target.value })
                }
                placeholder="https://example.com/project-cover.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  })
                }
                placeholder="education, startup, impact"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value as "draft" | "published" })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <span className="text-sm font-medium">Featured Project</span>
                </label>
              </div>
            </div>

            <div className="space-y-2 rounded-lg bg-muted/50 p-4">
              <Label htmlFor="seo_title">SEO Title (optional)</Label>
              <Input
                id="seo_title"
                value={formData.seo_title}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                placeholder="Custom page title"
              />

              <Label htmlFor="seo_description" className="mt-3">
                SEO Description (optional)
              </Label>
              <Textarea
                id="seo_description"
                value={formData.seo_description}
                onChange={(e) =>
                  setFormData({ ...formData, seo_description: e.target.value })
                }
                placeholder="Custom meta description"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/admin/projects">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Project"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
