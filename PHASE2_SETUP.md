# Phase 2 Setup: Supabase CMS + Admin + Vercel

## A) Exact Supabase setup steps

1. Create a Supabase project.
2. In **Settings → API**, copy:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Create local env file:
   - Copy `.env.local.example` to `.env.local`
   - Fill all required values
4. In Supabase SQL Editor, run in this order:
   - `sql/010-schema.sql`
   - `sql/020-rls.sql`
   - `sql/030-triggers.sql`
   - Optional media uploads: `sql/040-storage.sql`
5. In **Authentication → Providers**, enable email/password auth.
6. In **Authentication → Users**, create your admin user.

## B) Architecture implemented in this repo

- Static/site profile content stays file-based (`content/settings`, `content/home`, `content/about`, resume/CV-related data).
- Editorial collections are Supabase-backed:
  - `blog_posts`
  - `projects`
  - `research_posts`
  - `selected_links`
- Contact submissions are stored in `contact_submissions` via server API route.
- Public routes preserved:
  - `/blog`, `/blog/[slug]`
  - `/projects`, `/projects/[slug]`
  - `/research`, `/research/[slug]`
  - `/links`
- Admin routes are middleware-protected:
  - `/admin`, `/admin/blog`, `/admin/projects`, `/admin/research`, `/admin/links`

## C) Exact migration/import steps

1. Ensure env vars are set locally (`.env.local`).
1. Run one-time import:

```bash
npm run supabase:import
```

1. Run verification:

```bash
npm run supabase:verify
```

1. Confirm table rows in Supabase UI for:
   - `blog_posts`, `projects`, `research_posts`, `selected_links`
1. Keep the `content/` source files as backup (do not delete).

## D) Public data source switch behavior

- This repo is already switched for editorial content: public pages now read Supabase.
- No mixed runtime source for editorial collections (no file+DB blend).
- Non-editorial/static pages remain file-based.
- Publish visibility rules:
  - public only sees `status = 'published'`
  - future publish dates are excluded
  - drafts remain admin-only

## E) Admin + content editing model

- Rich body fields use **Markdown text** in DB (`body` text).
- Rendering uses existing markdown rendering pipeline (`MarkdownContent`).
- Admin features implemented:
  - list/create/edit/delete for blog/projects/research/links
  - draft/publish status
  - slug editing with uniqueness enforcement
  - featured flag
  - publish date control
  - optional cover image upload to Supabase Storage (bucket: `portfolio-media`)

## F) Contact form production handling

- Public form posts to `POST /api/contact`.
- Server-side validation is enforced.
- Simple honeypot field added for bot resistance.
- API writes to `contact_submissions` with status `new`.

## G) Vercel setup checklist

1. Import repo in Vercel.
2. Add env vars for **Preview** and **Production**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` (optional, defaults to `portfolio-media`)
   - `NEXT_PUBLIC_SITE_URL` (optional but recommended)
3. Redeploy after env updates.
4. Verify middleware-protected admin routes in deployed environment.
5. If using external image hosts, update `next.config.ts` `images.remotePatterns`.

## H) Post-deploy verification

Run these checks in production:

- Public routes render content from Supabase:
  - `/blog`, `/projects`, `/research`, `/links`
- Detail pages by slug work and preserve route contracts.
- Draft/future-dated content does not appear publicly.
- `/admin/login` works and protected admin routes redirect correctly.
- CRUD works in admin for all editorial collections.
- Contact form creates rows in `contact_submissions`.

## I) Manual tasks remaining

- Create and securely store real admin credentials in Supabase Auth.
- Execute SQL scripts in your Supabase project.
- Run import + verify commands against your Supabase project.
- Configure Vercel env vars for preview/production.
- Optionally configure custom image domains in `next.config.ts`.

## J) Recommended V1.1 improvements

- Add admin view for `contact_submissions` (status triage UI).
- Add server-side rate limiting (Upstash/edge-compatible) for contact endpoint.
- Add markdown preview pane in admin forms.
- Add role-based admin claim checks (custom JWT claim) in RLS.
- Add editorial revision history/versioning.
