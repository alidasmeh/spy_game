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

    if(nowThisCardIsTurn) {
      setBackgroundForThisCard({background: "#0066CC"})
    }else{
      setBackgroundForThisCard({background: "#9b9b9b"})
      if(thisCardIsForTheCurrentPlayer && !nowIsCurrentPlayerTurn && !nowThisCardIsTurn) setBackgroundForThisCard({background: "#565656"})
      if(!thisCardIsForTheCurrentPlayer && !nowIsCurrentPlayerTurn && !nowThisCardIsTurn) setBackgroundForThisCard({background: "#9b9b9b"})

    }

    if(!nowThisCardIsTurn && nowIsCurrentPlayerTurn) setCanBeChosenButton(true)
    if(!nowThisCardIsTurn && !nowIsCurrentPlayerTurn) setCanBeChosenButton(false)
    if(nowThisCardIsTurn) setCanBeChosenButton(false)

  }, [playerTurn])
  
  const askThisUser = (player_id)=>{
    setIsModalOpen(true)
    setTargetPlayer(player_id)
  }
  

  return (
    <div className='mt-5 col' >
      <div className='card p-3' style={{...backgroundForThisCard}}>
        <div>
          <div style={styles.imgCicle} ><img src={playerInfo.image_url} style={styles.img}/></div>
        </div>
        <p className='text-center'>{playerInfo.username} <br/> (player_id : {playerInfo.player_id})</p> 
        <p className='text-center'>Score : {playerInfo.score}</p> 
        

        {
          showCanBeChosenButton && 
          (
            <Button style={{background: "#E60000", borderColor: "#E60000"}} onClick={()=>{askThisUser(playerInfo.player_id)}}>Ask This Player</Button>
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