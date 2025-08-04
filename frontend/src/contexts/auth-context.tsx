"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { poster } from "../services/api";
import { decodeJwt, isTokenExpired } from "../lib/jwt";
import {
  AccessTokenData,
  AuthContextType,
  AuthTokens,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshAuth();
      } catch (error) {
        console.log("No valid session found");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const checkTokenExpiry = () => {
      if (isTokenExpired(accessToken)) {
        refreshAuth();
      }
    };

    const interval = setInterval(checkTokenExpiry, 60000);
    return () => clearInterval(interval);
  }, [accessToken]);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await poster<LoginCredentials, AuthTokens>(
        "/api/auth/login",
        credentials
      );

      const { data: tokens } = response;

      const payload = decodeJwt(tokens.accessToken);

      if (!payload) {
        throw new Error("Invalid token received");
      }

      const userInfo: User = {
        id: tokens.userId,
        email: tokens.email,
        firstName: tokens.firstName,
        lastName: tokens.lastName,
        role: tokens.role,
      };

      const tokenData: AccessTokenData = {
        accessToken: tokens.accessToken,
        expiresIn: tokens.expiresIn,
        familyId: tokens.familyId,
      };

      setUser(userInfo);
      setAccessToken(tokens.accessToken);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await poster<RegisterCredentials, AuthTokens>(
        "/api/auth/register",
        credentials
      );

      const { data: tokens } = response;

      const payload = decodeJwt(tokens.accessToken);
      if (!payload) {
        throw new Error("Invalid token received");
      }

      const userInfo: User = {
        id: tokens.userId,
        email: tokens.email,
        firstName: tokens.firstName,
        lastName: tokens.lastName,
        role: tokens.role,
      };

      const tokenData: AccessTokenData = {
        accessToken: tokens.accessToken,
        expiresIn: tokens.expiresIn,
        familyId: tokens.familyId,
      };

      setUser(userInfo);
      setAccessToken(tokens.accessToken);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await poster(
        "/api/auth/logout",
        {},
        { accessToken: accessToken || undefined }
      );
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  const refreshAuth = async (): Promise<void> => {
    try {
      const response = await poster<{}, AuthTokens>("/api/auth/refresh", {});

      const { data: tokens } = response;

      const payload = decodeJwt(tokens.accessToken);
      if (!payload) {
        throw new Error("Invalid token received");
      }

      const userInfo: User = {
        id: tokens.userId,
        email: tokens.email,
        firstName: tokens.firstName,
        lastName: tokens.lastName,
        role: tokens.role,
      };

      const tokenData: AccessTokenData = {
        accessToken: tokens.accessToken,
        expiresIn: tokens.expiresIn,
        familyId: tokens.familyId,
      };

      setUser(userInfo);
      setAccessToken(tokens.accessToken);
    } catch (error) {
      console.error("Token refresh failed:", error);
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    accessToken,
    isLoading,
    isAuthenticated: !!user && !!accessToken,
    login,
    register,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
