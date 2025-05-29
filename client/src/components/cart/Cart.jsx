import React, { useContext, useEffect } from "react";
import {
  addSneakerToCart,
  deleteSneakerFromCart,
} from "../../service/client.service";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import "./Cart.css";

const Cart = () => {
  const {
    cartDetails,
    setCartDetails,
    setCart,
    token,
    setTotalOrderAmount,
    totalOrderAmount,
  } = useContext(CartContext);
  const navigate = useNavigate();

  const calculateTotalOrder = (product) => {
    const prices = cartDetails.map((item) => item.price * item.quantity);
    const total = prices.reduce((sum, price) => sum + price, 0);
    return total;
  };

  const deleteItemFromCart = async (itemId) => {
    try {
      await deleteSneakerFromCart(token, itemId);
      setCartDetails((prevCartDetails) =>
        prevCartDetails
          .map((cartItem) => {
            if (cartItem._id === itemId) {
              if (cartItem.quantity > 1) {
                return { ...cartItem, quantity: cartItem.quantity - 1 };
              } else {
                return null;
              }
            }
            return cartItem;
          })
          .filter(Boolean)
      );

      setCart((prevCart) => {
        const newCart = { ...prevCart };
        if (newCart[itemId] > 1) {
          newCart[itemId] -= 1;
        } else {
          delete newCart[itemId];
        }
        return newCart;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const increaseCartQty = async (itemId) => {
    try {
      await addSneakerToCart(token, itemId);
      setCartDetails((prevCartDetails) =>
        prevCartDetails.map((cartItem) => {
          if (cartItem._id === itemId) {
            return { ...cartItem, quantity: cartItem.quantity + 1 };
          }
          return cartItem;
        })
      );

      setCart((prevCart) => {
        const newCart = { ...prevCart };
        if (newCart[itemId]) {
          newCart[itemId] += 1;
        } else {
          newCart[itemId] = 1;
        }
        return newCart;
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const totalPrice = calculateTotalOrder();
    const totalTaxes = totalPrice * 0.1;
    const totalOrder = totalPrice + totalTaxes;
    setTotalOrderAmount(totalOrder);
  }, [cartDetails, setTotalOrderAmount]);

  const handleCheckout = () => {
    if (token) {
      navigate("/delivery");
    } else {
      navigate("/register");
      setAlertColor("alert-danger");
      setButtonColor("danger");
      setMessage("You must register or login to proceed with purchase.");
    }
  };

  return (
    <div className="d-flex flex-column justify-content-lg-start">
      <h1 className="mx-5 mt-5">Shopping Cart</h1>
      {cartDetails.length === 0 ? (
        <div className="text-center">
          <h2 className="mt-5 display-1">Cart Empty</h2>
          <p className="display-5">Checkout our latest Sneakers</p>
          <Link to={"/products"} className="btn btn-outline-primary">
            Shop Now
          </Link>
        </div>
      ) : (
        <h3 className="mx-5">({cartDetails.length}) Items in cart</h3>
      )}

      <div className="cart-container d-flex">
        <main className="d-flex flex-column mb-5 item-gap">
          {cartDetails.map((item) => (
            <div
              className="d-flex justify-content-evenly align-items-center gap-5 flex glass"
              key={item._id}
            >
              <div className="main-container-1">
                <img src={item.image?.image1} className="item-img" />
              </div>
              <div className="main-container-2">
                <b>{item.name}</b>
                <p>Size: US Women=11.0, Men=9.5, UK=9.0, EUR=43.0</p>
              </div>
              <div className="main-container-3">
                <i
                  className="fa-solid fa-circle-minus text-danger icons-qty"
                  onClick={() => deleteItemFromCart(item._id)}
                ></i>
                <span className="qty-text">{item.quantity}</span>
                <i
                  className="fa-solid fa-circle-plus text-success icons-qty"
                  onClick={() => increaseCartQty(item._id)}
                ></i>
              </div>

              <div className="main-container-4">
                <p>${calculateTotalOrder(item.price, item.quantity)}.00</p>
              </div>
            </div>
          ))}
        </main>
        {cartDetails.length >= 1 && (
          <aside className="glass-aside">
            <div className="aside-container mb-5">
              <h2 className="mb-5 text-center">Order Detail</h2>
              <div className="subtotal">
                <p>Subtotal:</p>
                <p>${calculateTotalOrder().toFixed(2)}</p>
              </div>
              <div className="estimated-taxes">
                <p>Estimated Taxes (10%):</p>
                <p>${(calculateTotalOrder() * 0.1).toFixed(2)}</p>
              </div>
              <div className="total-order">
                <p>Total:</p>
                <p>${Number(totalOrderAmount).toFixed(2)}</p>
              </div>
              <div className="mt-4 text-center">
                <button
                  className="btn btn-outline-primary"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default Cart;
