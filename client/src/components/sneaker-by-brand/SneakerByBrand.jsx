import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import notFound from "../../assets/icons/item-not-found.png";
import "./SneakerByBrand.css";
import { filterProducts } from "../../service/product.service";

const ITEMS_PER_PAGE = 12;

const SneakerByBrand = () => {
  const { input } = useParams();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedMin, setAppliedMin] = useState("");
  const [appliedMax, setAppliedMax] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setCurrentPage(1);
    const fetchProducts = async () => {
      const params = { search: input };
      if (appliedMin && appliedMax) {
        params.minPrice = appliedMin;
        params.maxPrice = appliedMax;
      }
      const res = await filterProducts(params);
      setProducts(res ?? []);
      setLoading(false);
    };
    fetchProducts();
  }, [input, appliedMin, appliedMax]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentSneakers = products.slice(start, start + ITEMS_PER_PAGE);

  const paginate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="sbb-loading">
        <div className="sbb-spinner" />
      </div>
    );
  }

  return (
    <section className="sbb-section">
      <h2 className="sbb-title">{input}</h2>

      {/* Mobile filter toggle */}
      <button
        className="sbb-filter-toggle"
        onClick={() => setSidebarOpen((o) => !o)}
      >
        <i className="fa-solid fa-sliders" />
        {sidebarOpen ? "Hide Filters" : "Filters"}
      </button>

      <div className="sbb-layout">
        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className={`sbb-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sbb-sidebar-header">
            <h3 className="sbb-sidebar-title">Filters</h3>
          </div>

          <div className="sbb-filter-group">
            <p className="sbb-filter-label">Price Range</p>
            <div className="sbb-price-row">
              <div className="sbb-price-field">
                <span className="sbb-price-prefix">$</span>
                <input
                  type="number"
                  className="sbb-price-input"
                  placeholder="Min"
                  min={0}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <span className="sbb-price-sep">—</span>
              <div className="sbb-price-field">
                <span className="sbb-price-prefix">$</span>
                <input
                  type="number"
                  className="sbb-price-input"
                  placeholder="Max"
                  min={0}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
            <button
              className="sbb-apply-btn"
              onClick={() => { setAppliedMin(minPrice); setAppliedMax(maxPrice); }}
            >
              Apply
            </button>
            <button
              className="sbb-reset-btn"
              onClick={() => { setMinPrice(""); setMaxPrice(""); setAppliedMin(""); setAppliedMax(""); }}
            >
              Reset
            </button>
          </div>
        </aside>

        {/* ── Product area ─────────────────────────────── */}
        <div className="sbb-content">
          {currentSneakers.length > 0 ? (
            <>
              <div className="sbb-grid">
                {currentSneakers.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="sbb-card"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  >
                    <div className="sbb-img-wrap">
                      <img src={product.url} alt={product.name} />
                    </div>
                    <div className="sbb-info">
                      {product.brand && (
                        <p className="sbb-brand">{product.brand}</p>
                      )}
                      <p className="sbb-name">{product.name}</p>
                      <div className="sbb-bottom">
                        <div className="sbb-stars">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className="fa-solid fa-star" />
                          ))}
                        </div>
                        <p className="sbb-price">${product.price}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="sbb-pagination">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`sbb-page-btn ${currentPage === i + 1 ? "active" : ""}`}
                      onClick={() => paginate(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </nav>
              )}
            </>
          ) : (
            <div className="sbb-empty">
              <img src={notFound} alt="Not found" className="sbb-not-found" />
              <h3 className="sbb-empty-title">No sneakers found</h3>
              <p className="sbb-empty-sub">No results for &ldquo;{input}&rdquo;</p>
              <Link className="sbb-back-btn" to="/">
                Go Back Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SneakerByBrand;
