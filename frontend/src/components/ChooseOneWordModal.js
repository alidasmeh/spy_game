import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';

// import axiosInstance from '../api/backendInstance'
import {socket} from '../api/socket'


function ChooseOneWordModal({isModalOpen, setIsModalOpen, setIsTrackingModalOpen, targetPlayer, gameId, playerId, data}) {
    const [word1, setWord1] = useState('');
    const [word2, setWord2] = useState('');
    const [requirer, setRequirer] = useState('');

    const handleClose = () => {
        setIsModalOpen(false);
        setIsTrackingModalOpen(true)
    }

    const handleSubmitWord = async (word) => {
        // Handle form submission with word1 and word2 values
        let output = {
            word: word,
            trial_id: data.trial_id,
            game_id: gameId,
            player_username: data.player_username,
            target_username: data.target_username
        }
        socket.emit("one word is chosen", output)

        handleClose();
    };

    useEffect(()=>{
        setWord1(data?.word1)
        setWord2(data?.word2)
        setRequirer(data?.player_username)

    }, [data])

    return (
        <Modal show={isModalOpen}>
            <Modal.Header>
                <Modal.Title>{requirer} asked you, choose one word</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            
                <Button variant="primary" className='d-block w-100 mb-3' onClick={()=>{handleSubmitWord(word1)}}>{word1}</Button>
                <Button variant="primary" className='d-block w-100 mb-3' onClick={()=>{handleSubmitWord(word2)}}>{word2}</Button>

            </Modal.Body>
        </Modal>
    );
}

export default ChooseOneWordModal;

const styles={
}