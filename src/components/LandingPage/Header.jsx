import styles from "../../modules/Header.module.css";
import logo from "../../assets/iconaWeb.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Controlla se l'utente è loggato al caricamento del componente
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("ruolo");
    window.localStorage.removeItem("cod_ristorante");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <img className={styles.logo} src={logo} alt="logo" />
      <h2>èPronto</h2>

      {/* Header condizionale */}
      {isLoggedIn ? (
        // Header per utenti loggati
        <div className={styles.headerLoggedIn}>
          <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        // Header per utenti non loggati
        <div className={styles.headerLoggedOut}></div>
      )}
    </header>
  );
}

export default Header;