import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartLine } from '@fortawesome/free-solid-svg-icons';
import styles from '../../modules/ManagerPage.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

function GraphReport() {
    const [beverageData, setBeverageData] = useState([]);
    const [orderData, setOrderData] = useState([]);
    const [isBarChart, setIsBarChart] = useState(true);

    useEffect(() => {
        const fetchBeverageData = async () => {
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

        const fetchOrderData = async () => {
            try {
                const response = await fetch('http://localhost:3000/orderReport', {
                    method: 'POST'
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setOrderData(data);
            } catch (error) {
                console.error('Error fetching order report:', error);
            }
        };

        fetchBeverageData();
        fetchOrderData();
    }, []);

    //Grafico a barre
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

    //Grafico a linee
    const lineData = {
        labels: orderData.map(item => {
            const currentDate = new Date().toISOString().split('T')[0];
            const dateTimeString = `${currentDate}T${item.Ora}`;
            const date = new Date(dateTimeString);
            return date instanceof Date && !isNaN(date) ? date.toLocaleTimeString() : 'Invalid Date';
        }),
        datasets: [
            {
                label: 'Numero di Ordini',
                data: orderData.map((item, index, array) => array.slice(0, index + 1).length), // Conta il numero di ordini fino a quel punto
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
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
            <h2>Reports</h2>
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