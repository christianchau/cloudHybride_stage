import React from 'react';
import ReactDOM from 'react-dom/client';
import App_fournisseur from './AWS_components/App_fournisseur';
import Login_fournisseur from './AWS_components/Login_fournisseur';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App_fournisseur />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
