import React from 'react';
import ReactDOM from 'react-dom/client';
import IntroPage from './pages/Intro';

import 'bootstrap/dist/css/bootstrap.min.css';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <IntroPage />
  </React.StrictMode>
);