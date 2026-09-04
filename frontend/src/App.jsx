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
import Home from "./pages/Home";
import EditLostItem from "./pages/lost-items/EditLostItem";
import LostItemDetails from "./pages/lost-items/LostItemDetails";
import LostItems from "./pages/lost-items/LostItems";
import MyLostItems from "./pages/lost-items/MyLostItems";
import ReportLostItem from "./pages/lost-items/ReportLostItem";
import MessageDetails from "./pages/messages/MessageDetails";
import Messages from "./pages/messages/Messages";
import UserProfile from "./pages/users/UserProfile";

const App = () => {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<Login isAdminLogin />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/lost-items" element={<LostItems />} />
            <Route path="/lost-items/report" element={<ReportLostItem />} />
            <Route path="/lost-items/:id" element={<LostItemDetails />} />
            <Route path="/lost-items/:id/edit" element={<EditLostItem />} />
            <Route path="/my-lost-items" element={<MyLostItems />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:id" element={<MessageDetails />} />
          </Route>

          <Route
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
                unauthenticatedTo="/admin/login"
                unauthorizedTo="/profile"
              />
            }
          >
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserList />} />
              <Route path="users/add" element={<AddUser />} />
              <Route path="users/:id/edit" element={<EditUser />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
