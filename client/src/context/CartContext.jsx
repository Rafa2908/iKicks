import PropTypes from "prop-types";
import { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";

const CartContext = createContext({
  cart: [],
  setCart: () => {},
  cartCount: null,
});

const CartProvider = ({ children }) => {
  const userContext = useContext(UserContext);

  const { user } = userContext;

  let cartCount;
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        console.log("User logged in");
      }
    };

    fetchCart();
  }, [user]);

  const valueContext = {
    cart,
    setCart,
    cartCount,
  };

  return (
    <CartContext.Provider value={valueContext}>{children}</CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartProvider;
export { CartContext };
