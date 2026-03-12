import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/site/SectionHeader";
import { MarkdownContent } from "@/components/site/MarkdownContent";
import {
  getAboutProfile,
  getEducation,
  getExperiences,
  getHonors,
  getSiteSettings,
} from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return {
    title: "About",
    description: `About ${site.name}: academic profile, leadership, and trajectory.`,
  };
}

export default async function AboutPage() {
  const [profile, education, honors, experiences] = await Promise.all([
    getAboutProfile(),
    getEducation(),
    getHonors(),
    getExperiences(),
  ]);

  return (
    <div className="editorial-shell editorial-section">
      <SectionHeader
        kicker="About"
        title="Academic profile and trajectory"
        description="A concise record of studies, leadership responsibilities, and long-term interests."
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6 md:p-8">
              <MarkdownContent content={profile} />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {education.map((item) => (
                <div key={`${item.institution}-${item.period}`}>
                  <p className="font-medium text-foreground">{item.institution}</p>
                  <p className="text-muted-foreground">{item.degree}</p>
                  <p className="text-muted-foreground">{item.period}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Honors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {honors.map((item) => (
                <p key={item.title} className="text-muted-foreground">
                  <span className="font-medium text-foreground">{item.title}</span>
                  {item.year ? ` · ${item.year}` : ""}
                </p>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <section className="mt-12">
        <SectionHeader kicker="Leadership" title="Experience and initiative" />
        <div className="grid gap-4 md:grid-cols-2">
          {experiences.map((item) => (
            <Card key={`${item.role}-${item.organization}`}>
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold text-primary">{item.role}</h3>
                <p className="text-sm text-secondary-dark">{item.organization}</p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.period}</p>
                <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
