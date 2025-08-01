import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import './assets/css/bootstrap.min.css';
import './assets/css/style.css';

// import './assets/js/bootstrap.bundle.min.js';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
