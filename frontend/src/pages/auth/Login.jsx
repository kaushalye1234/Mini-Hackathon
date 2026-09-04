import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { firstError, hasErrors, validateLoginForm } from "../../utils/validation";

const Login = ({ isAdminLogin = false }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationErrors = validateLoginForm(form);
    if (hasErrors(validationErrors)) {
      setFieldErrors(validationErrors);
      setError(firstError(validationErrors));
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
      setError(apiError.response?.data?.message || "Wrong credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="panel form-panel" onSubmit={handleSubmit} noValidate>
        <div>
          <p className="eyebrow">{isAdminLogin ? "Admin access" : "Secure access"}</p>
          <h1>{isAdminLogin ? "Admin Login" : "Login"}</h1>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <label>
          Email
          <input
            className={fieldErrors.email ? "input-error" : ""}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
        </label>
        <label>
          Password
          <input
            className={fieldErrors.password ? "input-error" : ""}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
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
