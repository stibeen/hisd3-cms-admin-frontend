import { Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchMe } from "../lib/auth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // const token = localStorage.getItem('accessToken');
    // setIsAuthenticated(!!token);
    async function checkAuth() {
      const me = await fetchMe();
      console.log(me);
      setIsAuthenticated(me.isSignedIn);
    }
    checkAuth();
  }, []);

  // Show nothing (or a loader) during the initial check to prevent hydration mismatch
  if (isAuthenticated === null) {
    return null;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <Navigate to="/login" />;
}
