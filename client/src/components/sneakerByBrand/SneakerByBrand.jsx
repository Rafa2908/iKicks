import { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";
import notFound from "../../assets/icons/item-not-found.png";
import "./SneakerByBrand.css";

const SneakerByBrand = () => {
  const cartContext = useContext(CartContext);
  const {
    sneakersByBrand,
    addToCart,
    message,
    alertColor,
    buttonColor,
    setMessage,
  } = cartContext;

  const [currentPage, setCurrentPage] = useState(1);
  const [sneakersPerPage, setSneakersPerPage] = useState(12); // Corrected state name
  const totalSneakers = sneakersByBrand.length;

  const indexOfLastSneaker = currentPage * sneakersPerPage;
  const indexOfFirstSneaker = indexOfLastSneaker - sneakersPerPage;
  const currentSneakers = sneakersByBrand.slice(
    indexOfFirstSneaker,
    indexOfLastSneaker
  );
  const pageNumber = [];

  for (let i = 1; i <= Math.ceil(totalSneakers / sneakersPerPage); i++) {
    pageNumber.push(i);
  }

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    scrollToTop();
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const removeAlert = () => {
    setMessage("");
  };

  return (
    <>
      {message && (
        <div
          className={`alert ${alertColor} alert-dismissible fade show sticky-top`}
          role="alert"
        >
          {message}
          <button
            type="button"
            className={`btn btn-sm `}
            onClick={() => removeAlert(message)}
          >
            <i
              className={`fa-solid fa-circle-xmark icon-link-hover link-${buttonColor}`}
            ></i>
          </button>
        </div>
      )}
      {currentSneakers.length > 0 ? (
        <div>
          <div className="sneaker-container-products">
            {currentSneakers.map((sneaker) => {
              return (
                <div key={sneaker._id} className="sneaker-card card">
                  <div className="sneaker-card-body card-body">
                    <Link
                      to={`/sneaker/${sneaker._id}`}
                      className="sneaker-link"
                      onClick={scrollToTop}
                    >
                      <img
                        src={sneaker.image?.image1}
                        alt=""
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
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => addToCart(sneaker)}
                  >
                    Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
          <nav className="container d-flex justify-content-center mt-4">
            <ul className="pagination">
              {pageNumber.map((number) => (
                <li
                  key={number}
                  className={`page-item ${
                    currentPage === number ? "active" : ""
                  }`}
                >
                  <button
                    onClick={() => paginate(number)}
                    className="page-link"
                  >
                    {number}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : (
        <div className="container mt-5 mb-5 text-center">
          <h1 className="display-1 mb-5">Item not found</h1>
          <p className="display-5 mb-4">Please try again</p>
          <img src={notFound} className="not-found" />
          <div className="d-flex align-items-center justify-content-center mt-3">
            <Link className="btn btn-outline-warning" to={"/"}>
              Go Back Home
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default SneakerByBrand;
