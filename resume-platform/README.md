# Resume Platform (MERN)

A minimal, clean Resume Platform implementing the assignment requirements: secure auth, resume builder with versioning, PDF download, and a dashboard.

## Features
- **Secure Login/Signup** (email/password, JWT)
- **Resume Builder** (personal details, education, experience, skills)
- **Version Tracking** (keeps last 10 versions + restore)
- **Download as PDF** (server-side PDF)
- **Dashboard** to manage and edit resumes
- Simple, responsive UI

## Tech
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, pdfkit
- **Frontend:** React (Vite)

## Quick Start

### 1) Clone & Install
```bash
# backend
cd server
cp .env.example .env
npm install

# frontend
cd ../client
npm install
```

### 2) Environment Variables (server/.env)
```env
PORT=4000
MONGODB_URI=<your Mongo connection string>
JWT_SECRET=<any random string>
CLIENT_ORIGIN=http://localhost:5173
```

### 3) Run
```bash
# Terminal A
cd server
npm run dev

# Terminal B
cd client
npm run dev
```

Open the client at http://localhost:5173. Sign up, create a resume, save versions, and download PDF.

## Deploy (suggestions)
- **Backend:** Render / Railway / AWS (Node + MongoDB Atlas)
- **Frontend:** Vercel / Netlify (set `VITE_API_URL` env to your deployed API base, e.g. https://your-api.com/api)

To build client:
```bash
cd client
npm run build
```
Serve the `/dist` output via any static host.

## Notes
- Versions are limited to 10 per resume to keep it lightweight.
- You can add extra fields or a visual template for the PDF.
- Add role-based features, analytics, or AI suggestions for bonus points.
