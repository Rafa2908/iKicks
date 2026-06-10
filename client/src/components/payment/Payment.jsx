import { useState, useContext } from "react";
import "./Payment.css";
import { CartContext } from "../../context/CartContext";

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

const Payment = () => {
  const { cart, total } = useContext(CartContext);

  const items = Array.isArray(cart) ? cart : [];
  const subtotal = Number(total) || 0;
  const tax = subtotal * 0.1;
  const grandTotal = subtotal + tax;

  const [showAll, setShowAll] = useState(false);
  const [method, setMethod] = useState(null);
  const [flipped, setFlipped] = useState(null);
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [showNumber, setShowNumber] = useState(false);
  const [copied, setCopied] = useState(null);

  const visibleItems = showAll ? items : items.slice(0, VISIBLE_LIMIT);
  const hiddenCount = items.length - VISIBLE_LIMIT;

  /* ── Card input helpers ────────────────────── */
  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})(?=.)/g, "$1 ");
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
  };

  const handleCardInput = (field, val) => {
    if (field === "number") {
      setCardData((p) => ({ ...p, number: formatCardNumber(val) }));
    } else if (field === "expiry") {
      setCardData((p) => ({ ...p, expiry: formatExpiry(val) }));
    } else if (field === "cvv") {
      setCardData((p) => ({ ...p, cvv: val.replace(/\D/g, "").slice(0, 4) }));
    } else {
      setCardData((p) => ({ ...p, [field]: val }));
    }
  };

  const previewNumber = cardData.number
    ? showNumber
      ? cardData.number
      : cardData.number.replace(/\d/g, "●")
    : "●●●● ●●●● ●●●● ●●●●";

  /* ── Payment handlers ──────────────────────── */
  const handleCashOrder = async () => {
    // TODO: implement cash reservation order logic
  };

  const handleBankTransfer = async () => {
    // TODO: implement bank transfer order logic
  };

  const handleCreditCardPayment = async (e) => {
    e.preventDefault();
    // TODO: send payment intent to backend
  };

  const handleCopy = (text, bankId) => {
    navigator.clipboard.writeText(text);
    setCopied(bankId);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleMethod = (selected) =>
    setMethod((prev) => (prev === selected ? null : selected));

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
                  <img src={item.image} alt={item.name} className="ck-item-img" />
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
            <button className="ck-show-more" onClick={() => setShowAll((v) => !v)}>
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
                        setFlipped((prev) => (prev === bank.id ? null : bank.id))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setFlipped((prev) => (prev === bank.id ? null : bank.id));
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
                          <p className="ck-bank-back-value">{bank.accountName}</p>
                          <p className="ck-bank-back-label">Account Number</p>
                          <p className="ck-bank-back-number">{bank.accountNumber}</p>
                          <button
                            type="button"
                            className={`ck-bank-copy-btn${copied === bank.id ? " ck-bank-copy-btn--copied" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(bank.accountNumber, bank.id);
                            }}
                          >
                            <i className={`fa-solid fa-${copied === bank.id ? "check" : "copy"}`} />
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
                {/* Card visual */}
                <div className="ck-card-visual">
                  <div className="ck-card-visual-chip">
                    <i className="fa-solid fa-microchip" />
                  </div>
                  <p className="ck-card-visual-number">{previewNumber}</p>
                  <div className="ck-card-visual-bottom">
                    <span>{cardData.name || "CARDHOLDER NAME"}</span>
                    <span>{cardData.expiry || "MM/YY"}</span>
                  </div>
                </div>

                {/* Number */}
                <div className="ck-field">
                  <label>Card Number</label>
                  <div className="ck-field-wrap">
                    <input
                      type={showNumber ? "text" : "password"}
                      placeholder="1234 5678 9012 3456"
                      value={cardData.number}
                      onChange={(e) => handleCardInput("number", e.target.value)}
                      autoComplete="cc-number"
                      inputMode="numeric"
                    />
                    <button
                      type="button"
                      className="ck-eye"
                      onClick={() => setShowNumber((v) => !v)}
                      tabIndex={-1}
                      aria-label={showNumber ? "Hide card number" : "Show card number"}
                    >
                      <i className={`fa-solid fa-eye${showNumber ? "-slash" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Expiry + CVV */}
                <div className="ck-field-row">
                  <div className="ck-field">
                    <label>Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardData.expiry}
                      onChange={(e) => handleCardInput("expiry", e.target.value)}
                      autoComplete="cc-exp"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="ck-field">
                    <label>CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      value={cardData.cvv}
                      onChange={(e) => handleCardInput("cvv", e.target.value)}
                      autoComplete="cc-csc"
                      inputMode="numeric"
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="ck-field">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="Full name on card"
                    value={cardData.name}
                    onChange={(e) => handleCardInput("name", e.target.value)}
                    autoComplete="cc-name"
                  />
                </div>

                <button type="submit" className="ck-submit">
                  <i className="fa-solid fa-lock" /> Pay $
                  {grandTotal.toFixed(2)}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Payment;
