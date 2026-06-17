import PropTypes from "prop-types";
import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { UserContext } from "./UserContext";
import { cartTotal, getCartItemsPreview } from "../service/cart.service";

const CartContext = createContext({
  cart: [],
  setCart: () => {},
  total: 0,
  setTotal: () => {},
  cartCount: 0,
  setCartCount: () => {},
  deliveryInfo: {},
  setDeliveryInfo: () => {},
});

const CartProvider = ({ children }) => {
  const { user } = useContext(UserContext);

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  const fetchCart = async () => {
    const res = await getCartItemsPreview();

    setCart(res?.products);
    setTotal(Number(res?.total));
  };

  useEffect(() => {
    const isLoggedIn = user && Object.keys(user).length > 0;

    if (isLoggedIn) {
      fetchCart();
    } else {
      setCart([]);
      setTotal(0);
    }
  }, [user]);

  useEffect(() => {
    const fetchCartData = async () => {
      const res = await cartTotal();
      setCartCount(res?.total);
    };

    fetchCartData();
  }, [cart]);

  const valueContext = useMemo(
    () => ({
      cart,
      setCart,
      total,
      setTotal,
      cartCount,
      setCartCount,
      deliveryInfo,
      setDeliveryInfo,
      refreshCart: fetchCart,
    }),
    [cart, total, cartCount, deliveryInfo],
  );

  return (
    <CartContext.Provider value={valueContext}>{children}</CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartProvider;
export { CartContext };
