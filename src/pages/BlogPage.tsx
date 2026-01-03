import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { blogPosts } from "@/data/siteData";

const BlogPage = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Reflections on economics, research journeys, and lessons learned
            along the way.
          </p>
        </div>

        {/* Blog Posts */}
        <div className="space-y-6 max-w-3xl mx-auto">
          {blogPosts.map((post) => (
            <Card
              key={post.id}
              className="group hover:shadow-lg transition-all border-border hover:border-accent/50 cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.date)}
                </div>
                <CardTitle className="text-xl text-primary group-hover:text-accent transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default BlogPage;
