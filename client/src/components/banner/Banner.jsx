import "./Banner.css";
import banner1 from "../../assets/banner/jordan-pic.jpg";
import banner2 from "../../assets/banner/jordan4-pic.jpg";
import banner3 from "../../assets/banner/jordan1.webp";
import banner4 from "../../assets/banner/futura-sb.jfif";

const Banner = () => {
  return (
    <div className="d-flex justify-content-between align-items-center pic-banner">
      <img src={banner1} alt="" />
      <img src={banner2} alt="" />
      <img src={banner3} alt="" />
      <img src={banner4} alt="" />
    </div>
  );
};

export default Banner;
