import React, { useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// import axiosInstance from '../api/backendInstance'

function MainGamePage({gameId, playerId}) {
  const navigate = useNavigate();

  useEffect(()=>{
    console.log(gameId)
    console.log(playerId)
  }, [])

  return (
    <Container className='mt-5'>
      <h1 className='text-center'>Main Game</h1> 
    </Container>
  );
}

export default MainGamePage;