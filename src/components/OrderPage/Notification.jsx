import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import styles from '../../modules/Notification.module.css';

function Notification() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    async function getNotifications() {
        try {
            const response = await fetch('http://localhost:3000/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: localStorage.getItem('cod_utente') })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }

    async function markAsRead(notificationId) {
        try {
            const response = await fetch('http://localhost:3000/markAsRead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: notificationId })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setNotifications(notifications.map(notification =>
                notification.Notifica_id === notificationId ? { ...notification, Letto: true } : notification
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }

    useEffect(() => {
        getNotifications();
    }, []);

    const unreadCount = notifications.filter(notification => !notification.Letto).length;

    return (
        <div className={styles.container}>
            <button
                onClick={() => setOpen(!open)}
                className={styles.notificationBtn}
            >
                <FontAwesomeIcon icon={faBell} />
                {unreadCount > 0 && (
                    <span className={styles.notificationCounter}>
                        {unreadCount}
                    </span>
                )}
            </button>
            <div className={`${styles.notificationList} ${open ? styles.show : ''}`}>
                {notifications.map(notification => (
                    <div
                        key={notification.Notifica_id}
                        className={`${styles.notificationItem} ${notification.Letto ? styles.read : ''}`}
                    >
                        <p>{notification.Messaggio}</p>
                        {!notification.Letto && (
                            <button
                                className={styles.markAsReadBtn}
                                onClick={() => markAsRead(notification.Notifica_id)}
                            >
                                Segna come letto
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Notification;