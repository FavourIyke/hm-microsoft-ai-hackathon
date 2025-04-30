import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from 'axios';

type User = {
  id: string;
  email: string;
  role: "provider" | "admin" | "field_worker";
};

type LoginResponse = {
  status: boolean;
  message: string;
  data: {
    token: string;
    payload: {
      userId: number;
      email: string;
      role: string;
    };
  };
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean; // Added loading state
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading state

  // ✅ Restore user from localStorage on first load
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        
        if (token) {
          // Option 1: Decode the token to get user info if it's a JWT
          const payload = parseJwt(token);
          
          if (payload) {
            // Optional: Verify token with backend
            // await verifyTokenWithBackend(token);
            
            setUser({
              id: String(payload.userId),
              email: payload.email,
              role: payload.role,
            });
          } else {
            // Token invalid, clear it
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error("Authentication error:", error);
        // If verification fails, clear local storage
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post<LoginResponse>(
        'http://localhost:3000/auth/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const data = response.data;

      if (data.status) {
        const { token, payload } = data.data;

        localStorage.setItem('authToken', token);

        const authenticatedUser: User = {
          id: String(payload.userId),
          email: payload.email,
          role: payload.role as "provider" | "admin" | "field_worker",
        };

        setUser(authenticatedUser);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An error occurred during login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Optional: Function to verify token with backend
  // async function verifyTokenWithBackend(token: string) {
  //   try {
  //     const response = await axios.post(
  //       'http://localhost:3000/auth/verify',
  //       {},
  //       { headers: { 'Authorization': `Bearer ${token}` } }
  //     );
  //     return response.data.valid;
  //   } catch (error) {
  //     throw new Error('Token verification failed');
  //   }
  // }

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// 🧠 Helper to decode JWT
function parseJwt(token: string): any | null {
  try {
    const base64Payload = token.split('.')[1];
    const decodedPayload = atob(base64Payload);
    return JSON.parse(decodedPayload);
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
}