"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
    <div className="animate-spin rounded-full size-20 border-4 border-blue-500 border-t-transparent" />
  </div>
);

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/login",
  requireAuth = true,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { replace } = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      setIsRedirecting(true);
      replace(redirectTo);
    } else if (!requireAuth && isAuthenticated) {
      setIsRedirecting(true);
      replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, replace]);

  if (isLoading || isRedirecting) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};
