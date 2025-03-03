import React from "react";
import styles from "../modules/DipendentePage.module.css";
import { useNavigate } from "react-router-dom";

function DipendentePage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <h1>Benvenuto nella pagina del dipendente</h1>
      <p>Questa è la pagina dedicata ai dipendenti del ristorante.</p>
      <pre className={styles.pre}>
        Benvenuto su ePronto! Il tuo codice utente e'
        {localStorage.getItem("cod_utente")}. Fornisci il tuo codice dipendente
        all'amministratore del tuo ristorante.
      </pre>
      <button className={styles.loginButton} onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default DipendentePage;
