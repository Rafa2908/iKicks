/* eslint-disable react-refresh/only-export-components */
import PropTypes from "prop-types";
import { createContext, useEffect, useState } from "react";
import { getMe } from "../service/user.service.js";

const UserContext = createContext({
  user: {},
  setUser: () => {},
  userInfo: {},
  setUserInfo: () => {},
  products: [],
  setProducts: () => {},
  message: "",
  setMessage: () => {},
  buttonColor: "",
  setButtonColor: () => {},
});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [buttonColor, setButtonColor] = useState("");

  const valueContext = {
    user,
    setUser,
    userInfo,
    setUserInfo,
    products,
    setProducts,
    message,
    setMessage,
    buttonColor,
    setButtonColor,
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getMe();
      if (res) setUser(res);
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={valueContext}>{children}</UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserProvider;
export { UserContext };
