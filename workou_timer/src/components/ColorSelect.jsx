import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const ColorSelector = ({selectedColor, setSelectedColor}) => {
  const [showModal, setShowModal] = useState(false);

  const colors = ['#EAC435', '#345995', '#E40066', '#03CEA4', '#FB4D3D'];

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setShowModal(false);
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)} style={{ backgroundColor: selectedColor }} className='color-btn'/>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Choose a color</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-around">
            {colors.map((color) => (
              <div
                key={color}
                className="color-option"
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ColorSelector;
