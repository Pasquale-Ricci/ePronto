import styles from "../../modules/Header.module.css";
import logo from "../../assets/iconaWeb.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Notification from "../OrderPage/Notification";

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Controlla se l'utente è loggato al caricamento del componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
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
          <Notification />
        </div>
      ) : (
        // Header per utenti non loggati
        <div className={styles.headerLoggedOut}></div>
      )}
    </header>
  );
}

export default Header;