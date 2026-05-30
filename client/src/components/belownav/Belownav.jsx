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
  return (
    <nav className="belownav">
      {categories.map((cat) => (
        <button key={cat} className="belownav-link">
          {cat}
        </button>
      ))}
    </nav>
  );
};

export default Belownav;
