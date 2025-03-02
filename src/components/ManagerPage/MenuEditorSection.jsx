import { useState } from "react";
import styles from "../../modules/MenuEditorSection.module.css";
import MenuSection from "../ManagerPage/MenuSection";
import Feedback from "../Feedback"; // Importa il componente Feedback

function MenuEditorSection({ changeView }) {
  const [nome, setNome] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [allergeni, setAllergeni] = useState("");
  const [prezzo, setPrezzo] = useState("");
  const [tipo, setTipoPiatto] = useState("");
  const [tempoCottura, setTempoCottura] = useState("");
  const [disponibile, setDisponibile] = useState(true);
  const [menuUpdated, setMenuUpdated] = useState(false);
  const [customTipo, setCustomTipo] = useState(false);

  // Stati per il feedback
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isFeedbackPositive, setIsFeedbackPositive] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const tipiPiattoPredefiniti = [
    "Antipasto",
    "Primo",
    "Secondo",
    "Dolce",
    "Altro",
  ];

  const handleTipoChange = (e) => {
    const value = e.target.value;
    if (value === "Altro") {
      setCustomTipo(true);
      setTipoPiatto("");
    } else {
      setCustomTipo(false);
      setTipoPiatto(value);
    }
  };

  // Funzione per mostrare il feedback
  const displayFeedback = (message, isPositive) => {
    setFeedbackMessage(message);
    setIsFeedbackPositive(isPositive);
    setShowFeedback(true);

    // Nascondi il feedback dopo 4 secondi
    setTimeout(() => {
      setShowFeedback(false);
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const codRistorante = window.localStorage.getItem("cod_ristorante");

    if (!codRistorante) {
      displayFeedback("Codice ristorante non trovato. Effettua il login.", false);
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

      // Mostra feedback di successo
      displayFeedback("Piatto creato con successo!", true);

      // Reset campi
      setNome("");
      setDescrizione("");
      setAllergeni("");
      setPrezzo("");
      setTipoPiatto("");
      setTempoCottura("");
      setDisponibile(true);

      // Attiva aggiornamento menu
      setMenuUpdated((prev) => !prev);
    } catch (error) {
      console.error("Error creating menu item:", error);
      // Mostra feedback di errore
      displayFeedback("Errore durante la creazione del piatto.", false);
    }
  };

  return (
    <div className={styles.menuEditorContainer}>
      {/* Mostra il feedback se necessario */}
      {showFeedback && (
        <Feedback messaggio={feedbackMessage} positivo={isFeedbackPositive} />
      )}

      <form onSubmit={handleSubmit} className={styles.menuForm}>
        <h2 className={styles.menuFormTitle}>
          Aggiungi un nuovo piatto al menu
        </h2>
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
          <div className={styles.menuFormInputContainer}>
            <select
              id="tipo-select"
              value={customTipo ? "Altro" : tipo}
              onChange={handleTipoChange}
              className={styles.menuFormInput}
            >
              <option value="">Seleziona un tipo</option>
              {tipiPiattoPredefiniti.map((tipoPiatto, index) => (
                <option key={index} value={tipoPiatto}>
                  {tipoPiatto}
                </option>
              ))}
            </select>
            {customTipo && (
              <input
                type="text"
                id="tipo"
                value={tipo}
                onChange={(e) => setTipoPiatto(e.target.value)}
                className={styles.menuFormInput}
                placeholder="Scrivi il tipo di piatto"
              />
            )}
          </div>
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

      {/* Menu corrente */}
      <div className={styles.menuSection}>
        <MenuSection
          style={{
            menuContainer: styles.menuContainer,
            menuList: styles.menuList,
          }}
          menuUpdated={menuUpdated}
        />
      </div>
    </div>
  );
}

export default MenuEditorSection;