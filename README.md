# Registration Site — Next.js + Vercel

A complete registration site with public form + admin dashboard.
Built with Next.js 14, TypeScript, and Tailwind CSS.

---

## Pages

| URL | Description |
|-----|-------------|
| `/` | Public registration form |
| `/admin` | Admin dashboard (login: `admin` / `admin123`) |

---

## Quick Start (local)

```bash
# 1. Install dependencies
npm install

# 2. Run locally
npm run dev

# 3. Open in browser
# http://localhost:3000
# http://localhost:3000/admin
```

---

## Deploy to Vercel (free)

### Method 1 — GitHub (recommended)

1. Go to [github.com](https://github.com) → create a new repository
2. Upload this project folder (or use git push)
3. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
4. Click **"Add New Project"** → import your repo
5. Vercel auto-detects Next.js → click **Deploy**
6. Your site is live at `yourproject.vercel.app` 🎉

### Method 2 — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
# Follow the prompts — done!
```

---

## Add a Real Database (optional)

To save registrations to a real database, connect Supabase:

1. Create free account at [supabase.com](https://supabase.com)
2. Create a table called `registrations`
3. Add environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```
4. Install client: `npm install @supabase/supabase-js`
5. In `src/app/page.tsx`, replace `console.log` in `onSubmit` with a Supabase insert call

---

## Project Structure

```
src/
  app/
    page.tsx          ← Registration form (public)
    admin/
      page.tsx        ← Admin dashboard
    layout.tsx        ← Root layout
    globals.css       ← Global styles + design tokens
```

---

## Customise

- **Brand name**: Search `YourBrand` and replace with your name
- **Colors**: Edit CSS variables in `globals.css`
- **Form fields**: Add/remove fields in `src/app/page.tsx` and the Zod schema
- **Admin password**: Change `admin123` in `src/app/admin/page.tsx` (use env vars in production)
