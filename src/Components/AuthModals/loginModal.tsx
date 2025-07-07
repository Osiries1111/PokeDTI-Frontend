import "./authModals.css";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../auth/AuthContext";
import { apiUrl } from "../../config/consts";
import { jwtDecode } from "jwt-decode";
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
  onLoginSuccess: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onRegisterClick,
  onLoginSuccess,
}: LoginModalProps) {
  // Context
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("LoginModal must be used within an AuthProvider");
  }
  const { token, setToken } = auth;

  // State

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Effects

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setEmail("");
        setPassword("");
      }, 300);
    }
  }, [isOpen]);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/authentication/login`, {
        email,
        password,
      });

      const { access_token } = response.data;
      setToken(access_token);

      const decodedToken = jwtDecode<{ scope: string[] }>(access_token);
      const scope = decodedToken.scope[0];

      if (scope) {
        if (scope === "admin") {
          navigate("/admin");
          return;
        }
      }

      navigate("/");
      onLoginSuccess();

    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          const errorMsg = error.response.data.error;
          alert(errorMsg);
        } else {
          alert("Ocurrió un error inesperado. Intenta de nuevo.");
        }
      }
      else {
        alert("Ocurrió un error desconocido. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    return null;
  }

  return (
    <div className={`auth-modal${isOpen ? " auth-modal--open" : ""}`}>
      <div className="auth-modal__content">
        <div className="auth-modal__header">
          <h2>Iniciar Sesión</h2>
          <button className="auth-modal__close" onClick={onClose}>
            X
          </button>
        </div>
        <div className="auth-modal__body">
          <form onSubmit={handleSubmit}>
            <h3>Email</h3>
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <h3>Contraseña</h3>
            <input
              type="password"
              placeholder="Contraseña"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {loading ? (
              <button type="submit" disabled>
                Iniciando sesión...
              </button>
            ) : (
              <button type="submit">Iniciar Sesión</button>
            )}
          </form>
        </div>
        <div className="auth-modal__footer">
          <p>¿No tienes una cuenta?</p>
          <button className="auth-modal__auth" onClick={onRegisterClick}>
            Regístrate
          </button>
        </div>
      </div>
    </div>
  );
}
