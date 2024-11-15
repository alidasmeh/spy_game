import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';

// import axiosInstance from '../api/backendInstance'
import {socket} from '../api/socket'


function TrackingModal({isModalOpen, setIsModalOpen, targetPlayer, gameId, playerId, data}) {
    const [word1, setWord1] = useState('');
    const [word2, setWord2] = useState('');
    const [requirer, setRequirer] = useState('');
    const [answerer, setAnswerer] = useState('');
    const [selected, setSelected] = useState(false);

    const handleClose = () => setIsModalOpen(false);

    useEffect(()=>{
        console.log(data)
        if( data.hasOwnProperty('selected') ){
            if( data.selected == false ){
                setWord1(data?.word1)
                setWord2(data?.word2)
                setRequirer(data?.player_username)
                setAnswerer(data?.target_username)
                setSelected(false)
            }else{
                setWord1(data?.word)
                setAnswerer(data?.target_username)
                setSelected(true)
                
            }
        }

    }, [data])
    

    return (
        <Modal show={isModalOpen} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title className='text-center'>Tracking Modal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    selected==false && (<>
                        <p><b>{requirer}</b> asked <b>{answerer}</b> these two words: </p>
                        <ol>
                            <li>{word1}</li>
                            <li>{word2}</li>
                        </ol>
                        <p>Waiting for {answerer} to respond... </p>
                    </>)
                }
                {
                    selected==true && (<>
                        <p><b>{answerer}</b> selected <b>{word1}</b> </p>
                        <p>Waiting for next player ...</p>
                    </>)
                }
                
            </Modal.Body>
        </Modal>
    );
}

export default TrackingModal;

const styles={
}