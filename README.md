# GrnGame Community

## Content moderation

Game publication checks the title, description, and author locally with the
`obscenity` package and an additional French list. The video is checked by the
`moderate-game` Supabase Edge Function with Sightengine before it is uploaded.
Sexual and violent content is rejected.

Deploy the function and configure its secrets before enabling publication:

```bash
supabase functions deploy moderate-game
supabase secrets set SIGHTENGINE_API_USER=your_api_user SIGHTENGINE_API_SECRET=your_api_secret
```

The Sightengine credentials must only be stored as Supabase secrets. They must
not be added to `VITE_*` environment variables or frontend source code.

## GitHub Pages configuration

The frontend needs the Supabase project URL and publishable (anonymous) key at
build time. In the GitHub repository, open **Settings > Secrets and variables >
Actions > New repository secret** and create these two secrets:

- `VITE_SUPABASE_URL`: the project URL from Supabase **Project Settings >
  API**, for example `https://your-project-ref.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: the publishable key from the same page

They must be repository secrets, or secrets in the `github-pages` environment
if the workflow is changed to declare that environment on the `build` job.
They are safe to expose in the generated frontend only because the publishable
key is protected by Supabase Row Level Security; never use a `service_role`
key here.

For local development, copy `.env.example` to `.env` and fill in the same two
values. The `.env` file is ignored by Git.

To configure the server-side Sightengine secrets, install and authenticate the
Supabase CLI, link the project, then run:

```bash
supabase login
supabase link --project-ref your-project-ref
supabase secrets set SIGHTENGINE_API_USER=your_api_user SIGHTENGINE_API_SECRET=your_api_secret
supabase functions deploy moderate-game
```

These Sightengine values belong only in Supabase Edge Function secrets. Do not
add them to GitHub Actions frontend secrets or any `VITE_*` variable.
