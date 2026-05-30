import "./Brands.css";
import brand1 from "../../assets/brands/Jordan_logo.png";
import brand2 from "../../assets/brands/Nike-Logo.jpg";
import brand3 from "../../assets/brands/new-balance-logo.png";
import brand4 from "../../assets/brands/Off-White-logo.png";
import brand5 from "../../assets/brands/Yeezy-Logo.png";
import brand6 from "../../assets/brands/oncloud-logo.png";
import brand7 from "../../assets/brands/asics-logo.png";

const brands = [
  { src: brand1, name: "Jordan" },
  { src: brand2, name: "Nike" },
  { src: brand3, name: "New Balance" },
  { src: brand4, name: "Off-White" },
  { src: brand5, name: "Yeezy" },
  { src: brand6, name: "On Cloud" },
  { src: brand7, name: "Asics" },
];

const Brands = () => {
  return (
    <section className="brands">
      <h2 className="brands-title">Featured Brands</h2>
      <div className="brands-track">
        {[...brands, ...brands].map((brand, i) => (
          <div key={i} className="brand-pill">
            <img src={brand.src} alt={brand.name} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Brands;
