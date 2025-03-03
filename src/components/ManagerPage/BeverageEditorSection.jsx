import { useState } from "react";
import styles from "../../modules/BeverageEditorSection.module.css";

function BeverageEditorSection({ changeView = () => {}, onSave }) {
  const [formData, setFormData] = useState({
    Nome: "",
    Scadenza: "",
    Quantita: "",
    Quantita_max: "",
    Quantita_critica: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function addBeverage() {
    try {
      await onSave(formData);
      setFormData({
        Nome: "",
        Scadenza: "",
        Quantita: "",
        Quantita_max: "",
        Quantita_critica: "",
      });
      changeView();
    } catch (error) {
      console.error("Errore nell'aggiunta della bevanda:", error);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={changeView}>
          Indietro
        </button>
        <h2 className={styles.title}>Aggiungi Bevanda</h2>
        <button className={styles.saveButton} onClick={addBeverage}>
          Salva
        </button>
      </div>
      <form className={styles.form}>
        {[
          { name: "Nome", type: "text", placeholder: "Nome" },
          { name: "Scadenza", type: "date", placeholder: "Scadenza" },
          { name: "Quantita", type: "number", placeholder: "Quantità" },
          {
            name: "Quantita_max",
            type: "number",
            placeholder: "Quantità massima",
          },
          {
            name: "Quantita_critica",
            type: "number",
            placeholder: "Quantità critica",
          },
        ].map(({ name, type, placeholder }) => (
          <input
            key={name}
            type={type}
            name={name}
            placeholder={placeholder}
            value={formData[name]}
            onChange={handleInputChange}
          />
        ))}
      </form>
    </div>
  );
}

export default BeverageEditorSection;
