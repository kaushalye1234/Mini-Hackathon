# Cloudinary Lost Item Images Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace manual lost-item image URL entry with direct image upload to Cloudinary.

**Architecture:** Add backend upload middleware using `multer` memory storage and Cloudinary upload helper using `CLOUDINARY_URL`. Keep the existing `LostItem.imageUrl` database field and assign Cloudinary `secure_url` before create/update service calls. Update React lost-item report/edit forms to submit `FormData` with an optional image file.

**Tech Stack:** Express, Multer, Cloudinary Node SDK, React, Vite, Axios, existing MERN auth and lost-item modules.

---

### Task 1: Dependencies And Environment

**Files:**
- Modify: `backend/package.json`
- Modify: `backend/package-lock.json`
- Modify: `backend/.env.example`
- Modify: `README.md`

Install `cloudinary` and `multer`. Document `CLOUDINARY_URL` as a placeholder only.

### Task 2: Backend Upload Helpers

**Files:**
- Create: `backend/config/cloudinary.js`
- Create: `backend/middleware/uploadMiddleware.js`

Configure Cloudinary from env and add single image upload middleware with file type and size validation.

### Task 3: Lost Item Multipart Integration

**Files:**
- Modify: `backend/routes/lostItemRoutes.js`
- Modify: `backend/controllers/lostItemController.js`
- Modify: `backend/middleware/validators/lostItemValidator.js`

Accept multipart image uploads on create/update. Upload images in the controller and pass returned `imageUrl` into the existing lost-item service.

### Task 4: Frontend File Inputs

**Files:**
- Modify: `frontend/src/services/lostItemService.js`
- Modify: `frontend/src/pages/lost-items/ReportLostItem.jsx`
- Modify: `frontend/src/pages/lost-items/EditLostItem.jsx`
- Modify: `frontend/src/styles.css`

Replace `Image URL optional` with image file input, preview selected files, preserve current image on edit if no new image is uploaded, and submit `FormData`.

### Task 5: Verification

Run backend syntax checks and `npm --prefix frontend run build`. Full upload testing requires a valid Cloudinary URL and reachable MongoDB.
