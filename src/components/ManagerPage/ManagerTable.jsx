import { useEffect, useState } from "react";
import style from "../../modules/ManagerTable.module.css";

function ManagerTable({ changeView }) {
  // Aggiungi changeView come prop
  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState({ posti: "" });

  useEffect(() => {
    fetchTables();
  }, []);

  async function fetchTables() {
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

  async function addTable() {
    try {
      const response = await fetch("http://localhost:3000/add_table", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          posti: newTable.posti,
          cod_ristorante: localStorage.getItem("cod_ristorante"),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Tavolo aggiunto con successo!");
      fetchTables();
      setNewTable({ posti: "" });
    } catch (error) {
      console.error("Error adding table:", error);
      alert("Errore durante l'aggiunta del tavolo.");
    }
  }

  async function removeTable(tableId) {
    try {
      const response = await fetch("http://localhost:3000/remove_table", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: tableId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Tavolo rimosso con successo!");
      fetchTables();
    } catch (error) {
      console.error("Error removing table:", error);
      alert("Errore durante la rimozione del tavolo.");
    }
  }

  return (
    <div className={style.container}>
      <h2>Gestione Tavoli</h2>
      <button onClick={() => changeView("main")} className={style.backButton}>
        Indietro
      </button>
      <div className={style.tableList}>
        {tables.map((table) => (
          <div key={table.Cod_tavolo} className={style.tableItem}>
            <span>
              Tavolo {table.Cod_tavolo} - Posti: {table.Posti}
            </span>
            <button onClick={() => removeTable(table.Cod_tavolo)}>
              Rimuovi
            </button>
          </div>
        ))}
      </div>
      <div className={style.addTableSection}>
        <input
          type="number"
          value={newTable.posti}
          onChange={(e) => setNewTable({ posti: e.target.value })}
          placeholder="Numero Posti"
        />
        <button onClick={addTable}>Aggiungi Tavolo</button>
      </div>
    </div>
  );
}

export default ManagerTable;
