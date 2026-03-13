-- ============================================================================
-- Phase 2: Optional Supabase Storage Policies (V1 media uploads)
-- ============================================================================
-- Run this AFTER 010-schema.sql and 020-rls.sql if you want admin image uploads.
-- Bucket name defaults to: portfolio-media

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "portfolio_media_public_read" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_media_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_media_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_media_admin_delete" ON storage.objects;

CREATE POLICY "portfolio_media_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-media');

CREATE POLICY "portfolio_media_admin_insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');

CREATE POLICY "portfolio_media_admin_update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');

CREATE POLICY "portfolio_media_admin_delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');
