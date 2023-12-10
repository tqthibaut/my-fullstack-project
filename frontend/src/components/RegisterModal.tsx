import React, { useState, useRef, useEffect } from 'react';
import './LoginModal.styles.css'; // Make sure the CSS file exists and is correctly linked
import { BASE_URL } from '../config';

interface RegisterModalProps {
  show: boolean;
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ show, onClose }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [registerError, setRegisterError] = useState<string>('');

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple password match check
    if (password !== confirmPassword) {
      setRegisterError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        console.log("Registration successful!");
        onClose();
      } else {
        const data = await response.json();
        setRegisterError(data.message || 'Registration failed');
      }
	//   if (!response.ok) {
	// 	const data = await response.json();
	// 	// Use the error message from the server response
	// 	setRegisterError(data.message || 'Registration failed');
	//   } else {
	// 	console.log("Registration successful!");
	// 	onClose(); // Close the modal on successful registration
	//   }
    } catch (error) {
      setRegisterError('An error occurred during registration.');
    }
  };

  if (!show) return null;

  return (
	<div className="modal-backdrop" >
    <div className="modal-content" ref={modalRef}>

      <button onClick={onClose}>Close</button>
      <form onSubmit={handleRegistration}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
		  />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
		  />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
		  />
        <button type="submit">Register</button>
      </form>
      {registerError && <div className="error">{registerError}</div>}
	  
		{/* </div> */}
    </div>
	</div>
  );
};

export default RegisterModal;
