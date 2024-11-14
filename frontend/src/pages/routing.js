import React, {useState} from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import IntroPage from './Intro';
import RegistrationPage from './Registration';
import MainGamePage from './Game';

function RoutingPage() {

    const [gameId, setGameId] = useState(0);
    const [playerId, setPlayerId] = useState(0);


    return (
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route index element={<IntroPage />} />
                    <Route path="register" element={<RegistrationPage setGameId={setGameId} setPlayerId={setPlayerId} />} />
                    <Route path="game" element={<MainGamePage gameId={gameId} playerId={playerId}/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default RoutingPage;