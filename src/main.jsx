import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ManagerPage from './ManagerPage'
import OrderPage from './OrderPage'
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <OrderPage/>
  </React.StrictMode>
);