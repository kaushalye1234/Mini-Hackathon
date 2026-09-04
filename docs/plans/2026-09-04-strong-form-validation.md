# Strong Form Validation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen all app form validation with clear, short error messages while preserving existing auth, admin CRUD, profile edit, lost-item image upload, and messaging behavior.

**Architecture:** Add shared frontend validation helpers and reuse them across forms. Keep backend validator middleware as the authoritative server-side guard and align its rules with the frontend.

**Tech Stack:** React, Vite, Express, Mongoose, JWT, Cloudinary upload middleware.

---

### Task 1: Shared Frontend Validation

**Files:**
- Create: `frontend/src/utils/validation.js`

**Steps:**
1. Add reusable validators for required fields, email, names, password strength, dates, text length, images, roles, statuses, and message text.
2. Return field-keyed errors so forms can show compact messages under each input.

### Task 2: Auth, Profile, And Admin Forms

**Files:**
- Modify: `frontend/src/pages/auth/Login.jsx`
- Modify: `frontend/src/pages/auth/Register.jsx`
- Modify: `frontend/src/pages/users/UserProfile.jsx`
- Modify: `frontend/src/pages/admin/users/AddUser.jsx`
- Modify: `frontend/src/pages/admin/users/EditUser.jsx`

**Steps:**
1. Replace one-message validation with field-level errors.
2. Keep login validation simple: required email and password only.
3. Enforce stronger password rules only where passwords are created.
4. Preserve the existing editable profile form behavior.

### Task 3: Lost Item And Message Forms

**Files:**
- Modify: `frontend/src/pages/lost-items/ReportLostItem.jsx`
- Modify: `frontend/src/pages/lost-items/EditLostItem.jsx`
- Modify: `frontend/src/pages/lost-items/LostItemDetails.jsx`
- Modify: `frontend/src/pages/messages/MessageDetails.jsx`
- Modify: `frontend/src/pages/lost-items/LostItems.jsx`

**Steps:**
1. Add compact field errors for report, edit, owner message, and reply forms.
2. Block future lost dates.
3. Keep Cloudinary file upload flow intact.
4. Validate search/filter inputs without blocking normal browsing.

### Task 4: Backend Validator Alignment

**Files:**
- Modify: `backend/middleware/validators/userValidator.js`
- Modify: `backend/middleware/validators/lostItemValidator.js`
- Modify: `backend/middleware/validators/messageValidator.js`
- Modify: `backend/services/authService.js`
- Modify: `backend/models/User.js`

**Steps:**
1. Match backend name, email, password, date, text, image, role, and status rules to frontend validation.
2. Return short messages such as `Wrong credentials.` and `Password needs one capital letter.`
3. Keep server-side validation responses as `{ message }`.

### Task 5: Styling And Verification

**Files:**
- Modify: `frontend/src/styles.css`

**Steps:**
1. Add compact `.field-error` and invalid input styling.
2. Run frontend build.
3. Run backend syntax checks.
