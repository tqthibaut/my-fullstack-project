import React, { ReactNode, useContext } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
  path: string;
}


const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, path }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Route path={path} element={children} />;
};

export default PrivateRoute;


// import { useNavigate, Route} from 'react-router-dom';
// import { AuthContext } from '../contexts/AuthContext';
// import { useContext } from 'react';
// import * as React from 'react';

// const PrivateRoute: React.FC<{
//   path: string;
//   element: React.ReactElement;
// }> = ({ element, path, ...props }) => {
//   const navigate = useNavigate();
//   const authContext = useContext(AuthContext);
//   const user = authContext?.user;

//   if (!user) {
//     navigate('/login');
//     return null;
//   }

//   return <Route path={path} element={element} {...props} />;
// };
// export default PrivateRoute;

