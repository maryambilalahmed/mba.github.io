-- ============================================================================
-- Phase 2: Triggers for Auto-Updated Timestamps
-- ============================================================================
-- Run this AFTER 020-rls.sql
-- Automatically updates `updated_at` on row changes

-- Create reusable trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Blog Posts Trigger
-- ============================================================================
DROP TRIGGER IF EXISTS blog_posts_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Projects Trigger
-- ============================================================================
DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Research Posts Trigger
-- ============================================================================
DROP TRIGGER IF EXISTS research_posts_updated_at ON research_posts;
CREATE TRIGGER research_posts_updated_at
  BEFORE UPDATE ON research_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Selected Links Trigger
-- ============================================================================
DROP TRIGGER IF EXISTS selected_links_updated_at ON selected_links;
CREATE TRIGGER selected_links_updated_at
  BEFORE UPDATE ON selected_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
