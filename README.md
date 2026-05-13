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

## Features (planned)

- Sign in with Google
- Post a short text message
- Public, chronological feed (oldest at top)
- Admin moderation: delete messages, ban users

## Status

Scaffolded with `create-next-app` (TypeScript, App Router, Tailwind).

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Edit `src/app/page.tsx` to change the home page.
