import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

// import axiosInstance from '../api/backendInstance'
import {socket} from '../api/socket'

function PlayerCardComponent({playerInfo, thisPlayerId, setTargetPlayer, setIsModalOpen, playerTurn}) {

  const [backgroundForThisCard, setBackgroundForThisCard] = useState({})
  const [showCanBeChosenButton, setCanBeChosenButton] = useState(false)

  
  useEffect(()=>{
    const thisCardIsForTheCurrentPlayer = playerInfo.player_id == thisPlayerId
    const nowIsCurrentPlayerTurn = thisPlayerId == playerTurn
    const nowThisCardIsTurn = playerInfo.player_id == playerTurn

    // console.info(`username : ${playerInfo.username} for player turn ${playerTurn}`, {
    //   thisCardIsForTheCurrentPlayer,
    //   nowIsCurrentPlayerTurn,
    //   nowThisCardIsTurn
    // })

    if(thisCardIsForTheCurrentPlayer && !nowIsCurrentPlayerTurn && !nowThisCardIsTurn) setBackgroundForThisCard({background: "#eee"})
    if(!thisCardIsForTheCurrentPlayer && !nowIsCurrentPlayerTurn && !nowThisCardIsTurn) setBackgroundForThisCard({background: "white"})
    if(thisCardIsForTheCurrentPlayer && nowIsCurrentPlayerTurn && nowThisCardIsTurn) setBackgroundForThisCard({background: "#d9eeff"})

    if(!nowThisCardIsTurn && nowIsCurrentPlayerTurn) setCanBeChosenButton(true)
    if(!nowThisCardIsTurn && !nowIsCurrentPlayerTurn) setCanBeChosenButton(false)
    if(nowThisCardIsTurn) setCanBeChosenButton(false)

  }, [playerTurn])
  
  const askThisUser = (player_id)=>{
    setIsModalOpen(true)
    setTargetPlayer(player_id)
  }
  

  return (
    <div className='mt-5 col-lg-3' >
      <div className='card p-3' style={{...backgroundForThisCard}}>
        <div>
          <div style={styles.imgCicle} ><img src={playerInfo.image_url} style={styles.img}/></div>
        </div>
        <p className='text-center'>{playerInfo.username} <br/> (player_id : {playerInfo.player_id})</p> 

        {
          showCanBeChosenButton && 
          (
            <Button variant='primary' onClick={()=>{askThisUser(playerInfo.player_id)}}>Ask This Player</Button>
          )
        }
      </div>

      
    </div>
  );
}

export default PlayerCardComponent;

const styles={
  imgCicle: {
    width: "100px",
    height: "100px",
    overflow: "hidden",
    position: "relative",
    borderRadius: "50%",
    margin: "auto"
  },
  img: {
    width: "100%",
    position: "relative",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
}