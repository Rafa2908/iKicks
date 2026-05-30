import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Banner from "../banner/Banner";
import Brands from "../brands/Brands";
import Sneaker from "../sneakers/Sneaker";
import "./Home.css";

import slide1 from "../../assets/home/off-white.webp";
import slide2 from "../../assets/home/adidas-jellyfish.jpg";
import slide3 from "../../assets/home/nike-blazer.avif";
import slide4 from "../../assets/home/oncloud.jfif";
import slide5 from "../../assets/home/asics.jpg";
import slide6 from "../../assets/home/travis-shoes.avif";
import slide7 from "../../assets/home/jordan-union.jpeg";
import slide8 from "../../assets/home/yeezy.webp";
import slide9 from "../../assets/home/nike-offwhite.jpg";

const slides = [
  { src: slide1, label: "Off-White × Nike",      sub: "Limited Drop" },
  { src: slide2, label: "Adidas Jellyfish",        sub: "New Arrival" },
  { src: slide3, label: "Nike Blazer",             sub: "Classic Silhouette" },
  { src: slide4, label: "On Cloud",                sub: "Performance Meets Style" },
  { src: slide5, label: "Asics",                   sub: "Built to Perform" },
  { src: slide6, label: "Travis Scott × Nike",     sub: "Exclusive Collab" },
  { src: slide7, label: "Jordan × Union",          sub: "Collector's Edition" },
  { src: slide8, label: "Yeezy",                   sub: "Kanye's Vision" },
  { src: slide9, label: "Nike × Off-White",        sub: "The Ten Collection" },
];

const Home = () => {
  const { message, setMessage } = useContext(UserContext);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [message, setMessage]);

  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setCurrent((p) => (p + 1) % slides.length);

  return (
    <>
      {/* Toast notification */}
      {message && (
        <div className="home-toast">
          <i className="fa-solid fa-circle-check" />
          <span>{message}</span>
          <button className="home-toast-close" onClick={() => setMessage("")} aria-label="Dismiss">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      )}

      {/* Hero carousel */}
      <section className="hero">
        {/* Slides */}
        {slides.map((slide, i) => (
          <div key={i} className={`hero-slide ${i === current ? "active" : ""}`}>
            <img src={slide.src} alt={slide.label} />
          </div>
        ))}

        {/* Gradient overlay */}
        <div className="hero-overlay" />

        {/* Text content */}
        <div className="hero-content">
          <div key={current} className="hero-content-inner">
            <p className="hero-sub">{slides[current].sub}</p>
            <h1 className="hero-headline">{slides[current].label}</h1>
            <Link className="hero-btn" to="/products">Shop Now</Link>
          </div>
        </div>

        {/* Arrows */}
        <button className="hero-arrow left" onClick={prev} aria-label="Previous slide">
          <i className="fa-solid fa-chevron-left" />
        </button>
        <button className="hero-arrow right" onClick={next} aria-label="Next slide">
          <i className="fa-solid fa-chevron-right" />
        </button>

        {/* Dot indicators */}
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === current ? "active" : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      <Banner />
      <Sneaker />
      <Brands />
    </>
  );
};

export default Home;
