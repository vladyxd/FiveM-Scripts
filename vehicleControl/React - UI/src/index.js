import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
const script = document.createElement('script');
script.src = "https://cfx-nui-vehiclecontrol/production.js";
script.async = true;
root.render(
  <React.StrictMode>
    <script src="nui://game/ui/jquery.js" type="text/javascript"></script>
    
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
