import { useEffect } from "react";
import "./TermsAndConditions.css";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using iKicks, you agree to be bound by these Terms and Conditions. If you do not agree to all of these terms, you may not use our platform.",
  },
  {
    title: "2. Products & Authenticity",
    body: "All products sold on iKicks are guaranteed to be 100% authentic. We do not sell replicas or counterfeit items. Each product is inspected before shipment. If you receive an item that does not meet our authenticity standards, you are eligible for a full refund.",
  },
  {
    title: "3. Pricing",
    body: "Prices are listed in Dominican Pesos (RD$) and are subject to change without notice. Promotions or discounts cannot be applied retroactively. iKicks reserves the right to cancel any order due to pricing errors.",
  },
  {
    title: "4. Orders & Payments",
    body: "Orders are confirmed upon successful payment. We accept major credit and debit cards through our secure payment processor. By placing an order, you confirm that all information provided is accurate and complete.",
  },
  {
    title: "5. Shipping & Delivery",
    body: "Delivery times are estimates and may vary. iKicks is not responsible for delays caused by third-party carriers or unforeseen circumstances. Risk of loss passes to the customer upon handoff to the carrier.",
  },
  {
    title: "6. Returns & Refunds",
    body: "Returns are accepted within 7 days of delivery for items in their original, unworn condition with all tags attached. Sale items are final sale. Contact us to initiate a return. Refunds are issued to the original payment method within 5–7 business days.",
  },
  {
    title: "7. User Accounts",
    body: "You are responsible for maintaining the confidentiality of your account credentials. Any activity that occurs under your account is your responsibility. iKicks reserves the right to terminate accounts that violate these terms.",
  },
  {
    title: "8. Intellectual Property",
    body: "All content on this platform — including logos, images, text, and design — is the property of iKicks or its licensors. Unauthorized reproduction or distribution is prohibited.",
  },
  {
    title: "9. Limitation of Liability",
    body: "iKicks is not liable for indirect, incidental, or consequential damages arising from the use of our platform. Our total liability shall not exceed the amount paid for the order in question.",
  },
  {
    title: "10. Changes to Terms",
    body: "We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated effective date. Continued use of the platform constitutes acceptance of the updated terms.",
  },
];

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <div className="terms-hero">
        <h1 className="terms-hero-title">Terms &amp; Conditions</h1>
        <p className="terms-hero-sub">Effective date: January 1, 2025</p>
      </div>

      <div className="terms-content">
        <p className="terms-intro">
          Please read these Terms and Conditions carefully before using the iKicks platform.
          These terms govern your access to and use of our website, products, and services.
        </p>

        <div className="terms-sections">
          {sections.map((s) => (
            <div key={s.title} className="terms-section">
              <h2 className="terms-section-title">{s.title}</h2>
              <p className="terms-section-body">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="terms-footer-note">
          <p>
            Questions about our Terms? Contact us at{" "}
            <a href="mailto:support@ikicks.com" className="terms-link">
              support@ikicks.com
            </a>{" "}
            or via WhatsApp at <strong>+1 849-999-8598</strong>.
          </p>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;
