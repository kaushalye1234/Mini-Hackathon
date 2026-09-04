import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const validate = (form) => {
  if (!form.name.trim()) return "Name is required";
  if (form.name.trim().length < 2) return "Name must be at least 2 characters long";
  if (!form.email.trim()) return "Email is required";
  if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Valid email is required";
  if (!form.password) return "Password is required";
  if (form.password.length < 6) return "Password must be at least 6 characters long";
  if (form.password !== form.confirmPassword) return "Passwords do not match";
  return "";
};

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

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
      await register({
        name: form.name,
        email: form.email,
        password: form.password
      });
      navigate("/profile");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="panel form-panel" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Create account</p>
          <h1>Register</h1>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} />
        </label>
        <label>
          Confirm Password
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </label>
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
        <p className="muted">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
