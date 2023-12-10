import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// Note: FC stands for Function Component! Not for Football Club. Izi mistake.
const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const auth = useAuth(); // Use the AuthContext

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Here, you'd typically make an API call to log in the user
  //   console.log('Logging in:', username);
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
            credentials: 'include', // Necessary to include cookies
        });

        if (response.ok) {
            console.log('Login successful!');
            // Redirect or update state as needed
            navigate('/');
        } else {
            const data = await response.json();
            console.error('Login failed:', data.message); // Show error message from server
        }
    } catch (error) {
        console.error('There was an error logging in:', error);
    }

};

  

  return (
    <div>
      <h1>Login</h1>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
