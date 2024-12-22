import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';

// import axiosInstance from '../api/backendInstance'
import {socket} from '../api/socket'


function VotingModal({isModalOpen, setIsModalOpen, players, playerId, gameId, chooseSpy, decisionText, watingVotingModal, setWaitingVotingModal}) {

    const handleSelect = async (value)=>{
        setWaitingVotingModal(true)

        await socket.emit("vote to choose spy", {"game_id": gameId, "player_id": playerId, "vote": value})
        // await socket.emit("spy is chosen", {"game_id": gameId, "player_id": playerId,"target_player_id": value})
        // setIsModalOpen(false)
    }

    const handleSelectSpy = async (value)=>{
        setWaitingVotingModal(true)
        await socket.emit("point the spy", {"game_id": gameId, "player_id": playerId, "vote": value})
        // alert(value)
    }

    useEffect(()=>{
        if(decisionText.length>0) setWaitingVotingModal(false)
        if(chooseSpy==true) setWaitingVotingModal(false)
        
    }, [chooseSpy, decisionText])

    return (
        <Modal show={isModalOpen}>
            <Modal.Header>
                <Modal.Title className='text-center'>Do you know who Spy is?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                { (!watingVotingModal && !chooseSpy && decisionText.length==0 ) && (<>
                        <Button variant='primary' className='d-block w-100 mb-3' onClick={()=>{handleSelect(0)}}>I do not know who is Spy, yet.</Button>
                        <Button variant='primary' className='d-block w-100 mb-3' onClick={()=>{handleSelect(1)}}>I know who is Spy, I want to select.</Button>
                    </>)
                }

                { (!watingVotingModal && chooseSpy && decisionText.length==0) && (<>
                    <p>Other players said they know the spy too. Select one:</p>
                    {
                        players.map(player=>(
                            <Button variant='warning' className='d-block w-100 mb-3' key={player.player_id} onClick={()=>{handleSelectSpy(player.player_id)}}>{player.username} is Spy.</Button>
                        ))
                    }
                    </>)
                }
                { watingVotingModal && (<div className='text-center'>Wait for everyone else response.</div>)}
                { (!watingVotingModal && decisionText.length!=0) && (<div className='text-center'><b>{decisionText}</b></div>)}
                
            </Modal.Body>
        </Modal>
    );
}

export default VotingModal;

const styles={
}