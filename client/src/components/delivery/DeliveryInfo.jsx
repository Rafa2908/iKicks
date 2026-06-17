import { useState, useEffect, useContext } from "react";
import "./DeliveryInfo.css";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { getAddresses, addShippingAddress } from "../../service/shipping.service";

const DeliveryInfo = () => {
  const navigate = useNavigate();
  const { setDeliveryInfo } = useContext(CartContext);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [deliveryData, setDeliveryData] = useState({
    recipient_name: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    zipcode: "",
    phone_number: "",
  });

  useEffect(() => {
    const load = async () => {
      const data = await getAddresses();
      setAddresses(data);
      if (data.length > 0) setSelectedAddressId(data[0].id);
      setLoadingAddresses(false);
    };
    load();
  }, []);

  const updateDeliveryInfo = (e) => {
    const { name, value } = e.target;
    setDeliveryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeliveryInfo = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (selectedAddressId !== null) {
      setDeliveryInfo({
        recipientName: deliveryData.recipient_name,
        phoneNumber: deliveryData.phone_number,
        addressId: selectedAddressId,
      });
      navigate("/payment");
      return;
    }

    const res = await addShippingAddress(deliveryData);
    if (res) {
      setDeliveryInfo({
        recipientName: deliveryData.recipient_name,
        phoneNumber: deliveryData.phone_number,
        addressId: res.shippingId,
      });
      navigate("/payment");
    } else {
      setError("Failed to save address. Please check your details and try again.");
      setSubmitting(false);
    }
  };

  const isNewAddressMode = selectedAddressId === null;

  return (
    <div className="di-page">
      <div className="di-card">
        <div className="di-header">
          <h1 className="di-brand">iKicks</h1>
          <p className="di-subtitle">Where should we send your order?</p>
        </div>

        <form className="di-form" onSubmit={handleDeliveryInfo} noValidate>

          {/* ── Saved addresses ─────────────────────── */}
          {loadingAddresses && (
            <div className="di-saved-loading">
              <span className="di-saved-spinner" />
              Loading saved addresses…
            </div>
          )}

          {!loadingAddresses && addresses.length > 0 && (
            <div className="di-saved-section">
              <p className="di-saved-label">Saved Addresses</p>
              <div className="di-address-grid">
                {addresses.map((addr) => (
                  <button
                    key={addr.id}
                    type="button"
                    className={`di-address-card${selectedAddressId === addr.id ? " di-address-card--selected" : ""}`}
                    onClick={() => setSelectedAddressId(addr.id)}
                  >
                    {selectedAddressId === addr.id && (
                      <i className="fa-solid fa-circle-check di-address-check" />
                    )}
                    <span className="di-address-line">{addr.address_1}</span>
                    {addr.address_2 && (
                      <span className="di-address-line">{addr.address_2}</span>
                    )}
                    <span className="di-address-line">
                      {addr.city}, {addr.state} {addr.zipcode}
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  className={`di-address-card di-address-card--new${isNewAddressMode ? " di-address-card--selected" : ""}`}
                  onClick={() => setSelectedAddressId(null)}
                >
                  <i className="fa-solid fa-plus di-address-new-icon" />
                  <span>New Address</span>
                </button>
              </div>
            </div>
          )}

          {/* ── Recipient name — always shown ────────── */}
          <div className="di-field">
            <label htmlFor="recipient_name">Recipient Name</label>
            <input
              id="recipient_name"
              type="text"
              name="recipient_name"
              placeholder="Full name"
              value={deliveryData.recipient_name}
              onChange={updateDeliveryInfo}
              autoFocus
              required
            />
          </div>

          {/* ── Address fields — new address mode only ── */}
          {isNewAddressMode && (
            <>
              <div className="di-field">
                <label htmlFor="address_1">Address Line 1</label>
                <input
                  id="address_1"
                  type="text"
                  name="address_1"
                  placeholder="Street address"
                  value={deliveryData.address_1}
                  onChange={updateDeliveryInfo}
                  required
                />
              </div>

              <div className="di-field">
                <label htmlFor="address_2">
                  Address Line 2{" "}
                  <span className="di-optional">(optional)</span>
                </label>
                <input
                  id="address_2"
                  type="text"
                  name="address_2"
                  placeholder="Apt, suite, unit, etc."
                  value={deliveryData.address_2}
                  onChange={updateDeliveryInfo}
                />
              </div>

              <div className="di-row">
                <div className="di-field">
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    placeholder="City"
                    value={deliveryData.city}
                    onChange={updateDeliveryInfo}
                    required
                  />
                </div>
                <div className="di-field">
                  <label htmlFor="state">State</label>
                  <input
                    id="state"
                    type="text"
                    name="state"
                    placeholder="State"
                    value={deliveryData.state}
                    onChange={updateDeliveryInfo}
                    required
                  />
                </div>
                <div className="di-field">
                  <label htmlFor="zipcode">Zip Code</label>
                  <input
                    id="zipcode"
                    type="text"
                    name="zipcode"
                    placeholder="00000"
                    value={deliveryData.zipcode}
                    onChange={updateDeliveryInfo}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* ── Phone — always shown ─────────────────── */}
          <div className="di-field">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              id="phone_number"
              type="tel"
              name="phone_number"
              placeholder="+1 (555) 000-0000"
              value={deliveryData.phone_number}
              onChange={updateDeliveryInfo}
              required
            />
          </div>

          {error && <p className="di-error">{error}</p>}

          <button type="submit" className="di-submit" disabled={submitting}>
            {submitting ? "Saving…" : "Proceed to Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeliveryInfo;
