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

type SelectedLink = Database["public"]["Tables"]["selected_links"]["Row"];

export default function LinksAdminPage() {
  const [links, setLinks] = useState<SelectedLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    void loadLinks();
  }, []);

  async function loadLinks() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("selected_links")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) throw error;
      setLinks(data || []);
    } catch (err) {
      console.error("Error loading links:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("selected_links")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setLinks(links.filter((link) => link.id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting link:", err);
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
          <h1 className="text-2xl font-bold">Selected Links</h1>
          <p className="text-muted-foreground">
            {links.length} link{links.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link href="/admin/links/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Link
          </Button>
        </Link>
      </div>

      {links.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No selected links yet</p>
          <Link href="/admin/links/new">
            <Button className="mt-4" variant="outline">
              Create your first link
            </Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="font-medium">{link.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {link.source}
                  </TableCell>
                  <TableCell>
                    {link.featured && <Badge variant="outline">Featured</Badge>}
                  </TableCell>
                  <TableCell className="text-sm">
                    {link.published_at
                      ? new Date(link.published_at).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/links/${link.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(link.id)}
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
          <AlertDialogTitle>Delete Link?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The selected link will be permanently deleted.
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
