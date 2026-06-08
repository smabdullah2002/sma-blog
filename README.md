# SMA Blog

A digital publication built in the spirit of print journalism — stark geometry, high-contrast typography, and zero border radius.

## Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router v7 |
| **Backend** | Python 3.11+, FastAPI, Pydantic v2 |
| **Database** | MongoDB (Motor async driver) |
| **Auth** | JWT (python-jose) + bcrypt |
| **Markdown** | react-markdown + remark-gfm |
| **Icons** | lucide-react |

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 20+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate    # Windows
pip install -r requirements.txt
```

Create `.env` in `backend/`:

```
MONGODB_URI=mongodb://localhost:27017/blog
SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-password
CORS_ORIGINS=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

```bash
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
sma-blog/
├── backend/
│   ├── app/
│   │   ├── api/v1/       # Route handlers
│   │   ├── core/         # Security, config
│   │   ├── database/     # MongoDB connection
│   │   ├── schemas/      # Pydantic models
│   │   └── main.py       # FastAPI app
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/          # API client
│   │   ├── components/   # Reusable UI
│   │   ├── context/      # Auth, dashboard state
│   │   ├── pages/        # Route pages
│   │   └── utils/        # Helpers
│   └── package.json
└── .gitignore
```
