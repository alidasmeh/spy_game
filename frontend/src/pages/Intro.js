import React from 'react';
import { Container, Button } from 'react-bootstrap';

import axiosInstance from '../api/backendInstance'

function IntroPage() {
  const handleConsent = () => {
    alert("Go to the next page");
    callBackend()
  }

  const handleReject = () => {
    alert("Sorry !")
  }

  const callBackend = async () =>{
    const response = await axiosInstance.get('/hi');
    console.log(`callBackend `, response.data)
  }



  return (
    <Container className='mt-5'>
      <h1 className='text-center'>Spy Game</h1> 
      <h2>Intro</h2>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

      <div className='text-center'>
        <Button variant="success" onClick={handleConsent}>I consent to all the conditions.</Button>{' '}
        <Button variant="danger" onClick={handleReject}>No, I cannot agree.</Button>
      </div>
    </Container>
  );
}

export default IntroPage;