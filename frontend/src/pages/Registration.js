import React, {useEffect, useState} from 'react';
import { Container, Button, Form } from 'react-bootstrap';

import axiosInstance from '../api/backendInstance'

import {socket} from '../api/socket'

function RegistrationPage() {
    const [username, setUsername] = useState('');
    const [prompt, setPrompt] = useState('');
    const [coverImage, setCoverImage] = useState('');

    useEffect(()=>{
        socket.connect();

        socket.on('connect', ()=>{
            console.log("socket connect is called")
        })
        socket.on("connect successfully", (data)=>{
            console.log(`here in connect successfully event`, data)
        })

    }, [])
    
    
    const handleSubmit = async () => {
        console.log("Username:", username);
        console.log("Prompt:", prompt);
        console.log('coverImage', coverImage)

        const data = {
            username, 
            conver_image: coverImage
        }
    };

    const handlePromptToGenerate = ()=>{
        alert("generate image")
        setCoverImage("is set")
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
                    />
                </Form.Group>

                <Form.Group controlId="formPrompt" className='mt-4'>
                    <Form.Label>Prompt to Generate Cover Image</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter the prompt to generate cover image"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                </Form.Group>
                
                <Button variant="primary" className='mt-2' onClick={handlePromptToGenerate}>Generate</Button>
                <hr/>
                <div className='text-center'>
                    <Button variant="success" onClick={handleSubmit}>Register</Button>
                </div>
            </div>
        </Container>
    );
}

export default RegistrationPage;