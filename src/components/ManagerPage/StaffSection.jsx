import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import styles from "../../modules/ManagerPage.module.css";

function StaffSection() {
  const [staff, setStaff] = useState([]); // Stato per memorizzare la lista del personale
  const [newStaff, setNewStaff] = useState(""); // Stato per memorizzare il nuovo codice dipendente

  const cod_ristorante = localStorage.getItem("cod_ristorante");
  const cod_utente = localStorage.getItem("cod_utente");
  const ruolo = localStorage.getItem("ruolo");


  // Funzione per aggiungere un nuovo dipendente
  async function handleAddStaff() {
    try {
      const response = await fetch("http://localhost:3000/addStaff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cod_dipendente: newStaff,
          cod_ristorante: cod_ristorante,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }


      const data = await response.json();
      setStaff((prevStaff) => [...prevStaff, data]);
      setNewStaff(""); // Resetta l'input
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  }

  // Funzione per ottenere la lista del personale
  async function fetchStaff() {
    try {
      const response = await fetch("http://localhost:3000/staff", {
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
      setStaff(Array.isArray(data) ? data : []); // Aggiorna lo stato solo se i dati sono un array
    } catch (error) {
      console.error("Error fetching staff:", error);
      setStaff([]); // Imposta la lista del personale come vuota in caso di errore
    }
  }


  // Funzione per rimuovere un dipendente
  async function removeStaff(ID) {
    try {
      const response = await fetch("http://localhost:3000/removeStaff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ID }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Rimuove il dipendente dalla lista
      setStaff((prevStaff) => prevStaff.filter((staff) => staff.ID !== ID));
    } catch (error) {
      console.error("Error removing staff:", error);
    }
  }

  useEffect(() => {
    fetchStaff();
  }, []); 

  return (
    <div>
      <h2>Personale</h2>
      <ul>
        {staff.map((staffMember, index) => (
          <li className={styles.staffContainer} key={index}>
            <p className={styles.staffName}>
              {staffMember.Nome} {staffMember.Cognome}
            </p>
            <p className={styles.staffRole}>{staffMember.Ruolo}</p>
            <button
              className={styles.removeStaffBtn}
              onClick={() => removeStaff(staffMember.ID)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </li>
        ))}
      </ul>
      <input
        id="newStaffInput"
        className={styles.newStaffInput}
        value={newStaff}
        onChange={(e) => setNewStaff(e.target.value)}
        type="text"
        placeholder="Inserisci il codice del dipendente"
      />
      <button className={styles.managerBtn} onClick={handleAddStaff}>
        Aggiungi Dipendente
      </button>
    </div>
  );
}

export default StaffSection;
