import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStickyNote,
  faClock,
  faChair,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../modules/KitchenPage.module.css";
import Header from "../components/LandingPage/Header";

function KitchenPage() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const codRistorante = localStorage.getItem('cod_ristorante');

  // Funzione per recuperare gli ordini con i piatti associati
  async function getKitchenOrders() {
    try {
      const response = await fetch("http://localhost:3000/kitchen_orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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

            setOrders(groupedOrders); // Aggiorna lo stato degli ordini
            if (groupedOrders.length > 0) {
                setSelectedOrder(groupedOrders[0].Cod_ordine);
            }

            return groupedOrders; // Restituisci i dati degli ordini
        } catch (error) {
            console.error('Error fetching kitchen orders:', error);
            return []; // Restituisci un array vuoto in caso di errore
        }
    }

    async function toggleDishCompletion(orderId, menuId, completato, dishName) {
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
    
            // Invia notifica del piatto completato
            const dishMessage = `Il piatto ${dishName} dell'ordine #${orderId} è stato completato.`;
            await notify(orderId, dishMessage);
    
            // Aggiorna la lista degli ordini
            const updatedOrders = await getKitchenOrders();
    
            // Verifica se l'intero ordine è completato
            const order = updatedOrders.find(o => o.Cod_ordine === orderId);
            if (order && order.dishes.every(dish => dish.Pronto)) {
                // Contrassegna l'ordine come completato nel database
                const completeResponse = await fetch('http://localhost:3000/complete_order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ orderId })
                });
    
                if (!completeResponse.ok) {
                    throw new Error(`HTTP error! status: ${completeResponse.status}`);
                }
    
                // Invia notifica dell'ordine completato
                const orderMessage = `L'ordine #${orderId} è stato completato.`;
                await notify(orderId, orderMessage);
    
                // Aggiorna la lista degli ordini nel frontend
                await getKitchenOrders();
            }
        } catch (error) {
            console.error('Error toggling dish completion:', error);
        }
    }
    

    // Funzione per inviare la notifica ai camerieri
    async function notify(orderId, message) {
        try {
            const response = await fetch('http://localhost:3000/notify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orderId, codRistorante, message })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error sending notifications:', error);
        }
    }

  useEffect(() => {
    getKitchenOrders();
  }, []);

  const pendingOrders = orders.filter((order) => !order.Completato);
  const completedOrders = orders.filter((order) => order.Completato);

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
                                <div className={styles.orderDetails}>
                                    <p><FontAwesomeIcon icon={faStickyNote} /> {order.Note_ordine}</p>
                                    <p><FontAwesomeIcon icon={faChair} /> {order.Cod_tavolo}</p>
                                    <p><FontAwesomeIcon icon={faClock} /> {new Date(order.Ora).toLocaleTimeString()}</p>
                                    <ul>
                                        {order.dishes.map((dish) => (
                                            <li key={dish.Cod_menu} className={styles.dishItem}>
                                                <div>
                                                    <p>Piatto: {dish.Nome}</p>
                                                    <p>Quantità: {dish.Quantita}</p>
                                                </div>
                                                <button
                                                    className={`${styles.dishBtn} ${dish.Pronto ? styles.dishBtnCompleted : ''}`}
                                                    onClick={() => toggleDishCompletion(order.Cod_ordine, dish.Cod_menu, !dish.Pronto, dish.Nome)}
                                                >
                                                    {dish.Pronto ? 'Completato' : <FontAwesomeIcon icon={faCircleCheck} />}
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
                                <div className={styles.orderDetails}>
                                    <p className={styles.orderNumber}>Ordine #{order.Cod_ordine}</p>
                                    <p><FontAwesomeIcon icon={faStickyNote} /> {order.Note_ordine}</p>
                                    <p><FontAwesomeIcon icon={faChair} /> {order.Cod_tavolo}</p>
                                    <p><FontAwesomeIcon icon={faClock} /> {new Date(order.Ora).toLocaleTimeString()}</p>
                                    <ul>
                                        {order.dishes.map((dish) => (
                                            <li key={dish.Cod_menu} className={styles.dishItem}>
                                                <div>
                                                    <p>{dish.Nome}</p>
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