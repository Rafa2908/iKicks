import { useEffect, useState } from "react";
import "./AllProducts.css";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";

const AllProducts = () => {
  const [allSneakers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [sneakersPerPage] = useState(12);

  const indexOfLastSneaker = currentPage * sneakersPerPage;
  const indexOfFirstSneaker = indexOfLastSneaker - sneakersPerPage;
  const currentSneakers = allSneakers.slice(
    indexOfFirstSneaker,
    indexOfLastSneaker,
  );

  const pageNumber = [];

  const totalSneakers = allSneakers.length;

  for (let i = 1; i <= Math.ceil(totalSneakers / sneakersPerPage); i++) {
    pageNumber.push(i);
  }

  const userContext = useContext(UserContext);
  const { addToCart, message, alertColor, buttonColor, setMessage } =
    userContext;

  const removeAlert = () => {
    setMessage("");
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // scrollToTop();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

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
