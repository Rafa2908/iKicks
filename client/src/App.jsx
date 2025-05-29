import NavBar from "./components/navbar/Navbar.jsx";
import { useState, useEffect, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../src/components/home/Home";
import Footer from "./components/footer/Footer.jsx";
import SneakerDisplay from "./components/sneaker-display/SneakerDisplay.jsx";
import Registration from "./components/reg-log/Registration.jsx";
import AdminPage from "./components/admin/admin-page/AdminPage.jsx";
import CreateForm from "./components/admin/product-form/CreateForm.jsx";
import LoginForm from "./components/reg-log/LoginForm.jsx";
import UpdateForm from "./components/admin/product-form/UpdateForm.jsx";
import Cart from "./components/cart/Cart.jsx";
import SneakerByBrand from "./components/sneakerByBrand/SneakerByBrand.jsx";
import AllProducts from "./components/all-products/AllProducts.jsx";
import Payment from "./components/payment/Payment.jsx";
import DeliveryInfo from "./components/delivery/DeliveryInfo.jsx";
import Verify from "./components/verify/Verify.jsx";
import OrderConfirmation from "./components/orderConfirmation/OrderConfirmation.jsx";
import MyOrders from "./components/myorders/MyOrders.jsx";

const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/sneaker/:id"} element={<SneakerDisplay />} />
        <Route path={"/register"} element={<Registration />} />
        <Route path={"/login"} element={<LoginForm />} />
        <Route path={"/admin"} element={<AdminPage />} />
        <Route path={"/new-inventory"} element={<CreateForm />} />
        <Route path={"/update-inventory/:id"} element={<UpdateForm />} />
        <Route path={"/cart"} element={<Cart />} />
        <Route path={"/brand"} element={<SneakerByBrand />} />
        <Route path={"/products"} element={<AllProducts />} />
        <Route path={"/payment"} element={<Payment />} />
        <Route path={"/delivery"} element={<DeliveryInfo />} />
        <Route path={"/verify"} element={<Verify />} />
        <Route path={"/confirmation"} element={<OrderConfirmation />} />
        <Route path={"/myorders"} element={<MyOrders />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
