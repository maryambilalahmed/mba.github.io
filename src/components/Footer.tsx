import { Link } from "react-router-dom";
import { Mail, Linkedin, ArrowUp } from "lucide-react";
import { siteData } from "@/data/siteData";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-primary text-primary-foreground py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm opacity-90">
              © {new Date().getFullYear()} {siteData.name}. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`mailto:${siteData.email}`}
              className="hover:opacity-80 transition-opacity"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href={siteData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <button
              onClick={scrollToTop}
              className="hover:opacity-80 transition-opacity flex items-center gap-1 text-sm"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4" />
              <span className="hidden sm:inline">Back to top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
