import { useEffect, useState } from "react";
import "./Products.css";
import { Link } from "react-router-dom";
import { getProductInfo } from "../../service/product.service";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const sneakersPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getProductInfo();

      setProducts(res);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const totalPages = Math.ceil(products.length / sneakersPerPage);
  const start = (currentPage - 1) * sneakersPerPage;
  const currentSneakers = products.slice(start, start + sneakersPerPage);

  return (
    <div className="products-page">
      <div className="products-grid fade-in">
        {currentSneakers.map((item) => (
          <Link
            key={item.id}
            to={`/products/${item.id}`}
            className="product-card"
          >
            <div className="product-card-img-wrap">
              <img
                src={item.url}
                alt={item.name}
                className="product-card-img"
              />
            </div>
            <div className="product-card-info">
              <div className="product-card-rating">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fa-solid fa-star" />
                ))}
              </div>
              <p className="product-card-name">{item.name}</p>
              <p className="product-card-price">
                ${Number(item.price).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="products-pagination" aria-label="Product pages">
          <button
            className="products-page-btn"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <i className="fa-solid fa-chevron-left" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`products-page-btn${currentPage === n ? " active" : ""}`}
              onClick={() => setCurrentPage(n)}
              aria-current={currentPage === n ? "page" : undefined}
            >
              {n}
            </button>
          ))}

          <button
            className="products-page-btn"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <i className="fa-solid fa-chevron-right" />
          </button>
        </nav>
      )}
    </div>
  );
};

export default Products;
