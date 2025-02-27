import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ManagerPage from "./pages/ManagerPage";
import OrderPage from "./pages/OrderPage.jsx";
import "./index.css";
<<<<<<< HEAD
import KitchenPage from "./pages/KitchenPage";
import 'primereact/resources/themes/saga-blue/theme.css';  // Scegli il tema che preferisci
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
=======
import HeroSection from "./components/LandingPage/HeroSection";
>>>>>>> a4e32832d6aac4518dcaaaeeac24af43db3340e2

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <KitchenPage />
  </React.StrictMode>
);
