import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categories, createLostItem } from "../../services/lostItemService";

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

const validateImage = (file) => {
  if (!file) return "";
  if (!file.type.startsWith("image/")) return "Please upload an image file.";
  if (file.size > 5 * 1024 * 1024) return "Image cannot exceed 5 MB.";
  return "";
};

const validate = (form, imageFile) => {
  if (!form.itemName.trim()) return "Item name is required.";
  if (form.itemName.trim().length < 2) return "Item name must be at least 2 characters long.";
  if (!form.category) return "Please select a category.";
  if (!form.description.trim()) return "Description is required.";
  if (form.description.trim().length > 600) return "Description cannot exceed the allowed length.";
  if (!form.lostLocation.trim()) return "Lost location is required.";
  if (!form.lostDate || Number.isNaN(Date.parse(form.lostDate))) {
    return "Please enter a valid lost date.";
  }
  return validateImage(imageFile);
};

const ReportLostItem = () => {
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validate(form, imageFile);
    if (validationError) {
      setError(validationError);
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
      <form className="panel form-panel" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">New report</p>
          <h1>Report Lost Item</h1>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <label>
          Item Name
          <input name="itemName" value={form.itemName} onChange={handleChange} />
        </label>
        <label>
          Category
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label>
          Description
          <textarea name="description" value={form.description} onChange={handleChange} rows="5" />
        </label>
        <label>
          Lost Location
          <input name="lostLocation" value={form.lostLocation} onChange={handleChange} />
        </label>
        <label>
          Lost Date
          <input name="lostDate" type="date" value={form.lostDate} onChange={handleChange} />
        </label>
        <label>
          Item Image optional
          <input accept="image/*" name="image" type="file" onChange={handleImageChange} />
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
