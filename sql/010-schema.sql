-- ============================================================================
-- Phase 2: Supabase Database Schema
-- ============================================================================
-- Run this in Supabase SQL Editor to create the tables and indexes.
-- After tables exist, run 020-rls.sql
-- After RLS, run 030-triggers.sql

-- ============================================================================
-- 1. BLOG POSTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL,
  body text NOT NULL,
  cover_image_url text,
  tags text[] DEFAULT '{}',
  published_at timestamptz,
  status text CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  featured boolean DEFAULT false,
  seo_title text,
  seo_description text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_status_idx ON blog_posts(status);
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON blog_posts(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS blog_posts_featured_idx ON blog_posts(featured) WHERE featured = true;

-- ============================================================================
-- 2. PROJECTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  body text NOT NULL,
  role text,
  timeline text,
  tools text[] DEFAULT '{}',
  impact text[] DEFAULT '{}',
  links jsonb,
  gallery_images text[],
  cover_image_url text,
  tags text[] DEFAULT '{}',
  published_at timestamptz,
  status text CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  featured boolean DEFAULT false,
  seo_title text,
  seo_description text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS projects_slug_idx ON projects(slug);
CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status);
CREATE INDEX IF NOT EXISTS projects_published_at_idx ON projects(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS projects_featured_idx ON projects(featured) WHERE featured = true;

-- ============================================================================
-- 3. RESEARCH POSTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS research_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  abstract text NOT NULL,
  body text NOT NULL,
  collaborators text,
  topic_tags text[] DEFAULT '{}',
  publication_status text,
  related_links jsonb,
  cover_image_url text,
  tags text[] DEFAULT '{}',
  published_at timestamptz,
  status text CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  featured boolean DEFAULT false,
  seo_title text,
  seo_description text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS research_posts_slug_idx ON research_posts(slug);
CREATE INDEX IF NOT EXISTS research_posts_status_idx ON research_posts(status);
CREATE INDEX IF NOT EXISTS research_posts_published_at_idx ON research_posts(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS research_posts_featured_idx ON research_posts(featured) WHERE featured = true;

-- ============================================================================
-- 4. SELECTED LINKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS selected_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE,
  title text NOT NULL,
  url text NOT NULL,
  source text NOT NULL,
  excerpt text,
  tags text[] DEFAULT '{}',
  published_at timestamptz,
  featured boolean DEFAULT false,
  embed_code text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS selected_links_slug_idx ON selected_links(slug);
CREATE INDEX IF NOT EXISTS selected_links_published_at_idx ON selected_links(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS selected_links_featured_idx ON selected_links(featured) WHERE featured = true;

-- ============================================================================
-- 5. CONTACT SUBMISSIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text CHECK (status IN ('new', 'reviewed', 'archived')) DEFAULT 'new',
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS contact_submissions_status_idx ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS contact_submissions_email_idx ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx ON contact_submissions(created_at DESC);
