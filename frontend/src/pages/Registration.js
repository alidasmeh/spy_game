import React, {useEffect, useState} from 'react';
import { Container, Button, Form } from 'react-bootstrap';

import axiosInstance from '../api/backendInstance'

import {socket} from '../api/socket'

function RegistrationPage() {
    const [username, setUsername] = useState('');
    const [prompt, setPrompt] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [registerButtonDisabled, setRegisterButtonDisabled] = useState(true);
    const [formDisabled, setFormDisabled] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(()=>{
        socket.connect();

        socket.on('connect', ()=>{
            console.log("socket connect is called")
        })

        socket.on('register response', (data)=>{
            console.log("register done is called.", data)
            if(data.status == false){
                setRegisterButtonDisabled(false)
                setFormDisabled(false)
                return alert("error "+ data.message)
            }
            
            console.log("player_id : "+data.player_id)
            setMessage("Waiting for other players...")
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
        // alert("generate image")
        setCoverImage("is set")
        setRegisterButtonDisabled(false)
    }

    return (
        <Container className='mt-5 d-flex justify-content-center align-items-center'>
            <div style={{ width: '400px' }}>
                <h1 className='text-center'>Registration</h1> 
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

                <Form.Group controlId="formPrompt" className='mt-4'>
                    <Form.Label>Prompt to Generate Cover Image</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter the prompt to generate cover image"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={formDisabled}
                    />
                </Form.Group>
                
                <Button variant="primary" className='mt-2' onClick={handlePromptToGenerate} disabled={formDisabled}>Generate</Button>
                <hr/>
                <div className='text-center'>
                    <Button variant="success" onClick={handleSubmit} disabled={registerButtonDisabled}>Register</Button>
                </div>
                <div className='text-center'>
                    {message}
                </div>
            </div>
        </Container>
    );
}

export default RegistrationPage;