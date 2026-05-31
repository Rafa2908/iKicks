import { useEffect } from "react";
import "./About.css";

const values = [
  {
    icon: "fa-solid fa-certificate",
    title: "100% Authentic",
    desc: "Every pair is verified and authenticated before it reaches your hands.",
  },
  {
    icon: "fa-solid fa-star",
    title: "Premium Quality",
    desc: "We source only the finest sneakers from trusted suppliers worldwide.",
  },
  {
    icon: "fa-solid fa-headset",
    title: "24/7 Support",
    desc: "Our team is always here to help — before, during, and after your purchase.",
  },
];

const stats = [
  { number: "500+", label: "Products" },
  { number: "2K+", label: "Happy Customers" },
  { number: "100%", label: "Authentic" },
  { number: "3+", label: "Years in Business" },
];

const About = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <div className="about-hero">
        <h1 className="about-hero-title">About iKicks</h1>
        <p className="about-hero-sub">Born from passion. Built for sneakerheads.</p>
      </div>

      <div className="about-content">
        <section className="about-story">
          <h2 className="about-section-title">Our Story</h2>
          <p className="about-text">
            iKicks was founded in Santiago, Dominican Republic with a single
            mission: to bring authentic, premium sneakers to passionate collectors
            across the island. What started as a small operation among friends has
            grown into the most trusted sneaker destination in the DR.
          </p>
          <p className="about-text">
            We believe that great sneakers aren&apos;t just footwear — they&apos;re
            culture, art, and identity. Every pair in our inventory is carefully
            selected, verified, and delivered with the care it deserves.
          </p>
        </section>

        <div className="about-divider" />

        <section>
          <h2 className="about-section-title">What We Stand For</h2>
          <div className="about-values-grid">
            {values.map((v) => (
              <div key={v.title} className="about-value-card">
                <div className="about-value-icon">
                  <i className={v.icon} />
                </div>
                <h3 className="about-value-title">{v.title}</h3>
                <p className="about-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="about-divider" />

        <section className="about-stats">
          {stats.map((s) => (
            <div key={s.label} className="about-stat">
              <p className="about-stat-number">{s.number}</p>
              <p className="about-stat-label">{s.label}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  );
};

export default About;
