import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { categories, getLostItemById, updateLostItem } from "../../services/lostItemService";
import { firstError, hasErrors, todayInputValue, validateLostItemForm } from "../../utils/validation";

const getId = (value) => value?.id || value?._id || value;
const toDateInput = (date) => (date ? new Date(date).toISOString().slice(0, 10) : "");

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

const EditLostItem = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const data = await getLostItemById(id);
        const item = data.lostItem;

        if (getId(item.reportedBy) !== getId(user)) {
          setError("You can only edit your own lost items.");
          return;
        }

        setForm({
          itemName: item.itemName || "",
          category: item.category || "",
          description: item.description || "",
          lostLocation: item.lostLocation || "",
          lostDate: toDateInput(item.lostDate)
        });
        setCurrentImageUrl(item.imageUrl || "");
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Lost item could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id, user]);

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
      setSaving(true);
      await updateLostItem(id, buildLostItemFormData(form, imageFile));
      navigate(`/lost-items/${id}`);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Lost item could not be updated.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-message">Loading lost item...</div>;

  if (!form) {
    return (
      <section className="auth-page">
        <div className="panel form-panel">
          <div className="alert alert-error">{error}</div>
          <Link className="button button-secondary" to="/lost-items">
            Back to Lost Items
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <form className="panel form-panel" onSubmit={handleSubmit} noValidate>
        <div>
          <p className="eyebrow">Owner action</p>
          <h1>Edit Lost Item</h1>
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
          Replace Item Image optional
          <input
            accept="image/*"
            className={fieldErrors.image ? "input-error" : ""}
            name="image"
            type="file"
            onChange={handleImageChange}
          />
          {fieldErrors.image && <span className="field-error">{fieldErrors.image}</span>}
        </label>
        {(imagePreview || currentImageUrl) && (
          <div className="image-preview">
            <img src={imagePreview || currentImageUrl} alt="Lost item" />
          </div>
        )}
        <div className="form-actions">
          <button className="button" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link className="button button-secondary" to={`/lost-items/${id}`}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
};

export default EditLostItem;
