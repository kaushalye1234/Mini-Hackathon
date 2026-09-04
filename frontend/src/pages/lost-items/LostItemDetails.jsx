import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  deleteLostItem,
  getLostItemById,
  resolveLostItem
} from "../../services/lostItemService";
import { sendMessage } from "../../services/messageService";
import { firstError, hasErrors, validateMessageForm } from "../../utils/validation";

const getId = (value) => value?.id || value?._id || value;
const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "Not set");

const LostItemDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadItem = async () => {
    try {
      setLoading(true);
      const data = await getLostItemById(id);
      setItem(data.lostItem);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Lost item could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItem();
  }, [id]);

  const owned = item ? getId(item.reportedBy) === getId(user) : false;
  const canMessageOwner = item && !owned && item.status === "LOST";

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${item.itemName}?`)) return;

    try {
      await deleteLostItem(id);
      navigate("/my-lost-items");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Lost item could not be deleted.");
    }
  };

  const handleResolve = async () => {
    try {
      const data = await resolveLostItem(id);
      setItem(data.lostItem);
      setNotice(data.message);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Lost item could not be resolved.");
    }
  };

  const handleMessageChange = (event) => {
    setMessageText(event.target.value);
    setFieldErrors({ ...fieldErrors, message: "" });
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    const validationErrors = validateMessageForm(messageText);
    if (hasErrors(validationErrors)) {
      setFieldErrors(validationErrors);
      setError(firstError(validationErrors));
      return;
    }

    try {
      setSubmitting(true);
      const data = await sendMessage({ lostItemId: id, message: messageText });
      setMessageText("");
      setNotice(data.notice);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Message could not be sent.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-message">Loading lost item...</div>;

  if (!item) {
    return (
      <section className="page-grid">
        {error && <div className="alert alert-error">{error}</div>}
        <Link className="button button-secondary" to="/lost-items">
          Back to Lost Items
        </Link>
      </section>
    );
  }

  return (
    <section className="page-grid details-grid">
      <article className="panel details-panel">
        {item.imageUrl && <img className="details-image" src={item.imageUrl} alt={item.itemName} />}
        <div className="item-card-title">
          <div>
            <p className="eyebrow">Lost item</p>
            <h1>{item.itemName}</h1>
          </div>
          <span className={`badge ${item.status === "LOST" ? "badge-success" : "badge-muted"}`}>
            {item.status}
          </span>
        </div>

        <dl className="details-list">
          <div>
            <dt>Category</dt>
            <dd>{item.category}</dd>
          </div>
          <div>
            <dt>Lost Location</dt>
            <dd>{item.lostLocation}</dd>
          </div>
          <div>
            <dt>Lost Date</dt>
            <dd>{formatDate(item.lostDate)}</dd>
          </div>
          <div>
            <dt>Reported By</dt>
            <dd>{item.reportedBy?.name || "CampusFind user"}</dd>
          </div>
        </dl>

        <div>
          <h2>Description</h2>
          <p className="muted">{item.description}</p>
        </div>

        <div className="form-actions">
          <Link className="button button-secondary" to="/lost-items">
            Back
          </Link>
          {owned && (
            <>
              <Link className="button" to={`/lost-items/${id}/edit`}>
                Edit
              </Link>
              <button className="danger-link" type="button" onClick={handleDelete}>
                Delete
              </button>
              {item.status !== "RESOLVED" && (
                <button className="text-link" type="button" onClick={handleResolve}>
                  Mark as Resolved
                </button>
              )}
            </>
          )}
        </div>
      </article>

      <aside className="panel form-panel side-panel">
        {notice && <div className="alert alert-success">{notice}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        {canMessageOwner ? (
          <form onSubmit={handleSendMessage} className="stacked-form" noValidate>
            <div>
              <p className="eyebrow">Message owner</p>
              <h2>Regarding: {item.itemName}</h2>
            </div>
            <label>
              Message
              <textarea
                className={fieldErrors.message ? "input-error" : ""}
                rows="6"
                value={messageText}
                onChange={handleMessageChange}
              />
              {fieldErrors.message && <span className="field-error">{fieldErrors.message}</span>}
            </label>
            <button className="button" type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        ) : owned ? (
          <p className="muted">This is your lost item post.</p>
        ) : (
          <p className="muted">This item has already been resolved.</p>
        )}
      </aside>
    </section>
  );
};

export default LostItemDetails;
