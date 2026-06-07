# Blog Website - Project Plan

## 1. Design Style: Newsprint

**"All the News That's Fit to Print."**

An ode to the golden age of print journalism, reimagined for the web. High-contrast typography, grid-based layouts, and sharp geometric precision.

### Core DNA
- **Stark Geometry**: Zero border radius. Every element is a perfect rectangle.
- **High Information Density**: Tight padding, collapsed grid borders, efficient use of space.
- **Typographic Drama**: Massive serif headlines (up to 9xl) paired with highly legible body text.
- **Visible Structure**: Grid lines are celebrated. Borders between columns and sections are explicit.
- **Paper Texture**: Subtle dot-grid grain overlay on the body background.
- **No Dark Mode**: Permanent light mode only.

### Color Palette
| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#F9F9F7` | Newsprint off-white page background |
| `--color-ink` | `#111111` | Ink black for all text and borders |
| `--color-muted` | `#E5E5E0` | Divider grey for secondary borders |
| `--color-accent` | `#CC0000` | Editorial red — used sparingly for badges, CTAs, hover |
| `--color-neutral-100` | `#F5F5F5` | Hover backgrounds |
| `--color-neutral-200` | `#E5E5E5` | Image placeholders |
| `--color-neutral-400` | `#A3A3A3` | Muted text on dark sections |
| `--color-neutral-500` | `#737373` | Metadata, captions |
| `--color-neutral-600` | `#525252` | Body text variations |
| `--color-neutral-700` | `#404040` | Secondary headings |

### Typography
| Role | Font Stack |
|---|---|
| Headlines & Display | `'Playfair Display', 'Times New Roman', serif` |
| Body (long-form) | `'Lora', Georgia, serif` |
| UI (labels, nav, buttons) | `'Inter', 'Helvetica Neue', sans-serif` |
| Data (stats, dates, codes) | `'JetBrains Mono', 'Courier New', monospace` |

### Scale Strategy
- **H1 (Hero)**: `text-5xl sm:text-6xl lg:text-9xl`, `leading-[0.9]`, `tracking-tighter`
- **H2 (Section)**: `text-4xl lg:text-5xl`, `font-black`, uppercase
- **H3 (Card Titles)**: `text-2xl lg:text-3xl`, `font-bold`, serif
- **Body**: `text-sm` to `text-lg`, Lora, `leading-relaxed`
- **Metadata**: `text-xs`, uppercase, `tracking-widest`, monospace/sans

### Borders & Radius
- **Border Radius**: `0px` everywhere (`.sharp-corners` utility)
- **Border Width**: 1px solid `#111111` standard; `border-b-4` for major dividers; `border-2` on inputs
- **Border Style**: Always solid. Collapsed grids share borders.

### Effects
- **No soft shadows, no blur, no gradients**
- **Hover: Hard Offset Shadow** — `box-shadow: 4px 4px 0px 0px #111111` + `translate(-2px, -2px)`
- **Images**: Grayscale by default, `sepia-[50%]` on hover
- **Drop Caps**: Massive first letter (`text-7xl`, `float-left`, accent color)
- **Paper Texture**: `background-image` with 4x4 dot pattern on body
- **Newsprint Texture**: Optional line-grid overlay on sections

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 (Vite), JSX, Tailwind CSS v4, React Router v7 |
| **Backend** | Python 3.11+, FastAPI, Pydantic v2 |
| **Database** | MongoDB (Motor async driver) |
| **Auth** | JWT (python-jose) + bcrypt |
| **Markdown** | react-markdown + remark-gfm (frontend); python-markdown (backend) |
| **Icons** | lucide-react |
| **Deployment** | Docker Compose (nginx, backend, frontend, mongo) |

---

## 3. Project Structure

