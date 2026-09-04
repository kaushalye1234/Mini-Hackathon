# Separate User And Admin Login Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add separate normal user and admin login pages while reusing the existing shared auth context/service and backend endpoints.

**Architecture:** Keep `frontend/src/pages/auth/Login.jsx` as the single login implementation and configure it with an `admin` mode for `/admin/login`. Update `ProtectedRoute.jsx` to support a custom unauthenticated redirect so admin routes send logged-out visitors to `/admin/login`, while authenticated non-admin users are redirected to `/profile`. Update the navbar to show both Login and Admin Login when logged out.

**Tech Stack:** React, Vite, React Router, Axios, existing AuthContext/authService, Express auth endpoints.

---

### Task 1: Reusable Login Modes

**Files:**
- Modify: `frontend/src/pages/auth/Login.jsx`

Add an `isAdminLogin` prop. Use `login(form, { requireAdmin: isAdminLogin })` for admin mode and keep normal mode on `/api/auth/login`. Change headings and register link visibility based on mode.

### Task 2: Route Wiring And Redirects

**Files:**
- Modify: `frontend/src/App.jsx`
- Modify: `frontend/src/components/ProtectedRoute.jsx`

Add `/admin/login` route using `<Login isAdminLogin />`. Add an `unauthenticatedTo` prop to `ProtectedRoute`; set admin protected routes to redirect logged-out users to `/admin/login`. Keep non-admin authenticated users redirected to `/profile`.

### Task 3: Logged-Out Navigation

**Files:**
- Modify: `frontend/src/components/Navbar.jsx`

Show both Login and Admin Login when logged out. Keep Admin visible only for authenticated admins.

### Task 4: Verification

Run `npm --prefix frontend run build`. Confirm backend endpoints remain unchanged: `/api/auth/login` and `/api/auth/admin/login`.
