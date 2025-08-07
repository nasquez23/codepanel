import { AuthContext } from "@/contexts/auth-context";
import { AuthContextType } from "@/types/auth";
import { useContext } from "react";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
