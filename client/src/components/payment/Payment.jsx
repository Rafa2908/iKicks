import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51OjlOcHgZE4vbfgv1VjNOoX0XXm9i2uYq2KGbYsBPXYjse73H6Wp5ZKVDZOgkIgAFfEwJOEG80QCmcIupghi0gRP00P7G87vdh"
);

const Payment = () => {
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>;
};

export default Payment;
