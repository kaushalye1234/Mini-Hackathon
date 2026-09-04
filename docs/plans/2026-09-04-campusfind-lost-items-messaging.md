# CampusFind Lost Items And Messaging Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add the remaining CampusFind LK lost-item search, owner messaging, inbox/reply, and resolve flow on top of the existing user management/auth module.

**Architecture:** Add two backend modules, `LostItem` and `Message`, using the existing Express route/controller/service/model pattern and existing JWT middleware. Add React pages and service modules that reuse the existing Axios instance, AuthContext, ProtectedRoute, Navbar, and CSS system. Do not duplicate authentication or alter admin CRUD behavior.

**Tech Stack:** React, Vite, React Router, Axios, Node.js, Express, MongoDB, Mongoose, JWT.

---

### Task 1: Backend Lost Items

**Files:**
- Create: `backend/models/LostItem.js`
- Create: `backend/services/lostItemService.js`
- Create: `backend/controllers/lostItemController.js`
- Create: `backend/routes/lostItemRoutes.js`
- Create: `backend/middleware/validators/lostItemValidator.js`
- Modify: `backend/server.js`

Implement create, list/search/filter, get one, get my items, update own item, delete own item, and resolve own item. Always derive ownership from `req.user._id`.

### Task 2: Backend Messages

**Files:**
- Create: `backend/models/Message.js`
- Create: `backend/services/messageService.js`
- Create: `backend/controllers/messageController.js`
- Create: `backend/routes/messageRoutes.js`
- Create: `backend/middleware/validators/messageValidator.js`
- Modify: `backend/server.js`

Implement message owner, inbox, sent, detail, reply, and mark-read endpoints. Always derive sender/receiver server-side and block messaging your own lost item.

### Task 3: Frontend Lost Item Pages

**Files:**
- Create: `frontend/src/services/lostItemService.js`
- Create: `frontend/src/pages/Home.jsx`
- Create: `frontend/src/pages/lost-items/LostItems.jsx`
- Create: `frontend/src/pages/lost-items/LostItemDetails.jsx`
- Create: `frontend/src/pages/lost-items/ReportLostItem.jsx`
- Create: `frontend/src/pages/lost-items/EditLostItem.jsx`
- Create: `frontend/src/pages/lost-items/MyLostItems.jsx`
- Modify: `frontend/src/App.jsx`

Build responsive pages for reporting, searching/filtering, details, owner actions, and resolving.

### Task 4: Frontend Messaging Pages

**Files:**
- Create: `frontend/src/services/messageService.js`
- Create: `frontend/src/pages/messages/Messages.jsx`
- Create: `frontend/src/pages/messages/MessageDetails.jsx`
- Modify: `frontend/src/App.jsx`

Build inbox/sent tabs, message detail, reply form, and mark-read integration.

### Task 5: Styling And Docs

**Files:**
- Modify: `frontend/src/styles.css`
- Create: `README.md`

Extend existing CSS with practical responsive layouts. Add setup, env, endpoints, and feature documentation with placeholders for deployment/demo links.

### Task 6: Verification

Run backend syntax checks for new and modified backend files and `npm --prefix frontend run build`. Manual MongoDB-backed end-to-end testing requires MongoDB and test users running locally.
