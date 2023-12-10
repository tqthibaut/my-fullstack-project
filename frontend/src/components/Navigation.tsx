import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box, Avatar} from '@mui/material';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const Navigation: React.FC = () => {
  const { user, logoutUser } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            ChatApp
          </Typography>
          <Box flexGrow={1} />
          {user ? (
            <>
                <Avatar 
                src={user.profileImgUrl} 
                alt={user.username} 
                style={{ marginRight: '10px' }} 
              />
              <Button color="inherit" component={Link} to="/profile">Profile</Button>
              <Button color="inherit" onClick={logoutUser}>Disconnect</Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => setShowLoginModal(true)}>Login</Button>
              <Button color="inherit" onClick={() => setShowRegisterModal(true)}>Register</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <RegisterModal show={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
    </>
  );
};

export default Navigation;

// import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
// import { Link } from 'react-router-dom';
// import LoginModal from './LoginModal';
// import RegisterModal from './RegisterModal';

// const Navigation: React.FC = () => {
//   const { user, logoutUser } = useAuth();
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [showRegisterModal, setShowRegisterModal] = useState(false);

//   return (
//     <>
//       <AppBar position="sticky">
//         <Toolbar>
//           <Typography variant="h6" component={Link} to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
//             ChatApp
//           </Typography>
//           <Box flexGrow={1} />
//           {user ? (
//             <>
//               <Button color="inherit" component={Link} to="/profile">Profile</Button>
//               <Button color="inherit" onClick={logoutUser}>Disconnect</Button>
//             </>
//           ) : (
//             <>
//               <Button color="inherit" onClick={() => setShowLoginModal(true)}>Login</Button>
//               <Button color="inherit" onClick={() => setShowRegisterModal(true)}>Register</Button>
//             </>
//           )}
//         </Toolbar>
//       </AppBar>
//       <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />
//       <RegisterModal show={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
//     </>
//   );
// };

// export default Navigation;


// import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
// import { Link } from 'react-router-dom';
// import LoginModal from './LoginModal';
// import RegisterModal from './RegisterModal';

// const Navigation: React.FC = () => {
//   const { user, logoutUser } = useAuth(); // Extract user and logout from the context
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [showRegisterModal, setShowRegisterModal] = useState(false);
  
//   return (
//     <AppBar position="sticky">
//       <Toolbar>
//         <Typography variant="h6" component="div">
//           ChatApp
//         </Typography>
//         <Box flexGrow={1} /> {/* This will push everything to the right */}
//         {user ? (
//           <>
//             {/* These buttons appear when the user is logged in */}
//             <Button color="inherit" component={Link} to="/chatroom">Chatroom</Button>
//             <Button color="inherit" onClick={logoutUser}>Logout</Button>
//           </>
//         ) : (
//           <>
//             {/* These buttons appear when the user is NOT logged in */}
//             <Button color="inherit" component={Link} to="/login">Login</Button>
//             <Button color="inherit" component={Link} to="/register">Register</Button>
//           </>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navigation;

// import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
// import LoginModal from './LoginModal';
// import RegisterModal from './RegisterModal';

// const Navigation: React.FC = () => {
//   const { user, logoutUser } = useAuth();
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [showRegisterModal, setShowRegisterModal] = useState(false);

//   return (
//     <>
//       <AppBar position="sticky">
//         <Toolbar>
//           {/* ...existing toolbar content... */}
//           {user ? (
//             // ...user logged in buttons...
//           ) : (
//             <>
//               <Button color="inherit" onClick={() => setShowLoginModal(true)}>Login</Button>
//               <Button color="inherit" onClick={() => setShowRegisterModal(true)}>Register</Button>
//             </>
//           )}
//         </Toolbar>
//       </AppBar>
//       <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />
//       <RegisterModal show={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
//     </>
//   );
// };

// export default Navigation;
