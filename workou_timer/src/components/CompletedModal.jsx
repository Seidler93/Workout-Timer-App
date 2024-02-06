import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CompletedModal = ({showModal, setShowModal, restart}) => {


  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Body>
          <h1>youve finished</h1>
          <Link to={'/'}>Home</Link>
          <button onClick={() => restart()}>Restart</button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CompletedModal;
