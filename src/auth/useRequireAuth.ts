import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";



export function useRequireAuth( requireAdmin = false ) {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  
  // For routes that require user authentication
  useEffect(() => {
    // Dont trigger if the route requires admin authentication
    if (requireAdmin) return;

    if (!auth?.token) {
      navigate("/", { state: { showLoginAlert: true } });
      return;
    }
    
  }, [auth?.token, navigate, requireAdmin]);


  // For routes that require admin authentication
  useEffect(() => {
    // Dont trigger if the route does not require admin authentication
    if (!requireAdmin) return;

    if (auth?.authLoading) return; // Wait for auth loading to finish

    // User is not authenticated
    if (!auth?.token) {
      navigate("/forbidden");
      return;
    }
    // User is authenticated but not an admin
    if (auth?.scope && auth.scope !== "admin") {
      navigate("/forbidden");
      return;
    }
  }, [auth?.token, auth?.scope, navigate, requireAdmin, auth?.authLoading]);

  if (!auth) {
    throw new Error("useRequireAuth must be used within an AuthProvider");
  }

  return auth;
}