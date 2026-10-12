# Supabase Sync Setup

## 1. Add the project keys

Copy `.env.example` to `.env.local` and add the project's publishable key to `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. The legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` name is also accepted. Never put a `service_role` key in a `NEXT_PUBLIC_` variable or in browser code.

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in Vercel Project Settings > Environment Variables for Production, Preview, and Development, then redeploy.

## 2. Configure email login

In Supabase Authentication, enable email sign-ups and magic links. Add these redirect URLs to the URL Configuration:

- `http://localhost:3000/**`
- Your deployed Vercel URL, for example `https://your-project.vercel.app/**`

## 3. Create the shared tables

Open Supabase SQL Editor and run `supabase/schema.sql`. Make sure the membership insert at the bottom contains both account emails.

Both people must request a magic link from the app once first so their users exist in Supabase Auth. If the membership insert ran before those accounts existed, run that insert again afterward.

## 4. Local development

Restart `npm run dev` after creating `.env.local`. Once signed in as one of the two listed members, album entries, quiz questions, plans, letter text, and countdown settings sync through Supabase Realtime. Without the Supabase environment variables, the app continues using local browser storage.
