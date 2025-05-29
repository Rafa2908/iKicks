import React, { useContext, useEffect, useState } from "react";
import "./AllProducts.css";
import { getAllSneakers } from "../../service/client.service";
import { CartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";

const AllProducts = () => {
  const [allSneakers, setAllSneakers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [sneakersPerPage, setSneakersPerPage] = useState(12);

  const indexOfLastSneaker = currentPage * sneakersPerPage;
  const indexOfFirstSneaker = indexOfLastSneaker - sneakersPerPage;
  const currentSneakers = allSneakers.slice(
    indexOfFirstSneaker,
    indexOfLastSneaker
  );

  const pageNumber = [];

  const totalSneakers = allSneakers.length;

  for (let i = 1; i <= Math.ceil(totalSneakers / sneakersPerPage); i++) {
    pageNumber.push(i);
  }

  const cartContext = useContext(CartContext);

  const { addToCart, message, alertColor, buttonColor, setMessage } =
    cartContext;

  const removeAlert = () => {
    setMessage("");
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    scrollToTop();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    getAllSneakers()
      .then((res) => setAllSneakers(res))
      .catch((error) => console.log(error));
  }, []);

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
      <div className="sneaker-container-1 fade-in">
        {currentSneakers.map((sneaker) => {
          return (
            <div key={sneaker._id} className="sneaker-card card ">
              <div className="sneaker-card-body card-body">
                <Link to={`/sneaker/${sneaker._id}`} className="sneaker-link">
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
              className={`page-item ${currentPage === number ? "active" : ""}`}
            >
              <button onClick={() => paginate(number)} className="page-link">
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default AllProducts;
