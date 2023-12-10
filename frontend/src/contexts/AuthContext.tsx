import React, { createContext, useContext, useState } from 'react';
import { loginUser, logout, RegisterLoginPayload } from '../services/api';

type User = {
  username: string;
  profileImgUrl: string;
  // token: string;
  // refreshToken: string;
};

type AuthContextType = {
  user: User | null;
  login: (payload: RegisterLoginPayload) => void;
  logoutUser: () => void;
  // setUserToken: (token: string) => void;
};

const defaultAuthContextValue: AuthContextType = {
  user: null,
  login: async () => {},
  logoutUser: () => {},
  // setUserToken: () => {}
};

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<AuthContextType>(defaultAuthContextValue);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (payload: RegisterLoginPayload) => {
    try {
      const userData = await loginUser(payload);
      sessionStorage.setItem('access_token', userData.token || '');
      // localStorage.setItem('auth_token', userData.token || '');
      // localStorage.setItem('refresh_token', userData.refreshToken || '');
      setUser({
        username: userData.username,
        profileImgUrl: userData.profileImgUrl,
        // token: userData.token || '',
        // refreshToken: userData.refreshToken || ''
      });
      console.log("userData.profileImgUrl: " + userData.profileImgUrl);
    } catch (error) {
      console.error('Error during login:', error);
      // Additional error handling logic can be added here
    }
  };

  const logoutUser = async () => {
    try {
      await logout(); // This should be an API call to your backend logout endpoint
      sessionStorage.removeItem('access_token');
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const setUserToken = async (token: string) => {
    // Store the token in sessionStorage/localStorage for API requests
    sessionStorage.setItem('access_token', token);
  
    try {
      // Fetch user data from the backend using the token
      const response = await fetch('/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
  
      const userData = await response.json();
      setUser({
        username: userData.username,
        profileImgUrl: userData.profileImgUrl
        // include other user data as necessary
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle error, e.g., by clearing stored token and redirecting to login
      sessionStorage.removeItem('access_token');
      // Redirect to login or handle error
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };

// import React, { createContext, useContext, useState } from 'react';
// // import { refreshAccessToken } from '../services/api'
// import { logout, loginUser, RegisterLoginPayload} from '../services/api'; // Importing the logout function

// type User = {
//   username: string;
//   token: string;
//   refreshToken: string;
// };
// type AuthContextType = {
//   user: User | null;
//   login: (payload: RegisterLoginPayload) => void;
//   logoutUser: () => void;
//   setUserToken: (token: string) => void;
//   // refreshToken: () => Promise<void>;
// };

// const defaultAuthContextValue: AuthContextType = {
//   user: null,
//   login: async () => {},
//   logoutUser: () => {}
// };
// type AuthProviderProps = {
//   // user: User | null;
//   // login: (payload: RegisterLoginPayload) => void;
//   // logoutUser: () => void;
//   // refreshToken: () => Promise<void>;
//   // We need this one to wrap child components, because yeah they would 
//   // more or less need authentication.
//   children: React.ReactNode;
// };
// const AuthContext = createContext<AuthContextType>(defaultAuthContextValue);


// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);

//   const login = async (payload: RegisterLoginPayload) => {
//     try {
//       const userData = await loginUser(payload);
//       localStorage.setItem('auth_token', userData.token || '');
//       localStorage.setItem('refresh_token', userData.refreshToken || '');
//       setUser({
//         username: userData.username,
//         token: userData.token || '',
//         refreshToken: userData.refreshToken || ''
//       });
//     } catch (error) {
//       console.error('Error during login:', error);
//       // Handle the error, perhaps show a message to the user
//     }
//   };
  

//   const logoutUser = () => {
//     logout();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logoutUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export { AuthContext };

