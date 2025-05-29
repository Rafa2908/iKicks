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

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      if (totalOrderAmount > 0) {
        try {
          const paymentData = { amount: totalOrderAmount * 100 }; // Amount in cents
          stripePayment(paymentData).then((res) => console.log(res));
        } catch (error) {
          setError("Failed to create payment intent.");
        }
      }
    };

    fetchPaymentIntent();
  }, [totalOrderAmount]);

  const handleSubmit = async (event) => {
    event.preventDefault();
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
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button type="submit" disabled={!stripe}>
          Pay
        </button>
      </form>
      {error && <div>{error}</div>}
      {success && <div>Payment successful!</div>}
    </div>
  );
};

export default CheckoutForm;
