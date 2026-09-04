import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../../../services/userService";

const validate = (form) => {
  if (!form.name.trim()) return "Name is required";
  if (form.name.trim().length < 2) return "Name must be at least 2 characters long";
  if (!form.email.trim()) return "Email is required";
  if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Valid email is required";
  if (!form.password) return "Password is required";
  if (form.password.length < 6) return "Password must be at least 6 characters long";
  if (!["admin", "user"].includes(form.role)) return "Role is required";
  return "";
};

const AddUser = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    isActive: true
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} />
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
