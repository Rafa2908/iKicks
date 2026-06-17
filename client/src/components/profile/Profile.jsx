import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { UserContext } from "../../context/UserContext";
import { logoutUser, updateUserInfo } from "../../service/user.service";
import { getOrdersPreview } from "../../service/order.service";
import {
  getAddresses,
  addShippingAddress,
  deleteAddress,
} from "../../service/shipping.service";

const NAV_ITEMS = [
  { id: "overview", icon: "fa-solid fa-grip", label: "Overview" },
  { id: "orders", icon: "fa-solid fa-receipt", label: "My Orders" },
  { id: "addresses", icon: "fa-solid fa-location-dot", label: "Addresses" },
  { id: "settings", icon: "fa-solid fa-gear", label: "Settings" },
  { id: "security", icon: "fa-solid fa-shield-halved", label: "Security" },
];

const EMPTY_ADDRESS = {
  recipient: "",
  address_1: "",
  address_2: "",
  city: "",
  state: "",
  zipcode: "",
};

const Profile = () => {
  const { user, setUser, authLoading } = useContext(UserContext);
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [orders, setOrders] = useState([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const [addresses, setAddresses] = useState([]);
  const [addressesLoaded, setAddressesLoaded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState(EMPTY_ADDRESS);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressError, setAddressError] = useState("");

  const [settingsForm, setSettingsForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState({ text: "", ok: true });

  useEffect(() => {
    if (user?.first_name) {
      setSettingsForm({
        firstName: user.first_name ?? "",
        lastName: user.last_name ?? "",
        email: user.email ?? "",
      });
    }
  }, [user]);

  useEffect(() => {
    if ((activeTab === "overview" || activeTab === "orders") && !ordersLoaded) {
      getOrdersPreview().then((res) => {
        setOrders(Array.isArray(res) ? res : []);
        setOrdersLoaded(true);
      });
    }
  }, [activeTab, ordersLoaded]);

  useEffect(() => {
    if (activeTab === "addresses" && !addressesLoaded) {
      getAddresses().then((res) => {
        setAddresses(Array.isArray(res) ? res : []);
        setAddressesLoaded(true);
      });
    }
  }, [activeTab, addressesLoaded]);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsMsg({ text: "", ok: true });
    const res = await updateUserInfo(settingsForm);
    setSettingsSaving(false);
    if (res) {
      setUser((prev) => ({
        ...prev,
        first_name: settingsForm.firstName,
        last_name: settingsForm.lastName,
        email: settingsForm.email,
      }));
      setSettingsMsg({ text: "Profile updated successfully.", ok: true });
      setTimeout(() => {
        setSettingsMsg({ text: "", ok: true });
        setActiveTab("overview");
      }, 1800);
    } else {
      setSettingsMsg({
        text: "Could not update profile. Try again.",
        ok: false,
      });
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setAddressSaving(true);
    setAddressError("");
    const res = await addShippingAddress(newAddress);
    setAddressSaving(false);
    if (res) {
      setAddresses((prev) => [...prev, { id: res.shippingId, ...newAddress }]);
      setNewAddress(EMPTY_ADDRESS);
      setShowAddForm(false);
    } else {
      setAddressError("Could not save address. Please check your details.");
    }
  };

  const handleDeleteAddress = async (shippingId) => {
    const res = await deleteAddress(shippingId);
    if (res) setAddresses((prev) => prev.filter((a) => a.id !== shippingId));
  };

  if (authLoading) {
    return (
      <div className="pp-gate">
        <i className="fa-solid fa-spinner pp-spinner pp-gate-icon" />
      </div>
    );
  }

  if (!user || Object.keys(user).length === 0) {
    return (
      <div className="pp-gate">
        <i className="fa-solid fa-lock pp-gate-icon" />
        <p className="pp-gate-text">
          You need to be logged in to view your profile.
        </p>
        <button className="pp-primary-btn" onClick={() => navigate("/login")}>
          Log In
        </button>
      </div>
    );
  }

  const initials =
    `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase();
  const totalSpent = orders.reduce(
    (sum, o) => sum + Number(o.total_at_purchase ?? 0),
    0,
  );

  return (
    <div className={`pp-shell${collapsed ? " pp-collapsed" : ""}`}>
      {/* ── Sidebar ────────────────────────────────────── */}
      <aside className="pp-sidebar">
        <div className="pp-logo"></div>

        <nav className="pp-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`pp-nav-item${activeTab === item.id ? " pp-nav-item-active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <i className={`${item.icon} pp-nav-icon`} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          className="pp-collapse-btn"
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? "Expand menu" : "Collapse menu"}
        >
          <i
            className={`fa-solid fa-chevron-${collapsed ? "right" : "left"}`}
          />
          {!collapsed && <span>Collapse</span>}
        </button>

        <div className="pp-sidebar-footer">
          <div className="pp-user-chip">
            <div className="pp-user-avatar">{initials}</div>
            <div className="pp-user-info">
              <span className="pp-user-name">
                {user.first_name} {user.last_name}
              </span>
              <span className="pp-user-role">
                {user.role === "admin" ? "Administrator" : "Customer"}
              </span>
            </div>
          </div>
          <button
            className="pp-logout-btn"
            onClick={handleLogout}
            title="Log out"
          >
            <i className="fa-solid fa-arrow-right-from-bracket" />
          </button>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────── */}
      <main className="pp-main">
        {/* OVERVIEW ─────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="pp-overview">
            <div className="pp-hero-card">
              <div className="pp-hero-avatar">{initials}</div>
              <div className="pp-hero-info">
                <h1 className="pp-hero-name">
                  {user.first_name} {user.last_name}
                </h1>
                <p className="pp-hero-email">{user.email}</p>
                <span
                  className={`pp-role-badge${user.role === "admin" ? " pp-role-badge--admin" : ""}`}
                >
                  {user.role === "admin" ? "Administrator" : "Customer"}
                </span>
              </div>
              <button
                className="pp-hero-edit-btn"
                onClick={() => setActiveTab("settings")}
                title="Edit profile"
              >
                <i className="fa-solid fa-pen" />
                <span>Edit</span>
              </button>
            </div>

            <div className="pp-stats-row">
              <div className="pp-stat-card">
                <span className="pp-stat-value">
                  {ordersLoaded ? orders.length : "—"}
                </span>
                <span className="pp-stat-label">Total Orders</span>
              </div>
              <div className="pp-stat-card">
                <span className="pp-stat-value">
                  {ordersLoaded && orders.length > 0
                    ? `$${totalSpent.toLocaleString()}`
                    : "—"}
                </span>
                <span className="pp-stat-label">Total Spent</span>
              </div>
              <div className="pp-stat-card">
                <span className="pp-stat-value">
                  {user.role === "admin" ? "Admin" : "Member"}
                </span>
                <span className="pp-stat-label">Account Type</span>
              </div>
            </div>

            <div className="pp-section">
              <div className="pp-section-header">
                <h2 className="pp-section-title">Recent Orders</h2>
                {orders.length > 0 && (
                  <button
                    className="pp-section-link"
                    onClick={() => setActiveTab("orders")}
                  >
                    View all <i className="fa-solid fa-arrow-right" />
                  </button>
                )}
              </div>

              {!ordersLoaded ? (
                <div className="pp-loading">
                  <i className="fa-solid fa-spinner pp-spinner" /> Loading…
                </div>
              ) : orders.length === 0 ? (
                <div className="pp-empty-state">
                  <i className="fa-solid fa-bag-shopping pp-empty-icon" />
                  <p>No orders yet. Time to treat yourself.</p>
                  <button
                    className="pp-primary-btn"
                    onClick={() => navigate("/products")}
                  >
                    Browse Sneakers
                  </button>
                </div>
              ) : (
                <div className="pp-order-list">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="pp-order-card">
                      <div className="pp-order-images">
                        {order.items?.slice(0, 3).map((item, i) => (
                          <img
                            key={i}
                            src={item.image}
                            alt={item.name}
                            className="pp-order-thumb"
                          />
                        ))}
                        {order.items?.length > 3 && (
                          <div className="pp-order-thumb-more">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="pp-order-meta">
                        <p className="pp-order-recipient">
                          {order.recipient_name}
                        </p>
                        <p className="pp-order-count">
                          {order.items?.length} item
                          {order.items?.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <span className="pp-order-total">
                        ${Number(order.total_at_purchase).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MY ORDERS ─────────────────────────────────── */}
        {activeTab === "orders" && (
          <div>
            <div className="pp-topbar">
              <div>
                <h1 className="pp-page-title">My Orders</h1>
                <p className="pp-page-sub">
                  {ordersLoaded
                    ? `${orders.length} order${orders.length !== 1 ? "s" : ""}`
                    : "Loading…"}
                </p>
              </div>
            </div>

            {!ordersLoaded ? (
              <div className="pp-loading">
                <i className="fa-solid fa-spinner pp-spinner" /> Loading…
              </div>
            ) : orders.length === 0 ? (
              <div className="pp-empty-state pp-empty-state--center">
                <i className="fa-solid fa-bag-shopping pp-empty-icon" />
                <p>You haven&apos;t placed any orders yet.</p>
                <button
                  className="pp-primary-btn"
                  onClick={() => navigate("/products")}
                >
                  Shop Now
                </button>
              </div>
            ) : (
              <div className="pp-order-cards">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className={`pp-order-full-card${expandedOrder === order.id ? " pp-order-full-card--open" : ""}`}
                  >
                    <button
                      className="pp-order-full-header"
                      onClick={() =>
                        setExpandedOrder(
                          expandedOrder === order.id ? null : order.id,
                        )
                      }
                    >
                      <div className="pp-order-full-images">
                        {order.items?.slice(0, 4).map((item, i) => (
                          <img
                            key={i}
                            src={item.image}
                            alt={item.name}
                            className="pp-order-full-thumb"
                          />
                        ))}
                      </div>
                      <div className="pp-order-full-meta">
                        <p className="pp-order-full-name">
                          {order.recipient_name}
                        </p>
                        <p className="pp-order-full-count">
                          {order.items?.length} item
                          {order.items?.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="pp-order-full-right">
                        <span className="pp-order-full-total">
                          ${Number(order.total_at_purchase).toLocaleString()}
                        </span>
                        <i
                          className={`fa-solid fa-chevron-down pp-chevron${expandedOrder === order.id ? " pp-chevron--open" : ""}`}
                        />
                      </div>
                    </button>

                    {expandedOrder === order.id && (
                      <div className="pp-order-detail-body">
                        {order.items?.map((item, i) => (
                          <div key={i} className="pp-order-item-row">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="pp-order-item-img"
                            />
                            <div className="pp-order-item-info">
                              <p className="pp-order-item-name">{item.name}</p>
                              <p className="pp-order-item-brand">
                                {item.brand}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADDRESSES ─────────────────────────────────── */}
        {activeTab === "addresses" && (
          <div>
            <div className="pp-topbar">
              <div>
                <h1 className="pp-page-title">Shipping Addresses</h1>
                <p className="pp-page-sub">
                  Manage your saved delivery locations
                </p>
              </div>
              <button
                className="pp-primary-btn"
                onClick={() => {
                  setShowAddForm((v) => !v);
                  setAddressError("");
                }}
              >
                <i className="fa-solid fa-plus" />
                Add Address
              </button>
            </div>

            {showAddForm && (
              <form className="pp-addr-form" onSubmit={handleAddAddress}>
                <p className="pp-addr-form-title">New Address</p>
                <div className="pp-form-row">
                  <div className="pp-form-field pp-form-field--grow">
                    <label>Recipient Name</label>
                    <input
                      value={newAddress.recipient}
                      onChange={(e) =>
                        setNewAddress((p) => ({
                          ...p,
                          recipient: e.target.value,
                        }))
                      }
                      placeholder="Full name"
                      required
                    />
                  </div>
                </div>
                <div className="pp-form-row">
                  <div className="pp-form-field pp-form-field--grow">
                    <label>Address Line 1</label>
                    <input
                      value={newAddress.address_1}
                      onChange={(e) =>
                        setNewAddress((p) => ({
                          ...p,
                          address_1: e.target.value,
                        }))
                      }
                      placeholder="123 Main St"
                      required
                    />
                  </div>
                  <div className="pp-form-field">
                    <label>Address Line 2</label>
                    <input
                      value={newAddress.address_2}
                      onChange={(e) =>
                        setNewAddress((p) => ({
                          ...p,
                          address_2: e.target.value,
                        }))
                      }
                      placeholder="Apt, Suite… (optional)"
                    />
                  </div>
                </div>
                <div className="pp-form-row">
                  <div className="pp-form-field pp-form-field--grow">
                    <label>City</label>
                    <input
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress((p) => ({ ...p, city: e.target.value }))
                      }
                      placeholder="City"
                      required
                    />
                  </div>
                  <div className="pp-form-field pp-form-field--sm">
                    <label>State</label>
                    <input
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress((p) => ({ ...p, state: e.target.value }))
                      }
                      placeholder="State"
                      required
                    />
                  </div>
                  <div className="pp-form-field pp-form-field--sm">
                    <label>ZIP Code</label>
                    <input
                      value={newAddress.zipcode}
                      onChange={(e) =>
                        setNewAddress((p) => ({
                          ...p,
                          zipcode: e.target.value,
                        }))
                      }
                      placeholder="00000"
                      required
                    />
                  </div>
                </div>
                {addressError && (
                  <p className="pp-form-error">{addressError}</p>
                )}
                <div className="pp-form-actions">
                  <button
                    type="button"
                    className="pp-cancel-btn"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewAddress(EMPTY_ADDRESS);
                      setAddressError("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="pp-primary-btn"
                    disabled={addressSaving}
                  >
                    {addressSaving ? (
                      <>
                        <i className="fa-solid fa-spinner pp-spinner" /> Saving…
                      </>
                    ) : (
                      "Save Address"
                    )}
                  </button>
                </div>
              </form>
            )}

            {!addressesLoaded ? (
              <div className="pp-loading">
                <i className="fa-solid fa-spinner pp-spinner" /> Loading…
              </div>
            ) : addresses.length === 0 ? (
              <div className="pp-empty-state pp-empty-state--center">
                <i className="fa-solid fa-location-dot pp-empty-icon" />
                <p>No saved addresses yet.</p>
              </div>
            ) : (
              <div className="pp-addr-grid">
                {addresses.map((addr) => (
                  <div key={addr.id} className="pp-addr-card">
                    <div className="pp-addr-icon-wrap">
                      <i className="fa-solid fa-house" />
                    </div>
                    <div className="pp-addr-body">
                      <p className="pp-addr-line1">{addr.address_1}</p>
                      {addr.address_2 && (
                        <p className="pp-addr-line2">{addr.address_2}</p>
                      )}
                      <p className="pp-addr-city">
                        {addr.city}, {addr.state} {addr.zipcode}
                      </p>
                    </div>
                    <button
                      className="pp-addr-delete"
                      onClick={() => handleDeleteAddress(addr.id)}
                      title="Remove address"
                    >
                      <i className="fa-solid fa-trash" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS ──────────────────────────────────── */}
        {activeTab === "settings" && (
          <div>
            <div className="pp-topbar">
              <div>
                <h1 className="pp-page-title">Settings</h1>
                <p className="pp-page-sub">Update your personal information</p>
              </div>
            </div>

            {settingsMsg.ok && settingsMsg.text && (
              <div className="pp-save-success">
                <i className="fa-solid fa-circle-check" />
                <div>
                  <p className="pp-save-success-title">Changes saved!</p>
                  <p className="pp-save-success-sub">
                    Returning to your profile…
                  </p>
                </div>
              </div>
            )}

            <div className="pp-settings-card">
              <form onSubmit={handleSettingsSave}>
                <div className="pp-form-row">
                  <div className="pp-form-field pp-form-field--grow">
                    <label>First Name</label>
                    <input
                      value={settingsForm.firstName}
                      onChange={(e) =>
                        setSettingsForm((p) => ({
                          ...p,
                          firstName: e.target.value,
                        }))
                      }
                      placeholder="First name"
                    />
                  </div>
                  <div className="pp-form-field pp-form-field--grow">
                    <label>Last Name</label>
                    <input
                      value={settingsForm.lastName}
                      onChange={(e) =>
                        setSettingsForm((p) => ({
                          ...p,
                          lastName: e.target.value,
                        }))
                      }
                      placeholder="Last name"
                    />
                  </div>
                </div>
                <div className="pp-form-row">
                  <div className="pp-form-field pp-form-field--grow">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) =>
                        setSettingsForm((p) => ({
                          ...p,
                          email: e.target.value,
                        }))
                      }
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                {settingsMsg.text && (
                  <p
                    className={`pp-form-msg${!settingsMsg.ok ? " pp-form-msg--error" : ""}`}
                  >
                    {settingsMsg.ok ? (
                      <i className="fa-solid fa-circle-check" />
                    ) : (
                      <i className="fa-solid fa-circle-xmark" />
                    )}{" "}
                    {settingsMsg.text}
                  </p>
                )}
                <div className="pp-form-actions">
                  <button
                    type="submit"
                    className="pp-primary-btn"
                    disabled={settingsSaving}
                  >
                    {settingsSaving ? (
                      <>
                        <i className="fa-solid fa-spinner pp-spinner" /> Saving…
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SECURITY ──────────────────────────────────── */}
        {activeTab === "security" && (
          <div>
            <div className="pp-topbar">
              <div>
                <h1 className="pp-page-title">Security</h1>
                <p className="pp-page-sub">Manage your account access</p>
              </div>
            </div>

            <div className="pp-security-list">
              <div className="pp-security-item">
                <div className="pp-security-icon">
                  <i className="fa-solid fa-key" />
                </div>
                <div className="pp-security-body">
                  <p className="pp-security-title">Password</p>
                  <p className="pp-security-desc">
                    Change your password to keep your account secure.
                  </p>
                </div>
                <button
                  className="pp-outline-btn"
                  onClick={() => navigate("/login")}
                >
                  Change
                </button>
              </div>

              <div className="pp-security-item">
                <div className="pp-security-icon">
                  <i className="fa-solid fa-envelope" />
                </div>
                <div className="pp-security-body">
                  <p className="pp-security-title">Email Address</p>
                  <p className="pp-security-desc">
                    Your account email is <strong>{user.email}</strong>.
                  </p>
                </div>
                <button
                  className="pp-outline-btn"
                  onClick={() => setActiveTab("settings")}
                >
                  Update
                </button>
              </div>

              <div className="pp-security-item pp-security-item--danger">
                <div className="pp-security-icon pp-security-icon--danger">
                  <i className="fa-solid fa-triangle-exclamation" />
                </div>
                <div className="pp-security-body">
                  <p className="pp-security-title">Deactivate Account</p>
                  <p className="pp-security-desc">
                    Temporarily disable your account. You can reactivate it at
                    any time by logging back in.
                  </p>
                </div>
                <button className="pp-danger-btn">Deactivate</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
