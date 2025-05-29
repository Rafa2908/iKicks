import { useState, useEffect, useContext } from "react";
import "./AdminPage.css";
import {
  deleteSneakerById,
  getAllSneakers,
  getUserById,
} from "../../../service/client.service";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../../context/CartContext";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const cartContext = useContext(CartContext);
  const {
    userInfo,
    setUserInfo,
    token,
    setToken,
    setCartDetails,
    setMessage,
    setAlertColor,
    alertColor,
    buttonColor,
    setButtonColor,
    message,
  } = cartContext;
  const navigate = useNavigate();

  useEffect(() => {
    getAllSneakers()
      .then((res) => setProducts(res))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (token) {
      getUserById(token)
        .then((res) => setUserInfo(res))
        .catch((error) => console.log(error));
    }
  }, [token]);

  const deleteProduct = (productId) => {
    deleteSneakerById(productId);
    setProducts((prev) => prev.filter((product) => productId != product._id));
  };

  const removeAlert = () => {
    setMessage("");
  };

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

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      {token && userInfo?.email === "jose@admin.com" ? (
        <div className="container">
          <div className="d-flex justify-content-center align-items-center gap-3">
            <h1 className="text-center mt-4 mb-5">
              Welcome, {userInfo?.first_name}{" "}
              <button
                className="btn btn-sm btn-outline-dark ms-5"
                onClick={logout}
              >
                Logout
              </button>
            </h1>
          </div>
          <div className="d-flex justify-content-evenly align-items-center">
            <h2 className="text-center mt-5">Inventory</h2>
            <Link
              className="btn btn-sm btn-outline-primary mt-5"
              to={"/new-inventory"}
            >
              Add Product to Inventory
            </Link>
          </div>
          <table className="table mt-5 mb-5 table-striped">
            <thead>
              <tr className="text-center">
                <th>Name</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product._id} className="text-center">
                  <td>
                    <Link to={`/sneaker/${product._id}`}>{product.name}</Link>
                  </td>
                  <td>{product.brand}</td>
                  <td>${product.price}.00</td>
                  <td className="d-flex justify-content-center align-items-center gap-2">
                    <Link
                      className="btn btn-sm btn-warning"
                      to={`/update-inventory/${product._id}`}
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <nav className="d-flex justify-content-center">
            <ul className="pagination">
              {Array.from({
                length: Math.ceil(products.length / productsPerPage),
              }).map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    onClick={() => paginate(index + 1)}
                    className="page-link"
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center gap-3">
          <h1 className="text-center mt-5 mb-5">
            User Not Authorized, Please Go Back
          </h1>{" "}
          <Link className="btn btn-outline-danger" to={"/"}>
            Back
          </Link>
        </div>
      )}
    </>
  );
};

export default AdminPage;
