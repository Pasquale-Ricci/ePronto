import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import styles from '../../modules/Notification.module.css';

function Notification() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    async function getNotifications() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId: localStorage.getItem('cod_utente') })
            });
            if (!response.ok) {
                console.error("Errore nella richiesta:", response.status, response.statusText);
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
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/markAsRead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id: notificationId })
            });
            if (!response.ok) {
                console.error("Errore nella richiesta markAsRead:", response.status, response.statusText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedNotifications = notifications.map(notification =>
                notification.Notifica_id === notificationId ? { ...notification, Letto: true } : notification
            );
            setNotifications([...updatedNotifications]);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }

    useEffect(() => {
        getNotifications();
    }, [notifications]);

    useEffect(() => {
    }, [notifications]);

    const unreadCount = notifications.filter(notification => !notification.Letto).length;

    const hasNotifications = notifications.length > 0;

    const sortedNotifications = [...notifications].sort((a, b) => {
        if (a.Letto === b.Letto) return 0;
        return a.Letto ? 1 : -1;
    });

    return (
        <div className={styles.container}>
            <button
                onClick={() => setOpen(!open)}
                className={styles.notificationBtn}
                disabled={!hasNotifications}
            >
                <FontAwesomeIcon icon={faBell} />
                {unreadCount > 0 && (
                    <span className={styles.notificationCounter}>
                        {unreadCount}
                    </span>
                )}
            </button>
            {hasNotifications && (
                <div className={`${styles.notificationList} ${open ? styles.show : ''}`}>
                    {sortedNotifications.map(notification => {
                        return (
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
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Notification;