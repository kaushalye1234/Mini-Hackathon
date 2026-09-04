import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <section className="admin-shell">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <NavLink to="/admin" end>
          Dashboard
        </NavLink>
        <NavLink to="/admin/users">User Management</NavLink>
      </aside>
      <div className="admin-content">
        <Outlet />
      </div>
    </section>
  );
};

export default AdminLayout;
