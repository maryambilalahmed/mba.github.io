import { Link } from "react-router-dom";
import { ArrowRight, FileText, Briefcase, Heart, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { siteData } from "@/data/siteData";
import headshot from "@/assets/headshot.png";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-accent shadow-lg flex-shrink-0">
              <img
                src={headshot}
                alt={siteData.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                {siteData.name}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl">
                {siteData.tagline}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link to="/cv">
                    <FileText className="mr-2 h-5 w-5" />
                    View My CV
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/projects">
                    Explore Projects
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <p className="text-lg text-foreground max-w-3xl mx-auto text-center leading-relaxed">
            {siteData.intro}
          </p>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {siteData.achievements.map((achievement, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-4 py-2 text-sm font-medium flex items-center gap-2"
              >
                <Award className="h-4 w-4 text-accent" />
                {achievement}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Highlight Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-10">
            What I'm Working On
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {siteData.highlightCards.map((card, index) => {
              const icons = [Briefcase, Briefcase, Heart];
              const Icon = icons[index];
              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-shadow border-border hover:border-accent/50"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      {card.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      {card.description}
                    </p>
                    <Link
                      to={card.link}
                      className="text-sm font-medium text-secondary-dark hover:text-accent inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                    >
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
