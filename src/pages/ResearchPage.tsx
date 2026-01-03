import { BookOpen, FileText, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { research } from "@/data/siteData";

const ResearchPage = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case "Primary Research":
        return BookOpen;
      case "Essay":
        return FileText;
      default:
        return Lightbulb;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-accent/20 text-accent-foreground border-accent";
      case "Submitted":
        return "bg-secondary-dark/20 text-secondary-foreground border-secondary-dark";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Research</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Exploring economics, behaviour, and social systems through primary
            research and academic writing.
          </p>
        </div>

        {/* Research Cards */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {research.map((item) => {
            const Icon = getIcon(item.type);
            return (
              <Card
                key={item.id}
                className="hover:shadow-lg transition-shadow border-border hover:border-accent/50"
              >
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-primary">
                          {item.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {item.type}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={getStatusColor(item.status)}
                    >
                      {item.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-3 leading-relaxed">
                    {item.summary}
                  </p>
                  {"interviews" in item && (
                    <p className="text-sm text-secondary-dark font-medium">
                      📍 {item.interviews}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default ResearchPage;
