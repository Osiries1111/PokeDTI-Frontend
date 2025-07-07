import React, { useEffect } from "react";
import "./index.css";
import WelcomeCard from "../../Components/IndexComponents/WelcomeCard/welcome-card.tsx";
import WelcomeGridCards from "../../Components/IndexComponents/GridBox/WelcomeGridCards/welcome-grid-cards.tsx";
import backgroundOras from "../../assets/landing-page/background-oras.png";

import { useLocation, useNavigate } from "react-router-dom";

import { useContext } from "react";
import AuthContext from "../../auth/AuthContext.tsx";

interface IndexProps {
  openRegisterModal: () => void;
}
const Index: React.FC<IndexProps> = ({ openRegisterModal }) => {
  const backgroundStyle = { backgroundImage: `url(${backgroundOras})` };

  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("Index must be used within an AuthProvider");
  }
  const { token } = auth;

  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.state?.showLoginAlert) {
      alert("Por favor, inicia sesión para acceder a esta página.");
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  if (token) {
    return (
    <div className={"index-container"} style={backgroundStyle}>
      <div className={"index-content"}>
        <div className={"welcome-card"}>
          <h1>¡Bienvenido a PokeDTI!</h1>
          <p>Ahora que estas adentro aprovecha de explorar qué salas están disponibles para jugar</p>
          <br />
          <p>Recuerda que si te quedan dudas, siempre puedes revisar la sección de Rules</p>
          <br />
          <p>¡Se el mejor Maestro Pokémon!</p>
        </div>
        <WelcomeGridCards />
      </div>
    </div>
    );
  }

  return (
    <div className={"index-container"} style={backgroundStyle}>
      <div className={"index-content"}>
        <WelcomeCard openRegisterModal={openRegisterModal} />
        <WelcomeGridCards />
      </div>
    </div>
  );
};

export default Index;
