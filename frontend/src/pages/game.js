import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// import axiosInstance from '../api/backendInstance'
import {socket} from '../api/socket'

import PlayerCardComponent from '../components/PlayerCardComponent'
import AskTwoWordsModal from '../components/AskTwoWordsModal';
import ChooseOneWordModal from '../components/ChooseOneWordModal';
import TrackingModal from '../components/TrackingModal';
import VotingModal from '../components/VotingModal';
import EnterTargetWord from '../components/EnterTargetWord';
import RoundReportModal from '../components/RoundReportModal';

function MainGamePage({gameId, playerId}) {
  const NumberOfPlayers = 5

  const navigate = useNavigate();

  const [players, setPlayers] = useState([])
  const [playerTurn, setPlayerTurn] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false)
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)
  const [isChooseWordModalOpen, setIsChooseWordModalOpen] = useState(false)
  const [isEnterTargetWordModalOpen, setIsEnterTargetWordModalOpen] = useState(false)
  const [isRoundReportModalOpen, setIsRoundReportModalOpen] = useState(false)
  const [targetPlayer, setTargetPlayer] = useState(0)
  const [trialData, setTrialData] = useState({})
  const [wordOrSpy, setWordOrSpy] = useState('loading...')
  const [chooseSpy, setChooseSpy] = useState(false)
  const [decisionText, setDecisionText] = useState('')
  const [roundReport, setRoundReport] = useState('')

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
      // console.log(`announce chosen word is called : `, data)
      setTrialData({...data, selected: true})
      
      if(playerId==data['target_player']){
        setIsTrackingModalOpen(true)
        setIsChooseWordModalOpen(false)
      }

      setTimeout(async ()=>{
        hideAllModals()
        if(Number(data['number_of_trials_for_this_round'])%NumberOfPlayers == 0){
          setIsVotingModalOpen(true)
        }else{
          callForFindingPlayerTurn()
        }

      }, 3000)
    })

    socket.on("word or spy", async(data)=>{
      if(data.word.length == 0){
        setWordOrSpy("you are Spy.")
      }else{
        setWordOrSpy(`Target word is : ${data.word}`)
      }
    })

    socket.on("decision is made for voting", async(data)=>{
      console.log(`decision is made for voting is called : `, data)
      if(data['decision']==false){
        setChooseSpy(false)
        setDecisionText("Decision is to follow the game to find Spy.")
        callForFindingPlayerTurn()
        setTimeout(()=>{
          console.log(`decision is made for voting call > hideAllModals`)
          hideAllModals()
          votingModalReset()
        }, 3000)
      }else{

        console.info(wordOrSpy)
        
        if(wordOrSpy == "you are Spy."){
          hideAllModals()
          setIsEnterTargetWordModalOpen(true)
        }else{
          setChooseSpy(true)
          setDecisionText("")  
        }
      }
    })

    socket.on("round report is ready", async(data)=>{
      console.log(`round report is ready : `, data)
      let reportHTML = ''
      
      for(let player of players){
        for(let outcome of data){
          if (player.player_id == outcome.player_id){
            if(outcome.role == 'spy' && outcome.win == true){
              reportHTML += `<li><b>${player.username}</b> was the spy and could guess the target word currectly. Won 1 point.</li>`
            }else if(outcome.role == 'spy' && outcome.win == false){
              reportHTML += `<li><b>${player.username}</b> was the spy and could not guess the target word currectly.</li>`
            }else if(outcome.role == 'not-spy' && outcome.win == true){
              reportHTML += `<li><b>${player.username}</b> won 1 point, because could select the spy correctly and spy did not know the target word. </li>`
            }
          }
        }
      }

      hideAllModals()
      setRoundReport(reportHTML)
      setIsRoundReportModalOpen(true)
    })
  }, [gameId, wordOrSpy])

  const callForPlayers = async()=>{
    console.log('here inside callForPlayers')
    await socket.emit("get players for group", {game_id: gameId})
  }

  const callForFindingPlayerTurn = async ()=>{
    await socket.emit("who is turn", {game_id: gameId})
    getWordOrSpy() // it should be called for every round.
  }

  const getWordOrSpy = async ()=>{
    console.log('here inside getWordOrSpy')
    await socket.emit("get word spy status", {game_id: gameId})
  }

  const hideAllModals = ()=>{
    console.log(`inside hideAllModals`)
    setIsChooseWordModalOpen(false)
    setIsTrackingModalOpen(false)
    setIsModalOpen(false)
    setIsVotingModalOpen(false)
    setIsRoundReportModalOpen(false)
    setIsEnterTargetWordModalOpen(false)
  }

  const votingModalReset = ()=>{
    setDecisionText("")
    setChooseSpy(false)
  }
  
  return (
    <Container fluid className='mt-5'>
      <h1 className='text-center'>{wordOrSpy}</h1> 
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
      <VotingModal decisionText={decisionText} chooseSpy={chooseSpy} isModalOpen={isVotingModalOpen} setIsModalOpen={setIsVotingModalOpen} players={players} gameId={gameId} playerId={playerId}/>
      <EnterTargetWord isModalOpen={isEnterTargetWordModalOpen} setIsModalOpen={setIsEnterTargetWordModalOpen} gameId={gameId} playerId={playerId}/>
      <RoundReportModal isModalOpen={isRoundReportModalOpen} roundReport={roundReport} setIsModalOpen={setIsRoundReportModalOpen} />
        
    </Container>
  );
}

export default MainGamePage;