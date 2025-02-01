/*
Gli alert riscontrabili sono
ALERT BEVERAGE
ALERT TEMPO DI ATTESA
*/

import React, { useEffect, useState } from 'react';

function AlertSection() {
    const [alerts, setAlerts] = useState(null);

    //Funzione per ottenere la lista degli alert mediante il server del DB
    async function fetchAlerts() {
        try {
            const response = await fetch('http://localhost:3000/alerts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching alerts:', error);
        }
    }


    useEffect(() => {
        async function getAlerts() {
            const data = await fetchAlerts();
            setAlerts(data);
        }

        getAlerts();
    }, []);

    
    if (!alerts) {
        return( 
            
            <div>
                <h2>Alerts</h2>
                <p>Non ci sono alerts da visualizzare</p>
            </div>

        );
    }
    return (
        <div>
            <h2>Alerts</h2>
            <div>
                <h3>Beverage Alerts</h3>
                <ul>
                    {alerts.beverage.map((item, index) => (
                        <li key={index}>{item.Nome}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Ordini in ritardo</h3>
                <ul>
                    {alerts.ordini.map((ordine, index) => (
                        <li key={index}>Order {ordine.Cod_ordine}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AlertSection;