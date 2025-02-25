import { useState } from "react";
import Header from "./components/LandingPage/Header";
import styles from './modules/OrderPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faChair, faCashRegister } from '@fortawesome/free-solid-svg-icons';

import OrderSection from "./components/OrderPage/OrderSection";

function OrderPage() {

    const [view, setView] = useState("");

    switch (view) {
        case "order":
            return (
                <OrderSection />
            )
        case "payment":
            return (
                <>
                </>
            )
        case "tables":
            return (
                <>
                </>
            )
        default:
            return (
                <>
                    <Header />
                    <div className={styles.sectionsContainer}>
                        <div className={styles.section}>
                            <h2>Ordina</h2>
                            <button onClick={() => setView("order")}><FontAwesomeIcon icon={faCartPlus} /></button>
                        </div>
                        <div className={styles.section}>
                            <h2>Paga</h2>
                            <button onClick={() => setView("payment")}><FontAwesomeIcon icon={faChair} /></button>
                        </div>
                        <div className={styles.section}>
                            <h2>Visualizza i tavoli</h2>
                            <button onClick={() => setView("tables")}><FontAwesomeIcon icon={faCashRegister} /></button>
                        </div>
                    </div>
                </>
            )
    }
}

export default OrderPage;