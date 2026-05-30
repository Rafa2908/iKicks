import "./Abovenav.css";
import { Link } from "react-router-dom";

const Abovenav = () => {
  return (
    <div className="abovenav">
      <Link to="/" className="an-link">24/7 Customer Service</Link>
      <p className="an-tagline">Premium-Quality, Authentic Footwear for Sneaker Aficionados</p>
      <Link to="/" className="an-link">Contact Us</Link>
    </div>
  );
};

export default Abovenav;
