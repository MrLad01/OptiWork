import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RingLoader } from 'react-spinners';

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated, setIsAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token === 'Logged in gee') {
        setIsAuthenticated(true);
        console.log(user);
        
      } else {
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };

    checkAuthentication();
  }, [setIsAuthenticated]);

  if (loading) {
    return (
      <div className='w-full h-[100vh] flex items-center justify-center'>
        <div className='flex flex-col gap-5 items-center justify-center'>
          <RingLoader size={120} />
          <h2 className='text-center max-w-[28rem] text-pretty text-lg'>
            Just give us a moment, we will be right back!
          </h2>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/useraccess" />;
  }

  return children;
};

export default PrivateRoute;