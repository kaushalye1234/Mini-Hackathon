import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../../../services/userService";
import { firstError, hasErrors, validateAdminUserForm } from "../../../utils/validation";

const AddUser = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    isActive: true
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationErrors = validateAdminUserForm(form, { requirePassword: true });
    if (hasErrors(validationErrors)) {
      setFieldErrors(validationErrors);
      setError(firstError(validationErrors));
      return;
    }

    try {
      setLoading(true);
      await createUser(form);
      navigate("/admin/users", { state: { message: "User created successfully" } });
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Create user failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">Admin</p>
        <h1>Add User</h1>
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
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create User"}
          </button>
          <Link className="button button-secondary" to="/admin/users">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
};

export default AddUser;
