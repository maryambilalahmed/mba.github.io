import { Download, GraduationCap, Award, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { siteData, education, honors, experiences } from "@/data/siteData";

const CVPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Curriculum Vitae
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            {siteData.name} — {siteData.location}
          </p>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <a href="/Maryam-Bilal-Ahmed-CV.pdf" download>
              <Download className="mr-2 h-5 w-5" />
              Download CV (PDF)
            </a>
          </Button>
        </div>

        {/* About Me */}
        <section className="mb-12 max-w-3xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <p className="text-foreground leading-relaxed">
                {siteData.intro}
              </p>
            </CardContent>
          </Card>
        </section>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <GraduationCap className="h-5 w-5 text-accent" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="border-l-2 border-accent pl-4">
                  <h3 className="font-semibold text-foreground">
                    {edu.institution}
                  </h3>
                  <p className="text-sm text-secondary-dark font-medium">
                    {edu.degree} • {edu.period}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {edu.details}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Honors & Awards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Award className="h-5 w-5 text-accent" />
                Honors & Awards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {honors.map((honor, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    {honor}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Experience */}
        <section className="mt-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Briefcase className="h-5 w-5 text-accent" />
                Experience & Leadership
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {experiences.map((exp, index) => (
                  <div key={index} className="border-l-2 border-secondary pl-4">
                    <h3 className="font-semibold text-foreground">{exp.role}</h3>
                    <p className="text-sm text-secondary-dark font-medium">
                      {exp.organization} • {exp.period}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
};

export default CVPage;
