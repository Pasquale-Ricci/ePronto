import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartLine } from '@fortawesome/free-solid-svg-icons';
import styles from '../../modules/ManagerPage.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

function GraphReport() {
    const [beverageData, setBeverageData] = useState([]);
    const [isBarChart, setIsBarChart] = useState(true); // Stato per il tipo di grafico selezionato

    useEffect(() => {
        // Simula una chiamata API per ottenere i dati del beverage
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/beverageReport', {
                    method: 'POST'
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setBeverageData(data);
            } catch (error) {
                console.error('Error fetching beverage report:', error);
            }
        };

        fetchData();
    }, []);

    // Configura i dati per il grafico a barre
    const barData = {
        labels: beverageData.map(item => item.Nome),
        datasets: [
            {
                label: 'Quantità',
                data: beverageData.map(item => item.Quantita),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Quantità Critica',
                data: beverageData.map(item => item.Quantita_critica),
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
            },
            {
                label: 'Quantità Massima',
                data: beverageData.map(item => item.Quantita_max),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Configura i dati per il grafico a linee
    const lineData = {
        labels: beverageData.map(item => item.Nome),
        datasets: [
            {
                label: 'Quantità',
                data: beverageData.map(item => item.Quantita),
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
            },
            {
                label: 'Quantità Critica',
                data: beverageData.map(item => item.Quantita_critica),
                fill: false,
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
            },
            {
                label: 'Quantità Massima',
                data: beverageData.map(item => item.Quantita_max),
                fill: false,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
            },
        ],
    };

    // Funzione per renderizzare il grafico in base al tipo selezionato
    const renderChart = () => {
        if (isBarChart) {
            return <Bar data={barData} />;
        } else {
            return <Line data={lineData} />;
        }
    };

    return (
        <div className={styles.sectionsContainer}>
            <h2>Report Beverage</h2>
            <div className={styles.chartContainer}>

                <div className={styles.iconContainer}>
                    <FontAwesomeIcon
                        icon={faChartBar}
                        className={isBarChart ? styles.activeIcon : styles.inactiveIcon}
                        onClick={() => setIsBarChart(true)}
                    />
                    <FontAwesomeIcon
                        icon={faChartLine}
                        className={!isBarChart ? styles.activeIcon : styles.inactiveIcon}
                        onClick={() => setIsBarChart(false)}
                    />
                </div>
                {renderChart()}
            </div>
        </div>
    );
}

export default GraphReport;