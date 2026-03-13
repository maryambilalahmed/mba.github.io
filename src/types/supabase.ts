/**
 * Supabase TypeScript types.
 * Generated from database schema.
 * For production: `npx supabase gen types typescript > src/types/supabase.ts`
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          body: string;
          cover_image_url: string | null;
          tags: string[];
          published_at: string | null;
          status: "draft" | "published";
          featured: boolean;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt: string;
          body: string;
          cover_image_url?: string | null;
          tags?: string[];
          published_at?: string | null;
          status?: "draft" | "published";
          featured?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string;
          body?: string;
          cover_image_url?: string | null;
          tags?: string[];
          published_at?: string | null;
          status?: "draft" | "published";
          featured?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string;
          body: string;
          role: string | null;
          timeline: string | null;
          tools: string[];
          impact: string[];
          links: Json | null;
          gallery_images: string[] | null;
          cover_image_url: string | null;
          tags: string[];
          published_at: string | null;
          status: "draft" | "published";
          featured: boolean;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          summary: string;
          body: string;
          role?: string | null;
          timeline?: string | null;
          tools?: string[];
          impact?: string[];
          links?: Json | null;
          gallery_images?: string[] | null;
          cover_image_url?: string | null;
          tags?: string[];
          published_at?: string | null;
          status?: "draft" | "published";
          featured?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          summary?: string;
          body?: string;
          role?: string | null;
          timeline?: string | null;
          tools?: string[];
          impact?: string[];
          links?: Json | null;
          gallery_images?: string[] | null;
          cover_image_url?: string | null;
          tags?: string[];
          published_at?: string | null;
          status?: "draft" | "published";
          featured?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      research_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          abstract: string;
          body: string;
          collaborators: string | null;
          topic_tags: string[];
          publication_status: string | null;
          related_links: Json | null;
          cover_image_url: string | null;
          tags: string[];
          published_at: string | null;
          status: "draft" | "published";
          featured: boolean;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          abstract: string;
          body: string;
          collaborators?: string | null;
          topic_tags?: string[];
          publication_status?: string | null;
          related_links?: Json | null;
          cover_image_url?: string | null;
          tags?: string[];
          published_at?: string | null;
          status?: "draft" | "published";
          featured?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          abstract?: string;
          body?: string;
          collaborators?: string | null;
          topic_tags?: string[];
          publication_status?: string | null;
          related_links?: Json | null;
          cover_image_url?: string | null;
          tags?: string[];
          published_at?: string | null;
          status?: "draft" | "published";
          featured?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      selected_links: {
        Row: {
          id: string;
          slug: string | null;
          title: string;
          url: string;
          source: string;
          excerpt: string | null;
          tags: string[];
          published_at: string | null;
          featured: boolean;
          embed_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug?: string | null;
          title: string;
          url: string;
          source: string;
          excerpt?: string | null;
          tags?: string[];
          published_at?: string | null;
          featured?: boolean;
          embed_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string | null;
          title?: string;
          url?: string;
          source?: string;
          excerpt?: string | null;
          tags?: string[];
          published_at?: string | null;
          featured?: boolean;
          embed_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status: "new" | "reviewed" | "archived";
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status?: "new" | "reviewed" | "archived";
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          status?: "new" | "reviewed" | "archived";
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
