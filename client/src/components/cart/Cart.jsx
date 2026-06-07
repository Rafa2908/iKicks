import { useContext, useState } from "react";
import "./Cart.css";
import { CartContext } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteCartItem,
  increaseQuantityInCart,
  decreaseQuantityInCart,
} from "../../service/cart.service";
import { ToastContext } from "../../context/ToastContext";

const Cart = () => {
  const { cart, setCart, total, setTotal } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const [loadingItem, setLoadingItem] = useState(null);

  const items = Array.isArray(cart) ? cart : [];
  const subtotal = Number(total) || 0;
  const tax = subtotal * 0.1;
  const grandTotal = subtotal + tax;

  const updateItemLocally = (sizeId, delta) => {
    setCart((prev) => {
      const next = (prev ?? [])
        .map((item) => {
          if (item.sizeId !== sizeId) return item;
          const pricePerUnit = Number(item.total) / item.quantity;
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty, total: pricePerUnit * newQty };
        })
        .filter((item) => item.quantity > 0);
      setTotal(next.reduce((sum, item) => sum + Number(item.total), 0));
      return next;
    });
  };

  const handleIncrease = async (sizeId) => {
    setLoadingItem(sizeId);
    await increaseQuantityInCart({ sizeId });
    updateItemLocally(sizeId, 1);
    setLoadingItem(null);
    showToast("Quantity increased");
  };

  const handleDecrease = async (sizeId) => {
    const item = items.find((i) => i.sizeId === sizeId);
    const willRemove = item?.quantity === 1;
    setLoadingItem(sizeId);
    await decreaseQuantityInCart({ sizeId });
    updateItemLocally(sizeId, -1);
    setLoadingItem(null);
    showToast(willRemove ? "Item removed from cart" : "Quantity decreased");
  };

  const handleRemove = async (sizeId) => {
    setLoadingItem(sizeId);
    await deleteCartItem({ sizeId });
    setCart((prev) => {
      const next = (prev ?? []).filter((i) => i.sizeId !== sizeId);
      setTotal(next.reduce((sum, item) => sum + Number(item.total), 0));
      return next;
    });
    setLoadingItem(null);
    showToast("Item removed from cart");
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <i className="fa-solid fa-cart-shopping cart-empty-icon" />
        <h2 className="cart-empty-title">Your cart is empty</h2>
        <p className="cart-empty-sub">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link to="/products" className="cart-shop-btn">
          Shop Now <i className="fa-solid fa-arrow-right" />
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="cart-title">Shopping Cart</h1>
        <span className="cart-count">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="cart-layout">
        {/* ── Items ──────────────────────────────────────── */}
        <div className="cart-items-card">
          {items.map((item, idx) => {
            const isLoading = loadingItem === item.sizeId;
            return (
              <div
                key={item.sizeId ?? idx}
                className={`cart-item${idx < items.length - 1 ? " cart-item-divider" : ""}${isLoading ? " cart-item-loading" : ""}`}
              >
                <div className="cart-item-img-wrap">
                  <img
                    className="cart-item-img"
                    src={item.image}
                    alt={item.name}
                  />
                </div>

                <div className="cart-item-info">
                  <p className="cart-item-brand">{item.brand}</p>
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-size">US {item.size}</p>
                </div>

                <div className="cart-item-qty">
                  <button
                    className="cart-qty-btn"
                    onClick={() => handleDecrease(item.sizeId)}
                    disabled={isLoading}
                    aria-label="Decrease quantity"
                  >
                    <i className="fa-solid fa-minus" />
                  </button>
                  <span className="cart-qty-val">{item.quantity}</span>
                  <button
                    className="cart-qty-btn"
                    onClick={() => handleIncrease(item.sizeId)}
                    disabled={isLoading}
                    aria-label="Increase quantity"
                  >
                    <i className="fa-solid fa-plus" />
                  </button>
                </div>

                <span className="cart-item-price">
                  USD${Number(item.total).toLocaleString()}
                </span>

                <button
                  className="cart-item-remove"
                  onClick={() => handleRemove(item.sizeId)}
                  disabled={isLoading}
                  title="Remove item"
                  aria-label="Remove item"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            );
          })}
        </div>

        {/* ── Order Summary ───────────────────────────────── */}
        <aside className="cart-summary">
          <h2 className="cart-summary-title">Order Summary</h2>

          <div className="cart-summary-rows">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>USD${subtotal.toFixed(2).toLocaleString()}</span>
            </div>
            <div className="cart-summary-row">
              <span>Tax (10%)</span>
              <span>USD${tax.toFixed(2)}</span>
            </div>
            <div className="cart-summary-divider" />
            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <span>USD${grandTotal.toFixed(2).toLocaleString()}</span>
            </div>
          </div>

          <button
            className="cart-checkout-btn"
            onClick={() => navigate("/delivery")}
          >
            Proceed to Checkout
            <i className="fa-solid fa-arrow-right" />
          </button>

          <Link to="/products" className="cart-continue-link">
            <i className="fa-solid fa-arrow-left" /> Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
