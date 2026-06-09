# A Wall of Thoughts

A public graffiti wall on the open web. Anyone can read it; signed-in visitors click the wall, write a short message, and leave it tagged in place.

**[a-wall-of-thoughs.vercel.app](https://a-wall-of-thoughs.vercel.app/)**

## What it is

Messages show oldest first on a full-width concrete-style canvas. Each tag can be placed anywhere on the wall, styled with spray colors and sizes, rotated, and resized with drag handles—like dropping graffiti on a real wall. The composer stays hidden until you click, so browsing stays clean.

## Built with

- **[Next.js](https://nextjs.org/)** (App Router), **React**, **TypeScript**, **Tailwind CSS** — UI, server actions, and optimistic updates on the client
- **[Supabase](https://supabase.com/)** — Postgres for messages, Google sign-in, and row-level security so only signed-in users can post
- **[Vercel](https://vercel.com/)** — hosting and deploys from GitHub

The wall texture, spray-can cursor, and tag styling are custom CSS and client components; placement and style choices are stored per message in the database.
