import React, { useState, useRef, useEffect } from 'react';
import './LoginModal.styles.css';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ show, onClose }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [loginSuccess, setLoginSuccess] = useState<string>('');

  const { login } = useAuth(); // Use the login function from AuthContext
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement|null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement login logic here
    try {
      await login({ username, password });
      setLoginSuccess('Login successful! Redirecting...');
      console.log('Login successful!');
      onClose(); // Close modal on successful login
      setTimeout(() => {
        onClose();
        navigate('/');
      }, 2000);    
    }
    catch (error) {
      setLoginError('Login failed. Please try again.');
    }
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop">
    <div className="modal-content" ref={modalRef}>
            <button onClick={onClose}>Close</button>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      {loginError && <div className="error">{loginError}</div>}
      {loginSuccess && <div className="success">{loginSuccess}</div>}
    </div>
    </div>
  );
};

export default LoginModal;
