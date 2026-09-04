import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getInbox, getSent } from "../../services/messageService";

const formatDateTime = (date) => (date ? new Date(date).toLocaleString() : "Not set");
const preview = (value) => (value.length > 120 ? `${value.slice(0, 120)}...` : value);

const Messages = () => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");
      const [inboxData, sentData] = await Promise.all([getInbox(), getSent()]);
      setInbox(inboxData.messages);
      setSent(sentData.messages);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Messages could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const messages = activeTab === "inbox" ? inbox : sent;

  return (
    <section className="page-grid wide-page">
      <div className="row-heading">
        <div>
          <p className="eyebrow">Contact owners</p>
          <h1>Messages</h1>
          <p className="muted">Read received messages, check sent messages, and reply.</p>
        </div>
        <div className="tabs" role="tablist" aria-label="Message folders">
          <button
            className={activeTab === "inbox" ? "tab active" : "tab"}
            type="button"
            onClick={() => setActiveTab("inbox")}
          >
            Inbox ({inbox.filter((message) => !message.isRead).length})
          </button>
          <button
            className={activeTab === "sent" ? "tab active" : "tab"}
            type="button"
            onClick={() => setActiveTab("sent")}
          >
            Sent
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div className="page-message">Loading messages...</div>}
      {!loading && messages.length === 0 && <div className="panel empty-state">No messages found.</div>}

      <div className="message-list">
        {messages.map((message) => {
          const messageId = message.id || message._id;
          const person = activeTab === "inbox" ? message.sender : message.receiver;

          return (
            <article className={`message-card ${!message.isRead && activeTab === "inbox" ? "unread" : ""}`} key={messageId}>
              <div>
                <div className="message-title">
                  <h2>{activeTab === "inbox" ? "From" : "To"}: {person?.name || "CampusFind user"}</h2>
                  {!message.isRead && activeTab === "inbox" && <span className="badge badge-success">Unread</span>}
                </div>
                <p className="muted">Regarding: {message.lostItem?.itemName || "Lost item"}</p>
                <p>{preview(message.message)}</p>
                <p className="muted">{formatDateTime(message.createdAt)}</p>
              </div>
              <Link className="button button-secondary" to={`/messages/${messageId}`}>
                Open
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Messages;
