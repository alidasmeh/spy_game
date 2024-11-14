import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// import axiosInstance from '../api/backendInstance'
import {socket} from '../api/socket'

import PlayerCardComponent from '../components/PlayerCardComponent'
import AskTwoWordsModal from '../components/AskTwoWordsModal';

function MainGamePage({gameId, playerId}) {
  const navigate = useNavigate();

  const [players, setPlayers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [targetPlayer, setTargetPlayer] = useState(0)

  useEffect(()=>{
    callForPlayers()
    socket.on('list of players', async (data)=>{
        // data is players list
        setPlayers(data)
    })
  }, [gameId])

  const callForPlayers = async()=>{
    console.log('here inside callForPlayers')
    await socket.emit("get players for group", {game_id: gameId})
  }

  return (
    <Container className='mt-5'>
      <h1 className='text-center'>Main Game</h1> 
      <Row>
        {
          players.map((player)=> (
          <PlayerCardComponent 
            key={player.username} 
            playerInfo={player} 
            thisPlayerId={playerId} 
            setTargetPlayer={setTargetPlayer} 
            setIsModalOpen={setIsModalOpen}
          />))
        }
      </Row>

      
      <AskTwoWordsModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} targetPlayer={targetPlayer} gameId={gameId} playerId={playerId}/>
    </Container>
  );
}

export default MainGamePage;