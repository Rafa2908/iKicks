import { useContext, useState, useEffect, useRef } from "react";
import "./DeliveryInfo.css";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { stripePayment } from "../../service/client.service";

const DeliveryInfo = () => {
  const [deliveryInfo, setDeliveryInfo] = useState({
    first_name: "",
    last_name: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip_code: "",
    phone_number: "",
  });

  // Set deliveryCharge as a number
  const [deliveryCharge, setDeliveryCharge] = useState(4.99);

  const { cartDetails } = useContext(CartContext);

  const subtotal = cartDetails.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const taxRate = 0.1;
  const taxAmount = subtotal * taxRate;

  const totalOrderAmount = subtotal + taxAmount;

  const address1Ref = useRef(null);

  useEffect(() => {
    const handleScriptLoad = () => {
      if (window.google) {
        const autocomplete = new window.google.maps.places.Autocomplete(
          address1Ref.current,
          { types: ["address"] }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const addressComponents = place.address_components.reduce(
            (acc, component) => {
              const types = component.types;
              if (types.includes("street_number")) {
                acc.street_number = component.long_name;
              } else if (types.includes("route")) {
                acc.route = component.long_name;
              } else if (types.includes("locality")) {
                acc.city = component.long_name;
              } else if (types.includes("administrative_area_level_1")) {
                acc.state = component.short_name;
              } else if (types.includes("postal_code")) {
                acc.zip_code = component.long_name;
              }
              return acc;
            },
            {}
          );

          setDeliveryInfo((prev) => ({
            ...prev,
            address1: `${addressComponents.street_number || ""} ${
              addressComponents.route || ""
            }`.trim(),
            city: addressComponents.city || "",
            state: addressComponents.state || "",
            zip_code: addressComponents.zip_code || "",
          }));
        });
      }
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.addEventListener("load", handleScriptLoad);
      document.body.appendChild(script);

      return () => {
        script.removeEventListener("load", handleScriptLoad);
        document.body.removeChild(script);
      };
    } else {
      handleScriptLoad();
    }
  }, []);

  const updateDeliveryInfo = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Update deliveryCharge to a number
  const updateDeliveryCharge = (e) => {
    setDeliveryCharge(parseFloat(e.target.value));
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    let orderData = {
      address: deliveryInfo,
      items: cartDetails,
      amount: totalOrderAmount, // Include delivery charge
    };

    try {
      const response = await stripePayment(orderData, token);
      console.log("Stripe Payment Response:", response);

      if (response.success) {
        const { session_url } = response;
        window.location.replace(session_url);
      } else {
        console.error("Payment was not successful:", response);
      }
    } catch (error) {
      console.error("Error during payment:", error);
    }
  };

  return (
    <div className="shipping-container">
      <div className="delivery-container mb-5 d-flex justify-content-between align-items-start">
        <main className="card shadow w-50 p-3">
          <h2 className="text-center mt-5 mb-5">Delivery Information</h2>
          <form className="card-body" onSubmit={placeOrder}>
            <div className="user-name d-flex justify-content-between align-items-center gap-3">
              <div className="mb-4 form-floating">
                <input
                  type="text"
                  name="first_name"
                  className="form-control"
                  placeholder="First Name:"
                  onChange={updateDeliveryInfo}
                  value={deliveryInfo.first_name}
                  required
                />
                <label htmlFor="first_name">First Name:</label>
              </div>
              <div className="mb-4 form-floating">
                <input
                  type="text"
                  name="last_name"
                  className="form-control"
                  placeholder="Last Name:"
                  onChange={updateDeliveryInfo}
                  value={deliveryInfo.last_name}
                  required
                />
                <label htmlFor="last_name">Last Name:</label>
              </div>
            </div>
            <div className="mb-4 form-floating">
              <input
                type="text"
                name="address1"
                className="form-control"
                placeholder="Address 1:"
                onChange={updateDeliveryInfo}
                value={deliveryInfo.address1}
                ref={address1Ref}
                required
              />
              <label htmlFor="address1">Address 1:</label>
            </div>
            <div className="mb-4 form-floating">
              <input
                type="text"
                name="address2"
                className="form-control"
                placeholder="Address 2:"
                onChange={updateDeliveryInfo}
                value={deliveryInfo.address2}
              />
              <label htmlFor="address2">Address 2:</label>
            </div>

            <div className="state-zip d-flex justify-content-center align-items-center gap-3">
              <div className="mb-4 form-floating">
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  placeholder="City:"
                  onChange={updateDeliveryInfo}
                  value={deliveryInfo.city}
                  required
                />
                <label htmlFor="city">City:</label>
              </div>
              <div className="mb-4 form-floating">
                <input
                  type="text"
                  name="state"
                  className="form-control"
                  placeholder="State:"
                  onChange={updateDeliveryInfo}
                  value={deliveryInfo.state}
                  required
                />
                <label htmlFor="state">State:</label>
              </div>
              <div className="mb-4 form-floating">
                <input
                  type="text"
                  name="zip_code"
                  className="form-control"
                  placeholder="Zip Code:"
                  onChange={updateDeliveryInfo}
                  value={deliveryInfo.zip_code}
                  required
                />
                <label htmlFor="zip_code">Zip Code:</label>
              </div>
            </div>
            <div className="mb-4 form-floating">
              <input
                type="text"
                name="phone_number"
                placeholder="Phone Number:"
                className="form-control"
                onChange={updateDeliveryInfo}
                value={deliveryInfo.phone_number}
                required
              />
              <label htmlFor="phone_number">Phone Number:</label>
            </div>
            <div className="mt-4 text-center">
              <button className="btn btn-outline-primary" type="submit">
                Proceed to Payment
              </button>
            </div>
          </form>
        </main>
        <aside className="card p-3">
          <div className="aside-container mb-5 card-body">
            <h2 className="mb-5 mt-4 text-center">Order Detail</h2>
            <div className="subtotal">
              <p>Subtotal:</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <p className="mb-4">Shipping</p>
            <div className="shipping">
              <div className="shipping-1">
                <input
                  type="radio"
                  name="shipping"
                  value={4.99}
                  checked={deliveryCharge === 4.99}
                  onChange={updateDeliveryCharge}
                />
                <p>Standard Shipping: (5-7 days):</p>
              </div>
              <p>$4.99</p>
            </div>
            <div className="shipping">
              <div className="shipping-1">
                <input
                  type="radio"
                  name="shipping"
                  value={9.99}
                  checked={deliveryCharge === 9.99}
                  onChange={updateDeliveryCharge}
                />
                <p>Express Shipping: (2-3 days):</p>
              </div>
              <p>$9.99</p>
            </div>

            <div className="estimated-taxes">
              <p>Estimated Taxes (10%):</p>
              <p>${taxAmount.toFixed(2)}</p>
            </div>
            <div className="total-order">
              <p>Total:</p>
              <p>${(totalOrderAmount + deliveryCharge).toFixed(2)}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DeliveryInfo;
