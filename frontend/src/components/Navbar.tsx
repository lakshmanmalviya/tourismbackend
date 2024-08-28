import Image from "next/image";
import logo from "../assets/logo.png";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Register from "./Register";
import Login from "./Login";
import Modal from "@mui/material/Modal";
import { ToastContainer } from "react-toastify";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const toggleForm = () => setIsRegister(!isRegister);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "400px",
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
  };

  return (
    <header className="container mx-auto">
      <nav className="flex items-center justify-between py-2">
        <div className="flex items-center">
          <Image src={logo} alt="logo" width={50} height={50} />
          <p className="ml-3 text-xl font-bold text-gray-800">Tourism App</p>
        </div>

        <div className="hidden md:flex space-x-8 text-lg font-medium text-gray-700">
          <Link href="/" className="hover:text-green-500 transition">Home</Link>
          <Link href="/discover" className="hover:text-green-500 transition">Discover</Link>
          <Link href="/Heritage" className="hover:text-green-500 transition">Heritage</Link>
          <Link href="/Gallery" className="hover:text-green-500 transition">Gallery</Link>
          <Link href="/Hotel" className="hover:text-green-500 transition">Hotels</Link>
        </div>

        <div className="hidden md:flex space-x-4">
          <Button onClick={handleOpen} className="bg-green-500 text-white px-2 py-2 rounded-full hover:bg-green-600 transition">Register / Login</Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box ref={modalRef} sx={style}>
              {isRegister ? (
                <Register toggleForm={toggleForm} onSuccess={handleClose} />
              ) : (
                <Login toggleForm={toggleForm} onSuccess={handleClose} />
              )}
            </Box>
          </Modal>
        </div>

        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="focus:outline-none text-gray-700 hover:text-gray-900"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50 flex flex-col items-center justify-center space-y-8 text-lg font-medium text-gray-700">
          <button
            onClick={toggleMenu}
            className="absolute top-5 right-5 focus:outline-none text-gray-700 hover:text-gray-900"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <Link href="/" onClick={toggleMenu} className="hover:text-green-500 transition">Home</Link>
          <Link href="/discover" onClick={toggleMenu} className="hover:text-green-500 transition">Discover</Link>
          <Link href="/Heritage" onClick={toggleMenu} className="hover:text-green-500 transition">Heritage</Link>
          <Link href="/Gallery" onClick={toggleMenu} className="hover:text-green-500 transition">Gallery</Link>
          <Link href="/Hotel" onClick={toggleMenu} className="hover:text-green-500 transition">Hotels</Link>
          <Button onClick={handleOpen} className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition">Register / Login</Button>
        </div>
      )}
      <ToastContainer/>
    </header>
  );
};

export default Navbar;
