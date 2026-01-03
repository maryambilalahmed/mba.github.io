import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-[12rem] md:text-[16rem] font-bold text-primary/10 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-border">
              <Search className="h-16 w-16 text-accent mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                Page Not Found
              </h2>
              <p className="text-muted-foreground">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
          </div>
        </div>

        {/* Helpful message */}
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Don't worry! You can explore my portfolio, check out my research, or head back to the homepage.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="group">
            <Link to="/">
              <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="group">
            <Link to="/research">
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              Explore Research
            </Link>
          </Button>
        </div>

        {/* Quick links */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Or try one of these pages:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "CV", href: "/cv" },
              { label: "Projects", href: "/projects" },
              { label: "Blog", href: "/blog" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary rounded-full transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
