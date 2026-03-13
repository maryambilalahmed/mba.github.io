import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/site/SectionHeader";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume and CV download for Maryam Bilal Ahmed.",
};

export default function ResumePage() {
  return (
    <div className="editorial-shell editorial-section">
      <SectionHeader
        kicker="Resume"
        title="Curriculum Vitae"
        description="A downloadable PDF version of Maryam Bilal Ahmed's CV."
      />

      <div className="rounded-lg border bg-card p-8">
        <p className="text-muted-foreground">
          For admissions reviewers and collaborators, the most current CV is available as a PDF.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/Maryam-Bilal-Ahmed-CV.pdf" target="_blank">
              <Download className="mr-2 h-4 w-4" /> Download CV
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
