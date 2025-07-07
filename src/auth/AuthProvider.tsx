import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import type { User } from "./authTypes";
import { apiUrl } from "../config/consts";
import { useNavigate } from "react-router-dom";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [scope, setScope] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true); // Nuevo estado

  const navigate = useNavigate();

  // Session management
  useEffect(() => {
    setAuthLoading(true); // Comienza la carga
    if (token) {
      localStorage.setItem("token", token);
      const decoded = jwtDecode<{ sub: string, scope: string[] }>(token);
      const userId = decoded.sub;
      const userScope = decoded.scope[0];

      axios
        .get(`${apiUrl}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setCurrentUser(response.data);
          setScope(userScope);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setCurrentUser(null);
          setScope(null);
          // If user cant fetch its own data (404) we assume the account was deleted
          if (error.response && error.response.status === 404) {
            alert("Tu cuenta ha sido eliminada");
            setToken(null);
            localStorage.removeItem("token");
            navigate("/");
          }
        })
        .finally(() => {
          setAuthLoading(false); // Finaliza la carga
        });
    } else {
      localStorage.removeItem("token");
      setCurrentUser(null);
      setScope(null);
      setAuthLoading(false); // Finaliza la carga
    }
  }, [token]);

  // Token verification and expiration check
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<{ exp: number }>(token);
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
          alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
          navigate("/");
          setToken(null);
          localStorage.removeItem("token");
          setCurrentUser(null);
          setScope(null);
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.error("Error decoding token:", e.message);
        } else {
          console.error("Error decoding token:", e);
        }
        console.error("Token inválido");
        setToken(null);
        localStorage.removeItem("token");
        setCurrentUser(null);
        setScope(null);
      }
    }
  }, []);

  // User data refresh
  function refreshCurrentUser() {
    if (!token) return;
    const decoded = jwtDecode<{ sub: string }>(token);
    const userId = decoded.sub;
    axios
      .get(`${apiUrl}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCurrentUser(response.data);
      })
      .catch((error) => {
        console.error("Error refreshing user data:", error);
      });
  }

  function logout() {
    setToken(null);
    localStorage.removeItem("token");
    setCurrentUser(null);
    setScope(null);
    setAuthLoading(false);
  }

  return (
    <AuthContext.Provider value={{ token, setToken, logout, currentUser, refreshCurrentUser, scope, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
