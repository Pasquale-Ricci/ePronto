import { useState, useEffect } from 'react';

function MenuSection() {
    const [menu, setMenu] = useState([]);

    async function fetchMenu() {
        try {
            const response = await fetch('http://localhost:3000/menu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cod_ristorante: 1 })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return Array.isArray(data) ? data : []; // Assicurati che data sia un array

        } catch (error) {
            console.error('Error fetching menu:', error);
            return [];
        }
    }

    useEffect(() => {
        async function getMenu() {
            const data = await fetchMenu();
            setMenu(data);
        }

        getMenu();
    }, []);

    // Ordina i piatti per tipo_piatto
    const sortedMenu = [...menu].sort((a, b) => a.tipo_piatto.localeCompare(b.tipo_piatto));

    // Crea un array di elementi JSX
    const menuItems = [];
    let currentTipoPiatto = '';

    for (let i = 0; i < sortedMenu.length; i++) {
        const piatto = sortedMenu[i];
        if (piatto.tipo_piatto !== currentTipoPiatto) {
            currentTipoPiatto = piatto.tipo_piatto;
            menuItems.push(<h2 key={`header-${currentTipoPiatto}`}>{currentTipoPiatto}</h2>);
        }
        menuItems.push(<li key={i}>{piatto.nome}</li>);
    }

    return (
        <div>
            <h2>Menu Corrente</h2>
            <ul>
                {menuItems}
            </ul>
        </div>
    );
}

export default MenuSection;
