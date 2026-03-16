import React, { createContext, useContext, useState } from "react";
import { authService, type User } from "../modules/auth/services/auth.service";
import { Spinner } from "@/components/ui/spinner";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (
    email: string,
    password: string,
    role: "CONTRACTOR" | "PROVIDER"
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Inicializar estado desde localStorage
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoadingAuth(true);
    try {
      const response = await authService.login({ email, password });
      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      return response.data.user;
    } catch (error: any) {
      console.error("Login error:", error);
      throw error; // Re-lanzar el error para que el componente que llama pueda manejarlo
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    role: "CONTRACTOR" | "PROVIDER"
  ) => {
    setIsLoadingAuth(true);
    try {
      const response = await authService.register({
        email,
        password,
        role: role,
      });
      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    } catch (error: any) {
      console.error("Register error:", error);
      throw error; // Re-lanzar el error para que el componente que llama pueda manejarlo
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoadingAuth,
        login,
        register,
        logout,
      }}
    >
      {isLoadingAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Spinner className="h-12 w-12" />
          </div>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
