import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import IntroPage from './pages/Intro';
import RegistrationPage from './pages/Registration';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Navigation links */}
    {/* <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav> */}

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