import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { registerUser } from "../../service/client.service";
import { CartContext } from "../../context/CartContext";

const Registration = () => {
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const emailRegex = "/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i;";

  const cartContext = useContext(CartContext);

  const {
    setToken,
    setMessage,
    setAlertColor,
    alertColor,
    buttonColor,
    message,
    setButtonColor,
  } = cartContext;

  const navigate = useNavigate();

  const [frontErrors, setFrontErrors] = useState({
    email: true,
    password: true,
  });

  const [backErrors, setBackErrors] = useState({});

  const formValidations = (name, value) => {
    const validation = {
      first_name: (value) => {
        if (value.length === 0) {
          return "First name is required.";
        } else if (value.length < 2) {
          return "First name must be at least 2 characters long.";
        }
      },
      last_name: (value) => {
        if (value.length === 0) {
          return "Last name is required.";
        } else if (value.length < 2) {
          return "Last name must be at least 2 characters long.";
        }
      },
      email: (value) => {
        if (value.length == 0) {
          return "Email is  required";
        }
        return true;
      },
      password: (value) => {
        if (value.length == 0) {
          return "Password is  required";
        } else if (value.length < 8) {
          return "Password must be at least 8 characters long.";
        }
        return true;
      },
      confirm_password: (value) => {
        if (value.length == 0) {
          return "Password is  required";
        } else if (value !== userData.password) {
          return "Password must match.";
        }
        return true;
      },
    };
    setFrontErrors((prev) => ({ ...prev, [name]: validation[name](value) }));
  };

  const updateUser = (e) => {
    const { name, value } = e.target;
    formValidations(name, value);
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const registerUserHandler = (e) => {
    e.preventDefault();
    registerUser(userData)
      .then((res) => {
        if (res.success) {
          setToken(res.token);
          localStorage.setItem("token", res.token);
          setMessage("You have registered successfully.");
          setAlertColor("alert-success");
          setButtonColor("success");
          navigate("/");
        } else {
          alert(res.message);
        }
      })
      .catch((error) => setBackErrors(error));
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
          <button type="button" className={`btn btn-sm `} onClick={removeAlert}>
            <i
              className={`fa-solid fa-circle-xmark icon-link-hover link-${buttonColor}`}
            ></i>
          </button>
        </div>
      )}
      <div className="card shadow w-25 mx-auto mt-5 mb-5 p-3">
        <h2 className="text-center mt-4 mb-3">Registration</h2>
        <form className="card-body" onSubmit={registerUserHandler}>
          <div className="form-floating mb-4 mt-3">
            <input
              type="text"
              name="first_name"
              placeholder="First Name:"
              className="form-control"
              onChange={updateUser}
            />
            <p className="text-danger">{frontErrors.first_name}</p>
            <label htmlFor="first_name">First Name:</label>
          </div>
          <div className="form-floating mb-4">
            <input
              type="text"
              name="last_name"
              placeholder="Last Name:"
              className="form-control"
              onChange={updateUser}
            />
            <p className="text-danger">{frontErrors.last_name}</p>
            <label htmlFor="last_name">Last Name:</label>
          </div>
          <div className="form-floating mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email Address:"
              className="form-control"
              onChange={updateUser}
            />
            <p className="text-danger">{frontErrors.email}</p>
            <label htmlFor="email">Email Address:</label>
          </div>
          <div className="form-floating mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password:"
              className="form-control"
              onChange={updateUser}
            />
            <p className="text-danger">{frontErrors.password}</p>
            <label htmlFor="password">Password:</label>
          </div>
          <div className="form-floating mb-4">
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password:"
              className="form-control"
              onChange={updateUser}
            />
            <p className="text-danger">{frontErrors.confirm_password}</p>
            <label htmlFor="fistName">Confirm Password:</label>
          </div>
          <div className="mb-3 mt-4 text-start">
            <button className="btn btn-outline-dark mb-2" type="submit">
              Register
            </button>
            <p>
              Already a Sneakerhead? <Link to={"/login"}>Log in</Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Registration;
