import syles from '../modules/Header.module.css';
import logo from '../assets/iconaWeb.png';

function Header () {

    return (
        <header className={syles.header}>
        <img src = {logo} alt="logo"/>
        <span>
            <button className= {syles.headerBtn} > Prodotti </button>
            <button className= {syles.headerBtn}> Community </button>
            <button className= {syles.headerBtn}> Novità </button>
        </span>
    </header>
    );

}

export default Header;