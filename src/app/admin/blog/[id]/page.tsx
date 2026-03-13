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
import { uploadAdminImage } from "@/lib/supabase/storage";

interface BlogFormProps {
  postId?: string;
  params?: { id: string };
}

export default function BlogFormPage({ postId, params }: BlogFormProps) {
  const currentPostId = postId ?? params?.id;
  const [loading, setLoading] = useState(!!currentPostId);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    excerpt: "",
    body: "",
    cover_image_url: "",
    tags: [] as string[],
    status: "draft" as "draft" | "published",
    featured: false,
    published_at: "",
    seo_title: "",
    seo_description: "",
  });

  function normalizeSlug(raw: string) {
    return raw
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  async function loadPost() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("blog_posts")
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
          excerpt: post.excerpt,
          body: post.body,
          cover_image_url: post.cover_image_url || "",
          tags: post.tags || [],
          status: post.status,
          featured: post.featured || false,
          published_at: post.published_at
            ? new Date(post.published_at).toISOString().slice(0, 16)
            : "",
          seo_title: post.seo_title || "",
          seo_description: post.seo_description || "",
        });
      }
    } catch (err) {
      console.error("Error loading post:", err);
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
    setFormError("");

    try {
      const supabase = createClient();

      const payload = {
        slug: normalizeSlug(formData.slug),
        title: formData.title,
        excerpt: formData.excerpt,
        body: formData.body,
        cover_image_url: formData.cover_image_url || null,
        tags: formData.tags,
        status: formData.status,
        featured: formData.featured,
        seo_title: formData.seo_title || null,
        seo_description: formData.seo_description || null,
        published_at:
          formData.status === "published"
            ? formData.published_at
              ? new Date(formData.published_at).toISOString()
              : new Date().toISOString()
            : null,
      };

      if (currentPostId) {
        // Update
        const { error } = await supabase
          .from("blog_posts")
          .update(payload)
          .eq("id", currentPostId);
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      console.error("Error saving post:", err);
      const message =
        typeof err === "object" && err && "code" in err && err.code === "23505"
          ? "Slug already exists. Please choose a unique slug."
          : "Could not save post. Please review fields and try again.";
      setFormError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleUploadCoverImage(file: File) {
    setUploadingImage(true);
    setFormError("");
    try {
      const publicUrl = await uploadAdminImage(file, "blog");
      setFormData((prev) => ({ ...prev, cover_image_url: publicUrl }));
    } catch (err) {
      console.error("Error uploading image:", err);
      setFormError("Image upload failed. Ensure storage bucket and policies are configured.");
    } finally {
      setUploadingImage(false);
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
      <Link href="/admin/blog">
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
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
            <CardTitle>{currentPostId ? "Edit Blog Post" : "Create Blog Post"}</CardTitle>
            <CardDescription>
              {currentPostId
                ? "Update your blog post"
                : "Write a new blog post"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL-friendly)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: normalizeSlug(e.target.value) })
                }
                placeholder="my-blog-post"
                required
              />
              <p className="text-xs text-muted-foreground">
                Used in URL: /blog/{formData.slug}
              </p>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Your blog post title"
                required
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="Brief summary (shown in listings)"
                rows={2}
                required
              />
            </div>

            {/* Body */}
            <div className="space-y-2">
              <Label htmlFor="body">Content (Markdown)</Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) =>
                  setFormData({ ...formData, body: e.target.value })
                }
                placeholder="# Your Content Here

Write your blog post in Markdown format..."
                rows={12}
                required
              />
              <p className="text-xs text-muted-foreground">
                Markdown formatting supported
              </p>
            </div>

            {/* Cover Image URL */}
            <div className="space-y-2">
              <Label htmlFor="cover_image_url">Cover Image URL</Label>
              <Input
                id="cover_image_url"
                value={formData.cover_image_url}
                onChange={(e) =>
                  setFormData({ ...formData, cover_image_url: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
              <Input
                type="file"
                accept="image/*"
                disabled={uploadingImage}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void handleUploadCoverImage(file);
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                {uploadingImage ? "Uploading image..." : "Optional: upload directly to Supabase Storage."}
              </p>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value.split(",").map((t) => t.trim()),
                  })
                }
                placeholder="economics, fieldwork, student-life"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value as "draft" | "published",
                    })
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

              <div className="space-y-2">
                <Label htmlFor="published_at">Publish Date</Label>
                <Input
                  id="published_at"
                  type="datetime-local"
                  value={formData.published_at}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      published_at: e.target.value,
                    })
                  }
                />
              </div>

              {/* Featured */}
              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        featured: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm font-medium">Featured Post</span>
                </label>
              </div>
            </div>

            {/* SEO */}
            <div className="space-y-2 rounded-lg bg-muted/50 p-4">
              <Label htmlFor="seo_title">SEO Title (optional)</Label>
              <Input
                id="seo_title"
                value={formData.seo_title}
                onChange={(e) =>
                  setFormData({ ...formData, seo_title: e.target.value })
                }
                placeholder="Custom page title for search engines"
              />

              <Label htmlFor="seo_description" className="mt-3">
                SEO Description (optional)
              </Label>
              <Textarea
                id="seo_description"
                value={formData.seo_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    seo_description: e.target.value,
                  })
                }
                placeholder="Custom meta description for search engines"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Link href="/admin/blog">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Post"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
