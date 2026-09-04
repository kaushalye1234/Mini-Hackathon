import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { updateProfile } from "../../services/userService";
import { firstError, hasErrors, validateProfileForm } from "../../utils/validation";

const UserProfile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const validationErrors = validateProfileForm(form);
    if (hasErrors(validationErrors)) {
      setFieldErrors(validationErrors);
      setError(firstError(validationErrors));
      return;
    }

    try {
      setLoading(true);
      const data = await updateProfile(form);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage(data.message);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Profile update failed.");
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
      <form className="panel form-panel" onSubmit={handleSubmit} noValidate>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <label>
          Name
          <input
            className={fieldErrors.name ? "input-error" : ""}
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
        </label>
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
        <div className="read-row">
          <span>Role</span>
          <strong>{user?.role}</strong>
        </div>
        <div className="read-row">
          <span>Status</span>
          <strong>{user?.isActive ? "Active" : "Inactive"}</strong>
        </div>
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </section>
  );
};

export default UserProfile;
