import Header from "../LandingPage/Header";
import { useState, useEffect } from "react";
import styles from '../../modules/TablesSection.module.css';
import OrderPage from "../../pages/OrderPage";

function TablesSection() {
  const [view, setView] = useState(true);
  const [tables, setTables] = useState([]);

  // Funzione per recuperare i tavoli
  async function getTables() {
    try {
      const response = await fetch("http://localhost:3000/tables", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  }

  // Funzione per mettere a sedere i clienti
  async function seatCustomers(tableId) {
    try {
      const response = await fetch(
        `http://localhost:3000/seat_customers/${tableId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      getTables();
    } catch (error) {
      console.error("Error seating customers:", error);
    }
  }

    // Funzione per mettere a sedere i clienti
    async function seatCustomers(tableId) {
        try {
            const response = await fetch('http://localhost:3000/seat_customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tableId: tableId })
            });
          } catch (error) {
            console.error('Error seating customers:', error);
          }
        }
  if (!view) {
    return <OrderPage />;
  }

  return (
    <>
      <Header />
      <button className={styles.backBtn} onClick={() => setView(false)}>
        Indietro
      </button>
      <div className={styles.tablesContainer}>
        {tables.map((table) => (
          <div
            key={table.Cod_tavolo}
            className={`${styles.table} ${
              table.Disponibile ? styles.available : styles.unavailable
            }`}
          >
            <p>Tavolo {table.Cod_tavolo}</p>
            <p>Posti: {table.Posti}</p>
            {table.Disponibile && (
              <button onClick={() => seatCustomers(table.Cod_tavolo)}>
                Metti a sedere
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
export default TablesSection;
