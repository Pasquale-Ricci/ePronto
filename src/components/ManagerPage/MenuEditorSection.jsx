import { useState, useEffect } from "react";

function MenuEditorSection() {
  const [nome, setNome] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [allergeni, setAllergeni] = useState("");
  const [prezzo, setPrezzo] = useState("");
  const [tipo, setTipoPiatto] = useState("");
  const [tempoCottura, setTempoCottura] = useState("");
  const [disponibile, setDisponibile] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const codRistorante = localStorage.getItem("cod_ristorante");
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

      // Pulisci i campi del form
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
    <div>
      <h2>Aggiungi un nuovo piatto al menu</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">Nome del piatto: </label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="descrizione">Descrizione: </label>
          <input
            type="text"
            id="descrizione"
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="allergeni">Allergeni: </label>
          <input
            type="text"
            id="allergeni"
            value={allergeni}
            onChange={(e) => setAllergeni(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="prezzo">Prezzo: </label>
          <input
            type="number"
            id="prezzo"
            value={prezzo}
            onChange={(e) => setPrezzo(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="tipo">Tipo di piatto: </label>
          <input
            type="text"
            id="tipo"
            value={tipo}
            onChange={(e) => setTipoPiatto(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="tempo">Tempo di cottura (minuti): </label>
          <input
            type="number"
            id="tempo"
            value={tempoCottura}
            onChange={(e) => setTempoCottura(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="disponibile">Disponibile: </label>
          <input
            type="checkbox"
            id="disponibile"
            checked={disponibile}
            onChange={(e) => setDisponibile(e.target.checked)}
          />
        </div>
        <button type="submit">Aggiungi piatto</button>
      </form>
    </div>
  );
}
export default MenuEditorSection;
