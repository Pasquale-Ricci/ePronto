import styles from "../../modules/HeroSection.module.css";
import logo from "../../assets/logoWeb.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const [loginBtn, setLoginBtn] = useState(false);
  const [signInBtn, setSignInBtn] = useState(false);
  const [firstLogin, setFirstLogin] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [citta, setCitta] = useState("");
  const [password, setPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login effettuato con successo!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("ruolo", data.ruolo);

        if (data.firstLogin && data.ruolo === "proprietario") {
          setFirstLogin(true);
        } else {
          localStorage.setItem("cod_ristorante", data.cod_ristorante);
          navigate("/dipendente");
        }
      } else {
        alert(data.error || "Errore durante il login.");
      }
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  const handleRegisterRestaurant = async (event) => {
    event.preventDefault();

    const ruolo = localStorage.getItem("ruolo");
    if (ruolo !== "proprietario") {
      alert("Solo i proprietari possono registrare un ristorante.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/register-restaurant",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: restaurantName,
            email,
            citta,
            indirizzo,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Ristorante registrato con successo!");
        localStorage.setItem("cod_ristorante", data.cod_ristorante);
        setFirstLogin(false);
        navigate("/manager");
      } else {
        alert(data.error || "Errore durante la registrazione.");
      }
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  const handleRegistration = async (event) => {
    event.preventDefault();

    if (regPassword !== confirmPassword) {
      alert("Le password non coincidono.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: regEmail,
          password: regPassword,
          ruolo: role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registrazione effettuata con successo!");
        updateSignInForm();
      } else {
        alert(data.error || "Errore durante la registrazione.");
      }
    } catch (error) {
      console.error("Errore:", error);
    }
  };

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
      </div>
    );
  }

  if (loginBtn) {
    return (
      <div className={styles.heroSection}>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className={styles.formButtons}>
            <button type="submit">Accedi</button>
            <button type="button" onClick={updateLoginForm}>
              Indietro
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (signInBtn) {
    return (
      <div className={styles.heroSection}>
        <form onSubmit={handleRegistration}>
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
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Seleziona il ruolo</option>
            <option value="dipendente">Dipendente</option>
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
      </div>
    );
  }

  return (
    <div className={styles.heroSection}>
      <img className={styles.heroImage} src={logo} alt="logo" />
      <button onClick={updateLoginForm}>Accedi</button>
      <button onClick={updateSignInForm}>Registrati</button>
    </div>
  );
}

export default HeroSection;
