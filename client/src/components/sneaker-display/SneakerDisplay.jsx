import { useEffect, useState } from "react";
import "./SneakerDisplay.css";
import { useParams } from "react-router-dom";
import { getProductDetails } from "../../service/product.service";

const SneakerDisplay = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState({});
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await getProductDetails(productId);
      if (res) {
        setProduct(res);
        if (res.images?.length > 0) setMainImage(res.images[0]);
        if (res.sizes?.length > 0) setSelectedSize(String(res.sizes[0].size));
      }
    };
    fetchProduct();
  }, [productId]);

  const quantityAvailable =
    product.sizes?.find((s) => String(s.size) === selectedSize)?.quantity ?? 0;

  return (
    <div className="sd-page">
      <section className="sd-gallery">
        <div className="sd-main-image">
          <img src={mainImage} alt={product.name || "sneaker"} />
        </div>
        <div className="sd-thumbnails">
          {product.images?.map((url, index) => (
            <button
              key={index}
              className={`sd-thumb ${mainImage === url ? "active" : ""}`}
              onClick={() => setMainImage(url)}
            >
              <img src={url} alt="" />
            </button>
          ))}
        </div>
      </section>

      <aside className="sd-info">
        <p className="sd-brand-tag">{product.brand}</p>
        <h1 className="sd-name">{product.name}</h1>
        {product.colorway && <p className="sd-colorway">{product.colorway}</p>}
        <p className="sd-price">${product.price}</p>
        <p className="sd-description">{product.description}</p>

        <div className="sd-rating">
          {[...Array(5)].map((_, i) => (
            <i key={i} className="fa-solid fa-star" />
          ))}
          <span>(60 reviews)</span>
        </div>

        <div className="sd-size-section">
          <label htmlFor="size" className="sd-label">
            Select Size
          </label>
          <select
            id="size"
            className="sd-select"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            {product.sizes?.map((s, index) => (
              <option key={index} value={s.size}>
                {s.size}
              </option>
            ))}
          </select>
          <p
            className={`sd-availability ${quantityAvailable === 0 ? "out" : ""}`}
          >
            {quantityAvailable > 0
              ? `${quantityAvailable} pair${quantityAvailable !== 1 ? "s" : ""} available`
              : "Out of stock"}
          </p>
        </div>

        <button className="sd-add-btn">Add to Cart</button>

        <ul className="sd-disclaimers">
          <li>
            <i className="fa-solid fa-check" />
            15 days easy returns
          </li>
          <li>
            <i className="fa-solid fa-check" />
            100% Authentic Sneakers
          </li>
          <li>
            <i className="fa-solid fa-check" />
            Fast Customer Service Response
          </li>
          <li>
            <i className="fa-solid fa-check" />
            All pictures taken by iKicks team
          </li>
          <li>
            <i className="fa-solid fa-check" />
            100% Customer Satisfaction Guaranteed
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default SneakerDisplay;
