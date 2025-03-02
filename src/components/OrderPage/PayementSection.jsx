import { useEffect, useState } from 'react';
import Header from '../LandingPage/Header';
import styles from '../../modules/PayementSection.module.css';
import OrderPage from '../../pages/OrderPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

function PayementSection() {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [orders, setOrders] = useState([]);
    const [view, setView] = useState(true);

    // Funzione per recuperare i tavoli
    async function getTables() {
        const cod_ristorante = localStorage.getItem('cod_ristorante');
        if (!cod_ristorante) {
            console.error('Codice ristorante non trovato nel localStorage');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/tables', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cod_ristorante })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setTables(data.sort((a, b) => a.Cod_tavolo - b.Cod_tavolo));
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

    // Funzione per completare un pagamento
    async function completePayment(orderId) {
        try {
            const response = await fetch('http://localhost:3000/complete_payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orderId: orderId })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Aggiorna la lista degli ordini dopo aver completato il pagamento
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.Cod_ordine === orderId
                        ? { ...order, Pagato: true }
                        : order
                )
            );
        } catch (error) {
            console.error('Error completing payment:', error);
        }
    }

    
    // Funzione per rendere di nuovo disponibile il tavolo dopo che sono stati completati tutti i pagamenti
    async function freeTable(tableId) {
        try {
            const response = await fetch('http://localhost:3000/free_table', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tableId: tableId })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Aggiorna la lista dei tavoli dopo aver liberato il tavolo
            getTables();
        } catch (error) {
            console.error('Error freeing table:', error);
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
        ? orders.filter((order) => order.Cod_tavolo === selectedTable && !order.Pagato)
        : orders.filter((order) => !order.Pagato);

    useEffect(() => {
        if (filteredOrders.length === 0 && selectedTable !== null) {
            freeTable(selectedTable);
            setSelectedTable(null);
        }
    }, [filteredOrders]);

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
                        <p>Nessun ordine completato da pagare</p>
                    ) : (
                        <ul>
                            {filteredOrders.map((order) => {
                                // Verifica che totale sia un numero
                                const totale = typeof order.Totale === 'number' ? order.Totale : parseFloat(order.Totale);

                                return (
                                    <li key={order.Cod_ordine} className={styles.orderItem}>
                                        <div>
                                            <p>Ordine #{order.Cod_ordine}</p>
                                            <p>Totale: €{!isNaN(totale) ? totale.toFixed(2) : '0.00'}</p>
                                            <p>Note: {order.Note_ordine}</p>
                                        </div>
                                        <div className={styles.discountButtons}>
                                            <button onClick={() => applyDiscount(order.Cod_ordine, 10)}>Sconto 10%</button>
                                            <button onClick={() => applyDiscount(order.Cod_ordine, 20)}>Sconto 20%</button>
                                            <button onClick={() => completePayment(order.Cod_ordine)}>
                                                <FontAwesomeIcon icon={faCircleCheck} />
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}

export default PayementSection;