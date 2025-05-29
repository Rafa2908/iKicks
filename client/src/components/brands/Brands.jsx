import "./Brands.css";
import brand1 from "../../assets/brands/Jordan_logo.png";
import brand2 from "../../assets/brands/new-balance-logo.png";
import brand3 from "../../assets/brands/Nike-Logo.jpg";
import brand4 from "../../assets/brands/Off-White-logo.png";
import brand5 from "../../assets/brands/Yeezy-Logo.png";

const Brands = () => {
  return (
    <div className="d-flex justify-content-around align-items-center brand-img">
      <img src={brand1} alt="" />
      <img src={brand2} alt="" />
      <img src={brand3} alt="" />
      <img src={brand4} alt="" />
      <img src={brand5} alt="" />
    </div>
  );
};

export default Brands;
