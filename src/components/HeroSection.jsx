import styles from '../modules/HeroSection.module.css';
import logo from '../assets/logoWeb.png';
import { useState, useRef } from 'react';

function HeroSection() {
    const [loginBtn, setLoginBtn] = useState(false);
    const [signInBtn, setSignInBtn] = useState(false);

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const regEmailRef = useRef(null);
    const regPasswordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const roleRef = useRef(null);

    const updateLoginForm = () => {
        setLoginBtn(!loginBtn);
        setSignInBtn(false);
    }

    const updateSignInForm = () => {
        setSignInBtn(!signInBtn);
        setLoginBtn(false);
    }

    const handleLogin = async (event) => {
        event.preventDefault();

        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        const user = {
            email: email,
            password: password
        };

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            const data = await response.json();

            if (data.token) {
                alert('Login effettuato con successo!');
                // Salva il token nel localStorage o nelle cookie
                localStorage.setItem('token', data.token);
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleRegistration = async (event) => {
        event.preventDefault();

        const email = regEmailRef.current.value;
        const password = regPasswordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;
        const role = roleRef.current.value;

        if (password !== confirmPassword) {
            alert('Le password non coincidono');
            return;
        }

        const user = {
            email: email,
            password: password,
            ruolo: role
        };

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            const data = await response.json();

            if (data.message) {
                alert('Registrazione effettuata con successo!');
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loginBtn) {
        return (
            <div className={styles.heroSection}>
                <form onSubmit={handleLogin}>
                    <input ref={emailRef} type="text" placeholder="Email" />
                    <input ref={passwordRef} type="password" placeholder="Password" />
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
                <form onSubmit={handleRegistration}>
                    <input ref={regEmailRef} type="text" placeholder="Email" />
                    <input ref={regPasswordRef} type="password" placeholder="Password" />
                    <input ref={confirmPasswordRef} type="password" placeholder="Conferma Password" />
                    <select ref={roleRef} required>
                        <option value="">Seleziona il ruolo</option>
                        <option value="dipendente">Dipendente</option>
                        <option value="proprietario">Proprietario</option>
                    </select>
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