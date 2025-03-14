import Header from "../LandingPage/Header";
import { useState, useEffect } from "react";
import styles from "../../modules/TablesSection.module.css";
import OrderPage from "../../pages/OrderPage";

function TablesSection({ onBack }) {
  // Questa prop serve per gestire il ritorno
  const [tables, setTables] = useState([]);


  // Funzione per recuperare i tavoli
  async function getTables() {
    const cod_ristorante = localStorage.getItem("cod_ristorante");
    if (!cod_ristorante) {
      console.error("Codice ristorante non trovato nel localStorage");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cod_ristorante }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTables(data.sort((a, b) => a.Cod_tavolo - b.Cod_tavolo));
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  }

  // Funzione per mettere a sedere i clienti (occupa il tavolo)
  async function seatCustomers(tableId) {
    try {
      const response = await fetch("http://localhost:3000/seat_customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tableId: tableId }),
      });
    } catch (error) {
      console.error("Error seating customers:", error);
    }
  }

  useEffect(() => {
    getTables();
  }, []);

  return (
    <>
      <Header />
      <button className={styles.backBtn} onClick={onBack}>
        {" "}
        {/* Usa la prop `onBack` */}
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
