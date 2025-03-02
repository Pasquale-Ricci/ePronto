import Header from "../LandingPage/Header";
import { useEffect, useState } from "react";
import OrderPage from "../../pages/OrderPage";
import styles from "../../modules/OrderSection.module.css";
import Feedback from "../Feedback"; // Importa il componente Feedback

function OrderSection() {
  const [view, setView] = useState(true);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(0);
  const [menu, setMenu] = useState([]);
  const [order, setOrder] = useState({});
  const [notes, setNotes] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState(""); // Stato per il messaggio di feedback
  const [feedbackType, setFeedbackType] = useState(""); // Stato per il tipo di feedback (positivo/negativo)

  // Funzione per visualizzare i tavoli disponibili
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

  // Funzione per aprire il menu del tavolo selezionato
  function takeOrder(table) {
    setSelectedTable(table);
  }

  // Funzione per visualizzare il menu
  async function getMenu() {
    try {
      const response = await fetch("http://localhost:3000/menu", {
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
      setMenu(Array.isArray(data) ? data : []); // Assicurati che data sia un array
    } catch (error) {
      console.error("Error fetching menu:", error);
      setMenu([]);
      setFeedbackMessage("Errore nel caricamento del menu");
      setFeedbackType("errore");
    }
  }

  useEffect(() => {
    getTables();
    getMenu();
  }, []);

  const addToOrder = (piatto) => {
    setOrder((prevOrder) => {
      const newOrder = { ...prevOrder };
      if (newOrder[piatto.Cod_menu]) {
        newOrder[piatto.Cod_menu]++;
      } else {
        newOrder[piatto.Cod_menu] = 1;
      }
      return newOrder;
    });
  };

  const removeFromOrder = (piatto) => {
    setOrder((prevOrder) => {
      const newOrder = { ...prevOrder };
      if (newOrder[piatto.Cod_menu]) {
        newOrder[piatto.Cod_menu]--;
        if (newOrder[piatto.Cod_menu] === 0) {
          delete newOrder[piatto.Cod_menu];
        }
      }
      return newOrder;
    });
  };

  const submitOrder = async () => {
    try {
      // Calcola il totale dell'ordine
      const totale = Object.keys(order).reduce((sum, cod_menu) => {
        const piatto = menu.find((p) => p.Cod_menu === parseInt(cod_menu));
        return sum + piatto.Prezzo * order[cod_menu];
      }, 0);

      // Inserisci l'ordine nella tabella Ordine
      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: selectedTable,
          totale: totale,
          notes: notes,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { cod_ordine } = await response.json();

      // Inserisci i piatti ordinati nella tabella Menu_ordine
      await Promise.all(
        Object.keys(order).map(async (cod_menu) => {
          await fetch("http://localhost:3000/menu_order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cod_ordine,
              cod_menu: parseInt(cod_menu),
              quantita: order[cod_menu],
            }),
          });
        })
      );

      setFeedbackMessage("Ordine inviato con successo!");
      setFeedbackType("successo");
      setOrder({});
      setNotes("");
    } catch (error) {
      console.error("Error submitting order:", error);
      setFeedbackMessage("Errore durante l'invio dell'ordine");
      setFeedbackType("errore");
    }
  };

  if (!view) {
    return <OrderPage />;
  }

  if (!menu.length) {
    return (
      <>
        <Header />
        <button className={styles.backBtn} onClick={() => setView(false)}>
          Indietro
        </button>
        <div className={styles.tableList}>
          {tables.map((table, index) => (
            <div key={index}>
              <button
                className={`${styles.tableBtn} ${
                  selectedTable === table.Cod_tavolo
                    ? styles.selectedTableBtn
                    : ""
                }`}
                onClick={() => takeOrder(table.Cod_tavolo)}
              >
                Tavolo {table.Cod_tavolo}
              </button>
            </div>
          ))}
        </div>
        {feedbackMessage && (
          <Feedback
            messaggio={feedbackMessage}
            positivo={feedbackType === "successo"}
          />
        )}
      </>
    );
  } else {
    const sortedMenu = [...menu].sort((a, b) =>
      a.Tipo_piatto.localeCompare(b.Tipo_piatto)
    );

    const menuItems = [];
    let currentTipoPiatto = "";

    for (let i = 0; i < sortedMenu.length; i++) {
      const piatto = sortedMenu[i];
      if (piatto.Tipo_piatto !== currentTipoPiatto) {
        currentTipoPiatto = piatto.Tipo_piatto;
        menuItems.push(
          <h2 key={`header-${currentTipoPiatto}`}>{currentTipoPiatto}</h2>
        );
      }
      menuItems.push(
        <li key={i} className={styles.menuItem}>
          {piatto.Nome}
          <div className={styles.menuButtons}>
            <button
              className={styles.menuBtn}
              onClick={() => removeFromOrder(piatto)}
            >
              -
            </button>
            <span className={styles.menuCount}>
              {order[piatto.Cod_menu] || 0}
            </span>
            <button
              className={styles.menuBtn}
              onClick={() => addToOrder(piatto)}
            >
              +
            </button>
          </div>
        </li>
      );
    }
    return (
      <>
        <Header />
        <button className={styles.backBtn} onClick={() => setView(false)}>
          Indietro
        </button>
        <div className={styles.tableList}>
          {tables.map((table, index) => (
            <div key={index}>
              <button
                className={`${styles.tableBtn} ${
                  selectedTable === table.Cod_tavolo
                    ? styles.selectedTableBtn
                    : ""
                }`}
                onClick={() => takeOrder(table.Cod_tavolo)}
              >
                Tavolo {table.Cod_tavolo}
              </button>
            </div>
          ))}
        </div>

        <div className={styles.menu}>
          <h2>Menu Corrente</h2>
          <ul>{menuItems}</ul>
          <textarea
            className={styles.notes}
            placeholder="Aggiungi note all'ordine"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button className={styles.submitBtn} onClick={submitOrder}>
            Invia Ordine
          </button>
        </div>
        {feedbackMessage && (
          <Feedback
            messaggio={feedbackMessage}
            positivo={feedbackType === "successo"}
          />
        )}
      </>
    );
  }
}

export default OrderSection;
