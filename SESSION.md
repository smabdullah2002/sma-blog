# Session Summary — Newsprint Blog

## What We Built
- **Frontend** (`frontend/`): React 19 + JSX + Tailwind v4 + Vite — newsprint-styled blog
- **Backend** (`backend/`): FastAPI + MongoDB (Motor) + JWT auth

## What's Done
- Tailwind v4 `@theme` config, layout components (Header, Footer, Container)
- Home page — dynamic hero + quote from API, empty state when no posts
- About, Archive, Post, Tag, 404 pages — all fetch from API, no mock data
- Dashboard: layout, StatCard, PostTable, PostEditor, ConfirmModal
- Dashboard pages: overview, posts manager, new/edit post, homepage settings
- Auth: login page, AuthContext, ProtectedRoute, JWT with auto-refresh
- API client: Axios with Bearer token + 401 refresh
- Subscribe modal → real API endpoint
- **Backend**: FastAPI — auth, posts CRUD, tags, settings, newsletter, image uploads
- PostEditor: cover image upload + inline Markdown image upload via Cloudinary

## Key Decisions
- Single admin, seeded from `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars
- CamelCase ↔ snake_case mapping in DashboardContext
- Fallback to mock data when API unavailable
- No dark mode, no rounded corners, no soft shadows

## Next Steps
1. Docker Compose + Dockerfiles (mongo:7, backend, nginx frontend)
2. Backend tests (pytest + pytest-asyncio)
3. Loading skeletons, error toasts, responsive mobile menu
4. SEO — dynamic `<title>`/`<meta>`, sitemap.xml, RSS feed

## Running the Backend
```bash
cd backend
pip install -r requirements.txt
# Set ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=secret in .env
uvicorn app.main:reload
```
Requires MongoDB (Atlas or local `docker run -d -p 27017:27017 mongo:7`).
