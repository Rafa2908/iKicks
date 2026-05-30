import "./Banner.css";
import banner1 from "../../assets/banner/jordan-pic.jpg";
import banner2 from "../../assets/banner/jordan4-pic.jpg";
import banner3 from "../../assets/banner/jordan1.webp";
import banner4 from "../../assets/banner/oncloud-monster.webp";
import banner5 from "../../assets/banner/new-balance.jpg";
import banner6 from "../../assets/banner/asics-shoes.jpg";
import banner7 from "../../assets/banner/adidas-samba.webp";
import banner8 from "../../assets/banner/nike-vomero.jfif";
import banner9 from "../../assets/banner/off-white-shoes.jpg";

const banners = [
  { src: banner1, label: "Air Jordan" },
  { src: banner2, label: "Jordan 4" },
  { src: banner3, label: "Jordan 1" },
  { src: banner4, label: "On Cloud" },
  { src: banner5, label: "New Balance" },
  { src: banner6, label: "Asics" },
  { src: banner7, label: "Adidas Samba" },
  { src: banner8, label: "Nike Vomero" },
  { src: banner9, label: "Off-White" },
];

const Banner = () => {
  return (
    <section className="banner">
      <div className="banner-track">
        {[...banners, ...banners].map((item, i) => (
          <div key={i} className="banner-card">
            <img src={item.src} alt={item.label} />
            <div className="banner-overlay">
              <span className="banner-label">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Banner;
