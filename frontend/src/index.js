import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import IntroPage from './pages/Intro';
import RegistrationPage from './pages/Registration';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<IntroPage />} />
          <Route path="register" element={<RegistrationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    
  </React.StrictMode>
);