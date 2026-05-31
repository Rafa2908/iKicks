import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import "./ProductForm.css";

const AVAILABLE_SIZES = [
  6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14,
];
const BRANDS = [
  "Jordan",
  "Nike",
  "Adidas",
  "New Balance",
  "Puma",
  "Reebok",
  "Converse",
  "Vans",
  "Asics",
  "Saucony",
];
const CATEGORIES = [
  "Basketball",
  "Running",
  "Lifestyle",
  "Training",
  "Skateboarding",
  "Tennis",
  "Golf",
];

const ProductForm = ({ submitFunction, initialState, isUpdate, onCancel }) => {
  const [formData, setFormData] = useState(initialState);
  const [previews, setPreviews] = useState(
    initialState.images.map((img) => (typeof img === "string" && img ? img : null)),
  );
  const [errors, setErrors] = useState({});
  const previewsRef = useRef(previews);
  previewsRef.current = previews;

  const updateMode = isUpdate;
  const navigate = useNavigate();

  const revokeBlob = (url) => {
    if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
  };

  useEffect(() => {
    return () => previewsRef.current.forEach(revokeBlob);
  }, []);

  const handleField = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImage = (index, file) => {
    setFormData((prev) => {
      const images = [...prev.images];
      images[index] = file;
      return { ...prev, images };
    });
    setPreviews((prev) => {
      revokeBlob(prev[index]);
      const next = [...prev];
      next[index] = URL.createObjectURL(file);
      return next;
    });
    if (errors.images) setErrors((prev) => ({ ...prev, images: "" }));
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const images = [...prev.images];
      images[index] = null;
      return { ...prev, images };
    });
    setPreviews((prev) => {
      revokeBlob(prev[index]);
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const toggleSize = (key) => {
    setFormData((prev) => {
      const sizes = { ...prev.sizes };
      if (key in sizes) {
        delete sizes[key];
      } else {
        sizes[key] = 1;
      }
      return { ...prev, sizes };
    });
    if (errors.sizes) setErrors((prev) => ({ ...prev, sizes: "" }));
  };

  const handleSizeQty = (key, qty) => {
    setFormData((prev) => ({
      ...prev,
      sizes: { ...prev.sizes, [key]: Math.max(1, parseInt(qty) || 1) },
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required.";
    if (!formData.brand) errs.brand = "Brand is required.";
    if (!formData.category) errs.category = "Category is required.";
    if (!formData.price || Number(formData.price) <= 0)
      errs.price = "Valid price is required.";
    if (!formData.images.some(Boolean))
      errs.images = "At least one image is required.";
    if (Object.keys(formData.sizes).length === 0)
      errs.sizes = "Select at least one size.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {
      name: formData.name,
      brand: formData.brand,
      colorway: formData.colorway,
      category: formData.category,
      description: formData.description,
      price: Number(formData.price),
      images: formData.images.filter(Boolean),
      sizes: Object.entries(formData.sizes).map(([size, quantity]) => ({
        size: Number(size),
        quantity,
      })),
    };

    try {
      await submitFunction(payload);
      navigate("/admin");
    } catch (err) {
      console.error(err);
    }
  };

  const checkedSizes = AVAILABLE_SIZES.filter(
    (s) => String(s) in formData.sizes,
  );

  return (
    <div className="pf-wrapper">
      <div className="pf-card">
        <div className="pf-header">
          <h1 className="pf-title">
            {updateMode ? "Update Product" : "Add New Product"}
          </h1>
          <p className="pf-sub">
            Fill in the details below to {updateMode ? "update" : "list"} a
            sneaker.
          </p>
        </div>

        <form className="pf-form" onSubmit={handleSubmit}>
          {/* ── Basic Info ─────────────────────────────────── */}
          <div className="pf-section">
            <h2 className="pf-section-title">Basic Info</h2>
            <div className="pf-grid-2">
              <div className="pf-field">
                <label className="pf-label">Name *</label>
                <input
                  className={`pf-input${errors.name ? " pf-input-error" : ""}`}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleField}
                  placeholder="e.g. Air Jordan 1 Retro High OG"
                />
                {errors.name && <span className="pf-error">{errors.name}</span>}
              </div>

              <div className="pf-field">
                <label className="pf-label">Brand *</label>
                <select
                  className={`pf-input${errors.brand ? " pf-input-error" : ""}`}
                  name="brand"
                  value={formData.brand}
                  onChange={handleField}
                >
                  <option value="">Select brand…</option>
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                {errors.brand && (
                  <span className="pf-error">{errors.brand}</span>
                )}
              </div>

              <div className="pf-field">
                <label className="pf-label">Colorway</label>
                <input
                  className="pf-input"
                  type="text"
                  name="colorway"
                  value={formData.colorway}
                  onChange={handleField}
                  placeholder="e.g. Chicago Lost and Found"
                />
              </div>

              <div className="pf-field">
                <label className="pf-label">Category *</label>
                <select
                  className={`pf-input${errors.category ? " pf-input-error" : ""}`}
                  name="category"
                  value={formData.category}
                  onChange={handleField}
                >
                  <option value="">Select category…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className="pf-error">{errors.category}</span>
                )}
              </div>
            </div>
          </div>

          {/* ── Details ────────────────────────────────────── */}
          <div className="pf-section">
            <h2 className="pf-section-title">Details</h2>

            <div className="pf-field">
              <label className="pf-label">Description</label>
              <textarea
                className="pf-input pf-textarea"
                name="description"
                value={formData.description}
                onChange={handleField}
                placeholder="Describe the sneaker…"
                rows={4}
              />
            </div>

            <div className="pf-field pf-field-sm">
              <label className="pf-label">Price (RD$) *</label>
              <input
                className={`pf-input${errors.price ? " pf-input-error" : ""}`}
                type="number"
                name="price"
                value={formData.price}
                onChange={handleField}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.price && <span className="pf-error">{errors.price}</span>}
            </div>
          </div>

          {/* ── Images ─────────────────────────────────────── */}
          <div className="pf-section">
            <h2 className="pf-section-title">
              Images <span className="pf-section-note">up to 4 photos</span>
            </h2>
            {errors.images && (
              <span className="pf-error pf-error-block">{errors.images}</span>
            )}
            <div className="pf-images-grid">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="pf-image-slot">
                  {previews[i] ? (
                    <>
                      <img
                        className="pf-image-preview"
                        src={previews[i]}
                        alt={`Preview ${i + 1}`}
                      />
                      <button
                        type="button"
                        className="pf-image-remove"
                        onClick={() => removeImage(i)}
                        aria-label="Remove image"
                      >
                        <i className="fa-solid fa-xmark" />
                      </button>
                    </>
                  ) : (
                    <label className="pf-image-upload-label">
                      <input
                        type="file"
                        accept="image/*"
                        className="pf-image-input"
                        onChange={(e) =>
                          e.target.files[0] && handleImage(i, e.target.files[0])
                        }
                      />
                      <div className="pf-image-placeholder">
                        <i className="fa-solid fa-image" />
                        <span>Photo {i + 1}</span>
                      </div>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Sizes & Inventory ──────────────────────────── */}
          <div className="pf-section">
            <h2 className="pf-section-title">Sizes &amp; Inventory</h2>
            <p className="pf-section-desc">
              Check every size you carry, then set the quantity.
            </p>
            {errors.sizes && (
              <span className="pf-error pf-error-block">{errors.sizes}</span>
            )}

            <div className="pf-sizes-grid">
              {AVAILABLE_SIZES.map((size) => {
                const key = String(size);
                const checked = key in formData.sizes;
                return (
                  <label
                    key={size}
                    className={`pf-size-chip${checked ? " pf-size-chip-active" : ""}`}
                  >
                    <input
                      type="checkbox"
                      className="pf-size-checkbox"
                      checked={checked}
                      onChange={() => toggleSize(key)}
                    />
                    <span className="pf-size-label">US {size}</span>
                  </label>
                );
              })}
            </div>

            {checkedSizes.length > 0 && (
              <div className="pf-qty-grid">
                {checkedSizes.map((size) => (
                  <div key={size} className="pf-qty-row">
                    <span className="pf-qty-size">US {size}</span>
                    <input
                      type="number"
                      className="pf-qty-input"
                      min="1"
                      value={formData.sizes[String(size)]}
                      onChange={(e) =>
                        handleSizeQty(String(size), e.target.value)
                      }
                    />
                    <span className="pf-qty-unit">pairs</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Actions ────────────────────────────────────── */}
          <div className="pf-actions">
            {onCancel ? (
              <button type="button" className="pf-btn-cancel" onClick={onCancel}>
                Cancel
              </button>
            ) : (
              <Link to="/admin" className="pf-btn-cancel">
                Cancel
              </Link>
            )}
            <button type="submit" className="pf-btn-submit">
              <i className={`fa-solid ${updateMode ? "fa-pen" : "fa-plus"}`} />
              {updateMode ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ProductForm.propTypes = {
  submitFunction: PropTypes.func.isRequired,
  initialState: PropTypes.object.isRequired,
  isUpdate: PropTypes.bool,
  onCancel: PropTypes.func,
};

export default ProductForm;
