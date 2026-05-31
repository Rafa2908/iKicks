import { useNavigate } from "react-router-dom";
import "./Belownav.css";

const categories = [
  "New Arrivals",
  "Jordan",
  "Nike",
  "Adidas",
  "Yeezy",
  "New Balance",
  "Off-White",
  "Asics",
  "On Cloud",
];

const Belownav = () => {
  const navigate = useNavigate();

  return (
    <nav className="belownav">
      {categories.map((cat) => (
        <button
          key={cat}
          className="belownav-link"
          onClick={() => navigate(`/filter/${cat}`)}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
};

export default Belownav;
