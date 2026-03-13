# Phase 2: Supabase Integration & Admin System - Setup Guide

## Overview

This document covers the complete Phase 2 setup for integrating Supabase, implementing the admin system, and deploying to production.

**Phase 2 adds:**
- Supabase authentication
- Supabase PostgreSQL database
- Editorial content management (blog, projects, research, links)
- Contact form submissions
- Protected admin panel at `/admin`
- Production-ready deployment pipeline

## Part A: Supabase Project Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click "New Project"
3. Choose a project name: `mba-portfolio` (or similar)
4. Select your region (choose closest to you or your users)
5. Create a strong password (save it securely)
6. Wait for project to initialize (~2-3 minutes)

### 2. Get Your API Keys

Once your project is initialized:

1. Go to **Settings > API**
2. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key** (public) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Key** (secret!) → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **IMPORTANT:** 
- Never expose the Service Role Key in client-side code
- Never commit keys to git
- Treat Service Role Key like a database password

### 3. Set Up Local Environment

Create `.env.local` in your project root:

```bash
# From Supabase dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ `.env.local` is in `.gitignore` - never commit it!

## Part B: Database Setup

### 1. Create Tables

In Supabase, go to **SQL Editor** and run the scripts in order:

**Step 1:** Copy & paste content from `sql/010-schema.sql`, execute
**Step 2:** Copy & paste content from `sql/020-rls.sql`, execute
**Step 3:** Copy & paste content from `sql/030-triggers.sql`, execute

Alternatively, you can copy the entire SQL from each file directly into the SQL editor.

⚠️ **Important:** Run in order. Each script depends on previous ones.

### 2. Verify Tables Created

In Supabase **Table Editor**, you should see:
- `blog_posts`
- `projects`
- `research_posts`
- `selected_links`
- `contact_submissions`

### 3. Create Storage Bucket (Optional)

For image uploads later:

1. Go to **Storage > Buckets**
2. Click "New Bucket"
3. Name: `portfolio-media`
4. Make it **Public** (for public image access)
5. Click "Create Bucket"

You can add upload functionality later in Phase 2.1.

## Part C: Admin User Setup

Supabase Auth handles user management. Create your admin account:

### 1. Add Authentication Provider

1. Go to **Authentication > Providers**
2. Enable **Email** (if not already enabled)
3. Save

### 2. Create Admin User

Option A - Via Supabase Dashboard:
1. Go to **Authentication > Users**
2. Click "Invite User"
3. Enter your email
4. Check your inbox, click the invite link
5. Set your password

Option B - Programmatically (after site is live):
1. Test admin panel at `/admin/login`
2. Sign up creates a new user automatically

### 3. Test Admin Access

Once user is created:
1. Go to `http://localhost:3000/admin/login`
2. Enter your email and password
3. Should redirect to `/admin/dashboard`

## Part D: Content Migration

### 1. Prepare Migration Script

The migration script is ready at `scripts/migrate-content-to-supabase.ts`.

It will:
- Read existing file-based content from `/content`
- Transform to Supabase format
- Upsert into respective tables
- Verify counts

### 2. Run Migration

```bash
# Install dependencies (already done)
npm install

# Run migration
npx tsx scripts/migrate-content-to-supabase.ts
```

**Output should show:**
```
📝 Migrating blog posts...
✓ Imported blog post: robotics-future
✓ Imported blog post: hunza-interviews
✓ Imported blog post: happiness-economics-journey
✅ Blog posts: 3 total

🎨 Migrating projects...
✓ Imported project: entrepreneurship-club
...
```

### 3. Verify in Supabase

1. Go to Supabase **Table Editor**
2. Click on each table and verify data is there
3. Spot-check a few posts to ensure content is correct

### 4. Keep File-Based Content

Do NOT delete `/content` folder yet. Keep it as backup until Phase 2 is fully verified in production.

## Part E: Local Development Testing

### 1. Start Dev Server

```bash
npm run dev
```

Open http://localhost:3000

### 2. Test Public Pages

Navigate and verify these still work:
- `/blog` - should show blog posts from Supabase
- `/blog/[slug]` - individual posts
- `/projects` - should show projects
- `/research` - should show research posts
- `/links` - should show selected links
- `/contact` - contact form should appear

### 3. Test Admin Panel

