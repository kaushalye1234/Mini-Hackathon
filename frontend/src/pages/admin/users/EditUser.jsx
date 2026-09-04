import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../../../services/userService";
import { firstError, hasErrors, validateAdminUserForm } from "../../../utils/validation";

const EditUser = () => {
  const [form, setForm] = useState({ name: "", email: "", role: "user", isActive: true });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getUserById(id);
        setForm({
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          isActive: data.user.isActive
        });
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Could not load user");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationErrors = validateAdminUserForm(form);
    if (hasErrors(validationErrors)) {
      setFieldErrors(validationErrors);
      setError(firstError(validationErrors));
      return;
    }

    try {
      setSaving(true);
      await updateUser(id, form);
      navigate("/admin/users");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Update user failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="page-message">Loading user...</div>;
  }

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">Admin</p>
        <h1>Edit User</h1>
      </div>
      <form className="panel form-panel" onSubmit={handleSubmit} noValidate>
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
        <label>
          Role
          <select
            className={fieldErrors.role ? "input-error" : ""}
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {fieldErrors.role && <span className="field-error">{fieldErrors.role}</span>}
        </label>
        <label className="checkbox-row">
          <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} />
          Active account
        </label>
        {fieldErrors.isActive && <span className="field-error">{fieldErrors.isActive}</span>}
        <div className="form-actions">
          <button className="button" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save User"}
          </button>
          <Link className="button button-secondary" to="/admin/users">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
};

export default EditUser;
