import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  loginUser,
  getCart,
  getUserById,
  getSneakerById,
} from "../../service/client.service";
import { CartContext } from "../../context/CartContext";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const cartContext = useContext(CartContext);

  const {
    setMessage,
    setAlertColor,
    setToken,
    setCart,
    setCartDetails,
    setUserInfo,
    setButtonColor,
  } = cartContext;

  const [frontErrors, setFrontErrors] = useState({
    email: true,
    password: true,
  });

  const [backErrors, setBackErrors] = useState({});

  const formValidations = (name, value) => {
    const validation = {
      email: (value) => {
        if (value.length === 0) {
          return "Email is required";
        }
        return true;
      },
      password: (value) => {
        if (value.length === 0) {
          return "Password is required";
        } else if (value.length < 8) {
          return "Password must be at least 8 characters long.";
        }
        return true;
      },
    };
    setFrontErrors((prev) => ({ ...prev, [name]: validation[name](value) }));
  };

  const navigate = useNavigate();

  const updateLoginHandler = (e) => {
    const { name, value } = e.target;
    formValidations(name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
    setBackErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const fetchCartItemsDetails = async (cartData) => {
    const itemDetails = await Promise.all(
      Object.keys(cartData).map(async (id) => {
        const item = await getSneakerById(id);
        return { ...item, quantity: cartData[id] };
      })
    );
    return itemDetails;
  };

  const loginUserHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      if (res.success) {
        setToken(res.token);
        localStorage.setItem("token", res.token);

        const userInfo = await getUserById(res.token);
        setUserInfo(userInfo);

        const cartData = await getCart(res.token);
        setCart(cartData.cartData);

        const cartDetails = await fetchCartItemsDetails(cartData.cartData);
        setCartDetails(cartDetails);

        navigate("/");
        setMessage(`You have logged in successfully.`);
        setAlertColor("alert-success");
        setButtonColor("success");
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        setBackErrors(error.response.data.errors);
        setMessage("Failed to retrieve cart details.");
        setAlertColor("alert-danger");
      } else {
        setMessage("Failed to log in. Please try again later.");
        setAlertColor("alert-danger");
      }
    }
  };

  return (
    <div className="card shadow w-25 mx-auto mt-5 mb-5 p-3">
      <h1 className="text-center mt-4 mb-4">Log in</h1>
      <form className="card-body" onSubmit={loginUserHandler}>
        <div className="form-floating mb-3">
          <input
            type="email"
            name="email"
            placeholder="Email Address:"
            className="form-control"
            onChange={updateLoginHandler}
          />
          <p className="text-danger">{frontErrors.email}</p>
          <p className="text-danger">{backErrors.email?.message}</p>
          <label htmlFor="email">Email Address:</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            name="password"
            placeholder="Password:"
            className="form-control"
            onChange={updateLoginHandler}
          />
          <p className="text-danger">{frontErrors.password}</p>
          <p className="text-danger">{backErrors.password?.message}</p>
          <label htmlFor="email">Password:</label>
        </div>
        <button className="btn btn-sm btn-outline-primary mb-2 mt-3">
          Log in
        </button>
        <p>
          New to Kicks District? <Link to={"/register"}>Register</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
