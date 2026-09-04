/**
 * CampusFind LK - Main App Component & Router
 * File: frontend/src/App.jsx
 */

import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddUser from "./pages/admin/users/AddUser";
import EditUser from "./pages/admin/users/EditUser";
import UserList from "./pages/admin/users/UserList";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserProfile from "./pages/users/UserProfile";

// Member 2: Lost Item CRUD Pages
import ReportLostItemPage from "./pages/lostItems/ReportLostItemPage";
import EditLostItemPage from "./pages/lostItems/EditLostItemPage";
import MyLostItemsPage from "./pages/lostItems/MyLostItemsPage";

// Member 4: Messaging Pages
import MessagesPage from "./pages/messages/MessagesPage";
import MessageDetailsPage from "./pages/messages/MessageDetailsPage";
import SendMessagePage from "./pages/messages/SendMessagePage";

// Member 3: Search, Filter & Discovery Pages
import LostItemsPage from "./pages/lostItems/LostItemsPage";
import LostItemDetailsPage from "./pages/lostItems/LostItemDetailsPage";

const App = () => {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Default home route redirects to Lost Items discovery page */}
          <Route path="/" element={<Navigate to="/lost-items" replace />} />

          {/* Member 3: Discovery & Detail Routes */}
          <Route path="/lost-items" element={<LostItemsPage />} />
          <Route path="/lost-items/:id" element={<LostItemDetailsPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfile />} />
            {/* Member 2: Lost Item CRUD Routes */}
            <Route path="/report-lost-item" element={<ReportLostItemPage />} />
            <Route path="/my-lost-items" element={<MyLostItemsPage />} />
            <Route path="/lost-items/:id/edit" element={<EditLostItemPage />} />
            {/* Member 4: Messaging Routes */}
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/messages/:id" element={<MessageDetailsPage />} />
            <Route path="/messages/send/:lostItemId" element={<SendMessagePage />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserList />} />
              <Route path="users/add" element={<AddUser />} />
              <Route path="users/:id/edit" element={<EditUser />} />
            </Route>
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/lost-items" replace />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
