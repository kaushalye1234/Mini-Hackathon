import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  categories,
  deleteLostItem,
  getLostItems,
  resolveLostItem,
  statuses
} from "../../services/lostItemService";

const getId = (value) => value?.id || value?._id || value;
const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "Not set");
const isOwner = (item, user) => getId(item.reportedBy) === getId(user);

const initialFilters = { search: "", category: "", location: "", status: "LOST", lostDate: "" };

const LostItems = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState(initialFilters);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadItems = async (nextFilters = filters) => {
    try {
      setLoading(true);
      setError("");
      const params = Object.fromEntries(Object.entries(nextFilters).filter(([, value]) => value));
      const data = await getLostItems(params);
      setItems(data.lostItems);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Lost items could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems(initialFilters);
  }, []);

  const handleChange = (event) => {
    const nextFilters = { ...filters, [event.target.name]: event.target.value };
    setFilters(nextFilters);
    if (["category", "status", "lostDate"].includes(event.target.name)) {
      loadItems(nextFilters);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    loadItems(filters);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete ${item.itemName}?`)) return;

    try {
      await deleteLostItem(item.id || item._id);
      setMessage("Lost item deleted successfully.");
      loadItems(filters);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Lost item could not be deleted.");
    }
  };

  const handleResolve = async (item) => {
    try {
      await resolveLostItem(item.id || item._id);
      setMessage("Lost item marked as resolved.");
      loadItems(filters);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Lost item could not be resolved.");
    }
  };

  return (
    <section className="page-grid wide-page">
      <div className="row-heading">
        <div>
          <p className="eyebrow">Search reports</p>
          <h1>Lost Items</h1>
          <p className="muted">Find matching lost item posts and message the owner.</p>
        </div>
        <Link className="button" to="/lost-items/report">
          Report Lost Item
        </Link>
      </div>

      <form className="filter-bar lost-filter lost-search-panel" onSubmit={handleSubmit}>
        <label>
          Search
          <input
            name="search"
            placeholder="Search item name or description"
            value={filters.search}
            onChange={handleChange}
          />
        </label>
        <label>
          Category
          <select name="category" value={filters.category} onChange={handleChange}>
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label>
          Location
          <input
            name="location"
            placeholder="Filter by location"
            value={filters.location}
            onChange={handleChange}
          />
        </label>
        <label>
          Lost Date
          <input name="lostDate" type="date" value={filters.lostDate} onChange={handleChange} />
        </label>
        <label>
          Status
          <select name="status" value={filters.status} onChange={handleChange}>
            <option value="">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <button className="button" type="submit">
          Search
        </button>
      </form>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div className="page-message">Loading lost items...</div>}

      {!loading && items.length === 0 && <div className="panel empty-state">No lost items found.</div>}

      <div className="card-grid">
        {items.map((item) => {
          const owned = isOwner(item, user);
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
                <p className="muted item-description">{item.description}</p>
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
                <div className="form-actions item-actions">
                  <Link className="button button-secondary" to={`/lost-items/${itemId}`}>
                    View Details
                  </Link>
                  {owned ? (
                    <>
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
                    </>
                  ) : (
                    <Link className="text-link" to={`/lost-items/${itemId}`}>
                      Message Owner
                    </Link>
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

export default LostItems;
