import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

import axiosInstance from '../api/backendInstance'

function GameoverPage() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    window.location.href="http://prolific.com"
  }

  return (
    <Container className='mt-5'>
      <h1 className='text-center'>Thank you.</h1> 
      <p>Thanks for your participation.</p>

      <div className='text-center'>
        <Button variant="success" onClick={handleRedirect}>Back to Prolific</Button>
      </div>
    </Container>
  );
}

export default GameoverPage;