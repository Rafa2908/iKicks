import { useEffect } from "react";
import PropTypes from "prop-types";
import "./Reviews.css";

const reviews = [
  {
    id: 1,
    name: "Carlos M.",
    date: "April 2025",
    rating: 5,
    text: "Absolutely love my Jordan 4s. Arrived in perfect condition, 100% authentic. Fast shipping too!",
  },
  {
    id: 2,
    name: "Maria L.",
    date: "March 2025",
    rating: 5,
    text: "Best sneaker shop in the DR. Ordered a pair of Sambas and they came in 2 days. Unbelievable service.",
  },
  {
    id: 3,
    name: "Rafael G.",
    date: "March 2025",
    rating: 5,
    text: "The Nike Vomero is everything. Packaging was immaculate and the price was fair for the quality.",
  },
  {
    id: 4,
    name: "Daniela R.",
    date: "February 2025",
    rating: 5,
    text: "Finally a trustworthy source for sneakers locally. Got my Off-Whites and they are the real deal.",
  },
  {
    id: 5,
    name: "Jorge P.",
    date: "February 2025",
    rating: 4,
    text: "Great selection and super easy checkout. Delivery took a day longer than expected but still happy.",
  },
  {
    id: 6,
    name: "Laura S.",
    date: "January 2025",
    rating: 5,
    text: "I have ordered 3 pairs already and every single one has been perfect. iKicks is my go-to.",
  },
];

const Stars = ({ count }) => (
  <div className="rev-stars">
    {[...Array(5)].map((_, i) => (
      <i key={i} className={`fa-${i < count ? "solid" : "regular"} fa-star`} />
    ))}
  </div>
);

Stars.propTypes = { count: PropTypes.number.isRequired };

const Reviews = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <div className="rev-hero">
        <h1 className="rev-hero-title">Customer Reviews</h1>
        <p className="rev-hero-sub">Real customers. Real opinions.</p>
      </div>

      <section className="rev-section">
        <div className="rev-summary">
          <p className="rev-avg">4.9</p>
          <Stars count={5} />
          <p className="rev-count">Based on {reviews.length} reviews</p>
        </div>

        <div className="rev-grid">
          {reviews.map((r) => (
            <div key={r.id} className="rev-card">
              <Stars count={r.rating} />
              <p className="rev-text">{r.text}</p>
              <div className="rev-card-footer">
                <span className="rev-name">{r.name}</span>
                <span className="rev-date">{r.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Reviews;