```
sma-blog/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI app, lifespan, middleware
│   │   ├── config.py                # Settings via pydantic-settings
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   ├── mongo.py             # MongoDB connection manager
│   │   │   └── __init__.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py              # User model/schema
│   │   │   ├── post.py              # Post model/schema
│   │   │   ├── tag.py               # Tag model
│   │   │   └── comment.py           # Comment model
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py              # Login/register request/response
│   │   │   ├── post.py              # Post CRUD schemas
│   │   │   ├── comment.py
│   │   │   └── common.py            # Pagination, error schemas
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── deps.py              # Dependency injection (get_db, get_current_user)
│   │   │   ├── v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py          # POST /register, /login, /refresh
│   │   │   │   ├── posts.py         # CRUD /posts
│   │   │   │   ├── comments.py      # CRUD /posts/{id}/comments
│   │   │   │   ├── tags.py          # GET /tags
│   │   │   │   ├── newsletter.py    # POST /subscribe
│   │   │   │   └── users.py         # GET /me, /users/{id}
│   │   │   └── router.py            # Include all v1 routers
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py      # JWT, password hashing
│   │   │   ├── post_service.py      # Blog post business logic
│   │   │   ├── comment_service.py
│   │   │   └── newsletter_service.py
│   │   └── core/
│   │       ├── __init__.py
│   │       ├── security.py          # JWT encode/decode, password utils
│   │       ├── exceptions.py        # Custom HTTP exceptions
│   │       └── middleware.py        # CORS, request ID, rate limiting
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── test_auth.py
│   │   ├── test_posts.py
│   │   └── test_comments.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── main.jsx                 # React entry
│   │   ├── App.jsx                  # Router setup, layout
│   │   ├── index.css                # Tailwind v4 theme + custom utilities
│   │   ├── api/
│   │   │   ├── client.js            # Axios/fetch instance, interceptors
│   │   │   ├── auth.js              # Auth API calls
│   │   │   ├── posts.js             # Posts API calls
│   │   │   └── comments.js
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx       # Sticky header with edition bar + nav
│   │   │   │   ├── Footer.jsx       # Inverted section + bottom bar
│   │   │   │   └── Container.jsx    # 1280px max-width wrapper
│   │   │   ├── post/
│   │   │   │   ├── PostCard.jsx     # Grid card (grayscale img, hard-shadow hover)
│   │   │   │   ├── PostList.jsx     # Grid of PostCards
│   │   │   │   ├── PostContent.jsx  # Rendered MD article
│   │   │   │   └── PostMeta.jsx     # Date, read time, tags
│   │   │   ├── newsletter/
│   │   │   │   ├── SubscribeForm.jsx
│   │   │   │   └── SubscribeBanner.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   └── comment/
│   │   │       ├── CommentList.jsx
│   │   │       └── CommentForm.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Ticker + asymmetric hero + 4-col grid
│   │   │   ├── Post.jsx             # Single article view
│   │   │   ├── About.jsx
│   │   │   ├── Archive.jsx          # All posts (paginated grid)
│   │   │   ├── Tag.jsx              # Posts by tag
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx        # Author admin
│   │   │   ├── NewPost.jsx          # MD editor (create)
│   │   │   ├── EditPost.jsx         # MD editor (edit)
│   │   │   └── NotFound.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── usePosts.js
│   │   │   └── useComments.js
│   │   ├── store/
│   │   │   └── authStore.js         # Context or zustand
│   │   ├── utils/
│   │   │   ├── formatDate.js
│   │   │   ├── readTime.js
│   │   │   └── constants.js
│   │   └── types/
│   │       └── (not needed — JSX project)
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
│
├── docker-compose.yml
├── .env.example
├── project-plan.md
├── frontend-prompt.md
└── .gitignore
```

---

## 4. Database Schema Design

### MongoDB Collections

#### `users`
```json
{
  "_id": "ObjectId",
  "name": "Author Name",
  "email": "author@example.com",
  "password_hash": "$2b$12$...",
  "bio": "all models are wrong...",
  "avatar_url": "https://...",
  "role": "admin | author | subscriber",
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```

#### `posts`
```json
{
  "_id": "ObjectId",
  "title": "The Map Is Not the Territory",
  "slug": "the-map-is-not-the-territory",
  "excerpt": "All models are wrong, but some are useful...",
  "content_md": "# Markdown...",
  "cover_image": "https://...",
  "tags": ["ObjectId", "ObjectId"],
  "author_id": "ObjectId",
  "published": true,
  "published_at": "ISODate",
  "read_time_minutes": 8,
  "views_count": 0,
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```

#### `tags`
```json
{
  "_id": "ObjectId",
  "name": "Philosophy",
  "slug": "philosophy",
  "post_count": 12
}
```

#### `comments`
```json
{
  "_id": "ObjectId",
  "post_id": "ObjectId",
  "author_id": "ObjectId",
  "content_md": "Great post!",
  "parent_id": null | "ObjectId",
  "approved": true,
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```

#### `subscribers`
```json
{
  "_id": "ObjectId",
  "email": "subscriber@example.com",
  "subscribed_at": "ISODate",
  "unsubscribed_at": null | "ISODate",
  "source": "homepage | embed"
}
```


---

## 5. API Endpoints

