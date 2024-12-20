import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';

// import axiosInstance from '../api/backendInstance'
import {socket} from '../api/socket'


function RoundReportModal({isModalOpen, setIsModalOpen, roundReport}) {
    
    return (
        <Modal show={isModalOpen}>
            <Modal.Header>
                <Modal.Title className='text-center'>Round Report Modal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div dangerouslySetInnerHTML={{ __html: roundReport }} />
            </Modal.Body>
        </Modal>
    );
}

export default RoundReportModal;

const styles={
}