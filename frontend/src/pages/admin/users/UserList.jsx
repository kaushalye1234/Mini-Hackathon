import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { deleteUser, getUsers } from "../../../services/userService";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ search: "", role: "", status: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getUsers(filters);
      setUsers(data.users);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
    loadUsers();
  }, []);

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  const applyFilters = (event) => {
    event.preventDefault();
    loadUsers();
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(`Delete ${user.name}? This action cannot be undone.`);
    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      const data = await deleteUser(user._id);
      setUsers((currentUsers) => currentUsers.filter((item) => item._id !== user._id));
      setMessage(data.message);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Delete failed");
    }
  };

  return (
    <section>
      <div className="page-heading row-heading">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>User Management</h1>
        </div>
        <Link className="button" to="/admin/users/add">
          Add User
        </Link>
      </div>

      <form className="filter-bar" onSubmit={applyFilters}>
        <input
          name="search"
          placeholder="Search name or email"
          value={filters.search}
          onChange={handleFilterChange}
        />
        <select name="role" value={filters.role} onChange={handleFilterChange}>
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="button button-secondary" type="submit">
          Apply
        </button>
      </form>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div className="page-message">Loading users...</div>}
      {!loading && !users.length && <div className="page-message">No users found.</div>}
      {!loading && users.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="badge">{user.role}</span>
                  </td>
                  <td>
                    <span className={user.isActive ? "badge badge-success" : "badge badge-muted"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <Link className="text-link" to={`/admin/users/${user._id}/edit`}>
                      Edit
                    </Link>
                    <button className="danger-link" type="button" onClick={() => handleDelete(user)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default UserList;
