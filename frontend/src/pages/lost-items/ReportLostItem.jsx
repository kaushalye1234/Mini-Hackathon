import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categories, createLostItem } from "../../services/lostItemService";
import { firstError, hasErrors, todayInputValue, validateLostItemForm } from "../../utils/validation";

const initialForm = {
  itemName: "",
  category: "",
  description: "",
  lostLocation: "",
  lostDate: ""
};

const buildLostItemFormData = (form, imageFile) => {
  const formData = new FormData();
  Object.entries(form).forEach(([key, value]) => {
    formData.append(key, value);
  });

  if (imageFile) {
    formData.append("image", imageFile);
  }

  return formData;
};

const ReportLostItem = () => {
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : "");
    setFieldErrors({ ...fieldErrors, image: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationErrors = validateLostItemForm(form, imageFile, categories);
    if (hasErrors(validationErrors)) {
      setFieldErrors(validationErrors);
      setError(firstError(validationErrors));
      return;
    }

    try {
      setLoading(true);
      const data = await createLostItem(buildLostItemFormData(form, imageFile));
      navigate(`/lost-items/${data.lostItem.id || data.lostItem._id}`);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Lost item could not be reported.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="panel form-panel" onSubmit={handleSubmit} noValidate>
        <div>
          <p className="eyebrow">New report</p>
          <h1>Report Lost Item</h1>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <label>
          Item Name
          <input
            className={fieldErrors.itemName ? "input-error" : ""}
            name="itemName"
            value={form.itemName}
            onChange={handleChange}
          />
          {fieldErrors.itemName && <span className="field-error">{fieldErrors.itemName}</span>}
        </label>
        <label>
          Category
          <select
            className={fieldErrors.category ? "input-error" : ""}
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {fieldErrors.category && <span className="field-error">{fieldErrors.category}</span>}
        </label>
        <label>
          Description
          <textarea
            className={fieldErrors.description ? "input-error" : ""}
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="5"
          />
          {fieldErrors.description && <span className="field-error">{fieldErrors.description}</span>}
        </label>
        <label>
          Lost Location
          <input
            className={fieldErrors.lostLocation ? "input-error" : ""}
            name="lostLocation"
            value={form.lostLocation}
            onChange={handleChange}
          />
          {fieldErrors.lostLocation && <span className="field-error">{fieldErrors.lostLocation}</span>}
        </label>
        <label>
          Lost Date
          <input
            className={fieldErrors.lostDate ? "input-error" : ""}
            max={todayInputValue()}
            name="lostDate"
            type="date"
            value={form.lostDate}
            onChange={handleChange}
          />
          {fieldErrors.lostDate && <span className="field-error">{fieldErrors.lostDate}</span>}
        </label>
        <label>
          Item Image optional
          <input
            accept="image/*"
            className={fieldErrors.image ? "input-error" : ""}
            name="image"
            type="file"
            onChange={handleImageChange}
          />
          {fieldErrors.image && <span className="field-error">{fieldErrors.image}</span>}
        </label>
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Selected lost item" />
          </div>
        )}
        <div className="form-actions">
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Report Lost Item"}
          </button>
          <Link className="button button-secondary" to="/lost-items">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
};

export default ReportLostItem;
