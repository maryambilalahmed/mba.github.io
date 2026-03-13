"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Blog", href: "/admin/blog" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Research", href: "/admin/research" },
  { label: "Links", href: "/admin/links" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) {
        router.push("/admin/login");
      } else {
        setUser({ email: data.user.email || "" });
      }
      setLoading(false);
    });
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <div className="hidden w-64 border-r bg-muted/40 md:flex md:flex-col">
        <div className="border-b p-4">
          <Link href="/" className="text-lg font-semibold hover:underline">
            MB Portfolio
          </Link>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t p-4">
          <p className="text-xs text-muted-foreground">Logged in as:</p>
          <p className="truncate text-sm font-medium">{user.email}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Header */}
        <div className="border-b bg-white md:hidden">
          <div className="flex items-center justify-between p-4">
            <Link href="/" className="text-lg font-semibold">
              MB Portfolio
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <nav className="space-y-2 pt-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
