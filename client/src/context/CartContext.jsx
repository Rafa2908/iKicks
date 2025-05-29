import { createContext, useState, useEffect } from "react";
import {
  addSneakerToCart,
  getCart,
  getUserById,
  getSneakerById,
  getAllSneakers,
} from "../service/client.service";

const CartContext = createContext({
  cart: {},
  setCart: () => {},
  addToCart: () => {},
  message: "",
  setMessage: () => {},
  alertColor: "",
  setAlertColor: () => {},
  token: "",
  setToken: () => {},
  userInfo: null,
  setUserInfo: () => {},
  cartDetails: [],
  setCartDetails: () => {},
  buttonColor: "",
  setButtonColor: () => {},
  sneakersByBrand: [],
  setSneakersByBrand: () => {},
  totalOrderAmount: "",
  setTotalOrderAmount: () => {},
  productList: [],
  setProductList: () => {},
});

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  const [cartDetails, setCartDetails] = useState([]);
  const [message, setMessage] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [token, setToken] = useState("");
  const [buttonColor, setButtonColor] = useState("");
  const [sneakersByBrand, setSneakersByBrand] = useState([]);
  const [totalOrderAmount, setTotalOrderAmount] = useState("");
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken.trim());

      getUserById(storedToken.trim())
        .then((res) => {
          setUserInfo(res);
        })
        .catch((error) => console.error("Error fetching user:", error));

      getCart(storedToken.trim())
        .then((res) => {
          const cartData = res.cartData;
          setCart(cartData);
          return cartData;
        })
        .then((cartData) => {
          fetchCartItemsDetails(cartData).then((details) => {
            setCartDetails(details);
          });
        })
        .catch((error) => console.error("Error fetching cart:", error));
    }
  }, []);

  useEffect(() => {
    getAllSneakers()
      .then((res) => {
        setProductList(res);
      })
      .catch((error) => console.log("Error fetching products:", error));
  }, []);

  useEffect(() => {
    const initialValue = 0;
    const totalOrderValue = cartDetails.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.price * currentValue.quantity,
      initialValue
    );
    setTotalOrderAmount(totalOrderValue);
  }, [cartDetails]);

  useEffect(() => {
    if (Object.keys(cart).length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  const fetchCartItemsDetails = async (cartData) => {
    const itemDetails = await Promise.all(
      Object.keys(cartData).map(async (id) => {
        const item = await getSneakerById(id);
        return { ...item, quantity: cartData[id] };
      })
    );
    return itemDetails;
  };

  const addToCart = async (targetItem) => {
    const itemId = targetItem._id;
    const token = localStorage.getItem("token");

    const newCart = { ...cart };
    if (!newCart[itemId]) {
      newCart[itemId] = 1;
      setMessage(`${targetItem.name} has been added to the cart.`);
    } else {
      newCart[itemId] += 1;
      setMessage(`${targetItem.name} quantity has been updated in the cart.`);
    }
    setCart(newCart);
    setAlertColor("alert-primary");
    setButtonColor("primary");

    try {
      await addSneakerToCart(token, targetItem._id);
      const updatedCartDetails = await fetchCartItemsDetails(newCart);
      setCartDetails(updatedCartDetails);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setMessage("Failed to add item to the cart.");
      setAlertColor("alert-danger");
    }
  };

  const valueContext = {
    addToCart,
    setCart,
    cart,
    cartDetails,
    message,
    setMessage,
    alertColor,
    setAlertColor,
    userInfo,
    setUserInfo,
    setToken,
    token,
    setCartDetails,
    buttonColor,
    setButtonColor,
    sneakersByBrand,
    setSneakersByBrand,
    totalOrderAmount,
    setTotalOrderAmount,
    productList,
    setProductList,
  };

  return (
    <CartContext.Provider value={valueContext}>{children}</CartContext.Provider>
  );
};

export default CartProvider;
export { CartContext };
