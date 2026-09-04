import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <Link className="brand" to={isAuthenticated ? "/profile" : "/login"}>
        User Management
      </Link>
      <nav className="nav-links">
        {isAuthenticated && <NavLink to="/profile">Profile</NavLink>}
        {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        {!isAuthenticated && <NavLink to="/login">Login</NavLink>}
        {!isAuthenticated && <NavLink to="/register">Register</NavLink>}
        {isAuthenticated && (
          <>
            <span className="nav-user">{user.name}</span>
            <button className="button button-ghost" type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
