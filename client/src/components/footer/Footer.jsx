import "./Footer.css";

const Footer = () => {
  return (
    <footer className="d-flex justify-content-around align-items-center">
      <div className="footer-left-section">
        <h4>Logo Here</h4>
        <p>Office in Santiago, Rep.Dom</p>
        <p>Delivery within Dominican Republic</p>
        <p>
          <i className="fa-brands fa-whatsapp"></i> +1 849-999-8598
        </p>
        <p>
          <i className="fa-brands fa-instagram"></i> kicks_district_sti
        </p>
        <p>24/7 Customer Service</p>
      </div>
      <div className="footer-middle-section">
        <p>Size Guide</p>
        <p>Return & Refund Policy</p>
        <p>Order Tracking</p>
        <p>My Account</p>
        <p>Contact Us</p>
      </div>
      <div className="footer-right-section">
        <p>Reviews</p>
        <p>Terms & Conditions</p>
        <p>Shipping Info</p>
        <p>Privacy Policy</p>
        <p>About Us</p>
      </div>
    </footer>
  );
};

export default Footer;
