import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../../../services/userService";

const validate = (form) => {
  if (!form.name.trim()) return "Name is required";
  if (form.name.trim().length < 2) return "Name must be at least 2 characters long";
  if (!form.email.trim()) return "Email is required";
  if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Valid email is required";
  if (!["admin", "user"].includes(form.role)) return "Role is required";
  return "";
};

const EditUser = () => {
  const [form, setForm] = useState({ name: "", email: "", role: "user", isActive: true });
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
      <form className="panel form-panel" onSubmit={handleSubmit}>
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
          Role
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <label className="checkbox-row">
          <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} />
          Active account
        </label>
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
