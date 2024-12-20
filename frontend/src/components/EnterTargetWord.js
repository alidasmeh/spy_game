import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';

// import axiosInstance from '../api/backendInstance'
import {socket} from '../api/socket'


function EnterTargetWord({isModalOpen, setIsModalOpen, gameId, playerId}) {
    const [word, setWord] = useState('');
    const [error, setError] = useState('');
    const [isSubmit, setIsSubmit] = useState(false);
    
    const handleSubmit = async () => {
        // Handle form submission with word and word2 values
        if (word.trim().length == 0){
            setError('Word input can not be null.')
            return
        }

        setError('')

        let data = {
            game_id: gameId,
            player_id: playerId,
            word: word.trim()
        }
        console.log(`EnterTargetWord is called `, data)
        await socket.emit("enter target word by spy", data)

        setIsSubmit(true)
        // handleClose();
    };

    return (
        <Modal show={isModalOpen} >
            <Modal.Header >
            <Modal.Title>Enter your guess for target word</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {
                !isSubmit && (
                    <Form>
                        <Form.Group className="mb-3" controlId="word">
                        <Form.Label>The decision is made to choose the Spy, meanwhile you should enter you guess for target word</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            value={word}
                            onChange={(e) => setWord(e.target.value)}
                        />
                        </Form.Group>

                        <div className='text-center' style={{color: "tomato"}}>
                            {error}
                        </div>
                    </Form>
                )
            }
            {
                isSubmit && (
                    <p>Your guess is submitted waiting for report ... </p>
                )   
            }

            
            </Modal.Body>
            {
                !isSubmit && (
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Modal.Footer>
                )
            }
            
        </Modal>
    );
}

export default EnterTargetWord;

const styles={
}