import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../service/user.service";
import { UserContext } from "../../context/UserContext";
import "./Registration.css";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { setUser, setMessage } = useContext(UserContext);
  const navigate = useNavigate();

  const [frontErrors, setFrontErrors] = useState({});
  const [backErrors, setBackErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validators = {
    email: (v) => {
      if (!v.length) return "Email is required.";
    },
    password: (v) => {
      if (!v.length) return "Password is required.";
      if (v.length < 8) return "Must be at least 8 characters.";
    },
  };

  const updateLoginHandler = (e) => {
    const { name, value } = e.target;
    setFrontErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
    setFormData((prev) => ({ ...prev, [name]: value }));
    setBackErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateAll = () => {
    const errors = {};
    for (const field in validators) {
      const error = validators[field](formData[field]);
      if (error) errors[field] = error;
    }
    setFrontErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const loginUserHandler = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    setIsSubmitting(true);
    try {
      const res = await loginUser(formData);
      if (res) {
        setUser(res);
        setMessage("Welcome back!");
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
          <p className="reg-subtitle">Welcome back, Sneakerhead</p>
        </div>

        {hasBackErrors && (
          <div className="reg-back-errors">
            {Object.values(backErrors).map((err, i) => (
              <p key={i}>{err?.message || err}</p>
            ))}
          </div>
        )}

        <form className="reg-form" onSubmit={loginUserHandler} noValidate>
          <div className="reg-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="john@example.com"
              className={frontErrors.email ? "has-error" : ""}
              onChange={updateLoginHandler}
              value={formData.email}
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
              onChange={updateLoginHandler}
              value={formData.password}
            />
            <span className="reg-error">{frontErrors.password}</span>
          </div>

          <button type="submit" className="reg-submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="reg-footer">
          New to iKicks? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
