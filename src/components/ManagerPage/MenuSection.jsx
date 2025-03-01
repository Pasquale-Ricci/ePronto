import { useState, useEffect } from "react";
import styles from "../../modules/MenuSection.module.css"; // Importa il modulo CSS

function MenuSection() {
  const [menu, setMenu] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  async function fetchMenu() {
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
    }
  }

  async function updateMenuItem() {
    try {
      const response = await fetch("http://localhost:3000/menu_update", {
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
      fetchMenu(); // Ricarica il menu dopo la modifica
    } catch (error) {
      console.error("Error updating menu:", error);
    }
  }

  useEffect(() => {
    fetchMenu();
  }, []);

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
        <h2 key={`header-${currentTipoPiatto}`} className={styles.menuHeader}>
          {currentTipoPiatto}
        </h2>
      );
    }
    menuItems.push(
      <li key={i} className={styles.menuItem}>
        {editingItem === piatto.Cod_menu ? (
          <div>
            <input
              type="text"
              value={formData.Nome || ""}
              onChange={(e) =>
                setFormData({ ...formData, Nome: e.target.value })
              }
            />
            <input
              type="text"
              value={formData.Descrizione || ""}
              onChange={(e) =>
                setFormData({ ...formData, Descrizione: e.target.value })
              }
            />
            <input
              type="text"
              value={formData.Allergeni || ""}
              onChange={(e) =>
                setFormData({ ...formData, Allergeni: e.target.value })
              }
            />
            <input
              type="number"
              value={formData.Prezzo || ""}
              onChange={(e) =>
                setFormData({ ...formData, Prezzo: e.target.value })
              }
            />
            <input
              type="text"
              value={formData.Tipo_piatto || ""}
              onChange={(e) =>
                setFormData({ ...formData, Tipo_piatto: e.target.value })
              }
            />
            <input
              type="number"
              value={formData.Tempo_cottura || ""}
              onChange={(e) =>
                setFormData({ ...formData, Tempo_cottura: e.target.value })
              }
            />
            <button onClick={updateMenuItem}>Salva</button>
            <button onClick={() => setEditingItem(null)}>Annulla</button>
          </div>
        ) : (
          <div>
            <strong>{piatto.Nome}</strong>
            <p>{piatto.Descrizione}</p>
            <span>
              Allergeni: {piatto.Allergeni}, Tempo di cottura:{" "}
              {piatto.Tempo_cottura} min
            </span>
            <button
              onClick={() => {
                setEditingItem(piatto.Cod_menu);
                setFormData(piatto);
              }}
            >
              Modifica
            </button>
          </div>
        )}
      </li>
    );
  }

  return (
    <div className={styles.menuContainer}>
      <h2 className={styles.menuTitle}>Menu Corrente</h2>
      <ul className={styles.menuList}>{menuItems}</ul>
    </div>
  );
}

export default MenuSection;
