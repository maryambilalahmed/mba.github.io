import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { getSiteSettings } from "@/lib/content";

const bodyFont = Inter({ subsets: ["latin"], variable: "--font-body" });
const headingFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();

  return {
    title: {
      default: site.metaTitle,
      template: `%s | ${site.name}`,
    },
    description: site.metaDescription,
    metadataBase: new URL("https://maryambilalahmed.github.io"),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: site.metaTitle,
      description: site.metaDescription,
      type: "website",
      url: "/",
      siteName: site.name,
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${headingFont.variable}`}>
        <div className="min-h-screen bg-background text-foreground">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
