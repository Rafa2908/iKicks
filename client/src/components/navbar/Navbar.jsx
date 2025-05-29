import "./Navbar.css";
import Abovenav from "../abovenav/Abovenav";
import Belownav from "../belownav/Belownav";
import Promo from "../promo/Promo";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { getSneakerByBrand, getUserById } from "../../service/client.service";

const NavBar = () => {
  const cartContext = useContext(CartContext);
  const {
    setUserInfo,
    userInfo,
    setToken,
    token,
    setAlertColor,
    setMessage,
    cartDetails,
    setCartDetails,
    setButtonColor,
    setSneakersByBrand,
  } = cartContext;

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken.trim());
    }
  }, [setToken]);

  useEffect(() => {
    if (token) {
      getUserById(token)
        .then((res) => setUserInfo(res))
        .catch((error) => console.log(error));
    }
  }, [token, setUserInfo]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    setCartDetails([]);
    setMessage("You have logged out successfully.");
    setAlertColor("alert-warning");
    setButtonColor("warning");
    setToken("");
    navigate("/");
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const sneakerBrandHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    getSneakerByBrand(inputText)
      .then((res) => {
        setSneakersByBrand(res);
        setTimeout(() => {
          setLoading(false);
          navigate("/brand");
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
    setInputText("");
  };

  return (
    <>
      <Abovenav />
      {loading && (
        <div className={`overlay ${loading ? "show" : ""}`}>
          <div className="spinner"></div>
        </div>
      )}
      <nav className="d-flex justify-content-between align-items-center p-4 bg-dark sticky-top">
        <div className="left-section">
          <h1 className="text-light">
            <Link to="/" className="text-home">
              Kicks District
            </Link>
          </h1>
        </div>
        <div className="middle-section">
          <form onSubmit={sneakerBrandHandler}>
            <input
              type="text"
              name="brand"
              id="search"
              placeholder="Search here..."
              value={inputText}
              onChange={handleInputChange}
            />
            <button type="submit" className="btn">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>
        <div className="right-section">
          <Link to="/">
            <i className="fa-solid fa-house" title="Home Page"></i>
          </Link>
          {token && userInfo?.email === "jose@admin.com" ? (
            <Link to="/admin">
              <i className="fa-solid fa-user-tie" title="Admin Panel"></i>
            </Link>
          ) : token ? (
            <div>
              <i
                className="fa-solid text-primary fa-user dropdown-icon"
                title="User"
              >
                <ul className="dropdown-list">
                  <li>Profile</li>
                  <li onClick={logout}>Logout</li>
                </ul>
              </i>
            </div>
          ) : (
            <Link to="/register">
              <i className="fa-solid fa-user text-light" title="Register"></i>
            </Link>
          )}
          {token ? (
            <Link to="/wishlist">
              <i className="fa-regular fa-heart" title="Wishlist"></i>
            </Link>
          ) : null}
          <Link to="/cart">
            <i className="fa-solid fa-cart-shopping" title="Cart">
              {cartDetails.length > 0 ? (
                <span>{cartDetails.length}</span>
              ) : null}
            </i>
          </Link>
        </div>
      </nav>
      <Belownav />
      <Promo />
    </>
  );
};

export default NavBar;
