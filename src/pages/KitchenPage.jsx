import { useEffect, useState } from "react";
import styles from "../modules/KitchenPage.module.css";
import Header from "../components/LandingPage/Header";

function KitchenPage() {
  const [orders, setOrders] = useState([]);

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
        const order = acc.find((o) => o.Cod_ordine === item.Cod_ordine);
        if (order) {
          order.dishes.push(item);
        } else {
          acc.push({
            Cod_ordine: item.Cod_ordine,
            Totale: item.Totale,
            Note_ordine: item.Note_ordine,
            Cod_tavolo: item.Cod_tavolo,
            Ora: item.Ora,
            Completato: item.Completato,
            Pagato: item.Pagato,
            dishes: [item],
          });
        }
        return acc;
      }, []);
      setOrders(groupedOrders);
    } catch (error) {
      console.error("Error fetching kitchen orders:", error);
    }
  }

  // Funzione per marcare un piatto come completato
  async function completeDish(orderId, menuId) {
    try {
      const response = await fetch("http://localhost:3000/complete_dish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, menuId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Aggiorna la lista degli ordini dopo aver completato il piatto
      getKitchenOrders();
    } catch (error) {
      console.error("Error completing dish:", error);
    }
  }

  useEffect(() => {
    getKitchenOrders();
  }, []);

  return (
    <>
      <Header />
      <div className={styles.container}>
        {orders.length === 0 ? (
          <p>No orders to display</p>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order.Cod_ordine} className={styles.orderItem}>
                <div>
                  <p>Order #{order.Cod_ordine}</p>
                  <p>Total: €{order.Totale.toFixed(2)}</p>
                  <p>Notes: {order.Note_ordine}</p>
                  <p>Table: {order.Cod_tavolo}</p>
                  <p>Time: {new Date(order.Ora).toLocaleTimeString()}</p>
                  <ul>
                    {order.dishes.map((dish) => (
                      <li key={dish.Cod_menu} className={styles.dishItem}>
                        <div>
                          <p>Dish: {dish.Nome}</p>
                          <p>Quantity: {dish.Quantita}</p>
                          <p>Cooking Time: {dish.Tempo_cottura} mins</p>
                        </div>
                        <button
                          className={styles.dishButton}
                          onClick={() =>
                            completeDish(order.Cod_ordine, dish.Cod_menu)
                          }
                        >
                          Complete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default KitchenPage;
