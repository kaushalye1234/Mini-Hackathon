import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { updateProfile } from "../../services/userService";

const validate = (form) => {
  if (!form.name.trim()) return "Name is required";
  if (form.name.trim().length < 2) return "Name must be at least 2 characters long";
  if (!form.email.trim()) return "Email is required";
  if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Valid email is required";
  return "";
};

const UserProfile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const validationError = validate(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const data = await updateProfile(form);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage(data.message);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-grid">
      <div className="page-heading">
        <p className="eyebrow">Account</p>
        <h1>Profile</h1>
        <p className="muted">View and update your basic account details.</p>
      </div>
      <form className="panel form-panel" onSubmit={handleSubmit}>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <div className="read-row">
          <span>Role</span>
          <strong>{user.role}</strong>
        </div>
        <div className="read-row">
          <span>Status</span>
          <strong>{user.isActive ? "Active" : "Inactive"}</strong>
        </div>
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </section>
  );
};

export default UserProfile;
