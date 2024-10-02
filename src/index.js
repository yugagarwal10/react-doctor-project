import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastContainer} from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    <ToastContainer />
    </BrowserRouter>
  </React.StrictMode>
);
