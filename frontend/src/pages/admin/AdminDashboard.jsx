import { useEffect, useState } from "react";
import { getUserStats } from "../../services/userService";

const defaultStats = {
  totalUsers: 0,
  activeUsers: 0,
  inactiveUsers: 0,
  adminUsers: 0,
  normalUsers: 0
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getUserStats();
        setStats(data.stats);
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Could not load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const cards = [
    ["Total Users", stats.totalUsers],
    ["Active Users", stats.activeUsers],
    ["Inactive Users", stats.inactiveUsers],
    ["Admin Users", stats.adminUsers],
    ["Normal Users", stats.normalUsers]
  ];

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">Admin overview</p>
        <h1>Dashboard</h1>
      </div>
      {loading && <div className="page-message">Loading dashboard...</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {!loading && !error && (
        <div className="stats-grid">
          {cards.map(([label, value]) => (
            <article className="stat-card" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;
