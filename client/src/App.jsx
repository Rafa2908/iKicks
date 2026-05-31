import { Routes, Route } from "react-router-dom";
import NavBar from "./components/navbar/Navbar.jsx";
import Home from "../src/components/home/Home";
import Footer from "./components/footer/Footer.jsx";
import SneakerDisplay from "./components/sneaker-display/SneakerDisplay.jsx";
import Registration from "./components/reg-log/Registration.jsx";
import LoginForm from "./components/reg-log/LoginForm.jsx";
import SneakerByBrand from "./components/sneakerByBrand/SneakerByBrand.jsx";
import About from "./components/about/About.jsx";
import Reviews from "./components/reviews/Reviews.jsx";
import ShippingInfo from "./components/shipping-info/ShippingInfo.jsx";
import TermsAndConditions from "./components/terms/TermsAndConditions.jsx";
import PrivacyPolicy from "./components/privacy-policy/PrivacyPolicy.jsx";
import Contact from "./components/contact/Contact.jsx";
import SizeGuide from "./components/size-guide/SizeGuide.jsx";
import AdminPage from "./components/admin/admin-page/AdminPage.jsx";
import CreateForm from "./components/admin/product-form/CreateForm.jsx";
// import UpdateForm from "./components/admin/product-form/UpdateForm.jsx";
// import Cart from "./components/cart/Cart.jsx";
// import AllProducts from "./components/all-products/AllProducts.jsx";
// import Payment from "./components/payment/Payment.jsx";
// import DeliveryInfo from "./components/delivery/DeliveryInfo.jsx";
// import Verify from "./components/verify/Verify.jsx";
// import OrderConfirmation from "./components/orderConfirmation/OrderConfirmation.jsx";
// import MyOrders from "./components/myorders/MyOrders.jsx";

const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/register"} element={<Registration />} />
        <Route path={"/login"} element={<LoginForm />} />
        <Route path={"/products/:productId"} element={<SneakerDisplay />} />
        <Route path={"/filter/:input"} element={<SneakerByBrand />} />
        <Route path={"/about"} element={<About />} />
        <Route path={"/reviews"} element={<Reviews />} />
        <Route path={"/shipping"} element={<ShippingInfo />} />
        <Route path={"/terms"} element={<TermsAndConditions />} />
        <Route path={"/privacy"} element={<PrivacyPolicy />} />
        <Route path={"/contact"} element={<Contact />} />
        <Route path={"/size-guide"} element={<SizeGuide />} />
        <Route path={"/admin"} element={<AdminPage />} />
        <Route path={"/new-inventory"} element={<CreateForm />} />
        {/*
        
        
        <Route path={"/update-inventory/:id"} element={<UpdateForm />} />
        <Route path={"/cart"} element={<Cart />} />
        <Route path={"/products"} element={<AllProducts />} />
        <Route path={"/payment"} element={<Payment />} />
        <Route path={"/delivery"} element={<DeliveryInfo />} />
        <Route path={"/verify"} element={<Verify />} />
        <Route path={"/confirmation"} element={<OrderConfirmation />} />
        <Route path={"/myorders"} element={<MyOrders />} /> */}
      </Routes>
      <Footer />
    </>
  );
};

export default App;
