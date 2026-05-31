import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand-col">
          <p className="footer-brand">iKicks</p>
          <p className="footer-tagline">Premium-quality, authentic footwear for sneaker aficionados.</p>
          <div className="footer-contact">
            <p>
              <i className="fa-brands fa-whatsapp" />
              +1 849-999-8598
            </p>
            <p>
              <i className="fa-brands fa-instagram" />
              kicks_district_sti
            </p>
            <p>
              <i className="fa-solid fa-location-dot" />
              Santiago, Rep. Dom.
            </p>
          </div>
        </div>

        <div className="footer-links-col">
          <p className="footer-col-title">Support</p>
          <ul>
            <li><Link to="/size-guide">Size Guide</Link></li>
            <li><Link to="/terms">Return &amp; Refund Policy</Link></li>
            <li><Link to="/contact">Order Tracking</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/contact">24/7 Customer Service</Link></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <p className="footer-col-title">Company</p>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/reviews">Reviews</Link></li>
            <li><Link to="/shipping">Shipping Info</Link></li>
            <li><Link to="/terms">Terms &amp; Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} iKicks. All rights reserved.</p>
        <p>Delivering authentic sneakers across the Dominican Republic.</p>
      </div>
    </footer>
  );
};

export default Footer;
