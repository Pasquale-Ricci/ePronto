import { useEffect, useState } from 'react';
import Header from '../LandingPage/Header';
import styles from '../../modules/PayementSection.module.css';
import OrderPage from '../../OrderPage';

function PayementSection() {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [orders, setOrders] = useState([]);
    const [view, setView] = useState(true);

    // Funzione per recuperare i tavoli
    async function getTables() {
        try {
            const response = await fetch('http://localhost:3000/tables', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setTables(data);
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    }

    // Funzione per recuperare tutti gli ordini completati
    async function getOrders() {
        try {
            const response = await fetch('http://localhost:3000/completed_orders', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching completed orders:', error);
        }
    }

    useEffect(() => {
        getTables();
        getOrders();
    }, []);

    const handleTableSelect = (tableId) => {
        setSelectedTable(tableId);
    };

    const applyDiscount = (orderId, discount) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.Cod_ordine === orderId
                    ? { ...order, Totale: order.Totale - (order.Totale * discount / 100) }
                    : order
            )
        );
    };

    const filteredOrders = selectedTable
        ? orders.filter((order) => order.Cod_tavolo === selectedTable)
        : orders;

    if (!view) {
        return <OrderPage />
    }
    return (

        <>
            <Header />
            <button className={styles.backBtn} onClick={() => setView(false)}>Indietro</button>
            <div className={styles.container}>
                <div className={styles.tableSelector}>
                    <h2>Seleziona un Tavolo</h2>
                    <ul>
                        {tables.map((table) => (
                            <li key={table.Cod_tavolo}>
                                <button
                                    className={`${styles.tableBtn} ${selectedTable === table.Cod_tavolo ? styles.selectedTableBtn : ''}`}
                                    onClick={() => handleTableSelect(table.Cod_tavolo)}
                                >
                                    Tavolo {table.Cod_tavolo}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.ordersContainer}>
                    <h2>Ordini Completati</h2>
                    {filteredOrders.length === 0 ? (
                        <p>Nessun ordine completato</p>
                    ) : (
                        <ul>
                            {filteredOrders.map((order) => (
                                <li key={order.Cod_ordine} className={styles.orderItem}>
                                    <div>
                                        <p>Ordine #{order.Cod_ordine}</p>
                                        <p>Totale: €{order.Totale.toFixed(2)}</p>
                                        <p>Note: {order.Note_ordine}</p>
                                    </div>
                                    <div className={styles.discountButtons}>
                                        <button onClick={() => applyDiscount(order.Cod_ordine, 10)}>Sconto 10%</button>
                                        <button onClick={() => applyDiscount(order.Cod_ordine, 20)}>Sconto 20%</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}

export default PayementSection;