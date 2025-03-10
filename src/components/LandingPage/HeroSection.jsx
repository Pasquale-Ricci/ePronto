import styles from "../../modules/HeroSection.module.css";
import logo from "../../assets/logoWeb.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Feedback from "../Feedback";

function HeroSection() {
  const [loginBtn, setLoginBtn] = useState(false);
  const [signInBtn, setSignInBtn] = useState(false);
  const [firstLogin, setFirstLogin] = useState(false);

  // Stati per gli input
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [citta, setCitta] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  // Stati per il feedback
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isFeedbackPositive, setIsFeedbackPositive] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const navigate = useNavigate();

  // Funzione per mostrare il feedback
  const displayFeedback = (message, isPositive) => {
    setFeedbackMessage(message);
    setIsFeedbackPositive(isPositive);
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
    }, 4000);
  };

  const updateLoginForm = () => {
    setLoginBtn(!loginBtn);
    setSignInBtn(false);
  };

  const updateSignInForm = () => {
    setSignInBtn(!signInBtn);
    setLoginBtn(false);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome,
          cognome: cognome,
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (data.token) {
        displayFeedback("Login effettuato con successo!", true);
        localStorage.setItem("token", data.token);
        localStorage.setItem("ruolo", data.ruolo);
        localStorage.setItem("cod_utente", data.ID);

        // Se è il primo login e il ruolo è "proprietario", gestisci il primo login
        if (data.firstLogin && data.ruolo === "proprietario") {
          setFirstLogin(true);
        } else {
          // Salva il codice ristorante se presente
          if (data.cod_ristorante) {
            localStorage.setItem("cod_ristorante", data.cod_ristorante);
          }

          // Navigazione basata sul ruolo e sul codice ristorante
          if (data.ruolo === "proprietario") {
            navigate("/manager");
          } else if (data.ruolo === "Cameriere") {
            if (data.cod_ristorante) {
              navigate("/OrderPage");
            } else {
              displayFeedback(
                "Non sei associato a nessun ristorante. Contatta l'amministratore.",
                false
              );
              navigate("/DipendentePage");
            }
          } else if (data.ruolo === "Chef") {
            if (data.cod_ristorante) {
              navigate("/kitchenpage");
            } else {
              displayFeedback(
                "Non sei associato a nessun ristorante. Contatta l'amministratore.",
                false
              );
              navigate("/DipendentePage");
            }
          } else {
            displayFeedback(
              "Ruolo non riconosciuto o codice ristorante mancante.",
              false
            );
          }
        }
      } else {
        displayFeedback(data.error || "Errore durante il login.", false);
      }
    } catch (error) {
      console.error("Error:", error);
      displayFeedback("Errore durante il login.", false);
    }
  };

  const handleRegisterRestaurant = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3000/register-restaurant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: restaurantName,
            id_proprietario: localStorage.getItem("cod_utente"),
            citta: citta,
            indirizzo: indirizzo,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        displayFeedback("Ristorante registrato con successo!", true);
        localStorage.setItem("cod_ristorante", data.cod_ristorante);
        setFirstLogin(false);
        navigate("/manager");
      } else {
        displayFeedback(
          data.error || "Errore durante la registrazione.",
          false
        );
      }
    } catch (error) {
      console.error("Errore:", error);
      displayFeedback("Errore durante la registrazione.", false);
    }
  };

  const handleRegistration = async (event) => {
    event.preventDefault();

    if (regPassword !== confirmPassword) {
      displayFeedback("Le password non coincidono.", false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome,
          cognome: cognome,
          email: regEmail,
          password: regPassword,
          ruolo: role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        displayFeedback("Registrazione effettuata con successo!", true);
        updateSignInForm();
      } else {
        displayFeedback(
          data.error || "Errore durante la registrazione.",
          false
        );
      }
    } catch (error) {
      console.error("Errore:", error);
      displayFeedback("Errore durante la registrazione.", false);
    }
  };

  // Se il proprietario effettua il primo login, mostra il form di registrazione del ristorante
  if (firstLogin) {
    return (
      <div className={styles.heroSection}>
        <form onSubmit={handleRegisterRestaurant}>
          <input
            type="text"
            placeholder="Nome del ristorante"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Città del ristorante"
            value={citta}
            onChange={(e) => setCitta(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Indirizzo del ristorante"
            value={indirizzo}
            onChange={(e) => setIndirizzo(e.target.value)}
            required
          />
          <button type="submit">Registra Ristorante</button>
        </form>
        {showFeedback && (
          <Feedback messaggio={feedbackMessage} positivo={isFeedbackPositive} />
        )}
      </div>
    );
  }

  // Mostra il form di login
  if (loginBtn) {
    return (
      <div className={styles.heroSection}>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />
          <div className={styles.formButtons}>
            <button className={styles.signInBtn} type="submit">
              Accedi
            </button>
            <button
              className={styles.rewindBtn}
              type="button"
              onClick={updateLoginForm}
            >
              Indietro
            </button>
          </div>
        </form>
        {showFeedback && (
          <Feedback messaggio={feedbackMessage} positivo={isFeedbackPositive} />
        )}
      </div>
    );
  }

  // Mostra il form di registrazione
  if (signInBtn) {
    return (
      <div className={styles.heroSection}>
        <form onSubmit={handleRegistration}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Cognome"
            value={cognome}
            onChange={(e) => setCognome(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Conferma Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <select
            className={styles.selectRole}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Seleziona il ruolo</option>
            <option value="Chef">Chef</option>
            <option value="Cameriere">Cameriere</option>
            <option value="proprietario">Proprietario</option>
          </select>
          <div className={styles.formButtons}>
            <button className={styles.signInBtn} type="submit">
              Registrati
            </button>
            <button className={styles.rewindBtn} onClick={updateSignInForm}>
              Indietro
            </button>
          </div>
        </form>
        {showFeedback && (
          <Feedback messaggio={feedbackMessage} positivo={isFeedbackPositive} />
        )}
      </div>
    );
  }

  // Mostra la schermata iniziale con i pulsanti di accesso e registrazione
  return (
    <div className={styles.heroSection}>
      <img className={styles.heroImage} src={logo} alt="logo" />
      <button className={styles.loginBtn} onClick={updateLoginForm}>
        Accedi
      </button>
      <button className={styles.signInBtn} onClick={updateSignInForm}>
        Registrati
      </button>
      {showFeedback && (
        <Feedback messaggio={feedbackMessage} positivo={isFeedbackPositive} />
      )}
    </div>
  );
}

export default HeroSection;
