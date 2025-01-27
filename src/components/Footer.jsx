import styles from '../modules/Footer.module.css'
import icon from '../assets/iconaWeb.png'
import twitterLogo from '../assets/twitter.png'
import instagramLogo from '../assets/instagram.png'
import youtubeLogo from '../assets/youtube.png'

function Footer() {
    return (
        <footer>
            <span className = {styles.footerContent}>
                <img src = {icon} alt = "logo" />
                <img src = {twitterLogo} alt = "logo di Twitter" />
                <img src = {instagramLogo} alt = "logo di Instagram" />
                <img src = {youtubeLogo} alt = "logo di Youtube" />
                <p> © 2025 ePronto </p>
                <h4>Contatti</h4>
                <pre>Telefono: 1234567890 <br /> Email: epronto@mail.boh</pre>
            </span>
        </footer>
    )
}

export default Footer