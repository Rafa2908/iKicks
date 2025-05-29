import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getSneakerById } from "../../../service/client.service";
import { CartContext } from "../../../context/CartContext";

const ProductForm = ({ submitFunction, initialState }) => {
  const [formData, setFormData] = useState(initialState);

  const { id } = useParams();

  const cartContext = useContext(CartContext);

  const { setMessage, setAlertColor, setButtonColor } = cartContext;

  useEffect(() => {
    if (id) {
      getSneakerById(id)
        .then((res) => setFormData(res))
        .catch((error) => console.log(error));
    }
  }, [id]);

  const [frontErrors, setFrontErrors] = useState({
    name: "",
    description: "",
    brand: "",
    price: "",
    image: {
      image1: "",
      image2: "",
      image3: "",
      image4: "",
    },
  });

  const [newInventory, setNewInventory] = useState({});

  const navigate = useNavigate();

  const updateForm = (e) => {
    const { name, value } = e.target;
    formValidations(name, value);

    if (name.startsWith("image")) {
      setFormData((prev) => ({
        ...prev,
        image: { ...prev.image, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const formValidations = (name, value) => {
    const validation = {
      name: (value) => {
        if (value.length <= 0) {
          return "Sneaker name is required.";
        } else {
          return true;
        }
      },
      description: (value) => {
        if (value.length <= 0) {
          return "Sneaker description is required.";
        } else if (value.length > 500) {
          return "Sneaker description is too long.";
        } else {
          return true;
        }
      },
      price: (value) => {
        if (value <= 0) {
          return "Sneaker price is required.";
        } else {
          return true;
        }
      },
      brand: (value) => {
        if (value.length <= 0) {
          return "Sneaker brand is required.";
        } else {
          return true;
        }
      },
      image1: (value) => {
        if (value.length <= 0) {
          return "Sneaker image 1 is required.";
        } else {
          return true;
        }
      },
      image2: (value) => {
        if (value.length <= 0) {
          return "Sneaker image 2 is required.";
        } else {
          return true;
        }
      },
      image3: (value) => {
        if (value.length <= 0) {
          return "Sneaker image 3 is required.";
        } else {
          return true;
        }
      },
      image4: (value) => {
        if (value.length <= 0) {
          return "Sneaker image 4 is required.";
        } else {
          return true;
        }
      },
    };

    if (validation[name]) {
      const validationResult = validation[name](value);
      if (name.startsWith("image")) {
        setFrontErrors((prev) => ({
          ...prev,
          image: {
            ...prev.image,
            [name]: validationResult === true ? "" : validationResult,
          },
        }));
      } else {
        setFrontErrors((prev) => ({
          ...prev,
          [name]: validationResult === true ? "" : validationResult,
        }));
      }
    }
  };

  const reduceErrors = Object.values(frontErrors).every((error) => {
    if (typeof error === "object") {
      return Object.values(error).every((imgError) => imgError === "");
    }
    return error === "";
  });

  const addProduct = (e) => {
    e.preventDefault();
    if (reduceErrors) {
      submitFunction(formData)
        .then(
          (res) => setNewInventory(res),
          setMessage(
            !id
              ? "Product has been added to inventory successfully."
              : "Product has been updated successfully."
          ),
          setAlertColor("alert-primary"),
          setButtonColor("primary"),
          navigate("/admin")
        )
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="container card mt-5 mb-5">
      <h1 className="text-center mt-4 mb-4">
        {id ? "Update Product in Inventory" : "Add Product to Inventory"}
      </h1>
      <form className="card-body" onSubmit={addProduct}>
        <div className="mb-3 form-floating">
          <input
            type="text"
            name="name"
            placeholder="Product Name:"
            onChange={updateForm}
            className="form-control"
            value={formData?.name}
          />
          <label htmlFor="name">Product Name:</label>
          {frontErrors.name && (
            <p className="text-danger">{frontErrors.name}</p>
          )}
        </div>
        <div className="mb-3 form-floating">
          <textarea
            name="description"
            placeholder="Product Description:"
            onChange={updateForm}
            className="form-control"
            value={formData?.description}
            style={{ height: "100px" }}
          />
          <label htmlFor="description">Product Description:</label>
          {frontErrors.description && (
            <p className="text-danger">{frontErrors.description}</p>
          )}
        </div>
        <div className="mb-3 form-floating">
          <input
            type="text"
            name="brand"
            placeholder="Product Brand:"
            onChange={updateForm}
            className="form-control"
            value={formData?.brand}
          />
          <label htmlFor="brand">Product Brand:</label>
          {frontErrors.brand && (
            <p className="text-danger">{frontErrors.brand}</p>
          )}
        </div>
        <div className="mb-3 form-floating">
          <input
            type="number"
            name="price"
            placeholder="Price:"
            onChange={updateForm}
            className="form-control"
            value={formData?.price}
          />
          <label htmlFor="price">Price:</label>
          {frontErrors.price && (
            <p className="text-danger">{frontErrors.price}</p>
          )}
        </div>
        <div className="mb-3 form-floating">
          <input
            type="text"
            name="image1"
            placeholder="Image 1:"
            onChange={updateForm}
            className="form-control"
            value={formData?.image?.image1}
          />
          <label htmlFor="image1">Image 1:</label>
          {frontErrors.image?.image1 && (
            <p className="text-danger">{frontErrors.image?.image1}</p>
          )}
        </div>
        <div className="mb-3 form-floating">
          <input
            type="text"
            name="image2"
            placeholder="Image 2:"
            onChange={updateForm}
            className="form-control"
            value={formData?.image?.image2}
          />
          <label htmlFor="image2">Image 2:</label>
          {frontErrors.image?.image2 && (
            <p className="text-danger">{frontErrors.image?.image2}</p>
          )}
        </div>
        <div className="mb-3 form-floating">
          <input
            type="text"
            name="image3"
            placeholder="Image 3:"
            onChange={updateForm}
            className="form-control"
            value={formData?.image?.image3}
          />
          <label htmlFor="image3">Image 3:</label>
          {frontErrors.image?.image3 && (
            <p className="text-danger">{frontErrors.image?.image3}</p>
          )}
        </div>
        <div className="mb-3 form-floating">
          <input
            type="text"
            name="image4"
            placeholder="Image 4:"
            onChange={updateForm}
            className="form-control"
            value={formData?.image?.image4}
          />
          <label htmlFor="image4">Image 4:</label>
          {frontErrors.image?.image4 && (
            <p className="text-danger">{frontErrors.image?.image4}</p>
          )}
        </div>
        <div className="d-flex justify-content-end gap-3 mt-5 mb-4">
          <Link to={"/admin"} className="btn btn-warning">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!reduceErrors}
          >
            {id ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