### Authentication (`/api/v1/auth`)
| Method | Path | Description |
|---|---|---|
| POST | `/register` | Create account (name, email, password) |
| POST | `/login` | Login, returns access + refresh JWT |
| POST | `/refresh` | Exchange refresh token for new access token |
| POST | `/logout` | Invalidate refresh token |

### Posts (`/api/v1/posts`)
| Method | Path | Description |
|---|---|---|
| GET | `/` | List published posts (paginated, ?page=&limit=&tag=) |
| GET | `/{slug}` | Get single post (increments view count) |
| POST | `/` | Create post (auth required) |
| PUT | `/{id}` | Update post (author/admin only) |
| DELETE | `/{id}` | Delete post (author/admin only) |

### Comments (`/api/v1/posts/{slug}/comments`)
| Method | Path | Description |
|---|---|---|
| GET | `/` | List approved comments for a post |
| POST | `/` | Create comment (auth required) |
| DELETE | `/{id}` | Delete own comment |

### Tags (`/api/v1/tags`)
| Method | Path | Description |
|---|---|---|
| GET | `/` | List all tags with post counts |

### Newsletter (`/api/v1/newsletter`)
| Method | Path | Description |
|---|---|---|
| POST | `/subscribe` | Add email to subscribers list |
| POST | `/unsubscribe` | Remove/opt-out email |

### Users (`/api/v1/users`)
| Method | Path | Description |
|---|---|---|
| GET | `/me` | Get current user profile (auth required) |
| PUT | `/me` | Update profile |

---

## 6. Frontend Pages & Routes

| Route | Page Component | Description |
|---|---|---|
| `/` | `Home` | Marquee ticker + asymmetric hero + 4-col grid |
| `/post/{slug}` | `Post` | Full article with MD rendering + comments |
| `/archive` | `Archive` | All posts (paginated grid, collapsed borders) |
| `/tag/{slug}` | `Tag` | Posts filtered by tag |
| `/about` | `About` | Static about page |
| `/login` | `Login` | Login form |
| `/register` | `Register` | Registration form |
| `/dashboard` | `Dashboard` | Author stats + post management table |
| `/dashboard/new` | `NewPost` | Markdown editor with preview |
| `/dashboard/edit/{id}` | `EditPost` | Edit existing post |
| `*` | `NotFound` | 404 page |

### Home Page Layout (Newsprint Style)
```
┌──────────────────────────────────────────────────────────────┐
│  MARQUEE TICKER (black bg, white text, red BREAKING badges)  │
├──────────────────────────────────────────────────────────────┤
│  EDITION BAR                                                  │
│  Vol. 1 | Monday, June 7, 2026 | New York Edition            │
├──────────────────────────────────────────────────────────────┤
│  HEADER (sticky, z-40)                                        │
│  SMA BLOG (serif 4xl/5xl)   HOME | ARCHIVE | ABOUT | SIGN IN │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  HERO — Asymmetric 8-col / 4-col                            │
│  ┌──────────────────────┬────────────────────┐              │
│  │ col-span-8           │ col-span-4          │              │
│  │ FEATURED STORY       │ Get the Newsletter  │              │
│  │ [grayscale img]      │ [email] [Subscribe] │              │
│  │ T  he Map Is Not...  │ Trending Topics     │              │
│  │ (drop cap)           │ Philosophy, Mental… │              │
│  │                      │ Stats: 31K / 128    │              │
│  └──────────────────────┴────────────────────┘              │
│                                                              │
│                    ✦ ✦ ✦  (ornamental divider)              │
│                                                              │
│  LATEST FROM SMA BLOG                                        │
│  ───── (red underline accent)                                │
│  ┌──────┬──────┬──────┬──────┐                               │
│  │Card 1│Card 2│Card 3│Card 4│  (border-r collapsed)        │
│  ├──────┼──────┼──────┼──────┤                               │
│  │Card 5│Card 6│Card 7│Card 8│                               │
│  └──────┴──────┴──────┴──────┘                               │
│                                                              │
│                    ✦ ✦ ✦                                     │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  FOOTER — INVERTED (black bg, white text)                    │
│  SMA BLOG (serif)   Sections   Connect   Get Newsletter      │
│  "all models are..."                                         │
├──────────────────────────────────────────────────────────────┤
│  BOTTOM BAR                                                   │
│  Edition: Vol 1.0 | Printed in NYC          © 2026           │
└──────────────────────────────────────────────────────────────┘
```

---

## 7. Implementation Phases

