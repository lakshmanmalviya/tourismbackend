import React, { useRef, useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Register from './Register';
import Login from './Login';
import Modal from "@mui/material/Modal";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [open, setOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(true); 
  const modalRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const toggleForm = () => setIsRegister(!isRegister);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div>
        <Button onClick={handleOpen}>Open modal</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} // Center the modal
        >
          <Box ref={modalRef} sx={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: 24 }}>
            {isRegister ? (
              <Register toggleForm={toggleForm} onSuccess={handleClose} />
            ) : (
              <Login toggleForm={toggleForm} onSuccess={handleClose} />
            )}
          </Box>
        </Modal>
      </div>

      <ToastContainer/>
    </div>
  );
};

export default App;
