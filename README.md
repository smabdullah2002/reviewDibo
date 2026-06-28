# Product Review Platform

A full-stack review platform where users can browse products, submit ratings and reviews, and manage content through an admin panel.

## Features

- **User authentication** — Register, login, and JWT-based sessions
- **Product browsing** — Grid view with search and rating filter
- **Review system** — Create, edit, and delete reviews with 1–5 star ratings
- **Upsert behavior** — Submitting a second review on the same product updates the existing one
- **Admin panel** — Create/delete products, delete any user's review
- **Responsive UI** — Works on mobile, tablet, and desktop
- **Interactive API docs** — Swagger UI at `/docs`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Backend | Python 3, FastAPI, SQLAlchemy ORM |
| Database | PostgreSQL (Neon serverless) |
| Auth | bcrypt, JWT (python-jose) |
| Migrations | Alembic |

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── routers/       # API route handlers
│   │   │   ├── auth.py        # Register, login, token, me
│   │   │   ├── products.py    # Product CRUD
│   │   │   └── reviews.py     # Review CRUD with upsert
│   │   ├── auth.py         # Password hashing, JWT, user dependencies
│   │   ├── models.py       # SQLAlchemy models (User, Product, Review)
│   │   ├── schemas.py      # Pydantic request/response schemas
│   │   ├── database.py     # DB engine and session
│   │   ├── config.py       # Environment config
│   │   ├── seed.py         # Database seeder
│   │   └── server.py       # FastAPI app entry point
│   ├── alembic/            # Database migrations
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   │   ├── page.js         # Home — product grid + search/filter
│   │   │   ├── login/          # Login form
│   │   │   ├── register/       # Register form
│   │   │   ├── products/[id]/  # Product detail + reviews
│   │   │   └── admin/          # Admin panel
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Header.jsx, ProductCard.jsx, ReviewCard.jsx,
│   │   │   ├── ReviewForm.jsx, StarRating.jsx
│   │   └── lib/
│   │       ├── api.js          # API client
│   │       └── auth-context.js # Auth state management
│   ├── package.json
│   └── next.config.mjs
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL database (or [Neon](https://neon.tech) serverless Postgres)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
SECRET_KEY="your-secret-key"
```

Run database migrations:

```bash
alembic upgrade head
```

Seed the database with sample data:

```bash
python -m app.seed
```

Start the development server:

```bash
uvicorn app.server:app --reload
```

The API will be available at `http://localhost:8000` with interactive docs at `/docs`.

### Frontend Setup

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

> Update the `BASE_URL` in `src/lib/api.js` to point to your backend URL.

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register a new user |
| POST | `/api/auth/token` | — | Login (form-encoded, for Swagger) |
| POST | `/api/auth/login` | — | Login (JSON) |
| GET | `/api/auth/me` | JWT | Get current user |
| GET | `/api/products` | — | List all products with avg rating |
| GET | `/api/products/{id}` | — | Product detail with reviews |
| POST | `/api/products` | Admin | Create a product |
| DELETE | `/api/products/{id}` | Admin | Delete a product |
| POST | `/api/reviews` | JWT | Create or update a review (upsert) |
| PUT | `/api/reviews/{id}` | JWT | Update a review (owner or admin) |
| DELETE | `/api/reviews/{id}` | JWT | Delete a review (owner or admin) |

Full interactive documentation is available at `/docs` when the backend is running.

## Seed Data

The seed script creates:

- **1 admin user** — `admin@example.com` / `admin123`
- **3 regular users** — alice, bob, charlie@example.com / `password123`
- **10 products** — Wireless Mouse, Mechanical Keyboard, USB-C Hub, etc.
- **40 reviews** — each user + admin reviews every product

## Database Schema & Migrations

### Schema

**`users`**

| Column | Type | Constraints |
|--------|------|-------------|
| id | Integer | PK, auto-increment |
| name | String | NOT NULL |
| email | String | NOT NULL, UNIQUE |
| password_hash | String | NOT NULL |
| is_admin | Integer | Default 0 |
| created_at | DateTime (tz) | Server default now() |
| updated_at | DateTime (tz) | On update now() |

**`products`**

| Column | Type | Constraints |
|--------|------|-------------|
| id | Integer | PK, auto-increment |
| title | String | NOT NULL |
| description | Text | Nullable |
| image_url | String | Nullable |
| created_at | DateTime (tz) | Server default now() |
| updated_at | DateTime (tz) | On update now() |

**`reviews`**

| Column | Type | Constraints |
|--------|------|-------------|
| id | Integer | PK, auto-increment |
| product_id | Integer | FK → products.id, NOT NULL |
| user_id | Integer | FK → users.id, NOT NULL |
| rating | Integer | NOT NULL |
| comment | Text | Nullable |
| created_at | DateTime (tz) | Server default now() |
| updated_at | DateTime (tz) | On update now() |
| UNIQUE | (user_id, product_id) | `uq_review_user_product` |

### Relationship Diagram

```
User ────< Review >──── Product
  │                      │
  └── has_many           └── has_many
```

A user can write many reviews. A product can receive many reviews. Each user may only review a given product once (enforced by unique constraint and upsert logic).

### Migrations

Migrations are managed with [Alembic](https://alembic.sqlalchemy.org/) and stored in `backend/alembic/versions/`. The chain in apply order is:

| # | Revision | Description |
|---|----------|-------------|
| 1 | `3afe134ac063` | Create initial users, products, and reviews tables |
| 2 | `2caadb45e358` | Empty migration (no schema change) |
| 3 | `79ea195d412f` | Add `password_hash` and `is_admin` columns to users |
| 4 | `cf5bbdef0fcf` | Empty migration (no schema change) |
| 5 | `4017850321ab` | Add unique constraint on `(user_id, product_id)` in reviews |
| 6 | `935f5d87061c` | Empty migration (head, no schema change) |

The current head is `935f5d87061c`.

Useful Alembic commands:

```bash
# Apply all pending migrations
alembic upgrade head

# Rollback one step
alembic downgrade -1

# Rollback to a specific revision
alembic downgrade 3afe134ac063

# Generate a new migration (auto-detect model changes)
alembic revision --autogenerate -m "description"
```

## Deployment

### Backend (Vercel)

The backend includes a `vercel.json` configured for FastAPI deployment via `@vercel/python`. The entry point is `app/server.py`.

### Frontend (Vercel)

```bash
cd frontend
npm run build
npx vercel --prod
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a pull request

## License

This project is open source. See the [LICENSE](LICENSE) file for details.
