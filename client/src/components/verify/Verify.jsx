import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyOrder } from "../../service/client.service";
import { CartContext } from "../../context/CartContext";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const navigate = useNavigate();
  const { setCartDetails, setCart } = useContext(CartContext);

  const token = localStorage.getItem("token");

  const verifyPayment = async (success, orderId) => {
    try {
      const res = await verifyOrder({ success, orderId }, token);
      if (res.success) {
        console.log("Clearing cart details");
        setCartDetails([]);
        setCart({});
        navigate("/confirmation");
      } else {
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error during payment verification:", error);
      navigate("/cart");
    }
  };

  useEffect(() => {
    if (success && orderId) {
      verifyPayment(success, orderId);
    }
  }, [success, orderId, verifyPayment]);

  return <div>Verifying payment...</div>;
};

export default Verify;
