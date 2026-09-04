/**
 * MyLostItemsPage — Member 2
 * Shows the authenticated user's own lost items.
 * Allows: Edit, Delete, Mark as Resolved.
 */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteLostItem,
  getMyLostItems,
  resolveLostItem
} from "../../services/lostItemService";

const MyLostItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(null); // holds item._id while action is in progress
  const navigate = useNavigate();

  const loadItems = () => {
    setLoading(true);
    setError("");
    getMyLostItems()
      .then((res) => setItems(res.data || []))
      .catch(() => setError("Failed to load your lost items. Please refresh."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item report?")) return;

    setActionError("");
    setActionLoading(id);

    try {
      await deleteLostItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (apiError) {
      setActionError(apiError.response?.data?.message || "Failed to delete item.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleResolve = async (id) => {
    if (!window.confirm("Mark this item as RESOLVED? This means you have received your item back.")) return;

    setActionError("");
    setActionLoading(id);

    try {
      const res = await resolveLostItem(id);
      // Update just this item in the list
      setItems((prev) =>
        prev.map((item) => (item._id === id ? res.data : item))
      );
    } catch (apiError) {
      setActionError(apiError.response?.data?.message || "Failed to mark item as resolved.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <p className="page-message">Loading your lost items...</p>;
  if (error) return <p className="page-message">{error}</p>;

  return (
    <div className="page-grid">
      {/* Header row */}
      <div className="row-heading">
        <div>
          <p className="eyebrow">My Reports</p>
          <h1>My Lost Items</h1>
        </div>
        <Link
          className="button"
          to="/report-lost-item"
          id="report-new-btn"
          style={{ alignSelf: "flex-start" }}
        >
          + Report Lost Item
        </Link>
      </div>

      {/* Global action error */}
      {actionError && (
        <div className="alert alert-error" role="alert">{actionError}</div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div className="panel form-panel" style={{ textAlign: "center" }}>
          <p className="muted">You have not reported any lost items yet.</p>
          <Link className="button" to="/report-lost-item" style={{ width: "fit-content", margin: "0 auto" }}>
            Report Your First Lost Item
          </Link>
        </div>
      )}

      {/* Item cards */}
      {items.map((item) => {
        const isResolved = item.status === "RESOLVED";
        const isBusy = actionLoading === item._id;

        return (
          <div key={item._id} className="panel form-panel">
            {/* Top row — title + status badge */}
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, alignItems: "flex-start" }}>
              <div>
                <h2 style={{ margin: 0 }}>{item.itemName}</h2>
                <p className="muted" style={{ margin: "4px 0 0" }}>
                  {item.category} &mdash; {item.location}
                </p>
                <p className="muted" style={{ margin: "4px 0 0", fontSize: 13 }}>
                  Lost: {new Date(item.dateLost).toLocaleDateString()}
                </p>
              </div>
              <span className={`badge ${isResolved ? "badge-success" : ""}`}>
                {item.status}
              </span>
            </div>

            {/* Image preview if provided */}
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.itemName}
                style={{
                  borderRadius: 6,
                  maxHeight: 200,
                  objectFit: "cover",
                  width: "100%"
                }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            )}

            {/* Description */}
            {item.description && (
              <p style={{ margin: 0, color: "#34413e" }}>{item.description}</p>
            )}

            {/* Actions */}
            <div className="form-actions">
              <Link
                className="button button-secondary"
                to={`/lost-items/${item._id}`}
                id={`view-btn-${item._id}`}
              >
                View
              </Link>

              {!isResolved && (
                <>
                  <button
                    className="button button-secondary"
                    type="button"
                    disabled={isBusy}
                    id={`edit-btn-${item._id}`}
                    onClick={() => navigate(`/lost-items/${item._id}/edit`)}
                  >
                    Edit
                  </button>

                  <button
                    className="button"
                    type="button"
                    disabled={isBusy}
                    id={`resolve-btn-${item._id}`}
                    onClick={() => handleResolve(item._id)}
                    style={{ background: "#17633a", borderColor: "#17633a" }}
                  >
                    {isBusy ? "..." : "Mark as Resolved"}
                  </button>
                </>
              )}

              <button
                className="danger-link"
                type="button"
                disabled={isBusy}
                id={`delete-btn-${item._id}`}
                onClick={() => handleDelete(item._id)}
              >
                {isBusy ? "..." : "Delete"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyLostItemsPage;
