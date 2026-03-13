"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader, Plus, Edit2, Trash2 } from "lucide-react";
import type { Database } from "@/types/supabase";

type ResearchPost = Database["public"]["Tables"]["research_posts"]["Row"];

export default function ResearchAdminPage() {
  const [posts, setPosts] = useState<ResearchPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    void loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("research_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error("Error loading research posts:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("research_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setPosts(posts.filter((post) => post.id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting research post:", err);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Research Posts</h1>
          <p className="text-muted-foreground">
            {posts.length} post{posts.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link href="/admin/research/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Research Post
          </Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No research posts yet</p>
          <Link href="/admin/research/new">
            <Button className="mt-4" variant="outline">
              Create your first research post
            </Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Publication</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {post.slug}
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.status === "published" ? "default" : "secondary"}>
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{post.publication_status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/research/${post.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(post.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Research Post?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The post will be permanently deleted.
          </AlertDialogDescription>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
