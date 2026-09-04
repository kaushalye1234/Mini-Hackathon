import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { categories, getLostItemById, updateLostItem } from "../../services/lostItemService";

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

const EditLostItem = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
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
      <form className="panel form-panel" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Owner action</p>
          <h1>Edit Lost Item</h1>
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
          Replace Item Image optional
          <input accept="image/*" name="image" type="file" onChange={handleImageChange} />
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
