import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteLostItem, getMyLostItems, resolveLostItem } from "../../services/lostItemService";

const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "Not set");

const MyLostItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadItems = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyLostItems();
      setItems(data.lostItems);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Your lost items could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete ${item.itemName}?`)) return;

    try {
      await deleteLostItem(item.id || item._id);
      setMessage("Lost item deleted successfully.");
      loadItems();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Lost item could not be deleted.");
    }
  };

  const handleResolve = async (item) => {
    try {
      await resolveLostItem(item.id || item._id);
      setMessage("Lost item marked as resolved.");
      loadItems();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Lost item could not be resolved.");
    }
  };

  return (
    <section className="page-grid wide-page">
      <div className="row-heading">
        <div>
          <p className="eyebrow">Owner dashboard</p>
          <h1>My Lost Items</h1>
          <p className="muted">Manage the lost item reports created from your account.</p>
        </div>
        <Link className="button" to="/lost-items/report">
          Report Lost Item
        </Link>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div className="page-message">Loading your lost items...</div>}

      {!loading && items.length === 0 && (
        <div className="panel empty-state">
          <p>You have not reported any lost items yet.</p>
          <Link className="button" to="/lost-items/report">
            Report Lost Item
          </Link>
        </div>
      )}

      <div className="card-grid">
        {items.map((item) => {
          const itemId = item.id || item._id;

          return (
            <article className="item-card" key={itemId}>
              {item.imageUrl && <img src={item.imageUrl} alt={item.itemName} />}
              <div className="item-card-body">
                <div className="item-card-title">
                  <h2>{item.itemName}</h2>
                  <span className={`badge ${item.status === "LOST" ? "badge-success" : "badge-muted"}`}>
                    {item.status}
                  </span>
                </div>
                <dl className="meta-list">
                  <div>
                    <dt>Category</dt>
                    <dd>{item.category}</dd>
                  </div>
                  <div>
                    <dt>Location</dt>
                    <dd>{item.lostLocation}</dd>
                  </div>
                  <div>
                    <dt>Date</dt>
                    <dd>{formatDate(item.lostDate)}</dd>
                  </div>
                </dl>
                <div className="form-actions">
                  <Link className="button button-secondary" to={`/lost-items/${itemId}`}>
                    Open
                  </Link>
                  <Link className="text-link" to={`/lost-items/${itemId}/edit`}>
                    Edit
                  </Link>
                  <button className="danger-link" type="button" onClick={() => handleDelete(item)}>
                    Delete
                  </button>
                  {item.status !== "RESOLVED" && (
                    <button className="text-link" type="button" onClick={() => handleResolve(item)}>
                      Mark as Resolved
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default MyLostItems;
