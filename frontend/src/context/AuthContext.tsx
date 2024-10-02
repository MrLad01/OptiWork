import axios from 'axios';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { calculateResourceUtilizationRate, calculateTaskCompletionRate, calculateTaskEfficiency } from '../helper';


interface UserNotification {
    id: string;
    from: string;
    msg: string;
    date: string; // Format: "MM/DD/YYYY"
    time: string; // Format: "HH:MM"
  }

 export interface UserTask {
      _id:string;
      task_number:number;
      task_name: string;
      due_date: string;
      due_time: string;
      priority: string;
      status: string;
      completion_date: string;
      resources_used: string;  
      estimated_time: number;
      actual_time: number;
    }
  
  interface User {
    _id: {
        $oid: string;
    };
    first_name: string;
    last_name: string;
    username: string;
    password: string;
    company_name: string;
    company_email: string;
    image: string;
    role: string;
    skill: string[];
    notification: UserNotification[];
    tasks: UserTask[];
  }

  interface UserLogin {
    username: string;
    password: string;
  }

  export interface KPI {
    taskCompletionRate: number;
    resourceUtilizationRate: number;
    taskEfficiency: number;
    taskOverdueRate: number;
    userRating: number;
  }
  
  interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    user: User | null;  // To store the user details after login
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    login: (userData: UserLogin) => void; // Now passes user data on login
    logout: () => void;
    KPI: KPI | null;
    setKPI: React.Dispatch<React.SetStateAction<KPI | null>>;
    loading: boolean;
  }



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [ KPI,  setKPI] = useState<KPI | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {          
          const response = await axios.get('/api/test-auth');
          if (response.data.user) {
            setUser(response.data.user);
            const user = response.data.user;
            setIsAuthenticated(true);
            if (user.tasks && user.tasks.length > 0){                    
              const taskCompletionRate = calculateTaskCompletionRate(user.tasks);
              const resourceUtilizationRate = calculateResourceUtilizationRate(user.tasks);
              const taskEfficiency = calculateTaskEfficiency(user.tasks);
              const taskOverdueRate = 100 - taskEfficiency;
            
              const userRating = Math.round(
                                      ( taskCompletionRate * 0.4 ) + 
                                      ( resourceUtilizationRate * 0.3 ) + 
                                      ( taskEfficiency * 0.2 ) + 
                                      ( taskOverdueRate * 0.1 )
                                  );
            
              const kpi: KPI = {
                taskCompletionRate,
                resourceUtilizationRate,
                taskEfficiency,
                taskOverdueRate,
                userRating
              }

              setKPI(kpi);
            }
          }
        } catch (error) {
          console.error('Session restoration failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };
  
  const logout = async () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    // Additional logic like removing cookies, etc.
    try {          
      const response = await axios.post('/api/users/auth/logout');
      console.log(response.data.message);
      
    } catch(err) {
      console.error(err);    
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout, user, setUser, KPI, setKPI, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
