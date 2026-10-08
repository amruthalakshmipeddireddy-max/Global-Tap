# Global Tap (Global-Tap)

A simple, clean prototype of the Global Tap app: UPI payments in India and
a separate International Pay experience when travelling abroad. Includes
login and sign-up pages with email verification, and a Node.js backend that
stores user information in Supabase.

> Prototype only. Every transaction, rate, merchant and fee on screen is
> sandbox/demo data. No real money moves and no payment partner is connected.

## Folder structure

```
frontend/               Everything the user sees (plain HTML/CSS/JS).
  index.html            App screens. Opens only when logged in.
  login.html            Login page (email + password).
  signup.html           Sign-up page (name, email, phone, country, password).
  css/style.css         App styling.
  css/auth.css          Login/signup styling.
  js/app.js             App behavior (payment sandbox, converter, assistant).
  js/auth.js            Login helpers. API_BASE at the top points at the backend.
  assets/favicon.svg    App icon.
  pages/privacy.html    Standalone Privacy page.
  pages/terms.html      Standalone Terms & Conditions page.

backend/                Node.js + Express API (plain JavaScript).
  server.js             Starts the server, mounts the routes.
  supabaseClient.js     Supabase connections (reads backend/.env).
  routes/auth.js        POST /api/auth/signup, POST /api/auth/login,
                        GET /api/auth/me, POST /api/auth/logout.
  routes/profile.js     GET /api/profile, PUT /api/profile.
  .env.example          Template for backend/.env (never commit the real one).
  package.json

supabase/
  schema.sql            Creates the profiles table. Run once in Supabase.
```

## How login and verification work

1. Sign-up collects name, email, phone (optional), home country and password.
2. The backend creates the account with Supabase Auth and saves the extra
   information in the `profiles` table.
3. Supabase itself sends the verification email and generates the
   verification link. No codes are written by hand here.
4. Turn on "Confirm email" in Supabase (Authentication -> Providers -> Email)
   so login is blocked until the user verifies.
5. Login returns a token; the frontend saves it and sends it with every
   later request. The backend checks it on protected routes.

## Setup (do this once)

You need a free Supabase project. The secret keys go only into
`backend/.env` on your own machine. Never commit that file, and never
paste the keys into chat.

1. Create a project at supabase.com, then open the SQL Editor and run
   `supabase/schema.sql`.
2. In the Supabase dashboard, go to Authentication -> Providers -> Email
   and turn on "Confirm email".
3. In `backend/`, copy `.env.example` to `.env` and fill in your
   `SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY`
   (Settings -> API in the Supabase dashboard).
4. Start the backend:
   ```
   cd backend
   npm install
   node server.js
   ```
5. Serve the frontend (in another terminal):
   ```
   cd frontend
   python3 -m http.server 8000
   ```
6. Open `http://localhost:8000/signup.html`, create an account, verify
   your email, then log in.

If you deploy the backend somewhere else, change `GT_API_BASE` at the
top of `frontend/js/auth.js` to its address, and set `FRONTEND_URL` in
`backend/.env` to your frontend address.

## Where to edit what

- Screen text: `frontend/index.html`, `frontend/login.html`, `frontend/signup.html`
- Colors/layout: `frontend/css/style.css` (palette in `:root`), `frontend/css/auth.css`
- Demo rate, fees, assistant answers: `frontend/js/app.js`
- Backend address: `frontend/js/auth.js` (`GT_API_BASE`)
- API behavior: `backend/routes/auth.js`, `backend/routes/profile.js`
- Database shape: `supabase/schema.sql`

## Design rules followed

No purple gradients, no pill buttons, no fake reviews/metrics/counters,
no emoji icons (inline SVG instead), no em dashes, no heavy scroll or
cursor animations, no AI-slop stock copy.
