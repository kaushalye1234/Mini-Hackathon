/**
 * ReportLostItemPage — Member 2
 * Form for authenticated users to report a new lost item.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLostItem } from "../../services/lostItemService";

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

const emptyForm = {
  itemName: "",
  category: "",
  location: "",
  dateLost: "",
  description: "",
  imageUrl: ""
};

const ReportLostItemPage = () => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      await createLostItem({
        itemName: form.itemName.trim(),
        category: form.category,
        location: form.location.trim(),
        dateLost: form.dateLost,
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim()
      });
      navigate("/my-lost-items");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to report item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page" style={{ maxWidth: 640 }}>
      <form className="panel form-panel" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Lost something?</p>
          <h1>Report a Lost Item</h1>
        </div>

        {error && <div className="alert alert-error" role="alert">{error}</div>}

        <label htmlFor="itemName">
          Item Name *
          <input
            id="itemName"
            name="itemName"
            type="text"
            placeholder="e.g. Laptop, Wallet, Student ID"
            value={form.itemName}
            onChange={handleChange}
            maxLength={100}
          />
        </label>

        <label htmlFor="category">
          Category *
          <select
            id="category"
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

        <label htmlFor="location">
          Where was it lost? *
          <input
            id="location"
            name="location"
            type="text"
            placeholder="e.g. Computing Lab, Library, Canteen"
            value={form.location}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="dateLost">
          Date Lost *
          <input
            id="dateLost"
            name="dateLost"
            type="date"
            max={new Date().toISOString().split("T")[0]}
            value={form.dateLost}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="Describe the item in detail — colour, brand, distinguishing marks..."
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

        <label htmlFor="imageUrl">
          Image URL <span className="muted" style={{ fontWeight: 400 }}>(optional)</span>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={form.imageUrl}
            onChange={handleChange}
          />
        </label>

        <div className="form-actions">
          <button className="button" type="submit" disabled={loading} id="submit-report-btn">
            {loading ? "Submitting..." : "Report Lost Item"}
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

export default ReportLostItemPage;
