import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const primaryLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/lost-items", label: "Lost Items" },
  { to: "/lost-items/report", label: "Report", cta: true }
];

const accountLinks = [
  { to: "/my-lost-items", label: "My Items" },
  { to: "/messages", label: "Messages" },
  { to: "/profile", label: "Profile" }
];

const getNavLinkClass = ({ isActive }, isCta = false) => {
  const classes = ["nav-link"];
  if (isCta) classes.push("nav-link-cta");
  if (isActive) classes.push("active");
  return classes.join(" ");
};

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <Link className="brand" to="/" aria-label="CampusFind LK home">
        <span className="brand-mark">CF</span>
        <span>CampusFind LK</span>
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        {isAuthenticated ? (
          <>
            <div className="nav-group nav-primary">
              {primaryLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={(state) => getNavLinkClass(state, link.cta)}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="nav-group nav-account">
              {accountLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className={getNavLinkClass}>
                  {link.label}
                </NavLink>
              ))}
              {isAdmin && (
                <NavLink to="/admin" className={getNavLinkClass}>
                  Admin
                </NavLink>
              )}
              <span className="nav-user" title={user.name}>
                {user.name}
              </span>
              <button className="button button-ghost nav-logout" type="button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="nav-group nav-account">
            <NavLink to="/login" className={getNavLinkClass}>
              Login
            </NavLink>
            <NavLink to="/admin/login" className={(state) => getNavLinkClass(state, true)}>
              Admin Login
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
