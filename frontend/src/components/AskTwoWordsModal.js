import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';

// import axiosInstance from '../api/backendInstance'
import {socket} from '../api/socket'


function AskTwoWordsModal({isModalOpen, setIsModalOpen, targetPlayer, gameId, playerId}) {
    const [word1, setWord1] = useState('');
    const [word2, setWord2] = useState('');

    const handleClose = () => setIsModalOpen(false);
    
    const handleSubmit = async () => {
        // Handle form submission with word1 and word2 values
        let data = {
            game_id: gameId,
            player_id: playerId,
            target_player: targetPlayer,
            word1: word1,
            word2: word2
        }
        console.log(`run a trial with `, data)
        await socket.emit("run a trial", data)
        // handleClose();
    };

    return (
        <Modal show={isModalOpen} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Write Two word or words !</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="word1">
                <Form.Label>First word</Form.Label>
                <Form.Control
                    type="text"
                    placeholder=""
                    value={word1}
                    onChange={(e) => setWord1(e.target.value)}
                />
                </Form.Group>

                <Form.Group className="mb-3" controlId="word2">
                <Form.Label>Second word</Form.Label>
                <Form.Control
                    type="text"
                    placeholder=""
                    value={word2}
                    onChange={(e) => setWord2(e.target.value)}
                />
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
                Submit
            </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AskTwoWordsModal;

const styles={
}