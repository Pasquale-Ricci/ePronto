import styles from '../modules/HeroSection.module.css';
import logo from '../assets/logoWeb.png';

function HeroSection() {

    return (
        <div className = {styles.heroSection}>
            <img className = {styles.heroImage} src = {logo} alt="logo"/>
                <span>
                    <button className = {styles.loginBtn}> Accedi</button>
                    <button className = {styles.signInBtn}> Registrati</button>
                </span>
        </div>
    )
}

export default HeroSection;