import { deleteToken, getToken, saveToken } from "@/services/AuthStorage";
import { DecodedToken, decodeToken } from "@/services/decodeToken";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";


interface AuthContextType {
  user: DecodedToken | null;
  token: string | null;
  login: (username: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [token, setToken] = useState<string | null>(null);

useEffect(() => {
    const loadToken = async () => {
      const storedToken = await getToken();
      if (storedToken) {
        setToken(storedToken);
        setUser(decodeToken(storedToken));
      }
    };
    loadToken();
  }, []);

  
  const login = async (username: string, password: string): Promise<string | null> => {
    try {
      console.log(`${BASE_URL}/api/auth/signin`)
      const res = await axios.post(`${BASE_URL}api/auth/signin`, {
        username,
        password,
      });

      const jwt = res.data;
      
      await saveToken(jwt);
      setToken(jwt);

      const decoded = decodeToken(jwt);
      setUser(decoded);

      // Return role so login screen can redirect
      return decoded.roles.includes("ROLE_ADMIN") ? "admin" : "user";
    } catch (err) {
      console.error("Login failed:", err);
      return null;
    }
  };

  const logout = async () => {
    await deleteToken();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};