### Phase 1: Foundation (Week 1)
- [x] Initialize frontend with Vite + React + JSX + Tailwind v4
- [ ] Initialize backend with FastAPI + uv/poetry
- [ ] Docker Compose setup (backend, frontend, nginx, mongo)
- [ ] MongoDB connection manager
- [x] Core CSS theme (colors, typography, textures via `@theme`)
- [x] Layout components (Header with edition bar, Footer inverted, Container)

### Phase 2: Auth (Week 1-2)
- [ ] User model + JWT auth on backend
- [ ] Register/Login/Logout API
- [ ] Login/Register pages on frontend (newsprint style: sharp corners, bottom-border inputs, uppercase labels)
- [ ] Auth context/store + protected routes

### Phase 3: Blog Core (Week 2-3)
- [ ] Post CRUD API (create, read, update, delete)
- [ ] Markdown editor (textarea with preview, newsprint-styled)
- [ ] Post rendering (react-markdown + remark-gfm)
- [x] Home page — marquee ticker + hero + 4-col grid
- [ ] Single post page (drop caps, justified text, grayscale images, fig captions)
- [ ] Archive page with pagination (collapsed border grid)
- [ ] Tag filtering page

### Phase 4: Engagement (Week 3-4)
- [ ] Comment API + UI (threaded, bordered containers)
- [ ] Newsletter subscribe/unsubscribe API + form
- [ ] Author dashboard (stats, manage posts)
### Phase 5: Polish (Week 4)
- [ ] Responsive design audit (mobile: single column, remove border-r)
- [ ] SEO (meta tags, sitemap, RSS feed)
- [ ] Performance optimization (lazy images, will-change on animations)
- [ ] Error pages, loading states (newsprint-styled)
- [ ] Rate limiting on backend
- [ ] Tests (pytest backend, vitest frontend)

---

## 8. Key Dependencies

### Frontend (`package.json`)
```json
{
  "dependencies": {
    "react": "^19.2",
    "react-dom": "^19.2",
    "react-router-dom": "^7",
    "react-markdown": "^9",
    "remark-gfm": "^4",
    "lucide-react": "^0.500",
    "axios": "^1",
    "date-fns": "^3"
  },
  "devDependencies": {
    "vite": "^8",
    "@vitejs/plugin-react": "^6",
    "tailwindcss": "^4",
    "@tailwindcss/vite": "^4",
    "eslint": "^10"
  }
}
```

### Backend (`requirements.txt`)
```
fastapi==0.111.0
uvicorn[standard]==0.30.1
pydantic==2.7.4
pydantic-settings==2.3.4
motor==3.4.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.9
python-markdown==3.6
pillow==10.3.0
httpx==0.27.0
pytest==8.2.2
pytest-asyncio==0.23.7
```

---

## 9. Tailwind Theme (v4 CSS-based)

```css
@import "tailwindcss";

@theme {
  --color-bg: #F9F9F7;
  --color-ink: #111111;
  --color-muted: #E5E5E0;
  --color-accent: #CC0000;
  --color-neutral-100: #F5F5F5;
  --color-neutral-200: #E5E5E5;
  --color-neutral-400: #A3A3A3;
  --color-neutral-500: #737373;
  --color-neutral-600: #525252;
  --color-neutral-700: #404040;
  --font-serif: 'Playfair Display', 'Times New Roman', serif;
  --font-body: 'Lora', Georgia, serif;
  --font-sans: 'Inter', 'Helvetica Neue', sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
}
```

### Custom Utilities
```css
.sharp-corners { border-radius: 0px !important; }

.hard-shadow-hover {
  transition: all 0.2s ease-out;
}
.hard-shadow-hover:hover {
  box-shadow: 4px 4px 0px 0px #111111;
  transform: translate(-2px, -2px);
}

.newsprint-texture::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(0deg, transparent 98%, rgba(0,0,0,0.02) 100%),
    linear-gradient(90deg, transparent 98%, rgba(0,0,0,0.02) 100%);
  background-size: 3px 3px;
  pointer-events: none;
  opacity: 0.5;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
```

---

---

## 11. Environment Variables

```env
# Backend
MONGODB_URI=mongodb://mongo:27017/blog
SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Frontend
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## 12. Docker Compose Services

```yaml
version: '3.8'
services:
  mongo:
    image: mongo:7
    volumes:
      - mongo_data:/data/db

  backend:
    build: ./backend
    depends_on: [mongo]
    environment:
      - MONGODB_URI=mongodb://mongo:27017/blog

  frontend:
    build: ./frontend
    depends_on: [backend]

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./frontend/nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on: [frontend, backend]

volumes:
  mongo_data:
```
