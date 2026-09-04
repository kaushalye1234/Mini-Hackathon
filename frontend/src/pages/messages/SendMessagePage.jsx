import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sendMessage } from "../../services/messageService";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";

const SendMessagePage = () => {
  const { lostItemId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loadingItem, setLoadingItem] = useState(true);
  const [itemError, setItemError] = useState("");
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api.get(`/lost-items/${lostItemId}`)
      .then((r) => setItem(r.data.data))
      .catch(() => setItemError("Lost item not found"))
      .finally(() => setLoadingItem(false));
  }, [lostItemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!messageText.trim()) {
      setError("Message cannot be empty");
      return;
    }
    setSending(true);
    try {
      await sendMessage({ lostItemId, message: messageText.trim() });
      setSuccess("Message sent successfully!");
      setMessageText("");
      setTimeout(() => navigate("/messages?tab=sent"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loadingItem) return <p className="page-message">Loading…</p>;
  if (itemError) return <p className="page-message alert alert-error">{itemError}</p>;

  // Block if user is the owner
  if (item?.reportedBy?._id === user?._id || item?.reportedBy?._id?.toString() === user?._id?.toString()) {
    return (
      <div className="page-grid" style={{ maxWidth: 600 }}>
        <p className="alert alert-error">You cannot message yourself about your own lost item.</p>
      </div>
    );
  }

  return (
    <div className="page-grid" style={{ maxWidth: 600 }}>
      <div>
        <p className="eyebrow">Contact Owner</p>
        <h1 style={{ fontSize: 26 }}>Message Owner</h1>
      </div>

      <div className="panel form-panel" style={{ gap: 8 }}>
        <p style={{ margin: 0 }}>
          <strong>Regarding:</strong> {item?.itemName}
        </p>
        <p className="muted" style={{ margin: 0, fontSize: 13 }}>
          {item?.category} &mdash; {item?.location}
        </p>
      </div>

      <div className="panel form-panel">
        {error && <p className="alert alert-error">{error}</p>}
        {success && <p className="alert alert-success">{success}</p>}
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
          <label>
            Message
            <textarea
              rows={5}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              maxLength={1000}
              placeholder={`e.g. I found your ${item?.itemName} near the Computing Lab.`}
              required
              style={{
                background: "#fbfcfb",
                border: "1px solid #ccd6d0",
                borderRadius: 6,
                color: "#18201f",
                font: "inherit",
                padding: "10px 12px",
                resize: "vertical",
                width: "100%"
              }}
            />
          </label>
          <div className="form-actions">
            <button className="button" type="submit" disabled={sending}>
              {sending ? "Sending…" : "Send Message"}
            </button>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendMessagePage;
