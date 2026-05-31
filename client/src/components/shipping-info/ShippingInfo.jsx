import { useEffect } from "react";
import "./ShippingInfo.css";

const methods = [
  {
    icon: "fa-solid fa-truck",
    title: "Standard Delivery",
    time: "3 – 5 Business Days",
    price: "RD$300",
    desc: "Available nationwide across the Dominican Republic.",
  },
  {
    icon: "fa-solid fa-bolt",
    title: "Express Delivery",
    time: "1 – 2 Business Days",
    price: "RD$600",
    desc: "Priority handling and next-day delivery to most areas.",
  },
  {
    icon: "fa-solid fa-gift",
    title: "Free Shipping",
    time: "3 – 5 Business Days",
    price: "Free",
    desc: "On all orders over RD$8,000. Automatically applied at checkout.",
  },
];

const faqs = [
  {
    q: "Where do you ship?",
    a: "We ship to all provinces across the Dominican Republic. International shipping is currently unavailable.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order ships, you will receive a confirmation email with a tracking link.",
  },
  {
    q: "Can I change my delivery address after placing an order?",
    a: "Contact us within 1 hour of placing your order and we will do our best to update the address.",
  },
  {
    q: "What if my package is delayed?",
    a: "Delays can occur during peak seasons. If your order hasn't arrived within 7 business days, reach out to us.",
  },
];

const ShippingInfo = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <div className="shi-hero">
        <h1 className="shi-hero-title">Shipping Info</h1>
        <p className="shi-hero-sub">Fast, reliable delivery across the Dominican Republic.</p>
      </div>

      <div className="shi-content">
        <section>
          <h2 className="shi-section-title">Delivery Options</h2>
          <div className="shi-methods-grid">
            {methods.map((m) => (
              <div key={m.title} className="shi-method-card">
                <div className="shi-method-icon">
                  <i className={m.icon} />
                </div>
                <div className="shi-method-body">
                  <div className="shi-method-top">
                    <h3 className="shi-method-title">{m.title}</h3>
                    <span className={`shi-method-price ${m.price === "Free" ? "free" : ""}`}>
                      {m.price}
                    </span>
                  </div>
                  <p className="shi-method-time">
                    <i className="fa-regular fa-clock" /> {m.time}
                  </p>
                  <p className="shi-method-desc">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="shi-divider" />

        <section>
          <h2 className="shi-section-title">Frequently Asked Questions</h2>
          <div className="shi-faqs">
            {faqs.map((f) => (
              <div key={f.q} className="shi-faq">
                <p className="shi-faq-q">
                  <i className="fa-solid fa-circle-question" /> {f.q}
                </p>
                <p className="shi-faq-a">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="shi-divider" />

        <section className="shi-note">
          <i className="fa-solid fa-circle-info" />
          <p>
            Delivery times are estimates and may vary during holidays or peak seasons.
            For urgent inquiries, contact us on WhatsApp at <strong>+1 849-999-8598</strong>.
          </p>
        </section>
      </div>
    </>
  );
};

export default ShippingInfo;
