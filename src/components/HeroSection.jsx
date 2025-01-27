import styles from '../modules/HeroSection.module.css';
import logo from '../assets/logoWeb.png';
import { useState } from 'react';

function HeroSection() {
    const [loginBtn, setLoginBtn] = useState(false);
    const [signInBtn, setSignInBtn] = useState(false);

    const updateLoginForm = () => {
        setLoginBtn(!loginBtn);
        setSignInBtn(false); 
    }

    const updateSignInForm = () => {
        setSignInBtn(!signInBtn);
        setLoginBtn(false); 
    }

    if (loginBtn) {
        return (
            <div className={styles.heroSection}>
                <form>
                    <input type="text" placeholder="Username" />
                    <input type="password" placeholder="Password" />
                    <div className={styles.formButtons}>
                        <button className={styles.loginBtn} type='submit'>Accedi</button>
                        <button className={styles.rewindBtn} onClick={updateLoginForm}>Indietro</button>
                    </div>
                </form>
            </div>
        );
    }

    if (signInBtn) {
        return (
            <div className={styles.heroSection}>
                <form>
                    <input type="text" placeholder="Username" />
                    <input type="text" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <input type="password" placeholder="Conferma Password" />
                    <div className={styles.formButtons}>
                        <button className={styles.signInBtn} type='submit'>Registrati</button>
                        <button className={styles.rewindBtn} onClick={updateSignInForm}>Indietro</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className={styles.heroSection}>
            <img className={styles.heroImage} src={logo} alt="logo" />
            <span>
                <button className={styles.loginBtn} onClick={updateLoginForm}>Accedi</button>
                <button className={styles.signInBtn} onClick={updateSignInForm}>Registrati</button>
            </span>
        </div>
    );
}

export default HeroSection;