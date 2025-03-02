import { useState } from "react";
import Header from "../components/LandingPage/Header";
import styles from '../modules/OrderPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faChair, faCashRegister } from '@fortawesome/free-solid-svg-icons';
import OrderSection from "../components/OrderPage/OrderSection";
import PayementSection from "../components/OrderPage/PaymentSection";
import TablesSection from "../components/OrderPage/TablesSection";

function OrderPage() {
    const [view, setView] = useState("");

    const handleBack = () => {
        setView(""); // Torna alla vista principale
    };

    switch (view) {
        case "order":
            return <OrderSection onBack={handleBack} />;
        case "payment":
            return <PayementSection onBack={handleBack} />;
        case "tables":
            return <TablesSection onBack={handleBack} />;
        default:
            return (
                <>
                    <Header />
                    <div className={styles.sectionsContainer}>
                        <div className={styles.section}>
                            <h2>Ordina</h2>
                            <button onClick={() => setView("order")} className={styles.orderBtn}>
                                <FontAwesomeIcon icon={faCartPlus} />
                            </button>
                        </div>
                        <div className={styles.section}>
                            <h2>Paga</h2>
                            <button onClick={() => setView("payment")} className={styles.orderBtn}>
                                <FontAwesomeIcon icon={faCashRegister} />
                            </button>
                        </div>
                        <div className={styles.section}>
                            <h2>Visualizza i tavoli</h2>
                            <button onClick={() => setView("tables")} className={styles.orderBtn}>
                                <FontAwesomeIcon icon={faChair} />
                            </button>
                        </div>
                    </div>
                </>
            );
    }
}

export default OrderPage;