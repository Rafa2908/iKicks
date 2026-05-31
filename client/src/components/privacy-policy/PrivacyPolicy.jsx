import { useEffect } from "react";
import "./PrivacyPolicy.css";

const sections = [
  {
    title: "1. Information We Collect",
    body: "We collect information you provide directly — such as your name, email address, shipping address, and payment details — when you create an account or place an order. We also collect usage data such as pages visited and device information.",
  },
  {
    title: "2. How We Use Your Information",
    body: "We use your information to process orders, send shipping confirmations, provide customer support, and improve our platform. We may also send promotional emails if you have opted in. You can unsubscribe at any time.",
  },
  {
    title: "3. Payment Security",
    body: "All payment information is processed through Stripe, a PCI-compliant payment processor. iKicks does not store your full card number or CVV. Transactions are encrypted using industry-standard SSL technology.",
  },
  {
    title: "4. Sharing Your Information",
    body: "We do not sell, rent, or trade your personal information to third parties. We may share data with trusted service providers (e.g., shipping carriers, payment processors) solely to fulfill your order. We may disclose information if required by law.",
  },
  {
    title: "5. Cookies",
    body: "We use cookies to maintain your session, remember your preferences, and analyze site traffic. You can disable cookies in your browser settings, but some features may not function correctly without them.",
  },
  {
    title: "6. Data Retention",
    body: "We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting us.",
  },
  {
    title: "7. Your Rights",
    body: "You have the right to access, correct, or delete your personal information. To exercise these rights, contact us at support@ikicks.com. We will respond within 30 days.",
  },
  {
    title: "8. Third-Party Links",
    body: "Our website may contain links to third-party sites. We are not responsible for the privacy practices of those sites. We encourage you to review their privacy policies before providing any personal information.",
  },
  {
    title: "9. Children's Privacy",
    body: "iKicks is not directed at children under 13. We do not knowingly collect personal information from minors. If you believe we have inadvertently collected such information, please contact us immediately.",
  },
  {
    title: "10. Changes to This Policy",
    body: "We may update this Privacy Policy periodically. Changes will be posted here with an updated effective date. Your continued use of the platform after changes constitutes acceptance of the updated policy.",
  },
];

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <div className="pp-hero">
        <h1 className="pp-hero-title">Privacy Policy</h1>
        <p className="pp-hero-sub">Effective date: January 1, 2025</p>
      </div>

      <div className="pp-content">
        <p className="pp-intro">
          At iKicks, your privacy matters. This policy explains what data we collect,
          how we use it, and the choices you have regarding your information.
        </p>

        <div className="pp-sections">
          {sections.map((s) => (
            <div key={s.title} className="pp-section">
              <h2 className="pp-section-title">{s.title}</h2>
              <p className="pp-section-body">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="pp-footer-note">
          <p>
            Questions about your privacy? Reach us at{" "}
            <a href="mailto:support@ikicks.com" className="pp-link">
              support@ikicks.com
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
