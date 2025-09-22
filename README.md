
# CuteForum — React + Bootstrap + Optional Supabase

A one‑page, pastel/earth‑tone forum demo with:
- email/password auth (Supabase) with local fallback,
- subscribe button,
- 10 icon categories (big modals),
- downloads section,
- profile with avatar/media uploads (Supabase Storage bucket `media`),
- threads: create + paged feed from a `threads` table,
- sticky navbar, big modals, endless scroll.

## Quick start
```bash
npm install
npm run dev
```

## Enable Supabase (optional)
- Create a project at https://supabase.com
- In **Storage**, create a bucket `media` (public).
- In **SQL**, run `supabase.sql` from this repo.
- Put keys into `.env`:
```
VITE_SUPABASE_URL=https://hjdsyvpfgkzzzjqbgvdl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqZHN5dnBmZ2t6enpqcWJndmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NTM3NzksImV4cCI6MjA3NDAyOTc3OX0.lA7jUAuSxkvO8CQ252ydZwjEtw_NYDnoF7WH7tRMLcw
```
Or set them in `index.html`:
```html
<script>
  window.SUPABASE_URL = "https://hjdsyvpfgkzzzjqbgvdl.supabase.co";
  window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqZHN5dnBmZ2t6enpqcWJndmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NTM3NzksImV4cCI6MjA3NDAyOTc3OX0.lA7jUAuSxkvO8CQ252ydZwjEtw_NYDnoF7WH7tRMLcw";
</script>
```

## Deploy (GitHub Pages 100% free)
```bash
npm run deploy
```
The site will publish to `https://levifite.github.io/multimedia-multiverse` (edit `homepage` in `package.json` as needed).

## License
MIT
