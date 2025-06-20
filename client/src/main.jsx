import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import CartProvider from "./context/CartContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <React.StrictMode>
      <CartProvider>
        <App />
      </CartProvider>
    </React.StrictMode>
  </BrowserRouter>
);
