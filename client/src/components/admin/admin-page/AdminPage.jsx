import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./AdminPage.css";
import { getProductInfo, getProductDetails } from "../../../service/product.service";
import { logoutUser } from "../../../service/user.service";
import { UserContext } from "../../../context/UserContext";
import ProductForm from "../product-form/ProductForm";

const NAV_ITEMS = [
  { id: "inventory", icon: "fa-solid fa-box-open", label: "Inventory" },
  { id: "orders", icon: "fa-solid fa-receipt", label: "Orders" },
  { id: "users", icon: "fa-solid fa-users", label: "Users" },
  { id: "analytics", icon: "fa-solid fa-chart-line", label: "Analytics" },
  { id: "promotions", icon: "fa-solid fa-tag", label: "Promotions" },
];

const Placeholder = ({ icon, title, desc }) => (
  <div className="ap-placeholder">
    <i className={`${icon} ap-placeholder-icon`} />
    <h3 className="ap-placeholder-title">{title}</h3>
    <p className="ap-placeholder-desc">{desc}</p>
  </div>
);

Placeholder.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
};

const AdminPage = () => {
  const { user, setMessage } = useContext(UserContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("inventory");
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [sizeEdits, setSizeEdits] = useState({});
  const [addingSizeFor, setAddingSizeFor] = useState(null);
  const [newSize, setNewSize] = useState({ size: "", quantity: 1 });

  useEffect(() => {
    getProductInfo().then((res) => {
      if (res) setProducts(res);
    });
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setMessage("Logged out successfully.");
    navigate("/");
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()),
  );

  const startSizeEdit = (productId, size, currentQty) => {
    setSizeEdits((prev) => ({ ...prev, [`${productId}-${size}`]: currentQty }));
  };

  const saveSizeQty = (productId, size) => {
    const key = `${productId}-${size}`;
    const qty = sizeEdits[key];
    // TODO: call updateQuantityBySize({ productId, size, quantity: qty })
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              sizes: (p.sizes || []).map((s) =>
                s.size === size ? { ...s, quantity: qty } : s,
              ),
            }
          : p,
      ),
    );
    setSizeEdits((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const removeSize = (productId, size) => {
    // TODO: call remove-size API
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, sizes: (p.sizes || []).filter((s) => s.size !== size) }
          : p,
      ),
    );
  };

  const addSize = (productId) => {
    if (!newSize.size || Number(newSize.quantity) < 1) return;
    // TODO: call add-size API
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              sizes: [
                ...(p.sizes || []),
                {
                  size: Number(newSize.size),
                  quantity: Number(newSize.quantity),
                },
              ].sort((a, b) => a.size - b.size),
            }
          : p,
      ),
    );
    setAddingSizeFor(null);
    setNewSize({ size: "", quantity: 1 });
  };

  const handleEdit = async (product) => {
    const full = await getProductDetails(product.id);
    setEditingProduct(full || product);
  };

  const handleUpdateSubmit = async () => {
    // TODO: call update product API with payload
    setEditingProduct(null);
  };

  const updateInitialState = editingProduct
    ? {
        name: editingProduct.name || "",
        brand: editingProduct.brand || "",
        colorway: editingProduct.colorway || "",
        category: editingProduct.category || "",
        description: editingProduct.description || "",
        price: editingProduct.price || "",
        images: [
          editingProduct.images?.[0] || null,
          editingProduct.images?.[1] || null,
          editingProduct.images?.[2] || null,
          editingProduct.images?.[3] || null,
        ],
        sizes: Object.fromEntries(
          (editingProduct.sizes || []).map((s) => [String(s.size), s.quantity]),
        ),
      }
    : null;

  if (!user || user.role !== "admin") {
    return (
      <div className="ap-unauthorized">
        <i className="fa-solid fa-lock ap-unauthorized-icon" />
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  return (
    <div className="ap-shell">
      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="ap-sidebar">
        <div className="ap-logo">
          <span className="ap-logo-text">iKicks</span>
          <span className="ap-logo-badge">Admin</span>
        </div>

        <nav className="ap-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`ap-nav-item${activeTab === item.id ? " ap-nav-item-active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <i className={`${item.icon} ap-nav-icon`} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="ap-sidebar-footer">
          <div className="ap-user-chip">
            <div className="ap-user-avatar">
              {user?.first_name?.[0]}
              {user?.last_name?.[0]}
            </div>
            <div className="ap-user-info">
              <span className="ap-user-name">
                {user?.first_name} {user?.last_name}
              </span>
              <span className="ap-user-role">Administrator</span>
            </div>
          </div>
          <button
            className="ap-logout-btn"
            onClick={handleLogout}
            title="Log out"
          >
            <i className="fa-solid fa-arrow-right-from-bracket" />
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────── */}
      <main className="ap-main">
        {activeTab === "inventory" && (
          <>
            <div className="ap-topbar">
              <div>
                <h1 className="ap-page-title">Inventory</h1>
                <p className="ap-page-sub">{products.length} products listed</p>
              </div>
              <div className="ap-toolbar">
                <div className="ap-search-wrap">
                  <i className="fa-solid fa-magnifying-glass ap-search-icon" />
                  <input
                    className="ap-search"
                    type="text"
                    placeholder="Search by name or brand…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button
                  className="ap-add-btn"
                  onClick={() => navigate("/new-inventory")}
                  title="Add product"
                >
                  <i className="fa-solid fa-plus" />
                </button>
              </div>
            </div>

            <div className="ap-table-wrap">
              <table className="ap-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Sizes &amp; Stock</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="ap-product-cell">
                          {product.images?.[0] && (
                            <img
                              className="ap-product-thumb"
                              src={product.images[0]}
                              alt={product.name}
                            />
                          )}
                          <div>
                            <p className="ap-product-name">{product.name}</p>
                            <p className="ap-product-brand">{product.brand}</p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="ap-category-badge">
                          {product.category || "—"}
                        </span>
                      </td>

                      <td>
                        <span className="ap-price">
                          RD${Number(product.price).toLocaleString()}
                        </span>
                      </td>

                      <td>
                        <div className="ap-sizes-cell">
                          {(product.sizes || [])
                            .sort((a, b) => a.size - b.size)
                            .map((s) => {
                              const key = `${product.id}-${s.size}`;
                              const isEditing = key in sizeEdits;
                              return (
                                <div key={s.size} className="ap-size-chip">
                                  <span className="ap-size-num">
                                    US {s.size}
                                  </span>
                                  {isEditing ? (
                                    <input
                                      className="ap-size-qty-input"
                                      type="number"
                                      min="1"
                                      autoFocus
                                      value={sizeEdits[key]}
                                      onChange={(e) =>
                                        setSizeEdits((prev) => ({
                                          ...prev,
                                          [key]: Number(e.target.value),
                                        }))
                                      }
                                      onBlur={() =>
                                        saveSizeQty(product.id, s.size)
                                      }
                                      onKeyDown={(e) =>
                                        e.key === "Enter" &&
                                        saveSizeQty(product.id, s.size)
                                      }
                                    />
                                  ) : (
                                    <button
                                      className="ap-size-qty"
                                      onClick={() =>
                                        startSizeEdit(
                                          product.id,
                                          s.size,
                                          s.quantity,
                                        )
                                      }
                                      title="Click to edit quantity"
                                    >
                                      {s.quantity}
                                    </button>
                                  )}
                                  <button
                                    className="ap-size-remove"
                                    onClick={() =>
                                      removeSize(product.id, s.size)
                                    }
                                    title="Remove size"
                                  >
                                    <i className="fa-solid fa-xmark" />
                                  </button>
                                </div>
                              );
                            })}

                          {addingSizeFor === product.id ? (
                            <div className="ap-add-size-form">
                              <input
                                className="ap-add-size-input"
                                type="number"
                                placeholder="Size"
                                step="0.5"
                                min="6"
                                max="14"
                                autoFocus
                                value={newSize.size}
                                onChange={(e) =>
                                  setNewSize((p) => ({
                                    ...p,
                                    size: e.target.value,
                                  }))
                                }
                              />
                              <input
                                className="ap-add-size-input ap-add-size-qty"
                                type="number"
                                placeholder="Qty"
                                min="1"
                                value={newSize.quantity}
                                onChange={(e) =>
                                  setNewSize((p) => ({
                                    ...p,
                                    quantity: e.target.value,
                                  }))
                                }
                              />
                              <button
                                className="ap-add-size-confirm"
                                onClick={() => addSize(product.id)}
                                title="Save"
                              >
                                <i className="fa-solid fa-check" />
                              </button>
                              <button
                                className="ap-add-size-dismiss"
                                onClick={() => {
                                  setAddingSizeFor(null);
                                  setNewSize({ size: "", quantity: 1 });
                                }}
                                title="Cancel"
                              >
                                <i className="fa-solid fa-xmark" />
                              </button>
                            </div>
                          ) : (
                            <button
                              className="ap-size-add-btn"
                              onClick={() => setAddingSizeFor(product.id)}
                              title="Add a size"
                            >
                              <i className="fa-solid fa-plus" />
                            </button>
                          )}
                        </div>
                      </td>

                      <td>
                        <button
                          className="ap-edit-btn"
                          onClick={() => handleEdit(product)}
                          title="Edit product"
                        >
                          <i className="fa-solid fa-pen-to-square" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="ap-empty">
                  <i className="fa-solid fa-box-open ap-empty-icon" />
                  <p>No products found.</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "orders" && (
          <Placeholder
            icon="fa-solid fa-receipt"
            title="Orders"
            desc="View and update the status of customer orders."
          />
        )}

        {activeTab === "users" && (
          <Placeholder
            icon="fa-solid fa-users"
            title="Users"
            desc="Browse and manage registered customer accounts."
          />
        )}

        {activeTab === "analytics" && (
          <Placeholder
            icon="fa-solid fa-chart-line"
            title="Analytics"
            desc="Revenue, order volume, and traffic insights — coming soon."
          />
        )}

        {activeTab === "promotions" && (
          <Placeholder
            icon="fa-solid fa-tag"
            title="Promotions"
            desc="Create and manage discount codes and campaigns — coming soon."
          />
        )}
      </main>

      {/* ── Edit overlay ────────────────────────────────── */}
      {editingProduct && updateInitialState && (
        <div
          className="ap-overlay"
          onClick={(e) =>
            e.target === e.currentTarget && setEditingProduct(null)
          }
        >
          <div className="ap-overlay-panel">
            <button
              className="ap-overlay-close"
              onClick={() => setEditingProduct(null)}
              title="Close"
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <ProductForm
              submitFunction={handleUpdateSubmit}
              initialState={updateInitialState}
              isUpdate
              onCancel={() => setEditingProduct(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
