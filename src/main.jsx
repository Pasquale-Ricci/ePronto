import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ManagerPage from "./pages/ManagerPage";
import OrderPage from "./pages/OrderPage";
import "./index.css";
import KitchenPage from "./pages/KitchenPage";
import 'primereact/resources/themes/saga-blue/theme.css';  // Scegli il tema che preferisci
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <KitchenPage />
  </React.StrictMode>
);
