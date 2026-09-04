import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const validate = (form) => {
  if (!form.email.trim()) return "Email is required";
  if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Valid email is required";
  if (!form.password) return "Password is required";
  return "";
};

const Login = () => {
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
      const requireAdmin = Boolean(fromPath?.startsWith("/admin"));
      const user = await login(form, { requireAdmin });
      const nextPath = fromPath || (user.role === "admin" ? "/admin" : "/profile");
      navigate(nextPath, { replace: true });
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="panel form-panel" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Secure access</p>
          <h1>Login</h1>
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
          {loading ? "Signing in..." : "Login"}
        </button>
        <p className="muted">
          Need an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
