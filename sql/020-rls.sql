-- ============================================================================
-- Phase 2: Row Level Security (RLS) Policies
-- ============================================================================
-- Run this AFTER 010-schema.sql
-- Enforces:
--  - Public reads published content
--  - Admin only writes
--  - Contact submissions not publicly readable

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE selected_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- BLOG POSTS POLICIES
-- ============================================================================

-- Allow public read of published posts
CREATE POLICY "blog_posts_public_read"
  ON blog_posts FOR SELECT
  USING (status = 'published');

-- Allow authenticated admins full access
CREATE POLICY "blog_posts_admin_all"
  ON blog_posts FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- PROJECTS POLICIES
-- ============================================================================

-- Allow public read of published projects
CREATE POLICY "projects_public_read"
  ON projects FOR SELECT
  USING (status = 'published');

-- Allow authenticated admins full access
CREATE POLICY "projects_admin_all"
  ON projects FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- RESEARCH POSTS POLICIES
-- ============================================================================

-- Allow public read of published posts
CREATE POLICY "research_posts_public_read"
  ON research_posts FOR SELECT
  USING (status = 'published');

-- Allow authenticated admins full access
CREATE POLICY "research_posts_admin_all"
  ON research_posts FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- SELECTED LINKS POLICIES
-- ============================================================================

-- Allow public read of all links (no draft concept)
CREATE POLICY "selected_links_public_read"
  ON selected_links FOR SELECT
  USING (true);

-- Allow authenticated admins write access
CREATE POLICY "selected_links_admin_all"
  ON selected_links FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- CONTACT SUBMISSIONS POLICIES
-- ============================================================================

-- Allow public insert (form submission)
CREATE POLICY "contact_submissions_public_insert"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

-- Allow authenticated admins read/update/delete
CREATE POLICY "contact_submissions_admin_all"
  ON contact_submissions FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- NOTE: ADMIN ROLE SETUP
-- ============================================================================
-- The RLS policies above check auth.role() = 'authenticated'
-- This means any logged-in user has admin access.
--
-- For production, consider:
--  1. Create a custom claim (e.g., "is_admin") in Supabase Auth
--  2. Check custom claims in RLS: (auth.jwt() ->> 'is_admin')::boolean
--  3. Set custom claim only for admin users
--
-- For now, Phase 2 uses simple authenticated-only access.
-- Can be refined in Phase 2.1 if needed.
