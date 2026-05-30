import { useEffect, useState } from "react";
import "./Sneaker.css";
import { Link } from "react-router-dom";
import { getProductsPreview } from "../../service/product.service";

const Sneaker = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getProductsPreview();
      if (res) setProducts(res);
    };
    fetchProducts();
  }, []);

  return (
    <section className="sneakers-section">
      <h2 className="sneakers-title">Featured Products</h2>
      <div className="sneakers-grid">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="sneaker-card"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="sneaker-img-wrap">
              <img src={product.url} alt={product.name} />
              <div className="sneaker-img-overlay">
                <button
                  className="sneaker-wishlist"
                  aria-label="Add to wishlist"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <i className="fa-regular fa-heart" />
                </button>
              </div>
            </div>
            <div className="sneaker-info">
              {product.brand && (
                <p className="sneaker-brand">{product.brand}</p>
              )}
              <p className="sneaker-name">{product.name}</p>
              <div className="sneaker-bottom">
                <div className="sneaker-stars">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fa-solid fa-star" />
                  ))}
                </div>
                <p className="sneaker-price">${product.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Sneaker;
