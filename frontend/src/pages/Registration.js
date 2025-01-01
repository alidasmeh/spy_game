import React, {useEffect, useState} from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import axiosInstance from '../api/backendInstance'

import {socket} from '../api/socket'

function RegistrationPage({setGameId, setPlayerId}) {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [prompt, setPrompt] = useState('');
    const [coverImage, setCoverImage] = useState('/img/unknown.png');
    const [registerButtonDisabled, setRegisterButtonDisabled] = useState(false);
    const [formDisabled, setFormDisabled] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(()=>{
        socket.connect();

        socket.on('connect', ()=>{
            console.log("socket connect is called")
        })

        socket.on('register response', async (data)=>{
            console.log("register done is called.", data)
            if(data.status == false){
                setRegisterButtonDisabled(false)
                setFormDisabled(false)
                return alert("error "+ data.message)
            }
            
            console.log("player_id : "+data.player_id)
            setPlayerId(data.player_id)
            console.log("game_id : "+data.game_id)
            setGameId(data.game_id)
            setMessage("Waiting for other players...")

            await isGameFull(data.game_id)
        })

        socket.on('game is full', ()=>{
            navigate("/game")
        })
        
    }, [])
    
    
    const handleSubmit = async () => {
        const data = {
            username, 
            cover_image: coverImage
        }
        
        setRegisterButtonDisabled(true)
        setFormDisabled(true)
        await socket.emit("register", data)
    };

    const handlePromptToGenerate = ()=>{
        setCoverImage("/img/unknown.png")
        setRegisterButtonDisabled(false)
    }

    const isGameFull = async (gameId)=>{
        await socket.emit("is game full", {game_id: gameId})
    }

    return (
        <Container className='mt-5 '>
            <h1 className='text-center'>Toturial</h1> 
            <p>There are 5 players in this game. One of them is randomly chosen as the spy and the others do not know it. A word is introduced as the target word, which the spy is unaware of but the others will know about. <br/> the goal is finding the Spy by asking 2 words from each other and selecting one.</p>

            <p>1- When it's your turn, you'll see a playground like this, the blue one is you, you can select one person. Anyone but yourself. <br/> Then you can ask the other person to choose one by writing two words related to the target word.</p>
            <div className='text-center mb-3'>
                <img src="/img/tutorial/1.png" style={{width: 500, border: "1px solid #f94c00"}}/>
            </div>

            <p>2- Once you select one of the players, a new window will open asking you to enter two words.<br/> Make sure that the words you enter do not allow the spy to guess the word while conveying the message to others that you know the word.</p>
            <div className='text-center  mb-3'>
                <img src="/img/tutorial/2.png" style={{width: 500, border: "1px solid #f94c00"}}/>
            </div>

            <p>3- If someone chooses to ask you for two words, you will see a box similar to the window below with two words written in it and you must choose one based on the target word.<br/> </p>
            <div className='text-center  mb-3'>
                <img src="/img/tutorial/3.png" style={{width: 500, border: "1px solid #f94c00"}}/>
            </div>

            <p>4- A window will open between each action you or others take, similar to the one below, reporting what is happening.</p>
            <div className='text-center  mb-3'>
                <img src="/img/tutorial/4.png" style={{width: 500, border: "1px solid #f94c00"}}/>
            </div>

            <p>5- After all 5 players have asked for their words, a vote is taken to see if you know the spy. If three people click on the "I know who is the Spu, I want to select." option, you move down to the next step (see step 6).<br/> Otherwise, another round is played with the same word. </p>
            <div className='text-center  mb-3'>
                <img src="/img/tutorial/5.png" style={{width: 500, border: "1px solid #f94c00"}}/>
            </div>

            <p>6- If you are not a spy, you will see a window similar to this one, which lists all the players and you must choose one person as a spy.</p>
            <div className='text-center  mb-3'>
                <img src="/img/tutorial/6.png" style={{width: 500, border: "1px solid #f94c00"}}/>
            </div>

            <p>7- If you were the spy, a window similar to the one below will open where you must enter the word you guessed.</p>
            <div className='text-center  mb-3'>
                <img src="/img/tutorial/7.png" style={{width: 500, border: "1px solid #f94c00"}}/>
            </div>

            <h3>Who and How Win:</h3>
            <ul>
                <li>If no one select the Spy, Spy win 1 point.</li>
                <li>If even one player select the Spy, and Spy does not know the word, that player win 1 point.</li>
                <li>If players select the Spy, and Spy knows the word, Spy win 1 point.</li>
            </ul>

            <hr/>
            <div className='d-flex justify-content-center align-items-center'>
                <div style={{ width: '400px' }}>
                    <h1 className='text-center'>Register here ...</h1> 
                    <Form.Group controlId="formUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={formDisabled}
                        />
                    </Form.Group>

                    {/* <Form.Group controlId="formPrompt" className='mt-4'>
                        <Form.Label>Prompt to Generate Cover Image</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter the prompt to generate cover image"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={formDisabled}
                        />
                    </Form.Group>
                    
                    <Button variant="primary" className='mt-2' onClick={handlePromptToGenerate} disabled={formDisabled}>Generate</Button> */}
                    <hr/>
                    <div className='text-center'>
                        <Button variant="success" onClick={handleSubmit} disabled={registerButtonDisabled}>Register</Button>
                    </div>
                    <div className='text-center'>
                        {message}
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default RegistrationPage;