import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Briefcase,
  Microscope,
  Link as LinkIcon,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboard() {
  const sections = [
    {
      title: "Blog Posts",
      description: "Manage your blog articles",
      icon: FileText,
      href: "/admin/blog",
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Projects",
      description: "Showcase your work and achievements",
      icon: Briefcase,
      href: "/admin/projects",
      color: "bg-green-50 text-green-700",
    },
    {
      title: "Research",
      description: "Share research papers and findings",
      icon: Microscope,
      href: "/admin/research",
      color: "bg-purple-50 text-purple-700",
    },
    {
      title: "Selected Links",
      description: "Curate external links and posts",
      icon: LinkIcon,
      href: "/admin/links",
      color: "bg-orange-50 text-orange-700",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your portfolio content
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.href}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{section.title}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                  <div className={`rounded-lg p-2 ${section.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={section.href}>
                  <Button variant="outline" className="w-full">
                    Manage <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Supabase Dashboard:</strong> Manage database directly at{" "}
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              supabase.com
            </a>
          </p>
          <p>
            <strong>Contact Submissions:</strong> Check contact form responses
            in Supabase &gt; contact_submissions table
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
