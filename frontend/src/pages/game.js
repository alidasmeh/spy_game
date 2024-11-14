import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// import axiosInstance from '../api/backendInstance'
import {socket} from '../api/socket'

import PlayerCardComponent from '../components/PlayerCardComponent'
import AskTwoWordsModal from '../components/AskTwoWordsModal';
import ChooseOneWordModal from '../components/ChooseOneWordModal';
import TrackingModal from '../components/TrackingModal';

function MainGamePage({gameId, playerId}) {
  const navigate = useNavigate();

  const [players, setPlayers] = useState([])
  const [playerTurn, setPlayerTurn] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)
  const [isChooseWordModalOpen, setIsChooseWordModalOpen] = useState(false)
  const [targetPlayer, setTargetPlayer] = useState(0)
  const [trialData, setTrialData] = useState()

  useEffect(()=>{
    callForPlayers()
    callForFindingPlayerTurn()
    socket.on('list of players', async (data)=>{
        // data is players list
        setPlayers(data)
    })

    socket.on('turn is for playerid', async (data)=>{
      setPlayerTurn(data['player_id'])
    })

    socket.on("trial is run", async(data)=>{
      console.log(`trial is run is called : `, data)
      setTrialData({...data, selected: false})
      setIsModalOpen(false)
      if(playerId==data['target_player']){
        setIsChooseWordModalOpen(true)
      }else{
        setIsTrackingModalOpen(true)
      }
    })

    socket.on("announce chosen word", async(data)=>{
      console.log(`announce chosen word is called : `, data)
      setTrialData({...data, selected: true})
      
      if(playerId==data['target_player']){
        setIsTrackingModalOpen(true)
        setIsChooseWordModalOpen(false)
      }

      setTimeout(()=>{
        callForFindingPlayerTurn()
        setIsChooseWordModalOpen(false)
        setIsTrackingModalOpen(false)
        setIsModalOpen(false)
      }, 3000)
    })
  }, [gameId])

  const callForPlayers = async()=>{
    console.log('here inside callForPlayers')
    await socket.emit("get players for group", {game_id: gameId})
  }

  const callForFindingPlayerTurn = async ()=>{
    await socket.emit("who is turn", {game_id: gameId})
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
            playerTurn={playerTurn}
          />))
        }
      </Row>

      
      <AskTwoWordsModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} targetPlayer={targetPlayer} gameId={gameId} playerId={playerId}/>
      <ChooseOneWordModal isModalOpen={isChooseWordModalOpen} setIsTrackingModalOpen={setIsTrackingModalOpen} data={trialData} setIsModalOpen={setIsChooseWordModalOpen} targetPlayer={targetPlayer} gameId={gameId} playerId={playerId}/>
      <TrackingModal isModalOpen={isTrackingModalOpen} data={trialData} setIsModalOpen={setIsChooseWordModalOpen} targetPlayer={targetPlayer} gameId={gameId} playerId={playerId}/>
      
    </Container>
  );
}

export default MainGamePage;