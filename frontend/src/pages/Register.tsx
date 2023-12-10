// src/pages/Register.tsx

import React, { useState } from 'react';
import { registerUser, RegisterLoginPayload } from '../services/api';
import SimplePopup from '../components/SimplePopUp'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';

type UserRegistrationPayload = {
  username: string;
  password: string;
};

type SuccessfulRegistrationResponse = {
  message: string;
  userId: number;
};

type ErrorRegistrationResponse = {
  message: string;
};




const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string>('');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setMessage("Passwords don't match!");
      setShowPopup(true);
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setShowPopup(true);
      return;
    }
  
    // Check for at least one number
    if (!/\d/.test(password)) {
      setMessage("Password must contain at least one number.");
      setShowPopup(true);
      return;
    }
  
  
    const payload: UserRegistrationPayload = { username, password };
  
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      const data = await response.json(); // Parse the JSON response
      console.log('Register data received:' + data);
  
      if (!response.ok) {
        // Check if the response has an error message and display it
        const errorMessage = data.message || 'Registration failed. Please try again.';
        setMessage(errorMessage);
        setShowPopup(true);
      } else {
        setMessage('Successfully registered! Redirecting to login...');
        setShowPopup(true);
        setTimeout(() => {
          navigate('/login'); // Redirect to login page after a short delay
        }, 2000);
      }
  
    } catch (error) {
      setMessage('Registration failed. Please try again.');
      setShowPopup(true);
    }
  };
  

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {showPopup && message && (
        <SimplePopup 
          message={message} 
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default Register;

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (password !== confirmPassword) {
  //     console.error("Passwords don't match!");
  //     return;
  //   }
  //   // Here, you'd typically make an API call to register the user
  //   console.log('Registering:', username);
  // };
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (password !== confirmPassword) {
  //     console.error("Passwords don't match!");
  //     return;
  //   }
  
  //   const payload = {
  //     username,
  //     password
  //   };
  
  //   try {
  //     const response = await fetch('http://localhost:3000/register', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(payload)
  //     });
  
  //     if (!response.ok) {
  //       const data = await response.json();
  //       console.error("Error:", data.message);
  //     } else {
  //       console.log('Successfully registered!');
  //       // Redirect or handle successful registration here
  //     }
  
  //   } catch (error) {
  //     console.error("There was an error:", error);
  //   }
  // };