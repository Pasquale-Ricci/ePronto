import { useState, useEffect } from "react";
import styles from "../../modules/BeverageSection.module.css"; // Importa il modulo CSS

function BeverageSection({ changeView }) {
  const [beverages, setBeverages] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Funzione per formattare la data
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // I mesi partono da 0
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  async function fetchBeverages() {
    try {
      const response = await fetch("http://localhost:3000/beverages", {
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
      setBeverages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching beverages:", error);
      setBeverages([]);
    }
  }

  async function updateBeverage() {
    try {
      const response = await fetch("http://localhost:3000/beverages_update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setEditingItem(null);
      setFormData({});
      fetchBeverages();
    } catch (error) {
      console.error("Error updating beverage:", error);
    }
  }

  useEffect(() => {
    fetchBeverages();
  }, []);

  const beverageItems = beverages.map((beverage, i) => (
    <li key={i} className={styles.beverageItem}>
      {editingItem === beverage.Cod_scorta ? (
        <div>
          <input
            type="text"
            value={formData.Nome || ""}
            onChange={(e) => setFormData({ ...formData, Nome: e.target.value })}
          />
          <input
            type="date"
            value={formData.Scadenza || ""}
            onChange={(e) =>
              setFormData({ ...formData, Scadenza: e.target.value })
            }
          />
          <input
            type="number"
            value={formData.Quantita || ""}
            onChange={(e) =>
              setFormData({ ...formData, Quantita: e.target.value })
            }
          />
          <input
            type="number"
            value={formData.Quantita_max || ""}
            onChange={(e) =>
              setFormData({ ...formData, Quantita_max: e.target.value })
            }
          />
          <input
            type="number"
            value={formData.Quantita_critica || ""}
            onChange={(e) =>
              setFormData({ ...formData, Quantita_critica: e.target.value })
            }
          />
          <button
            className={styles.beverageSave}
            onClick={() => setEditingItem(null)}
          >
            Annulla
          </button>
          <button className={styles.beverageSave} onClick={updateBeverage}>
            Salva
          </button>
        </div>
      ) : (
        <div>
          <strong>{beverage.Nome}</strong>
          <p>Scadenza: {formatDate(beverage.Scadenza)}</p>{" "}
          {/* Formatta la data qui */}
          <span>Quantità: {beverage.Quantita}</span>
          <span>Quantità massima: {beverage.Quantita_max}</span>
          <span>Quantità critica: {beverage.Quantita_critica}</span>
          <button
            className={styles.beverageChange}
            onClick={() => {
              setEditingItem(beverage.Cod_scorta);
              setFormData(beverage);
            }}
          >
            Modifica
          </button>
        </div>
      )}
    </li>
  ));

  return (
    <div className={styles.beverageContainer}>
      <div className={styles.beverageHeader}>
        <h2 className={styles.beverageTitle}>Bevande</h2>
        <button className={styles.backButton} onClick={changeView}>
          Indietro
        </button>
      </div>
      <ul className={styles.beverageList}>{beverageItems}</ul>
    </div>
  );
}

export default BeverageSection;
