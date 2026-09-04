/**
 * EditLostItemPage — Member 2
 * Pre-filled form for owner to edit their own lost item.
 */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getLostItemById, updateLostItem } from "../../services/lostItemService";

const CATEGORIES = [
  "Electronics",
  "Wallet / Purse",
  "ID / Documents",
  "Books",
  "Clothing",
  "Bags",
  "Keys",
  "Accessories",
  "Other"
];

const EditLostItemPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    itemName: "",
    category: "",
    location: "",
    dateLost: "",
    description: "",
    imageUrl: ""
  });

  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getLostItemById(id)
      .then((res) => {
        const item = res.data;

        // Only the owner (or admin) should be on this page
        const isOwner =
          user &&
          (item.reportedBy?._id?.toString() === user._id?.toString() ||
            item.reportedBy?.toString() === user._id?.toString());

        if (!isOwner && user?.role !== "admin") {
          navigate("/my-lost-items", { replace: true });
          return;
        }

        // Format dateLost to yyyy-MM-dd for the date input
        const dateStr = item.dateLost
          ? new Date(item.dateLost).toISOString().split("T")[0]
          : "";

        setForm({
          itemName: item.itemName || "",
          category: item.category || "",
          location: item.location || "",
          dateLost: dateStr,
          description: item.description || "",
          imageUrl: item.imageUrl || ""
        });
      })
      .catch(() => setLoadError("Could not load item. Please try again."))
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.itemName.trim()) return "Item name is required.";
    if (form.itemName.trim().length < 2) return "Item name must be at least 2 characters.";
    if (!form.category) return "Please select a category.";
    if (!form.location.trim()) return "Lost location is required.";
    if (!form.dateLost) return "Please enter a valid lost date.";
    if (new Date(form.dateLost) > new Date()) return "Lost date cannot be in the future.";
    if (form.description.trim().length > 1000) return "Description cannot exceed 1000 characters.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const validationError = validate();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    try {
      setSaving(true);
      await updateLostItem(id, {
        itemName: form.itemName.trim(),
        category: form.category,
        location: form.location.trim(),
        dateLost: form.dateLost,
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim()
      });
      navigate("/my-lost-items");
    } catch (apiError) {
      setSubmitError(apiError.response?.data?.message || "Failed to update item. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="page-message">Loading item...</p>;
  if (loadError) return <p className="page-message">{loadError}</p>;

  return (
    <section className="auth-page" style={{ maxWidth: 640 }}>
      <form className="panel form-panel" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Edit report</p>
          <h1>Edit Lost Item</h1>
        </div>

        {submitError && <div className="alert alert-error" role="alert">{submitError}</div>}

        <label htmlFor="edit-itemName">
          Item Name *
          <input
            id="edit-itemName"
            name="itemName"
            type="text"
            value={form.itemName}
            onChange={handleChange}
            maxLength={100}
          />
        </label>

        <label htmlFor="edit-category">
          Category *
          <select
            id="edit-category"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="">-- Select a category --</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <label htmlFor="edit-location">
          Where was it lost? *
          <input
            id="edit-location"
            name="location"
            type="text"
            value={form.location}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="edit-dateLost">
          Date Lost *
          <input
            id="edit-dateLost"
            name="dateLost"
            type="date"
            max={new Date().toISOString().split("T")[0]}
            value={form.dateLost}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="edit-description">
          Description
          <textarea
            id="edit-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            maxLength={1000}
            rows={4}
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
          <span className="muted" style={{ fontSize: 12, marginTop: 2 }}>
            {form.description.length}/1000 characters
          </span>
        </label>

        <label htmlFor="edit-imageUrl">
          Image URL <span className="muted" style={{ fontWeight: 400 }}>(optional)</span>
          <input
            id="edit-imageUrl"
            name="imageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={form.imageUrl}
            onChange={handleChange}
          />
        </label>

        <div className="form-actions">
          <button className="button" type="submit" disabled={saving} id="save-edit-btn">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            className="button button-secondary"
            type="button"
            onClick={() => navigate("/my-lost-items")}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditLostItemPage;
