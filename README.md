# CampusFind LK

## Problem

Sri Lankan university students who lose personal belongings often lack a centralized digital method to report the lost item and connect with another student who later finds it.

## Solution

CampusFind LK allows students to report lost belongings. Other students can search or filter existing Lost Item reports and directly message the owner if they physically find the item.

## Main Features

- Admin Login
- Admin User Management CRUD
- Normal User Registration
- Normal User Login
- Separate User and Admin login pages
- Lost Item Management
- Search and Filter
- Message Lost Item Owner
- Inbox
- Sent Messages
- Reply
- My Lost Items
- Mark Item as Resolved

## Technologies

Frontend:

```text
React
Vite
Axios
React Router
```

Backend:

```text
Node.js
Express.js
```

Database:

```text
MongoDB
Mongoose
```

Authentication:

```text
JWT
bcryptjs
```

## Installation

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

## Environment Variables

Backend: create `backend/.env` from `backend/.env.example`.

```text
PORT=5000
MONGO_URI=mongodb://USERNAME:PASSWORD@HOSTS/user_management?ssl=true&replicaSet=REPLICA_SET&authSource=admin&appName=APP_NAME
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173
```

Frontend: create `frontend/.env` from `frontend/.env.example`.

```text
VITE_API_URL=http://localhost:5000/api
```

## Running Backend

```bash
cd backend
npm run dev
```

For production-style startup:

```bash
cd backend
npm start
```

Create an admin user:

```bash
cd backend
npm run create-admin
```

## Running Frontend

```bash
cd frontend
npm run dev
```

Build frontend:

```bash
cd frontend
npm run build
```

## API Endpoints

Authentication:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/admin/login
GET  /api/auth/me
POST /api/auth/logout
```

Admin User Management:

```text
GET    /api/users/stats
GET    /api/users
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
PUT    /api/users/profile
```

Lost Items:

```text
POST   /api/lost-items
GET    /api/lost-items
GET    /api/lost-items/my
GET    /api/lost-items/:id
PUT    /api/lost-items/:id
DELETE /api/lost-items/:id
PATCH  /api/lost-items/:id/resolve
```

Messages:

```text
POST  /api/messages
GET   /api/messages/inbox
GET   /api/messages/sent
GET   /api/messages/:id
POST  /api/messages/:id/reply
PATCH /api/messages/:id/read
```

## Frontend Routes

```text
/
/login
/admin/login
/register
/profile
/lost-items
/lost-items/report
/lost-items/:id
/lost-items/:id/edit
/my-lost-items
/messages
/messages/:id
/admin
/admin/users
/admin/users/add
/admin/users/:id/edit
```

## Authorization Rules

- JWT authentication protects normal user pages and APIs.
- Admin user management is restricted to users with the `admin` role.
- Lost item ownership is derived from `req.user._id`.
- Lost item images are uploaded through the backend to Cloudinary.
- Only the owner can edit, delete, or resolve a lost item.
- Message sender is derived from `req.user._id`.
- Message receiver is derived from the Lost Item owner.
- Users cannot message themselves through their own lost item post.
- Only message participants can view a message.
- Only the receiver can mark a message as read.

## Search And Filter

Lost Items support query parameters:

```text
search
category
location
status
lostDate
```

Examples:

```text
GET /api/lost-items?search=lap
GET /api/lost-items?category=Electronics
GET /api/lost-items?location=Computing%20Lab
GET /api/lost-items?status=LOST
GET /api/lost-items?search=lap&category=Electronics&location=Computing%20Lab&status=LOST
```

## Team Contributions

- Member 1: User Authentication and User Management completion
- Member 2: Lost Item Management - placeholder
- Member 3: Search and Messaging - placeholder
- Member 4: Deployment/QA/Docs - placeholder

## AI Tools Used

- Codex CLI / ChatGPT - implementation assistance

## Deployment Link

Placeholder: add deployment link here.

## Demo Video Link

Placeholder: add demo video link here.
