import banner from "../../assets/banner/product-banner-display.png";
import Banner from "../banner/Banner";
import Brands from "../brands/Brands";
import Sneaker from "../sneakers/Sneaker";
import "./Home.css";
import { useState, useContext, useEffect } from "react";
import { CartContext } from "../../context/CartContext";
import { getUserById } from "../../service/client.service";
import { Link } from "react-router-dom";

const Home = () => {
  const cartContext = useContext(CartContext);

  const { message, setMessage, alertColor, setUserInfo, token, buttonColor } =
    cartContext;

  useEffect(() => {
    if (token) {
      getUserById(token)
        .then((res) => setUserInfo(res))
        .catch((error) => console.error(error));
    }
  }, [token]);

  useEffect(() => {
    getUserById(token)
      .then((res) => setUserInfo(res))
      .catch((error) => console.error(error));
  }, [token, setUserInfo]);

  const removeAlert = () => {
    setMessage("");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {message && (
        <div
          className={`alert ${alertColor} alert-dismissible fade show sticky-top`}
          role="alert"
        >
          {message}
          <button type="button" className={`btn btn-sm `} onClick={removeAlert}>
            <i
              className={`fa-solid fa-circle-xmark icon-link-hover link-${buttonColor}`}
            ></i>
          </button>
        </div>
      )}
      <div className="banner fade-in">
        <div className="d-flex justify-content-center align-items-center flex-column banner-text gap-5">
          <h2>PREMIUM QUALITY FOR THE BEST PRICE</h2>
          <Link className="shop-btn" to={"/products"}>
            Show Now
          </Link>
        </div>
        <img src={banner} alt="banner" className="banner-image" />
      </div>
      <Banner />
      <Sneaker />
      <Brands />
    </>
  );
};

export default Home;
