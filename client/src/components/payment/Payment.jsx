import { useState, useContext } from "react";
import "./Payment.css";
import { CartContext } from "../../context/CartContext";
import { placeOrder } from "../../service/order.service";
import { makePayment } from "../../service/payment.service";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const VISIBLE_LIMIT = 4;

const BANKS = [
  {
    id: "popular",
    name: "Banco Popular",
    abbr: "BPPR",
    color: "#c8102e",
    accountName: "iKicks LLC",
    accountNumber: "123-456-789-0",
  },
  {
    id: "firstbank",
    name: "FirstBank PR",
    abbr: "FB",
    color: "#003087",
    accountName: "iKicks LLC",
    accountNumber: "987-654-321-0",
  },
  {
    id: "oriental",
    name: "Oriental Bank",
    abbr: "OB",
    color: "#006341",
    accountName: "iKicks LLC",
    accountNumber: "456-789-012-0",
  },
];

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1a1a1a",
      "::placeholder": { color: "#aab7c4" },
    },
    invalid: { color: "#e53935" },
  },
};

const PaymentForm = () => {
  const { cart, total, deliveryInfo } = useContext(CartContext);
  const stripe = useStripe();
  const elements = useElements();

  const items = Array.isArray(cart) ? cart : [];
  const subtotal = Number(total) || 0;
  const tax = subtotal * 0.1;
  const grandTotal = subtotal + tax;

  const [showAll, setShowAll] = useState(false);
  const [method, setMethod] = useState(null);
  const [flipped, setFlipped] = useState(null);
  const [copied, setCopied] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [success, setSuccess] = useState(false);

  const visibleItems = showAll ? items : items.slice(0, VISIBLE_LIMIT);
  const hiddenCount = items.length - VISIBLE_LIMIT;

  const handleCashOrder = async () => {
    // TODO: implement cash reservation order logic
  };

  const handleBankTransfer = async () => {
    // TODO: implement bank transfer order logic
  };

  const handleCopy = (text, bankId) => {
    navigator.clipboard.writeText(text);
    setCopied(bankId);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleMethod = (selected) =>
    setMethod((prev) => (prev === selected ? null : selected));

  const handleCreditCardPayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setPaymentError(null);

    const orderRes = await placeOrder(deliveryInfo);
    if (!orderRes?.orderId) {
      setPaymentError("Failed to place order. Please try again.");
      setLoading(false);
      return;
    }

    const paymentRes = await makePayment(orderRes.orderId);
    if (!paymentRes?.clientSecret) {
      setPaymentError("Payment initialization failed. Please try again.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error } = await stripe.confirmCardPayment(paymentRes.clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      setPaymentError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="ck-page">
        <p>Payment successful! Check your email for confirmation.</p>
      </div>
    );
  }

  return (
    <div className="ck-page">
      <div className="ck-layout">
        {/* ── Left: Order items ────────────────────── */}
        <section className="ck-section">
          <h2 className="ck-section-title">
            <i className="fa-solid fa-bag-shopping" /> Order Summary
          </h2>

          <div className="ck-items-list">
            {visibleItems.map((item, idx) => (
              <div key={item.sizeId ?? idx} className="ck-item">
                <div className="ck-item-img-wrap">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="ck-item-img"
                  />
                </div>
                <div className="ck-item-info">
                  <p className="ck-item-brand">{item.brand}</p>
                  <p className="ck-item-name">{item.name}</p>
                  <p className="ck-item-meta">
                    US {item.size}&nbsp;·&nbsp;Qty {item.quantity}
                  </p>
                </div>
                <span className="ck-item-price">
                  $
                  {Number(item.total).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            ))}
          </div>

          {hiddenCount > 0 && (
            <button
              className="ck-show-more"
              onClick={() => setShowAll((v) => !v)}
            >
              <i className={`fa-solid fa-chevron-${showAll ? "up" : "down"}`} />
              {showAll
                ? "Show less"
                : `Show ${hiddenCount} more ${hiddenCount === 1 ? "item" : "items"}`}
            </button>
          )}

          <div className="ck-totals">
            <div className="ck-total-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="ck-total-row">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="ck-total-divider" />
            <div className="ck-total-row ck-total-grand">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* ── Right: Payment ───────────────────────── */}
        <section className="ck-section">
          <h2 className="ck-section-title">
            <i className="fa-solid fa-lock" /> Payment Method
          </h2>

          <div className="ck-methods">
            {/* ── Cash ───────────────────────────── */}
            <button
              type="button"
              className={`ck-method-btn${method === "cash" ? " ck-method-btn--active" : ""}`}
              onClick={() => toggleMethod("cash")}
            >
              <div className="ck-method-icon ck-method-icon--cash">
                <i className="fa-solid fa-money-bill-wave" />
              </div>
              <span className="ck-method-label">Cash</span>
              <i
                className={`fa-solid fa-chevron-${method === "cash" ? "up" : "down"} ck-chevron`}
              />
            </button>

            {method === "cash" && (
              <div className="ck-panel">
                <div className="ck-panel-icon">
                  <i className="fa-solid fa-store" />
                </div>
                <p className="ck-panel-title">Pay In Person</p>
                <p className="ck-panel-body">
                  Your order will be reserved and held for{" "}
                  <strong>3 days</strong>. Visit any of our locations with your
                  order confirmation to complete payment and pick up your kicks.
                  After 3 days the reservation is automatically released.
                </p>
                <button className="ck-submit" onClick={handleCashOrder}>
                  Reserve My Order
                </button>
              </div>
            )}

            {/* ── Bank Transfer ───────────────────── */}
            <button
              type="button"
              className={`ck-method-btn${method === "bank" ? " ck-method-btn--active" : ""}`}
              onClick={() => toggleMethod("bank")}
            >
              <div className="ck-method-icon ck-method-icon--bank">
                <i className="fa-solid fa-building-columns" />
              </div>
              <span className="ck-method-label">Bank Transfer</span>
              <i
                className={`fa-solid fa-chevron-${method === "bank" ? "up" : "down"} ck-chevron`}
              />
            </button>

            {method === "bank" && (
              <div className="ck-panel">
                <p className="ck-panel-body">
                  Select a bank and tap the card to view account details.
                </p>
                <div className="ck-bank-cards">
                  {BANKS.map((bank) => (
                    <div
                      key={bank.id}
                      role="button"
                      tabIndex={0}
                      className={`ck-bank-card${flipped === bank.id ? " ck-bank-card--flipped" : ""}`}
                      onClick={() =>
                        setFlipped((prev) =>
                          prev === bank.id ? null : bank.id,
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setFlipped((prev) =>
                            prev === bank.id ? null : bank.id,
                          );
                        }
                      }}
                      aria-label={`View ${bank.name} account details`}
                    >
                      <div className="ck-bank-inner">
                        {/* Front */}
                        <div className="ck-bank-face ck-bank-front">
                          <div
                            className="ck-bank-logo"
                            style={{ background: bank.color }}
                          >
                            {bank.abbr}
                          </div>
                          <span className="ck-bank-name">{bank.name}</span>
                          <span className="ck-bank-hint">Tap for details</span>
                        </div>
                        {/* Back */}
                        <div className="ck-bank-face ck-bank-back">
                          <p className="ck-bank-back-label">Account Name</p>
                          <p className="ck-bank-back-value">
                            {bank.accountName}
                          </p>
                          <p className="ck-bank-back-label">Account Number</p>
                          <p className="ck-bank-back-number">
                            {bank.accountNumber}
                          </p>
                          <button
                            type="button"
                            className={`ck-bank-copy-btn${copied === bank.id ? " ck-bank-copy-btn--copied" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(bank.accountNumber, bank.id);
                            }}
                          >
                            <i
                              className={`fa-solid fa-${copied === bank.id ? "check" : "copy"}`}
                            />
                            {copied === bank.id ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="ck-submit" onClick={handleBankTransfer}>
                  Confirm Bank Transfer
                </button>
              </div>
            )}

            {/* ── Credit Card ─────────────────────── */}
            <button
              type="button"
              className={`ck-method-btn${method === "card" ? " ck-method-btn--active" : ""}`}
              onClick={() => toggleMethod("card")}
            >
              <div className="ck-method-icon ck-method-icon--card">
                <i className="fa-solid fa-credit-card" />
              </div>
              <span className="ck-method-label">Credit Card</span>
              <i
                className={`fa-solid fa-chevron-${method === "card" ? "up" : "down"} ck-chevron`}
              />
            </button>

            {method === "card" && (
              <form
                className="ck-panel ck-panel--card"
                onSubmit={handleCreditCardPayment}
                noValidate
              >
                <div className="ck-field">
                  <label>Card Details</label>
                  <div className="ck-stripe-card-wrap">
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                  </div>
                </div>

                {paymentError && (
                  <p className="ck-error">{paymentError}</p>
                )}

                <button
                  type="submit"
                  className="ck-submit"
                  disabled={!stripe || loading}
                >
                  <i className="fa-solid fa-lock" />
                  {loading ? " Processing…" : ` Pay $${grandTotal.toFixed(2)}`}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const Payment = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default Payment;
