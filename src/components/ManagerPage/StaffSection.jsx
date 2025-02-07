import { useEffect, useState } from "react";

function StaffSection() {
    const [staff, setStaff] = useState([]);
    const [newStaff, setNewStaff] = useState('');

    // Funzione per aggiungere staff
    async function handleAddStaff() {
        try {
            const response = await fetch('http://localhost:3000/addStaff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cod_dipendente: newStaff })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setStaff(prevStaff => [...prevStaff, data]);
            setNewStaff('');
        } catch (error) {
            console.error('Error adding staff:', error);
        }
    }

    // Funzione per ottenere la lista dello staff
    async function fetchStaff() {
        try {
            const response = await fetch('http://localhost:3000/staff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json(); // Assicurati di chiamare response.json()
            return Array.isArray(data) ? data : []; // Assicurati che data sia un array
        } catch (error) {
            console.error('Error fetching staff:', error);
            return [];
        }
    }

    useEffect(() => {
        async function getStaff() {
            const data = await fetchStaff();
            setStaff(data);
        }

        getStaff();
    }, []);

    return (
        <div>
            <h2>Personale</h2>
            <ul>
                {staff.map((staff, index) => (
                    <li key={index}>{staff.nome} {staff.cognome}</li>
                ))}
            </ul>
            <input 
                id="newStaffInput"
                value={newStaff}
                onChange={(e) => setNewStaff(e.target.value)}
                type="text"
                placeholder="Inserisci il codice del dipendente da aggiungere"
            />
            <button onClick={handleAddStaff}>Aggiungi Dipendente</button>
        </div>
    );
}

export default StaffSection;