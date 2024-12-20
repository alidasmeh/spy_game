import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';

// import axiosInstance from '../api/backendInstance'
import {socket} from '../api/socket'


function RoundReportModal({isModalOpen, setIsModalOpen, roundReport}) {
    
    const handleClose = () => setIsModalOpen(false);

    useEffect(()=>{
        setTimeout(()=>{
            setIsModalOpen(false)
        }, 5000)

    }, [])
    

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