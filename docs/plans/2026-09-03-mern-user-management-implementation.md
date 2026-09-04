# MERN User Management Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a reusable MERN user management module with authentication, profile management, and an admin-only user management panel.

**Architecture:** Use separate `backend/` and `frontend/` applications. The backend exposes REST APIs through Express routes, validation middleware, controllers, services, and a Mongoose `User` model. The frontend uses Vite React, React Router, an auth context, service modules, and protected routes.

**Tech Stack:** React, Vite, React Router, Axios, Node.js, Express, MongoDB, Mongoose, JWT, bcrypt.

---

### Task 1: Backend Scaffold

**Files:**
- Create: `backend/package.json`
- Create: `backend/.env`
- Create: `backend/.env.example`
- Create: `backend/server.js`
- Create: `backend/config/db.js`

Set up Express, CORS, JSON parsing, environment configuration, MongoDB connection, and API route mounting.

### Task 2: Backend Auth and User Domain

**Files:**
- Create: `backend/models/User.js`
- Create: `backend/utils/generateToken.js`
- Create: `backend/services/authService.js`
- Create: `backend/services/userService.js`
- Create: `backend/controllers/authController.js`
- Create: `backend/controllers/userController.js`

Implement password hashing, login password comparison, active-account checks, JWT generation, user CRUD, search, role/status filters, profile update, and password-safe API responses.

### Task 3: Backend Middleware and Routes

**Files:**
- Create: `backend/middleware/authMiddleware.js`
- Create: `backend/middleware/roleMiddleware.js`
- Create: `backend/middleware/errorMiddleware.js`
- Create: `backend/middleware/validators/userValidator.js`
- Create: `backend/routes/authRoutes.js`
- Create: `backend/routes/userRoutes.js`

Add reusable authentication, role authorization, centralized error handling, and separate validation middleware for auth, admin CRUD, and profile updates.

### Task 4: Frontend Scaffold and Auth

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/.env`
- Create: `frontend/.env.example`
- Create: `frontend/index.html`
- Create: `frontend/vite.config.js`
- Create: `frontend/src/main.jsx`
- Create: `frontend/src/App.jsx`
- Create: `frontend/src/services/api.js`
- Create: `frontend/src/services/authService.js`
- Create: `frontend/src/context/AuthContext.jsx`
- Create: `frontend/src/hooks/useAuth.js`
- Create: `frontend/src/components/ProtectedRoute.jsx`
- Create: `frontend/src/components/Navbar.jsx`

Implement routing, token persistence, Axios auth headers, login/logout state, and admin-only route protection.

### Task 5: Frontend Pages and UI

**Files:**
- Create: `frontend/src/layouts/AdminLayout.jsx`
- Create: `frontend/src/pages/auth/Login.jsx`
- Create: `frontend/src/pages/auth/Register.jsx`
- Create: `frontend/src/pages/users/UserProfile.jsx`
- Create: `frontend/src/pages/admin/AdminDashboard.jsx`
- Create: `frontend/src/pages/admin/users/UserList.jsx`
- Create: `frontend/src/pages/admin/users/AddUser.jsx`
- Create: `frontend/src/pages/admin/users/EditUser.jsx`
- Create: `frontend/src/services/userService.js`
- Create: `frontend/src/styles.css`

Build a clean, responsive UI with loading states, messages, frontend validation, user search, role/status filters, CRUD actions, and delete confirmation.

### Task 6: Verification

Run:

```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

Verify the backend starts, frontend starts, MongoDB connects, auth flows work, admin-only UI and APIs are protected, validation errors appear, and passwords are not exposed in API responses.
