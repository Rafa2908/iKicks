import { useContext, useEffect, useState } from "react";
import "./Sneaker.css";
import {
  addSneakerToWishlist,
  getAllSneakers,
} from "../../service/client.service";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

const Sneaker = () => {
  const [sneakers, setSneakers] = useState([]);
  const [wishlistOn, setWishlistOn] = useState({});

  const cartContext = useContext(CartContext);
  const { addToCart, setAlertColor, setButtonColor, setMessage, token } =
    cartContext;

  useEffect(() => {
    const fetchSneakers = async () => {
      try {
        const allSneakers = await getAllSneakers();
        const shuffledSneakers = allSneakers.sort(() => Math.random() - 0.5);
        const randomSneakers = shuffledSneakers.slice(0, 10);
        setSneakers(randomSneakers);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSneakers();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (wishlistOn) {
      Object.keys(wishlistOn).forEach((key) => {
        if (wishlistOn[key]) {
          setMessage("Added to Wishlist");
          setAlertColor("alert-success");
          setButtonColor("success");
        } else {
          setMessage("Removed from Wishlist");
          setAlertColor("alert-danger");
          setButtonColor("danger");
        }
      });
    }
  }, [wishlistOn]);

  const wishlistHandler = async (sneakerId) => {
    setWishlistOn((prev) => ({
      ...prev,
      [sneakerId]: !prev[sneakerId],
    }));
    await addSneakerToWishlist(token, sneakerId).then((res) =>
      console.log(res)
    );
  };

  return (
    <>
      <h2 className="sneaker-title">Feature Products</h2>
      <div className="sneaker-container">
        {sneakers.map((sneaker) => (
          <div key={sneaker._id} className="sneaker-card card">
            <div className="sneaker-card-body card-body">
              <Link
                to={`/sneaker/${sneaker._id}`}
                className="sneaker-link"
                onClick={scrollToTop}
              >
                <img
                  src={sneaker.image?.image1}
                  alt={sneaker.name}
                  className="card-image mb-3"
                />
                <h4 className="text-center mb-4">{sneaker.name}</h4>
              </Link>
              <div className="reviews">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <b>${sneaker.price}.00</b>
            </div>
            <div className="d-flex justify-content-center align-items-center nav-button gap-3">
              <button
                className="btn btn-outline-primary"
                onClick={() => addToCart(sneaker)}
              >
                Add to Cart
              </button>

              <i
                className={`fa-heart btn ${
                  wishlistOn[sneaker._id]
                    ? "fa-solid text-danger"
                    : "fa-regular text-primary"
                }`}
                onClick={() => wishlistHandler(sneaker._id)}
              ></i>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Sneaker;
