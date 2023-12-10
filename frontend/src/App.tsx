import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import PublicProfile from './pages/PublicProfile';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import GlobalStyles from './GlobalStyles';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <GlobalStyles />
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token && !user) {
      // setUserToken(token); // A function to set the user's token in context (you'll need to implement this)
      // Optionally, fetch the user profile here if necessary
      navigate('/profile'); // Redirect to user profile if already logged in
    }
  }, [user, navigate]);

  return (
    <React.Fragment>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:username" element={<PublicProfile />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute path="/profile">
              <UserProfile />
            </PrivateRoute>
          }
        />
        {/* ... other routes ... */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </React.Fragment>
  );
};

export default App;


// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Navigation from './components/Navigation';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import UserProfile from './pages/UserProfile';
// import PublicProfile from './pages/PublicProfile';
// import PrivateRoute from './components/PrivateRoute';
// import { AuthProvider } from './contexts/AuthContext';
// import { ThemeProvider } from '@mui/material/styles';
// import { theme } from './theme';
// import GlobalStyles from './GlobalStyles';

// const App: React.FC = () => {
//   return (
//     <ThemeProvider theme={theme}>
//       <AuthProvider>
//         <Router>
//           <GlobalStyles />
//           <Navigation />
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/profile/:username" element={<PublicProfile />} />
//             <Route
//               path="/profile"
//               element={
//                 <PrivateRoute path="/profile">
//                   <UserProfile />
//                 </PrivateRoute>
//               }
//             />
//             {/* ... other routes ... */}
//           </Routes>
//         </Router>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// };

