import { Mail, Linkedin, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { siteData } from "@/data/siteData";

const ContactPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interested in connecting? I'd love to hear from you about research
            collaborations, projects, or just to say hello.
          </p>
        </div>

        {/* Contact Card */}
        <Card className="max-w-lg mx-auto">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Location */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground">
                    {siteData.location}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${siteData.email}`}
                    className="font-medium text-foreground hover:text-accent transition-colors"
                  >
                    {siteData.email}
                  </a>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Linkedin className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">LinkedIn</p>
                  <a
                    href={siteData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:text-accent transition-colors"
                  >
                    Connect with me
                  </a>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <a href={`mailto:${siteData.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </a>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <a
                  href={siteData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ContactPage;
