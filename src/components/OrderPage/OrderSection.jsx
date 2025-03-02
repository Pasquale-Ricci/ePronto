import Header from "../LandingPage/Header";
import { useEffect, useState } from "react";
import OrderPage from "../../pages/OrderPage";
import styles from "../../modules/OrderSection.module.css";
import Feedback from "../Feedback";

function OrderSection() {
  const [view, setView] = useState(true);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(0);
  const [menu, setMenu] = useState([]);
  const [beverages, setBeverages] = useState([]);
  const [order, setOrder] = useState({});
  const [beverageOrder, setBeverageOrder] = useState({});
  const [notes, setNotes] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("");

  // Funzione per selezionare un tavolo
  const takeOrder = (tableId) => {
    setSelectedTable(tableId);
  };

  // Funzione per visualizzare i tavoli disponibili
  async function getTables() {
    try {
      const response = await fetch("http://localhost:3000/tables", {
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
      setTables(data);
    } catch (error) {
      console.error("Error fetching tables:", error);
      setFeedbackMessage("Errore nel caricamento dei tavoli");
      setFeedbackType("errore");
    }
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
      setMenu(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching menu:", error);
      setMenu([]);
      setFeedbackMessage("Errore nel caricamento del menu");
      setFeedbackType("errore");
    }
  }

  // Funzione per visualizzare le bevande
  async function getBeverages() {
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
      setBeverages(data);
    } catch (error) {
      console.error("Error fetching beverages:", error);
      setFeedbackMessage("Errore nel caricamento delle bevande");
      setFeedbackType("errore");
    }
  }

  useEffect(() => {
    getTables();
    getMenu();
    getBeverages();
  }, []);

  // Funzione per aggiungere un piatto all'ordine
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

  // Funzione per rimuovere un piatto dall'ordine
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

  // Funzione per aggiungere una bevanda all'ordine
  const addBeverageToOrder = (beverage) => {
    setBeverageOrder((prevOrder) => {
      const newOrder = { ...prevOrder };
      if (newOrder[beverage.Cod_scorta]) {
        newOrder[beverage.Cod_scorta]++;
      } else {
        newOrder[beverage.Cod_scorta] = 1;
      }
      return newOrder;
    });
  };

  // Funzione per rimuovere una bevanda dall'ordine
  const removeBeverageFromOrder = (beverage) => {
    setBeverageOrder((prevOrder) => {
      const newOrder = { ...prevOrder };
      if (newOrder[beverage.Cod_scorta]) {
        newOrder[beverage.Cod_scorta]--;
        if (newOrder[beverage.Cod_scorta] === 0) {
          delete newOrder[beverage.Cod_scorta];
        }
      }
      return newOrder;
    });
  };

  const submitOrder = async () => {
    try {
      // Calcola il totale dell'ordine dei piatti
      const totalePiatti = Object.keys(order).reduce((sum, cod_menu) => {
        const piatto = menu.find((p) => p.Cod_menu === parseInt(cod_menu));
        return sum + piatto.Prezzo * order[cod_menu];
      }, 0);

      // Calcola il totale dell'ordine delle bevande
      const totaleBevande = Object.keys(beverageOrder).reduce((sum, cod_scorta) => {
        const beverage = beverages.find((b) => b.Cod_scorta === parseInt(cod_scorta));
        return sum + (beverage?.Prezzo || 0) * beverageOrder[cod_scorta];
      }, 0);

      const totale = totalePiatti + totaleBevande;

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

      // Aggiorna la quantità di bevande nella tabella Beverage
      await Promise.all(
        Object.keys(beverageOrder).map(async (cod_scorta) => {
          await fetch("http://localhost:3000/beverage_order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cod_scorta: parseInt(cod_scorta),
              quantita: beverageOrder[cod_scorta],
            }),
          });
        })
      );

      setFeedbackMessage("Ordine inviato con successo!");
      setFeedbackType("successo");
      setOrder({});
      setBeverageOrder({});
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
                className={`${styles.tableBtn} ${selectedTable === table.Cod_tavolo
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
          <Feedback messaggio={feedbackMessage} positivo={feedbackType === "successo"} />
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

    const beverageItems = beverages.map((beverage, index) => (
      <li key={index} className={styles.menuItem}>
        {beverage.Nome}
        <div className={styles.menuButtons}>
          <button
            className={styles.menuBtn}
            onClick={() => removeBeverageFromOrder(beverage)}
          >
            -
          </button>
          <span className={styles.menuCount}>
            {beverageOrder[beverage.Cod_scorta] || 0}
          </span>
          <button
            className={styles.menuBtn}
            onClick={() => addBeverageToOrder(beverage)}
          >
            +
          </button>
        </div>
      </li>
    ));

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
                className={`${styles.tableBtn} ${selectedTable === table.Cod_tavolo
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

        <div className={styles.sectionContainer}>
          <div className={styles.menu}>
            <h2>Menu Corrente</h2>
            <ul>{menuItems}</ul>
          </div>

          <div className={styles.menu}>
            <h2>Bevande</h2>
            <ul>{beverageItems}</ul>
          </div>
        </div>
        <div className={styles.endSection}>
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
          <Feedback messaggio={feedbackMessage} positivo={feedbackType === "successo"} />
        )}
      </>
    );
  }
}

export default OrderSection;