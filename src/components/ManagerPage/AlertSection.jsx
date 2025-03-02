import React, { useEffect, useState } from "react";
import styles from "../../modules/AlertSection.module.css";
function AlertSection() {
  const [alerts, setAlerts] = useState(null);

  //Funzione per ottenere la lista degli alert mediante il server del DB
  async function fetchAlerts() {
    try {
      const response = await fetch("http://localhost:3000/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cod_ristorante: localStorage.getItem("cod_ristorante"),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  }

  useEffect(() => {
    async function getAlerts() {
      const data = await fetchAlerts();
      setAlerts(data);
    }

    getAlerts();
  }, []);

  if (!alerts) {
    return (
      <div className={styles.alertsContainer}>
        <h2>Alerts</h2>
        <p className={styles.noAlertsMessage}>
          Non ci sono alerts da visualizzare
        </p>
      </div>
    );
  }

  return (
    <div className={styles.alertsContainer}>
      <h2>Alerts</h2>
      <div className={styles.alertSection}>
        <h3>Beverage Alerts</h3>
        <ul className={styles.alertList}>
          {alerts.beverage.map((item, index) => (
            <li key={index} className={styles.alertItem}>
              {item.Nome}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AlertSection;
