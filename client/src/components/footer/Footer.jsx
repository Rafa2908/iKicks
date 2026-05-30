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
            <li>Size Guide</li>
            <li>Return &amp; Refund Policy</li>
            <li>Order Tracking</li>
            <li>Contact Us</li>
            <li>24/7 Customer Service</li>
          </ul>
        </div>

        <div className="footer-links-col">
          <p className="footer-col-title">Company</p>
          <ul>
            <li>About Us</li>
            <li>Reviews</li>
            <li>Shipping Info</li>
            <li>Terms &amp; Conditions</li>
            <li>Privacy Policy</li>
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
