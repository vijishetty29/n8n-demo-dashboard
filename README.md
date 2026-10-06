# n8n Demo Dashboard

A simple full-stack demo app built with Next.js that:

- links to the online n8n workflow
- lets you trigger the workflow from a browser
- stores every request in a database
- displays the request history in the frontend

It is designed to be a no-install cloud demo and can be deployed to Vercel in minutes.

## Stack

- Frontend: Next.js
- Backend: Next.js API routes
- Database: Supabase PostgreSQL
- Hosting: Vercel

## Live workflow link

- https://vijishetty.app.n8n.cloud/assistant/c7843dbc-58ed-4b62-8a4c-92837b27adaa

## One-click deployment

1. Push this repository to GitHub.
2. Import the repo in Vercel.
3. Add the environment variables from `.env.example`.
4. Deploy.

## Environment variables

Create a `.env.local` file from `.env.example` and fill in your values:

```bash
cp .env.example .env.local
```

Required values:

- `NEXT_PUBLIC_N8N_WORKFLOW_URL`: the workflow URL to open in the demo
- `N8N_WEBHOOK_URL`: the same URL or the actual webhook endpoint the workflow expects
- `NEXT_PUBLIC_SUPABASE_URL`: your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: your Supabase service role key

## Supabase setup

Run the SQL in `supabase/schema.sql` inside your Supabase SQL editor.

## Local development

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## What this app demonstrates

This project is a plain demo app for showing that:

- the n8n workflow can be opened from the frontend
- the frontend can trigger the workflow without editing the main workflow itself
- every request is saved to a database and displayed back in the UI

## Notes

If your n8n workflow expects a different payload or HTTP method, adjust the code in `app/api/trigger/route.js`.
