# Task Manager

A full-stack task manager built for the 1Play Global take-home assignment using React, Express, and Postgres, now extended with login, signup, role-based access, and Multer-powered profile photo uploads.

## Tech Stack

- Frontend: React + Vite + React Router
- Backend: Node.js + Express
- Database: PostgreSQL with raw SQL via `pg`
- Auth: JWT + `bcryptjs`
- Uploads: Multer with local disk storage
- Deployment target: Vercel for the frontend, Render for the backend

## Folder Structure

```text
.
|-- client/                 # React frontend
|-- server/                 # Express API + Postgres access + uploads
|-- .env.example            # Single local environment template
|-- package.json            # Root workspace scripts
`-- render.yaml             # Optional Render blueprint for the API
```

## Features

- Signup and login pages
- JWT-based authentication with persisted session restore
- Role-based access with `member` and `admin`
- Protected React routes and admin-only route guards
- Clickable profile area with an "Add a photo" action
- Multer-backed image upload and live avatar display
- User-owned tasks for members, full task visibility for admins
- Create, list, update, and delete tasks

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create one root .env file

Copy from `.env.example` to `.env` in the project root.

Required values:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@host:5432/database_name
DATABASE_SSL=true
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=change-me-before-deploying
JWT_EXPIRES_IN=7d
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Create or update the database schema

```bash
npm run db:setup
```

### 4. Start the app

```bash
npm run dev
```

## Profile Image Upload

- The backend serves uploaded images from `/uploads`
- The frontend profile trigger opens a small profile card
- Clicking `Add a photo` opens the file picker
- Accepted formats: JPG, PNG, WEBP, GIF
- Max image size: 5MB

## Deployment Notes

- Local uploads are stored on disk under `server/uploads`
- On Render, local disk storage is ephemeral, so uploaded images are not permanent across redeploys or instance replacement
- For production persistence, a cloud object store like Supabase Storage, Cloudinary, or S3 would be the next upgrade
