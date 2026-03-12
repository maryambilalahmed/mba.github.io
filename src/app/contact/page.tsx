import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Linkedin, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/site/SectionHeader";
import { getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Maryam Bilal Ahmed for research and project collaboration.",
};

export default async function ContactPage() {
  const site = await getSiteSettings();

  return (
    <div className="editorial-shell editorial-section">
      <SectionHeader
        kicker="Contact"
        title="Let us connect"
        description="Open to thoughtful discussions on economics, writing, and meaningful student-led collaborations."
      />

      <Card className="mx-auto max-w-2xl">
        <CardContent className="space-y-6 p-8">
          <div className="flex items-center gap-4">
            <MapPin className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{site.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Mail className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <Link href={`mailto:${site.email}`} className="font-medium text-secondary-dark">
                {site.email}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Linkedin className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">LinkedIn</p>
              <Link href={site.linkedin} target="_blank" rel="noopener noreferrer" className="font-medium text-secondary-dark">
                View profile
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild>
              <Link href={`mailto:${site.email}`}>Send email</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={site.linkedin} target="_blank" rel="noopener noreferrer">
                Open LinkedIn
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
