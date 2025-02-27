import { useEffect, useState } from 'react';
import styles from '../modules/KitchenPage.module.css';
import Header from '../components/LandingPage/Header';

function KitchenPage() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Funzione per recuperare gli ordini con i piatti associati
    async function getKitchenOrders() {
        try {
            const response = await fetch('http://localhost:3000/kitchen_orders', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Raggruppa i piatti per ordine
            const groupedOrders = data.reduce((acc, item) => {
                const order = acc.find(o => o.Cod_ordine === item.Cod_ordine);
                if (order) {
                    order.dishes.push(item);
                } else {
                    acc.push({
                        Cod_ordine: item.Cod_ordine,
                        Note_ordine: item.Note_ordine,
                        Cod_tavolo: item.Cod_tavolo,
                        Ora: item.Ora,
                        Completato: item.Completato,
                        Pagato: item.Pagato,
                        dishes: [item]
                    });
                }
                return acc;
            }, []);
            setOrders(groupedOrders);
            if (groupedOrders.length > 0) {
                setSelectedOrder(groupedOrders[0].Cod_ordine);
            }
        } catch (error) {
            console.error('Error fetching kitchen orders:', error);
        }
    }

    // Funzione per marcare un piatto come completato o non completato
    async function toggleDishCompletion(orderId, menuId, completato) {
        try {
            const response = await fetch('http://localhost:3000/toggle_dish_completion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orderId, menuId, completato })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Aggiorna la lista degli ordini dopo aver completato il piatto
            getKitchenOrders();
        } catch (error) {
            console.error('Error toggling dish completion:', error);
        }
    }

    useEffect(() => {
        getKitchenOrders();
    }, []);

    const pendingOrders = orders.filter(order => !order.Completato);
    const completedOrders = orders.filter(order => order.Completato);

    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    {pendingOrders.map(order => (
                        <div
                            key={order.Cod_ordine}
                            className={`${styles.tab} ${order.Cod_ordine === selectedOrder ? styles.activeTab : ''}`}
                            onClick={() => setSelectedOrder(order.Cod_ordine)}
                        >
                            Ordine #{order.Cod_ordine}
                        </div>
                    ))}
                </div>
                <div className={styles.mainContent}>
                    <h1>Ordini</h1>
                    <div className={styles.pendingOrders}>
                        {pendingOrders.map(order => (
                            <div
                                key={order.Cod_ordine}
                                className={`${styles.orderItem} ${order.Cod_ordine === selectedOrder ? styles.selectedOrder : ''}`}
                            >
                                <div>
                                    <p>Ordine #{order.Cod_ordine}</p>
                                    <p>Note: {order.Note_ordine}</p>
                                    <p>Tavolo: {order.Cod_tavolo}</p>
                                    <p>Ora: {new Date(order.Ora).toLocaleTimeString()}</p>
                                    <ul>
                                        {order.dishes.map((dish) => (
                                            <li key={dish.Cod_menu} className={styles.dishItem}>
                                                <div>
                                                    <p>Piatto: {dish.Nome}</p>
                                                    <p>Quantità: {dish.Quantita}</p>
                                                </div>
                                                <button
                                                    className={`${styles.dishBtn} ${dish.Pronto ? styles.dishBtnCompleted : ''}`}
                                                    onClick={() => toggleDishCompletion(order.Cod_ordine, dish.Cod_menu, !dish.Pronto)}
                                                >
                                                    {dish.Pronto ? 'Completato' : 'Completa'}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                    <h2>Ordini Completati</h2>
                    <div className={styles.completedOrders}>
                        {completedOrders.map(order => (
                            <div key={order.Cod_ordine} className={styles.completedOrderItem}>
                                <div>
                                    <p>Ordine #{order.Cod_ordine}</p>
                                    <p>Note: {order.Note_ordine}</p>
                                    <p>Tavolo: {order.Cod_tavolo}</p>
                                    <p>Ora: {new Date(order.Ora).toLocaleTimeString()}</p>
                                    <ul>
                                        {order.dishes.map((dish) => (
                                            <li key={dish.Cod_menu} className={styles.dishItem}>
                                                <div>
                                                    <p>Piatto: {dish.Nome}</p>
                                                    <p>Quantità: {dish.Quantita}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default KitchenPage;
