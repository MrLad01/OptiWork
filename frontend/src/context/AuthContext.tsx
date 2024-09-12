import React, { createContext, useState, useContext, ReactNode } from 'react';


interface UserNotification {
    id: string;
    from: string;
    msg: string;
    date: string; // Format: "MM/DD/YYYY"
    time: string; // Format: "HH:MM"
  }

  interface UserTask {
      task_name: string;
      due_date: string;
      due_time: string;
      priority: string;
      status: string;
      completion_date: string;
      resources_used: string;  
      estimated_time: string;
      actual_time: string;
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
    user: User | null;  // To store the user details after login
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    login: (userData: UserLogin) => void; // Now passes user data on login
    logout: () => void;
    KPI: KPI | null;
    setKPI: React.Dispatch<React.SetStateAction<KPI | null>>;
  }



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [ KPI,  setKPI] = useState<KPI | null>(null);


  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    // Additional logic like removing cookies, etc.
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, setUser, KPI, setKPI }}>
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
