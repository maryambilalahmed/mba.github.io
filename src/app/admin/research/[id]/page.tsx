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

interface ResearchFormProps {
  postId?: string;
  params?: { id: string };
}

function parseLinks(input: string): Array<{ label: string; url: string }> {
  if (!input.trim()) return [];
  try {
    const parsed = JSON.parse(input);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is { label: string; url: string } =>
          !!item && typeof item.label === "string" && typeof item.url === "string",
      )
      .map((item) => ({ label: item.label, url: item.url }));
  } catch {
    return [];
  }
}

export default function ResearchFormPage({ postId, params }: ResearchFormProps) {
  const currentPostId = postId ?? params?.id;
  const [loading, setLoading] = useState(!!currentPostId);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    abstract: "",
    body: "",
    collaborators: "",
    topic_tags: [] as string[],
    publication_status: "draft",
    related_links_text: "",
    cover_image_url: "",
    tags: [] as string[],
    status: "draft" as "draft" | "published",
    featured: false,
    seo_title: "",
    seo_description: "",
  });

  async function loadPost() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("research_posts")
        .select("*")
        .eq("id", currentPostId!)
        .single();

      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const post = data as any;
      if (post) {
        setFormData({
          slug: post.slug,
          title: post.title,
          abstract: post.abstract,
          body: post.body,
          collaborators: post.collaborators || "",
          topic_tags: post.topic_tags || [],
          publication_status: post.publication_status || "draft",
          related_links_text: JSON.stringify(post.related_links || [], null, 2),
          cover_image_url: post.cover_image_url || "",
          tags: post.tags || [],
          status: post.status,
          featured: post.featured || false,
          seo_title: post.seo_title || "",
          seo_description: post.seo_description || "",
        });
      }
    } catch (err) {
      console.error("Error loading research post:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currentPostId) {
      void loadPost();
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
        abstract: formData.abstract,
        body: formData.body,
        collaborators: formData.collaborators || null,
        topic_tags: formData.topic_tags,
        publication_status: formData.publication_status,
        related_links: parseLinks(formData.related_links_text),
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
          .from("research_posts")
          // @ts-expect-error - Supabase types issue
          .update(payload)
          .eq("id", currentPostId);
        if (error) throw error;
      } else {
        // @ts-expect-error - Supabase types issue
        const { error } = await supabase.from("research_posts").insert(payload);
        if (error) throw error;
      }

      router.push("/admin/research");
      router.refresh();
    } catch (err) {
      console.error("Error saving research post:", err);
      alert("Error saving research post. Check console for details.");
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
      <Link href="/admin/research">
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Research
        </Button>
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{currentPostId ? "Edit Research Post" : "Create Research Post"}</CardTitle>
            <CardDescription>
              {currentPostId ? "Update your research entry" : "Add a new research post"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL-friendly)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="my-research-post"
                required
              />
              <p className="text-xs text-muted-foreground">Used in URL: /research/{formData.slug}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Research title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="abstract">Abstract</Label>
              <Textarea
                id="abstract"
                value={formData.abstract}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                placeholder="Short abstract"
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
                placeholder="# Research details"
                rows={12}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="collaborators">Collaborators</Label>
              <Input
                id="collaborators"
                value={formData.collaborators}
                onChange={(e) =>
                  setFormData({ ...formData, collaborators: e.target.value })
                }
                placeholder="Names or institutions"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic_tags">Topic Tags (comma-separated)</Label>
              <Input
                id="topic_tags"
                value={formData.topic_tags.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    topic_tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="economics, education, wellbeing"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publication_status">Publication Status</Label>
              <Input
                id="publication_status"
                value={formData.publication_status}
                onChange={(e) =>
                  setFormData({ ...formData, publication_status: e.target.value })
                }
                placeholder="draft, submitted, published"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="related_links_text">Related Links JSON (optional)</Label>
              <Textarea
                id="related_links_text"
                value={formData.related_links_text}
                onChange={(e) =>
                  setFormData({ ...formData, related_links_text: e.target.value })
                }
                placeholder={'[{"label":"Paper","url":"https://example.com"}]'}
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
                placeholder="https://example.com/research-cover.jpg"
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
                placeholder="research, policy, case-study"
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
                  <span className="text-sm font-medium">Featured Research</span>
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
          <Link href="/admin/research">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Research Post"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
