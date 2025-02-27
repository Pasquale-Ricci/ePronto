import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ManagerPage from "./pages/ManagerPage";
import OrderPage from "./pages/OrderPage.jsx";
import "./index.css";
import HeroSection from "./components/LandingPage/HeroSection";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
