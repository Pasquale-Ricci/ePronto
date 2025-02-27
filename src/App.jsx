import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/LandingPage/Header.jsx";
import HeroSection from "./components/LandingPage/HeroSection.jsx";
import FeatureSection from "./components/LandingPage/FeatureSection.jsx";
import Footer from "./components/LandingPage/Footer.jsx";
import ManagerPage from "./pages/ManagerPage.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import KitchenPage from "./pages/KitchenPage.jsx";
import OrderSection from "./components/OrderPage/OrderSection.jsx"; // Assicurati che il percorso sia corretto
import PayementSection from "./components/OrderPage/PaymentSection.jsx"; // Corretto
import TablesSection from "./components/OrderPage/TablesSection.jsx";
import feature1 from "./assets/PiattoFeature2.jpg";
import feature2 from "./assets/HamburgerFeature1.jpg";
import feature3 from "./assets/CucinaFeature3.jpg";

function Layout() {
  return (
    <>
      {/* Route per la landing page */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <HeroSection />
              <div id="featureImgs">
                <FeatureSection
                  title="Prodotti"
                  description="L'app èPronto è un software di gestione per il tuo ristorante..."
                  img={feature1}
                />
                <FeatureSection
                  title="Community"
                  description="L'app èPronto è un software di gestione per il tuo ristorante..."
                  img={feature2}
                />
                <FeatureSection
                  title="Novità"
                  description="L'app èPronto è un software di gestione per il tuo ristorante..."
                  img={feature3}
                />
              </div>
              <Footer />
            </>
          }
        />

        {/* Pagine interne */}
        <Route path="/manager" element={<ManagerPage />} />
        <Route path="/kitchenpage" element={<KitchenPage />} />

        {/* Route per la pagina dell'ordine */}
        <Route path="/orderpage" element={<OrderPage />}>
          <Route path="order" element={<OrderSection />} />
          <Route path="payment" element={<PayementSection />} />
          <Route path="tables" element={<TablesSection />} />
        </Route>

        {/* Route 404 */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
