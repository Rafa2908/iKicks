import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { registerUser } from "../../service/user.service";
import { UserContext } from "../../context/UserContext";
import "./Registration.css";

const Registration = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { setUser, setMessage } = useContext(UserContext);
  const navigate = useNavigate();

  const [frontErrors, setFrontErrors] = useState({});
  const [backErrors, setBackErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validators = {
    firstName: (v) => {
      if (!v.length) return "First name is required.";
      if (v.length < 2) return "Must be at least 2 characters.";
    },
    lastName: (v) => {
      if (!v.length) return "Last name is required.";
      if (v.length < 2) return "Must be at least 2 characters.";
    },
    email: (v) => {
      if (!v.length) return "Email is required.";
    },
    password: (v) => {
      if (!v.length) return "Password is required.";
      if (v.length < 8) return "Must be at least 8 characters.";
    },
    confirmPassword: (v) => {
      if (!v.length) return "Please confirm your password.";
      if (v !== userData.password) return "Passwords do not match.";
    },
  };

  const updateUser = (e) => {
    const { name, value } = e.target;
    setFrontErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const validateAll = () => {
    const errors = {};
    for (const field in validators) {
      const error = validators[field](userData[field]);
      if (error) errors[field] = error;
    }
    setFrontErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const registerUserHandler = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    setIsSubmitting(true);
    try {
      const res = await registerUser(userData);
      if (res) {
        setUser(res);
        setMessage("Registration successful. Welcome!");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setBackErrors(error?.response?.data || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasBackErrors = Object.keys(backErrors).length > 0;

  return (
    <div className="reg-overlay">
      <div className="reg-card">
        <button className="reg-close" onClick={() => navigate(-1)} aria-label="Close">
          ×
        </button>

        <div className="reg-header">
          <h1 className="reg-brand">iKicks</h1>
          <p className="reg-subtitle">Create your account to start shopping</p>
        </div>

        {hasBackErrors && (
          <div className="reg-back-errors">
            {Object.values(backErrors).map((err, i) => (
              <p key={i}>{err?.message || err}</p>
            ))}
          </div>
        )}

        <form className="reg-form" onSubmit={registerUserHandler} noValidate>
          <div className="reg-row">
            <div className="reg-field">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="John"
                className={frontErrors.firstName ? "has-error" : ""}
                onChange={updateUser}
                value={userData.firstName}
              />
              <span className="reg-error">{frontErrors.firstName}</span>
            </div>

            <div className="reg-field">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Doe"
                className={frontErrors.lastName ? "has-error" : ""}
                onChange={updateUser}
                value={userData.lastName}
              />
              <span className="reg-error">{frontErrors.lastName}</span>
            </div>
          </div>

          <div className="reg-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="john@example.com"
              className={frontErrors.email ? "has-error" : ""}
              onChange={updateUser}
              value={userData.email}
            />
            <span className="reg-error">{frontErrors.email}</span>
          </div>

          <div className="reg-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Min. 8 characters"
              className={frontErrors.password ? "has-error" : ""}
              onChange={updateUser}
              value={userData.password}
            />
            <span className="reg-error">{frontErrors.password}</span>
          </div>

          <div className="reg-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              className={frontErrors.confirmPassword ? "has-error" : ""}
              onChange={updateUser}
              value={userData.confirmPassword}
            />
            <span className="reg-error">{frontErrors.confirmPassword}</span>
          </div>

          <button type="submit" className="reg-submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="reg-footer">
          Already a Sneakerhead? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;
