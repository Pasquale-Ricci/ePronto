import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/LandingPage/Header.jsx";
import HeroSection from "./components/LandingPage/HeroSection.jsx";
import FeatureSection from "./components/LandingPage/FeatureSection.jsx";
import Footer from "./components/LandingPage/Footer.jsx";
import ManagerPage from "./pages/ManagerPage";
import OrderPage from "./pages/OrderPage.jsx";
import DipendentePage from "./pages/DipendentePage.jsx";
import feature1 from "./assets/PiattoFeature2.jpg";
import feature2 from "./assets/HamburgerFeature1.jpg";
import feature3 from "./assets/CucinaFeature3.jpg";

function Layout() {
  const location = useLocation();

  const isLandingPage = location.pathname === "/";

  return (
    <>
      {isLandingPage && (
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
      )}

      <Routes>
        <Route path="/" element={null} />
        <Route path="/manager" element={<ManagerPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/dipendente" element={<DipendentePage />} />
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
