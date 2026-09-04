import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getMessageById, markMessageRead, replyToMessage } from "../../services/messageService";
import { firstError, hasErrors, validateMessageForm } from "../../utils/validation";

const getId = (value) => value?.id || value?._id || value;
const formatDateTime = (date) => (date ? new Date(date).toLocaleString() : "Not set");

const MessageDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [message, setMessage] = useState(null);
  const [reply, setReply] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadMessage = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMessageById(id);
      let loadedMessage = data.message;

      if (getId(loadedMessage.receiver) === getId(user) && !loadedMessage.isRead) {
        const readData = await markMessageRead(id);
        loadedMessage = readData.message;
      }

      setMessage(loadedMessage);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Message could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessage();
  }, [id, user]);

  const handleReplyChange = (event) => {
    setReply(event.target.value);
    setFieldErrors({ ...fieldErrors, message: "" });
  };

  const handleReply = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    const validationErrors = validateMessageForm(reply);
    if (hasErrors(validationErrors)) {
      setFieldErrors(validationErrors);
      setError(firstError(validationErrors));
      return;
    }

    try {
      setSubmitting(true);
      const data = await replyToMessage(id, { message: reply });
      setReply("");
      setNotice(data.notice);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Reply could not be sent.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-message">Loading message...</div>;

  if (!message) {
    return (
      <section className="page-grid">
        {error && <div className="alert alert-error">{error}</div>}
        <Link className="button button-secondary" to="/messages">
          Back to Messages
        </Link>
      </section>
    );
  }

  return (
    <section className="page-grid details-grid">
      <article className="panel details-panel">
        <div>
          <p className="eyebrow">Message</p>
          <h1>Regarding: {message.lostItem?.itemName || "Lost item"}</h1>
          <p className="muted">{formatDateTime(message.createdAt)}</p>
        </div>

        <dl className="details-list">
          <div>
            <dt>From</dt>
            <dd>{message.sender?.name || "CampusFind user"}</dd>
          </div>
          <div>
            <dt>To</dt>
            <dd>{message.receiver?.name || "CampusFind user"}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{message.isRead ? "Read" : "Unread"}</dd>
          </div>
        </dl>

        <div className="message-body">
          <p>{message.message}</p>
        </div>

        <div className="form-actions">
          <Link className="button button-secondary" to="/messages">
            Back
          </Link>
          {message.lostItem && (
            <Link className="text-link" to={`/lost-items/${getId(message.lostItem)}`}>
              Open Lost Item
            </Link>
          )}
        </div>
      </article>

      <aside className="panel form-panel side-panel">
        <form className="stacked-form" onSubmit={handleReply} noValidate>
          <div>
            <p className="eyebrow">Reply</p>
            <h2>Send a reply</h2>
          </div>
          {notice && <div className="alert alert-success">{notice}</div>}
          {error && <div className="alert alert-error">{error}</div>}
          <label>
            Message
            <textarea
              className={fieldErrors.message ? "input-error" : ""}
              rows="6"
              value={reply}
              onChange={handleReplyChange}
            />
            {fieldErrors.message && <span className="field-error">{fieldErrors.message}</span>}
          </label>
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Send Reply"}
          </button>
        </form>
      </aside>
    </section>
  );
};

export default MessageDetails;
