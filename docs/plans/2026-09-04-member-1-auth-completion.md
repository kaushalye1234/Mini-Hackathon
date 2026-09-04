# Member 1 Auth Completion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the remaining normal-user authentication integration tasks for CampusFind LK without removing existing admin login, admin user CRUD, or the current editable profile form.

**Architecture:** Reuse the existing Express auth routes, services, validators, JWT middleware, React auth context, protected routes, and profile page. Keep changes narrow: message wording and navigation only.

**Tech Stack:** MERN: React, Vite, React Router, Axios, Node.js, Express, MongoDB, Mongoose, JWT, bcrypt.

---

### Task 1: Auth Validation Message Polish

**Files:**
- Modify: `backend/middleware/validators/userValidator.js`
- Modify: `backend/services/authService.js`
- Modify: `backend/services/userService.js`
- Modify: `backend/middleware/errorMiddleware.js`

Update validation and duplicate/login errors to match the Member 1 prompt wording while preserving status codes and existing flow.

### Task 2: Frontend Auth Message Polish

**Files:**
- Modify: `frontend/src/pages/auth/Login.jsx`
- Modify: `frontend/src/pages/auth/Register.jsx`
- Modify: `frontend/src/pages/users/UserProfile.jsx`

Use matching friendly validation text on the client so frontend and backend behavior is consistent. Keep the existing editable profile form.

### Task 3: CampusFind Navigation

**Files:**
- Modify: `frontend/src/components/Navbar.jsx`

Keep admin links visible only to admins. For authenticated normal users, show CampusFind navigation links for Home, Lost Items, Report Lost Item, My Lost Items, Messages, Profile, and Logout. Do not create lost item or messaging pages owned by other members.

### Task 4: Verification

Run backend and frontend builds/checks available in the repo. Verify `.env` files stay ignored, admin routes remain role-protected, and normal-user auth routes remain wired through `/api/auth`.
