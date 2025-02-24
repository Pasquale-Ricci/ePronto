import styles from '../../modules/Header.module.css';
import logo from '../../assets/iconaWeb.png';

function Header() {
  return (
    <header className={styles.header}>
      <img className={styles.logo} src={logo} alt="logo" />
      <h2>èPronto</h2>
    </header>
  );
}

export default Header;