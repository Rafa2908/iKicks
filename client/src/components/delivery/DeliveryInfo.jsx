import { useState, useRef, useContext } from "react";
import "./DeliveryInfo.css";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const DeliveryInfo = () => {
  const navigate = useNavigate();

  const [deliveryInfo, setDeliveryInfo] = useState({
    recipient_name: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    zipcode: "",
    phone_number: "",
  });

  const { cart, total } = useContext(CartContext);
  const address1Ref = useRef(null);

  const updateDeliveryInfo = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeliveryInfo = async (e) => {
    e.preventDefault();
    navigate("/payment");
    // payment logic goes here
  };

  return (
    <div className="di-page">
      <div className="di-card">
        <div className="di-header">
          <h1 className="di-brand">iKicks</h1>
          <p className="di-subtitle">Where should we send your order?</p>
        </div>

        <form className="di-form" onSubmit={handleDeliveryInfo} noValidate>
          <div className="di-field">
            <label htmlFor="recipient_name">Recipient Name</label>
            <input
              id="recipient_name"
              type="text"
              name="recipient_name"
              placeholder="Full name"
              value={deliveryInfo.recipient_name}
              onChange={updateDeliveryInfo}
              autoFocus
              required
            />
          </div>

          <div className="di-field">
            <label htmlFor="address_1">Address Line 1</label>
            <input
              id="address_1"
              type="text"
              name="address_1"
              placeholder="Street address"
              value={deliveryInfo.address_1}
              onChange={updateDeliveryInfo}
              ref={address1Ref}
              required
            />
          </div>

          <div className="di-field">
            <label htmlFor="address_2">
              Address Line 2 <span className="di-optional">(optional)</span>
            </label>
            <input
              id="address_2"
              type="text"
              name="address_2"
              placeholder="Apt, suite, unit, etc."
              value={deliveryInfo.address_2}
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
                value={deliveryInfo.city}
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
                value={deliveryInfo.state}
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
                value={deliveryInfo.zipcode}
                onChange={updateDeliveryInfo}
                required
              />
            </div>
          </div>

          <div className="di-field">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              id="phone_number"
              type="tel"
              name="phone_number"
              placeholder="+1 (555) 000-0000"
              value={deliveryInfo.phone_number}
              onChange={updateDeliveryInfo}
              required
            />
          </div>

          <button type="submit" className="di-submit">
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeliveryInfo;
