# Study Planner

A  study planner app which helps users to manage their own tasks and organise them by  register & log in to their individual accounts. 

## Features
- Register and login with hashed passwords (bcrypt) and JWT tokens
- Add, list, mark done and delete tasks
- Each user sees only their own tasks
- Protected planner page that redirects to login when not signed in
- Clear error messages from the API

## Tech stack
- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas with Mongoose
- **Auth:** bcryptjs, jsonwebtoken

## Project structure
    study-planner/
    ├── backend/    Express API (routes, models, middleware)
    └── frontend/   Next.js app (login, register, planner)

## Setup

### 1. Backend
    cd backend
    npm install
Copy `.env.example` to `.env` and fill in your own values:
- `MONGO_URI`: your MongoDB Atlas connection string
- `JWT_SECRET`: any long random string

Start it:

    npm run dev

The API runs on http://localhost:5000.

### 2. Frontend
    cd frontend
    npm install
Copy `.env.example` to `.env.local`, then start it:

    npm run dev

The app runs on http://localhost:3000.

## API endpoints
| Method | Route | Auth | What it does |
|--------|-------|------|--------------|
| POST | /api/auth/register | No | Create an account |
| POST | /api/auth/login | No | Log in, returns a token |
| GET | /api/tasks | Yes | List my tasks |
| POST | /api/tasks | Yes | Add a task |
| PATCH | /api/tasks/:id | Yes | Mark done or not done |
| DELETE | /api/tasks/:id | Yes | Delete a task |

Protected routes need the header `Authorization: Bearer <token>`.