import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getMessageById, replyToMessage } from "../../services/messageService";

const MessageDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [replyError, setReplyError] = useState("");
  const [replySuccess, setReplySuccess] = useState("");

  useEffect(() => {
    getMessageById(id)
      .then((data) => setMsg(data.data))
      .catch((err) => setError(err.response?.data?.message || "Message not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    setReplyError("");
    setReplySuccess("");
    if (!replyText.trim()) {
      setReplyError("Message cannot be empty");
      return;
    }
    setReplying(true);
    try {
      await replyToMessage(id, replyText.trim());
      setReplySuccess("Reply sent successfully!");
      setReplyText("");
    } catch (err) {
      setReplyError(err.response?.data?.message || "Failed to send reply");
    } finally {
      setReplying(false);
    }
  };

  if (loading) return <p className="page-message">Loading…</p>;
  if (error) return (
    <div className="page-grid" style={{ maxWidth: 700 }}>
      <p className="alert alert-error">{error}</p>
      <Link to="/messages" className="button button-secondary" style={{ width: "fit-content" }}>← Back</Link>
    </div>
  );

  const isReceiver = msg.receiver?._id === user?._id || msg.receiver?._id?.toString() === user?._id?.toString();
  const otherPerson = isReceiver ? msg.sender : msg.receiver;

  return (
    <div className="page-grid" style={{ maxWidth: 700 }}>
      <div>
        <p className="eyebrow">Message</p>
        <h1 style={{ fontSize: 24 }}>Regarding: {msg.lostItem?.itemName}</h1>
      </div>

      {/* Message card */}
      <div className="panel form-panel">
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div>
            <p style={{ margin: 0 }}><strong>From:</strong> {msg.sender?.name}</p>
            <p style={{ margin: "4px 0 0" }}><strong>To:</strong> {msg.receiver?.name}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span className={`badge ${msg.isRead ? "badge-muted" : "badge-success"}`}>
              {msg.isRead ? "Read" : "Unread"}
            </span>
            <p className="muted" style={{ fontSize: 13, margin: "4px 0 0" }}>
              {new Date(msg.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #e5ebe6", margin: "4px 0" }} />

        <p style={{ margin: 0, lineHeight: 1.7, wordBreak: "break-word" }}>{msg.message}</p>

        <p className="muted" style={{ margin: 0, fontSize: 13 }}>
          Lost Item: <Link to={`/lost-items/${msg.lostItem?._id}`} style={{ color: "#0f766e" }}>
            {msg.lostItem?.itemName}
          </Link> &mdash; {msg.lostItem?.category}
        </p>
      </div>

      {/* Reply form */}
      <div className="panel form-panel">
        <h2 style={{ fontSize: 16, margin: 0 }}>Reply to {otherPerson?.name}</h2>
        {replyError && <p className="alert alert-error">{replyError}</p>}
        {replySuccess && <p className="alert alert-success">{replySuccess}</p>}
        <form onSubmit={handleReply} style={{ display: "grid", gap: 12 }}>
          <label>
            Message
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              maxLength={1000}
              placeholder="Type your reply…"
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
            <button className="button" type="submit" disabled={replying}>
              {replying ? "Sending…" : "Send Reply"}
            </button>
            <Link to="/messages" className="button button-secondary">← Back to Messages</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageDetailsPage;
