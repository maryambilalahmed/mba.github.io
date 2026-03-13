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
import { Label } from "@/components/ui/label";
import { Loader, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface LinkFormProps {
  postId?: string;
  params?: { id: string };
}

export default function LinkFormPage({ postId, params }: LinkFormProps) {
  const currentPostId = postId ?? params?.id;
  const [loading, setLoading] = useState(!!currentPostId);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    url: "",
    source: "",
    excerpt: "",
    tags: [] as string[],
    featured: false,
    embed_code: "",
    published_at: "",
  });

  function normalizeSlug(raw: string) {
    return raw
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  async function loadLink() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("selected_links")
        .select("*")
        .eq("id", currentPostId!)
        .single();

      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const link = data as any;
      if (link) {
        setFormData({
          slug: link.slug || "",
          title: link.title,
          url: link.url,
          source: link.source,
          excerpt: link.excerpt,
          tags: link.tags || [],
          featured: link.featured || false,
          embed_code: link.embed_code || "",
          published_at: link.published_at
            ? new Date(link.published_at).toISOString().slice(0, 16)
            : "",
        });
      }
    } catch (err) {
      console.error("Error loading selected link:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currentPostId) {
      void loadLink();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPostId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    try {
      const supabase = createClient();

      const payload = {
        slug: formData.slug ? normalizeSlug(formData.slug) : null,
        title: formData.title,
        url: formData.url,
        source: formData.source,
        excerpt: formData.excerpt,
        tags: formData.tags,
        featured: formData.featured,
        embed_code: formData.embed_code || null,
        published_at: formData.published_at
          ? new Date(formData.published_at).toISOString()
          : new Date().toISOString(),
      };

      if (currentPostId) {
        const { error } = await supabase
          .from("selected_links")
          .update(payload)
          .eq("id", currentPostId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("selected_links").insert(payload);
        if (error) throw error;
      }

      router.push("/admin/links");
      router.refresh();
    } catch (err) {
      console.error("Error saving selected link:", err);
      const message =
        typeof err === "object" && err && "code" in err && err.code === "23505"
          ? "Slug already exists. Please choose a unique slug."
          : "Could not save selected link. Please review fields and try again.";
      setFormError(message);
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
      <Link href="/admin/links">
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Links
        </Button>
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6">
        {formError ? (
          <p className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
            {formError}
          </p>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>{currentPostId ? "Edit Link" : "Create Link"}</CardTitle>
            <CardDescription>
              {currentPostId ? "Update this selected link" : "Add a new selected link"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (optional)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: normalizeSlug(e.target.value) })}
                placeholder="optional-link-slug"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Link title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="LinkedIn, Medium, Journal"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Short description"
                rows={3}
                required
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
                placeholder="reading, economics, writing"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="embed_code">Embed Code (optional)</Label>
              <Textarea
                id="embed_code"
                value={formData.embed_code}
                onChange={(e) =>
                  setFormData({ ...formData, embed_code: e.target.value })
                }
                placeholder="<iframe ...></iframe>"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="published_at">Publish Date</Label>
              <Input
                id="published_at"
                type="datetime-local"
                value={formData.published_at}
                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <span className="text-sm font-medium">Featured Link</span>
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/admin/links">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Link"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
