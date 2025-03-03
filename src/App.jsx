import { Routes, Route } from "react-router-dom";
import Header from "./components/LandingPage/Header.jsx";
import HeroSection from "./components/LandingPage/HeroSection.jsx";
import FeatureSection from "./components/LandingPage/FeatureSection.jsx";
import Footer from "./components/LandingPage/Footer.jsx";
import ManagerPage from "./pages/ManagerPage.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import KitchenPage from "./pages/KitchenPage.jsx";
import OrderSection from "./components/OrderPage/OrderSection.jsx";
import PayementSection from "./components/OrderPage/PayementSection.jsx";
import TablesSection from "./components/OrderPage/TablesSection.jsx";
import feature1 from "./assets/PiattoFeature2.jpg";
import feature2 from "./assets/StaffFeature2.png";
import feature3 from "./assets/MenuFeature3.png";
import DipendentePage from "./pages/DipendentePage.jsx";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <div id="featureImgs">
                <FeatureSection
                  title="Gestione Ristorante"
                  description="èPronto aiuta a organizzare il lavoro nel ristorante, dalla presa delle ordinazioni fino gestione del magazzino. Un supporto pratico per migliorare il servizio."
                  img={feature1}
                />
                <FeatureSection
                  title="Strumento per lo Staff"
                  description="Ogni membro dello staff ha accesso alle informazioni utili per il proprio ruolo: sala, cucina e gestione. Notifiche e aggiornamenti in tempo reale rendono il lavoro più fluido."
                  img={feature2}
                />
                <FeatureSection
                  title="Funzionalità Intuitive"
                  description="Intelligenza artificiale per migliorare lo schedulazione delle ordinazioni, gestione delle comande e report giornalieri. Un sistema semplice per monitorare ordini, scorte e preferenze dei clienti."
                  img={feature3}
                />
              </div>
              <Footer />
            </>
          }
        />
        <Route path="/manager" element={<ManagerPage />} />
        <Route path="/kitchenpage" element={<KitchenPage />} />
        <Route path="/orderpage" element={<OrderPage />}>
          <Route path="order" element={<OrderSection />} />
          <Route path="payment" element={<PayementSection />} />
          <Route path="tables" element={<TablesSection />} />
        </Route>
        <Route path="/DipendentePage" element={<DipendentePage />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;
