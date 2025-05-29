import "./Abovenav.css";
import { Link } from "react-router-dom";

const Abovenav = () => {
  return (
    <div className="above">
      <Link className="link">24/7 Customer Service</Link>
      <p>Premium-Quality, Authentic Footwear for Sneaker Afficionatos</p>
      <Link className="link">Contact Us</Link>
    </div>
  );
};

export default Abovenav;
