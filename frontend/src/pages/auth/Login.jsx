import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const validate = (form) => {
  if (!form.email.trim()) return "Email is required.";
  if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email address.";
  if (!form.password) return "Password is required.";
  return "";
};

const Login = ({ isAdminLogin = false }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validate(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const fromPath = location.state?.from?.pathname;
      const user = await login(form, { requireAdmin: isAdminLogin });
      const fallbackPath = isAdminLogin || user.role === "admin" ? "/admin" : "/profile";
      const nextPath = fromPath || fallbackPath;
      navigate(nextPath, { replace: true });
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="panel form-panel" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">{isAdminLogin ? "Admin access" : "Secure access"}</p>
          <h1>{isAdminLogin ? "Admin Login" : "Login"}</h1>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} />
        </label>
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Signing in..." : isAdminLogin ? "Admin Login" : "Login"}
        </button>
        {isAdminLogin ? (
          <p className="muted">
            Normal user? <Link to="/login">Login here</Link>
          </p>
        ) : (
          <p className="muted">
            Need an account? <Link to="/register">Register</Link>
          </p>
        )}
      </form>
    </section>
  );
};

export default Login;
