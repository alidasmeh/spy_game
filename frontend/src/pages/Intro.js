import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

import axiosInstance from '../api/backendInstance'

function IntroPage() {
  const navigate = useNavigate();

  const handleConsent = () => {
    navigate('/register');
    // callBackend()
  }

  const handleReject = () => {
    alert("Sorry !")
  }

  return (
    <Container className='pt-5 pb-5'>
      <h3 style={{color: "white"}} className='text-center'>welcome to</h3>
      <h1 className='text-center mb-3' style={{fontSize: 50}}>Spy Game</h1> 
      <img src='/img/logo.webp' style={{width: 500, margin: "auto", display: "block"}}/>

      <div style={{textAlign: "center", marginBottom: 25, marginTop: 25}}>
        <i class="fa-solid fa-chevron-down" style={{fontSize: "40px", color: "white"}}></i>
      </div>

      <h3>Study Information and Statement of Informed Consent for Adult Participants</h3>
      <p>Thank you for your interest in participating in Spy Game. Please take your time to read this text carefully. By consenting, you agree that you have read the information presented and that you are willing to participate in the study.</p>

      <h3>Aim of the study.</h3>
      <p>In Spy Game, we want to investigate how accurately you can guess other people's behavior based on a picture and how accurately others can guess yours.</p>

      <h3>Procedure and content of the study.</h3>
      <p>To do this, you will first upload or take a facial picture of yourself. It is important that your face is clearly visible in the picture. Your facial picture must comply with the Content Standards.</p>

      <h3>Are there any risks involved?</h3>
      <p>Participating is associated with no known risks.</p>

      <h3>What will happen to the information and data collected?</h3>
      <p>This study is a research project of the Max Planck Institute (MPI) for Human Development in cooperation with the University of Exeter, the University of British Columbia, the Toulouse School of Economics, and the Universidad Autonoma de Madrid. The data collected will be used exclusively at the MPI and for the aforementioned research purposes only.</p>
      <p>Your personal data (i.e. e-mail address, geolocation, facial picture, IP-address, digital fingerprints and, but only if you choose to participate in the optional post-study survey, broad information about your political orientation, religion, and income) and the corresponding study data will be assigned to an individual code number so that the study data cannot be linked to your personal data during the analysis. Your personal data will be processed in accordance with the applicable data protection laws (EU General Data Protection Regulation, Federal Data Protection Act), is stored separately from the study data in a secure location with strict access controls, and can only be accessed exclusively at the MPI and by a limited number of individuals working on the project who are obliged to treat your data confidentially. The raw study data, which may contain personal data such as your facial picture, your geolocation, and broad information about your political orientation, religion, and income, will be securely stored for at least ten years for reasons of good scientific practice established by the German Research Foundation (DFG) and the rules of the Max Planck Society. This enables other scientists to verify the accuracy of the results obtained. All personal data other than study raw data such as your e-mail address, your IP address, and digital fingerprints, as well as the individual code numbers matching the study data with your personal data, will be deleted two years after completion of the study, and it will no longer be possible to link the study data to you.</p>
      <p>The study data (but no personal data, i.e., contact data, facial picture, IP address, digital fingerprints, or individual code number) may be shared with cooperation partners for collaborative analysis. The study data may also be made publicly accessible via research databases or scientific publications (typically via the Internet). This makes it possible for other researchers to check or replicate the results of the study and enhances the quality of scientific research. The study data may also be used for new research questions going beyond the purposes of this particular study. Please note that once study data are publicly accessible, its further distribution by others cannot be ruled out and that this is beyond the area of influence or responsibility of the MPI for Human Development. Therefore, as a matter of principle, study data are only transferred or made publicly accessible without personal contact data.</p>
      
      <h3>Participation is voluntary.</h3>
      <p>Participation in this study is voluntary. You may withdraw from the study at any time without giving any reason and without any negative consequences. You may also withdraw your consent to data processing and usage at any time with effect for the future and without negative consequences. You can request deletion of your information by contacting spy-game@mpib-berlin.mpg.de. Please note that once the code list has been deleted (see Section 4), it is no longer possible to link your contact data to your study data.</p>

      <h3>Consent</h3>
      <p>This document has informed you about your participation in Spy Game study. The study involves several rounds of guessing.</p>


      <div className='text-center'>
        <Button variant="success" onClick={handleConsent}>I consent to all the conditions.</Button>{' '}
        <Button variant="danger" onClick={handleReject}>No, I cannot agree.</Button>
      </div>
    </Container>
  );
}

export default IntroPage;