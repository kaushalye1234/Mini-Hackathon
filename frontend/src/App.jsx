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

const App = () => {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/profile" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfile />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserList />} />
              <Route path="users/add" element={<AddUser />} />
              <Route path="users/:id/edit" element={<EditUser />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/profile" replace />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
