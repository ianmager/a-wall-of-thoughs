# a-wall-of-thoughts

A small full-stack web app: a public message wall where authenticated users can
leave short messages, like writing on a wall. The feed is chronological
(oldest first) and visible to anyone.

This is a portfolio project so it is small in scope, but built with the same tools
I'd reach for at work.

## Stack (current plan)

- **Frontend:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **Auth & DB:** Supabase (Postgres, Auth with Google OAuth, Row Level Security)
- **Hosting:** Vercel

## Features

- Sign in with Google (wired in the UI; enable the provider in Supabase + Google Cloud)
- Post a short text message
- Public, chronological feed (oldest at top)
- Admin moderation: delete messages, ban users

## Status

Scaffolded with `create-next-app`. Supabase SSR clients, middleware session refresh, and `/auth/callback` are in place. The home page shows session state and Google sign-in / sign-out.

## Local development

```bash
npm install
npm run dev
```

Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`). Open [http://localhost:3000](http://localhost:3000).

## Auth setup (Supabase + Google)

Do this once per environment (local + production).

1. **Supabase → Authentication → URL configuration**
   - **Site URL:** `http://localhost:3000` while developing (use your deployed site URL in production).
   - **Redirect URLs:** include `http://localhost:3000/auth/callback` and, when you deploy, `https://<your-domain>/auth/callback`.

2. **Supabase → Authentication → Providers → Google** — enable Google and paste the **Client ID** and **Client secret** from Google Cloud.

3. **Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID**
   - Application type: **Web application**.
   - **Authorized JavaScript origins:** your app origins, e.g. `http://localhost:3000` and your production origin.
   - **Authorized redirect URIs:** use the value Supabase expects for Google (your Supabase project’s Auth callback), typically `https://<project-ref>.supabase.co/auth/v1/callback`. This is **not** the same as your Next.js `/auth/callback` URL.

After that, use **Sign in with Google** on the home page to verify the flow.
