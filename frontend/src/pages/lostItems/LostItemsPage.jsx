/**
 * LostItemsPage — Member 3 owns this file.
 * This is a minimal stub to keep the app routing functional.
 * Member 3 should replace/extend this with full search & filter UI.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const LostItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/lost-items")
      .then((r) => setItems(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="page-message">Loading lost items…</p>;

  return (
    <div className="page-grid">
      <div>
        <p className="eyebrow">Browse</p>
        <h1>Lost Items</h1>
      </div>
      {items.length === 0 && <p className="muted">No items found.</p>}
      {items.map((item) => (
        <div key={item._id} className="panel form-panel">
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div>
              <h2 style={{ margin: 0 }}>{item.itemName}</h2>
              <p className="muted" style={{ margin: "4px 0 0" }}>{item.category} &mdash; {item.location}</p>
            </div>
            <span className={`badge ${item.status === "RESOLVED" ? "badge-success" : ""}`}>{item.status}</span>
          </div>
          <Link className="button button-secondary" style={{ width: "fit-content" }} to={`/lost-items/${item._id}`}>
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default LostItemsPage;
