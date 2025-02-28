import { useState } from "react";
import styles from "../../modules/MenuEditorSection.module.css";

function MenuEditorSection({ changeView }) {
  const [nome, setNome] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [allergeni, setAllergeni] = useState("");
  const [prezzo, setPrezzo] = useState("");
  const [tipo, setTipoPiatto] = useState("");
  const [tempoCottura, setTempoCottura] = useState("");
  const [disponibile, setDisponibile] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const codRistorante = window.localStorage.getItem("cod_ristorante");

    if (!codRistorante) {
      alert("Codice ristorante non trovato. Effettua il login.");
      return;
    }

    const newMenuItem = {
      nome,
      descrizione,
      allergeni,
      prezzo: parseFloat(prezzo),
      tipo_piatto: tipo,
      tempo_cottura: tempoCottura,
      Disponibile: disponibile,
      Cod_ristorante: codRistorante,
    };

    try {
      const response = await fetch("http://localhost:3000/create_menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMenuItem),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Menu item created:", data);
      alert("Piatto creato con successo!");

      setNome("");
      setDescrizione("");
      setAllergeni("");
      setPrezzo("");
      setTipoPiatto("");
      setTempoCottura("");
      setDisponibile(true);
    } catch (error) {
      console.error("Error creating menu item:", error);
      alert("Errore durante la creazione del piatto.");
    }
  };

  return (
    <div className={styles.menuFormContainer}>
      <h2 className={styles.menuFormTitle}>Aggiungi un nuovo piatto al menu</h2>
      <form onSubmit={handleSubmit} className={styles.menuForm}>
        <div className={styles.menuFormGroup}>
          <label htmlFor="nome" className={styles.menuFormLabel}>
            Nome del piatto:
          </label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={styles.menuFormInput}
            required
          />
        </div>
        <div className={styles.menuFormGroup}>
          <label htmlFor="descrizione" className={styles.menuFormLabel}>
            Descrizione:
          </label>
          <input
            type="text"
            id="descrizione"
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
            className={styles.menuFormInput}
          />
        </div>
        <div className={styles.menuFormGroup}>
          <label htmlFor="allergeni" className={styles.menuFormLabel}>
            Allergeni:
          </label>
          <input
            type="text"
            id="allergeni"
            value={allergeni}
            onChange={(e) => setAllergeni(e.target.value)}
            className={styles.menuFormInput}
          />
        </div>
        <div className={styles.menuFormGroup}>
          <label htmlFor="prezzo" className={styles.menuFormLabel}>
            Prezzo:
          </label>
          <input
            type="number"
            id="prezzo"
            value={prezzo}
            onChange={(e) => setPrezzo(e.target.value)}
            className={styles.menuFormInput}
            required
          />
        </div>
        <div className={styles.menuFormGroup}>
          <label htmlFor="tipo" className={styles.menuFormLabel}>
            Tipo di piatto:
          </label>
          <input
            type="text"
            id="tipo"
            value={tipo}
            onChange={(e) => setTipoPiatto(e.target.value)}
            className={styles.menuFormInput}
            required
          />
        </div>
        <div className={styles.menuFormGroup}>
          <label htmlFor="tempo" className={styles.menuFormLabel}>
            Tempo di cottura (minuti):
          </label>
          <input
            type="number"
            id="tempo"
            value={tempoCottura}
            onChange={(e) => setTempoCottura(e.target.value)}
            className={styles.menuFormInput}
            required
          />
        </div>
        <div className={styles.menuFormGroup}>
          <label htmlFor="disponibile" className={styles.menuFormLabel}>
            Disponibile:
          </label>
          <div className={styles.menuFormToggle}>
            <input
              type="checkbox"
              id="disponibile"
              checked={disponibile}
              onChange={(e) => setDisponibile(e.target.checked)}
            />
            <span className={styles.menuFormToggleSlider}></span>
          </div>
        </div>
        <button type="submit" className={styles.menuFormSubmitButton}>
          Aggiungi piatto
        </button>
        <button className={styles.menuFormBackButton} onClick={changeView}>
          Indietro
        </button>
      </form>
    </div>
  );
}

export default MenuEditorSection;
