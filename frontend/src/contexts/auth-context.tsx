"use client";

import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useLayoutEffect,
} from "react";
import { axiosInstance, poster } from "../services/api";
import { decodeJwt, isTokenExpired } from "../lib/jwt";
import {
  AuthContextType,
  AuthTokens,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../types/auth";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
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

  useLayoutEffect(() => {
    const authInterceptor = axiosInstance.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    });

    return () => {
      axiosInstance.interceptors.request.eject(authInterceptor);
    };
  }, [accessToken]);

  useLayoutEffect(() => {
    const refreshInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          originalRequest._retry ||
          originalRequest.url === "/api/auth/login"
        ) {
          return Promise.reject(error);
        }

        if (error.response.status === 401) {
          originalRequest._retry = true;

          try {
            await refreshAuth();
            delete originalRequest.headers.Authorization;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await poster<LoginCredentials, AuthTokens>(
        "/api/auth/login",
        credentials
      );

      const { data: responseData } = response;

      const payload = decodeJwt(responseData.accessToken);

      if (!payload) {
        throw new Error("Invalid token received");
      }

      const userInfo: User = {
        id: responseData.userId,
        email: responseData.email,
        firstName: responseData.firstName,
        lastName: responseData.lastName,
        role: responseData.role,
      };

      setUser(userInfo);
      setAccessToken(responseData.accessToken);
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

      const { data: responseData } = response;

      const payload = decodeJwt(responseData.accessToken);
      if (!payload) {
        throw new Error("Invalid token received");
      }

      const userInfo: User = {
        id: responseData.userId,
        email: responseData.email,
        firstName: responseData.firstName,
        lastName: responseData.lastName,
        role: responseData.role,
      };

      setUser(userInfo);
      setAccessToken(responseData.accessToken);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await poster("/api/auth/logout", {});
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

      const { data: responseData } = response;

      const payload = decodeJwt(responseData.accessToken);
      if (!payload) {
        throw new Error("Invalid token received");
      }

      const userInfo: User = {
        id: responseData.userId,
        email: responseData.email,
        firstName: responseData.firstName,
        lastName: responseData.lastName,
        role: responseData.role,
      };

      setUser(userInfo);
      setAccessToken(responseData.accessToken);
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
