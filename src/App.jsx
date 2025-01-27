import Header from './components/Header.jsx'
import HeroSection from './components/HeroSection.jsx'
import feature1 from './assets/PiattoFeature2.jpg'
import feature2 from './assets/HamburgerFeature1.jpg'
import feature3 from './assets/CucinaFeature3.jpg'
import FeatureSection from './components/FeatureSection.jsx'
import FeatureCard from './components/FeatureCard.jsx'
import Footer from './components/Footer.jsx'

function App() {

  return (
    <>

      <Header></Header>
      <HeroSection></HeroSection>

      <div id="featureImgs">

        <FeatureSection
          title="Prodotti"
          description="L'app èPronto è un software di gestione per il tuo ristorante
                    con tutti gli elementi per poter aiutare il tuo personale nello svolgimento del loro lavoro.
                    L'app ti consente di gestire il tuo locale a 360 gradi, dalla gestione del menu, alla gestione delle
                    ordinazioni, comande
                    e beverage, con molto altro ancora."
          img={feature1}
        />

        <FeatureSection
          title="Prodotti"
          description="L'app èPronto è un software di gestione per il tuo ristorante
                    con tutti gli elementi per poter aiutare il tuo personale nello svolgimento del loro lavoro.
                    L'app ti consente di gestire il tuo locale a 360 gradi, dalla gestione del menu, alla gestione delle
                    ordinazioni, comande
                    e beverage, con molto altro ancora."
          img={feature2}
        />

        <FeatureSection
          title="Prodotti"
          description="L'app èPronto è un software di gestione per il tuo ristorante
                    con tutti gli elementi per poter aiutare il tuo personale nello svolgimento del loro lavoro.
                    L'app ti consente di gestire il tuo locale a 360 gradi, dalla gestione del menu, alla gestione delle
                    ordinazioni, comande
                    e beverage, con molto altro ancora."
          img={feature3}
        />


      </div>

      <h2 id="featuresTitle">Scopri le nostre funzionalità...</h2>

      <div id = "featureCards">

        <FeatureCard
        title = "Gestione del menu"
        description = "Gestisci il tuo menu in modo semplice e veloce, aggiungi, modifica o elimina i tuoi piatti in pochi click.">
        </FeatureCard>

        <FeatureCard
        title = "Gestione del menu"
        description = "Gestisci il tuo menu in modo semplice e veloce, aggiungi, modifica o elimina i tuoi piatti in pochi click.">
        </FeatureCard>
        
        <FeatureCard
        title = "Gestione del menu"
        description = "Gestisci il tuo menu in modo semplice e veloce, aggiungi, modifica o elimina i tuoi piatti in pochi click.">
        </FeatureCard>

        <FeatureCard
        title = "Gestione del menu"
        description = "Gestisci il tuo menu in modo semplice e veloce, aggiungi, modifica o elimina i tuoi piatti in pochi click.">
        </FeatureCard>

        <FeatureCard
        title = "Gestione del menu"
        description = "Gestisci il tuo menu in modo semplice e veloce, aggiungi, modifica o elimina i tuoi piatti in pochi click.">
        </FeatureCard>

        <FeatureCard
        title = "Gestione del menu"
        description = "Gestisci il tuo menu in modo semplice e veloce, aggiungi, modifica o elimina i tuoi piatti in pochi click.">
        </FeatureCard>

      </div>

      <Footer></Footer>

    </>
  )
}

export default App
