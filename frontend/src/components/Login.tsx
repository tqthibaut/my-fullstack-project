import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
      navigate('/'); // Redirect to home page or another page as needed
    } catch (error) {
      console.error('There was an error logging in:', error);
      // Optionally, provide user feedback here, e.g., a notification or error message
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

// import React, { useState } from 'react';
// import { loginUser } from '../services/api';

// interface LoginProps {
//   // You can add props here if needed, for example, to handle post-login actions.
// }

// const Login: React.FC<LoginProps> = () => {
//   const [username, setUsername] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [message, setMessage] = useState<string>('');

//   async function handleLogin() {
//     try {
//       const data = await loginUser({ username, password });
      
//       // Handle successful login, e.g., store user data or navigate to a dashboard.
//       setMessage('Logged in successfully!');

//     } catch (error) {
//       // Handle login error
//       if (error instanceof Error) {
//         setMessage(error.message);
//       } else {
//         setMessage('An unexpected error occurred.');
//       }
//     }
//   }

//   return (
//     <div>
//       <input 
//         value={username} 
//         onChange={e => setUsername(e.target.value)} 
//         placeholder="Username" 
//       />
//       <input 
//         type="password" 
//         value={password} 
//         onChange={e => setPassword(e.target.value)} 
//         placeholder="Password" 
//       />
//       <button onClick={handleLogin}>Login</button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }

// export default Login;
