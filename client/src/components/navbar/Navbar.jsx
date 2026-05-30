import "./Navbar.css";
import Abovenav from "../abovenav/Abovenav";
import Belownav from "../belownav/Belownav";
import Promo from "../promo/Promo";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useRef, useEffect } from "react";
import { UserContext } from "../../context/UserContext";

const NavBar = () => {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);
  const isLoggedIn = user && Object.keys(user).length > 0;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    setUser({});
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <>
      <Abovenav />

      {loading && (
        <div className="ikicks-spinner-overlay">
          <div className="ikicks-spinner" />
        </div>
      )}

      <nav className="ikicks-nav">
        {/* Brand */}
        <Link to="/" className="nav-brand">
          iKicks
        </Link>

        {/* Search — hidden on mobile, visible in mobile menu */}
        <div className="nav-search">
          <input
            type="text"
            placeholder="Search sneakers..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="button" className="nav-search-btn" aria-label="Search">
            <i className="fa-solid fa-magnifying-glass" />
          </button>
        </div>

        {/* Right actions */}
        <div className="nav-actions">
          {/* Home — hidden on mobile */}
          <Link to="/" className="nav-icon-link nav-home-link" title="Home">
            <i className="fa-solid fa-house" />
          </Link>

          {/* User — hidden on mobile, shown via hamburger menu */}
          <div className="nav-user" ref={dropdownRef}>
            {isLoggedIn ? (
              <>
                <button
                  className="nav-icon-btn"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  title="Account"
                  aria-expanded={dropdownOpen}
                >
                  <i className="fa-solid fa-circle-user" />
                </button>

                <div className={`nav-dropdown ${dropdownOpen ? "open" : ""}`}>
                  <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                    <i className="fa-regular fa-user" /> Profile
                  </Link>
                  <Link to="/myorders" onClick={() => setDropdownOpen(false)}>
                    <i className="fa-solid fa-box" /> My Orders
                  </Link>
                  <button className="nav-dropdown-logout" onClick={logout}>
                    <i className="fa-solid fa-right-from-bracket" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="nav-icon-link" title="Log in">
                <i className="fa-regular fa-user" />
              </Link>
            )}
          </div>

          {/* Cart — always visible */}
          <Link to="/cart" className="nav-icon-link nav-cart" title="Cart">
            <i className="fa-solid fa-cart-shopping" />
            <span className="nav-cart-badge">0</span>
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className={`nav-hamburger ${mobileOpen ? "open" : ""}`}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Mobile slide-down menu */}
        <div className={`nav-mobile-menu ${mobileOpen ? "open" : ""}`}>
          <div className="nav-mobile-search">
            <input
              type="text"
              placeholder="Search sneakers..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="button" aria-label="Search">
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </div>

          <div className="nav-mobile-links">
            <Link to="/" onClick={() => setMobileOpen(false)}>
              <i className="fa-solid fa-house" /> Home
            </Link>

            {isLoggedIn ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)}>
                  <i className="fa-regular fa-user" /> Profile
                </Link>
                <Link to="/myorders" onClick={() => setMobileOpen(false)}>
                  <i className="fa-solid fa-box" /> My Orders
                </Link>
                <button
                  className="nav-mobile-logout"
                  onClick={() => { logout(); setMobileOpen(false); }}
                >
                  <i className="fa-solid fa-right-from-bracket" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <i className="fa-regular fa-user" /> Log In
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <i className="fa-solid fa-user-plus" /> Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Belownav />
      <Promo />
    </>
  );
};

export default NavBar;
