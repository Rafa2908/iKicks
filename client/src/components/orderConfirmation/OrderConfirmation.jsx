import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";

const OrderConfirmation = () => {
  const { userInfo } = useContext(CartContext);

  const { email } = userInfo;

  return (
    <div className="container">
      <h2 className="mt-5 mb-5 text-center display-2">
        Thank you so much for your purchase!
      </h2>
      <p className="text-center mt-2 display-6">
        An email confirmation has been sent to <b>{email && email}</b>.
      </p>
      <p className="text-center mt-2 display-6">
        Your order confirmation number is <b>KD00001</b>
      </p>

      <div className="d-flex justify-content-center align-items-center flex-column gap-3">
        <p className="display-6 text-center mt-4">
          You can check all your orders here
        </p>
        <Link to={"/myorders"} className="btn btn-outline-dark mb-5">
          My Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