- Navigate to `/admin/login`
- Sign in with your email/password
- Should see `/admin/dashboard`
- Test `/admin/blog` - should list all blog posts
- Try creating a new blog post
- Try editing an existing post
- Try deleting a post (verify it's gone)

### 4. Test Contact Form

- Go to `/contact`
- Fill and submit contact form
- Check Supabase: `contact_submissions` table should have new row
- Status should be `'new'`

### 5. Run Build & Type Checks

```bash
npm run typecheck
npm run lint
npm run build
```

All should pass without errors.

## Part F: Vercel Deployment Setup

### 1. Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 2. Connect Repository to Vercel

If not already done:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." > "Project"
3. Select your GitHub repository
4. Click "Import"

### 3. Set Environment Variables

In Vercel dashboard for your project:

1. Go to **Settings > Environment Variables**
2. Add these variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: (your URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (your anon key)
   - `SUPABASE_SERVICE_ROLE_KEY`: (your service role key)

⚠️ Make sure to set environment for:
- Production
- Preview (if using preview deployments)

### 4. Deploy to Vercel

Push to main branch:
```bash
git add .
git commit -m "Phase 2: Supabase integration and admin system"
git push origin main
```

Vercel should automatically deploy. Monitor at https://vercel.com/dashboard

### 5. Test Production

Once deployed:
- Visit your deployed URL
- Test public pages
- Navigate to `/admin/login`
- Sign in and test admin functions

## Part G: PostDeploy Verification

### 1. Public Site Health

- [ ] Blog page loads
- [ ] Blog posts display correctly
- [ ] Individual post pages work
- [ ] Projects page works
- [ ] Research page works
- [ ] Links page works
- [ ] Contact form submits successfully

### 2. Admin Systems

- [ ] Admin login works
- [ ] Can create a new blog post
- [ ] Can edit existing blog post
- [ ] Can delete blog post
- [ ] Can toggle published/draft status
- [ ] Can set featured flag

### 3. Data Integrity

- [ ] All migrated content appears
- [ ] Dates are correct
- [ ] Tags render properly
- [ ] Featured posts show correctly
- [ ] Contact submissions appear in DB

## Part H: Production Checklist

Before going fully live:

- [ ] Database backups enabled in Supabase
- [ ] Environment variables secured in Vercel
- [ ] SSL certificate active (automatic with Vercel)
- [ ] All public routes working
- [ ] Admin login protected
- [ ] Contact form functional
- [ ] Analytics/monitoring set up if desired
- [ ] Domain DNS configured (if using custom domain)
- [ ] SEO metadata on all pages

## Part I: Maintenance & Troubleshooting

### Common Issues

**Admin login not working:**
- Verify user exists in Supabase > Authentication > Users
- Check NEXT_PUBLIC_SUPABASE_URL and keys are correct
- Clear browser cookies and try again

**Contact form not submitting:**
- Check browser console for errors
- Verify `contact_submissions` RLS policy allows inserts
- Check Supabase is connected (test in browser DevTools)

**Public pages showing no content:**
- Check Supabase connection (NEXT_PUBLIC_SUPABASE_URL)
- Verify content is in tables (Table Editor)
- Check RLS policies allow public reads
- Look for errors in server logs (Vercel)

### Useful Links

- **Supabase Dashboard:** https://supabase.com/dashboard
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Your Site:** https://your-domain.com
- **Admin Panel:** https://your-domain.com/admin

### Regular Tasks

- Monitor contact submissions (check `contact_submissions` table)
- Review auth logs (Supabase > Authentication > Logs)
- Update content through admin panel or Supabase dashboard
- Track any errors (Vercel > Deployments > Logs)

## Next Steps (Phase 2.1)

After Phase 2 is stable in production:

- [ ] Image upload to Supabase Storage
- [ ] Markdown preview in admin forms
- [ ] Batch edit/delete for admin
- [ ] Search across content
- [ ] Admin user roles (multi-admin support)
- [ ] Content publishing schedule
- [ ] Analytics dashboard
- [ ] API endpoints for integrations

## Support

For issues:
1. Check [Supabase docs](https://supabase.com/docs)
2. Check [Next.js docs](https://nextjs.org/docs)
3. Review error logs in Vercel
4. Test locally with `npm run dev`

---

**Phase 2 Status: ✅ Complete**

Deployed date: March 13, 2026
Next review: After 2 weeks of production monitoring
