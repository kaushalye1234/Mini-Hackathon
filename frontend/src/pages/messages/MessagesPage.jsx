import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getInbox, getSent } from "../../services/messageService";

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const MessagesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "inbox";
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    const fetch = tab === "inbox" ? getInbox : getSent;
    fetch()
      .then((data) => setMessages(data.data || []))
      .catch(() => setError("Failed to load messages"))
      .finally(() => setLoading(false));
  }, [tab]);

  const unreadCount = messages.filter((m) => !m.isRead && tab === "inbox").length;

  return (
    <div className="page-grid" style={{ maxWidth: 700 }}>
      <div>
        <p className="eyebrow">Messaging</p>
        <h1>Messages {unreadCount > 0 && <span className="badge" style={{ fontSize: 16 }}>{unreadCount}</span>}</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          className={`button ${tab === "inbox" ? "" : "button-secondary"}`}
          onClick={() => setSearchParams({ tab: "inbox" })}
        >
          Inbox
        </button>
        <button
          className={`button ${tab === "sent" ? "" : "button-secondary"}`}
          onClick={() => setSearchParams({ tab: "sent" })}
        >
          Sent
        </button>
      </div>

      {loading && <p className="page-message">Loading…</p>}
      {error && <p className="alert alert-error">{error}</p>}

      {!loading && !error && messages.length === 0 && (
        <div className="panel form-panel">
          <p className="muted" style={{ margin: 0 }}>No messages yet.</p>
        </div>
      )}

      {!loading && messages.map((msg) => (
        <div
          key={msg._id}
          className="panel form-panel"
          style={{
            borderLeft: tab === "inbox" && !msg.isRead ? "4px solid #0f766e" : undefined,
            gap: 10
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
            <div>
              {tab === "inbox" ? (
                <span style={{ fontWeight: 700 }}>From: {msg.sender?.name}</span>
              ) : (
                <span style={{ fontWeight: 700 }}>To: {msg.receiver?.name}</span>
              )}
              {tab === "inbox" && !msg.isRead && (
                <span className="badge badge-success" style={{ marginLeft: 8 }}>New</span>
              )}
            </div>
            <span className="muted" style={{ fontSize: 13, margin: 0 }}>{timeAgo(msg.createdAt)}</span>
          </div>

          <p style={{ margin: 0, color: "#596360", fontSize: 13 }}>
            Regarding: <strong>{msg.lostItem?.itemName}</strong>
          </p>

          <p style={{ margin: 0, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
            "{msg.message}"
          </p>

          <Link className="button button-secondary" style={{ width: "fit-content" }} to={`/messages/${msg._id}`}>
            Open
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MessagesPage;
