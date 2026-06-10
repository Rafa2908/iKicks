import PropTypes from "prop-types";
import { createContext, useEffect, useMemo, useState } from "react";
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
  const [authLoading, setAuthLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [buttonColor, setButtonColor] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getMe();
      setUser(res ?? {});
      setAuthLoading(false);
    };
    fetchUser();
  }, []);

  const valueContext = useMemo(
    () => ({
      user,
      setUser,
      authLoading,
      userInfo,
      setUserInfo,
      products,
      setProducts,
      message,
      setMessage,
      buttonColor,
      setButtonColor,
    }),
    [user, authLoading, userInfo, products, message, buttonColor],
  );

  return (
    <UserContext.Provider value={valueContext}>{children}</UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserProvider;
export { UserContext };
