import React, { useContext, useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { CartContext } from "../../context/CartContext";
import { stripePayment } from "../../service/client.service";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { totalOrderAmount } = useContext(CartContext);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      if (totalOrderAmount > 0 && paymentMethod === "card") {
        try {
          const paymentData = { amount: totalOrderAmount * 100 }; // Amount in cents
          const res = await stripePayment(paymentData);
          setClientSecret(res.clientSecret);
        } catch (error) {
          setError("Failed to create payment intent.");
        }
      }
    };

    fetchPaymentIntent();
  }, [totalOrderAmount, paymentMethod]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (paymentMethod === "card") {
      if (!stripe || !elements) {
        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "https://example.com/order/123/complete",
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } else if (paymentMethod === "bank_transfer") {
      // Handle bank transfer submission here (e.g., create order with "pending" status)
      // For demo, just show success message and instructions
      setSuccess(true);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Select Payment Method:
          <select
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
              setError("");
              setSuccess(false);
            }}
            style={{ marginLeft: "10px", marginBottom: "20px" }}
          >
            <option value="card">Credit/Debit Card</option>
            <option value="bank_transfer">Bank Transfer (Offline)</option>
          </select>
        </label>

        {paymentMethod === "card" && (
          <PaymentElement clientSecret={clientSecret} />
        )}

        {paymentMethod === "bank_transfer" && (
          <div style={{ marginTop: "20px", backgroundColor: "#f9f9f9", padding: "15px", borderRadius: "5px" }}>
            <p>
              Please transfer the total amount of <strong>${totalOrderAmount.toFixed(2)}</strong> to the following bank account:
            </p>
            <ul>
              <li><strong>Bank:</strong> Banco Popular</li>
              <li><strong>Account Number:</strong> 123-456-789</li>
              <li><strong>Account Name:</strong> Your Company Name</li>
              <li>
                After completing the transfer, please send the payment confirmation to <a href="mailto:payments@yourstore.com">payments@yourstore.com</a>.
              </li>
            </ul>
          </div>
        )}

        <button type="submit" disabled={paymentMethod === "card" && !stripe} style={{ marginTop: "20px" }}>
          {paymentMethod === "card" ? "Pay" : "Confirm Bank Transfer"}
        </button>
      </form>

      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
      {success && paymentMethod === "card" && <div style={{ color: "green", marginTop: "10px" }}>Payment successful!</div>}
      {success && paymentMethod === "bank_transfer" && (
        <div style={{ color: "green", marginTop: "10px" }}>
          Order received. Please complete the bank transfer as instructed.
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
