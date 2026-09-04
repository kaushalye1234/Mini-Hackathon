/**
 * LostItemDetailsPage — Member 3 owns this file.
 * This stub includes the [Message Owner] button integration (Member 4 scope).
 * Member 3 should extend this with full details UI without removing the Message Owner button.
 */
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import api from "../../services/api";

const LostItemDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/lost-items/${id}`)
      .then((r) => setItem(r.data.data))
      .catch(() => setError("Lost item not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="page-message">Loading…</p>;
  if (error) return <p className="page-message">{error}</p>;
  if (!item) return null;

  const isOwner = user && (
    item.reportedBy?._id === user._id ||
    item.reportedBy?._id?.toString() === user._id?.toString()
  );

  return (
    <div className="page-grid" style={{ maxWidth: 720 }}>
      <div>
        <Link to="/lost-items" className="muted" style={{ fontSize: 13, textDecoration: "none" }}>← Back to Lost Items</Link>
        <p className="eyebrow" style={{ marginTop: 12 }}>{item.category}</p>
        <h1>{item.itemName}</h1>
        <p className="muted">{item.location}</p>
      </div>

      <div className="panel form-panel">
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div>
            <p style={{ margin: 0 }}><strong>Status:</strong> <span className={`badge ${item.status === "RESOLVED" ? "badge-success" : ""}`}>{item.status}</span></p>
            <p style={{ margin: "8px 0 0" }}><strong>Reported by:</strong> {item.reportedBy?.name}</p>
            <p style={{ margin: "8px 0 0" }}><strong>Date Lost:</strong> {new Date(item.dateLost).toLocaleDateString()}</p>
          </div>
        </div>

        {item.description && (
          <p style={{ margin: 0 }}><strong>Description:</strong> {item.description}</p>
        )}
      </div>

      {/* ── Member 4 integration: Message Owner button ── */}
      {!isOwner && item.status !== "RESOLVED" && (
        isAuthenticated ? (
          <button
            className="button"
            style={{ width: "fit-content" }}
            onClick={() => navigate(`/messages/send/${item._id}`)}
          >
            Message Owner
          </button>
        ) : (
          <Link
            className="button"
            style={{ width: "fit-content" }}
            to="/login"
            state={{ from: `/lost-items/${id}` }}
          >
            Login to Message Owner
          </Link>
        )
      )}
      {isOwner && (
        <p className="muted" style={{ fontSize: 13 }}>This is your lost item post.</p>
      )}
    </div>
  );
};

export default LostItemDetailsPage;
