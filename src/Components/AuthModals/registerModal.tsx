import "./authModals.css";
import { useState, useRef, useEffect, useContext } from "react";
import React from "react";
import axios from "axios";
import { checkUsername, checkPassword } from "./authFunctions";
import AuthContext from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../config/consts";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  onRegisterSuccess: () => void;
}

export default function RegisterModal({
  isOpen,
  onClose,
  onLoginClick,
  onRegisterSuccess,
}: RegisterModalProps) {
  const navigate = useNavigate();

  // Context

  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("RegisterModal must be used within an AuthProvider");
  }
  const { token, setToken } = auth;
  // State
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Effects

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setEmail("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        emailRef.current?.setCustomValidity("");
        usernameRef.current?.setCustomValidity("");
        passwordRef.current?.setCustomValidity("");
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar el nombre de usuario

    const isUsernameValid = checkUsername(username, usernameRef);
    if (!isUsernameValid) {
      return;
    }
    // Validar que las contraseñas coincidan y tengan al menos 8 caracteres

    const isPasswordValid = checkPassword(
      password,
      confirmPassword,
      passwordRef
    );
    if (!isPasswordValid) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/authentication/signup`, {
        email,
        password,
        username,
        description: "",
      });

      // Si el registro fue exitoso, intenta login
      try {
        const login_response = await axios.post(
          `${apiUrl}/authentication/login`,
          {
            email: response.data.email,
            password,
          }
        );
        const { access_token } = login_response.data;
        setToken(access_token);
        navigate("/");
        onRegisterSuccess();
      } catch (loginError: unknown) {
        if (axios.isAxiosError(loginError) && loginError.response) {
          if (loginError.response.status === 400) {
            const errorMsg = loginError.response.data.error;
            if (errorMsg.includes("email")) {
              emailRef.current?.setCustomValidity(errorMsg);
            }
            alert("Registro exitoso, pero ocurrió un error al iniciar sesión automáticamente. Intenta ingresar manualmente: " + errorMsg);
          }
          else {
            alert(
              "Registro exitoso, pero ocurrió un error inesperado al iniciar sesión automáticamente. Intenta ingresar manualmente."
            );
          }
        }
        else {
          alert(
            "Registro exitoso, pero ocurrió un error desconocido al iniciar sesión automáticamente. Intenta ingresar manualmente."
          );
        }
        onLoginClick(); // Redirigir al login
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 400) {
        const errorMsg = error.response.data.error;
        if (errorMsg.includes("email")) {
          emailRef.current?.setCustomValidity(errorMsg);
        }
      }
      else {
        alert(
          "Ocurrió un error inesperado en el registro. Intenta de nuevo o contacta al soporte."
        );
      }
    } finally {
      setLoading(false);
    }
  };
  if (token) {
    return null; // Si ya hay un token, no renderizar el modal de registro
  }

  return (
    <div className={`auth-modal${isOpen ? " auth-modal--open" : ""}`}>
      <div className="auth-modal__content">
        <div className="auth-modal__header">
          <h2>Registrarse</h2>
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
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailRef.current) {
                  emailRef.current.setCustomValidity("");
                }
              }}
              autoComplete="email"
              ref={emailRef}
              required
            />
            <h3>Nombre de Usuario</h3>
            <input
              type="text"
              placeholder="Nombre de Usuario"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (usernameRef.current) {
                  usernameRef.current.setCustomValidity("");
                }
              }}
              autoComplete="username"
              ref={usernameRef}
              required
            />
            <h3>Contraseña</h3>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <h3>Confirmar Contraseña</h3>
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (passwordRef.current) {
                  passwordRef.current.setCustomValidity("");
                }
              }}
              autoComplete="new-password"
              ref={passwordRef}
              required
            />
            {loading ? (
              <button type="submit" disabled>
                Registrando...
              </button>
            ) : (
              <button type="submit">Registrarse</button>
            )}
          </form>
        </div>
        <div className="auth-modal__footer">
          <p>¿Ya tienes cuenta?</p>
          <button className="auth-modal__auth" onClick={onLoginClick}>
            Inicia Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
